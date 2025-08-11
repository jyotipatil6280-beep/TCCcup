"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Plus,
  Play,
  CheckCircle,
  Users,
  Target,
  Map,
  LogOut,
  Shield,
  ArrowLeft,
  Trash2,
  Activity,
  BarChart3,
  Clock,
} from "lucide-react"
import { supabase } from "../../lib/supabase"

interface Team {
  id: number
  team_name: string
  team_logo_url?: string
  players: {
    id: number
    player_name: string
    player_order: number
  }[]
}

interface Match {
  id: number
  match_number: number
  map_name: string
  status: "scheduled" | "ongoing" | "completed"
  created_at: string
  teams?: Team[]
  results?: MatchResult[]
}

interface MatchResult {
  team_id: number
  team_name: string
  placement: number
  total_kills: number
  points: number
  player_kills: { player_id: number; player_name: string; kills: number }[]
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("matches")
  const [currentView, setCurrentView] = useState<"main" | "points">("main")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  // New match form
  const [newMatch, setNewMatch] = useState({
    match_number: "",
    map_name: "",
    selected_teams: [] as number[],
  })

  // Points management
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("admin_authenticated") === "true"
    if (!isAuth) {
      window.location.href = "/admin/login"
      return
    }
    setAuthenticated(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch approved teams with players
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select(`
        id,
        team_name,
        team_logo_url,
        players (
          id,
          player_name,
          player_order
        )
      `)
        .eq("status", "approved")
        .order("team_name")

      if (teamsError) {
        console.error("Error fetching teams:", teamsError)
      } else {
        setTeams(teamsData || [])
      }

      // Fetch matches
      await fetchMatches()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMatches = async () => {
    try {
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .order("match_number")

      if (matchesError) {
        console.error("Error fetching matches:", matchesError)
        return
      }

      // For each match, fetch associated teams
      const matchesWithTeams = await Promise.all(
        (matchesData || []).map(async (match) => {
          const { data: matchTeams, error: teamsError } = await supabase
            .from("match_teams")
            .select(`
            team_id,
            teams (
              id,
              team_name,
              team_logo_url,
              players (
                id,
                player_name,
                player_order
              )
            )
          `)
            .eq("match_id", match.id)

          if (teamsError) {
            console.error("Error fetching match teams:", teamsError)
            return { ...match, teams: [] }
          }

          const teams = matchTeams?.map((mt: any) => mt.teams).filter(Boolean) || []
          return { ...match, teams }
        }),
      )

      setMatches(matchesWithTeams)
    } catch (error) {
      console.error("Error fetching matches:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    window.location.href = "/admin/login"
  }

  const createMatch = async () => {
    if (!newMatch.match_number || !newMatch.map_name || newMatch.selected_teams.length === 0) {
      alert("Please fill all fields and select teams")
      return
    }

    try {
      // Insert match
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .insert({
          match_number: Number.parseInt(newMatch.match_number),
          map_name: newMatch.map_name,
          status: "scheduled",
        })
        .select()
        .single()

      if (matchError) {
        console.error("Error creating match:", matchError)
        alert("Failed to create match")
        return
      }

      // Insert match teams
      const matchTeamsData = newMatch.selected_teams.map((teamId) => ({
        match_id: matchData.id,
        team_id: teamId,
      }))

      const { error: teamsError } = await supabase.from("match_teams").insert(matchTeamsData)

      if (teamsError) {
        console.error("Error adding teams to match:", teamsError)
        alert("Failed to add teams to match")
        return
      }

      setNewMatch({ match_number: "", map_name: "", selected_teams: [] })
      await fetchMatches()
      alert("Match created successfully!")
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred")
    }
  }

  const updateMatchStatus = async (matchId: number, status: "scheduled" | "ongoing" | "completed") => {
    try {
      const { error } = await supabase.from("matches").update({ status }).eq("id", matchId)

      if (error) {
        console.error("Error updating match status:", error)
        alert("Failed to update match status")
        return
      }

      await fetchMatches()
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred")
    }
  }

  const deleteMatch = async (matchId: number) => {
    if (!confirm("Are you sure you want to delete this match? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("matches").delete().eq("id", matchId)

      if (error) {
        console.error("Error deleting match:", error)
        alert("Failed to delete match")
        return
      }

      await fetchMatches()
      alert("Match deleted successfully!")
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred")
    }
  }

  const openPointsManagement = async (match: Match) => {
    setSelectedMatch(match)

    // Fetch existing results if any
    const { data: existingResults, error } = await supabase.from("match_results").select("*").eq("match_id", match.id)

    if (error) {
      console.error("Error fetching existing results:", error)
    }

    // Initialize results for teams in this match
    const initialResults = (match.teams || []).map((team) => {
      const existingResult = existingResults?.find((r) => r.team_id === team.id)
      return {
        team_id: team.id,
        team_name: team.team_name,
        placement: existingResult?.placement || 0,
        total_kills: existingResult?.total_kills || 0,
        points: existingResult?.points || 0,
        player_kills:
          team.players?.map((p) => ({
            player_id: p.id,
            player_name: p.player_name,
            kills: 0, // Will fetch from player_match_kills
          })) || [],
      }
    })

    // Fetch individual player kills
    for (const result of initialResults) {
      const { data: playerKills, error: killsError } = await supabase
        .from("player_match_kills")
        .select("player_id, kills")
        .eq("match_id", match.id)
        .eq("team_id", result.team_id)

      if (!killsError && playerKills) {
        result.player_kills = result.player_kills.map((pk) => {
          const existingKills = playerKills.find((k) => k.player_id === pk.player_id)
          return { ...pk, kills: existingKills?.kills || 0 }
        })
        result.total_kills = result.player_kills.reduce((sum, pk) => sum + pk.kills, 0)
      }
    }

    setMatchResults(initialResults)
    setCurrentView("points")
  }

  const updateTeamResult = (teamId: number, field: string, value: any) => {
    setMatchResults(matchResults.map((result) => (result.team_id === teamId ? { ...result, [field]: value } : result)))
  }

  const updatePlayerKills = (teamId: number, playerId: number, kills: number) => {
    setMatchResults(
      matchResults.map((result) =>
        result.team_id === teamId
          ? {
              ...result,
              player_kills: result.player_kills.map((pk) => (pk.player_id === playerId ? { ...pk, kills } : pk)),
              total_kills: result.player_kills.reduce(
                (sum, pk) => sum + (pk.player_id === playerId ? kills : pk.kills),
                0,
              ),
            }
          : result,
      ),
    )
  }

  const calculatePoints = (placement: number, kills: number) => {
    const placementPoints = [10, 6, 5, 4, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0][placement - 1] || 0
    return placementPoints + kills
  }

  const saveMatchResults = async () => {
    if (!selectedMatch) return

    try {
      // Calculate points for each team
      const updatedResults = matchResults.map((result) => ({
        ...result,
        points: calculatePoints(result.placement, result.total_kills),
      }))

      // Save match results
      for (const result of updatedResults) {
        const { error: resultError } = await supabase.from("match_results").upsert({
          match_id: selectedMatch.id,
          team_id: result.team_id,
          placement: result.placement,
          total_kills: result.total_kills,
          points: result.points,
        })

        if (resultError) {
          console.error("Error saving match result:", resultError)
          continue
        }

        // Save individual player kills
        for (const pk of result.player_kills) {
          const { error: killsError } = await supabase.from("player_match_kills").upsert({
            match_id: selectedMatch.id,
            team_id: result.team_id,
            player_id: pk.player_id,
            kills: pk.kills,
          })

          if (killsError) {
            console.error("Error saving player kills:", killsError)
          }
        }
      }

      // Update match status to completed
      await updateMatchStatus(selectedMatch.id, "completed")

      setCurrentView("main")
      setSelectedMatch(null)
      alert("Match results saved successfully! Stats will be updated immediately.")

      // Force refresh the stats page data by triggering a custom event
      window.dispatchEvent(new CustomEvent("statsUpdate"))
    } catch (error) {
      console.error("Error saving results:", error)
      alert("An error occurred while saving results")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900/50 text-green-300"
      case "ongoing":
        return "bg-blue-900/50 text-blue-300"
      case "scheduled":
        return "bg-yellow-900/50 text-yellow-300"
      default:
        return "bg-gray-700/50 text-gray-400"
    }
  }

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-800 flex items-center justify-center">
        <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Admin Panel</h3>
          <p className="text-gray-400">Authenticating and fetching data...</p>
        </Card>
      </div>
    )
  }

  // Points Management View
  if (currentView === "points" && selectedMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/95 to-teal-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button onClick={() => setCurrentView("main")} variant="ghost" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Matches
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Match {selectedMatch.match_number} - Points Management
                  </h1>
                  <p className="text-gray-400 text-sm">{selectedMatch.map_name}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-900/20 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {matchResults.map((result) => (
              <Card
                key={result.team_id}
                className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    {result.team_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Placement</Label>
                      <Select
                        value={result.placement.toString()}
                        onValueChange={(value) => updateTeamResult(result.team_id, "placement", Number.parseInt(value))}
                      >
                        <SelectTrigger className="bg-blue-900/50 border-gray-600 text-white rounded-xl">
                          <SelectValue placeholder="Select placement" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 20 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              #{i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Total Kills</Label>
                      <Input
                        type="number"
                        value={result.total_kills}
                        className="bg-blue-900/50 border-gray-600 text-white rounded-xl"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Points</Label>
                      <Input
                        type="number"
                        value={calculatePoints(result.placement, result.total_kills)}
                        className="bg-green-900/50 border-green-600 text-green-300 font-bold rounded-xl"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-3 block">Individual Player Kills</Label>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {result.player_kills.map((pk) => (
                        <div key={pk.player_id} className="space-y-2">
                          <Label className="text-gray-400 text-sm">{pk.player_name}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={pk.kills}
                            onChange={(e) =>
                              updatePlayerKills(result.team_id, pk.player_id, Number.parseInt(e.target.value) || 0)
                            }
                            className="bg-blue-900/50 border-gray-600 text-white rounded-xl"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setCurrentView("main")}
                variant="outline"
                className="border-gray-600 text-gray-300 bg-transparent rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={saveMatchResults}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Match & Save Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Admin Panel View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-800">
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TCC Admin Dashboard</h1>
                <p className="text-gray-300">Tournament Management & Control Center</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-white/10 backdrop-blur-md border border-red-500/30 text-red-300 hover:bg-red-500/20 rounded-2xl px-6 py-3 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{teams.length}</h3>
              <p className="text-gray-300 font-medium">Approved Teams</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{matches.length}</h3>
              <p className="text-gray-300 font-medium">Total Matches</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {matches.filter((m) => m.status === "ongoing").length}
              </h3>
              <p className="text-gray-300 font-medium">Live Matches</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {matches.filter((m) => m.status === "completed").length}
              </h3>
              <p className="text-gray-300 font-medium">Completed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-md rounded-3xl p-2 border border-white/10">
            <TabsTrigger
              value="matches"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-purple-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-2xl py-3 px-6 font-medium transition-all duration-300"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Match Management
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:via-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-2xl py-3 px-6 font-medium transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Match
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 p-6">
                <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  Tournament Matches
                </CardTitle>
                <p className="text-gray-300 mt-2">Manage and monitor all tournament matches</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {matches.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">No Matches Created</h3>
                      <p className="text-gray-400 text-lg">Create your first tournament match to get started</p>
                    </div>
                  ) : (
                    matches.map((match) => (
                      <Card
                        key={match.id}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 shadow-lg"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">{match.match_number}</span>
                              </div>
                              <div>
                                <h3 className="text-white font-bold text-xl">Match {match.match_number}</h3>
                                <div className="flex items-center gap-6 mt-2">
                                  <div className="flex items-center gap-2">
                                    <Map className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300 font-medium">{match.map_name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300 font-medium">{match.teams?.length || 0} teams</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    <span className="text-gray-300 font-medium">
                                      {new Date(match.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={`px-4 py-2 rounded-xl font-bold ${getStatusColor(match.status)}`}>
                                {match.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {match.status === "scheduled" && (
                              <Button
                                onClick={() => updateMatchStatus(match.id, "ongoing")}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl px-6 py-3 font-medium transition-all duration-300 transform hover:scale-105"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Start Match
                              </Button>
                            )}

                            {(match.status === "scheduled" || match.status === "completed") && (
                              <Button
                                onClick={() => deleteMatch(match.id)}
                                className="bg-white/10 backdrop-blur-md border border-red-500/30 text-red-300 hover:bg-red-500/20 rounded-2xl px-6 py-3 font-medium transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            )}

                            {match.status === "ongoing" && (
                              <Button
                                onClick={() => openPointsManagement(match)}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl px-6 py-3 font-medium transition-all duration-300 transform hover:scale-105"
                              >
                                <Target className="w-4 h-4 mr-2" />
                                Manage Points
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 p-6">
                <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  Create New Match
                </CardTitle>
                <p className="text-gray-300 mt-2">Set up a new tournament match with teams and configuration</p>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Label className="text-gray-300 mb-3 block font-medium text-lg">Match Number</Label>
                    <Input
                      type="number"
                      value={newMatch.match_number}
                      onChange={(e) => setNewMatch({ ...newMatch, match_number: e.target.value })}
                      placeholder="Enter match number"
                      className="bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 rounded-2xl py-3 px-4 text-lg focus:border-blue-400/50 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-3 block font-medium text-lg">Map Selection</Label>
                    <Select
                      value={newMatch.map_name}
                      onValueChange={(value) => setNewMatch({ ...newMatch, map_name: value })}
                    >
                      <SelectTrigger className="bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl py-3 px-4 text-lg">
                        <SelectValue placeholder="Select tournament map" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RONDO">RONDO</SelectItem>
                        <SelectItem value="Erangel">Erangel</SelectItem>
                        <SelectItem value="Miramar">Miramar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-4 block font-medium text-lg">Select Participating Teams</Label>
                  {teams.length === 0 ? (
                    <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">No Teams Available</h3>
                      <p className="text-gray-400">No approved teams found for tournament participation</p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
                        {teams.map((team) => (
                          <Card
                            key={team.id}
                            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                              newMatch.selected_teams.includes(team.id)
                                ? "bg-gradient-to-r from-blue-500/20 to-teal-500/20 border border-blue-400/50 shadow-lg"
                                : "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10"
                            } rounded-2xl`}
                            onClick={() => {
                              const isSelected = newMatch.selected_teams.includes(team.id)
                              setNewMatch({
                                ...newMatch,
                                selected_teams: isSelected
                                  ? newMatch.selected_teams.filter((id) => id !== team.id)
                                  : [...newMatch.selected_teams, team.id],
                              })
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                {team.team_logo_url ? (
                                  <img
                                    src={team.team_logo_url || "/placeholder.svg"}
                                    alt="Team logo"
                                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-white" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <span className="font-bold text-white block">{team.team_name}</span>
                                  <span className="text-sm text-gray-400">{team.players.length} players</span>
                                </div>
                                {newMatch.selected_teams.includes(team.id) && (
                                  <CheckCircle className="w-5 h-5 text-blue-400" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <p className="text-gray-300 font-medium">
                          Selected Teams:{" "}
                          <span className="text-blue-400 font-bold">{newMatch.selected_teams.length}</span> /{" "}
                          {teams.length}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={createMatch}
                  disabled={teams.length === 0}
                  className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Create Tournament Match
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

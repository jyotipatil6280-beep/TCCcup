"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Plus, Play, Pause, CheckCircle, Users, Target, Map, LogOut, Shield, Trash2, Edit } from "lucide-react"
import { supabase } from "../../lib/supabase"

export default function AdminDashboard() {
  const [teams, setTeams] = useState([])
  const [matches, setMatches] = useState([])
  const [newMatch, setNewMatch] = useState({ match_number: "", map_name: "" })
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [showPointsManagement, setShowPointsManagement] = useState(false)
  const [matchResults, setMatchResults] = useState([])
  const [playerSearchQuery, setPlayerSearchQuery] = useState("")

  const createMatch = async () => {
    // Create match logic here
  }

  useEffect(() => {
    fetchTeams()
    fetchMatches()
  }, [])

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("*")
    setTeams(data || [])
  }

  const fetchMatches = async () => {
    const { data } = await supabase.from("matches").select("*")
    setMatches(data || [])
  }

  const handleLogout = () => {
    // Logout logic here
  }

  const updateMatchStatus = async (matchId, status) => {
    await supabase.from("matches").update({ status }).eq("id", matchId)
    fetchMatches()
  }

  const deleteMatch = async (matchId) => {
    await supabase.from("matches").delete().eq("id", matchId)
    fetchMatches()
  }

  const openPointsManagement = async (match) => {
    setSelectedMatch(match)
    setShowPointsManagement(true)
    await fetchMatchResults(match.id)
  }

  const editCompletedMatch = async (match) => {
    setSelectedMatch(match)
    setShowPointsManagement(true)
    await fetchMatchResults(match.id)
  }

  const fetchMatchResults = async (matchId) => {
    const { data: results } = await supabase
      .from("match_results")
      .select(`
        *,
        teams (
          id,
          team_name,
          team_logo_url,
          players:team_players (
            player_name
          )
        )
      `)
      .eq("match_id", matchId)

    if (results && results.length > 0) {
      setMatchResults(results)
    } else {
      // Create initial results for all teams
      const { data: allTeams } = await supabase
        .from("teams")
        .select(`
          id,
          team_name,
          team_logo_url,
          players:team_players (
            player_name
          )
        `)
        .eq("status", "approved")

      const initialResults =
        allTeams?.map((team) => ({
          team_id: team.id,
          match_id: matchId,
          placement: null,
          kills: 0,
          points: 0,
          teams: team,
        })) || []

      setMatchResults(initialResults)
    }
  }

  const saveIndividualResult = async (teamId) => {
    const result = matchResults.find((r) => r.team_id === teamId)
    if (!result) return

    const { error } = await supabase.from("match_results").upsert({
      team_id: teamId,
      match_id: selectedMatch.id,
      placement: result.placement,
      kills: result.kills || 0,
      points: result.points || 0,
    })

    if (!error) {
      alert("Result saved successfully!")
    }
  }

  const updateResult = (teamId, field, value) => {
    setMatchResults((prev) =>
      prev.map((result) => (result.team_id === teamId ? { ...result, [field]: value } : result)),
    )
  }

  const getAvailableRanks = (currentTeamId) => {
    const assignedRanks = matchResults.filter((r) => r.team_id !== currentTeamId && r.placement).map((r) => r.placement)

    return Array.from({ length: 20 }, (_, i) => i + 1).filter((rank) => !assignedRanks.includes(rank))
  }

  const filteredResults = matchResults.filter((result) => {
    if (!playerSearchQuery) return true
    return result.teams?.players?.some((player) =>
      player.player_name.toLowerCase().includes(playerSearchQuery.toLowerCase()),
    )
  })

  if (showPointsManagement && selectedMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-800">
        <div className="bg-gradient-to-r from-blue-900/95 to-teal-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowPointsManagement(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  ← Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Match {selectedMatch.match_number} - Points Management
                  </h1>
                  <p className="text-gray-400 text-sm">{selectedMatch.map_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-white">Team Results</CardTitle>
              <div className="mt-4">
                <Input
                  placeholder="Search by player name..."
                  value={playerSearchQuery}
                  onChange={(e) => setPlayerSearchQuery(e.target.value)}
                  className="bg-blue-900/50 border-gray-600 text-white placeholder-gray-400 rounded-xl max-w-md"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredResults.map((result) => (
                  <Card key={result.team_id} className="bg-blue-800/30 border-cyan-500/20 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {result.teams?.team_name?.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{result.teams?.team_name}</h3>
                            <p className="text-gray-400 text-sm">
                              Players: {result.teams?.players?.map((p) => p.player_name).join(", ")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <Label className="text-gray-300 text-sm">Placement</Label>
                            <Select
                              value={result.placement?.toString() || ""}
                              onValueChange={(value) =>
                                updateResult(result.team_id, "placement", Number.parseInt(value))
                              }
                            >
                              <SelectTrigger className="w-24 bg-blue-900/50 border-gray-600 text-white rounded-xl">
                                <SelectValue placeholder="Rank" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableRanks(result.team_id).map((rank) => (
                                  <SelectItem key={rank} value={rank.toString()}>
                                    #{rank}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-gray-300 text-sm">Kills</Label>
                            <Input
                              type="number"
                              value={result.kills || 0}
                              onChange={(e) =>
                                updateResult(result.team_id, "kills", Number.parseInt(e.target.value) || 0)
                              }
                              className="w-20 bg-blue-900/50 border-gray-600 text-white rounded-xl"
                            />
                          </div>

                          <Button
                            onClick={() => saveIndividualResult(result.team_id)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/95 to-teal-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TCC Admin Panel</h1>
                <p className="text-gray-400 text-sm">Tournament Management System</p>
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
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-800/50 to-teal-800/50 border border-cyan-500/30 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{teams.length}</h3>
              <p className="text-gray-300 text-sm">Approved Teams</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 border border-green-500/30 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{matches.length}</h3>
              <p className="text-gray-300 text-sm">Total Matches</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 border border-blue-500/30 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Play className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{matches.filter((m) => m.status === "ongoing").length}</h3>
              <p className="text-gray-300 text-sm">Ongoing</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-800/50 to-teal-800/50 border border-green-500/30 rounded-2xl">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">
                {matches.filter((m) => m.status === "completed").length}
              </h3>
              <p className="text-gray-300 text-sm">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Match Management Tab */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white">Tournament Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No matches created yet. Create your first match!</p>
                    </div>
                  ) : (
                    matches.map((match) => (
                      <div key={match.id} className="p-6 bg-blue-800/30 rounded-2xl border border-cyan-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{match.match_number}</span>
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg">Match {match.match_number}</h3>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1">
                                  <Map className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-300">{match.map_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-300">{match.teams?.length || 0} teams</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {match.status === "scheduled" && (
                              <>
                                <Button
                                  onClick={() => updateMatchStatus(match.id, "ongoing")}
                                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Match
                                </Button>
                              </>
                            )}

                            {/* Always show delete button for scheduled and completed matches */}
                            {(match.status === "scheduled" || match.status === "completed") && (
                              <Button
                                onClick={() => deleteMatch(match.id)}
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-900/20 bg-transparent rounded-xl"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            )}

                            {match.status === "ongoing" && (
                              <>
                                <Button
                                  onClick={() => openPointsManagement(match)}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
                                >
                                  <Target className="w-4 h-4 mr-2" />
                                  Manage Points
                                </Button>

                                <Button
                                  onClick={() => updateMatchStatus(match.id, "scheduled")}
                                  variant="outline"
                                  size="sm"
                                  className="bg-yellow-900/50 border-yellow-600 text-yellow-300 hover:bg-yellow-800/50 rounded-xl"
                                >
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </Button>
                              </>
                            )}

                            {match.status === "completed" && (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                  <span className="text-green-300 font-semibold">Match Completed</span>
                                </div>
                                <Button
                                  onClick={() => editCompletedMatch(match)}
                                  variant="outline"
                                  size="sm"
                                  className="bg-yellow-900/50 border-yellow-600 text-yellow-300 hover:bg-yellow-800/50 rounded-xl"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Results
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create Match Tab */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white">Create New Match</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Match Number</Label>
                    <Input
                      type="number"
                      value={newMatch.match_number}
                      onChange={(e) => setNewMatch({ ...newMatch, match_number: e.target.value })}
                      placeholder="Enter match number"
                      className="bg-blue-900/50 border-gray-600 text-white placeholder-gray-400 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Map</Label>
                    <Select
                      value={newMatch.map_name}
                      onValueChange={(value) => setNewMatch({ ...newMatch, map_name: value })}
                    >
                      <SelectTrigger className="bg-blue-900/50 border-gray-600 text-white rounded-xl">
                        <SelectValue placeholder="Select map" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RONDO">RONDO</SelectItem>
                        <SelectItem value="Erangel">Erangel</SelectItem>
                        <SelectItem value="Miramar">Miramar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-blue-800/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">All Teams Participate</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {teams.length > 0
                      ? `${teams.length} approved teams will be automatically included in this match`
                      : "No approved teams available"}
                  </p>
                </div>

                <Button
                  onClick={createMatch}
                  disabled={teams.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Match
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

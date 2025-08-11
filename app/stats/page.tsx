"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Target, Crown, Zap, Users, TrendingUp, AlertCircle, Calendar, User, ListOrdered } from "lucide-react"
import PageLayout from "../../components/page-layout"
import { supabase } from "../../lib/supabase"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface TeamStats {
  team_id: number
  team_name: string
  team_logo_url?: string
  total_points: number
  total_matches: number
  total_kills: number
  wwcd_count: number
  avg_placement: number
  best_placement: number
}

interface PlayerStats {
  player_id: number
  player_name: string
  team_name: string
  total_kills: number
  matches_played: number
  avg_kills: number
  team_id: number // Added team_id to playerStats for easier grouping
}

interface MatchDetail {
  id: number
  match_number: number
  map_name: string
  teams: {
    team_name: string
    placement: number
    kills: number
    points: number
  }[]
}

const MAP_IMAGES: { [key: string]: string } = {
  Sanhok: "/images/sanhok.webp",
  Erangel: "/images/erangel.webp",
  Miramar: "/images/miramar.webp",
}

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState("overall")
  const [teamStats, setTeamStats] = useState<TeamStats[]>([])
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([])
  const [allPlayerStats, setAllPlayerStats] = useState<PlayerStats[]>([])
  const [allMatches, setAllMatches] = useState<MatchDetail[]>([]) // Stores all completed matches for dropdown
  const [selectedMatchIdForStandings, setSelectedMatchIdForStandings] = useState<string | null>(null) // Stores selected match ID
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    const handleStatsUpdate = () => {
      fetchStats()
    }
    window.addEventListener("statsUpdate", handleStatsUpdate)
    return () => {
      window.removeEventListener("statsUpdate", handleStatsUpdate)
    }
  }, [])

  const fetchStats = async () => {
    try {
      setError(null)
      await Promise.all([fetchTeamStats(), fetchPlayerStats(), fetchAllMatchDetails()])
    } catch (error) {
      console.error("Error fetching stats:", error)
      setError("Failed to load tournament statistics. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchTeamStats = async () => {
    try {
      // Get all match results
      const { data: allResults, error: allResultsError } = await supabase.from("match_results").select(`
        team_id,
        placement,
        total_kills,
        points
      `)

      if (allResultsError) {
        console.log("Match results not available yet:", allResultsError.message)
        return
      }

      if (!allResults || allResults.length === 0) {
        console.log("No match results available yet")
        return
      }

      // Get all teams separately
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select(`
        id,
        team_name,
        team_logo_url
      `)
        .eq("status", "approved")

      if (teamsError) {
        console.error("Error fetching teams:", teamsError)
        return
      }

      // Create a lookup object for team data
      const teamsLookup: { [key: number]: any } = {}
      teamsData?.forEach((team) => {
        teamsLookup[team.id] = team
      })

      // Process team statistics
      const teamStatsLookup: { [key: number]: TeamStats } = {}

      allResults?.forEach((result: any) => {
        const teamId = result.team_id
        const teamInfo = teamsLookup[teamId]

        if (!teamInfo) return // Skip if team not found

        const existing = teamStatsLookup[teamId]

        if (existing) {
          existing.total_points += result.points
          existing.total_matches += 1
          existing.total_kills += result.total_kills
          existing.wwcd_count += result.placement === 1 ? 1 : 0
          existing.best_placement = Math.min(existing.best_placement, result.placement)
          existing.avg_placement += result.placement
        } else {
          teamStatsLookup[teamId] = {
            team_id: teamId,
            team_name: teamInfo.team_name,
            team_logo_url: teamInfo.team_logo_url,
            total_points: result.points,
            total_matches: 1,
            total_kills: result.total_kills,
            wwcd_count: result.placement === 1 ? 1 : 0,
            avg_placement: result.placement,
            best_placement: result.placement,
          }
        }
      })

      // Calculate average placement and sort by points
      const finalStats = Object.values(teamStatsLookup)
        .map((team) => ({
          ...team,
          avg_placement: team.total_matches > 0 ? team.avg_placement / team.total_matches : 0,
        }))
        .sort((a, b) => b.total_points - a.total_points)

      setTeamStats(finalStats)
    } catch (error) {
      console.error("Error processing team stats:", error)
    }
  }

  const fetchPlayerStats = async () => {
    try {
      // Get all player kills data
      const { data: allPlayerKills, error: allKillsError } = await supabase.from("player_match_kills").select(`
        player_id,
        kills
      `)

      if (allKillsError) {
        console.log("Player match kills not available yet:", allKillsError.message)
        return
      }

      // Corrected check: only check allPlayerKills for data presence
      if (!allPlayerKills || allPlayerKills.length === 0) {
        console.log("No player kill data available yet")
        return
      }

      // Get all players with team information separately
      const { data: playersData, error: playersError } = await supabase.from("players").select(`
        id,
        player_name,
        team_id,
        teams (
          team_name
        )
      `)

      if (playersError) {
        console.error("Error fetching players:", playersError)
        return
      }

      // Create a lookup object for player data
      const playersLookup: { [key: number]: any } = {}
      playersData?.forEach((player) => {
        playersLookup[player.id] = player
      })

      // Process player statistics
      const playerStatsLookup: { [key: number]: PlayerStats } = {}

      allPlayerKills?.forEach((kill: any) => {
        const playerId = kill.player_id
        const playerInfo = playersLookup[playerId]

        if (!playerInfo) return // Skip if player not found

        const existing = playerStatsLookup[playerId]

        if (existing) {
          existing.total_kills += kill.kills
          existing.matches_played += 1
        } else {
          playerStatsLookup[playerId] = {
            player_id: playerId,
            player_name: playerInfo.player_name,
            team_name: playerInfo.teams?.team_name || "Unknown Team",
            team_id: playerInfo.team_id, // Include team_id
            total_kills: kill.kills,
            matches_played: 1,
            avg_kills: 0,
          }
        }
      })

      const completePlayerStats = Object.values(playerStatsLookup)
        .map((player) => ({
          ...player,
          avg_kills: player.matches_played > 0 ? player.total_kills / player.matches_played : 0,
        }))
        .sort((a, b) => b.total_kills - a.total_kills)

      setAllPlayerStats(completePlayerStats)

      setPlayerStats(completePlayerStats.slice(0, 10))
    } catch (error) {
      console.error("Error processing player stats:", error)
    }
  }

  const fetchAllMatchDetails = async () => {
    try {
      // Get all completed matches
      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select(`
          id,
          match_number,
          map_name
        `)
        .eq("status", "completed")
        .order("match_number")

      if (matchesError) {
        console.log("Matches not available yet:", matchesError.message)
        return
      }

      if (!matches || matches.length === 0) {
        console.log("No completed matches available yet")
        return
      }

      // Get all match results
      const { data: matchResults, error: resultsError } = await supabase.from("match_results").select(`
        match_id,
        team_id,
        placement,
        total_kills,
        points
      `)

      if (resultsError) {
        console.error("Error fetching match results:", resultsError)
        return
      }

      // Get all teams
      const { data: teamsData, error: teamsError } = await supabase.from("teams").select(`
        id,
        team_name
      `)

      if (teamsError) {
        console.error("Error fetching teams:", teamsError)
        return
      }

      // Create lookup object for teams
      const teamsLookup: { [key: number]: any } = {}
      teamsData?.forEach((team) => {
        teamsLookup[team.id] = team
      })

      // Process match-wise statistics
      const allMatchDetails = matches.map((match) => {
        const matchTeams =
          matchResults
            ?.filter((result) => result.match_id === match.id)
            .map((result) => {
              const team = teamsLookup[result.team_id]
              return {
                team_name: team?.team_name || "Unknown Team",
                placement: result.placement,
                kills: result.total_kills,
                points: result.points,
              }
            })
            .sort((a, b) => a.placement - b.placement) || []

        return {
          id: match.id,
          match_number: match.match_number,
          map_name: match.map_name,
          teams: matchTeams,
        }
      })

      setAllMatches(allMatchDetails)
      if (allMatchDetails.length > 0 && !selectedMatchIdForStandings) {
        setSelectedMatchIdForStandings(allMatchDetails[0].id.toString()) // Select the first match by default
      }
    } catch (error) {
      console.error("Error processing match details:", error)
    }
  }

  const tabs = [
    { id: "overall", label: "Overall Standings", icon: Trophy },
    { id: "match-wise", label: "Match Wise Standings", icon: ListOrdered }, // New tab
    { id: "kills", label: "Top Fraggers", icon: Target },
    { id: "team-players", label: "Team Player Stats", icon: Users },
  ]

  const selectedMatch = allMatches.find((match) => match.id.toString() === selectedMatchIdForStandings)

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-white">Loading tournament statistics...</div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Stats</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button onClick={fetchStats} className="bg-gradient-to-r from-cyan-500 to-green-500 text-white">
              Try Again
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Tournament Stats
          </h1>
          <p className="text-gray-300 text-lg">Live statistics and leaderboards</p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-green-900/50 text-green-300 px-4 py-2 rounded-full">
              <Users className="w-4 h-4 mr-1" />
              {teamStats.length > 0 ? `${teamStats.length} Teams Competing` : "Tournament Setup"}
            </Badge>
            <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4 mr-1" />
              {teamStats.length > 0 ? "Live Updates" : "Awaiting Matches"}
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white border-none"
                    : "bg-transparent border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Overall Standings */}
          {activeTab === "overall" && (
            <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-cyan-400" />
                  Overall Tournament Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teamStats.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Tournament Starting Soon</h3>
                    <p className="text-gray-400">Match results will appear here once matches begin</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-3 px-4 text-gray-300 font-semibold">Rank</th>
                          <th className="text-left py-3 px-4 text-gray-300 font-semibold">Team</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold">Points</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold">Matches</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold">Kills</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold">WWCD</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold">Avg Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamStats.map((team, index) => (
                          <tr
                            key={team.team_id}
                            className="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {index < 3 && (
                                  <Crown
                                    className={`w-4 h-4 ${
                                      index === 0
                                        ? "text-yellow-400"
                                        : index === 1
                                          ? "text-gray-400"
                                          : "text-orange-400"
                                    }`}
                                  />
                                )}
                                <span className="text-white font-semibold">#{index + 1}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {team.team_logo_url ? (
                                  <img
                                    src={team.team_logo_url || "/placeholder.svg"}
                                    alt="Team logo"
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-green-500 rounded-full flex items-center justify-center">
                                    <Trophy className="w-4 h-4 text-white" />
                                  </div>
                                )}
                                <span className="text-white font-medium">{team.team_name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-cyan-400 font-bold text-lg">{team.total_points}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-gray-300">{team.total_matches}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-green-400 font-semibold">{team.total_kills}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Badge
                                variant="secondary"
                                className={`${
                                  team.wwcd_count > 0
                                    ? "bg-yellow-900/50 text-yellow-300"
                                    : "bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                {team.wwcd_count}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-blue-400 font-semibold">{team.avg_placement.toFixed(1)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Match Wise Standings */}
          {activeTab === "match-wise" && (
            <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <ListOrdered className="w-6 h-6 text-blue-400" />
                  Match Wise Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Match Results Coming Soon</h3>
                    <p className="text-gray-400">Individual match results will be displayed here after completion</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <Label htmlFor="select-match" className="text-white text-lg font-semibold shrink-0">
                        Select Match:
                      </Label>
                      <Select value={selectedMatchIdForStandings || ""} onValueChange={setSelectedMatchIdForStandings}>
                        <SelectTrigger
                          id="select-match"
                          className="bg-blue-900/50 border-gray-600 text-white rounded-xl"
                        >
                          <SelectValue placeholder="Choose a match" />
                        </SelectTrigger>
                        <SelectContent>
                          {allMatches.map((match) => (
                            <SelectItem key={match.id} value={match.id.toString()}>
                              Match {match.match_number} - {match.map_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedMatch ? (
                      <div className="overflow-x-auto">
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={MAP_IMAGES[selectedMatch.map_name] || "/placeholder.svg"}
                            alt={`${selectedMatch.map_name} map`}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div>
                            <h3 className="text-xl font-bold text-white">Match {selectedMatch.match_number}</h3>
                            <p className="text-gray-300">{selectedMatch.map_name}</p>
                          </div>
                        </div>
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-600">
                              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Rank</th>
                              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Team</th>
                              <th className="text-center py-3 px-4 text-gray-300 font-semibold">Placement</th>
                              <th className="text-center py-3 px-4 text-gray-300 font-semibold">Kills</th>
                              <th className="text-center py-3 px-4 text-gray-300 font-semibold">Points</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedMatch.teams.map((team, index) => (
                              <tr
                                key={team.team_name}
                                className="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                              >
                                <td className="py-4 px-4">
                                  <span className="text-white font-semibold">#{index + 1}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-white font-medium">{team.team_name}</span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <Badge
                                    variant="secondary"
                                    className={`${
                                      team.placement === 1
                                        ? "bg-yellow-900/50 text-yellow-300"
                                        : team.placement <= 3
                                          ? "bg-gray-700/50 text-gray-300"
                                          : "bg-blue-900/50 text-blue-300"
                                    }`}
                                  >
                                    #{team.placement}
                                  </Badge>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <span className="text-red-400 font-semibold">{team.kills}</span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <span className="text-cyan-400 font-bold">{team.points}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ListOrdered className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">Please select a match to view its standings.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Top Fraggers */}
          {activeTab === "kills" && (
            <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-red-400" />
                  Top Fraggers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {playerStats.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Player Stats Coming Soon</h3>
                    <p className="text-gray-400">Individual player statistics will be available after matches begin</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-3 px-4 text-gray-300 font-semibold">Rank</th>
                          <th className="text-left py-3 px-4 text-gray-300 font-semibold">Player</th>
                          <th className="text-left py-3 px-4 text-gray-300 font-semibold">Team</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold">Total Kills</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold">Avg/Match</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerStats.map((player, index) => (
                          <tr
                            key={player.player_id}
                            className="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {index < 3 && (
                                  <Zap
                                    className={`w-4 h-4 ${
                                      index === 0
                                        ? "text-yellow-400"
                                        : index === 1
                                          ? "text-gray-400"
                                          : "text-orange-400"
                                    }`}
                                  />
                                )}
                                <span className="text-white font-semibold">#{index + 1}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-white font-medium">{player.player_name}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-gray-300">{player.team_name}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-red-400 font-bold text-lg">{player.total_kills}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-green-400 font-semibold">{player.avg_kills.toFixed(1)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Team Player Stats */}
          {activeTab === "team-players" && (
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  Team-wise Player Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teamStats.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Team Player Stats Coming Soon</h3>
                    <p className="text-gray-400">Player statistics will be available after matches begin</p>
                  </div>
                ) : (
                  <Accordion
                    type="single"
                    collapsible
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
                  >
                    {teamStats.map((team) => {
                      const teamPlayers = allPlayerStats.filter((player) => player.team_id === team.team_id)
                      return (
                        <AccordionItem key={team.team_id} value={`team-${team.team_id}`} className="border-none">
                          <AccordionTrigger className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              {team.team_logo_url ? (
                                <img
                                  src={team.team_logo_url || "/placeholder.svg"}
                                  alt={`${team.team_name} logo`}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-green-500 rounded-full flex items-center justify-center">
                                  <Trophy className="w-5 h-5 text-white" />
                                </div>
                              )}
                              <span className="text-white font-bold text-lg">{team.team_name}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-4 bg-gray-900/30 rounded-b-xl">
                            {teamPlayers.length === 0 ? (
                              <p className="text-gray-400 text-center py-4">
                                No player stats available for this team yet.
                              </p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b border-gray-600">
                                      <th className="text-left py-2 px-2 text-gray-300 font-semibold">Player</th>
                                      <th className="text-center py-2 px-2 text-gray-300 font-semibold">Kills</th>
                                      <th className="text-center py-2 px-2 text-gray-300 font-semibold">Matches</th>
                                      <th className="text-center py-2 px-2 text-gray-300 font-semibold">Avg Kills</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {teamPlayers.map((player) => (
                                      <tr
                                        key={player.player_id}
                                        className="border-b border-gray-700/50 last:border-b-0"
                                      >
                                        <td className="py-2 px-2">
                                          <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-white text-sm">{player.player_name}</span>
                                          </div>
                                        </td>
                                        <td className="py-2 px-2 text-center">
                                          <span className="text-red-400 font-semibold">{player.total_kills}</span>
                                        </td>
                                        <td className="py-2 px-2 text-center">
                                          <span className="text-gray-300">{player.matches_played}</span>
                                        </td>
                                        <td className="py-2 px-2 text-center">
                                          <span className="text-green-400 font-semibold">
                                            {player.avg_kills.toFixed(1)}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            {teamStats.length > 0
              ? "Statistics update after each match completion"
              : "Tournament infrastructure ready - awaiting first matches"}
          </p>
        </div>
      </div>
    </PageLayout>
  )
}

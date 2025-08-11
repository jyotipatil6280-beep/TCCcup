"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Trophy, CheckCircle, Activity, Star, Calendar, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import PageLayout from "../../components/page-layout"
import { supabase } from "../../lib/supabase"

interface Team {
  id: number
  team_name: string
  team_logo_url?: string
  team_leader_ign: string
  created_at: string
  status: string
  players: {
    player_name: string
    player_order: number
  }[]
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      // Fetch all approved teams (tournament participants)
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select(`
          id,
          team_name,
          team_logo_url,
          team_leader_ign,
          created_at,
          status,
          players (
            player_name,
            player_order
          )
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false })

      if (teamsError) {
        console.error("Error fetching teams:", teamsError)
        return
      }

      setTeams(teamsData || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.team_leader_ign.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading Tournament Teams</h3>
              <p className="text-gray-400">Fetching qualified teams...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent">
              Tournament Teams
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Meet the elite squads competing in the Twitter Community Cup
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Qualified Teams</span>
              </div>
              <div className="text-2xl font-bold text-white">{teams.length}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Total Players</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {teams.reduce((acc, team) => acc + team.players.length, 0)}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Status</span>
              </div>
              <div className="text-lg font-bold text-green-400">ACTIVE</div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search teams or players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 rounded-2xl text-lg focus:border-blue-400/50 transition-all duration-300"
              />
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 px-4 py-2 rounded-xl font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                {filteredTeams.length} Teams Found
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {filteredTeams.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {searchTerm ? "No Teams Found" : "No Teams Qualified"}
                </h3>
                <p className="text-gray-400">
                  {searchTerm ? "Try adjusting your search terms." : "Teams will appear here once qualified."}
                </p>
              </Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeams.map((team, index) => (
                <Card
                  key={team.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden group"
                >
                  <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 p-6 relative">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-xl">
                        <Star className="w-3 h-3 mr-1" />#{index + 1}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      {team.team_logo_url ? (
                        <div className="relative">
                          <img
                            src={team.team_logo_url || "/placeholder.svg"}
                            alt={`${team.team_name} logo`}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                          />
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 to-teal-400/30 rounded-2xl blur-sm -z-10"></div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-white text-xl font-bold mb-1">{team.team_name}</CardTitle>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">Captain: {team.team_leader_ign}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-gray-300 font-bold flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          Squad Roster
                        </h4>
                        <Badge className="bg-white/10 text-gray-300 border border-white/20 px-3 py-1 rounded-xl">
                          {team.players.length} Players
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {team.players
                          .sort((a, b) => a.player_order - b.player_order)
                          .map((player, playerIndex) => (
                            <div
                              key={playerIndex}
                              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white ${
                                  player.player_order === 1
                                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                                    : player.player_order === 2
                                      ? "bg-gradient-to-br from-blue-400 to-blue-500"
                                      : player.player_order === 3
                                        ? "bg-gradient-to-br from-green-400 to-green-500"
                                        : "bg-gradient-to-br from-purple-400 to-purple-500"
                                }`}
                              >
                                {player.player_order}
                              </div>
                              <span className="text-white font-medium flex-1">{player.player_name}</span>
                              {player.player_order === 1 && (
                                <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-1 rounded-lg text-xs">
                                  Leader
                                </Badge>
                              )}
                            </div>
                          ))}
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs">Registered: {new Date(team.created_at).toLocaleDateString()}</span>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-xl">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Qualified
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-teal-900/40 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl max-w-3xl mx-auto overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Tournament Status</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                All {teams.length} teams have been verified and approved for competition. The Twitter Community Cup is
                now live with intense BGMI action!
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Tournament Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

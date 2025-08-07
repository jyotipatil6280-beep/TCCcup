"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Trophy, CheckCircle } from "lucide-react"
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

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Tournament Teams
          </h1>
          <p className="text-gray-300 text-lg">Official competing teams in Twitter Community Cup</p>
        </div>

        {/* Search and Stats */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search teams or players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-900/50 border-gray-600 text-white placeholder-gray-400 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-900/50 text-green-300 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 mr-1" />
                {teams.length} Teams Qualified
              </Badge>
              <Badge variant="secondary" className="bg-cyan-900/50 text-cyan-300 px-4 py-2 rounded-full">
                <Trophy className="w-4 h-4 mr-1" />
                Tournament Ready
              </Badge>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-300">Loading tournament teams...</div>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchTerm ? "No teams found matching your search." : "No teams qualified yet."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <Card
                  key={team.id}
                  className="bg-gradient-to-br from-blue-800/70 to-teal-700/70 border hover:shadow-xl transition-all duration-300 hover:border-cyan-400/50 rounded-xl shadow-lg border-transparent"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {team.team_logo_url ? (
                          <img
                            src={team.team_logo_url || "/placeholder.svg"}
                            alt={`${team.team_name} logo`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/50"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-green-500 rounded-full flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-white text-lg">{team.team_name}</CardTitle>
                          <p className="text-cyan-300 text-sm">Leader: {team.team_leader_ign}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-900/50 text-green-300 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Qualified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="text-gray-300 font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Squad Members ({team.players.length})
                      </h4>
                      <div className="space-y-2">
                        {team.players
                          .sort((a, b) => a.player_order - b.player_order)
                          .map((player, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {player.player_order}
                              </div>
                              <span className="text-gray-300 text-sm">{player.player_name}</span>
                            </div>
                          ))}
                      </div>
                      <div className="pt-2 border-t border-transparent">
                        <p className="text-xs text-gray-400">
                          Registered: {new Date(team.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-900/50 to-teal-900/50 rounded-2xl p-6 border border-cyan-500/30 max-w-2xl mx-auto">
            <h3 className="text-white font-semibold mb-2">Tournament Status</h3>
            <p className="text-gray-300 text-sm">
              All teams have been approved and are ready to compete. Tournament matches are now underway!
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

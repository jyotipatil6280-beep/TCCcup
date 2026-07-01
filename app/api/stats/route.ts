import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Fetch team stats
    const { data: allResults, error: allResultsError } = await supabase.from("match_results").select(`
      team_id,
      placement,
      total_kills,
      points,
      match_id,
      matches (
        match_number
      )
    `)

    if (allResultsError) {
      console.log("Match results not available yet:", allResultsError.message)
      return Response.json({ teamStats: [], playerStats: [], allMatches: [] })
    }

    // Fetch teams
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select(`id, team_name, team_logo_url`)
      .eq("status", "approved")

    if (teamsError) {
      console.error("Error fetching teams:", teamsError)
      return Response.json({ error: "Failed to fetch teams" }, { status: 500 })
    }

    // Fetch player kill data
    const { data: playerKillsData, error: killsError } = await supabase
      .from("player_match_kills")
      .select(`match_id, player_id, kills, team_id`)
      .order("match_id")

    if (killsError) {
      console.error("Error fetching player kills:", killsError)
      return Response.json({ error: "Failed to fetch player kills" }, { status: 500 })
    }

    // Fetch players with team info
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
      return Response.json({ error: "Failed to fetch players" }, { status: 500 })
    }

    // Fetch completed matches
    const { data: matches, error: matchesError } = await supabase
      .from("matches")
      .select(`id, match_number, map_name, status`)
      .eq("status", "completed")
      .order("match_number")

    if (matchesError) {
      console.log("Matches not available yet:", matchesError.message)
      return Response.json({ teamStats: [], playerStats: [], allMatches: [] })
    }

    // Create team lookup
    const teamsLookup: { [key: number]: any } = {}
    teamsData?.forEach((team) => {
      teamsLookup[team.id] = team
    })

    // Process team statistics
    const teamStatsLookup: { [key: number]: any } = {}

    allResults?.forEach((result: any) => {
      const teamId = result.team_id
      const teamInfo = teamsLookup[teamId]

      if (!teamInfo) return

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
          position_change: 0,
          previous_position: 0,
        }
      }
    })

    // Finalize team stats
    const teamStats = Object.values(teamStatsLookup)
      .map((team: any) => ({
        ...team,
        avg_placement: team.total_matches > 0 ? team.avg_placement / team.total_matches : 0,
      }))
      .sort((a: any, b: any) => b.total_points - a.total_points)

    // Process player statistics
    const playersLookup: { [key: number]: any } = {}
    playersData?.forEach((player) => {
      playersLookup[player.id] = player
    })

    const playerStatsLookup: { [key: number]: any } = {}

    playersData?.forEach((player) => {
      playerStatsLookup[player.id] = {
        player_id: player.id,
        player_name: player.player_name,
        team_name: player.teams?.team_name || "Unknown Team",
        team_id: player.team_id,
        total_kills: 0,
        matches_played: 0,
        avg_kills: 0,
        matchIds: new Set<number>(),
      }
    })

    const totalCompletedMatches = matches?.length || 0

    playerKillsData?.forEach((killRecord: any) => {
      const playerId = killRecord.player_id
      const kills = killRecord.kills || 0
      const matchId = killRecord.match_id

      const playerInfo = playersLookup[playerId]
      if (playerInfo) {
        const existing = playerStatsLookup[playerId]
        if (existing) {
          existing.total_kills += kills
          existing.matchIds.add(matchId)
        }
      }
    })

    // Finalize player stats
    const playerStats = Object.values(playerStatsLookup)
      .map((player: any) => ({
        player_id: player.player_id,
        player_name: player.player_name,
        team_name: player.team_name,
        team_id: player.team_id,
        total_kills: player.total_kills,
        matches_played: totalCompletedMatches,
        avg_kills: totalCompletedMatches > 0 ? player.total_kills / totalCompletedMatches : 0,
      }))
      .sort((a: any, b: any) => b.total_kills - a.total_kills)

    // Process match details
    const { data: matchResults, error: resultsError } = await supabase.from("match_results").select(`
      match_id,
      team_id,
      placement,
      total_kills,
      points
    `)

    if (resultsError) {
      console.error("Error fetching match results:", resultsError)
      return Response.json({ error: "Failed to fetch match results" }, { status: 500 })
    }

    const allMatchDetails = matches?.map((match: any) => {
      const matchTeams =
        matchResults
          ?.filter((result: any) => result.match_id === match.id)
          .map((result: any) => {
            const team = teamsLookup[result.team_id]
            return {
              team_name: team?.team_name || "Unknown Team",
              placement: result.placement,
              kills: result.total_kills,
              points: result.points,
            }
          })
          .sort((a: any, b: any) => a.placement - b.placement) || []

      return {
        id: match.id,
        match_number: match.match_number,
        map_name: match.map_name,
        teams: matchTeams,
      }
    })

    return Response.json({
      teamStats,
      playerStats,
      allMatches: allMatchDetails || [],
    })
  } catch (error) {
    console.error("Error in stats API:", error)
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

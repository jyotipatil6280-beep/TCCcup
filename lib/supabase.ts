import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Team = {
  id?: number
  team_name: string
  team_logo_url?: string
  team_leader_ign: string
  team_leader_instagram?: string
  team_leader_twitter?: string
  created_at?: string
  status?: string
}

export type Player = {
  id?: number
  team_id?: number
  player_name: string
  instagram_handle?: string
  twitter_handle?: string
  player_order: number
  created_at?: string
}

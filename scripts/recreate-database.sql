-- ============================================
-- TOURNAMENT DATABASE RECREATION SCRIPT
-- This script recreates all tables and policies
-- ============================================

-- ============================================
-- 1. CREATE CORE TABLES (teams and players)
-- ============================================

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  team_name VARCHAR(255) NOT NULL,
  team_logo_url TEXT,
  team_leader_ign VARCHAR(255) NOT NULL,
  team_leader_instagram VARCHAR(255),
  team_leader_twitter VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending'
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  player_name VARCHAR(255) NOT NULL,
  instagram_handle VARCHAR(255),
  twitter_handle VARCHAR(255),
  player_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. CREATE ADMIN TABLES
-- ============================================

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- ============================================
-- 3. CREATE MATCH AND RESULTS TABLES
-- ============================================

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  match_number INTEGER NOT NULL,
  map_name VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  scheduled_time TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  lobby_id VARCHAR(100),
  lobby_password VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create match_teams table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS match_teams (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_id, team_id)
);

-- Create match_results table
CREATE TABLE IF NOT EXISTS match_results (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  placement INTEGER NOT NULL,
  total_kills INTEGER DEFAULT 0,
  kills INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_id, team_id)
);

-- Create player_match_kills table
CREATE TABLE IF NOT EXISTS player_match_kills (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  kills INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

-- ============================================
-- 4. CREATE TOURNAMENT SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tournament_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_match_kills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. DROP EXISTING POLICIES (if any)
-- ============================================

DROP POLICY IF EXISTS "Allow all operations on teams" ON teams;
DROP POLICY IF EXISTS "Allow all operations on players" ON players;
DROP POLICY IF EXISTS "Admin access to admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin access to matches" ON matches;
DROP POLICY IF EXISTS "Admin access to match_results" ON match_results;
DROP POLICY IF EXISTS "Admin access to tournament_settings" ON tournament_settings;
DROP POLICY IF EXISTS "Public read matches" ON matches;
DROP POLICY IF EXISTS "Public read match_results" ON match_results;
DROP POLICY IF EXISTS "Public read tournament_settings" ON tournament_settings;
DROP POLICY IF EXISTS "Public read match_teams" ON match_teams;
DROP POLICY IF EXISTS "Public read player_match_kills" ON player_match_kills;
DROP POLICY IF EXISTS "Admin access matches" ON matches;
DROP POLICY IF EXISTS "Admin access match_teams" ON match_teams;
DROP POLICY IF EXISTS "Admin access match_results" ON match_results;
DROP POLICY IF EXISTS "Admin access player_match_kills" ON player_match_kills;
DROP POLICY IF EXISTS "Admin access to tournament_settings" ON tournament_settings;
DROP POLICY IF EXISTS "Public read tournament_settings" ON tournament_settings;
DROP POLICY IF EXISTS "Anyone can upload team logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view team logos" ON storage.objects;

-- ============================================
-- 7. CREATE NEW RLS POLICIES
-- ============================================

-- Teams policies
CREATE POLICY "Allow all operations on teams" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);

-- Admin users policies
CREATE POLICY "Admin access to admin_users" ON admin_users FOR ALL USING (true);

-- Matches policies
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Admin access matches" ON matches FOR ALL USING (true);

-- Match teams policies
CREATE POLICY "Public read match_teams" ON match_teams FOR SELECT USING (true);
CREATE POLICY "Admin access match_teams" ON match_teams FOR ALL USING (true);

-- Match results policies
CREATE POLICY "Public read match_results" ON match_results FOR SELECT USING (true);
CREATE POLICY "Admin access match_results" ON match_results FOR ALL USING (true);

-- Player match kills policies
CREATE POLICY "Public read player_match_kills" ON player_match_kills FOR SELECT USING (true);
CREATE POLICY "Admin access player_match_kills" ON player_match_kills FOR ALL USING (true);

-- Tournament settings policies
CREATE POLICY "Admin access to tournament_settings" ON tournament_settings FOR ALL USING (true);
CREATE POLICY "Public read tournament_settings" ON tournament_settings FOR SELECT USING (true);

-- ============================================
-- 8. INSERT DEFAULT TOURNAMENT SETTINGS
-- ============================================

INSERT INTO tournament_settings (setting_key, setting_value) VALUES
('registration_open', 'false'),
('tournament_status', 'ongoing'),
('max_teams', '20'),
('current_match', '0')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- DATABASE RECREATION COMPLETE
-- ============================================
-- The database has been successfully recreated with all necessary tables.
-- You can now:
-- 1. Import your team and player data
-- 2. Create matches and add results
-- 3. Begin the tournament

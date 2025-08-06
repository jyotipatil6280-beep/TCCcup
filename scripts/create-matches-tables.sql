-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  match_number INTEGER NOT NULL,
  map_name VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  scheduled_time TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
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

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_match_kills ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Public read matches" ON matches;
DROP POLICY IF EXISTS "Public read match_teams" ON match_teams;
DROP POLICY IF EXISTS "Public read match_results" ON match_results;
DROP POLICY IF EXISTS "Public read player_match_kills" ON player_match_kills;

CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read match_teams" ON match_teams FOR SELECT USING (true);
CREATE POLICY "Public read match_results" ON match_results FOR SELECT USING (true);
CREATE POLICY "Public read player_match_kills" ON player_match_kills FOR SELECT USING (true);

-- Admin policies (replace with proper authentication)
DROP POLICY IF EXISTS "Admin access matches" ON matches;
DROP POLICY IF EXISTS "Admin access match_teams" ON match_teams;
DROP POLICY IF EXISTS "Admin access match_results" ON match_results;
DROP POLICY IF EXISTS "Admin access player_match_kills" ON player_match_kills;

CREATE POLICY "Admin access matches" ON matches FOR ALL USING (true);
CREATE POLICY "Admin access match_teams" ON match_teams FOR ALL USING (true);
CREATE POLICY "Admin access match_results" ON match_results FOR ALL USING (true);
CREATE POLICY "Admin access player_match_kills" ON player_match_kills FOR ALL USING (true);

-- Insert some sample data for testing (optional)
-- You can remove this section if you don't want sample data
INSERT INTO matches (match_number, map_name, status) VALUES
(1, 'Sanhok', 'completed'),
(2, 'Erangel', 'completed'),
(3, 'Miramar', 'ongoing')
ON CONFLICT DO NOTHING;

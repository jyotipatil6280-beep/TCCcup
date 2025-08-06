-- Update matches table structure
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS match_results CASCADE;
DROP TABLE IF EXISTS match_teams CASCADE;

-- Create matches table
CREATE TABLE matches (
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
CREATE TABLE match_teams (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_id, team_id)
);

-- Create match_results table
CREATE TABLE match_results (
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
CREATE TABLE player_match_kills (
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
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read match_teams" ON match_teams FOR SELECT USING (true);
CREATE POLICY "Public read match_results" ON match_results FOR SELECT USING (true);
CREATE POLICY "Public read player_match_kills" ON player_match_kills FOR SELECT USING (true);

-- Admin policies (replace with proper authentication)
CREATE POLICY "Admin access matches" ON matches FOR ALL USING (true);
CREATE POLICY "Admin access match_teams" ON match_teams FOR ALL USING (true);
CREATE POLICY "Admin access match_results" ON match_results FOR ALL USING (true);
CREATE POLICY "Admin access player_match_kills" ON player_match_kills FOR ALL USING (true);

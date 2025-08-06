-- Create admin users table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Create matches table
CREATE TABLE matches (
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

-- Create match_results table
CREATE TABLE match_results (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  placement INTEGER NOT NULL,
  kills INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create tournament_settings table
CREATE TABLE tournament_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default tournament settings
INSERT INTO tournament_settings (setting_key, setting_value) VALUES
('registration_open', 'false'),
('tournament_status', 'ongoing'),
('max_teams', '20'),
('current_match', '0');

-- Create RLS policies for admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_settings ENABLE ROW LEVEL SECURITY;

-- Admin policies (you'll need to implement proper authentication)
CREATE POLICY "Admin access to admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Admin access to matches" ON matches FOR ALL USING (true);
CREATE POLICY "Admin access to match_results" ON match_results FOR ALL USING (true);
CREATE POLICY "Admin access to tournament_settings" ON tournament_settings FOR ALL USING (true);

-- Public read access for some data
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read match_results" ON match_results FOR SELECT USING (true);
CREATE POLICY "Public read tournament_settings" ON tournament_settings FOR SELECT USING (true);

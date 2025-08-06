-- Create teams table
CREATE TABLE teams (
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
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  player_name VARCHAR(255) NOT NULL,
  instagram_handle VARCHAR(255),
  twitter_handle VARCHAR(255),
  player_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create storage bucket for team logos
INSERT INTO storage.buckets (id, name, public) VALUES ('team-logos', 'team-logos', true);

-- Set up storage policies for team logos
CREATE POLICY "Anyone can upload team logos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'team-logos');

CREATE POLICY "Anyone can view team logos" ON storage.objects
FOR SELECT USING (bucket_id = 'team-logos');

-- Enable Row Level Security (RLS) but allow all operations for now
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can restrict these later)
CREATE POLICY "Allow all operations on teams" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);

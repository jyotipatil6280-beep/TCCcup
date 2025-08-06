-- Create tournament_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS tournament_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tournament_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Admin access to tournament_settings" ON tournament_settings;
DROP POLICY IF EXISTS "Public read tournament_settings" ON tournament_settings;

CREATE POLICY "Admin access to tournament_settings" ON tournament_settings FOR ALL USING (true);
CREATE POLICY "Public read tournament_settings" ON tournament_settings FOR SELECT USING (true);

-- Insert default tournament settings
INSERT INTO tournament_settings (setting_key, setting_value) VALUES
('registration_open', 'false'),
('tournament_status', 'ongoing'),
('max_teams', '20'),
('current_match', '0')
ON CONFLICT (setting_key) DO NOTHING;

-- Now approve all teams and update settings
UPDATE teams 
SET status = 'approved' 
WHERE status = 'pending';

-- Update tournament settings to reflect team selection completion
INSERT INTO tournament_settings (setting_key, setting_value) 
VALUES ('team_selection_complete', 'true')
ON CONFLICT (setting_key) 
DO UPDATE SET setting_value = 'true', updated_at = NOW();

-- Add total approved teams count
INSERT INTO tournament_settings (setting_key, setting_value) 
VALUES ('total_tournament_teams', (SELECT COUNT(*) FROM teams WHERE status = 'approved')::text)
ON CONFLICT (setting_key) 
DO UPDATE SET setting_value = (SELECT COUNT(*) FROM teams WHERE status = 'approved')::text, updated_at = NOW();

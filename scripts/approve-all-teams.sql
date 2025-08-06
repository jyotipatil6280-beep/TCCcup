-- Approve all registered teams for the tournament
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

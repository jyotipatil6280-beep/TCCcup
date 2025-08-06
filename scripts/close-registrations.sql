-- Update tournament settings to close registrations
UPDATE tournament_settings 
SET setting_value = 'false', updated_at = NOW() 
WHERE setting_key = 'registration_open';

-- Update tournament status to ongoing
UPDATE tournament_settings 
SET setting_value = 'ongoing', updated_at = NOW() 
WHERE setting_key = 'tournament_status';

-- Add registration closed date
INSERT INTO tournament_settings (setting_key, setting_value) 
VALUES ('registration_closed_date', NOW()::text)
ON CONFLICT (setting_key) 
DO UPDATE SET setting_value = NOW()::text, updated_at = NOW();

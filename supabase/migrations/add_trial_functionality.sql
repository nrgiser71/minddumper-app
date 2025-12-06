-- Add trial functionality to profiles table
-- This migration adds all necessary fields for 14-day trial support
-- Safe to run - no impact on existing paid users

-- Add trial-related columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_trial_user BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_reminder_sent_3day BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_reminder_sent_1day BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_reminder_sent_expired BOOLEAN DEFAULT FALSE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_trial_expires ON profiles(trial_expires_at) WHERE trial_expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_payment_trial ON profiles(payment_status) WHERE payment_status = 'trial';
CREATE INDEX IF NOT EXISTS idx_profiles_is_trial_user ON profiles(is_trial_user) WHERE is_trial_user = true;

-- Add constraint to prevent duplicate trial accounts per email
-- Note: This allows one trial per email address
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_trial_per_email ON profiles(email) WHERE is_trial_user = true AND payment_status = 'trial';

-- Update payment_status check constraint to include 'trial'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_payment_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_payment_status_check 
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'trial'));

-- Add comments for documentation
COMMENT ON COLUMN profiles.trial_expires_at IS '14-day trial expiration timestamp';
COMMENT ON COLUMN profiles.is_trial_user IS 'True if user ever had a trial (historical tracking)';
COMMENT ON COLUMN profiles.trial_reminder_sent_3day IS 'Reminder email sent 3 days before expiry';
COMMENT ON COLUMN profiles.trial_reminder_sent_1day IS 'Reminder email sent 1 day before expiry';  
COMMENT ON COLUMN profiles.trial_reminder_sent_expired IS 'Expired trial email sent';

-- Create view for trial statistics (for admin dashboard)
CREATE OR REPLACE VIEW trial_statistics AS
SELECT 
  COUNT(*) FILTER (WHERE payment_status = 'trial' AND trial_expires_at > NOW()) as active_trials,
  COUNT(*) FILTER (WHERE payment_status = 'trial' AND trial_expires_at <= NOW()) as expired_trials,
  COUNT(*) FILTER (WHERE is_trial_user = true AND payment_status = 'paid') as converted_trials,
  COUNT(*) FILTER (WHERE is_trial_user = true) as total_trial_users,
  CASE 
    WHEN COUNT(*) FILTER (WHERE is_trial_user = true) > 0 THEN
      ROUND(100.0 * COUNT(*) FILTER (WHERE is_trial_user = true AND payment_status = 'paid') / 
        COUNT(*) FILTER (WHERE is_trial_user = true), 2)
    ELSE 0
  END as conversion_rate_percent
FROM profiles;

-- Grant access to view for authenticated users
GRANT SELECT ON trial_statistics TO authenticated;

-- Add RLS policy for trial statistics view (admin only)
CREATE POLICY "Admin can view trial statistics" ON trial_statistics
  FOR SELECT USING (auth.jwt() ->> 'email' = 'jan@baasoverjetijd.be');
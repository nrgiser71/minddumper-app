-- Add auto-login system to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_token_used BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_token_expires TIMESTAMP WITH TIME ZONE;

-- Create webhook_lock table for processing queue
CREATE TABLE IF NOT EXISTS webhook_lock (
  id INTEGER PRIMARY KEY DEFAULT 1,
  is_locked BOOLEAN DEFAULT FALSE,
  locked_at TIMESTAMP WITH TIME ZONE,
  processing_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default unlocked state
INSERT INTO webhook_lock (id, is_locked) VALUES (1, FALSE) ON CONFLICT (id) DO NOTHING;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_login_token ON profiles(login_token) WHERE login_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_paid_at ON profiles(paid_at DESC) WHERE payment_status = 'paid';
CREATE INDEX IF NOT EXISTS idx_profiles_login_token_used ON profiles(login_token_used, login_token_expires) WHERE login_token IS NOT NULL;

-- Add constraint to ensure only one webhook lock record
ALTER TABLE webhook_lock ADD CONSTRAINT webhook_lock_single_row CHECK (id = 1);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_webhook_lock_updated_at BEFORE UPDATE ON webhook_lock FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
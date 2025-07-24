-- Add Row Level Security to webhook_lock table
-- This fixes the Supabase security warning while maintaining functionality

-- Enable Row Level Security on webhook_lock table
ALTER TABLE webhook_lock ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (webhook processing uses service role)
CREATE POLICY "Service role full access" ON webhook_lock
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Deny all other access for security
CREATE POLICY "Deny public access" ON webhook_lock
  FOR ALL USING (false);
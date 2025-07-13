-- Add PlugAndPay payment fields to profiles table
-- This migration adds payment tracking fields for PlugAndPay integration

-- Add payment status and PlugAndPay specific fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS amount_paid_cents INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plugandpay_order_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_payment_status ON profiles(payment_status);
CREATE INDEX IF NOT EXISTS idx_profiles_plugandpay_order ON profiles(plugandpay_order_id);
CREATE INDEX IF NOT EXISTS idx_profiles_paid_at ON profiles(paid_at);

-- Add constraint to ensure unique order IDs
ALTER TABLE profiles ADD CONSTRAINT unique_plugandpay_order_id UNIQUE (plugandpay_order_id);

-- Comment for documentation
COMMENT ON COLUMN profiles.payment_status IS 'Payment status: pending, paid, failed, refunded';
COMMENT ON COLUMN profiles.amount_paid_cents IS 'Amount paid in cents (EUR)';
COMMENT ON COLUMN profiles.plugandpay_order_id IS 'PlugAndPay order ID for tracking';
COMMENT ON COLUMN profiles.paid_at IS 'Timestamp when payment was completed';
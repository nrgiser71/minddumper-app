-- Add payment-related fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS amount_paid_cents INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'eur';

-- Customer information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS customer_type TEXT DEFAULT 'private';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Billing address
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS billing_address_line1 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS billing_address_line2 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS billing_city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS billing_postal_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS billing_country TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS billing_state TEXT;

-- Business information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vat_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vat_validated BOOLEAN DEFAULT false;

-- Marketing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS newsletter_opted_in BOOLEAN DEFAULT false;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_payment_status ON profiles(payment_status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update RLS policies to allow users to see their own payment status
CREATE POLICY "Users can view own payment status" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Service role can update payment status" ON profiles
  FOR UPDATE USING (auth.role() = 'service_role');
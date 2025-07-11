-- Add invoice tracking fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invoice_number TEXT;

-- Add indexes for invoice lookup
CREATE INDEX IF NOT EXISTS idx_profiles_invoice_id ON profiles(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_profiles_invoice_number ON profiles(invoice_number);

-- Add comments for documentation
COMMENT ON COLUMN profiles.stripe_invoice_id IS 'Stripe Invoice ID for accounting reference';
COMMENT ON COLUMN profiles.invoice_number IS 'Human-readable invoice number (e.g. INV-2024-001)';
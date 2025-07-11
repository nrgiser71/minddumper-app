-- Add detailed billing fields to profiles table for invoice generation
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT; 
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_payment_status ON profiles(payment_status);
CREATE INDEX IF NOT EXISTS idx_profiles_customer_type ON profiles(customer_type);
CREATE INDEX IF NOT EXISTS idx_profiles_paid_at ON profiles(paid_at);

-- Add comments for documentation
COMMENT ON COLUMN profiles.first_name IS 'Customer first name for invoicing';
COMMENT ON COLUMN profiles.last_name IS 'Customer last name for invoicing';
COMMENT ON COLUMN profiles.phone IS 'Customer phone number (optional)';
COMMENT ON COLUMN profiles.company_name IS 'Company name for business customers';
COMMENT ON COLUMN profiles.vat_number IS 'EU VAT number for tax exemption';
COMMENT ON COLUMN profiles.billing_address_line1 IS 'Street address line 1';
COMMENT ON COLUMN profiles.billing_address_line2 IS 'Street address line 2 (apartment, suite, etc.)';
COMMENT ON COLUMN profiles.billing_city IS 'Billing city';
COMMENT ON COLUMN profiles.billing_postal_code IS 'Billing postal/ZIP code';
COMMENT ON COLUMN profiles.billing_country IS 'Billing country (ISO 2-letter code)';
COMMENT ON COLUMN profiles.billing_state IS 'Billing state/province (for US/CA/AU)';
COMMENT ON COLUMN profiles.customer_type IS 'Customer type: private or business';
COMMENT ON COLUMN profiles.newsletter_opted_in IS 'Whether customer opted in to newsletter';
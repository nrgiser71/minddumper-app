-- Remove all Stripe-related fields from profiles table
-- This migration cleans up unused Stripe payment fields after migration to PlugAndPay

-- Drop Stripe-specific columns if they exist
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_customer_id CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_payment_intent_id CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_session_id CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_subscription_id CASCADE;

-- Drop billing address fields if not needed for PlugAndPay
-- Only remove these if you're not collecting billing addresses in PlugAndPay
ALTER TABLE profiles DROP COLUMN IF EXISTS billing_address_line1 CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS billing_address_line2 CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS billing_city CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS billing_postal_code CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS billing_country CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS billing_state CASCADE;

-- Drop business/VAT fields if not needed for PlugAndPay
ALTER TABLE profiles DROP COLUMN IF EXISTS customer_type CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS company_name CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS vat_number CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS vat_validated CASCADE;

-- Drop other Stripe-related fields
ALTER TABLE profiles DROP COLUMN IF EXISTS currency CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS newsletter_opted_in CASCADE;

-- Remove any Stripe-related indexes
DROP INDEX IF EXISTS idx_profiles_stripe_customer;
DROP INDEX IF EXISTS idx_profiles_stripe_session;

-- Remove any Stripe-related constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS unique_stripe_customer_id;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS unique_stripe_session_id;

-- Add comment for documentation
COMMENT ON TABLE profiles IS 'User profiles with PlugAndPay payment integration. Stripe fields removed after migration to PlugAndPay.';
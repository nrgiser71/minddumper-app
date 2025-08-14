-- Add payment-related columns to profiles table
-- Required for admin account creation functionality

-- Add payment status column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add payment timestamp column  
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add payment amount column (in cents)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS amount_paid_cents INTEGER DEFAULT 0;

-- Add order ID for tracking purchases
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS order_id TEXT DEFAULT NULL;

-- Add customer type for distinguishing regular vs trainer accounts
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS customer_type TEXT DEFAULT 'regular';

-- Add country field for analytics
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT NULL;

-- Create index on payment_status for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_payment_status ON public.profiles(payment_status);

-- Create index on customer_type for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_customer_type ON public.profiles(customer_type);

-- Update RLS policies to allow service role operations
-- The existing policies only allow users to modify their own profiles
-- We need to allow service role (admin operations) to create profiles for others

-- Create policy for service role to insert any profile (for admin account creation)
CREATE POLICY "Service role can insert any profile" ON public.profiles
  FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Create policy for service role to update any profile (for admin operations)  
CREATE POLICY "Service role can update any profile" ON public.profiles
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create policy for service role to view any profile (for admin dashboard)
CREATE POLICY "Service role can view any profile" ON public.profiles
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'service_role');
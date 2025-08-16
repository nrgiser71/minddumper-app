-- Production Database Migration: Add Payment Columns to Profiles
-- Execute this in Supabase SQL Editor for production database
-- Required for admin account creation functionality

-- Add payment status column (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'payment_status') THEN
        ALTER TABLE public.profiles ADD COLUMN payment_status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Add payment timestamp column (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'paid_at') THEN
        ALTER TABLE public.profiles ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    END IF;
END $$;

-- Add payment amount column (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'amount_paid_cents') THEN
        ALTER TABLE public.profiles ADD COLUMN amount_paid_cents INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create index on payment_status for admin queries (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_payment_status') THEN
        CREATE INDEX idx_profiles_payment_status ON public.profiles(payment_status);
    END IF;
END $$;

-- Update RLS policies to allow service role operations (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can insert any profile') THEN
        CREATE POLICY "Service role can insert any profile" ON public.profiles
          FOR INSERT 
          WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can update any profile') THEN
        CREATE POLICY "Service role can update any profile" ON public.profiles
          FOR UPDATE 
          USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can view any profile') THEN
        CREATE POLICY "Service role can view any profile" ON public.profiles
          FOR SELECT 
          USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- Verify the migration worked
SELECT 'Migration completed successfully!' as result;
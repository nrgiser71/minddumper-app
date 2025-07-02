-- MindDump Waitlist Migration SQL
-- Run this in Supabase SQL Editor

-- Create minddump_waitlist table
CREATE TABLE public.minddump_waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    naam VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT
);

-- Enable RLS on minddump_waitlist table
ALTER TABLE public.minddump_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for minddump_waitlist (public read access for stats)
CREATE POLICY "Anyone can view waitlist stats" ON public.minddump_waitlist
  FOR SELECT USING (true);

-- Create policy for inserting (anyone can sign up)
CREATE POLICY "Anyone can signup for waitlist" ON public.minddump_waitlist
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_minddump_waitlist_email ON public.minddump_waitlist(email);
CREATE INDEX idx_minddump_waitlist_created_at ON public.minddump_waitlist(created_at);

-- Comments for documentation
COMMENT ON TABLE public.minddump_waitlist IS 'Waitlist signups for MindDump application';
COMMENT ON COLUMN public.minddump_waitlist.email IS 'Email address of the waitlist signup';
COMMENT ON COLUMN public.minddump_waitlist.naam IS 'Name of the person signing up';
COMMENT ON COLUMN public.minddump_waitlist.ip_address IS 'IP address for tracking and analytics';
COMMENT ON COLUMN public.minddump_waitlist.user_agent IS 'Browser user agent for analytics';
COMMENT ON COLUMN public.minddump_waitlist.referrer IS 'Referrer URL for marketing attribution';
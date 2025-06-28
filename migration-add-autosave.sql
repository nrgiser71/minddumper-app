-- Migration: Add auto-save functionality to brain_dumps table
-- Run this in Supabase SQL Editor if you have an existing database

-- Add new columns to brain_dumps table
ALTER TABLE public.brain_dumps 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS session_id TEXT NULL;

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_brain_dumps_session_id ON public.brain_dumps(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_brain_dumps_user_draft ON public.brain_dumps(user_id, is_draft) WHERE is_draft = true;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on brain_dumps
DROP TRIGGER IF EXISTS update_brain_dumps_updated_at ON public.brain_dumps;
CREATE TRIGGER update_brain_dumps_updated_at
  BEFORE UPDATE ON public.brain_dumps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to cleanup old draft sessions (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_drafts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.brain_dumps 
  WHERE is_draft = true 
    AND created_at < (NOW() - INTERVAL '7 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing records to have updated_at set to created_at where null
UPDATE public.brain_dumps 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.brain_dumps.is_draft IS 'Whether this is a draft/auto-save (true) or final save (false)';
COMMENT ON COLUMN public.brain_dumps.session_id IS 'Unique session identifier for grouping auto-saves';
COMMENT ON FUNCTION cleanup_old_drafts() IS 'Removes draft brain dumps older than 7 days to prevent storage bloat';
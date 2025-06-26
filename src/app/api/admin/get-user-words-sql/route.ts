import { NextResponse } from 'next/server'

export async function GET() {
  const sql = `-- Create user_trigger_words table for MindDumper
CREATE TABLE public.user_trigger_words (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  main_category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, word)
);

-- Enable Row Level Security
ALTER TABLE public.user_trigger_words ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user security
CREATE POLICY "Users can view own trigger words" ON public.user_trigger_words
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trigger words" ON public.user_trigger_words
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trigger words" ON public.user_trigger_words
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trigger words" ON public.user_trigger_words
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_trigger_words_user_id ON public.user_trigger_words(user_id);
CREATE INDEX idx_user_trigger_words_active ON public.user_trigger_words(user_id, is_active);

-- Success message
SELECT 'user_trigger_words table created successfully!' as result;`

  return NextResponse.json({ 
    sql,
    instruction: 'Copy this SQL and run it in Supabase Dashboard > SQL Editor',
    steps: [
      '1. Open your Supabase Dashboard',
      '2. Go to SQL Editor',
      '3. Paste the SQL code above',
      '4. Click Run',
      '5. The table will be created with proper security policies'
    ]
  })
}

export async function POST() {
  // Just return the same SQL for easy access
  return GET()
}
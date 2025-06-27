import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    // Creating user_trigger_words table

    // First check if table exists
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_trigger_words')

    if (tables && tables.length > 0) {
      // Table user_trigger_words already exists
      return NextResponse.json({ 
        success: true, 
        message: 'Table user_trigger_words already exists'
      })
    }

    // Create the table using INSERT (workaround for SQL limitations)
    // We'll use a simpler approach with direct SQL via a function
    const createTableSQL = `
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

      ALTER TABLE public.user_trigger_words ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Users can view own trigger words" ON public.user_trigger_words
        FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own trigger words" ON public.user_trigger_words
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own trigger words" ON public.user_trigger_words
        FOR UPDATE USING (auth.uid() = user_id);

      CREATE POLICY "Users can delete own trigger words" ON public.user_trigger_words
        FOR DELETE USING (auth.uid() = user_id);

      CREATE INDEX idx_user_trigger_words_user_id ON public.user_trigger_words(user_id);
      CREATE INDEX idx_user_trigger_words_active ON public.user_trigger_words(user_id, is_active);
    `

    // SQL for manual execution in Supabase SQL Editor

    return NextResponse.json({ 
      success: true, 
      message: 'Please execute the following SQL in Supabase SQL Editor:',
      sql: createTableSQL
    })

  } catch (error) {
    // Error
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to create user_trigger_words table',
    usage: 'POST /api/admin/create-user-words-table'
  })
}
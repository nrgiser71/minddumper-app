import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    // Initializing user tables

    // Test if user_trigger_words table exists by trying to read from it
    const { error: testError } = await supabase
      .from('user_trigger_words')
      .select('count', { count: 'exact' })
      .limit(0)

    if (!testError) {
      // user_trigger_words table already exists
      return NextResponse.json({ 
        success: true, 
        message: 'user_trigger_words table already exists',
        tableExists: true
      })
    }

    // Creating user_trigger_words table via insert operations

    // Since we can't execute DDL directly, we'll create the table structure
    // by exploiting Supabase's auto-table creation for new collections
    
    // First get a test user to use for the operation
    const { data: authData } = await supabase.auth.admin.listUsers()
    const testUserId = authData?.users?.[0]?.id

    if (!testUserId) {
      return NextResponse.json({ 
        success: false, 
        message: 'No users found. Please create a user account first.',
        requiresUser: true
      })
    }

    // Try to create the table structure using raw SQL via a stored procedure
    // We'll use the upsert functionality to safely create table structure
    
    const tableDefinition = {
      id: crypto.randomUUID(),
      user_id: testUserId,
      word: '__init_table__',
      main_category: 'System',
      sub_category: 'Init',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // This will fail if table doesn't exist, but that's expected
    const { error: insertError } = await supabase
      .from('user_trigger_words')
      .insert(tableDefinition)

    if (insertError) {
      // Expected - table doesn't exist
      // Table creation needed
      
      // Return SQL for manual execution
      return NextResponse.json({ 
        success: false, 
        message: 'Please execute this SQL in Supabase Dashboard > SQL Editor to create the table:',
        sql: `-- Create user_trigger_words table
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

-- Enable RLS
ALTER TABLE public.user_trigger_words ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own trigger words" ON public.user_trigger_words
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trigger words" ON public.user_trigger_words
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trigger words" ON public.user_trigger_words
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trigger words" ON public.user_trigger_words
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_trigger_words_user_id ON public.user_trigger_words(user_id);
CREATE INDEX idx_user_trigger_words_active ON public.user_trigger_words(user_id, is_active);`,
        instruction: 'After running the SQL, call this endpoint again to verify setup'
      })
    }

    // If insert succeeded, clean up and verify
    await supabase
      .from('user_trigger_words')
      .delete()
      .eq('word', '__init_table__')

    // Table created and verified
    
    return NextResponse.json({ 
      success: true, 
      message: 'user_trigger_words table created successfully and is ready for use'
    })

  } catch (error) {
    // Error initializing tables
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to initialize user tables',
    usage: 'POST /api/admin/init-user-tables'
  })
}
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    console.log('🚀 Setting up user_trigger_words functionality...')

    // Check if table exists by trying to query it
    const { error: checkError } = await supabase
      .from('user_trigger_words')
      .select('*')
      .limit(1)

    if (!checkError) {
      console.log('✅ user_trigger_words table already exists')
      return NextResponse.json({ 
        success: true, 
        message: 'user_trigger_words table already exists and is ready to use',
        tableExists: true
      })
    }

    console.log('📋 Table does not exist, creating via service operations...')

    // Instead of direct SQL, we'll create a test record first to trigger table creation
    // This is a workaround approach
    try {
      // Try to create the table structure by inserting a test record
      // Supabase might auto-create if we have the right permissions
      
      // First, get the current user for the operation (we need a real user_id)
      const { data: users } = await supabase.auth.admin.listUsers()
      
      if (!users.users || users.users.length === 0) {
        return NextResponse.json({ 
          success: false, 
          message: 'No users found. Please register a user first before setting up user words functionality.',
          requiresAction: 'Create a user account first'
        })
      }

      const testUserId = users.users[0].id

      // Create test record to establish table (this will likely fail, but gives us info)
      const { error: insertError } = await supabase
        .from('user_trigger_words')
        .insert({
          user_id: testUserId,
          word: 'test_word_to_be_deleted',
          main_category: 'Test',
          sub_category: 'Test',
          is_active: false
        })

      if (insertError) {
        console.log('Expected error (table creation needed):', insertError.message)
        
        return NextResponse.json({ 
          success: false, 
          message: 'Table needs to be created. Please run this SQL in Supabase SQL Editor:',
          sql: `
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
          `,
          action: 'Run the provided SQL in Supabase Dashboard > SQL Editor'
        })
      }

      // If insert succeeded, clean up test record
      await supabase
        .from('user_trigger_words')
        .delete()
        .eq('word', 'test_word_to_be_deleted')

      console.log('✅ Table exists and is functional!')
      
      return NextResponse.json({ 
        success: true, 
        message: 'user_trigger_words table is set up and ready to use'
      })

    } catch (setupError) {
      console.error('Setup error:', setupError)
      return NextResponse.json({ 
        success: false, 
        error: setupError instanceof Error ? setupError.message : 'Setup failed'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Error setting up user words:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to setup user_trigger_words functionality',
    usage: 'POST /api/admin/setup-user-words'
  })
}
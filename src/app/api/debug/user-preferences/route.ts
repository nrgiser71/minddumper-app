import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get all user preferences
    const { data: preferences, error: prefError } = await supabase
      .from('user_trigger_word_preferences')
      .select('*')

    // Get all system words 
    const { data: systemWords, error: wordsError } = await supabase
      .from('system_trigger_words')
      .select('id, word, is_active')
      .limit(10)

    if (prefError || wordsError) {
      return NextResponse.json({ 
        error: 'Database error', 
        prefError, 
        wordsError 
      }, { status: 500 })
    }

    return NextResponse.json({
      preferences_count: preferences?.length || 0,
      preferences: preferences,
      system_words_sample: systemWords,
      debug: {
        message: 'Check if user preferences exist and system words are active'
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Failed to debug user preferences',
      details: error 
    }, { status: 500 })
  }
}
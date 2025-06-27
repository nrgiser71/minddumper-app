import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    // Clearing all Dutch trigger words

    const { error: deleteError } = await supabase
      .from('trigger_words')
      .delete()
      .eq('language', 'nl')

    if (deleteError) {
      // Error clearing words
      return NextResponse.json({ 
        success: false, 
        error: deleteError.message 
      }, { status: 500 })
    }

    // All Dutch trigger words cleared
    
    return NextResponse.json({ 
      success: true, 
      message: 'All Dutch trigger words have been cleared from database'
    })

  } catch (error) {
    // Error clearing words
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to clear all Dutch trigger words',
    usage: 'POST /api/admin/clear-words'
  })
}
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Checking database structure

    // Get first few trigger words to see structure
    const { data: words, error: wordsError } = await supabase
      .from('trigger_words')
      .select('*')
      .eq('language', 'nl')
      .limit(3)

    if (wordsError) {
      // Error fetching words
      return NextResponse.json({ 
        success: false, 
        error: wordsError.message 
      }, { status: 500 })
    }

    const sampleWord = words?.[0]
    const columns = sampleWord ? Object.keys(sampleWord) : []

    // Database check completed
    
    return NextResponse.json({ 
      success: true,
      totalWords: words?.length || 0,
      sampleWords: words?.map(w => ({ word: w.word, main_category: w.main_category, sub_category: w.sub_category })) || [],
      availableColumns: columns,
      hasHierarchy: columns.includes('main_category') && columns.includes('sub_category')
    })

  } catch (error) {
    // Error checking database
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
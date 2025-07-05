import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Direct query for Dutch words without joins
    const { data: dutchWords, error } = await supabase
      .from('system_trigger_words')
      .select('*')
      .eq('language', 'nl')
      .limit(10)

    if (error) {
      console.error('Error fetching Dutch words:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    // Count total Dutch words
    const { count, error: countError } = await supabase
      .from('system_trigger_words')
      .select('*', { count: 'exact', head: true })
      .eq('language', 'nl')

    if (countError) {
      console.error('Error counting Dutch words:', countError)
    }

    // Check all languages in the table
    const { data: allLanguages, error: langError } = await supabase
      .from('system_trigger_words')
      .select('language')

    const languageCounts = allLanguages?.reduce((acc: Record<string, number>, word) => {
      acc[word.language] = (acc[word.language] || 0) + 1
      return acc
    }, {}) || {}

    return NextResponse.json({ 
      success: true, 
      dutchWordsCount: count || 0,
      dutchWordsSample: dutchWords || [],
      allLanguageCounts: languageCounts
    })

  } catch (error) {
    console.error('Debug Dutch words error:', error)
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    })
  }
}
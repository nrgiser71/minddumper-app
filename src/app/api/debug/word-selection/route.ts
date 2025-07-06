import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const language = url.searchParams.get('language') || 'de'
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter required' })
    }

    // Get all words for this language
    const { data: allWords } = await supabase
      .from('system_trigger_words')
      .select('id, word')
      .eq('language', language)
      .eq('is_active', true)

    // Get user preferences for this language
    const { data: preferences } = await supabase
      .from('user_trigger_word_preferences')
      .select('system_word_id, is_enabled')
      .eq('user_id', userId)

    const userPrefs = new Map(preferences?.map(p => [p.system_word_id, p.is_enabled]) || [])

    // Calculate what would be shown in brain dump
    const brainDumpWords = (allWords || []).filter(word => {
      const isEnabled = userPrefs.get(word.id) ?? true // Default to enabled
      return isEnabled
    })

    // Get preferences for config screen (should be same logic)
    const configWords = (allWords || []).map(word => ({
      id: word.id,
      word: word.word,
      isEnabled: userPrefs.get(word.id) ?? true,
      hasPreference: userPrefs.has(word.id)
    }))

    return NextResponse.json({
      language,
      userId,
      debug: {
        totalWords: allWords?.length || 0,
        totalPreferences: preferences?.length || 0,
        brainDumpCount: brainDumpWords.length,
        enabledInConfig: configWords.filter(w => w.isEnabled).length,
        wordsWithoutPreferences: configWords.filter(w => !w.hasPreference).length
      },
      brainDumpWords: brainDumpWords.slice(0, 10).map(w => w.word),
      configSample: configWords.slice(0, 10),
      allPreferences: preferences || []
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
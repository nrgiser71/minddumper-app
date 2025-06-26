import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get current user (you'll need to pass user ID or use auth)
    const { data: users } = await supabase.auth.admin.listUsers()
    const userId = users.users[0]?.id // Get first user for testing
    
    if (!userId) {
      return NextResponse.json({ error: 'No users found' })
    }

    // Get system words for Dutch
    const { data: systemWords } = await supabase
      .from('system_trigger_words')
      .select(`
        id,
        word,
        sub_category:sub_categories!inner(
          id,
          name,
          main_category:main_categories!inner(
            id,
            name
          )
        )
      `)
      .eq('language', 'nl')
      .eq('is_active', true)

    // Get user preferences
    const { data: preferences } = await supabase
      .from('user_trigger_word_preferences')
      .select('system_word_id, is_enabled')
      .eq('user_id', userId)

    // Get custom words
    const { data: customWords } = await supabase
      .from('user_custom_trigger_words')
      .select(`
        word,
        sub_category:sub_categories!inner(
          name,
          main_category:main_categories!inner(
            name
          )
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)

    const userPrefs = new Map(preferences?.map(p => [p.system_word_id, p.is_enabled]) || [])

    // Apply same logic as getTriggerWordsForBrainDump
    const enabledSystemWords = (systemWords || [])
      .filter(word => userPrefs.get(word.id) ?? true)
      .map(word => ({
        word: word.word,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: `${(word.sub_category as any).main_category.name} - ${(word.sub_category as any).name}`,
        type: 'system',
        preference: userPrefs.get(word.id) ?? 'default_enabled'
      }))

    const customWordsList = (customWords || []).map(w => ({
      word: w.word,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: `${(w.sub_category as any).main_category.name} - ${(w.sub_category as any).name}`,
      type: 'custom'
    }))

    return NextResponse.json({
      userId,
      totalSystemWords: systemWords?.length || 0,
      totalPreferences: preferences?.length || 0,
      totalCustomWords: customWords?.length || 0,
      enabledSystemWords: enabledSystemWords.length,
      finalWordCount: enabledSystemWords.length + customWordsList.length,
      systemWords: enabledSystemWords,
      customWords: customWordsList,
      preferences: preferences || [],
      debug: {
        message: 'This shows exactly what getTriggerWordsForBrainDump should return'
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Failed to debug brain dump words',
      details: error 
    }, { status: 500 })
  }
}
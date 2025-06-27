import { supabase, type BrainDump, type TriggerWord } from './supabase'

// Fetch trigger words for a specific language with hierarchical structure
export async function getTriggerWords(language: string): Promise<TriggerWord[]> {
  try {
    
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return getMockTriggerWordsStructured(language)
    }

    // Get all system words with structure
    const { data: systemWords, error } = await supabase
      .from('system_trigger_words')
      .select(`
        id,
        word,
        language,
        display_order,
        is_active,
        created_at,
        sub_category:sub_categories!inner(
          id,
          name,
          display_order,
          main_category:main_categories!inner(
            id,
            name,
            display_order
          )
        )
      `)
      .eq('language', language)
      .eq('is_active', true)

    if (error) {
      return getMockTriggerWordsStructured(language)
    }

    // Get user preferences
    const { data: preferences } = await supabase
      .from('user_trigger_word_preferences')
      .select('system_word_id, is_enabled')
      .eq('user_id', user.user.id)

    const userPrefs = new Map(preferences?.map(p => [p.system_word_id, p.is_enabled]) || [])

    // Transform to TriggerWord format and filter based on preferences
    const triggerWords: TriggerWord[] = (systemWords || [])
      .filter(word => userPrefs.get(word.id) !== false) // Only exclude if explicitly disabled
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((word: any) => ({
        id: word.id,
        language: word.language,
        word: word.word,
        main_category: word.sub_category.main_category.name,
        sub_category: word.sub_category.name,
        category: `${word.sub_category.main_category.name} - ${word.sub_category.name}`,
        main_category_order: word.sub_category.main_category.display_order,
        sub_category_order: word.sub_category.display_order,
        sort_order: word.display_order,
        is_active: word.is_active,
        created_at: word.created_at
      }))

    // Add user custom words (filtered by language)
    const { data: customWords } = await supabase
      .from('user_custom_trigger_words')
      .select(`
        id,
        word,
        created_at,
        sub_category:sub_categories!inner(
          id,
          name,
          display_order,
          main_category:main_categories!inner(
            id,
            name,
            display_order
          )
        )
      `)
      .eq('user_id', user.user.id)
      .eq('language', language)
      .eq('is_active', true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customTriggerWords: TriggerWord[] = (customWords || []).map((word: any) => ({
      id: word.id,
      language: language,
      word: word.word,
      main_category: word.sub_category.main_category.name,
      sub_category: word.sub_category.name,
      category: `${word.sub_category.main_category.name} - ${word.sub_category.name}`,
      main_category_order: word.sub_category.main_category.display_order,
      sub_category_order: word.sub_category.display_order,
      sort_order: 999, // Custom words go last
      is_active: true,
      created_at: word.created_at
    }))

    const allWords = [...triggerWords, ...customTriggerWords]
    
    // Sort by main category order, then sub category order, then word sort order
    const sortedWords = allWords.sort((a, b) => {
      const aMainOrder = a.main_category_order || 0
      const bMainOrder = b.main_category_order || 0
      if (aMainOrder !== bMainOrder) {
        return aMainOrder - bMainOrder
      }
      
      const aSubOrder = a.sub_category_order || 0
      const bSubOrder = b.sub_category_order || 0
      if (aSubOrder !== bSubOrder) {
        return aSubOrder - bSubOrder
      }
      
      const aSortOrder = a.sort_order || 0
      const bSortOrder = b.sort_order || 0
      return aSortOrder - bSortOrder
    })
    
    
    if (sortedWords.length === 0) {
      return getMockTriggerWordsStructured(language)
    }
    
    return sortedWords
  } catch {
    return getMockTriggerWordsStructured(language)
  }
}

// Legacy function for simple word lists (now uses new database structure)
export async function getTriggerWordsList(language: string): Promise<string[]> {
  try {
    
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return ['Werk', 'Familie'] // Fallback
    }

    // Get system words with user preferences
    const { data: systemWords, error: systemError } = await supabase
      .from('system_trigger_words')
      .select(`
        id,
        word,
        sub_category:sub_categories!inner(
          main_category:main_categories!inner(
            display_order
          ),
          display_order
        )
      `)
      .eq('language', language)
      .eq('is_active', true)

    if (systemError) {
      return ['Werk', 'Familie'] // Fallback
    }

    // Get user preferences (disabled words)
    const { data: preferences } = await supabase
      .from('user_trigger_word_preferences')
      .select('system_word_id')
      .eq('user_id', user.user.id)
      .eq('is_enabled', false)

    const disabledWordIds = new Set(preferences?.map(p => p.system_word_id) || [])

    // Filter out disabled words
    const enabledSystemWords = (systemWords || [])
      .filter(word => !disabledWordIds.has(word.id))
      .map(word => word.word)

    // Get user custom words (filtered by language)
    const { data: customWords } = await supabase
      .from('user_custom_trigger_words')
      .select('word')
      .eq('user_id', user.user.id)
      .eq('language', language)
      .eq('is_active', true)

    const customWordsList = customWords?.map(w => w.word) || []

    const allWords = [...enabledSystemWords, ...customWordsList]
    
    
    if (allWords.length === 0) {
      return ['Werk', 'Familie']
    }
    
    return allWords
  } catch {
    return ['Werk', 'Familie'] // Fallback
  }
}

// Save brain dump to database
export async function saveBrainDump(brainDump: {
  language: string
  ideas: string[]
  total_words: number
  duration_minutes: number
}): Promise<string | null> {
  try {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('brain_dumps')
      .insert({
        user_id: user.user.id,
        language: brainDump.language,
        ideas: brainDump.ideas,
        total_ideas: brainDump.ideas.length,
        total_words: brainDump.total_words,
        duration_minutes: brainDump.duration_minutes,
        metadata: {
          created_via: 'web_app',
          version: '1.0'
        }
      })
      .select('id')
      .single()

    if (error) {
      return null
    }

    return data?.id || null
  } catch {
    return null
  }
}

// Get user's brain dump history
export async function getBrainDumpHistory(): Promise<BrainDump[]> {
  try {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      return []
    }

    const { data, error } = await supabase
      .from('brain_dumps')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return []
    }

    return data || []
  } catch {
    return []
  }
}

// Mock data fallback for when database is unavailable
function getMockTriggerWordsStructured(language: string): TriggerWord[] {
  const mockWords = [
    {
      id: '1',
      language,
      word: 'Werk',
      main_category: 'Professioneel',
      sub_category: 'Algemeen',
      main_category_order: 1,
      sub_category_order: 1,
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      language,
      word: 'Familie',
      main_category: 'Persoonlijk',
      sub_category: 'Relaties',
      main_category_order: 2,
      sub_category_order: 1,
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]
  
  return mockWords
}


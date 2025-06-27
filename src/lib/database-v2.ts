import { supabase } from './supabase'

interface SystemWordWithCategories {
  id: string
  word: string
  sub_category: {
    id: string
    name: string
    display_order: number
    main_category: {
      id: string
      name: string
      display_order: number
    }
  }
}


// Get trigger words for brain dump (system words + user preferences + custom words)
export async function getTriggerWordsForBrainDump(language: string): Promise<string[]> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      throw new Error('User not authenticated')
    }

    // Get system words with user preferences
    const { data: systemWords, error: systemError } = await supabase
      .from('system_trigger_words')
      .select(`
        id,
        word,
        display_order,
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

    if (systemError) {
      console.error('Error fetching system words:', systemError)
      return []
    }

    // Get user preferences (all preferences)
    const { data: preferences } = await supabase
      .from('user_trigger_word_preferences')
      .select('system_word_id, is_enabled')
      .eq('user_id', user.user.id)

    const userPrefs = new Map(preferences?.map(p => [p.system_word_id, p.is_enabled]) || [])

    console.log('🔍 Brain Dump Debug Info:')
    console.log('Total system words:', systemWords?.length || 0)
    console.log('Total user preferences:', preferences?.length || 0)
    console.log('User preferences map:', Object.fromEntries(userPrefs))

    // Filter based on user preferences (default to enabled if no preference)
    const enabledSystemWords = (systemWords || [])
      .filter(word => {
        const isEnabled = userPrefs.get(word.id) ?? true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wordData = word as any
        console.log(`Word "${word.word}" (${wordData.sub_category?.main_category?.name}): ${isEnabled ? 'ENABLED' : 'DISABLED'}`)
        return isEnabled
      })

    // Get user custom words with full structure
    const { data: customWords } = await supabase
      .from('user_custom_trigger_words')
      .select(`
        word,
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
      .eq('is_active', true)

    // Combine all words with their structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allWords: any[] = [
      ...enabledSystemWords,
      ...(customWords || [])
    ]

    // Sort by main category order, then sub category order, then word
    allWords.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aMainOrder = (a.sub_category as any)?.main_category?.display_order || 999
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bMainOrder = (b.sub_category as any)?.main_category?.display_order || 999
      
      if (aMainOrder !== bMainOrder) {
        return aMainOrder - bMainOrder
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aSubOrder = (a.sub_category as any)?.display_order || 999
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bSubOrder = (b.sub_category as any)?.display_order || 999
      
      if (aSubOrder !== bSubOrder) {
        return aSubOrder - bSubOrder
      }
      
      return a.word.localeCompare(b.word)
    })

    const sortedWords = allWords.map(w => w.word)

    console.log('Final enabled system words:', enabledSystemWords.length)
    console.log('Final custom words:', customWords?.length || 0)
    console.log('Total words for brain dump:', sortedWords.length)
    
    // Debug: Show the order
    console.log('🔤 Word order after sorting:')
    allWords.forEach((word, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = word as any
      console.log(`${index + 1}. "${w.word}" - ${w.sub_category?.main_category?.name} > ${w.sub_category?.name}`)
    })

    return sortedWords
  } catch (error) {
    console.error('Error in getTriggerWordsForBrainDump:', error)
    return []
  }
}

// Get structured trigger words for config screen
export async function getStructuredTriggerWords(language: string) {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      throw new Error('User not authenticated')
    }

    // Get all system words with structure
    const { data: systemWords, error } = await supabase
      .from('system_trigger_words')
      .select(`
        id,
        word,
        sub_category:sub_categories(
          id,
          name,
          display_order,
          main_category:main_categories(
            id,
            name,
            display_order
          )
        )
      `)
      .eq('language', language)
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching structured words:', error)
      return { categories: [], preferences: {} }
    }

    // Get user preferences
    const { data: preferences } = await supabase
      .from('user_trigger_word_preferences')
      .select('system_word_id, is_enabled')
      .eq('user_id', user.user.id)

    const userPrefs = new Map(preferences?.map(p => [p.system_word_id, p.is_enabled]) || [])

    // Build hierarchical structure
    type CategoryMapValue = {
      id: string
      name: string
      display_order: number
      subCategories: Map<string, {
        id: string
        name: string
        display_order: number
        words: Array<{
          id: string
          word: string
          enabled: boolean
        }>
      }>
    }
    
    const categoryMap = new Map() as Map<string, CategoryMapValue>

    (systemWords as unknown as SystemWordWithCategories[] | null)?.forEach((word) => {
      const mainCat = word.sub_category.main_category
      const subCat = word.sub_category

      if (!categoryMap.has(mainCat.id)) {
        categoryMap.set(mainCat.id, {
          id: mainCat.id,
          name: mainCat.name,
          display_order: mainCat.display_order,
          subCategories: new Map()
        })
      }

      const mainCategory = categoryMap.get(mainCat.id)!
      
      if (!mainCategory.subCategories.has(subCat.id)) {
        mainCategory.subCategories.set(subCat.id, {
          id: subCat.id,
          name: subCat.name,
          display_order: subCat.display_order,
          words: []
        })
      }

      const subCategory = mainCategory.subCategories.get(subCat.id)!
      subCategory.words.push({
        id: word.id,
        word: word.word,
        enabled: userPrefs.get(word.id) ?? true // Default to enabled if no preference
      })
    })

    // Convert to array and sort
    const categories = Array.from(categoryMap.values())
      .sort((a, b) => a.display_order - b.display_order)
      .map(mainCat => ({
        ...mainCat,
        subCategories: Array.from(mainCat.subCategories.values())
          .sort((a, b) => a.display_order - b.display_order)
          .map(subCat => ({
            ...subCat,
            words: subCat.words.sort((a, b) => a.word.localeCompare(b.word))
          }))
      }))

    return { categories, preferences: userPrefs }
  } catch (error) {
    console.error('Error in getStructuredTriggerWords:', error)
    return { categories: [], preferences: {} }
  }
}

// Update user preference for a system word
export async function updateWordPreference(systemWordId: string, enabled: boolean) {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('user_trigger_word_preferences')
      .upsert({
        user_id: user.user.id,
        system_word_id: systemWordId,
        is_enabled: enabled,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,system_word_id'
      })

    if (error) {
      console.error('Error updating preference:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateWordPreference:', error)
    return false
  }
}

// Get available categories for user custom words
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAvailableCategoriesV2(language?: string) {
  try {
    // Get all active categories (don't filter by language since users should be able to add words to any category)
    // Language parameter kept for API consistency but not used in filtering
    const { data, error } = await supabase
      .from('sub_categories')
      .select(`
        id,
        name,
        main_category:main_categories(
          id,
          name
        )
      `)
      .eq('is_active', true)

    if (error || !data) {
      console.error('Error fetching categories:', error)
      return { mainCategories: [], subCategories: {} }
    }

    const mainCatsMap = new Map()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subCats: any = {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((subCat: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mainCatName = (subCat.main_category as any).name
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mainCatId = (subCat.main_category as any).id
      
      mainCatsMap.set(mainCatId, mainCatName)
      
      if (!subCats[mainCatName]) {
        subCats[mainCatName] = []
      }
      
      subCats[mainCatName].push({
        id: subCat.id,
        name: subCat.name
      })
    })

    return {
      mainCategories: Array.from(mainCatsMap.values()).sort(),
      subCategories: subCats
    }
  } catch (error) {
    console.error('Error in getAvailableCategoriesV2:', error)
    return { mainCategories: [], subCategories: {} }
  }
}
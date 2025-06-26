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
        sub_category:sub_categories!inner(
          id,
          name,
          main_category:main_categories!inner(
            id,
            name
          )
        )
      `)
      .eq('language', language)
      .eq('is_active', true)
      .order('sub_category.main_category.display_order')
      .order('sub_category.display_order')
      .order('display_order')

    if (systemError) {
      console.error('Error fetching system words:', systemError)
      return []
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

    // Get user custom words
    const { data: customWords } = await supabase
      .from('user_custom_trigger_words')
      .select('word')
      .eq('user_id', user.user.id)
      .eq('is_active', true)

    const customWordsList = customWords?.map(w => w.word) || []

    // Combine all words
    return [...enabledSystemWords, ...customWordsList]
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
    const categoryMap = new Map<string, {
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
    }>()

    (systemWords as SystemWordWithCategories[] | null)?.forEach((word) => {
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
      }))

    return { categories, userPreferences: userPrefs }
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
export async function getAvailableCategoriesV2() {
  try {
    const { data, error } = await supabase
      .from('sub_categories')
      .select(`
        id,
        name,
        main_category:main_categories!inner(
          id,
          name
        )
      `)
      .eq('is_active', true)

    if (error || !data) {
      console.error('Error fetching categories:', error)
      return { mainCategories: [], subCategories: {} }
    }

    const mainCats = new Map<string, string>()
    const subCats: Record<string, Array<{id: string, name: string}>> = {}

    data.forEach(subCat => {
      const mainCatName = subCat.main_category.name
      const mainCatId = subCat.main_category.id
      
      mainCats.set(mainCatId, mainCatName)
      
      if (!subCats[mainCatName]) {
        subCats[mainCatName] = []
      }
      
      subCats[mainCatName].push({
        id: subCat.id,
        name: subCat.name
      })
    })

    return {
      mainCategories: Array.from(mainCats.values()).sort(),
      subCategories: subCats
    }
  } catch (error) {
    console.error('Error in getAvailableCategoriesV2:', error)
    return { mainCategories: [], subCategories: {} }
  }
}
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
    console.log(`🔍 [getTriggerWordsForBrainDump] Query for language: ${language}, user: ${user.user.id}`)
    
    // Build and log the actual SQL query
    const query = supabase
      .from('system_trigger_words')
      .select(`
        id,
        word,
        display_order,
        sub_category:sub_categories!inner(
          id,
          name,
          display_order,
          language,
          main_category:main_categories!inner(
            id,
            name,
            display_order,
            language
          )
        )
      `)
      .eq('language', language)
      .eq('is_active', true)
      .eq('sub_category.language', language)
      .eq('sub_category.main_category.language', language)
    
    console.log(`🔎 [SQL QUERY] Full query:`, query)
    console.log(`🔎 [SQL QUERY] Simplified SQL: 
SELECT system_trigger_words.*, sub_categories.*, main_categories.*
FROM system_trigger_words
JOIN sub_categories ON system_trigger_words.sub_category_id = sub_categories.id
JOIN main_categories ON sub_categories.main_category_id = main_categories.id
WHERE system_trigger_words.language = '${language}'
  AND system_trigger_words.is_active = true
  AND sub_categories.language = '${language}'
  AND main_categories.language = '${language}'`)
    
    const { data: systemWords, error: systemError } = await query
    
    console.log(`📊 [getTriggerWordsForBrainDump] System words found: ${systemWords?.length || 0}`)
    if (systemError) {
      console.error(`❌ [getTriggerWordsForBrainDump] System words error:`, systemError)
    }

    if (systemError) {
      // Failed to fetch system words
      return []
    }

    // Get user preferences (all preferences)
    const { data: preferences } = await supabase
      .from('user_trigger_word_preferences')
      .select('system_word_id, is_enabled')
      .eq('user_id', user.user.id)

    const userPrefs = new Map(preferences?.map(p => [p.system_word_id, p.is_enabled]) || [])
    console.log(`👤 [getTriggerWordsForBrainDump] User preferences found: ${preferences?.length || 0}`)
    
    // Debug: Log first 5 system words
    console.log(`🔍 [DEBUG] First 5 system words:`, (systemWords || []).slice(0, 5).map(w => ({ id: w.id, word: w.word })))
    
    // Debug: Log user preferences mapping
    console.log(`🔍 [DEBUG] UserPrefs Map size:`, userPrefs.size)
    if (userPrefs.size > 0) {
      console.log(`🔍 [DEBUG] First 5 preferences:`, Array.from(userPrefs.entries()).slice(0, 5))
    }

    // Filter based on user preferences (default to disabled if no preference)
    const enabledSystemWords = (systemWords || [])
      .filter(word => {
        const isEnabled = userPrefs.get(word.id) ?? false
        
        // Debug: Specific word tracking
        if (word.word === 'Reparaties' || word.word === 'Amusement') {
          console.log(`🎯 [SPECIFIC] Word "${word.word}" (${word.id}):`)
          console.log(`   - userPrefs.get(${word.id}) = ${userPrefs.get(word.id)}`)
          console.log(`   - userPrefs.has(${word.id}) = ${userPrefs.has(word.id)}`)
          console.log(`   - Final isEnabled = ${isEnabled}`)
          console.log(`   - Will be included = ${isEnabled}`)
        }
        
        // Debug: Log filtering for first 10 words
        if ((systemWords || []).indexOf(word) < 10) {
          console.log(`🔍 [DEBUG] Word "${word.word}" (${word.id}): preference=${userPrefs.get(word.id)}, enabled=${isEnabled}`)
        }
        return isEnabled
      })
    
    console.log(`✅ [getTriggerWordsForBrainDump] Enabled system words: ${enabledSystemWords.length}`)
    
    // Debug: Log the enabled words
    console.log(`🔍 [DEBUG] All ${enabledSystemWords.length} enabled words:`, enabledSystemWords.map(w => w.word))

    // Get user custom words with full structure (filtered by language)
    const { data: customWords } = await supabase
      .from('user_custom_trigger_words')
      .select(`
        word,
        sub_category:sub_categories!inner(
          id,
          name,
          display_order,
          language,
          main_category:main_categories!inner(
            id,
            name,
            display_order,
            language
          )
        )
      `)
      .eq('user_id', user.user.id)
      .eq('language', language)
      .eq('is_active', true)
      .eq('sub_category.language', language)
      .eq('sub_category.main_category.language', language)

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
    
    console.log(`🎯 [getTriggerWordsForBrainDump] Final result: ${sortedWords.length} words for language ${language}`)
    console.log(`📝 [getTriggerWordsForBrainDump] Sample words:`, sortedWords.slice(0, 5))

    return sortedWords
  } catch {
    // Error occurred while fetching trigger words
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
    console.log(`🔍 [getStructuredTriggerWords] Query for language: ${language}`)
    
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

    console.log(`📊 [getStructuredTriggerWords] System words found: ${systemWords?.length || 0}`)
    if (error) {
      console.error(`❌ [getStructuredTriggerWords] Error:`, error)
      return { categories: [], preferences: {} }
    }

    // Get user preferences for this specific language
    const { data: preferences } = await supabase
      .from('user_trigger_word_preferences')
      .select(`
        system_word_id, 
        is_enabled,
        system_trigger_words!inner(language)
      `)
      .eq('user_id', user.user.id)
      .eq('system_trigger_words.language', language)

    const userPrefs = new Map(preferences?.map(p => [p.system_word_id, p.is_enabled]) || [])
    
    // Load user preferences for the specified language

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
      // Debug: Check for missing category data
      if (!word.sub_category || !word.sub_category.main_category) {
        console.log(`⚠️ [getStructuredTriggerWords] Word "${word.word}" (${word.id}) has missing category data:`)
        console.log(`   - sub_category:`, word.sub_category)
        return // Skip this word
      }
      
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
      const isEnabled = userPrefs.get(word.id) ?? false // Default to disabled if no preference
      subCategory.words.push({
        id: word.id,
        word: word.word,
        enabled: isEnabled
      })
      
      // Default to enabled if no user preference exists
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

    // Count total words in hierarchical structure
    const totalWordsInHierarchy = categories.reduce((total, mainCat) => {
      return total + mainCat.subCategories.reduce((catTotal, subCat) => {
        return catTotal + subCat.words.length
      }, 0)
    }, 0)
    
    console.log(`🎯 [getStructuredTriggerWords] Final hierarchy contains ${totalWordsInHierarchy} words`)
    console.log(`🔍 [getStructuredTriggerWords] Raw systemWords: ${systemWords?.length || 0}`)
    console.log(`📊 [getStructuredTriggerWords] Missing words: ${(systemWords?.length || 0) - totalWordsInHierarchy}`)

    return { categories, preferences: userPrefs }
  } catch {
    // Error occurred while fetching structured trigger words
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
      // Failed to update preference
      return false
    }

    return true
  } catch {
    // Error occurred while updating word preference
    return false
  }
}

// Ensure all preferences exist for a user and language
export async function ensureAllPreferencesExist(userId: string, language: string) {
  try {
    // Get all system words for this language
    const { data: systemWords, error: wordsError } = await supabase
      .from('system_trigger_words')
      .select('id')
      .eq('language', language)
      .eq('is_active', true)

    if (wordsError || !systemWords) {
      // Failed to fetch system words
      return false
    }

    // Get existing preferences
    const { data: existingPrefs, error: prefError } = await supabase
      .from('user_trigger_word_preferences')
      .select('system_word_id')
      .eq('user_id', userId)

    if (prefError) {
      // Failed to fetch user preferences
      return false
    }

    const existingSet = new Set(existingPrefs?.map(p => p.system_word_id) || [])
    
    // Find missing preferences
    const missingPrefs = systemWords
      .filter(word => !existingSet.has(word.id))
      .map(word => ({
        user_id: userId,
        system_word_id: word.id,
        is_enabled: true, // Default to enabled
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

    if (missingPrefs.length > 0) {
      // Create missing preferences with default enabled state
      const { error: insertError } = await supabase
        .from('user_trigger_word_preferences')
        .insert(missingPrefs)

      if (insertError) {
        // Failed to insert missing preferences
        return false
      }
    }

    return true
  } catch {
    // Error occurred while ensuring preferences exist
    return false
  }
}

// Get available categories for user custom words
export async function getAvailableCategoriesV2(language: string = 'nl') {
  try {
    // Get categories that have system words in the specified language
    const { data, error } = await supabase
      .from('sub_categories')
      .select(`
        id,
        name,
        main_category:main_categories(
          id,
          name
        ),
        system_trigger_words!inner(
          language
        )
      `)
      .eq('is_active', true)
      .eq('system_trigger_words.language', language)
      .eq('system_trigger_words.is_active', true)

    if (error || !data) {
      // Failed to fetch categories
      return { mainCategories: [], subCategories: {} }
    }

    const mainCatsMap = new Map()
    const subCatsMap = new Map() // Track unique subcategories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subCats: any = {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((subCat: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mainCatName = (subCat.main_category as any).name
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mainCatId = (subCat.main_category as any).id
      const subCatKey = `${mainCatId}-${subCat.id}`
      
      // Skip if we've already processed this subcategory
      if (subCatsMap.has(subCatKey)) {
        return
      }
      subCatsMap.set(subCatKey, true)
      
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
  } catch {
    // Error occurred while fetching available categories
    return { mainCategories: [], subCategories: {} }
  }
}
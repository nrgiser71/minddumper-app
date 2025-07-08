import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'nl'

    // First, simple test - get all words without joins
    const { data: simpleWords } = await supabase
      .from('system_trigger_words')
      .select('id, word, language, is_active')
      .eq('language', language)
      .limit(5)
      
    // Test: get ALL words and filter manually
    const { data: allDbWords } = await supabase
      .from('system_trigger_words')
      .select('id, word, language, is_active')
      .eq('is_active', true)
      .limit(10)
      
    const dutchWords = allDbWords?.filter(w => w.language === language) || []
      
    console.log(`[DEBUG] Simple query for ${language}: ${simpleWords?.length || 0} words`)
    console.log(`[DEBUG] Manual filter for ${language}: ${dutchWords?.length || 0} words`)
    console.log(`[DEBUG] All DB words: ${allDbWords?.length || 0} words`)
    if (allDbWords && allDbWords.length > 0) {
      console.log(`[DEBUG] First DB word: ${allDbWords[0].word}, language: ${allDbWords[0].language}`)
    }
    
    // Get all system words for the specified language with category information - use same query as get-all-words
    const { data: words, error } = await supabase
      .from('system_trigger_words')
      .select(`
        id,
        word,
        language,
        display_order,
        sub_category_id,
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
      .order('language')
      .order('display_order')

    console.log(`[get-words-by-language] Language: ${language}, Raw words count: ${words?.length || 0}`)
    
    if (error) {
      console.error('Error fetching words by language:', error)
      return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 })
    }

    // Group words by main category and subcategory
    interface GroupedWord {
      id: string
      name: string
      display_order: number
      subcategories: Record<string, {
        id: string
        name: string
        display_order: number
        words: Array<{
          id: string
          word: string
          display_order: number
        }>
      }>
    }

    // Filter and fix words without proper category joins
    const wordsWithCategories = []
    
    for (const word of words || []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subCategory = Array.isArray(word.sub_category) ? word.sub_category[0] : word.sub_category as any
      
      if (subCategory && subCategory.main_category) {
        wordsWithCategories.push({
          ...word,
          sub_category: subCategory
        })
      } else {
        // For words without category joins, create a mock structure
        const mockWord = {
          ...word,
          sub_category: {
            id: word.sub_category_id || 'unknown',
            name: 'Onbekende Categorie',
            display_order: 999,
            main_category: {
              id: 'unknown-main',
              name: language === 'nl' ? 'Persoonlijk' : 'Personal',
              display_order: 999
            }
          }
        }
        wordsWithCategories.push(mockWord)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const groupedWords = wordsWithCategories?.reduce((acc: Record<string, GroupedWord>, word: any) => {
      const mainCat = word.sub_category.main_category
      const subCat = word.sub_category
      
      if (!acc[mainCat.name]) {
        acc[mainCat.name] = {
          id: mainCat.id,
          name: mainCat.name,
          display_order: mainCat.display_order,
          subcategories: {}
        }
      }
      
      if (!acc[mainCat.name].subcategories[subCat.name]) {
        acc[mainCat.name].subcategories[subCat.name] = {
          id: subCat.id,
          name: subCat.name,
          display_order: subCat.display_order,
          words: []
        }
      }
      
      acc[mainCat.name].subcategories[subCat.name].words.push({
        id: word.id,
        word: word.word,
        display_order: word.display_order
      })
      
      return acc
    }, {}) || {}

    // Convert to arrays and sort
    const sortedData = Object.values(groupedWords)
      .sort((a, b) => a.display_order - b.display_order)
      .map((mainCat) => ({
        ...mainCat,
        subcategories: Object.values(mainCat.subcategories)
          .sort((a, b) => a.display_order - b.display_order)
          .map((subCat) => ({
            ...subCat,
            words: subCat.words.sort((a, b) => a.word.localeCompare(b.word))
          }))
      }))

    return NextResponse.json({ 
      success: true, 
      data: sortedData,
      totalWords: wordsWithCategories?.length || 0,
      language,
      debug: {
        simpleWordsCount: simpleWords?.length || 0,
        manualFilterCount: dutchWords?.length || 0,
        allDbWordsCount: allDbWords?.length || 0,
        rawWordsCount: words?.length || 0,
        processedWordsCount: wordsWithCategories?.length || 0
      }
    })

  } catch (error) {
    console.error('Error in get-words-by-language API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
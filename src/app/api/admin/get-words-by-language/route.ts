import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'nl'

    // Get all system words for the specified language with category information
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
      .eq('sub_category.is_active', true)
      .eq('sub_category.main_category.is_active', true)
      .order('display_order')

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
      language 
    })

  } catch (error) {
    console.error('Error in get-words-by-language API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
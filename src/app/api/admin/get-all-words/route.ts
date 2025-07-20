import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  // Verify admin authentication
  if (!verifyAdminSessionFromRequest(request)) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized access' 
    }, { status: 401 })
  }
  try {
    // First check if we have any Dutch words at all
    const { data: allWords } = await supabase
      .from('system_trigger_words')
      .select('language')
      .eq('is_active', true)

    const languageCounts = allWords?.reduce((acc: Record<string, number>, word) => {
      acc[word.language] = (acc[word.language] || 0) + 1
      return acc
    }, {}) || {}

    console.log('Language counts in system_trigger_words:', languageCounts)

    // Get all system words with their categories
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
      .eq('is_active', true)
      .order('language')
      .order('display_order')

    if (error) {
      console.error('Error fetching words:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    // Filter and fix words without proper category joins
    const wordsWithCategories = []
    const wordsWithoutCategories = []

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
              name: word.language === 'nl' ? 'Persoonlijk' : 'Personal',
              display_order: 999
            }
          }
        }
        wordsWithCategories.push(mockWord)
        wordsWithoutCategories.push({
          id: word.id,
          word: word.word,
          language: word.language,
          sub_category_id: word.sub_category_id
        })
      }
    }

    console.log(`Words with categories: ${wordsWithCategories.length}`)
    console.log(`Words without categories: ${wordsWithoutCategories.length}`)
    if (wordsWithoutCategories.length > 0) {
      console.log('Sample words without categories:', wordsWithoutCategories.slice(0, 5))
    }

    return NextResponse.json({ 
      success: true, 
      words: wordsWithCategories,
      debug: {
        languageCounts,
        totalWords: words?.length || 0,
        wordsWithCategories: wordsWithCategories.length - wordsWithoutCategories.length,
        wordsWithoutCategories: wordsWithoutCategories.length,
        sampleWithoutCategories: wordsWithoutCategories.slice(0, 3)
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
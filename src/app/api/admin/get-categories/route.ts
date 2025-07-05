import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Try new database structure first
    const { data: mainCategories, error: mainError } = await supabase
      .from('main_categories')
      .select(`
        id,
        name,
        display_order,
        sub_categories (
          id,
          name,
          display_order
        )
      `)
      .eq('is_active', true)
      .order('display_order')

    if (!mainError && mainCategories && mainCategories.length > 0) {
      // New structure exists, use it
      const categories = mainCategories.map(mainCat => ({
        id: mainCat.id,
        name: mainCat.name,
        display_order: mainCat.display_order,
        subCategories: (mainCat.sub_categories || []).sort((a: {display_order: number}, b: {display_order: number}) => a.display_order - b.display_order)
      }))

      return NextResponse.json({ 
        success: true,
        categories: categories.sort((a, b) => a.display_order - b.display_order)
      })
    }

    // Fallback to old structure
    const { data: words, error } = await supabase
      .from('trigger_words')
      .select('category, word')
      .eq('language', 'nl')
      .eq('is_active', true)

    if (error) {
      throw error
    }

    // Group by category and count
    const categoryMap = new Map<string, { count: number, mainCategory: string, words: string[] }>()
    
    for (const word of words || []) {
      const category = word.category || 'Algemeen'
      let mainCat = 'Persoonlijk'
      let subCat = category
      
      // Check if category contains main category info
      if (category.includes('|')) {
        const [main, sub] = category.split('|')
        mainCat = main
        subCat = sub
      }
      
      if (!categoryMap.has(subCat)) {
        categoryMap.set(subCat, { count: 0, mainCategory: mainCat, words: [] })
      }
      
      const current = categoryMap.get(subCat)!
      current.count++
      current.words.push(word.word)
    }

    // Convert to array
    const categories = Array.from(categoryMap.entries()).map(([subCategory, data]) => ({
      subCategory,
      wordCount: data.count,
      currentMain: data.mainCategory,
      words: data.words.sort()
    }))

    return NextResponse.json({ 
      success: true,
      categories: categories.sort((a, b) => a.subCategory.localeCompare(b.subCategory))
    })

  } catch (error) {
    // Error getting categories
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
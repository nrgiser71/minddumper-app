import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { changes } = await request.json()

    if (!changes || Object.keys(changes).length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geen wijzigingen opgegeven' 
      }, { status: 400 })
    }

    // Updating categories

    let updateCount = 0
    let errorCount = 0

    // For each change, update all words in that category
    for (const [subCategory, newMainCategory] of Object.entries(changes)) {
      // First get all words with this subcategory
      const { data: words, error: fetchError } = await supabase
        .from('trigger_words')
        .select('id, category')
        .eq('language', 'nl')

      if (fetchError) {
        // Error fetching words for category
        errorCount++
        continue
      }

      // Filter words that match this subcategory
      const matchingWords = words?.filter(word => {
        if (word.category?.includes('|')) {
          const [, sub] = word.category.split('|')
          return sub === subCategory
        }
        return word.category === subCategory
      }) || []

      // Found words in category

      // Update each matching word
      for (const word of matchingWords) {
        const newCategory = `${newMainCategory}|${subCategory}`
        
        const { error: updateError } = await supabase
          .from('trigger_words')
          .update({ category: newCategory })
          .eq('id', word.id)

        if (updateError) {
          // Error updating word
          errorCount++
        } else {
          updateCount++
        }
      }
    }

    // Updated words

    return NextResponse.json({ 
      success: true,
      message: `Categorieën succesvol bijgewerkt`,
      updateCount,
      errorCount
    })

  } catch (error) {
    // Error updating categories
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Onbekende fout' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to update category mappings',
    usage: 'POST /api/admin/update-categories',
    example: {
      changes: {
        'Projecten': 'Professioneel',
        'Familie': 'Persoonlijk'
      }
    }
  })
}
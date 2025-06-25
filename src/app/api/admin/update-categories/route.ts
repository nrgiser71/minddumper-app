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

    console.log(`🔧 Updating categories:`, changes)

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
        console.error(`Error fetching words for ${subCategory}:`, fetchError)
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

      console.log(`Found ${matchingWords.length} words in category "${subCategory}"`)

      // Update each matching word
      for (const word of matchingWords) {
        const newCategory = `${newMainCategory}|${subCategory}`
        
        const { error: updateError } = await supabase
          .from('trigger_words')
          .update({ category: newCategory })
          .eq('id', word.id)

        if (updateError) {
          console.error(`Error updating word:`, updateError)
          errorCount++
        } else {
          updateCount++
        }
      }
    }

    console.log(`✅ Updated ${updateCount} words, ${errorCount} errors`)

    return NextResponse.json({ 
      success: true,
      message: `Categorieën succesvol bijgewerkt`,
      updateCount,
      errorCount
    })

  } catch (error) {
    console.error('❌ Error updating categories:', error)
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
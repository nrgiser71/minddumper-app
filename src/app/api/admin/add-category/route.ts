import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { mainCategory, subCategory, words } = await request.json()

    if (!mainCategory || !subCategory || !words) {
      return NextResponse.json({ 
        success: false, 
        error: 'Alle velden zijn verplicht' 
      }, { status: 400 })
    }

    console.log(`🚀 Adding category: ${mainCategory} > ${subCategory}`)

    // Split comma-separated words and clean them up
    const wordList = words
      .split(',')
      .map((word: string) => word.trim())
      .filter((word: string) => word.length > 0)

    console.log(`📝 Processing ${wordList.length} words:`, wordList)

    let successCount = 0
    let errorCount = 0

    // Insert each word individually
    for (const word of wordList) {
      const { error } = await supabase
        .from('trigger_words')
        .insert({
          language: 'nl',
          word: word,
          category: `${mainCategory}|${subCategory}`, // Store main category info
          is_active: true
        })

      if (error) {
        console.error(`❌ Error inserting word "${word}":`, error)
        errorCount++
      } else {
        console.log(`✅ Inserted word: "${word}"`)
        successCount++
      }
    }

    console.log(`✅ Category "${subCategory}" completed: ${successCount} success, ${errorCount} errors`)
    
    return NextResponse.json({ 
      success: true, 
      message: `Categorie "${subCategory}" succesvol toegevoegd`,
      wordCount: successCount,
      errorCount,
      mainCategory,
      subCategory,
      words: wordList
    })

  } catch (error) {
    console.error('❌ Error adding category:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Onbekende fout' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to add a new category with comma-separated words',
    usage: 'POST /api/admin/add-category',
    example: {
      mainCategory: 'Professioneel',
      subCategory: 'Projecten', 
      words: 'Gestart maar niet afgerond, Nog te starten, Nog te beoordelen'
    }
  })
}
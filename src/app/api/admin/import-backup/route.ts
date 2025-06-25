import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const backup = await request.json()

    // Validate backup structure
    if (!backup.version || !backup.structure || !backup.language) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid backup file format' 
      }, { status: 400 })
    }

    console.log(`📥 Importing backup from ${backup.exportDate}...`)
    console.log(`Language: ${backup.language}, Words: ${backup.totalWords}`)

    // Clear existing words for this language
    console.log('🗑️ Clearing existing words...')
    const { error: deleteError } = await supabase
      .from('trigger_words')
      .delete()
      .eq('language', backup.language)

    if (deleteError) {
      console.error('Warning: Could not clear existing words:', deleteError)
    }

    let successCount = 0
    let errorCount = 0

    // Import from structure
    for (const [mainCategory, subCategories] of Object.entries(backup.structure)) {
      for (const [subCategory, words] of Object.entries(subCategories as Record<string, string[]>)) {
        for (const word of words) {
          const { error } = await supabase
            .from('trigger_words')
            .insert({
              language: backup.language,
              word: word,
              category: `${mainCategory}|${subCategory}`,
              is_active: true
            })

          if (error) {
            console.error(`Error inserting word "${word}":`, error)
            errorCount++
          } else {
            successCount++
          }
        }
      }
    }

    console.log(`✅ Import completed: ${successCount} success, ${errorCount} errors`)

    return NextResponse.json({ 
      success: true,
      message: `Backup imported successfully!`,
      imported: successCount,
      errors: errorCount,
      originalCount: backup.totalWords
    })

  } catch (error) {
    console.error('❌ Error importing backup:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST with backup JSON to import',
    usage: 'POST /api/admin/import-backup',
    expectedFormat: {
      version: '1.0',
      exportDate: 'ISO date string',
      language: 'nl',
      totalWords: 'number',
      structure: {
        'Professioneel': {
          'SubCategory': ['word1', 'word2']
        }
      }
    }
  })
}
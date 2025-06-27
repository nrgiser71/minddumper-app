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

    // Importing backup

    // Clear existing words for this language
    // Clearing existing words
    const { error: deleteError } = await supabase
      .from('trigger_words')
      .delete()
      .eq('language', backup.language)

    if (deleteError) {
      // Warning: Could not clear existing words
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
            // Error inserting word
            errorCount++
          } else {
            successCount++
          }
        }
      }
    }

    // Import completed

    return NextResponse.json({ 
      success: true,
      message: `Backup imported successfully!`,
      imported: successCount,
      errors: errorCount,
      originalCount: backup.totalWords
    })

  } catch (error) {
    // Error importing backup
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
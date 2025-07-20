import { NextResponse } from 'next/server'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  // Verify admin authentication
  if (!verifyAdminSessionFromRequest(request)) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized access' 
    }, { status: 401 })
  }

  try {
    const jsonData = await request.json()
    
    // Validate JSON structure
    if (!jsonData.structure || !jsonData.rawData) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON format. Expected structure and rawData fields.' 
      })
    }

    // Input validation and sanitization
    const language = validateLanguage(jsonData.language || 'nl')
    const structure = validateStructure(jsonData.structure)
    
    // Use safe database operations instead of generating SQL
    const result = await performSafeImport(structure, language)
    
    return NextResponse.json({ 
      success: true,
      result,
      message: 'Data imported successfully using secure database operations',
      stats: {
        totalWords: result.totalWords,
        mainCategories: Object.keys(structure).length,
        language: language
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Import failed - invalid data' 
    }, { status: 400 })
  }
}

// Input validation functions
function validateLanguage(language: string): string {
  // Only allow specific language codes
  const allowedLanguages = ['nl', 'en', 'de', 'fr', 'es']
  if (!allowedLanguages.includes(language)) {
    throw new Error('Invalid language code')
  }
  return language
}

function validateStructure(structure: unknown): Record<string, Record<string, string[]>> {
  if (!structure || typeof structure !== 'object') {
    throw new Error('Invalid structure format')
  }
  
  const validated: Record<string, Record<string, string[]>> = {}
  
  for (const [mainCat, subCategories] of Object.entries(structure)) {
    // Validate main category name
    if (typeof mainCat !== 'string' || mainCat.length > 100 || !/^[a-zA-Z0-9\s\-_]+$/.test(mainCat)) {
      throw new Error(`Invalid main category name: ${mainCat}`)
    }
    
    if (!subCategories || typeof subCategories !== 'object') {
      throw new Error(`Invalid subcategories for ${mainCat}`)
    }
    
    validated[mainCat] = {}
    
    for (const [subCat, words] of Object.entries(subCategories as Record<string, unknown>)) {
      // Validate subcategory name
      if (typeof subCat !== 'string' || subCat.length > 100 || !/^[a-zA-Z0-9\s\-_]+$/.test(subCat)) {
        throw new Error(`Invalid subcategory name: ${subCat}`)
      }
      
      // Validate words array
      if (!Array.isArray(words)) {
        throw new Error(`Words must be an array for ${mainCat}/${subCat}`)
      }
      
      const validatedWords = words.filter(word => 
        typeof word === 'string' && 
        word.length > 0 && 
        word.length <= 200 &&
        !/[<>;"'\\]/.test(word) // Basic XSS protection
      )
      
      validated[mainCat][subCat] = validatedWords
    }
  }
  
  return validated
}

// Safe database import using parameterized queries
async function performSafeImport(structure: Record<string, Record<string, string[]>>, language: string) {
  let totalWords = 0
  
  // 1. Clear existing data for this language
  await supabase
    .from('system_trigger_words')
    .delete()
    .eq('language', language)
  
  // 2. Process main categories
  for (const [mainCategoryName, subCategories] of Object.entries(structure)) {
    const displayOrder = Object.keys(structure).indexOf(mainCategoryName) + 1
    
    // Insert/update main category
    const { data: mainCat } = await supabase
      .from('main_categories')
      .upsert({
        name: mainCategoryName,
        display_order: displayOrder,
        language: language
      }, {
        onConflict: 'name,language'
      })
      .select('id')
      .single()
    
    if (!mainCat) continue
    
    // 3. Process subcategories
    for (const [subCategoryName, words] of Object.entries(subCategories)) {
      const subDisplayOrder = Object.keys(subCategories).indexOf(subCategoryName) + 1
      
      // Insert/update subcategory
      const { data: subCat } = await supabase
        .from('sub_categories')
        .upsert({
          main_category_id: mainCat.id,
          name: subCategoryName,
          display_order: subDisplayOrder,
          language: language
        }, {
          onConflict: 'main_category_id,name,language'
        })
        .select('id')
        .single()
      
      if (!subCat) continue
      
      // 4. Insert words
      if (words.length > 0) {
        const wordsToInsert = words.map((word, index) => ({
          sub_category_id: subCat.id,
          word: word,
          language: language,
          display_order: index + 1,
          is_active: true
        }))
        
        await supabase
          .from('system_trigger_words')
          .insert(wordsToInsert)
        
        totalWords += words.length
      }
    }
  }
  
  return { totalWords, language }
}

export async function GET(request: Request) {
  // Verify admin authentication
  if (!verifyAdminSessionFromRequest(request)) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized access' 
    }, { status: 401 })
  }

  return NextResponse.json({ 
    message: 'POST your JSON backup to this endpoint for secure import',
    expectedFormat: {
      version: "1.0",
      language: "nl", 
      totalWords: 264,
      structure: {
        "Professioneel": {
          "Werk": ["word1", "word2"],
          "Projecten": ["word3", "word4"]
        },
        "Persoonlijk": {
          "Familie": ["word5", "word6"]
        }
      },
      rawData: "array of original word objects (optional)"
    },
    security: "This endpoint uses parameterized queries and input validation"
  })
}
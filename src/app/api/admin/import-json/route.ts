import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const jsonData = await request.json()
    
    // Validate JSON structure
    if (!jsonData.structure || !jsonData.rawData) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON format. Expected structure and rawData fields.' 
      })
    }

    // Generate SQL to import the structured data
    const sql = generateImportSQL(jsonData)
    
    return NextResponse.json({ 
      success: true,
      sql,
      instruction: 'Copy this SQL and run it in Supabase Dashboard > SQL Editor',
      steps: [
        '1. This will clear existing system_trigger_words',
        '2. Import all words from your JSON backup into the new normalized structure', 
        '3. Maintain the exact category hierarchy from your backup',
        '4. Set proper display orders for consistent sorting'
      ],
      stats: {
        totalWords: jsonData.totalWords || 'unknown',
        mainCategories: Object.keys(jsonData.structure).length,
        language: jsonData.language || 'nl'
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}

interface JsonData {
  structure: Record<string, Record<string, string[]>>
  language?: string
  totalWords?: number
}

function generateImportSQL(jsonData: JsonData): string {
  const { structure } = jsonData
  
  let sql = `-- Import trigger words from JSON backup
-- Clear existing system trigger words first
DELETE FROM system_trigger_words;

-- Import structured data from JSON backup
`
  
  // Process each main category
  for (const [mainCategoryName, subCategories] of Object.entries(structure)) {
    
    // Process each subcategory
    for (const [subCategoryName, words] of Object.entries(subCategories as Record<string, string[]>)) {
      if (Array.isArray(words) && words.length > 0) {
        sql += `
-- Insert words for ${mainCategoryName} > ${subCategoryName}
INSERT INTO system_trigger_words (sub_category_id, word, language, display_order, is_active)
SELECT 
  sc.id as sub_category_id,
  words.word,
  '${jsonData.language || 'nl'}' as language,
  words.display_order,
  true as is_active
FROM (
  SELECT mc.id as main_id FROM main_categories mc WHERE mc.name = '${mainCategoryName}'
) main_cat
JOIN sub_categories sc ON sc.main_category_id = main_cat.main_id AND sc.name = '${subCategoryName}'
CROSS JOIN (VALUES
${words.map((word, index) => `  ('${word.replace(/'/g, "''")}', ${index + 1})`).join(',\n')}
) AS words(word, display_order);
`
      }
    }
  }

  sql += `
-- Update display orders for consistent sorting
UPDATE sub_categories SET display_order = subq.new_order
FROM (
  SELECT 
    sc.id,
    ROW_NUMBER() OVER (PARTITION BY sc.main_category_id ORDER BY sc.name) as new_order
  FROM sub_categories sc
) subq
WHERE sub_categories.id = subq.id;

-- Show import results
SELECT 'Import completed successfully!' as result;
SELECT 
  mc.name as main_category,
  sc.name as sub_category,
  COUNT(stw.id) as word_count
FROM main_categories mc
JOIN sub_categories sc ON sc.main_category_id = mc.id
LEFT JOIN system_trigger_words stw ON stw.sub_category_id = sc.id
GROUP BY mc.name, sc.name, mc.display_order, sc.display_order
ORDER BY mc.display_order, sc.display_order;
`

  return sql
}

export async function GET() {
  return NextResponse.json({ 
    message: 'POST your JSON backup to this endpoint to generate import SQL',
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
    }
  })
}
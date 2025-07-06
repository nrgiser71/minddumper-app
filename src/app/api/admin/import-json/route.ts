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
        `1. This will clear existing words for language: ${jsonData.language || 'nl'}`,
        '2. Import words from your JSON backup into the normalized structure', 
        '3. Maintain the exact category hierarchy from your backup',
        '4. Categories will be shared across languages (safe for multilingual setup)',
        '5. Other languages remain untouched'
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
  const language = jsonData.language || 'nl'
  
  let sql = `-- Import MULTILINGUAL data from JSON backup
-- Language: ${language}
-- Only affects data for this specific language

-- Clear existing data for this language only
DELETE FROM system_trigger_words WHERE language = '${language}';

-- Insert/Update main categories with language support
INSERT INTO main_categories (name, display_order, language) VALUES
${Object.keys(structure).map((mainCat, index) => `('${mainCat}', ${index + 1}, '${language}')`).join(',\n')}
ON CONFLICT (name, language) DO UPDATE SET display_order = EXCLUDED.display_order;

-- Insert/Update subcategories
`
  
  // Process each main category
  for (const [mainCategoryName, subCategories] of Object.entries(structure)) {
    const subCatNames = Object.keys(subCategories);
    if (subCatNames.length > 0) {
      sql += `
-- Subcategories for ${mainCategoryName}
INSERT INTO sub_categories (main_category_id, name, display_order, language)
SELECT mc.id, subcats.name, subcats.display_order, '${language}'
FROM main_categories mc,
(VALUES
${subCatNames.map((subCat, index) => `  ('${subCat.replace(/'/g, "''")}', ${index + 1})`).join(',\n')}
) AS subcats(name, display_order)
WHERE mc.name = '${mainCategoryName}' AND mc.language = '${language}'
ON CONFLICT (main_category_id, name, language) DO UPDATE SET display_order = EXCLUDED.display_order;
`
    }
  }

  sql += `
-- Import all trigger words
`

  // Process words
  for (const [mainCategoryName, subCategories] of Object.entries(structure)) {
    for (const [subCategoryName, words] of Object.entries(subCategories as Record<string, string[]>)) {
      if (Array.isArray(words) && words.length > 0) {
        sql += `
-- Words for ${mainCategoryName} > ${subCategoryName} (${language})
INSERT INTO system_trigger_words (sub_category_id, word, language, display_order, is_active)
SELECT 
  sc.id as sub_category_id,
  words.word,
  '${language}' as language,
  words.display_order,
  true as is_active
FROM main_categories mc
JOIN sub_categories sc ON sc.main_category_id = mc.id AND sc.name = '${subCategoryName.replace(/'/g, "''")}' AND sc.language = '${language}'
CROSS JOIN (VALUES
${words.map((word, index) => `  ('${word.replace(/'/g, "''")}', ${index + 1})`).join(',\n')}
) AS words(word, display_order)
WHERE mc.name = '${mainCategoryName}' AND mc.language = '${language}';
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
SELECT 'Import completed successfully for language: ${language}' as result;
SELECT 
  mc.name as main_category,
  sc.name as sub_category,
  COUNT(stw.id) as word_count,
  stw.language
FROM main_categories mc
JOIN sub_categories sc ON sc.main_category_id = mc.id
LEFT JOIN system_trigger_words stw ON stw.sub_category_id = sc.id
WHERE stw.language = '${language}' OR stw.language IS NULL
GROUP BY mc.name, sc.name, mc.display_order, sc.display_order, stw.language
ORDER BY mc.display_order, sc.display_order;

-- Show total words per language
SELECT 
  language,
  COUNT(*) as total_words
FROM system_trigger_words 
GROUP BY language
ORDER BY language;
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
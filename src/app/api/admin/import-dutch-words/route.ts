import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Get all Dutch words from the old trigger_words table
    const { data: oldWords, error: oldError } = await supabase
      .from('trigger_words')
      .select('word, category')
      .eq('language', 'nl')
      .eq('is_active', true)

    if (oldError) {
      console.error('Error fetching old Dutch words:', oldError)
      return NextResponse.json({ success: false, error: oldError.message })
    }

    console.log(`Found ${oldWords?.length || 0} Dutch words to import`)

    // Get existing category mapping
    const { data: mainCategories, error: mainError } = await supabase
      .from('main_categories')
      .select(`
        id,
        name,
        sub_categories (
          id,
          name
        )
      `)
      .eq('is_active', true)

    if (mainError) {
      console.error('Error fetching categories:', mainError)
      return NextResponse.json({ success: false, error: mainError.message })
    }

    // Create mapping from old category names to new subcategory IDs
    const categoryMapping = new Map<string, string>()
    
    // Helper function to find matching subcategory
    const findSubCategory = (categoryString: string) => {
      // Parse old category format: "MainCategory|SubCategory" or "MainCategory – SubCategory"
      let mainCat = ''
      let subCat = ''
      
      if (categoryString.includes('|')) {
        [mainCat, subCat] = categoryString.split('|').map(s => s.trim())
      } else if (categoryString.includes('–')) {
        [mainCat, subCat] = categoryString.split('–').map(s => s.trim())
      } else {
        // Fallback - use entire string as subcategory, guess main category
        subCat = categoryString.trim()
        if (subCat.toLowerCase().includes('project') || subCat.toLowerCase().includes('werk')) {
          mainCat = 'Beruflich'
        } else {
          mainCat = 'Persönlich'
        }
      }

      // Map Dutch main categories to existing German ones
      const mainCategoryMapping: Record<string, string> = {
        'Professioneel': 'Beruflich',
        'Persoonlijk': 'Persönlich',
        'Projecten': 'Beruflich',
        'Project': 'Beruflich',
        'Werk': 'Beruflich',
        'Work': 'Beruflich',
        'Business': 'Beruflich',
        'Personal': 'Persönlich',
        'Privé': 'Persönlich'
      }

      const mappedMainCat = mainCategoryMapping[mainCat] || mainCat

      // Find matching subcategory
      for (const mainCategory of mainCategories || []) {
        if (mainCategory.name === mappedMainCat || mainCategory.name.toLowerCase() === mappedMainCat.toLowerCase()) {
          for (const subCategory of mainCategory.sub_categories || []) {
            // Try exact match first
            if (subCategory.name === subCat) {
              return subCategory.id
            }
            // Try partial match
            if (subCategory.name.toLowerCase().includes(subCat.toLowerCase()) || 
                subCat.toLowerCase().includes(subCategory.name.toLowerCase())) {
              return subCategory.id
            }
          }
        }
      }

      // Fallback - return first subcategory of first main category
      if (mainCategories && mainCategories[0] && mainCategories[0].sub_categories && mainCategories[0].sub_categories[0]) {
        console.warn(`No matching subcategory found for "${categoryString}", using fallback`)
        return mainCategories[0].sub_categories[0].id
      }

      return null
    }

    // Build mapping for all categories
    for (const word of oldWords || []) {
      if (!categoryMapping.has(word.category)) {
        const subCategoryId = findSubCategory(word.category)
        if (subCategoryId) {
          categoryMapping.set(word.category, subCategoryId)
        }
      }
    }

    console.log(`Created ${categoryMapping.size} category mappings`)

    // Prepare Dutch words for insertion
    let importedCount = 0
    const wordsToInsert = []

    for (const word of oldWords || []) {
      const subCategoryId = categoryMapping.get(word.category)
      if (subCategoryId) {
        wordsToInsert.push({
          word: word.word,
          language: 'nl',
          sub_category_id: subCategoryId,
          display_order: importedCount + 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        importedCount++
      } else {
        console.warn(`Skipping word "${word.word}" - no subcategory mapping for "${word.category}"`)
      }
    }

    console.log(`Prepared ${wordsToInsert.length} words for insertion`)

    // Insert Dutch words in batches
    if (wordsToInsert.length > 0) {
      const batchSize = 100
      for (let i = 0; i < wordsToInsert.length; i += batchSize) {
        const batch = wordsToInsert.slice(i, i + batchSize)
        const { error: insertError } = await supabase
          .from('system_trigger_words')
          .insert(batch)

        if (insertError) {
          console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError)
          return NextResponse.json({ 
            success: false, 
            error: `Failed to insert batch: ${insertError.message}`,
            imported: i
          })
        }
        
        console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(wordsToInsert.length / batchSize)}`)
      }
    }

    return NextResponse.json({ 
      success: true, 
      imported: importedCount,
      totalOldWords: oldWords?.length || 0,
      categoryMappings: categoryMapping.size
    })

  } catch (error) {
    console.error('Import Dutch words error:', error)
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    })
  }
}
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // First, clear all existing Dutch words to avoid duplicates
    await supabase
      .from('system_trigger_words')
      .delete()
      .eq('language', 'nl')

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

    // Get existing German words with their subcategory mappings to use as a reference
    const { error: germanError } = await supabase
      .from('system_trigger_words')
      .select('word, sub_category_id')
      .eq('language', 'de')
      .eq('is_active', true)
      .limit(50)

    if (germanError) {
      console.error('Error fetching German words for reference:', germanError)
      return NextResponse.json({ success: false, error: germanError.message })
    }

    // Create a simple mapping based on category names to existing subcategories
    const { data: subCategories, error: subError } = await supabase
      .from('sub_categories')
      .select('id, name')
      .eq('is_active', true)

    if (subError) {
      console.error('Error fetching subcategories:', subError)
      return NextResponse.json({ success: false, error: subError.message })
    }

    // Create a mapping from Dutch category names to subcategory IDs
    const categoryMapping = new Map<string, string>()

    // Manual mapping for common Dutch categories to existing German subcategories
    const manualMappings: Record<string, string> = {
      'Boodschappen': 'Einkauf',
      'Administratie': 'Administration',
      'Familie': 'Familie',
      'Gezondheid': 'Gesundheit',
      'Huis / Huishouding': 'Haus & Haushalt',
      'Huisdieren': 'Haustiere',
      'Juridisch': 'Rechtliches',
      'Kleding': 'Kleidung',
      'Ontspanning': 'Freizeit',
      'Persoonlijke Ontwikkeling': 'Persönliche Entwicklung',
      'Projecten – Andere Organisaties': 'Organisationen',
      'Speciale Gebeurtenissen': 'Events',
      'Vervoer': 'Mobilität',
      'Wijk': 'Nachbarschaft',
      'Communicatie zelf initiëren / reageren op': 'Kommunikation'
    }

    // Build the mapping
    for (const [dutchName, germanName] of Object.entries(manualMappings)) {
      const subCat = subCategories?.find(sc => sc.name === germanName)
      if (subCat) {
        categoryMapping.set(dutchName, subCat.id)
      }
    }

    // Add more mappings for categories that don't have direct matches
    // Use the first available subcategory as fallback
    const fallbackSubCategoryId = subCategories?.[0]?.id

    console.log(`Created ${categoryMapping.size} category mappings`)

    // Prepare Dutch words for insertion
    let importedCount = 0
    const wordsToInsert = []

    for (const word of oldWords || []) {
      // Parse the category
      let categoryName = word.category
      if (categoryName?.includes('|')) {
        categoryName = categoryName.split('|')[1]?.trim() || categoryName
      } else if (categoryName?.includes('–')) {
        categoryName = categoryName.split('–')[1]?.trim() || categoryName
      }

      let subCategoryId = categoryMapping.get(categoryName || '')
      
      // If no mapping found, use fallback
      if (!subCategoryId) {
        subCategoryId = fallbackSubCategoryId
        console.log(`Using fallback subcategory for: ${categoryName}`)
      }

      if (subCategoryId) {
        wordsToInsert.push({
          word: word.word,
          language: 'nl',
          sub_category_id: subCategoryId,
          display_order: importedCount + 1,
          is_active: true,
          created_at: new Date().toISOString()
        })
        importedCount++
      } else {
        console.warn(`Skipping word "${word.word}" - no subcategory available`)
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
      categoryMappings: categoryMapping.size,
      sampleMappings: Object.fromEntries(Array.from(categoryMapping.entries()).slice(0, 5))
    })

  } catch (error) {
    console.error('Import Dutch words v2 error:', error)
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    })
  }
}
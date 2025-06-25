import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Correct mapping of subcategories to main categories based on your PDFs
const categoryMapping: Record<string, string> = {
  // Professioneel
  'Projecten': 'Professioneel',
  'Verplichtingen/beloften aan anderen': 'Professioneel',
  'Communicatie zelf initiëren/reageren op': 'Professioneel',
  'Schrijfwerk: te doen/in te leveren': 'Professioneel',
  'Lezen/bekijken': 'Professioneel',
  'Financieel': 'Professioneel',
  'Planning/organisatie': 'Professioneel',
  'Organisatieontwikkeling': 'Professioneel',
  'Marketing/promotie': 'Professioneel',
  'Administratie': 'Professioneel',
  'Medewerkers': 'Professioneel',
  'Systemen': 'Professioneel',
  'Verkoop': 'Professioneel',
  'Vergaderingen': 'Professioneel',
  'Wachten op': 'Professioneel',
  'Professionele ontwikkeling': 'Professioneel',
  'Kledingkast': 'Professioneel',
  
  // Persoonlijk
  'Projecten - andere organisaties': 'Persoonlijk',
  'Verplichtingen/beloften aan anderen (persoonlijk)': 'Persoonlijk',
  'Communicatie zelf initiëren / reageren op': 'Persoonlijk',
  'Speciale gebeurtenissen': 'Persoonlijk',
  'Administratie (persoonlijk)': 'Persoonlijk',
  'Ontspanning': 'Persoonlijk',
  'Financieel (persoonlijk)': 'Persoonlijk',
  'Huisdieren': 'Persoonlijk',
  'Juridisch': 'Persoonlijk',
  'Wachten op (persoonlijk)': 'Persoonlijk',
  'Familie': 'Persoonlijk',
  'Huis/Huishouding': 'Persoonlijk',
  'Gezondheid': 'Persoonlijk',
  'Persoonlijke ontwikkeling': 'Persoonlijk',
  'Vervoer': 'Persoonlijk',
  'Kleding': 'Persoonlijk',
  'Boodschappen': 'Persoonlijk',
  'Wijk': 'Persoonlijk'
}

export async function POST() {
  try {
    console.log('🔧 Fixing category mappings...')

    // Get all Dutch words
    const { data: words, error: fetchError } = await supabase
      .from('trigger_words')
      .select('*')
      .eq('language', 'nl')

    if (fetchError) {
      throw fetchError
    }

    let updateCount = 0
    let errorCount = 0

    for (const word of words || []) {
      const currentCategory = word.category
      
      // Skip if already in new format
      if (currentCategory && currentCategory.includes('|')) {
        continue
      }

      // Find the main category for this subcategory
      const mainCategory = categoryMapping[currentCategory] || 'Persoonlijk'
      const newCategory = `${mainCategory}|${currentCategory}`

      const { error: updateError } = await supabase
        .from('trigger_words')
        .update({ category: newCategory })
        .eq('id', word.id)

      if (updateError) {
        console.error(`Error updating word ${word.word}:`, updateError)
        errorCount++
      } else {
        updateCount++
      }
    }

    console.log(`✅ Fixed ${updateCount} words, ${errorCount} errors`)

    return NextResponse.json({ 
      success: true,
      message: `Category mappings fixed! Updated ${updateCount} words.`,
      updateCount,
      errorCount
    })

  } catch (error) {
    console.error('❌ Error fixing categories:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to fix category mappings',
    usage: 'POST /api/admin/fix-categories'
  })
}
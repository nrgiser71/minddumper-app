import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Running database improvements...')

    // Improvement 1: Add more Dutch trigger words
    const dutchWords = [
      ['Vergaderingen', 'professional'],
      ['Deadlines', 'professional'],
      ['Projecten', 'professional'],
      ['Collega\'s', 'professional'],
      ['Presentaties', 'professional'],
      ['Rapportages', 'professional'],
      ['Email', 'professional'],
      ['Planning', 'professional'],
      ['Kinderen', 'personal'],
      ['Partner', 'personal'],
      ['Ouders', 'personal'],
      ['Verjaardag', 'personal'],
      ['Afspraken', 'personal'],
      ['Boodschappen', 'personal'],
      ['Schoonmaken', 'personal'],
      ['Onderhoud', 'personal'],
      ['Dokter', 'health'],
      ['Tandarts', 'health'],
      ['Medicijnen', 'health'],
      ['Voeding', 'health'],
      ['Slapen', 'health'],
      ['Stress', 'health'],
      ['Ontspanning', 'health'],
      ['Budget', 'finance'],
      ['Rekeningen', 'finance'],
      ['Belastingen', 'finance'],
      ['Sparen', 'finance'],
      ['Verzekeringen', 'finance'],
      ['Bankzaken', 'finance'],
      ['Cursussen', 'education'],
      ['Vaardigheden', 'education'],
      ['Lezen', 'education'],
      ['Doelen', 'education']
    ]

    console.log('📝 Adding Dutch trigger words...')
    for (const [word, category] of dutchWords) {
      const { error } = await supabase
        .from('trigger_words')
        .upsert({ 
          language: 'nl', 
          word, 
          category,
          is_active: true 
        }, { 
          onConflict: 'language,word',
          ignoreDuplicates: true 
        })
      
      if (error) {
        console.error(`Error adding Dutch word "${word}":`, error)
      }
    }

    // Improvement 2: Add more English trigger words
    const englishWords = [
      ['Meetings', 'professional'],
      ['Deadlines', 'professional'],
      ['Projects', 'professional'],
      ['Colleagues', 'professional'],
      ['Presentations', 'professional'],
      ['Reports', 'professional'],
      ['Email', 'professional'],
      ['Planning', 'professional'],
      ['Children', 'personal'],
      ['Partner', 'personal'],
      ['Parents', 'personal'],
      ['Birthday', 'personal'],
      ['Appointments', 'personal'],
      ['Shopping', 'personal'],
      ['Cleaning', 'personal'],
      ['Maintenance', 'personal'],
      ['Doctor', 'health'],
      ['Dentist', 'health'],
      ['Medicine', 'health'],
      ['Nutrition', 'health'],
      ['Sleep', 'health'],
      ['Stress', 'health'],
      ['Relaxation', 'health'],
      ['Budget', 'finance'],
      ['Bills', 'finance'],
      ['Taxes', 'finance'],
      ['Savings', 'finance'],
      ['Insurance', 'finance'],
      ['Banking', 'finance'],
      ['Courses', 'education'],
      ['Skills', 'education'],
      ['Reading', 'education'],
      ['Goals', 'education']
    ]

    console.log('📝 Adding English trigger words...')
    for (const [word, category] of englishWords) {
      const { error } = await supabase
        .from('trigger_words')
        .upsert({ 
          language: 'en', 
          word, 
          category,
          is_active: true 
        }, { 
          onConflict: 'language,word',
          ignoreDuplicates: true 
        })
      
      if (error) {
        console.error(`Error adding English word "${word}":`, error)
      }
    }

    // Get final counts
    const { data: counts } = await supabase
      .from('trigger_words')
      .select('language, count(*)')
      .eq('is_active', true)
      .group('language')

    console.log('✅ Database improvements completed!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database improvements completed successfully!',
      dutchWordsAdded: dutchWords.length,
      englishWordsAdded: englishWords.length,
      totalCounts: counts
    })

  } catch (error) {
    console.error('❌ Error running database improvements:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to run database improvements',
    usage: 'POST /api/admin/run-queries'
  })
}
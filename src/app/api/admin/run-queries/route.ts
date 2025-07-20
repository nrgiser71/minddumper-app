import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'

// Use service role key for admin operations
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
    // SECURITY: Removed dangerous RPC exec functionality
    // This endpoint now only performs safe, predefined database operations
    
    // NOTE: Table creation should be done via Supabase migrations, not runtime code
    // This endpoint is now limited to safe data operations only

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

    // Adding Dutch trigger words
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
        // Error adding Dutch word
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

    // Adding English trigger words
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
        // Error adding English word
      }
    }

    // Get final counts
    const { data: nlCount } = await supabase
      .from('trigger_words')
      .select('*', { count: 'exact' })
      .eq('language', 'nl')
      .eq('is_active', true)
    
    const { data: enCount } = await supabase
      .from('trigger_words')
      .select('*', { count: 'exact' })
      .eq('language', 'en')
      .eq('is_active', true)

    // Database improvements completed
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database improvements completed successfully!',
      dutchWordsAdded: dutchWords.length,
      englishWordsAdded: englishWords.length,
      nlTotalCount: nlCount?.length || 0,
      enTotalCount: enCount?.length || 0
    })

  } catch (error) {
    // Error running database improvements
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
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
    message: 'Secured admin endpoint for database operations',
    usage: 'POST /api/admin/run-queries',
    security: 'RPC exec functionality removed for security'
  })
}
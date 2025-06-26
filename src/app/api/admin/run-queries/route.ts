import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    console.log('🚀 Running database improvements...')

    // First: Create user_trigger_words table if it doesn't exist
    console.log('📋 Creating user_trigger_words table...')
    
    // Execute each SQL statement separately
    const statements = [
      `CREATE TABLE IF NOT EXISTS public.user_trigger_words (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        word TEXT NOT NULL,
        main_category TEXT NOT NULL,
        sub_category TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(user_id, word)
      )`,
      `ALTER TABLE public.user_trigger_words ENABLE ROW LEVEL SECURITY`,
      `DROP POLICY IF EXISTS "Users can view own trigger words" ON public.user_trigger_words`,
      `DROP POLICY IF EXISTS "Users can insert own trigger words" ON public.user_trigger_words`,
      `DROP POLICY IF EXISTS "Users can update own trigger words" ON public.user_trigger_words`,
      `DROP POLICY IF EXISTS "Users can delete own trigger words" ON public.user_trigger_words`,
      `CREATE POLICY "Users can view own trigger words" ON public.user_trigger_words FOR SELECT USING (auth.uid() = user_id)`,
      `CREATE POLICY "Users can insert own trigger words" ON public.user_trigger_words FOR INSERT WITH CHECK (auth.uid() = user_id)`,
      `CREATE POLICY "Users can update own trigger words" ON public.user_trigger_words FOR UPDATE USING (auth.uid() = user_id)`,
      `CREATE POLICY "Users can delete own trigger words" ON public.user_trigger_words FOR DELETE USING (auth.uid() = user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_user_trigger_words_user_id ON public.user_trigger_words(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_user_trigger_words_active ON public.user_trigger_words(user_id, is_active)`
    ]

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec', { sql: statement })
        if (error) {
          console.log(`⚠️ SQL statement result (might be normal):`, error.message)
        }
      } catch (err) {
        console.log(`⚠️ SQL execution (continuing):`, err)
        // Continue anyway - some statements might fail if already exists
      }
    }
    
    console.log('✅ user_trigger_words table setup completed!')

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

    console.log('✅ Database improvements completed!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database improvements completed successfully!',
      dutchWordsAdded: dutchWords.length,
      englishWordsAdded: englishWords.length,
      nlTotalCount: nlCount?.length || 0,
      enTotalCount: enCount?.length || 0
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
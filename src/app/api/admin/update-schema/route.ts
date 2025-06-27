import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    // Checking database schema for hierarchical structure

    // Check current schema
    const { data: existingWords, error: fetchError } = await supabase
      .from('trigger_words')
      .select('*')
      .eq('language', 'nl')
      .limit(1)

    if (fetchError) {
      throw fetchError
    }

    const sampleWord = existingWords?.[0]
    const hasHierarchy = sampleWord && 'main_category' in sampleWord

    // Current schema has hierarchy
    
    if (!hasHierarchy) {
      // Schema does not support hierarchy yet
      
      return NextResponse.json({ 
        success: false, 
        message: 'Database schema needs manual update by admin',
        currentColumns: sampleWord ? Object.keys(sampleWord) : [],
        requiredColumns: ['main_category', 'sub_category', 'main_category_order', 'sub_category_order', 'sort_order'],
        sqlCommands: [
          'ALTER TABLE trigger_words ADD COLUMN main_category TEXT;',
          'ALTER TABLE trigger_words ADD COLUMN sub_category TEXT;',
          'ALTER TABLE trigger_words ADD COLUMN main_category_order INTEGER DEFAULT 0;',
          'ALTER TABLE trigger_words ADD COLUMN sub_category_order INTEGER DEFAULT 0;',
          'ALTER TABLE trigger_words ADD COLUMN sort_order INTEGER DEFAULT 0;'
        ]
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Schema already supports hierarchy'
    })

  } catch (error) {
    // Error checking schema
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to check database schema',
    usage: 'POST /api/admin/update-schema'
  })
}
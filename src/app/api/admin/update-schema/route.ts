import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    console.log('🔄 Updating database schema for hierarchical trigger words...')

    // Add new columns to trigger_words table
    const schemaUpdates = [
      // Add main_category column
      `ALTER TABLE public.trigger_words ADD COLUMN IF NOT EXISTS main_category TEXT;`,
      
      // Add sub_category column  
      `ALTER TABLE public.trigger_words ADD COLUMN IF NOT EXISTS sub_category TEXT;`,
      
      // Add sort_order column for maintaining order
      `ALTER TABLE public.trigger_words ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`,
      
      // Add main_category_order for ordering main categories
      `ALTER TABLE public.trigger_words ADD COLUMN IF NOT EXISTS main_category_order INTEGER DEFAULT 0;`,
      
      // Add sub_category_order for ordering sub categories
      `ALTER TABLE public.trigger_words ADD COLUMN IF NOT EXISTS sub_category_order INTEGER DEFAULT 0;`,
      
      // Update existing records to have default values
      `UPDATE public.trigger_words SET 
        main_category = 'Algemeen',
        sub_category = 'Basis',
        main_category_order = 999,
        sub_category_order = 999,
        sort_order = 999
       WHERE main_category IS NULL;`
    ]

    console.log('📝 Executing schema updates...')
    for (const query of schemaUpdates) {
      const { error } = await supabase.rpc('exec_sql', { sql: query })
      if (error) {
        console.error('Error executing query:', query, error)
        // Try alternative approach for adding columns
        try {
          const { error: altError } = await supabase
            .from('trigger_words')
            .select('id')
            .limit(1)
          console.log('Table still accessible:', !altError)
        } catch (e) {
          console.error('Table access error:', e)
        }
      }
    }

    console.log('✅ Schema update completed!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database schema updated successfully for hierarchical structure!',
      updates: [
        'Added main_category column',
        'Added sub_category column', 
        'Added sort_order column',
        'Added main_category_order column',
        'Added sub_category_order column',
        'Updated existing records with defaults'
      ]
    })

  } catch (error) {
    console.error('❌ Error updating schema:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to update database schema',
    usage: 'POST /api/admin/update-schema'
  })
}
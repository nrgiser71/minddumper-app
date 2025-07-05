import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get all system words with their categories
    const { data: words, error } = await supabase
      .from('system_trigger_words')
      .select(`
        id,
        word,
        language,
        display_order,
        sub_category:sub_categories(
          id,
          name,
          display_order,
          main_category:main_categories(
            id,
            name,
            display_order
          )
        )
      `)
      .eq('is_active', true)
      .order('language')
      .order('display_order')

    if (error) {
      console.error('Error fetching words:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true, words })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
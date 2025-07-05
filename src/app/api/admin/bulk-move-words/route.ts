import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request) {
  try {
    const { wordIds, newSubCategoryId } = await request.json()

    if (!wordIds || !Array.isArray(wordIds) || wordIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Word IDs array is required' })
    }

    if (!newSubCategoryId) {
      return NextResponse.json({ success: false, error: 'New subcategory ID is required' })
    }

    // Update subcategory for all words
    const { error } = await supabase
      .from('system_trigger_words')
      .update({ 
        sub_category_id: newSubCategoryId,
        updated_at: new Date().toISOString()
      })
      .in('id', wordIds)

    if (error) {
      console.error('Error bulk moving words:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request) {
  try {
    const { wordId, newSubCategoryId } = await request.json()

    if (!wordId || !newSubCategoryId) {
      return NextResponse.json({ success: false, error: 'Word ID and new subcategory ID are required' })
    }

    // Update the word's subcategory
    const { error } = await supabase
      .from('system_trigger_words')
      .update({ 
        sub_category_id: newSubCategoryId
      })
      .eq('id', wordId)

    if (error) {
      console.error('Error moving word:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
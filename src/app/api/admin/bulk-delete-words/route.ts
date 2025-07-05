import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(request: Request) {
  try {
    const { wordIds } = await request.json()

    if (!wordIds || !Array.isArray(wordIds) || wordIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Word IDs array is required' })
    }

    // Soft delete by setting is_active to false for all words
    const { error } = await supabase
      .from('system_trigger_words')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .in('id', wordIds)

    if (error) {
      console.error('Error bulk deleting words:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
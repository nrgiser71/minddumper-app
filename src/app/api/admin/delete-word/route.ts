import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(request: Request) {
  if (!verifyAdminSessionFromRequest(request)) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized access' 
    }, { status: 401 })
  }

  try {
    const { wordId } = await request.json()

    if (!wordId) {
      return NextResponse.json({ success: false, error: 'Word ID is required' })
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('system_trigger_words')
      .update({ 
        is_active: false
      })
      .eq('id', wordId)

    if (error) {
      console.error('Error deleting word:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
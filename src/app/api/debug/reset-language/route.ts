import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 })
    }

    // Reset language preference to null for testing new user flow
    const { data, error } = await supabase
      .from('profiles')
      .update({ language: null })
      .eq('email', email)
      .select()

    if (error) {
      return NextResponse.json({ 
        error: 'Database error', 
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Language preference reset for ${email}`,
      updated_profiles: data?.length || 0
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to reset language preference',
      details: error 
    }, { status: 500 })
  }
}
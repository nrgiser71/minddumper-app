import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('🔍 Looking for latest paid user...')
    
    // Just get the most recent paid user - no time restrictions for now
    const { data: latestUser, error } = await supabase
      .from('profiles')
      .select('email, full_name, created_at')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('❌ Error fetching latest user:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    if (!latestUser || latestUser.length === 0) {
      console.log('ℹ️ No paid users found')
      return NextResponse.json({ 
        success: false, 
        message: 'No paid users found'
      }, { status: 404 })
    }
    
    const user = latestUser[0]
    console.log('✅ Latest paid user found:', user.email)
    
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at
      }
    })
    
  } catch (error) {
    console.error('💥 Latest user API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: (error as Error).message 
    }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('🔍 Looking for latest user...')
    
    // Look for the most recent user created (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    console.log('⏰ Looking for users created after:', fiveMinutesAgo.toISOString())
    
    // First, let's see all paid users
    const { data: allUsers, error: allError } = await supabase
      .from('profiles')
      .select('email, full_name, created_at, payment_status')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(5)
    
    console.log('📊 All recent paid users:', allUsers)
    
    const { data: latestUser, error } = await supabase
      .from('profiles')
      .select('email, full_name, created_at')
      .eq('payment_status', 'paid')
      .gte('created_at', fiveMinutesAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('❌ Error fetching latest user:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    if (!latestUser || latestUser.length === 0) {
      console.log('ℹ️ No recent user found in last 5 minutes')
      return NextResponse.json({ 
        success: false, 
        message: 'No recent user found',
        debug: {
          searchedAfter: fiveMinutesAgo.toISOString(),
          allRecentUsers: allUsers
        }
      }, { status: 404 })
    }
    
    const user = latestUser[0]
    console.log('✅ Latest user found:', user.email)
    
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
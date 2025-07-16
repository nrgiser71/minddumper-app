import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Looking for recent purchase...')
    
    // Look for purchases from the last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    
    const { data: recentPurchases, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, login_token, login_token_expires, paid_at')
      .eq('payment_status', 'paid')
      .eq('login_token_used', false)
      .gte('paid_at', twoMinutesAgo.toISOString())
      .not('login_token', 'is', null)
      .order('paid_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('❌ Error fetching recent purchases:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    if (!recentPurchases || recentPurchases.length === 0) {
      console.log('ℹ️ No recent purchases found')
      return NextResponse.json({ 
        success: false, 
        message: 'No recent purchases found' 
      }, { status: 404 })
    }
    
    const purchase = recentPurchases[0]
    
    // Check if token has expired
    if (purchase.login_token_expires && new Date(purchase.login_token_expires) < new Date()) {
      console.log('⏰ Login token has expired')
      return NextResponse.json({ 
        success: false, 
        message: 'Login token has expired' 
      }, { status: 410 })
    }
    
    // Mark token as used
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ login_token_used: true })
      .eq('id', purchase.id)
    
    if (updateError) {
      console.error('❌ Error marking token as used:', updateError)
      return NextResponse.json({ error: 'Token update failed' }, { status: 500 })
    }
    
    console.log('✅ Recent purchase found and token marked as used:', purchase.email)
    
    return NextResponse.json({
      success: true,
      user: {
        id: purchase.id,
        email: purchase.email,
        full_name: purchase.full_name,
        login_token: purchase.login_token
      }
    })
    
  } catch (error) {
    console.error('💥 Recent purchase API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: (error as Error).message 
    }, { status: 500 })
  }
}
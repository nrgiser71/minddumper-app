import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }
    
    console.log('🔐 Attempting login with token:', token.substring(0, 8) + '...')
    
    // Find user by token
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, login_token_expires, login_token_used')
      .eq('login_token', token)
      .single()
    
    if (error || !profile) {
      console.error('❌ Invalid token:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Check if token has expired
    if (profile.login_token_expires && new Date(profile.login_token_expires) < new Date()) {
      console.log('⏰ Token has expired')
      return NextResponse.json({ error: 'Token has expired' }, { status: 410 })
    }
    
    // Check if token has already been used
    if (profile.login_token_used) {
      console.log('🔒 Token has already been used')
      return NextResponse.json({ error: 'Token has already been used' }, { status: 410 })
    }
    
    // Generate auth session for user
    const { data: authData, error: authError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: profile.email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://minddumper.com'}/auth/callback?type=magiclink&next=/auth/reset-password%3Fforced%3Dtrue`
      }
    })
    
    if (authError) {
      console.error('❌ Error generating auth link:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
    
    // Mark token as used
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ login_token_used: true })
      .eq('id', profile.id)
    
    if (updateError) {
      console.error('❌ Error marking token as used:', updateError)
      // Continue anyway - token validation succeeded
    }
    
    console.log('✅ Token login successful for:', profile.email)
    
    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name
      },
      auth_url: authData.properties.action_link,
      requires_password_reset: true
    })
    
  } catch (error) {
    console.error('💥 Token login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: (error as Error).message 
    }, { status: 500 })
  }
}
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token = requestUrl.searchParams.get('token')
  const type = requestUrl.searchParams.get('type')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // If there's an error, redirect to login with error message
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    )
  }

  // Handle password recovery with verification token
  if (token && type === 'recovery') {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      // Verify the recovery token and get session
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery'
      })

      if (verifyError) {
        console.error('Error verifying recovery token:', verifyError)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(verifyError.message)}`, request.url)
        )
      }

      if (data.session) {
        // For password recovery, redirect to reset-password with tokens and welcome flag
        const resetPasswordUrl = new URL('/auth/reset-password', request.url)
        resetPasswordUrl.searchParams.set('access_token', data.session.access_token)
        resetPasswordUrl.searchParams.set('refresh_token', data.session.refresh_token)
        resetPasswordUrl.searchParams.set('welcome', 'true')
        
        return NextResponse.redirect(resetPasswordUrl)
      }
    } catch (error) {
      console.error('Error in recovery callback:', error)
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent('Recovery failed')}`, request.url)
      )
    }
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        )
      }

      if (data.session) {
        // Check if this is a password recovery (user needs to set new password)
        const accessToken = data.session.access_token
        const refreshToken = data.session.refresh_token
        
        // For password recovery, redirect to reset-password with tokens and welcome flag
        const resetPasswordUrl = new URL('/auth/reset-password', request.url)
        resetPasswordUrl.searchParams.set('access_token', accessToken)
        resetPasswordUrl.searchParams.set('refresh_token', refreshToken)
        resetPasswordUrl.searchParams.set('welcome', 'true')
        
        return NextResponse.redirect(resetPasswordUrl)
      }
    } catch (error) {
      console.error('Error in auth callback:', error)
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
      )
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
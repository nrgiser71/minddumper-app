import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    
    // Sign out the user
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout error:', error)
      return NextResponse.redirect(new URL('/?error=logout_failed', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
    }
    
    // Redirect to homepage after successful logout
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.redirect(new URL('/?error=logout_failed', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  }
}

export async function POST() {
  // Support both GET and POST for flexibility
  return GET()
}
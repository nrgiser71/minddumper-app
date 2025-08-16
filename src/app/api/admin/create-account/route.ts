import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  // Verify admin session
  if (!verifyAdminSessionFromRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { email, fullName, notes } = await request.json()

    // Validate required fields
    if (!email || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Email and full name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Use service role key for admin operations
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if user already exists in profiles
    const { data: existingProfile } = await adminSupabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Account with this email already exists' },
        { status: 409 }
      )
    }

    // Check if auth user already exists
    const { data: existingAuthUsers } = await adminSupabase.auth.admin.listUsers()
    const existingAuthUser = existingAuthUsers.users?.find(user => user.email?.toLowerCase() === email.toLowerCase())
    
    if (existingAuthUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication user with this email already exists' },
        { status: 409 }
      )
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email: email.toLowerCase(),
      email_confirm: true
    })

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json(
        { success: false, error: 'Failed to create authentication account' },
        { status: 500 }
      )
    }

    // Create/update profile with paid status using upsert to handle database trigger
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: email.toLowerCase(),
        full_name: fullName,
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        amount_paid_cents: 0, // €0 - trainers don't pay, excluded from revenue
        customer_type: 'trainer', // Mark as trainer to exclude from revenue stats
        updated_at: new Date().toISOString(),
        language: 'nl' // Default language
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('Error upserting profile:', profileError)
      
      // Cleanup: Delete the auth user if profile upsert failed
      await adminSupabase.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json(
        { success: false, error: 'Failed to create user profile. Error: ' + profileError.message },
        { status: 500 }
      )
    }

    // Get the current domain for redirect URL
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const baseUrl = `${protocol}://${host}`
    
    // Generate password reset link with custom redirect URL
    const { data: resetData, error: resetError } = await adminSupabase.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase(),
      options: {
        redirectTo: `${baseUrl}/auth/callback`
      }
    })

    if (resetError || !resetData) {
      console.error('Error generating password reset link:', resetError)
      return NextResponse.json(
        { success: false, error: 'Account created but failed to generate password reset link' },
        { status: 500 }
      )
    }

    // Create a simple direct link to trainer setup page
    // This is completely separate from the normal customer flow - 100% safe
    const trainerSetupUrl = `${baseUrl}/auth/trainer-setup?email=${encodeURIComponent(email.toLowerCase())}&user_id=${authData.user.id}`

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: authData.user.id,
        email: email.toLowerCase(),
        fullName,
        notes
      },
      passwordResetLink: trainerSetupUrl
    })

  } catch (error) {
    console.error('Error in create-account API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
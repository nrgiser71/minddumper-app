import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin session
  if (!verifyAdminSessionFromRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { action } = await request.json()
    const userId = params.id

    // Use service role key for admin queries
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify user exists
    const { data: user, error: userError } = await adminSupabase
      .from('profiles')
      .select('id, email, payment_status')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'disable':
        // Set payment status to 'disabled'
        const { error: disableError } = await adminSupabase
          .from('profiles')
          .update({ payment_status: 'disabled' })
          .eq('id', userId)

        if (disableError) {
          console.error('Error disabling user:', disableError)
          return NextResponse.json(
            { success: false, error: 'Failed to disable user' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'User disabled successfully'
        })

      case 'enable':
        // Set payment status back to 'paid' or 'pending' based on previous status
        const newStatus = user.payment_status === 'disabled' ? 'paid' : user.payment_status
        const { error: enableError } = await adminSupabase
          .from('profiles')
          .update({ payment_status: newStatus === 'disabled' ? 'paid' : newStatus })
          .eq('id', userId)

        if (enableError) {
          console.error('Error enabling user:', enableError)
          return NextResponse.json(
            { success: false, error: 'Failed to enable user' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'User enabled successfully'
        })

      case 'reset-password':
        // Create admin Supabase client for auth operations
        const adminAuthSupabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        )

        // Send password reset email
        const { error: resetError } = await adminAuthSupabase.auth.admin.generateLink({
          type: 'recovery',
          email: user.email
        })

        if (resetError) {
          console.error('Error sending password reset:', resetError)
          return NextResponse.json(
            { success: false, error: 'Failed to send password reset email' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Password reset email sent successfully'
        })

      case 'delete':
        // First delete user's brain dumps
        const { error: brainDumpsDeleteError } = await adminSupabase
          .from('brain_dumps')
          .delete()
          .eq('user_id', userId)

        if (brainDumpsDeleteError) {
          console.error('Error deleting user brain dumps:', brainDumpsDeleteError)
          return NextResponse.json(
            { success: false, error: 'Failed to delete user data' },
            { status: 500 }
          )
        }

        // Delete user's custom trigger words if they exist
        await adminSupabase
          .from('user_custom_trigger_words')
          .delete()
          .eq('user_id', userId)

        // Delete profile
        const { error: profileDeleteError } = await adminSupabase
          .from('profiles')
          .delete()
          .eq('id', userId)

        if (profileDeleteError) {
          console.error('Error deleting user profile:', profileDeleteError)
          return NextResponse.json(
            { success: false, error: 'Failed to delete user profile' },
            { status: 500 }
          )
        }

        // Delete from Supabase Auth
        const adminAuthClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        )

        const { error: authDeleteError } = await adminAuthClient.auth.admin.deleteUser(userId)

        if (authDeleteError) {
          console.error('Error deleting user from auth:', authDeleteError)
          // Continue anyway since profile is already deleted
        }

        return NextResponse.json({
          success: true,
          message: 'User deleted successfully'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in user-actions API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
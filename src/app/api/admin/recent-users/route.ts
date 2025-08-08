import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  // Verify admin session
  if (!verifyAdminSessionFromRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Use service role key for admin queries
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get latest 20 users with their details (using only confirmed columns)
    const { data: recentUsers, error } = await adminSupabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching recent users:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users', details: error.message },
        { status: 500 }
      )
    }

    // Format the user data
    const formattedUsers = recentUsers?.map(user => ({
      id: user.id,
      name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Onbekend',
      email: user.email,
      createdAt: user.created_at,
      paymentStatus: user.payment_status || 'pending',
      paidAt: user.paid_at,
      amountPaid: user.amount_paid_cents ? (user.amount_paid_cents / 100) : 0,
      orderId: user.plugandpay_order_id,
      customerType: user.customer_type,
      country: user.billing_country,
      language: user.language
    })) || []

    return NextResponse.json({
      success: true,
      users: formattedUsers
    })

  } catch (error) {
    console.error('Error in recent-users API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
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

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: false,
      error: 'Search query moet minimaal 2 tekens bevatten'
    }, { status: 400 })
  }

  try {
    // Use service role key for admin queries
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Search users by email, name, or other fields
    const { data: users, error } = await adminSupabase
      .from('profiles')
      .select(`
        id,
        created_at,
        email,
        full_name,
        first_name,
        last_name,
        payment_status,
        paid_at,
        amount_paid_cents,
        plugandpay_order_id,
        customer_type,
        billing_country,
        billing_city,
        billing_postal_code,
        language,
        phone,
        company_name
      `)
      .or(`
        email.ilike.%${query}%,
        full_name.ilike.%${query}%,
        first_name.ilike.%${query}%,
        last_name.ilike.%${query}%,
        plugandpay_order_id.ilike.%${query}%,
        company_name.ilike.%${query}%
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error searching users:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to search users' },
        { status: 500 }
      )
    }

    // Format the user data
    const formattedUsers = users?.map(user => ({
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
      city: user.billing_city,
      postalCode: user.billing_postal_code,
      language: user.language,
      phone: user.phone,
      companyName: user.company_name
    })) || []

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      totalFound: formattedUsers.length
    })

  } catch (error) {
    console.error('Error in user-search API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
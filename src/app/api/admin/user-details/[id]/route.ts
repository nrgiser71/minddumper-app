import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

export async function GET(
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
    // Use service role key for admin queries
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const userId = params.id

    // Get user details
    const { data: user, error: userError } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's brain dumps
    const { data: brainDumps, error: brainDumpsError } = await adminSupabase
      .from('brain_dumps')
      .select(`
        id,
        created_at,
        language,
        total_ideas,
        total_words,
        duration_minutes,
        is_draft
      `)
      .eq('user_id', userId)
      .eq('is_draft', false)
      .order('created_at', { ascending: false })

    if (brainDumpsError) {
      console.error('Error fetching user brain dumps:', brainDumpsError)
    }

    // Get brain dump statistics
    const brainDumpStats = brainDumps?.reduce(
      (stats, dump) => ({
        total: stats.total + 1,
        totalIdeas: stats.totalIdeas + (dump.total_ideas || 0),
        totalWords: stats.totalWords + (dump.total_words || 0),
        totalDuration: stats.totalDuration + (dump.duration_minutes || 0),
        byLanguage: {
          ...stats.byLanguage,
          [dump.language]: (stats.byLanguage[dump.language] || 0) + 1
        }
      }),
      { 
        total: 0, 
        totalIdeas: 0, 
        totalWords: 0, 
        totalDuration: 0, 
        byLanguage: {} as Record<string, number>
      }
    ) || { total: 0, totalIdeas: 0, totalWords: 0, totalDuration: 0, byLanguage: {} }

    // Format user data
    const userDetails = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      language: user.language,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      
      // Payment info
      paymentStatus: user.payment_status || 'pending',
      paidAt: user.paid_at,
      amountPaid: user.amount_paid_cents ? (user.amount_paid_cents / 100) : 0,
      plugandpayOrderId: user.plugandpay_order_id,
      
      // Billing info
      customerType: user.customer_type,
      companyName: user.company_name,
      vatNumber: user.vat_number,
      billingAddress: {
        line1: user.billing_address_line1,
        line2: user.billing_address_line2,
        city: user.billing_city,
        postalCode: user.billing_postal_code,
        country: user.billing_country,
        state: user.billing_state
      },
      
      // Newsletter
      newsletterOptedIn: user.newsletter_opted_in,
      
      // Brain dump statistics
      brainDumpStats,
      
      // Recent brain dumps
      recentBrainDumps: brainDumps?.slice(0, 10) || []
    }

    return NextResponse.json({
      success: true,
      user: userDetails
    })

  } catch (error) {
    console.error('Error in user-details API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
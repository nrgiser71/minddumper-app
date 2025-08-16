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

    const now = new Date()
    
    // Calculate date ranges
    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - now.getDay())
    startOfThisWeek.setHours(0, 0, 0, 0)
    
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfThisYear = new Date(now.getFullYear(), 0, 1)

    // Get all paid users with payment timestamps (excluding trainers)
    const { data: paidUsers, error } = await adminSupabase
      .from('profiles')
      .select('paid_at, amount_paid_cents')
      .eq('payment_status', 'paid')
      .neq('customer_type', 'trainer') // Exclude trainer accounts from revenue
      .not('paid_at', 'is', null)

    if (error) {
      console.error('Error fetching paid users:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch revenue data' },
        { status: 500 }
      )
    }

    // Calculate revenue per period
    const thisWeekRevenue = paidUsers?.filter(user => 
      new Date(user.paid_at) >= startOfThisWeek
    ) || []

    const thisMonthRevenue = paidUsers?.filter(user => 
      new Date(user.paid_at) >= startOfThisMonth
    ) || []

    const thisYearRevenue = paidUsers?.filter(user => 
      new Date(user.paid_at) >= startOfThisYear
    ) || []

    // Calculate amounts (assuming 49 euros per customer if amount_paid_cents is not available)
    const calculateRevenue = (users: typeof paidUsers) => {
      return users.reduce((total, user) => {
        const amount = user.amount_paid_cents ? user.amount_paid_cents / 100 : 49
        return total + amount
      }, 0)
    }

    // Get monthly revenue for the past 12 months
    const monthlyRevenue = []
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthUsers = paidUsers?.filter(user => {
        const paidDate = new Date(user.paid_at)
        return paidDate >= monthStart && paidDate <= monthEnd
      }) || []
      
      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' }),
        revenue: calculateRevenue(monthUsers),
        customers: monthUsers.length
      })
    }

    // Get weekly revenue for the past 8 weeks
    const weeklyRevenue = []
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - (now.getDay() + (i * 7)))
      weekStart.setHours(0, 0, 0, 0)
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)
      
      const weekUsers = paidUsers?.filter(user => {
        const paidDate = new Date(user.paid_at)
        return paidDate >= weekStart && paidDate <= weekEnd
      }) || []
      
      weeklyRevenue.push({
        week: `Week ${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        revenue: calculateRevenue(weekUsers),
        customers: weekUsers.length
      })
    }

    return NextResponse.json({
      success: true,
      revenue: {
        thisWeek: {
          amount: calculateRevenue(thisWeekRevenue),
          customers: thisWeekRevenue.length
        },
        thisMonth: {
          amount: calculateRevenue(thisMonthRevenue),
          customers: thisMonthRevenue.length
        },
        thisYear: {
          amount: calculateRevenue(thisYearRevenue),
          customers: thisYearRevenue.length
        },
        total: {
          amount: calculateRevenue(paidUsers || []),
          customers: paidUsers?.length || 0
        },
        monthlyBreakdown: monthlyRevenue,
        weeklyBreakdown: weeklyRevenue
      }
    })

  } catch (error) {
    console.error('Error in revenue-stats API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
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

    // Get total users
    const { count: totalUsers } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Get users created in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { count: newUsers } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get total brain dumps
    const { count: totalBrainDumps } = await adminSupabase
      .from('brain_dumps')
      .select('*', { count: 'exact', head: true })

    // Get brain dumps by language
    const { data: brainDumpsByLanguage } = await adminSupabase
      .from('brain_dumps')
      .select('language')
      .not('language', 'is', null)

    const languageStats = brainDumpsByLanguage?.reduce((acc: Record<string, number>, dump) => {
      acc[dump.language] = (acc[dump.language] || 0) + 1
      return acc
    }, {}) || {}

    // Get brain dumps in last 7 days for activity trend
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: recentBrainDumps } = await adminSupabase
      .from('brain_dumps')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    // Get average ideas per brain dump
    const { data: brainDumpStats } = await adminSupabase
      .from('brain_dumps')
      .select('total_ideas, duration_minutes')
      .not('total_ideas', 'is', null)
      .not('duration_minutes', 'is', null)

    const avgIdeas = brainDumpStats?.length 
      ? Math.round(brainDumpStats.reduce((sum, dump) => sum + (dump.total_ideas || 0), 0) / brainDumpStats.length)
      : 0

    const avgDuration = brainDumpStats?.length
      ? Math.round(brainDumpStats.reduce((sum, dump) => sum + (dump.duration_minutes || 0), 0) / brainDumpStats.length)
      : 0

    // Get most active users
    const { data: userActivity } = await adminSupabase
      .from('brain_dumps')
      .select('user_id, profiles!inner(full_name, email)')
      .not('user_id', 'is', null)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userBrainDumpCounts = userActivity?.reduce((acc: Record<string, { count: number, name: string, email: string }>, dump: any) => {
      const userId = dump.user_id
      if (!acc[userId]) {
        acc[userId] = {
          count: 0,
          name: dump.profiles?.full_name || 'Onbekend',
          email: dump.profiles?.email || ''
        }
      }
      acc[userId].count++
      return acc
    }, {}) || {}

    const topUsers = Object.entries(userBrainDumpCounts)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5)
      .map(([userId, data]) => ({
        userId,
        name: data.name,
        email: data.email,
        brainDumps: data.count
      }))

    // Get user registration trend (last 30 days)
    const { data: userRegistrations } = await adminSupabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    const registrationTrend = userRegistrations?.reduce((acc: Record<string, number>, user) => {
      const date = new Date(user.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {}) || {}

    // Get total system trigger words across all languages
    const { count: totalSystemWords } = await adminSupabase
      .from('system_trigger_words')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get total custom words
    const { count: totalCustomWords } = await adminSupabase
      .from('user_custom_trigger_words')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers || 0,
          newInLast30Days: newUsers || 0,
          registrationTrend
        },
        brainDumps: {
          total: totalBrainDumps || 0,
          recentInLast7Days: recentBrainDumps || 0,
          byLanguage: languageStats,
          averageIdeas: avgIdeas,
          averageDuration: avgDuration
        },
        content: {
          systemWords: totalSystemWords || 0,
          customWords: totalCustomWords || 0
        },
        activity: {
          topUsers
        }
      }
    })

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
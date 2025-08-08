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

    // Get latest 50 brain dumps first
    const { data: brainDumpsData, error: brainDumpsError } = await adminSupabase
      .from('brain_dumps')
      .select('*')
      .eq('is_draft', false)
      .order('created_at', { ascending: false })
      .limit(50)

    if (brainDumpsError) {
      console.error('Error fetching brain dumps:', brainDumpsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch brain dumps', details: brainDumpsError.message },
        { status: 500 }
      )
    }

    // Get user details for these brain dumps
    const userIds = [...new Set(brainDumpsData?.map(dump => dump.user_id).filter(Boolean) || [])]
    const { data: usersData, error: usersError } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', userIds)

    if (usersError) {
      console.error('Error fetching users for brain dumps:', usersError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users for brain dumps', details: usersError.message },
        { status: 500 }
      )
    }

    // Create user lookup map
    const userMap = new Map(usersData?.map(user => [user.id, user]) || [])

    // Combine data
    const recentBrainDumps = brainDumpsData?.map(dump => ({
      ...dump,
      profiles: userMap.get(dump.user_id) || { id: dump.user_id, full_name: 'Onbekend', email: '' }
    })) || []

    // Format the brain dump data
    const formattedBrainDumps = recentBrainDumps.map(dump => ({
      id: dump.id,
      createdAt: dump.created_at,
      updatedAt: dump.updated_at,
      language: dump.language,
      totalIdeas: dump.total_ideas || 0,
      totalWords: dump.total_words || 0,
      durationMinutes: dump.duration_minutes || 0,
      sessionId: dump.session_id,
      user: {
        id: dump.profiles.id,
        name: dump.profiles.full_name || 'Onbekend',
        email: dump.profiles.email || ''
      }
    }))

    return NextResponse.json({
      success: true,
      brainDumps: formattedBrainDumps
    })

  } catch (error) {
    console.error('Error in recent-brain-dumps API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
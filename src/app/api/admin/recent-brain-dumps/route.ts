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

    // Get latest 50 brain dumps with user details
    const { data: recentBrainDumps, error } = await adminSupabase
      .from('brain_dumps')
      .select(`
        id,
        created_at,
        updated_at,
        language,
        total_ideas,
        total_words,
        duration_minutes,
        is_draft,
        session_id,
        profiles!inner(
          id,
          full_name,
          first_name,
          last_name,
          email
        )
      `)
      .eq('is_draft', false)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching recent brain dumps:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch brain dumps' },
        { status: 500 }
      )
    }

    // Format the brain dump data
    const formattedBrainDumps = recentBrainDumps?.map(dump => ({
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
        name: dump.profiles.full_name || 
              `${dump.profiles.first_name || ''} ${dump.profiles.last_name || ''}`.trim() ||
              'Onbekend',
        email: dump.profiles.email
      }
    })) || []

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
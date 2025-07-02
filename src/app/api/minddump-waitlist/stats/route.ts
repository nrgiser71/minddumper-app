import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { count, error } = await supabase
      .from('minddump_waitlist')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('MindDump waitlist stats error:', error)
      return NextResponse.json(
        { error: 'Fout bij ophalen statistieken' },
        { status: 500 }
      )
    }
    
    const actualCount = count || 0
    const displayCount = actualCount + 10 // Add 10 for marketing impression
    
    return NextResponse.json({ 
      total: displayCount,
      message: displayCount === 1 ? '1 persoon' : `${displayCount} mensen`
    })
    
  } catch (error) {
    console.error('MindDump waitlist stats error:', error)
    return NextResponse.json(
      { error: 'Fout bij ophalen statistieken' },
      { status: 500 }
    )
  }
}
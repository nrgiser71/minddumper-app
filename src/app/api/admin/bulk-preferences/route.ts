import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, preferences } = await request.json()
    
    if (!userId || !preferences || !Array.isArray(preferences)) {
      return NextResponse.json({ 
        error: 'Missing userId or preferences array' 
      }, { status: 400 })
    }

    // First, get all existing preferences for this user
    const { data: existingPrefs } = await supabase
      .from('user_trigger_word_preferences')
      .select('system_word_id, is_enabled')
      .eq('user_id', userId)

    const existingMap = new Map(
      existingPrefs?.map(p => [p.system_word_id, p.is_enabled]) || []
    )

    // Prepare bulk operations (using upsert for all changes)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toUpdate: any[] = []
    
    preferences.forEach(({ systemWordId, isEnabled }: { systemWordId: string, isEnabled: boolean }) => {
      if (existingMap.has(systemWordId)) {
        // Update existing preference if it changed
        if (existingMap.get(systemWordId) !== isEnabled) {
          toUpdate.push({
            user_id: userId,
            system_word_id: systemWordId,
            is_enabled: isEnabled,
            updated_at: new Date().toISOString()
          })
        }
      } else {
        // Insert new preference (only if it doesn't exist)
        toUpdate.push({
          user_id: userId,
          system_word_id: systemWordId,
          is_enabled: isEnabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    })

    // Execute bulk operations using upsert for all changes
    const results = []
    
    if (toUpdate.length > 0) {
      // Use upsert for all operations (handles both insert and update)
      const { error: upsertError } = await supabase
        .from('user_trigger_word_preferences')
        .upsert(toUpdate, { onConflict: 'user_id,system_word_id' })
      
      if (upsertError) {
        console.error('Bulk upsert error:', upsertError)
        console.error('Failed to upsert:', toUpdate)
        return NextResponse.json({ 
          error: 'Upsert failed', 
          details: upsertError,
          failedData: toUpdate.length > 5 ? `${toUpdate.length} items` : toUpdate
        }, { status: 500 })
      }
      results.push(`Upserted ${toUpdate.length} preferences`)
    }

    return NextResponse.json({
      success: true,
      results,
      total_processed: toUpdate.length
    })

  } catch (error) {
    console.error('Bulk preferences error:', error)
    return NextResponse.json({ 
      error: 'Failed to update preferences',
      details: error 
    }, { status: 500 })
  }
}
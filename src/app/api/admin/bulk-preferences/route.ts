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

    // Prepare bulk operations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toInsert: any[] = []
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
        // Insert new preference (always insert explicit preferences)
        toInsert.push({
          user_id: userId,
          system_word_id: systemWordId,
          is_enabled: isEnabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    })

    // Execute bulk operations
    const results = []
    
    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('user_trigger_word_preferences')
        .insert(toInsert)
      
      if (insertError) {
        console.error('Bulk insert error:', insertError)
        console.error('Failed to insert:', toInsert)
        return NextResponse.json({ 
          error: 'Insert failed', 
          details: insertError,
          failedData: toInsert.length > 5 ? `${toInsert.length} items` : toInsert
        }, { status: 500 })
      }
      results.push(`Inserted ${toInsert.length} preferences`)
    }

    if (toUpdate.length > 0) {
      // Use upsert for updates
      const { error: updateError } = await supabase
        .from('user_trigger_word_preferences')
        .upsert(toUpdate, { onConflict: 'user_id,system_word_id' })
      
      if (updateError) {
        console.error('Bulk update error:', updateError)
        console.error('Failed to update:', toUpdate)
        return NextResponse.json({ 
          error: 'Update failed', 
          details: updateError,
          failedData: toUpdate.length > 5 ? `${toUpdate.length} items` : toUpdate
        }, { status: 500 })
      }
      results.push(`Updated ${toUpdate.length} preferences`)
    }

    return NextResponse.json({
      success: true,
      results,
      total_processed: toInsert.length + toUpdate.length
    })

  } catch (error) {
    console.error('Bulk preferences error:', error)
    return NextResponse.json({ 
      error: 'Failed to update preferences',
      details: error 
    }, { status: 500 })
  }
}
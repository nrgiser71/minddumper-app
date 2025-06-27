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

    // Prepare bulk operations (separate insert and update)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toInsert: any[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toUpdate: any[] = []
    
    preferences.forEach(({ systemWordId, isEnabled }: { systemWordId: string, isEnabled: boolean }) => {
      if (existingMap.has(systemWordId)) {
        // Always update existing preference to ensure consistency
        // This ensures that even if the value hasn't changed, the record exists
        toUpdate.push({
          user_id: userId,
          system_word_id: systemWordId,
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        })
      } else {
        // Insert new preference - this ensures every word has a preference record
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
      // Use insert for new preferences with ignoreDuplicates to handle race conditions
      const { error: insertError } = await supabase
        .from('user_trigger_word_preferences')
        .insert(toInsert)
        .select()
      
      if (insertError) {
        // If insert fails due to duplicates, try upsert instead
        // Insert failed, trying upsert
        const { error: upsertError } = await supabase
          .from('user_trigger_word_preferences')
          .upsert(toInsert, { onConflict: 'user_id,system_word_id' })
        
        if (upsertError) {
          // Bulk insert/upsert error
          return NextResponse.json({ 
            error: 'Insert failed', 
            details: upsertError,
            failedData: toInsert.length > 5 ? `${toInsert.length} items` : toInsert
          }, { status: 500 })
        }
        results.push(`Upserted ${toInsert.length} preferences`)
      } else {
        results.push(`Inserted ${toInsert.length} preferences`)
      }
    }

    if (toUpdate.length > 0) {
      // Use bulk upsert for updates - much faster than individual updates
      const { error: updateError } = await supabase
        .from('user_trigger_word_preferences')
        .upsert(toUpdate, { 
          onConflict: 'user_id,system_word_id',
          ignoreDuplicates: false 
        })
      
      if (updateError) {
        // Bulk update error
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
    // Bulk preferences error
    return NextResponse.json({ 
      error: 'Failed to update preferences',
      details: error 
    }, { status: 500 })
  }
}
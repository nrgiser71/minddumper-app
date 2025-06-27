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
        // Insert new preference
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
        console.log('Insert failed, trying upsert:', insertError.code)
        const { error: upsertError } = await supabase
          .from('user_trigger_word_preferences')
          .upsert(toInsert, { onConflict: 'user_id,system_word_id' })
        
        if (upsertError) {
          console.error('Bulk insert/upsert error:', upsertError)
          console.error('Failed to insert:', toInsert)
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
      // Process updates one by one to avoid bulk update issues
      let updateCount = 0
      for (const updateItem of toUpdate) {
        const { error: updateError } = await supabase
          .from('user_trigger_word_preferences')
          .update({
            is_enabled: updateItem.is_enabled,
            updated_at: updateItem.updated_at
          })
          .eq('user_id', updateItem.user_id)
          .eq('system_word_id', updateItem.system_word_id)
        
        if (updateError) {
          console.error('Update error for item:', updateItem, updateError)
        } else {
          updateCount++
        }
      }
      results.push(`Updated ${updateCount} preferences`)
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
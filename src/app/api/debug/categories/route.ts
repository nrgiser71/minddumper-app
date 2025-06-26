import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check current category structure
    const { data: sampleData, error: sampleError } = await supabase
      .from('trigger_words')
      .select('id, word, category')
      .eq('is_active', true)
      .limit(10)

    if (sampleError) {
      return NextResponse.json({ 
        error: 'Database error', 
        details: sampleError.message 
      })
    }

    // Check available columns
    const { data: schemaData } = await supabase
      .from('trigger_words')
      .select('*')
      .limit(1)

    return NextResponse.json({
      sampleData,
      schemaData,
      analysis: {
        hasCategoryField: sampleData?.some(item => item.category),
        totalRecords: sampleData?.length || 0
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
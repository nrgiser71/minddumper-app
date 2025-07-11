import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get profiles table schema
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'profiles')
      .eq('table_schema', 'public')

    if (schemaError) {
      console.error('Schema error:', schemaError)
      return NextResponse.json({ error: 'Failed to get schema' }, { status: 500 })
    }

    // Check if we can access profiles table
    const { data: sampleData, error: sampleError } = await supabase
      .from('profiles')
      .select('id, email, payment_status, stripe_customer_id')
      .limit(1)

    return NextResponse.json({
      success: true,
      schema: schemaData,
      sample_access: sampleError ? { error: sampleError.message } : { success: true, count: sampleData?.length || 0 },
      payment_fields_present: schemaData?.some(col => col.column_name === 'payment_status') || false
    })
  } catch (error) {
    console.error('Database schema check error:', error)
    return NextResponse.json({ error: 'Failed to check database schema' }, { status: 500 })
  }
}
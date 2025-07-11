import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Simple check: try to select payment fields from profiles
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id, email, payment_status, stripe_customer_id, amount_paid_cents, billing_country')
      .limit(1)

    if (testError) {
      return NextResponse.json({ 
        success: false, 
        error: testError.message,
        fields_checked: ['payment_status', 'stripe_customer_id', 'amount_paid_cents', 'billing_country']
      })
    }

    // If we get here, the fields exist
    return NextResponse.json({
      success: true,
      message: 'Payment fields are present in profiles table',
      test_query_worked: true,
      sample_count: testData?.length || 0
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error: ' + (error as Error).message 
    })
  }
}
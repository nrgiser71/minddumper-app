import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Update all users to have paid status
    const { data, error } = await supabase
      .from('profiles')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        amount_paid_cents: 4900 // €49
      })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Update all real users
    
    if (error) {
      console.error('Error updating users:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }
    
    // Get count of updated users
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'paid')
    
    return NextResponse.json({ 
      success: true, 
      message: `Updated all users to paid status`,
      updated_count: count || 0,
      data
    })
    
  } catch (error) {
    console.error('Error in set-all-users-paid:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
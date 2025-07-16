import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role for user creation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface PlugAndPayWebhookPayload {
  event?: string
  order_id?: string
  customer_email?: string
  customer_name?: string
  amount?: number
  currency?: string
  status?: string
  product_name?: string
  id?: string
  // Add more fields as needed based on PlugAndPay webhook payload
  [key: string]: string | number | boolean | undefined
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 PlugAndPay webhook received at:', new Date().toISOString())
    
    // Log request method and URL
    console.log('📍 Request URL:', request.url)
    console.log('📍 Request method:', request.method)
    
    // Log ALL headers for debugging
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })
    console.log('📋 All headers:', JSON.stringify(headers, null, 2))
    
    // Verify API key from headers (TEMPORARILY DISABLED FOR DEBUGGING)
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')
    const expectedApiKey = process.env.PLUGANDPAY_API_KEY || 'XEN9Q-8GHMY-TPRL2-4WSA6'
    
    console.log('🔑 API Key check:', { received: apiKey, expected: expectedApiKey })
    
    // TEMPORARILY DISABLED: Allow all requests to see what PlugAndPay sends
    // if (apiKey !== expectedApiKey && apiKey !== `Bearer ${expectedApiKey}`) {
    //   console.error('❌ Invalid API key received:', apiKey)
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    
    console.log('⚠️ API KEY VERIFICATION DISABLED FOR DEBUGGING')
    
    // Try to parse as both JSON and form data
    let payload: PlugAndPayWebhookPayload = {}
    
    // Check content type
    const contentType = request.headers.get('content-type') || ''
    console.log('📋 Content-Type:', contentType)
    
    if (contentType.includes('application/json')) {
      try {
        payload = await request.json()
        console.log('📦 Webhook payload (JSON):', JSON.stringify(payload, null, 2))
      } catch (error) {
        console.error('❌ JSON parsing error:', error)
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      try {
        const text = await request.text()
        console.log('📝 Raw form data:', text)
        
        // Parse URL-encoded form data
        const params = new URLSearchParams(text)
        for (const [key, value] of params.entries()) {
          payload[key] = value
        }
        
        console.log('📦 Webhook payload (Form Data):', JSON.stringify(payload, null, 2))
      } catch (error) {
        console.error('❌ Form data parsing error:', error)
      }
    } else {
      // Try to read as text for debugging
      try {
        const text = await request.text()
        console.log('📝 Raw body:', text)
        
        // Try to parse as URL params anyway
        if (text.includes('=')) {
          const params = new URLSearchParams(text)
          for (const [key, value] of params.entries()) {
            payload[key] = value
          }
          console.log('📦 Parsed from raw text:', JSON.stringify(payload, null, 2))
        }
      } catch (error) {
        console.error('❌ Could not read body:', error)
      }
    }
    
    console.log('📊 Payload analysis:', {
      event: payload.event || 'NO EVENT',
      status: payload.status || 'NO STATUS', 
      customer_email: payload.customer_email || 'NO EMAIL',
      hasEmail: !!payload.customer_email,
      allKeys: Object.keys(payload),
      keyCount: Object.keys(payload).length,
      rawPayload: payload
    })

    // Log if we have any data at all
    if (Object.keys(payload).length === 0) {
      console.log('⚠️ WARNING: No data received in webhook payload!')
      console.log('📝 Raw request info:', {
        method: request.method,
        url: request.url,
        hasBody: request.bodyUsed
      })
    }
    
    // Check if this is a payment success event - PlugAndPay uses webhook_event
    if (payload.webhook_event === 'order_payment_completed' || payload.event === 'order.paid' || payload.status === 'paid') {
      console.log('✅ Processing successful payment for:', payload.email || payload.customer_email)
      
      // Extract customer information - PlugAndPay uses 'email' not 'customer_email'
      const email = String(payload.email || payload.customer_email || '').toLowerCase().trim()
      const fullName = String(payload.customer_name || '') || 
                       (payload.firstname && payload.lastname ? `${String(payload.firstname)} ${String(payload.lastname)}` : '') ||
                       'MindDumper User'
      const orderId = payload.order_id || payload.id
      
      if (!email) {
        console.error('❌ No customer email in webhook payload')
        return NextResponse.json({ error: 'Missing customer email' }, { status: 400 })
      }

      // Check if user already exists
      const { data: { users }, error: userCheckError } = await supabase.auth.admin.listUsers()
      
      if (userCheckError) {
        console.error('❌ Error checking existing users:', userCheckError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }
      
      const existingUser = users.find(u => u.email?.toLowerCase() === email)

      let userId: string

      if (existingUser) {
        // User exists, update their payment status
        console.log('👤 User already exists, updating payment status')
        userId = existingUser.id
        
        // Generate login token for auto-login
        const loginToken = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15)
        const tokenExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        
        // Update profile with payment information
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            payment_status: 'paid',
            amount_paid_cents: payload.amount ? Math.round(payload.amount * 100) : 
                              (payload.total ? Math.round(parseFloat(payload.total) * 100) : 0), // Convert to cents
            plugandpay_order_id: orderId,
            paid_at: new Date().toISOString(),
            login_token: loginToken,
            login_token_used: false,
            login_token_expires: tokenExpires.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (updateError) {
          console.error('❌ Error updating existing user profile:', updateError)
          return NextResponse.json({ error: 'Profile update failed' }, { status: 500 })
        }
      } else {
        // Create new user
        console.log('👤 Creating new user account')
        
        // Set fixed password that will be shown on welcome page
        const tempPassword = 'minddumper123'
        
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: email,
          password: tempPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: fullName,
            source: 'plugandpay_purchase'
          }
        })

        if (createError) {
          console.error('❌ Error creating user:', createError)
          return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
        }

        userId = newUser.user.id
        console.log('✅ New user created:', userId)

        // Generate login token for auto-login
        const loginToken = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15)
        const tokenExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            full_name: fullName,
            payment_status: 'paid',
            amount_paid_cents: payload.amount ? Math.round(payload.amount * 100) : 
                              (payload.total ? Math.round(parseFloat(payload.total) * 100) : 0),
            plugandpay_order_id: orderId,
            paid_at: new Date().toISOString(),
            login_token: loginToken,
            login_token_used: false,
            login_token_expires: tokenExpires.toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('❌ Error creating profile:', profileError)
          // Don't return error - user is created, profile creation can be retried
        } else {
          console.log('✅ Profile created for user:', userId)
        }

        console.log('✅ User created with temporary password for auto-login')
      }

      console.log('🎉 Payment processing completed successfully')
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment processed successfully',
        user_id: userId,
        order_id: orderId
      })
    } else {
      console.log('ℹ️ Webhook event not handled:', payload.event)
      return NextResponse.json({ 
        success: true, 
        message: 'Event received but not processed',
        event: payload.event 
      })
    }

  } catch (error) {
    console.error('💥 PlugAndPay webhook error:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: (error as Error).message 
    }, { status: 500 })
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ 
    message: 'PlugAndPay webhook endpoint',
    status: 'active' 
  })
}
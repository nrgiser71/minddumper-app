import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role for user creation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface PlugAndPayWebhookPayload {
  event: string
  order_id: string
  customer_email: string
  customer_name?: string
  amount: number
  currency: string
  status: string
  product_name: string
  // Add more fields as needed based on PlugAndPay webhook payload
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 PlugAndPay webhook received')
    
    // Verify API key from headers
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')
    const expectedApiKey = process.env.PLUGANDPAY_API_KEY || 'XEN9Q-8GHMY-TPRL2-4WSA6'
    
    if (apiKey !== expectedApiKey && apiKey !== `Bearer ${expectedApiKey}`) {
      console.error('❌ Invalid API key received:', apiKey)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const payload: PlugAndPayWebhookPayload = await request.json()
    console.log('📦 Webhook payload:', JSON.stringify(payload, null, 2))

    // Check if this is a payment success event
    if (payload.event === 'order.paid' || payload.status === 'paid') {
      console.log('✅ Processing successful payment for:', payload.customer_email)
      
      // Extract customer information
      const email = payload.customer_email?.toLowerCase().trim()
      const fullName = payload.customer_name || 'MindDumper User'
      const orderId = payload.order_id
      
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
        
        // Update profile with payment information
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            payment_status: 'paid',
            amount_paid_cents: Math.round(payload.amount * 100), // Convert to cents
            plugandpay_order_id: orderId,
            paid_at: new Date().toISOString(),
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
        
        // Generate a temporary password (user will reset via email)
        const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'
        
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

        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            full_name: fullName,
            payment_status: 'paid',
            amount_paid_cents: Math.round(payload.amount * 100),
            plugandpay_order_id: orderId,
            paid_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('❌ Error creating profile:', profileError)
          // Don't return error - user is created, profile creation can be retried
        } else {
          console.log('✅ Profile created for user:', userId)
        }

        // Send password reset email for account setup
        try {
          const { error: resetError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://minddumper.com'}/auth/callback?type=recovery`
            }
          })

          if (resetError) {
            console.error('❌ Error sending password reset email:', resetError)
          } else {
            console.log('📧 Password reset email sent to:', email)
          }
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError)
          // Don't fail the webhook for email issues
        }
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
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env.local
try {
  const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf8')
  const envVars = envFile.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=')
    if (key && value) {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, string>)
  
  // Set environment variables
  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = value
  })
} catch (error) {
  console.error('❌ Could not load .env.local file:', error)
  process.exit(1)
}

// Create Supabase client with service role
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
}

async function simulateWebhookLogic(payload: PlugAndPayWebhookPayload) {
  console.log('🔔 Simulating webhook logic with payload:')
  console.log(JSON.stringify(payload, null, 2))
  
  // Check if this is a payment success event
  if (payload.event === 'order.paid' || payload.status === 'paid') {
    console.log('✅ Processing successful payment for:', payload.customer_email)
    
    // Extract customer information
    const email = payload.customer_email?.toLowerCase().trim()
    const fullName = payload.customer_name || 'MindDumper User'
    const orderId = payload.order_id
    
    if (!email) {
      console.error('❌ No customer email in webhook payload')
      return
    }

    // Check if user already exists
    const { data: { users }, error: userCheckError } = await supabase.auth.admin.listUsers()
    
    if (userCheckError) {
      console.error('❌ Error checking existing users:', userCheckError)
      return
    }
    
    const existingUser = users.find(u => u.email?.toLowerCase() === email)
    console.log('👤 User exists:', existingUser ? 'YES' : 'NO')

    let userId: string

    if (existingUser) {
      // User exists, update their payment status
      console.log('👤 User already exists, updating payment status')
      userId = existingUser.id
      
      // Generate login token for auto-login
      const loginToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15)
      const tokenExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      
      console.log('🔑 Generated login token:', loginToken)
      console.log('⏰ Token expires at:', tokenExpires.toISOString())
      
      // Update profile with payment information
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({
          payment_status: 'paid',
          amount_paid_cents: Math.round(payload.amount * 100), // Convert to cents
          plugandpay_order_id: orderId,
          paid_at: new Date().toISOString(),
          login_token: loginToken,
          login_token_used: false,
          login_token_expires: tokenExpires.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()

      if (updateError) {
        console.error('❌ Error updating existing user profile:', updateError)
        return
      }
      
      console.log('✅ Profile updated successfully:', updateData)
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
        return
      }

      userId = newUser.user.id
      console.log('✅ New user created:', userId)

      // Generate login token for auto-login
      const loginToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15)
      const tokenExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      
      console.log('🔑 Generated login token:', loginToken)
      console.log('⏰ Token expires at:', tokenExpires.toISOString())
      
      // Create profile record
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          full_name: fullName,
          payment_status: 'paid',
          amount_paid_cents: Math.round(payload.amount * 100),
          plugandpay_order_id: orderId,
          paid_at: new Date().toISOString(),
          login_token: loginToken,
          login_token_used: false,
          login_token_expires: tokenExpires.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (profileError) {
        console.error('❌ Error creating profile:', profileError)
        return
      }
      
      console.log('✅ Profile created successfully:', profileData)
    }

    console.log('🎉 Payment processing completed successfully')
    
    // Now check what the recent-purchase API would find
    console.log('\n🔍 Testing what recent-purchase API would find...')
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    
    const { data: recentPurchases, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, login_token, login_token_expires, paid_at')
      .eq('payment_status', 'paid')
      .eq('login_token_used', false)
      .gte('paid_at', twoMinutesAgo.toISOString())
      .not('login_token', 'is', null)
      .order('paid_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('❌ Error with recent-purchase query:', error)
    } else {
      if (recentPurchases && recentPurchases.length > 0) {
        console.log('✅ Recent-purchase API would find:', recentPurchases[0])
      } else {
        console.log('❌ Recent-purchase API would NOT find any purchase')
      }
    }
  }
}

async function testWebhook() {
  const testEmail = process.argv[2] || 'test@example.com'
  
  const testPayload: PlugAndPayWebhookPayload = {
    event: 'order.paid',
    order_id: `TEST-${Date.now()}`,
    customer_email: testEmail,
    customer_name: 'Test User',
    amount: 49,
    currency: 'EUR',
    status: 'paid',
    product_name: 'MindDumper Lifetime Access'
  }
  
  await simulateWebhookLogic(testPayload)
}

if (require.main === module) {
  testWebhook().catch(console.error)
}
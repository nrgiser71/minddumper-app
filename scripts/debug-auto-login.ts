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

async function debugAutoLogin() {
  console.log('🔍 Debugging Auto-Login Issues\n')
  
  // 1. Check recent purchases in the last hour
  console.log('1️⃣ Checking recent purchases (last hour)...')
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  
  const { data: recentPurchases, error: purchaseError } = await supabase
    .from('profiles')
    .select('*')
    .eq('payment_status', 'paid')
    .gte('paid_at', oneHourAgo.toISOString())
    .order('paid_at', { ascending: false })
  
  if (purchaseError) {
    console.error('❌ Error fetching purchases:', purchaseError)
  } else {
    console.log(`✅ Found ${recentPurchases?.length || 0} recent purchases:`)
    recentPurchases?.forEach((purchase, index) => {
      console.log(`\n  Purchase ${index + 1}:`)
      console.log(`  - Email: ${purchase.email}`)
      console.log(`  - Paid at: ${purchase.paid_at}`)
      console.log(`  - Order ID: ${purchase.plugandpay_order_id}`)
      console.log(`  - Login token: ${purchase.login_token ? 'SET' : 'NOT SET'}`)
      console.log(`  - Token used: ${purchase.login_token_used}`)
      console.log(`  - Token expires: ${purchase.login_token_expires}`)
    })
  }
  
  // 2. Check recent purchases that would be found by the API (last 2 minutes)
  console.log('\n\n2️⃣ Checking what the recent-purchase API would find (last 2 minutes)...')
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
  
  const { data: apiPurchases, error: apiError } = await supabase
    .from('profiles')
    .select('id, email, full_name, login_token, login_token_expires, paid_at')
    .eq('payment_status', 'paid')
    .eq('login_token_used', false)
    .gte('paid_at', twoMinutesAgo.toISOString())
    .not('login_token', 'is', null)
    .order('paid_at', { ascending: false })
    .limit(1)
  
  if (apiError) {
    console.error('❌ Error with API query:', apiError)
  } else {
    if (apiPurchases && apiPurchases.length > 0) {
      console.log('✅ API would find this purchase:')
      console.log(JSON.stringify(apiPurchases[0], null, 2))
    } else {
      console.log('❌ API would NOT find any purchase')
      console.log('   Possible reasons:')
      console.log('   - Purchase was more than 2 minutes ago')
      console.log('   - login_token is not set')
      console.log('   - login_token_used is already true')
      console.log('   - payment_status is not "paid"')
    }
  }
  
  // 3. Test the recent-purchase API endpoint directly
  console.log('\n\n3️⃣ Testing the recent-purchase API endpoint...')
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/recent-purchase`)
    const data = await response.json()
    console.log('API Response:', response.status, data)
  } catch (error) {
    console.error('❌ Failed to call API:', error)
  }
}

// Run the debug script
debugAutoLogin().catch(console.error)
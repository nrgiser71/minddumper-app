#!/usr/bin/env node

async function testAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  console.log('🧪 Testing API endpoints...\n')
  
  // Test 1: Check recent-purchase endpoint
  console.log('1️⃣ Testing recent-purchase endpoint...')
  try {
    const response = await fetch(`${baseUrl}/api/auth/recent-purchase`)
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ API returned a purchase')
    } else {
      console.log('❌ No purchase found or API error')
    }
  } catch (error) {
    console.error('💥 Error:', error)
  }
  
  // Test 2: Check webhook endpoint (GET request)
  console.log('\n2️⃣ Testing webhook endpoint (GET)...')
  try {
    const response = await fetch(`${baseUrl}/api/plugandpay/webhook`)
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ Webhook endpoint is responding')
    } else {
      console.log('❌ Webhook endpoint error')
    }
  } catch (error) {
    console.error('💥 Error:', error)
  }
  
  // Test 3: Test login-token endpoint (if we have a token)
  if (process.argv[2]) {
    console.log('\n3️⃣ Testing login-token endpoint...')
    try {
      const response = await fetch(`${baseUrl}/api/auth/login-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: process.argv[2] })
      })
      const data = await response.json()
      
      console.log('Status:', response.status)
      console.log('Response:', JSON.stringify(data, null, 2))
      
      if (response.ok) {
        console.log('✅ Login token is valid')
      } else {
        console.log('❌ Login token error')
      }
    } catch (error) {
      console.error('💥 Error:', error)
    }
  }
}

console.log('Usage: npm run test-api [login-token]')
console.log('Example: npm run test-api abc123token\n')

testAPI()
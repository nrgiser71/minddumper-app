#!/usr/bin/env node

async function testWebhook() {
  const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:3000/api/plugandpay/webhook'
  const apiKey = process.env.PLUGANDPAY_API_KEY || 'XEN9Q-8GHMY-TPRL2-4WSA6'
  
  // Test payload that mimics PlugAndPay webhook
  const testPayload = {
    event: 'order.paid',
    order_id: `test-order-${Date.now()}`,
    customer_email: process.argv[2] || 'test@example.com',
    customer_name: 'Test User',
    amount: 0.01, // €0.01 test payment
    currency: 'EUR',
    status: 'paid',
    product_name: 'MindDumper Access'
  }
  
  console.log('🚀 Testing webhook with payload:')
  console.log(JSON.stringify(testPayload, null, 2))
  console.log('\nSending to:', webhookUrl)
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(testPayload)
    })
    
    const responseData = await response.json()
    
    console.log('\n📨 Response:')
    console.log('Status:', response.status)
    console.log('Data:', JSON.stringify(responseData, null, 2))
    
    if (response.ok) {
      console.log('\n✅ Webhook processed successfully!')
      console.log('User ID:', responseData.user_id)
      console.log('Order ID:', responseData.order_id)
    } else {
      console.error('\n❌ Webhook failed!')
    }
    
  } catch (error) {
    console.error('\n💥 Error calling webhook:', error)
  }
}

// Check if email argument is provided
if (process.argv.length < 3) {
  console.log('Usage: npm run test-webhook <email>')
  console.log('Example: npm run test-webhook test@example.com')
  process.exit(1)
}

testWebhook()
require('dotenv').config({ path: '.env.local' });

async function debugWebhookConfig() {
  console.log('🔍 WEBHOOK CONFIGURATIE DEBUG\n');
  
  // Check environment variables
  console.log('📊 Environment Variables:');
  console.log('- PLUGANDPAY_API_KEY:', process.env.PLUGANDPAY_API_KEY ? 'Set' : 'MISSING');
  console.log('- SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'MISSING');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'MISSING');
  
  // Test webhook endpoint accessibility
  console.log('\n🌐 Webhook Endpoint Tests:');
  
  const endpoints = [
    'https://minddumper.com/api/plugandpay/webhook',
    'https://minddumper-app.vercel.app/api/plugandpay/webhook'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📍 Testing: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'User-Agent': 'PlugAndPay-Webhook-Test'
        }
      });
      
      const result = await response.text();
      console.log(`✅ Status: ${response.status}`);
      console.log(`📋 Response: ${result}`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  
  // Test webhook with wrong API key
  console.log('\n🔑 API Key Tests:');
  
  const testPayload = {
    event: 'order.paid',
    order_id: 'test-api-key-check',
    customer_email: 'test@example.com',
    amount: 49.00,
    status: 'paid'
  };
  
  // Test with correct API key
  try {
    const response = await fetch('https://minddumper-app.vercel.app/api/plugandpay/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.PLUGANDPAY_API_KEY || 'XEN9Q-8GHMY-TPRL2-4WSA6'
      },
      body: JSON.stringify(testPayload)
    });
    
    const result = await response.json();
    console.log(`✅ Correct API key: ${response.status} - ${result.message || result.error}`);
  } catch (error) {
    console.error(`❌ Correct API key test failed: ${error.message}`);
  }
  
  // Test with wrong API key
  try {
    const response = await fetch('https://minddumper-app.vercel.app/api/plugandpay/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'WRONG-API-KEY'
      },
      body: JSON.stringify(testPayload)
    });
    
    const result = await response.json();
    console.log(`❌ Wrong API key: ${response.status} - ${result.error}`);
  } catch (error) {
    console.error(`❌ Wrong API key test failed: ${error.message}`);
  }
  
  console.log('\n📋 WEBHOOK CONFIGURATIE CHECKLIST:');
  console.log('□ PlugAndPay webhook URL: https://minddumper-app.vercel.app/api/plugandpay/webhook');
  console.log('□ PlugAndPay API key: XEN9Q-8GHMY-TPRL2-4WSA6');
  console.log('□ Webhook events: order.paid, payment.completed');
  console.log('□ Content-Type: application/json');
  console.log('□ Headers: x-api-key of Authorization');
}

debugWebhookConfig().catch(console.error);
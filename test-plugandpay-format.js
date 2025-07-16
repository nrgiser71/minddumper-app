// Test what PlugAndPay sends
const fetch = require('node-fetch');

async function testWebhook() {
  // Simulate PlugAndPay form-encoded webhook
  const formData = new URLSearchParams();
  formData.append('id', '1329585');
  formData.append('email', 'test@example.com');
  formData.append('status', 'paid');
  
  console.log('📤 Sending form-encoded data:', formData.toString());
  
  try {
    const response = await fetch('https://minddumper-app.vercel.app/api/plugandpay/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });
    
    const result = await response.json();
    console.log('📥 Response:', result);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testWebhook();
require('dotenv').config({ path: '.env.local' });

async function simulateWebhook() {
  const email = 'jbs.jan.buskens+minddumpertest202507165@gmail.com';
  
  const webhookPayload = {
    event: 'order.paid',
    order_id: 'test-order-' + Date.now(),
    customer_email: email,
    customer_name: 'Jan Buskens',
    amount: 49.00,
    currency: 'EUR',
    status: 'paid',
    product_name: 'MindDumper Lifetime Access'
  };
  
  console.log('🔔 Simulating webhook for:', email);
  console.log('📦 Payload:', JSON.stringify(webhookPayload, null, 2));
  
  try {
    const response = await fetch('https://minddumper-app.vercel.app/api/plugandpay/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'XEN9Q-8GHMY-TPRL2-4WSA6'
      },
      body: JSON.stringify(webhookPayload)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook processed successfully!');
      console.log('📋 Result:', result);
      console.log('\n🎉 You should now be able to login with:');
      console.log('Email:', email);
      console.log('Password: minddumper123');
    } else {
      console.error('❌ Webhook failed:', result);
    }
  } catch (error) {
    console.error('💥 Error calling webhook:', error);
  }
}

simulateWebhook().catch(console.error);
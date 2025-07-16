require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUser() {
  const testEmail = 'test@minddumper.com';
  const tempPassword = 'minddumper123';
  
  console.log('🔧 Creating test user for auto-login testing...');
  
  // Create user in auth
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      full_name: 'Test User',
      source: 'test_creation'
    }
  });

  if (createError) {
    console.error('❌ Error creating user:', createError);
    return;
  }

  console.log('✅ User created:', newUser.user.id);

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: newUser.user.id,
      email: testEmail,
      full_name: 'Test User',
      payment_status: 'paid',
      amount_paid_cents: 4900,
      plugandpay_order_id: 'test-order-123',
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (profileError) {
    console.error('❌ Error creating profile:', profileError);
  } else {
    console.log('✅ Profile created');
    console.log('🎉 Test user ready! You can now test auto-login at: https://minddumper.com/welcome');
  }
}

createTestUser().catch(console.error);
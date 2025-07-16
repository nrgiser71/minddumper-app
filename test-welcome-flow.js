require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testWelcomeFlow() {
  console.log('🎉 Testing Welcome Page Auto-Login Flow\n');
  
  // Step 1: Call latest-user API
  console.log('🔍 Step 1: Fetching latest user...');
  const response = await fetch('https://minddumper-app.vercel.app/api/auth/latest-user');
  const result = await response.json();
  
  if (!response.ok || !result.success) {
    console.error('❌ Failed to get latest user:', result.message);
    return;
  }
  
  const latestUserEmail = result.user.email;
  console.log('✅ Latest user email:', latestUserEmail);
  
  // Step 2: Attempt auto-login
  console.log('\n🔐 Step 2: Attempting auto-login...');
  const tempPassword = 'minddumper123';
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: latestUserEmail,
    password: tempPassword,
  });

  if (error) {
    console.error('❌ Auto-login failed:', error.message);
    return;
  }
  
  console.log('✅ Auto-login successful!');
  console.log('✅ User ID:', data.user.id);
  console.log('✅ User email:', data.user.email);
  
  // Step 3: Check session
  console.log('\n👤 Step 3: Checking session...');
  const { data: session } = await supabase.auth.getSession();
  
  if (session.session) {
    console.log('✅ Valid session found');
    console.log('✅ Session expires at:', new Date(session.session.expires_at * 1000));
  } else {
    console.log('❌ No valid session');
  }
  
  console.log('\n🎯 Welcome Page Auto-Login Flow: SUCCESSFUL! 🎉');
  console.log('👉 Next step: User will be redirected to /auth/reset-password');
}

testWelcomeFlow().catch(console.error);
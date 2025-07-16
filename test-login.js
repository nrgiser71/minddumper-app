require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testLogin() {
  const email = 'test@example.com';
  const password = 'minddumper123';
  
  console.log('🔐 Testing login with:', email);
  console.log('🔑 Password:', password);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('❌ Login failed:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Login successful!');
    console.log('User ID:', data.user.id);
    console.log('User email:', data.user.email);
  }
}

testLogin().catch(console.error);
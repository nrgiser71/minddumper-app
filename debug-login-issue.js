require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugLoginIssue() {
  console.log('🔍 Debugging login issue...\n');
  
  // Check all users with paid status
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false });
    
  if (profileError) {
    console.error('❌ Error fetching profiles:', profileError);
    return;
  }
  
  console.log('👥 Found', profiles.length, 'paid users:');
  profiles.forEach((profile, index) => {
    console.log(`${index + 1}. ${profile.email} - Created: ${profile.created_at}`);
  });
  
  // Check auth users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('❌ Error fetching auth users:', authError);
    return;
  }
  
  console.log('\n🔐 Auth users:');
  authUsers.users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email} - ID: ${user.id} - Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
  });
  
  // Test login with test@example.com
  const testEmail = 'test@example.com';
  const testPassword = 'minddumper123';
  
  console.log(`\n🔑 Testing login with ${testEmail} and password ${testPassword}...`);
  
  const clientSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { data, error } = await clientSupabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
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

debugLoginIssue().catch(console.error);
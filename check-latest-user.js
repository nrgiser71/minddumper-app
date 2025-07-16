require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLatestUser() {
  console.log('🔍 Checking latest paid user...\n');
  
  // Get latest paid user
  const { data: latestUser, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(3); // Get last 3 to see recent activity
    
  if (error) {
    console.error('❌ Error fetching latest user:', error);
    return;
  }
  
  console.log('📊 Latest paid users:');
  latestUser.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email} - Created: ${user.created_at}`);
  });
  
  if (latestUser.length === 0) {
    console.log('❌ No paid users found');
    return;
  }
  
  const newestUser = latestUser[0];
  console.log(`\n🎯 Latest user: ${newestUser.email}`);
  
  // Check if this user exists in auth
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('❌ Error fetching auth users:', authError);
    return;
  }
  
  const authUser = authUsers.users.find(u => u.email === newestUser.email);
  
  if (!authUser) {
    console.log('❌ User not found in auth system');
    return;
  }
  
  console.log(`✅ User found in auth: ${authUser.id}`);
  
  // Try to update password
  console.log('\n🔑 Setting password to minddumper123...');
  
  const { error: updateError } = await supabase.auth.admin.updateUserById(authUser.id, {
    password: 'minddumper123'
  });
  
  if (updateError) {
    console.error('❌ Error updating password:', updateError);
    return;
  }
  
  console.log('✅ Password updated successfully!');
  
  // Test login
  console.log('\n🔐 Testing login...');
  
  const clientSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { data, error: loginError } = await clientSupabase.auth.signInWithPassword({
    email: newestUser.email,
    password: 'minddumper123',
  });

  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
  } else {
    console.log('✅ Login successful!');
    console.log(`🎉 You can now login with: ${newestUser.email} / minddumper123`);
  }
}

checkLatestUser().catch(console.error);
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixNewUser() {
  const email = 'jbs.jan.buskens+minddumpertest202507165@gmail.com';
  const password = 'minddumper123';
  
  console.log('🔧 Fixing password for:', email);
  
  // Find the user in auth
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError);
    return;
  }
  
  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.log('❌ User not found in auth system');
    return;
  }
  
  console.log('✅ User found in auth:', user.id);
  console.log('📅 Created:', user.created_at);
  console.log('✉️ Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No');
  
  // Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: password
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
    email: email,
    password: password,
  });

  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
    console.error('Error details:', loginError);
  } else {
    console.log('✅ Login successful!');
    console.log('🎉 You can now login with:');
    console.log('Email:', email);
    console.log('Password:', password);
  }
}

fixNewUser().catch(console.error);
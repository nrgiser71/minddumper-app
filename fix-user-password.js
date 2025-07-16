require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixUserPassword() {
  const email = 'test@example.com';
  const newPassword = 'minddumper123';
  
  console.log('🔧 Fixing password for:', email);
  
  // Find the user
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError);
    return;
  }
  
  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.log('❌ User not found');
    return;
  }
  
  console.log('👤 Found user:', user.id);
  
  // Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword
  });
  
  if (updateError) {
    console.error('❌ Error updating password:', updateError);
    return;
  }
  
  console.log('✅ Password updated successfully!');
  
  // Test the login
  console.log('\n🔑 Testing login...');
  
  const clientSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { data, error } = await clientSupabase.auth.signInWithPassword({
    email: email,
    password: newPassword,
  });

  if (error) {
    console.error('❌ Login still failed:', error.message);
  } else {
    console.log('✅ Login now works!');
    console.log('User ID:', data.user.id);
    console.log('User email:', data.user.email);
  }
}

fixUserPassword().catch(console.error);
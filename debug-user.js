require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugUser() {
  const email = 'test@example.com';
  
  console.log('🔍 Debugging user:', email);
  
  // Check if user exists in auth
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError);
    return;
  }
  
  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.log('❌ User not found in auth');
    return;
  }
  
  console.log('✅ User found in auth:');
  console.log('- ID:', user.id);
  console.log('- Email:', user.email);
  console.log('- Created:', user.created_at);
  console.log('- Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No');
  console.log('- Last sign in:', user.last_sign_in_at || 'Never');
  console.log('- Metadata:', user.user_metadata);
  
  // Check profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();
    
  if (profileError) {
    console.log('❌ Profile error:', profileError.message);
  } else {
    console.log('✅ Profile found:');
    console.log('- Payment status:', profile.payment_status);
    console.log('- Created at:', profile.created_at);
  }
  
  // Try to update user password
  console.log('\n🔑 Updating user password to minddumper123...');
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: 'minddumper123'
  });
  
  if (updateError) {
    console.error('❌ Error updating password:', updateError);
  } else {
    console.log('✅ Password updated successfully!');
  }
}

debugUser().catch(console.error);
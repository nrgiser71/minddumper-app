require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkNewUser() {
  const email = 'jbs.jan.buskens+minddumpertest202507165@gmail.com';
  
  console.log('🔍 Checking for user:', email);
  
  // Check profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();
    
  if (profileError) {
    console.log('❌ Profile not found:', profileError.message);
  } else {
    console.log('✅ Profile found:');
    console.log('- Payment status:', profile.payment_status);
    console.log('- Created:', profile.created_at);
    console.log('- Order ID:', profile.plugandpay_order_id);
  }
  
  // Check auth
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError);
    return;
  }
  
  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.log('❌ User not found in auth system');
    
    if (profile) {
      console.log('\n🔧 Profile exists but no auth user - creating auth user...');
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: 'minddumper123',
        email_confirm: true,
        user_metadata: {
          full_name: profile.full_name || 'MindDumper User',
          source: 'manual_fix'
        }
      });

      if (createError) {
        console.error('❌ Error creating auth user:', createError);
      } else {
        console.log('✅ Auth user created:', newUser.user.id);
        console.log('🎉 You can now login with:');
        console.log('Email:', email);
        console.log('Password: minddumper123');
      }
    }
  } else {
    console.log('✅ User found in auth:', user.id);
  }
}

checkNewUser().catch(console.error);
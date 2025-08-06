require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPeterAccounts() {
  console.log('🔍 Checking for duplicate Peter accounts...\n');
  
  // Check profiles table
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'dejonghe.peter@gmail.com')
    .order('created_at', { ascending: true });
    
  if (profileError) {
    console.error('❌ Error fetching profiles:', profileError);
    return;
  }
  
  console.log(`📊 Found ${profiles.length} profile(s) for dejonghe.peter@gmail.com:`);
  profiles.forEach((profile, index) => {
    console.log(`\n${index + 1}. Profile ID: ${profile.id}`);
    console.log(`   Created: ${profile.created_at}`);
    console.log(`   Updated: ${profile.updated_at}`);
    console.log(`   Payment Status: ${profile.payment_status}`);
    console.log(`   Paid At: ${profile.paid_at}`);
    console.log(`   Order ID: ${profile.plugandpay_order_id}`);
    console.log(`   Amount Paid: €${(profile.amount_paid_cents || 0) / 100}`);
  });
  
  // Check auth system
  console.log('\n🔍 Checking auth system...');
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('❌ Error fetching auth users:', authError);
    return;
  }
  
  const peterAuthUsers = authData.users.filter(u => u.email === 'dejonghe.peter@gmail.com');
  console.log(`📊 Found ${peterAuthUsers.length} auth user(s) for dejonghe.peter@gmail.com:`);
  
  peterAuthUsers.forEach((user, index) => {
    console.log(`\n${index + 1}. Auth User ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Created: ${user.created_at}`);
    console.log(`   Last Sign In: ${user.last_sign_in_at || 'Never'}`);
    console.log(`   Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
  });
  
  // Summary
  console.log('\n📋 SUMMARY:');
  if (profiles.length === 1 && peterAuthUsers.length === 1) {
    console.log('✅ Only 1 account exists - the webhook updated the existing account');
    console.log('✅ No duplicates created');
  } else if (profiles.length > 1 || peterAuthUsers.length > 1) {
    console.log('⚠️ Multiple accounts detected!');
    console.log(`   Profiles: ${profiles.length}`);
    console.log(`   Auth Users: ${peterAuthUsers.length}`);
  } else {
    console.log('❌ Unexpected account state');
  }
}

checkPeterAccounts();
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugToday() {
  console.log('🔍 Checking activity in last 4 hours...\n');
  console.log('Current time:', new Date().toISOString());
  
  // Check last 4 hours
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
  console.log('Looking since:', fourHoursAgo.toISOString());
  
  // Look for any profiles created/updated in last 4 hours
  const { data: recentProfiles, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`created_at.gte.${fourHoursAgo.toISOString()},updated_at.gte.${fourHoursAgo.toISOString()}`)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('❌ Error fetching profiles:', error);
    return;
  }
  
  console.log(`\n📊 Found ${recentProfiles.length} profiles with activity in last 4 hours:\n`);
  
  recentProfiles.forEach((profile, index) => {
    console.log(`${index + 1}. Email: ${profile.email}`);
    console.log(`   Created: ${profile.created_at}`);
    console.log(`   Updated: ${profile.updated_at}`);
    console.log(`   Payment Status: ${profile.payment_status}`);
    console.log(`   Paid At: ${profile.paid_at}`);
    console.log(`   Order ID: ${profile.plugandpay_order_id}`);
    console.log(`   Login Token: ${profile.login_token ? 'SET' : 'NOT SET'}`);
    console.log(`   Token Used: ${profile.login_token_used}`);
    console.log(`   Token Expires: ${profile.login_token_expires}`);
    console.log('   ─────────────────────────────');
  });
  
  // Specifically check for dejonghe.peter@gmail.com
  console.log('\n🔍 Searching specifically for dejonghe.peter@gmail.com...');
  const { data: peterProfile, error: peterError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'dejonghe.peter@gmail.com');
    
  if (peterError) {
    console.error('❌ Error searching for Peter:', peterError);
  } else if (peterProfile.length === 0) {
    console.log('❌ NO PROFILE FOUND for dejonghe.peter@gmail.com!');
    console.log('   This explains why auto-login failed!');
  } else {
    console.log('✅ Profile found for dejonghe.peter@gmail.com:');
    console.log(JSON.stringify(peterProfile[0], null, 2));
  }
  
  // Check auth users for dejonghe.peter@gmail.com
  console.log('\n🔍 Checking auth system for dejonghe.peter@gmail.com...');
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('❌ Error fetching auth users:', authError);
  } else {
    const peterAuthUser = authUsers.users.find(u => u.email === 'dejonghe.peter@gmail.com');
    if (!peterAuthUser) {
      console.log('❌ NO AUTH USER FOUND for dejonghe.peter@gmail.com!');
      console.log('   The webhook did not create the user account!');
    } else {
      console.log('✅ Auth user found:', peterAuthUser.email, peterAuthUser.id);
    }
  }
}

debugToday().catch(console.error);
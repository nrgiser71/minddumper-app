require('dotenv').config({ path: '.env.local' });

async function testLatestUserAPI() {
  console.log('🔍 Testing latest-user API fix...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/latest-user');
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ API Response:');
      console.log(`- Email: ${data.user.email}`);
      console.log(`- Created: ${data.user.created_at}`);
      console.log(`- Paid: ${data.user.paid_at}`);
      
      if (data.user.email === 'dejonghe.peter@gmail.com') {
        console.log('\n🎉 SUCCESS! Now returns Peter as latest user!');
      } else {
        console.log(`\n❌ Still returning: ${data.user.email}`);
      }
    } else {
      console.error('❌ API Error:', data);
    }
  } catch (error) {
    console.error('💥 Failed to test API:', error.message);
    console.log('\nℹ️ Make sure the dev server is running: npm run dev');
  }
}

testLatestUserAPI();
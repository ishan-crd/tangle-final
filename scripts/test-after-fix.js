const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserCreation() {
  console.log('🧪 Testing User Creation After RLS Fix...\n');

  try {
    // Test the exact same data structure your app uses
    const testUser = {
      name: "Number User",
      age: 0,
      phone: "+910123456789",
      interests: [],
      address: "",
      society: "",
      flat: "",
      avatar: "",
      bio: "",
      gender: ""
    };

    console.log('📝 Creating user with data:', testUser);

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([testUser])
      .select();

    if (error) {
      console.log('❌ User creation failed:');
      console.log('   Error message:', error.message);
      console.log('   Error code:', error.code);
      console.log('   Error details:', error.details);
      console.log('   Error hint:', error.hint);
      
      console.log('\n🚨 The RLS fix did not work. Please run the COMPLETE_RLS_FIX.sql script again.');
    } else {
      console.log('✅ User creation succeeded!');
      console.log('   User ID:', data[0].id);
      console.log('   User name:', data[0].name);
      console.log('   User phone:', data[0].phone);
      
      // Clean up the test user
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('phone', '+910123456789');
      
      if (deleteError) {
        console.log('⚠️  Could not delete test user:', deleteError.message);
      } else {
        console.log('✅ Test user cleaned up');
      }
      
      console.log('\n🎉 SUCCESS! Your app should now work properly.');
      console.log('The RLS fix worked and user creation is now possible.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function testTableAccess() {
  console.log('\n🔍 Testing table access...');
  
  const tables = ['user_profiles', 'posts', 'matches', 'countries', 'states', 'societies'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Accessible`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
}

// Run the test
if (require.main === module) {
  console.log('🎯 Test After RLS Fix');
  console.log('=====================\n');
  
  testTableAccess().then(() => {
    testUserCreation();
  });
}

module.exports = { testUserCreation, testTableAccess }; 
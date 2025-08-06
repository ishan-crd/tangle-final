const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAgeFix() {
  console.log('🧪 Testing Age Constraint Fix...\n');

  try {
    // Test 1: Try the exact app data that was failing
    console.log('1️⃣ Testing with app data (age: 0)...');
    
    const appUser = {
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

    console.log('   Creating user with data:', appUser);

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([appUser])
      .select();

    if (error) {
      console.log('   ❌ Still failing:', error.message);
      console.log('   🔍 The age constraint fix did not work.');
    } else {
      console.log('   ✅ SUCCESS! User created with age 0');
      console.log('   📊 User ID:', data[0].id);
      console.log('   📊 User name:', data[0].name);
      console.log('   📊 User age:', data[0].age);
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('phone', "+910123456789");
      
      if (deleteError) {
        console.log('   ⚠️  Could not delete test user:', deleteError.message);
      } else {
        console.log('   ✅ Test user cleaned up');
      }
    }

    // Test 2: Test other age values to make sure they still work
    console.log('\n2️⃣ Testing other age values...');
    
    const testCases = [
      { age: 1, description: 'Age 1' },
      { age: 18, description: 'Age 18' },
      { age: 25, description: 'Age 25' },
      { age: null, description: 'Null age' }
    ];

    for (const testCase of testCases) {
      const testUser = {
        name: `Test User ${testCase.age}`,
        age: testCase.age,
        phone: `+9198765432${testCase.age}`,
        interests: ['Test'],
        society: 'Test Society',
        flat: 'Test-101',
        bio: `Test user with age ${testCase.age}`,
        gender: 'Other'
      };

      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .insert([testUser])
        .select();

      if (testError) {
        console.log(`   ❌ ${testCase.description} failed: ${testError.message}`);
      } else {
        console.log(`   ✅ ${testCase.description} succeeded`);
        
        // Clean up
        await supabase
          .from('user_profiles')
          .delete()
          .eq('phone', `+9198765432${testCase.age}`);
      }
    }

    // Test 3: Test negative age (should fail)
    console.log('\n3️⃣ Testing negative age (should fail)...');
    
    const negativeUser = {
      name: "Negative Age User",
      age: -1,
      phone: "+919876543299",
      interests: ['Test'],
      society: 'Test Society',
      flat: 'Test-101'
    };

    const { data: negData, error: negError } = await supabase
      .from('user_profiles')
      .insert([negativeUser])
      .select();

    if (negError) {
      console.log('   ✅ Negative age correctly rejected:', negError.message);
    } else {
      console.log('   ⚠️  Negative age was accepted (this might be a problem)');
      
      // Clean up
      await supabase
        .from('user_profiles')
        .delete()
        .eq('phone', "+919876543299");
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
if (require.main === module) {
  console.log('🎯 Age Constraint Fix Test');
  console.log('==========================\n');
  
  testAgeFix().then(() => {
    console.log('\n📋 Summary:');
    console.log('If the first test succeeds, your app should work now!');
    console.log('If it still fails, run the FIX_AGE_CONSTRAINT.sql script again.');
  });
}

module.exports = { testAgeFix }; 
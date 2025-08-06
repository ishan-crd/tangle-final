const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConstraints() {
  console.log('🔍 Checking Database Constraints...\n');

  try {
    // Test 1: Check table structure
    console.log('1️⃣ Checking user_profiles table structure...');
    const { data: structureData, error: structureError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0);
    
    if (structureError) {
      console.log('❌ Structure error:', structureError.message);
    } else {
      console.log('✅ Table structure accessible');
    }

    // Test 2: Try to insert with different age values
    console.log('\n2️⃣ Testing age constraint with different values...');
    
    const testCases = [
      { age: 0, description: 'Zero age' },
      { age: 1, description: 'Age 1' },
      { age: 18, description: 'Age 18' },
      { age: 25, description: 'Age 25' },
      { age: 100, description: 'Age 100' },
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

      console.log(`\n   Testing ${testCase.description}...`);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([testUser])
        .select();

      if (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        if (error.message.includes('age_check')) {
          console.log(`   🔍 This is the age constraint error!`);
        }
      } else {
        console.log(`   ✅ Success: Created user with age ${testCase.age}`);
        
        // Clean up
        await supabase
          .from('user_profiles')
          .delete()
          .eq('phone', `+9198765432${testCase.age}`);
      }
    }

    // Test 3: Check what the actual constraint might be
    console.log('\n3️⃣ Testing with the exact data from your app...');
    
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

    console.log('   Testing with app data:', appUser);
    
    const { data: appData, error: appError } = await supabase
      .from('user_profiles')
      .insert([appUser])
      .select();

    if (appError) {
      console.log(`   ❌ App data failed: ${appError.message}`);
      console.log(`   🔍 This is the exact error your app is getting!`);
    } else {
      console.log(`   ✅ App data succeeded!`);
      
      // Clean up
      await supabase
        .from('user_profiles')
        .delete()
        .eq('phone', "+910123456789");
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function checkTableInfo() {
  console.log('\n📋 Checking table information...');
  
  try {
    // Try to get table info using a simple query
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Cannot access table:', error.message);
    } else {
      console.log('✅ Table is accessible');
      console.log('📊 Sample data structure:', Object.keys(data[0] || {}));
    }
  } catch (error) {
    console.log('❌ Error checking table:', error.message);
  }
}

// Run the checks
if (require.main === module) {
  console.log('🎯 Database Constraint Check');
  console.log('===========================\n');
  
  checkTableInfo().then(() => {
    checkConstraints();
  });
}

module.exports = { checkConstraints, checkTableInfo }; 
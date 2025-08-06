const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompleteSetup() {
  console.log('🧪 Testing Complete Setup...\n');

  try {
    // Test 1: Check if we can access all tables
    console.log('1️⃣ Testing table access...');
    const tables = ['user_profiles', 'posts', 'matches', 'countries', 'states', 'societies'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table}: Accessible`);
        }
      } catch (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      }
    }

    // Test 2: Test user creation with age 0 (the original issue)
    console.log('\n2️⃣ Testing user creation with age 0...');
    
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

    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .insert([testUser])
      .select();

    if (userError) {
      console.log('   ❌ User creation failed:', userError.message);
      console.log('   🔍 The age constraint fix did not work.');
    } else {
      console.log('   ✅ User created with age 0 successfully!');
      console.log('   📊 User ID:', userData[0].id);
      
      // Clean up
      await supabase
        .from('user_profiles')
        .delete()
        .eq('phone', "+910123456789");
    }

    // Test 3: Test states and societies data
    console.log('\n3️⃣ Testing states and societies data...');
    
    const { data: states, error: statesError } = await supabase
      .from('states')
      .select('*')
      .limit(5);
    
    if (statesError) {
      console.log('   ❌ States query failed:', statesError.message);
    } else {
      console.log(`   ✅ Found ${states.length} states`);
      console.log('   📊 Sample states:', states.map(s => s.name).join(', '));
    }

    const { data: societies, error: societiesError } = await supabase
      .from('societies')
      .select('*, states(name)')
      .limit(5);
    
    if (societiesError) {
      console.log('   ❌ Societies query failed:', societiesError.message);
    } else {
      console.log(`   ✅ Found ${societies.length} societies`);
      console.log('   📊 Sample societies:', societies.map(s => s.name).join(', '));
    }

    // Test 4: Test complete user profile creation
    console.log('\n4️⃣ Testing complete user profile creation...');
    
    const completeUser = {
      name: "Complete Test User",
      age: 25,
      phone: "+919876543203",
      interests: ["Football", "Gaming", "Technology"],
      address: "Test Address",
      society: "New Greens",
      flat: "A-101",
      avatar: "https://example.com/avatar.jpg",
      bio: "This is a test bio for the complete user profile.",
      gender: "Male"
    };

    const { data: completeData, error: completeError } = await supabase
      .from('user_profiles')
      .insert([completeUser])
      .select();

    if (completeError) {
      console.log('   ❌ Complete user creation failed:', completeError.message);
    } else {
      console.log('   ✅ Complete user profile created successfully!');
      console.log('   📊 User details:', {
        id: completeData[0].id,
        name: completeData[0].name,
        age: completeData[0].age,
        interests: completeData[0].interests,
        society: completeData[0].society,
        bio: completeData[0].bio
      });
      
      // Clean up
      await supabase
        .from('user_profiles')
        .delete()
        .eq('phone', "+919876543203");
    }

    // Test 5: Test society search functionality
    console.log('\n5️⃣ Testing society search...');
    
    const { data: delhiSocieties, error: delhiError } = await supabase
      .from('societies')
      .select('*, states(name)')
      .eq('states.name', 'Delhi');
    
    if (delhiError) {
      console.log('   ❌ Delhi societies query failed:', delhiError.message);
    } else {
      console.log(`   ✅ Found ${delhiSocieties.length} societies in Delhi`);
      console.log('   📊 Delhi societies:', delhiSocieties.map(s => s.name).join(', '));
    }

    // Test 6: Test Uttar Pradesh societies (from your original requirements)
    console.log('\n6️⃣ Testing Uttar Pradesh societies...');
    
    const { data: upSocieties, error: upError } = await supabase
      .from('societies')
      .select('*, states(name)')
      .eq('states.name', 'Uttar Pradesh');
    
    if (upError) {
      console.log('   ❌ UP societies query failed:', upError.message);
    } else {
      console.log(`   ✅ Found ${upSocieties.length} societies in Uttar Pradesh`);
      console.log('   📊 UP societies:', upSocieties.map(s => s.name).join(', '));
      
      // Check if the required societies exist
      const requiredSocieties = ['Eldeco Utopia', 'Ajnara', 'Shipra Neo', 'ATS Indira'];
      const foundSocieties = upSocieties.map(s => s.name);
      const missingSocieties = requiredSocieties.filter(s => !foundSocieties.includes(s));
      
      if (missingSocieties.length > 0) {
        console.log('   ⚠️  Missing required societies:', missingSocieties.join(', '));
      } else {
        console.log('   ✅ All required UP societies found!');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
if (require.main === module) {
  console.log('🎯 Complete Setup Test');
  console.log('======================\n');
  
  testCompleteSetup().then(() => {
    console.log('\n📋 Summary:');
    console.log('✅ If all tests pass, your app should work perfectly!');
    console.log('✅ The society dropdown should now work with real data');
    console.log('✅ User creation with age 0 should work');
    console.log('✅ All onboarding pages should function properly');
  });
}

module.exports = { testCompleteSetup }; 
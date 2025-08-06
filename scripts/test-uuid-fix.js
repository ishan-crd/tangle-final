const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUUIDFix() {
  console.log('🧪 Testing UUID Fix...\n');

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

    // Test 2: Test user creation with age 0
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

    // Test 4: Test Delhi societies specifically
    console.log('\n4️⃣ Testing Delhi societies...');
    
    const { data: delhiSocieties, error: delhiError } = await supabase
      .from('societies')
      .select('*, states(name)')
      .eq('states.name', 'Delhi');
    
    if (delhiError) {
      console.log('   ❌ Delhi societies query failed:', delhiError.message);
    } else {
      console.log(`   ✅ Found ${delhiSocieties.length} societies in Delhi`);
      console.log('   📊 Delhi societies:', delhiSocieties.map(s => s.name).join(', '));
      
      // Check for required societies
      const requiredSocieties = ['New Greens', 'Plak Rounds'];
      const foundSocieties = delhiSocieties.map(s => s.name);
      const missingSocieties = requiredSocieties.filter(s => !foundSocieties.includes(s));
      
      if (missingSocieties.length > 0) {
        console.log('   ⚠️  Missing required societies:', missingSocieties.join(', '));
      } else {
        console.log('   ✅ All required Delhi societies found!');
      }
    }

    // Test 5: Test Uttar Pradesh societies
    console.log('\n5️⃣ Testing Uttar Pradesh societies...');
    
    const { data: upSocieties, error: upError } = await supabase
      .from('societies')
      .select('*, states(name)')
      .eq('states.name', 'Uttar Pradesh');
    
    if (upError) {
      console.log('   ❌ UP societies query failed:', upError.message);
    } else {
      console.log(`   ✅ Found ${upSocieties.length} societies in Uttar Pradesh`);
      console.log('   📊 UP societies:', upSocieties.map(s => s.name).join(', '));
      
      // Check for required societies
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
  console.log('🎯 UUID Fix Test');
  console.log('================\n');
  
  testUUIDFix().then(() => {
    console.log('\n📋 Summary:');
    console.log('✅ If all tests pass, the UUID fix worked!');
    console.log('✅ Your app should now work with the society dropdown');
    console.log('✅ User creation with age 0 should work');
  });
}

module.exports = { testUUIDFix }; 
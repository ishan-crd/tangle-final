const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompleteOnboarding() {
  console.log('🧪 Testing Complete Onboarding Flow...\n');

  try {
    // Test 1: Create a user with minimal data (like signup screen)
    console.log('1️⃣ Testing user creation (signup screen)...');
    
    const testUser = {
      name: "Test User",
      age: 0,
      phone: "+919876543204",
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
      return;
    } else {
      console.log('   ✅ User created successfully!');
      console.log('   📊 User ID:', userData[0].id);
    }

    const userId = userData[0].id;

    // Test 2: Update user profile (like profilebasic screen)
    console.log('\n2️⃣ Testing profile update (profilebasic screen)...');
    
    const profileUpdate = {
      name: "John Doe",
      age: 25,
      gender: "Male"
    };

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .update(profileUpdate)
      .eq('id', userId)
      .select();

    if (profileError) {
      console.log('   ❌ Profile update failed:', profileError.message);
    } else {
      console.log('   ✅ Profile updated successfully!');
      console.log('   📊 Updated name:', profileData[0].name);
      console.log('   📊 Updated age:', profileData[0].age);
      console.log('   📊 Updated gender:', profileData[0].gender);
    }

    // Test 3: Update address and society (like addressscreen)
    console.log('\n3️⃣ Testing address update (addressscreen)...');
    
    const addressUpdate = {
      society: "New Greens",
      flat: "A-101",
      society_id: "550e8400-e29b-41d4-a716-446655440012",
      state_id: "550e8400-e29b-41d4-a716-446655440002"
    };

    const { data: addressData, error: addressError } = await supabase
      .from('user_profiles')
      .update(addressUpdate)
      .eq('id', userId)
      .select();

    if (addressError) {
      console.log('   ❌ Address update failed:', addressError.message);
    } else {
      console.log('   ✅ Address updated successfully!');
      console.log('   📊 Society:', addressData[0].society);
      console.log('   📊 Flat:', addressData[0].flat);
      console.log('   📊 Society ID:', addressData[0].society_id);
      console.log('   📊 State ID:', addressData[0].state_id);
    }

    // Test 4: Update interests (like interestscreen)
    console.log('\n4️⃣ Testing interests update (interestscreen)...');
    
    const interestsUpdate = {
      interests: ["Football", "Gaming", "Technology"]
    };

    const { data: interestsData, error: interestsError } = await supabase
      .from('user_profiles')
      .update(interestsUpdate)
      .eq('id', userId)
      .select();

    if (interestsError) {
      console.log('   ❌ Interests update failed:', interestsError.message);
    } else {
      console.log('   ✅ Interests updated successfully!');
      console.log('   📊 Interests:', interestsData[0].interests);
    }

    // Test 5: Update bio (like aboutyou screen)
    console.log('\n5️⃣ Testing bio update (aboutyou screen)...');
    
    const bioUpdate = {
      bio: "This is a test bio for the complete onboarding flow. I love sports and technology!"
    };

    const { data: bioData, error: bioError } = await supabase
      .from('user_profiles')
      .update(bioUpdate)
      .eq('id', userId)
      .select();

    if (bioError) {
      console.log('   ❌ Bio update failed:', bioError.message);
    } else {
      console.log('   ✅ Bio updated successfully!');
      console.log('   📊 Bio:', bioData[0].bio);
    }

    // Test 6: Verify complete user profile
    console.log('\n6️⃣ Testing complete user profile...');
    
    const { data: completeUser, error: completeError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (completeError) {
      console.log('   ❌ Complete user fetch failed:', completeError.message);
    } else {
      console.log('   ✅ Complete user profile retrieved!');
      console.log('   📊 Final user data:', {
        name: completeUser.name,
        age: completeUser.age,
        gender: completeUser.gender,
        society: completeUser.society,
        flat: completeUser.flat,
        interests: completeUser.interests,
        bio: completeUser.bio,
        society_id: completeUser.society_id,
        state_id: completeUser.state_id
      });
    }

    // Test 7: Test states and societies data
    console.log('\n7️⃣ Testing states and societies data...');
    
    const { data: states, error: statesError } = await supabase
      .from('states')
      .select('*')
      .limit(3);
    
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

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (deleteError) {
      console.log('   ⚠️  Could not delete test user:', deleteError.message);
    } else {
      console.log('   ✅ Test user cleaned up');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
if (require.main === module) {
  console.log('🎯 Complete Onboarding Flow Test');
  console.log('================================\n');
  
  testCompleteOnboarding().then(() => {
    console.log('\n📋 Summary:');
    console.log('✅ If all tests pass, your complete onboarding flow works!');
    console.log('✅ All onboarding pages are properly connected');
    console.log('✅ Database integration is working');
    console.log('✅ User data is being saved correctly');
  });
}

module.exports = { testCompleteOnboarding }; 
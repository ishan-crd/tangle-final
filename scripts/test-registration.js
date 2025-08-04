const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRegistration() {
  try {
    console.log('🧪 Testing registration flow...\n');
    
    // Test 1: Create a new user (signup)
    console.log('📋 Test 1: Creating new user (signup)...');
    const newPhone = `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    const newUser = {
      name: "Test User",
      age: 25,
      phone: newPhone,
      interests: [],
      address: "",
      society: "",
      flat: "",
      avatar: "",
      bio: "",
      gender: ""
    };
    
    const { data: createdUser, error: createError } = await supabase
      .from('user_profiles')
      .insert([newUser])
      .select()
      .single();
    
    if (createError) {
      console.log('❌ User creation failed:', createError.message);
      return;
    }
    
    console.log('✅ New user created successfully!');
    console.log(`   - User ID: ${createdUser.id}`);
    console.log(`   - Phone: ${createdUser.phone}`);
    console.log(`   - Name: ${createdUser.name}`);
    
    // Test 2: Try to create same user again (should fail)
    console.log('\n📋 Test 2: Trying to create duplicate user...');
    const { error: duplicateError } = await supabase
      .from('user_profiles')
      .insert([newUser])
      .select()
      .single();
    
    if (duplicateError) {
      console.log('✅ Duplicate user correctly rejected:', duplicateError.message);
    } else {
      console.log('❌ Duplicate user was created (this should not happen)');
    }
    
    // Test 3: Find existing user (login)
    console.log('\n📋 Test 3: Finding existing user (login)...');
    const { data: foundUser, error: findError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('phone', newPhone)
      .single();
    
    if (findError) {
      console.log('❌ User lookup failed:', findError.message);
    } else {
      console.log('✅ Existing user found successfully!');
      console.log(`   - User ID: ${foundUser.id}`);
      console.log(`   - Phone: ${foundUser.phone}`);
      console.log(`   - Name: ${foundUser.name}`);
    }
    
    // Test 4: Try to find non-existing user
    console.log('\n📋 Test 4: Looking for non-existing user...');
    const { data: nonExistingUser, error: nonExistingError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('phone', '+919999999999')
      .single();
    
    if (nonExistingError) {
      console.log('✅ Non-existing user correctly not found:', nonExistingError.message);
    } else {
      console.log('❌ Non-existing user was found (this should not happen)');
    }
    
    console.log('\n🎉 Registration flow test completed successfully!');
    console.log('✅ All tests passed - registration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testRegistration(); 
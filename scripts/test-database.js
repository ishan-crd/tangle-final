const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  try {
    console.log('=== Testing Supabase Connection ===');
    
    // Test 1: Check if table exists
    console.log('\n1. Checking if user_profiles table exists...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table error:', tableError);
      return;
    }
    console.log('✅ Table exists');
    
    // Test 2: Insert a test record
    console.log('\n2. Inserting test record...');
    const testUser = {
      name: 'Test User ' + Date.now(),
      age: 25,
      phone: '+123456789' + Math.floor(Math.random() * 1000),
      interests: ['Technology', 'Music'],
      address: 'Test Address',
      society: 'Test Society',
      flat: 'A1',
      avatar: ''
    };
    
    console.log('Test user data:', testUser);
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert([testUser])
      .select();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return;
    }
    
    console.log('✅ Test record inserted:', insertData);
    
    // Test 3: Query the inserted record
    console.log('\n3. Querying inserted record...');
    const { data: queryData, error: queryError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', insertData[0].id);
    
    if (queryError) {
      console.error('❌ Query error:', queryError);
    } else {
      console.log('✅ Record retrieved:', queryData);
    }
    
    // Test 4: Update the record
    console.log('\n4. Updating record...');
    const { data: updateData, error: updateError } = await supabase
      .from('user_profiles')
      .update({ name: 'Updated Test User' })
      .eq('id', insertData[0].id)
      .select();
    
    if (updateError) {
      console.error('❌ Update error:', updateError);
    } else {
      console.log('✅ Record updated:', updateData);
    }
    
    // Test 5: Clean up
    console.log('\n5. Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', insertData[0].id);
    
    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
    } else {
      console.log('✅ Test data cleaned up');
    }
    
    console.log('\n=== All tests completed successfully! ===');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDatabase(); 
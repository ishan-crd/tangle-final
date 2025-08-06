const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLSStatus() {
  console.log('🔍 Checking RLS Status and Database Access...\n');

  try {
    // Test 1: Check if we can read from user_profiles
    console.log('1️⃣ Testing read access to user_profiles...');
    const { data: readData, error: readError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (readError) {
      console.log('❌ Read error:', readError.message);
    } else {
      console.log('✅ Read access works');
    }

    // Test 2: Try to insert a test user
    console.log('\n2️⃣ Testing insert access to user_profiles...');
    const testUser = {
      name: 'Test User',
      age: 25,
      phone: '+919876543299',
      interests: ['Test'],
      society: 'Test Society',
      flat: 'Test-101',
      bio: 'Test user for RLS check',
      gender: 'Other'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert([testUser])
      .select();

    if (insertError) {
      console.log('❌ Insert error:', insertError.message);
      console.log('❌ Error code:', insertError.code);
      console.log('❌ Error details:', insertError.details);
    } else {
      console.log('✅ Insert access works');
      console.log('✅ Created test user:', insertData[0].id);
      
      // Clean up test user
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('phone', '+919876543299');
      
      if (deleteError) {
        console.log('⚠️  Could not delete test user:', deleteError.message);
      } else {
        console.log('✅ Test user cleaned up');
      }
    }

    // Test 3: Check table structure
    console.log('\n3️⃣ Checking table structure...');
    const { data: tableData, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.log('❌ Table structure error:', tableError.message);
    } else {
      console.log('✅ Table structure is accessible');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function testDirectInsert() {
  console.log('\n🧪 Testing direct insert with minimal data...');
  
  try {
    const minimalUser = {
      name: 'Minimal User',
      age: 25,
      phone: '+919876543298'
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([minimalUser])
      .select();

    if (error) {
      console.log('❌ Minimal insert failed:', error.message);
      console.log('❌ Error code:', error.code);
      
      // Try to get more details
      if (error.details) {
        console.log('❌ Error details:', error.details);
      }
      if (error.hint) {
        console.log('❌ Error hint:', error.hint);
      }
    } else {
      console.log('✅ Minimal insert succeeded');
      console.log('✅ User created with ID:', data[0].id);
      
      // Clean up
      await supabase
        .from('user_profiles')
        .delete()
        .eq('phone', '+919876543298');
    }
  } catch (error) {
    console.error('❌ Direct insert error:', error);
  }
}

async function checkSupabaseConfig() {
  console.log('\n🔧 Checking Supabase configuration...');
  console.log('URL:', supabaseUrl);
  console.log('Key length:', supabaseKey.length);
  console.log('Key starts with:', supabaseKey.substring(0, 20) + '...');
}

// Run all checks
async function runAllChecks() {
  console.log('🎯 RLS Status Check');
  console.log('==================\n');
  
  await checkSupabaseConfig();
  await checkRLSStatus();
  await testDirectInsert();
  
  console.log('\n📋 Summary:');
  console.log('If you see insert errors, the RLS is still active.');
  console.log('If you see successful inserts, the RLS is disabled.');
}

if (require.main === module) {
  runAllChecks();
}

module.exports = { checkRLSStatus, testDirectInsert, runAllChecks }; 
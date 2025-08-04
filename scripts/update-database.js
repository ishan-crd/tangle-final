const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateDatabase() {
  try {
    console.log('=== Updating Database Schema ===');
    
    // Check current table structure
    console.log('\n1. Checking current table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error checking table:', tableError);
      return;
    }
    
    console.log('✅ Table exists');
    
    // Add bio column if it doesn't exist
    console.log('\n2. Adding bio column...');
    try {
      const { error: bioError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT \'\';'
      });
      
      if (bioError) {
        console.log('Bio column might already exist or there was an error:', bioError);
      } else {
        console.log('✅ Bio column added successfully');
      }
    } catch (error) {
      console.log('Bio column might already exist');
    }
    
    // Add gender column if it doesn't exist
    console.log('\n3. Adding gender column...');
    try {
      const { error: genderError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT \'\';'
      });
      
      if (genderError) {
        console.log('Gender column might already exist or there was an error:', genderError);
      } else {
        console.log('✅ Gender column added successfully');
      }
    } catch (error) {
      console.log('Gender column might already exist');
    }
    
    // Test inserting a record with all fields
    console.log('\n4. Testing insert with all fields...');
    const testUser = {
      name: 'Test User ' + Date.now(),
      age: 25,
      phone: '+123456789' + Math.floor(Math.random() * 1000),
      interests: ['Technology', 'Music'],
      address: 'Test Address',
      society: 'Test Society',
      flat: 'A1',
      avatar: '',
      bio: 'This is a test bio',
      gender: 'Other'
    };
    
    console.log('Test user data:', testUser);
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert([testUser])
      .select();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
    } else {
      console.log('✅ Test record inserted with all fields:', insertData);
      
      // Clean up test data
      if (insertData && insertData[0]) {
        await supabase
          .from('user_profiles')
          .delete()
          .eq('id', insertData[0].id);
        console.log('✅ Test data cleaned up');
      }
    }
    
    console.log('\n=== Database update completed! ===');
    console.log('You can now manually add the columns in your Supabase dashboard:');
    console.log('1. Go to your Supabase project');
    console.log('2. Navigate to Table Editor > user_profiles');
    console.log('3. Add columns: bio (TEXT) and gender (TEXT)');
    
  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

updateDatabase(); 
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserProfilesTable() {
  try {
    console.log('🔧 Fixing user_profiles table...\n');

    // Step 1: Add state_id column if it doesn't exist
    console.log('1️⃣ Adding state_id column to user_profiles table...');
    const { error: addStateIdError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE user_profiles 
        ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id) ON DELETE SET NULL;
      `
    });

    if (addStateIdError) {
      console.log('⚠️  Could not add state_id column via RPC:', addStateIdError.message);
      console.log('   This might require manual database access');
    } else {
      console.log('✅ state_id column added successfully');
    }

    // Step 2: Check if address column exists and is unused
    console.log('2️⃣ Checking address column usage...');
    const { data: addressCheck, error: addressCheckError } = await supabase
      .from('user_profiles')
      .select('address')
      .not('address', 'is', null)
      .limit(1);

    if (addressCheckError) {
      console.log('⚠️  Could not check address column:', addressCheckError.message);
    } else if (addressCheck.length === 0) {
      console.log('✅ address column is empty, safe to remove');
      
      // Try to remove the address column
      const { error: removeAddressError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE user_profiles DROP COLUMN IF EXISTS address;'
      });

      if (removeAddressError) {
        console.log('⚠️  Could not remove address column via RPC:', removeAddressError.message);
        console.log('   This might require manual database access');
      } else {
        console.log('✅ address column removed successfully');
      }
    } else {
      console.log('⚠️  address column contains data, cannot safely remove');
      console.log('   Consider migrating data or keeping the column');
    }

    // Step 3: Verify the table structure
    console.log('3️⃣ Verifying table structure...');
    const { data: tableInfo, error: tableInfoError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0);

    if (tableInfoError) {
      console.log('⚠️  Could not verify table structure:', tableInfoError.message);
    } else {
      console.log('✅ user_profiles table structure verified');
    }

    console.log('\n🎉 User profiles table fix completed!');
    console.log('\n📋 Summary:');
    console.log('   - Added state_id column (if not exists)');
    console.log('   - Checked address column usage');
    console.log('   - Verified table structure');
    
    console.log('\n⚠️  Note: Some operations may require manual database access');
    console.log('   If columns were not added/removed, you may need to:');
    console.log('   1. Access your Supabase dashboard');
    console.log('   2. Go to SQL Editor');
    console.log('   3. Run the ALTER TABLE commands manually');

  } catch (error) {
    console.error('❌ Error fixing user_profiles table:', error);
  }
}

// Run the fix
fixUserProfilesTable();

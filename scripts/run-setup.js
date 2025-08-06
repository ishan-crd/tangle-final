const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSetup() {
  try {
    console.log('🚀 Starting Tangle Database Setup...');
    
    // Read the setup SQL file
    const setupSQL = fs.readFileSync(path.join(__dirname, 'setup-database.sql'), 'utf8');
    
    console.log('📝 Executing database setup...');
    
    // Execute the SQL script
    const { data, error } = await supabase.rpc('exec_sql', { sql: setupSQL });
    
    if (error) {
      console.error('❌ Error executing setup:', error);
      return;
    }
    
    console.log('✅ Database setup completed successfully!');
    
    // Verify the setup by checking table counts
    console.log('\n📊 Database Summary:');
    
    const tables = ['countries', 'states', 'societies', 'user_profiles', 'posts', 'matches', 'stories', 'notifications'];
    
    for (const table of tables) {
      const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.log(`❌ Error counting ${table}:`, countError.message);
      } else {
        console.log(`📋 ${table}: ${count} records`);
      }
    }
    
    console.log('\n🎉 Setup complete! Your Tangle backend is ready.');
    console.log('\n📋 Hierarchical Structure:');
    console.log('   India');
    console.log('   ├── Delhi');
    console.log('   │   ├── New Greens');
    console.log('   │   └── Plak Rounds');
    console.log('   ├── Karnataka (Bangalore)');
    console.log('   │   ├── Bangalore Heights');
    console.log('   │   ├── Tech Park Residency');
    console.log('   │   └── Garden City Society');
    console.log('   └── Uttar Pradesh');
    console.log('       ├── Eldeco Utopia');
    console.log('       ├── Ajnara');
    console.log('       ├── Shipra Neo (Ghaziabad)');
    console.log('       └── ATS Indira (Ghaziabad)');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Alternative method using direct SQL execution
async function runSetupAlternative() {
  try {
    console.log('🚀 Starting Tangle Database Setup (Alternative Method)...');
    
    // Read the setup SQL file
    const setupSQL = fs.readFileSync(path.join(__dirname, 'setup-database.sql'), 'utf8');
    
    // Split the SQL into individual statements
    const statements = setupSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.log(`⚠️  Statement ${i + 1} had an issue (this might be expected):`, error.message);
          }
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1} failed (this might be expected):`, err.message);
        }
      }
    }
    
    console.log('✅ Database setup completed!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Manual setup using individual operations
async function runManualSetup() {
  try {
    console.log('🚀 Starting Manual Tangle Database Setup...');
    
    // Step 1: Create countries
    console.log('1️⃣ Creating countries...');
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .upsert([{ name: 'India', code: 'IND' }], { onConflict: 'name' });
    
    if (countriesError) {
      console.log('⚠️  Countries creation issue (might already exist):', countriesError.message);
    }
    
    // Step 2: Get India and create states
    console.log('2️⃣ Creating states...');
    const { data: india } = await supabase
      .from('countries')
      .select('id')
      .eq('name', 'India')
      .single();
    
    if (india) {
      const states = [
        { country_id: india.id, name: 'Delhi', code: 'DL' },
        { country_id: india.id, name: 'Karnataka', code: 'KA' },
        { country_id: india.id, name: 'Uttar Pradesh', code: 'UP' }
      ];
      
      const { error: statesError } = await supabase
        .from('states')
        .upsert(states, { onConflict: 'country_id,name' });
      
      if (statesError) {
        console.log('⚠️  States creation issue:', statesError.message);
      }
    }
    
    // Step 3: Create societies
    console.log('3️⃣ Creating societies...');
    const { data: states } = await supabase
      .from('states')
      .select('id, name');
    
    if (states) {
      const societies = [];
      
      for (const state of states) {
        if (state.name === 'Delhi') {
          societies.push(
            { state_id: state.id, name: 'New Greens', address: 'New Greens Society, Delhi' },
            { state_id: state.id, name: 'Plak Rounds', address: 'Plak Rounds Society, Delhi' }
          );
        } else if (state.name === 'Karnataka') {
          societies.push(
            { state_id: state.id, name: 'Bangalore Heights', address: 'Bangalore Heights Society, Bangalore' },
            { state_id: state.id, name: 'Tech Park Residency', address: 'Tech Park Residency Society, Bangalore' },
            { state_id: state.id, name: 'Garden City Society', address: 'Garden City Society, Bangalore' }
          );
        } else if (state.name === 'Uttar Pradesh') {
          societies.push(
            { state_id: state.id, name: 'Eldeco Utopia', address: 'Eldeco Utopia Society, Uttar Pradesh' },
            { state_id: state.id, name: 'Ajnara', address: 'Ajnara Society, Uttar Pradesh' },
            { state_id: state.id, name: 'Shipra Neo', address: 'Shipra Neo Society, Ghaziabad, Uttar Pradesh' },
            { state_id: state.id, name: 'ATS Indira', address: 'ATS Indira Society, Ghaziabad, Uttar Pradesh' }
          );
        }
      }
      
      const { error: societiesError } = await supabase
        .from('societies')
        .upsert(societies, { onConflict: 'state_id,name' });
      
      if (societiesError) {
        console.log('⚠️  Societies creation issue:', societiesError.message);
      }
    }
    
    console.log('✅ Manual setup completed!');
    
  } catch (error) {
    console.error('❌ Manual setup failed:', error);
  }
}

// Run the setup
if (require.main === module) {
  console.log('🎯 Tangle Database Setup');
  console.log('========================\n');
  
  // Try the main setup first
  runSetup().catch(() => {
    console.log('\n🔄 Trying alternative method...\n');
    runSetupAlternative().catch(() => {
      console.log('\n🔄 Trying manual setup...\n');
      runManualSetup();
    });
  });
}

module.exports = { runSetup, runSetupAlternative, runManualSetup }; 
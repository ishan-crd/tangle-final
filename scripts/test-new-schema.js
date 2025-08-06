const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNewSchema() {
  console.log('🧪 Testing new database schema...\n');

  try {
    // Test 1: Check states
    console.log('1. Testing States table...');
    const { data: states, error: statesError } = await supabase
      .from('states')
      .select('*')
      .limit(3);
    
    if (statesError) {
      console.log('❌ States error:', statesError);
    } else {
      console.log('✅ States found:', states.length);
      console.log('   Sample states:', states.map(s => s.name));
    }

    // Test 2: Check societies
    console.log('\n2. Testing Societies table...');
    const { data: societies, error: societiesError } = await supabase
      .from('societies')
      .select(`
        *,
        states(name)
      `)
      .limit(3);
    
    if (societiesError) {
      console.log('❌ Societies error:', societiesError);
    } else {
      console.log('✅ Societies found:', societies.length);
      console.log('   Sample societies:', societies.map(s => `${s.name} (${s.states?.name})`));
    }

    // Test 3: Check sports
    console.log('\n3. Testing Sports table...');
    const { data: sports, error: sportsError } = await supabase
      .from('sports')
      .select('*');
    
    if (sportsError) {
      console.log('❌ Sports error:', sportsError);
    } else {
      console.log('✅ Sports found:', sports.length);
      console.log('   Available sports:', sports.map(s => s.name));
    }

    console.log('\n🎉 Schema test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNewSchema(); 
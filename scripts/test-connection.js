const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);

  try {
    // Test basic connection by trying to fetch states
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('Error details:', error);
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 States found:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📄 Sample state:', data[0]);
      }
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('Full error:', error);
  }
}

testConnection(); 
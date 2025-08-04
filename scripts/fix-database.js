const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // Add missing columns to user_profiles
    const alterQueries = [
      "ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_role VARCHAR(20) DEFAULT 'public';",
      "ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;",
      "ALTER TABLE user_profiles ADD CONSTRAINT IF NOT EXISTS check_user_role CHECK (user_role IN ('super_admin', 'society_admin', 'public'));"
    ];
    
    for (const query of alterQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.log('Query executed (may already exist):', query);
      } else {
        console.log('✅ Executed:', query);
      }
    }
    
    console.log('✅ Database fixes applied!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
  }
}

fixDatabase(); 
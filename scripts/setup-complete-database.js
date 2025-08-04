const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up complete Tangle database...');
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '../database-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Executing database schema...');
    
    // Execute the schema
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    
    if (error) {
      console.error('❌ Error setting up database:', error);
      return;
    }
    
    console.log('✅ Database schema created successfully!');
    
    // Test the setup by creating a sample super admin
    console.log('👤 Creating sample super admin...');
    
    const { data: superAdmin, error: adminError } = await supabase
      .from('user_profiles')
      .insert([{
        name: 'Super Admin',
        age: 30,
        phone: '+919876543210',
        interests: ['Badminton', 'Basketball'],
        address: 'Mumbai, Maharashtra',
        society: 'Palm Springs Society',
        flat: 'A-101',
        avatar: '',
        bio: 'Super Administrator of Tangle',
        gender: 'Other',
        user_role: 'super_admin',
        is_active: true
      }])
      .select()
      .single();
    
    if (adminError) {
      console.error('❌ Error creating super admin:', adminError);
    } else {
      console.log('✅ Super admin created:', superAdmin.name);
    }
    
    console.log('🎉 Database setup complete!');
    console.log('\n📊 Database includes:');
    console.log('   • User profiles with roles');
    console.log('   • Communities and societies');
    console.log('   • Posts, stories, and content');
    console.log('   • Matches and tournaments');
    console.log('   • Calendar events');
    console.log('   • Notifications system');
    console.log('   • Complete social features');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupDatabase(); 
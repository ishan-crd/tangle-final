const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test connection by trying to query the user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('Table does not exist. Creating user_profiles table...');
        
        // Create the table using SQL
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE user_profiles (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name TEXT NOT NULL,
              age INTEGER NOT NULL,
              phone TEXT NOT NULL UNIQUE,
              interests TEXT[] DEFAULT '{}',
              address TEXT DEFAULT '',
              society TEXT DEFAULT '',
              flat TEXT DEFAULT '',
              avatar TEXT DEFAULT '',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Allow public read access" ON user_profiles
              FOR SELECT USING (true);
            
            CREATE POLICY "Allow public insert access" ON user_profiles
              FOR INSERT WITH CHECK (true);
            
            CREATE POLICY "Allow public update access" ON user_profiles
              FOR UPDATE USING (true);
          `
        });
        
        if (createError) {
          console.error('Error creating table:', createError);
          console.log('Please create the table manually in your Supabase dashboard:');
          console.log(`
            CREATE TABLE user_profiles (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name TEXT NOT NULL,
              age INTEGER NOT NULL,
              phone TEXT NOT NULL UNIQUE,
              interests TEXT[] DEFAULT '{}',
              address TEXT DEFAULT '',
              society TEXT DEFAULT '',
              flat TEXT DEFAULT '',
              avatar TEXT DEFAULT '',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Allow public read access" ON user_profiles
              FOR SELECT USING (true);
            
            CREATE POLICY "Allow public insert access" ON user_profiles
              FOR INSERT WITH CHECK (true);
            
            CREATE POLICY "Allow public update access" ON user_profiles
              FOR UPDATE USING (true);
          `);
        } else {
          console.log('Table created successfully!');
        }
      } else {
        console.error('Connection error:', error);
      }
    } else {
      console.log('Connection successful! Table exists.');
    }
    
    // Test inserting a sample record
    console.log('Testing insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert([{
        name: 'Test User',
        age: 25,
        phone: '+1234567890',
        interests: ['Technology', 'Music'],
        address: 'Test Address',
        society: 'Test Society',
        flat: 'A1',
        avatar: ''
      }])
      .select();
    
    if (insertError) {
      console.error('Insert test failed:', insertError);
    } else {
      console.log('Insert test successful!');
      console.log('Inserted data:', insertData);
      
      // Clean up test data
      if (insertData && insertData[0]) {
        await supabase
          .from('user_profiles')
          .delete()
          .eq('id', insertData[0].id);
        console.log('Test data cleaned up.');
      }
    }
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase(); 
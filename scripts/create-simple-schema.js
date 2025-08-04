const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSimpleSchema() {
  console.log('🔧 Creating simple database schema...');

  try {
    // Create user_profiles table
    console.log('👥 Creating user_profiles table...');
    const { error: userError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          phone TEXT UNIQUE NOT NULL,
          interests TEXT[] DEFAULT '{}',
          address TEXT DEFAULT '',
          society TEXT DEFAULT '',
          flat TEXT DEFAULT '',
          avatar TEXT DEFAULT '',
          bio TEXT DEFAULT '',
          gender TEXT DEFAULT '',
          user_role TEXT DEFAULT 'public',
          is_active BOOLEAN DEFAULT true,
          state_name TEXT DEFAULT '',
          society_name TEXT DEFAULT '',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (userError) {
      console.log('❌ Error creating user_profiles:', userError);
    } else {
      console.log('✅ user_profiles table created');
    }

    // Create posts table
    console.log('📝 Creating posts table...');
    const { error: postsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
          title TEXT,
          content TEXT NOT NULL,
          post_type TEXT DEFAULT 'general',
          is_announcement BOOLEAN DEFAULT false,
          is_pinned BOOLEAN DEFAULT false,
          likes_count INTEGER DEFAULT 0,
          comments_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (postsError) {
      console.log('❌ Error creating posts:', postsError);
    } else {
      console.log('✅ posts table created');
    }

    // Create matches table
    console.log('🏀 Creating matches table...');
    const { error: matchesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS matches (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          match_type TEXT DEFAULT 'casual',
          max_participants INTEGER,
          current_participants INTEGER DEFAULT 0,
          venue TEXT,
          scheduled_date TIMESTAMP WITH TIME ZONE,
          duration_minutes INTEGER DEFAULT 60,
          status TEXT DEFAULT 'upcoming',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (matchesError) {
      console.log('❌ Error creating matches:', matchesError);
    } else {
      console.log('✅ matches table created');
    }

    console.log('✅ Simple schema created successfully!');
    console.log('');
    console.log('📋 Tables created:');
    console.log('   ✅ user_profiles');
    console.log('   ✅ posts');
    console.log('   ✅ matches');

  } catch (error) {
    console.error('❌ Error creating schema:', error);
  }
}

createSimpleSchema(); 
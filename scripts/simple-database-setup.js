const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupSimpleDatabase() {
  try {
    console.log('🚀 Setting up simple database for Tangle...');
    
    // Create user_profiles table if it doesn't exist
    console.log('📋 Creating user_profiles table...');
    const { error: userProfilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          age INTEGER,
          phone VARCHAR(20) UNIQUE NOT NULL,
          interests TEXT[] DEFAULT '{}',
          address TEXT,
          society VARCHAR(100),
          flat VARCHAR(50),
          avatar TEXT,
          bio TEXT,
          gender VARCHAR(20),
          user_role VARCHAR(20) DEFAULT 'public' CHECK (user_role IN ('super_admin', 'society_admin', 'public')),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (userProfilesError) {
      console.log('User profiles table already exists or error:', userProfilesError.message);
    } else {
      console.log('✅ User profiles table created');
    }

    // Create societies table
    console.log('📋 Creating societies table...');
    const { error: societiesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS societies (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          address TEXT,
          community_id UUID,
          society_admin_id UUID,
          member_count INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (societiesError) {
      console.log('Societies table already exists or error:', societiesError.message);
    } else {
      console.log('✅ Societies table created');
    }

    // Create posts table
    console.log('📋 Creating posts table...');
    const { error: postsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES user_profiles(id),
          society_id UUID NOT NULL REFERENCES societies(id),
          title VARCHAR(200),
          content TEXT NOT NULL,
          post_type VARCHAR(20) DEFAULT 'general' CHECK (post_type IN ('general', 'announcement', 'match', 'tournament')),
          is_announcement BOOLEAN DEFAULT false,
          is_pinned BOOLEAN DEFAULT false,
          likes_count INTEGER DEFAULT 0,
          comments_count INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (postsError) {
      console.log('Posts table already exists or error:', postsError.message);
    } else {
      console.log('✅ Posts table created');
    }

    // Create matches table
    console.log('📋 Creating matches table...');
    const { error: matchesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS matches (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          host_id UUID NOT NULL REFERENCES user_profiles(id),
          society_id UUID NOT NULL REFERENCES societies(id),
          sport_id UUID,
          match_type VARCHAR(20) DEFAULT 'casual' CHECK (match_type IN ('casual', 'competitive', 'tournament')),
          max_participants INTEGER,
          current_participants INTEGER DEFAULT 0,
          venue TEXT,
          scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
          duration_minutes INTEGER DEFAULT 60,
          status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (matchesError) {
      console.log('Matches table already exists or error:', matchesError.message);
    } else {
      console.log('✅ Matches table created');
    }

    // Insert sample data
    console.log('📋 Inserting sample data...');
    
    // Insert sample society
    const { data: societyData, error: societyInsertError } = await supabase
      .from('societies')
      .insert([{
        name: 'Sample Society',
        description: 'A sample society for testing',
        address: 'Sample Address',
        member_count: 0,
        is_active: true
      }])
      .select()
      .single();
    
    if (societyInsertError) {
      console.log('Society insert error:', societyInsertError.message);
    } else {
      console.log('✅ Sample society created with ID:', societyData.id);
      
      // Store the society ID for reference
      global.sampleSocietyId = societyData.id;
    }

    console.log('✅ Database setup completed successfully!');
    console.log('📝 Sample society ID:', global.sampleSocietyId);
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupSimpleDatabase(); 
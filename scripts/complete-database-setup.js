const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupCompleteDatabase() {
  try {
    console.log('🚀 Setting up complete Tangle database...');
    
    // Create sports table
    console.log('📋 Creating sports table...');
    const { error: sportsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS sports (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          icon VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (sportsError) {
      console.log('Sports table error:', sportsError.message);
    } else {
      console.log('✅ Sports table created');
    }

    // Create societies table with proper structure
    console.log('📋 Creating societies table...');
    const { error: societiesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS societies (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
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
      console.log('Societies table error:', societiesError.message);
    } else {
      console.log('✅ Societies table created');
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
          sport_id UUID REFERENCES sports(id),
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
      console.log('Matches table error:', matchesError.message);
    } else {
      console.log('✅ Matches table created');
    }

    // Create match_participants table
    console.log('📋 Creating match_participants table...');
    const { error: participantsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS match_participants (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'joined' CHECK (status IN ('joined', 'pending', 'declined')),
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(match_id, user_id)
        );
      `
    });
    
    if (participantsError) {
      console.log('Match participants table error:', participantsError.message);
    } else {
      console.log('✅ Match participants table created');
    }

    // Insert sample sports
    console.log('📋 Inserting sample sports...');
    const { error: sportsInsertError } = await supabase
      .from('sports')
      .upsert([
        { name: 'Basketball', description: 'Basketball games', icon: '🏀' },
        { name: 'Football', description: 'Football matches', icon: '⚽' },
        { name: 'Badminton', description: 'Badminton games', icon: '🏸' },
        { name: 'Cricket', description: 'Cricket matches', icon: '🏏' },
        { name: 'Tennis', description: 'Tennis games', icon: '🎾' }
      ], { onConflict: 'name' });
    
    if (sportsInsertError) {
      console.log('Sports insert error:', sportsInsertError.message);
    } else {
      console.log('✅ Sample sports inserted');
    }

    // Insert sample societies
    console.log('📋 Inserting sample societies...');
    const { data: societiesData, error: societiesInsertError } = await supabase
      .from('societies')
      .upsert([
        { 
          name: 'Eldeco Utopia', 
          description: 'Eldeco Utopia Society', 
          address: 'Noida, Uttar Pradesh',
          member_count: 0,
          is_active: true
        },
        { 
          name: 'Sample Society', 
          description: 'A sample society for testing', 
          address: 'Sample Address',
          member_count: 0,
          is_active: true
        }
      ], { onConflict: 'name' })
      .select();
    
    if (societiesInsertError) {
      console.log('Societies insert error:', societiesInsertError.message);
    } else {
      console.log('✅ Sample societies inserted');
      console.log('📝 Society IDs:', societiesData?.map(s => `${s.name}: ${s.id}`));
    }

    // Get a user to create sample data with
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }

    const userId = users[0].id;
    const eldecoSocietyId = societiesData?.find(s => s.name === 'Eldeco Utopia')?.id;
    const sampleSocietyId = societiesData?.find(s => s.name === 'Sample Society')?.id;

    // Create sample posts for both societies
    console.log('📋 Creating sample posts...');
    const { error: postsInsertError } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          society_id: eldecoSocietyId,
          title: 'Basketball Game Tonight',
          content: 'Anyone up for basketball tonight at 7 PM?',
          post_type: 'general',
          is_announcement: false,
          is_pinned: false,
          likes_count: 3,
          comments_count: 1,
          is_active: true
        },
        {
          user_id: userId,
          society_id: eldecoSocietyId,
          title: 'Badminton Tournament',
          content: 'Planning a badminton tournament this weekend. Who\'s interested?',
          post_type: 'tournament',
          is_announcement: false,
          is_pinned: false,
          likes_count: 5,
          comments_count: 2,
          is_active: true
        },
        {
          user_id: userId,
          society_id: sampleSocietyId,
          title: 'Looking for Badminton Partner',
          content: 'Anyone interested in playing badminton this evening at 5 PM?',
          post_type: 'general',
          is_announcement: false,
          is_pinned: false,
          likes_count: 5,
          comments_count: 2,
          is_active: true
        }
      ]);
    
    if (postsInsertError) {
      console.log('Posts insert error:', postsInsertError.message);
    } else {
      console.log('✅ Sample posts created');
    }

    // Create sample matches
    console.log('📋 Creating sample matches...');
    const { data: sportsData } = await supabase.from('sports').select('*');
    const basketballSport = sportsData?.find(s => s.name === 'Basketball');
    
    if (basketballSport) {
      const { error: matchesInsertError } = await supabase
        .from('matches')
        .insert([
          {
            title: 'Basketball Match',
            description: 'Casual basketball game',
            host_id: userId,
            society_id: eldecoSocietyId,
            sport_id: basketballSport.id,
            match_type: 'casual',
            max_participants: 10,
            venue: 'Society Basketball Court',
            scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            duration_minutes: 90,
            status: 'upcoming'
          }
        ]);
      
      if (matchesInsertError) {
        console.log('Matches insert error:', matchesInsertError.message);
      } else {
        console.log('✅ Sample matches created');
      }
    }

    console.log('🎉 Complete database setup finished!');
    console.log('📊 Summary:');
    console.log(`   - Sports: ${sportsData?.length || 0} created`);
    console.log(`   - Societies: ${societiesData?.length || 0} created`);
    console.log(`   - Eldeco Utopia ID: ${eldecoSocietyId}`);
    console.log(`   - Sample Society ID: ${sampleSocietyId}`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupCompleteDatabase(); 
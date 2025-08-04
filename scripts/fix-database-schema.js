const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDIwMjkwOCwiZXhwIjoyMDY5Nzc4OTA4fQ.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDatabaseSchema() {
  console.log('🔧 Fixing database schema...');

  try {
    // 1. Drop all existing tables to start fresh
    console.log('🗑️ Dropping existing tables...');
    await supabase.rpc('exec_sql', {
      sql: `
        DROP TABLE IF EXISTS story_views CASCADE;
        DROP TABLE IF EXISTS match_participants CASCADE;
        DROP TABLE IF EXISTS calendar_events CASCADE;
        DROP TABLE IF EXISTS stories CASCADE;
        DROP TABLE IF EXISTS posts CASCADE;
        DROP TABLE IF EXISTS matches CASCADE;
        DROP TABLE IF EXISTS tournaments CASCADE;
        DROP TABLE IF EXISTS tournament_participants CASCADE;
        DROP TABLE IF EXISTS user_profiles CASCADE;
        DROP TABLE IF EXISTS societies CASCADE;
        DROP TABLE IF EXISTS states CASCADE;
        DROP TABLE IF EXISTS sports CASCADE;
        DROP TABLE IF EXISTS communities CASCADE;
        DROP TABLE IF EXISTS notifications CASCADE;
      `
    });

    // 2. Create states table
    console.log('🗺️ Creating states table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE states (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          code VARCHAR(10) UNIQUE,
          country VARCHAR(100) DEFAULT 'India',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 3. Create societies table with state reference
    console.log('🏢 Creating societies table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE societies (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
          description TEXT,
          address TEXT,
          city VARCHAR(100),
          pincode VARCHAR(10),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(name, state_id)
        );
      `
    });

    // 4. Create sports table
    console.log('⚽ Creating sports table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE sports (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 5. Create user_profiles table with proper references
    console.log('👥 Creating user_profiles table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE user_profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          age INTEGER NOT NULL,
          phone VARCHAR(20) NOT NULL UNIQUE,
          interests TEXT[] DEFAULT '{}',
          address TEXT,
          society TEXT,
          flat VARCHAR(100),
          avatar TEXT,
          bio TEXT,
          gender VARCHAR(20),
          user_role VARCHAR(20) DEFAULT 'public',
          is_active BOOLEAN DEFAULT true,
          state_id UUID REFERENCES states(id),
          society_id UUID REFERENCES societies(id),
          state_name VARCHAR(100),
          society_name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 6. Create posts table
    console.log('📝 Creating posts table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
          society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
          title VARCHAR(255),
          content TEXT NOT NULL,
          post_type VARCHAR(20) DEFAULT 'general',
          is_announcement BOOLEAN DEFAULT false,
          is_pinned BOOLEAN DEFAULT false,
          likes_count INTEGER DEFAULT 0,
          comments_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 7. Create matches table
    console.log('🏀 Creating matches table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE matches (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          host_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
          society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
          sport_id UUID NOT NULL REFERENCES sports(id),
          match_type VARCHAR(20) DEFAULT 'casual',
          max_participants INTEGER,
          current_participants INTEGER DEFAULT 0,
          venue VARCHAR(255) NOT NULL,
          scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
          duration_minutes INTEGER DEFAULT 60,
          status VARCHAR(20) DEFAULT 'upcoming',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 8. Create tournaments table
    console.log('🏆 Creating tournaments table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE tournaments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          host_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
          society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
          sport_id UUID NOT NULL REFERENCES sports(id),
          max_teams INTEGER NOT NULL,
          current_teams INTEGER DEFAULT 0,
          venue VARCHAR(255) NOT NULL,
          start_date TIMESTAMP WITH TIME ZONE NOT NULL,
          end_date TIMESTAMP WITH TIME ZONE NOT NULL,
          prize_pool INTEGER,
          status VARCHAR(20) DEFAULT 'upcoming',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 9. Create stories table
    console.log('📸 Creating stories table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE stories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
          society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          media_url TEXT,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 10. Create notifications table
    console.log('🔔 Creating notifications table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE notifications (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(20) DEFAULT 'general',
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 11. Create junction tables
    console.log('🔗 Creating junction tables...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE match_participants (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'joined',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(match_id, user_id)
        );

        CREATE TABLE tournament_participants (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          team_name VARCHAR(255),
          status VARCHAR(20) DEFAULT 'registered',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(tournament_id, user_id)
        );

        CREATE TABLE story_views (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(story_id, user_id)
        );
      `
    });

    // 12. Add default states
    console.log('🏛️ Adding default states...');
    await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO states (name, code) VALUES
        ('Delhi', 'DL'),
        ('Mumbai', 'MH'),
        ('Bangalore', 'KA'),
        ('Noida', 'UP'),
        ('Gurgaon', 'HR'),
        ('Pune', 'MH'),
        ('Hyderabad', 'TS'),
        ('Chennai', 'TN'),
        ('Kolkata', 'WB'),
        ('Ahmedabad', 'GJ')
        ON CONFLICT (name) DO NOTHING;
      `
    });

    // 13. Add default sports
    console.log('⚽ Adding default sports...');
    await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO sports (name, description) VALUES
        ('Basketball', 'Team sport played with a basketball'),
        ('Football', 'Team sport played with a football'),
        ('Cricket', 'Team sport played with bat and ball'),
        ('Tennis', 'Racket sport played individually or in pairs'),
        ('Badminton', 'Racket sport played with shuttlecock'),
        ('Table Tennis', 'Racket sport played on a table'),
        ('Volleyball', 'Team sport played with a volleyball'),
        ('Swimming', 'Individual sport in water'),
        ('Running', 'Individual endurance sport'),
        ('Gym', 'Individual fitness training')
        ON CONFLICT (name) DO NOTHING;
      `
    });

    // 14. Get state IDs for reference
    const { data: states } = await supabase
      .from('states')
      .select('id, name')
      .in('name', ['Delhi', 'Mumbai', 'Bangalore', 'Noida', 'Gurgaon']);

    const stateMap = {};
    states?.forEach(state => {
      stateMap[state.name] = state.id;
    });

    // 15. Add default societies with state references
    console.log('🏘️ Adding default societies...');
    if (stateMap['Noida']) {
      await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO societies (name, state_id, description, address, city) VALUES
          ('Eldeco Utopia', '${stateMap['Noida']}', 'Premium residential society with excellent sports facilities', 'Sector 93, Noida', 'Noida'),
          ('Palm Greens', '${stateMap['Noida']}', 'Modern society with basketball and tennis courts', 'Sector 89, Noida', 'Noida'),
          ('Supertech Ecovillage', '${stateMap['Noida']}', 'Eco-friendly society with outdoor sports facilities', 'Sector 137, Noida', 'Noida'),
          ('Jaypee Greens', '${stateMap['Noida']}', 'Luxury society with world-class sports infrastructure', 'Sector 128, Noida', 'Noida')
          ON CONFLICT (name, state_id) DO NOTHING;
        `
      });
    }

    if (stateMap['Gurgaon']) {
      await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO societies (name, state_id, description, address, city) VALUES
          ('DLF Phase 1', '${stateMap['Gurgaon']}', 'Premium residential area with sports facilities', 'DLF Phase 1, Gurgaon', 'Gurgaon'),
          ('Suncity Township', '${stateMap['Gurgaon']}', 'Modern township with multiple sports amenities', 'Suncity, Gurgaon', 'Gurgaon'),
          ('Palm Springs', '${stateMap['Gurgaon']}', 'Luxury society with tennis and swimming', 'Palm Springs, Gurgaon', 'Gurgaon')
          ON CONFLICT (name, state_id) DO NOTHING;
        `
      });
    }

    if (stateMap['Delhi']) {
      await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO societies (name, state_id, description, address, city) VALUES
          ('Vasant Vihar', '${stateMap['Delhi']}', 'Upmarket residential area with sports clubs', 'Vasant Vihar, Delhi', 'Delhi'),
          ('Greater Kailash', '${stateMap['Delhi']}', 'Premium locality with excellent facilities', 'Greater Kailash, Delhi', 'Delhi'),
          ('Saket', '${stateMap['Delhi']}', 'Modern residential area with sports amenities', 'Saket, Delhi', 'Delhi')
          ON CONFLICT (name, state_id) DO NOTHING;
        `
      });
    }

    if (stateMap['Mumbai']) {
      await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO societies (name, state_id, description, address, city) VALUES
          ('Bandra West', '${stateMap['Mumbai']}', 'Premium residential area with sports facilities', 'Bandra West, Mumbai', 'Mumbai'),
          ('Juhu', '${stateMap['Mumbai']}', 'Beachfront locality with sports clubs', 'Juhu, Mumbai', 'Mumbai'),
          ('Powai', '${stateMap['Mumbai']}', 'Modern residential area with amenities', 'Powai, Mumbai', 'Mumbai')
          ON CONFLICT (name, state_id) DO NOTHING;
        `
      });
    }

    if (stateMap['Bangalore']) {
      await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO societies (name, state_id, description, address, city) VALUES
          ('Koramangala', '${stateMap['Bangalore']}', 'Tech hub with modern sports facilities', 'Koramangala, Bangalore', 'Bangalore'),
          ('Indiranagar', '${stateMap['Bangalore']}', 'Upmarket area with sports clubs', 'Indiranagar, Bangalore', 'Bangalore'),
          ('Whitefield', '${stateMap['Bangalore']}', 'IT corridor with residential complexes', 'Whitefield, Bangalore', 'Bangalore')
          ON CONFLICT (name, state_id) DO NOTHING;
        `
      });
    }

    // 16. Create indexes for better performance
    console.log('⚡ Creating indexes...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);
        CREATE INDEX idx_user_profiles_state_id ON user_profiles(state_id);
        CREATE INDEX idx_user_profiles_society_id ON user_profiles(society_id);
        CREATE INDEX idx_posts_state_id ON posts(state_id);
        CREATE INDEX idx_posts_society_id ON posts(society_id);
        CREATE INDEX idx_posts_user_id ON posts(user_id);
        CREATE INDEX idx_matches_state_id ON matches(state_id);
        CREATE INDEX idx_matches_society_id ON matches(society_id);
        CREATE INDEX idx_matches_host_id ON matches(host_id);
        CREATE INDEX idx_tournaments_state_id ON tournaments(state_id);
        CREATE INDEX idx_tournaments_society_id ON tournaments(society_id);
        CREATE INDEX idx_stories_state_id ON stories(state_id);
        CREATE INDEX idx_stories_society_id ON stories(society_id);
        CREATE INDEX idx_societies_state_id ON societies(state_id);
        CREATE INDEX idx_societies_name ON societies(name);
        CREATE INDEX idx_states_name ON states(name);
        CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
        CREATE INDEX idx_match_participants_user_id ON match_participants(user_id);
        CREATE INDEX idx_tournament_participants_tournament_id ON tournament_participants(tournament_id);
        CREATE INDEX idx_tournament_participants_user_id ON tournament_participants(user_id);
        CREATE INDEX idx_story_views_story_id ON story_views(story_id);
        CREATE INDEX idx_story_views_user_id ON story_views(user_id);
      `
    });

    console.log('✅ Database schema fixed successfully!');
    console.log('🗺️ States created:');
    console.log('   - Delhi (DL)');
    console.log('   - Mumbai (MH)');
    console.log('   - Bangalore (KA)');
    console.log('   - Noida (UP)');
    console.log('   - Gurgaon (HR)');
    console.log('   - Pune (MH)');
    console.log('   - Hyderabad (TS)');
    console.log('   - Chennai (TN)');
    console.log('   - Kolkata (WB)');
    console.log('   - Ahmedabad (GJ)');
    console.log('');
    console.log('⚽ Sports created:');
    console.log('   - Basketball, Football, Cricket, Tennis, Badminton');
    console.log('   - Table Tennis, Volleyball, Swimming, Running, Gym');
    console.log('');
    console.log('🏘️ Sample societies created:');
    console.log('   Noida: Eldeco Utopia, Palm Greens, Supertech Ecovillage, Jaypee Greens');
    console.log('   Gurgaon: DLF Phase 1, Suncity Township, Palm Springs');
    console.log('   Delhi: Vasant Vihar, Greater Kailash, Saket');
    console.log('   Mumbai: Bandra West, Juhu, Powai');
    console.log('   Bangalore: Koramangala, Indiranagar, Whitefield');

  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
  }
}

fixDatabaseSchema(); 
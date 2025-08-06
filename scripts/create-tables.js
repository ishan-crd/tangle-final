const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('🚀 Creating Tangle Database Tables...\n');

    // Step 1: Create countries table
    console.log('1️⃣ Creating countries table...');
    const { error: countriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS countries (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL UNIQUE,
          code VARCHAR(3) NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (countriesError) console.log('⚠️  Countries table issue:', countriesError.message);

    // Step 2: Create states table
    console.log('2️⃣ Creating states table...');
    const { error: statesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS states (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          code VARCHAR(10) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(country_id, name),
          UNIQUE(country_id, code)
        );
      `
    });
    if (statesError) console.log('⚠️  States table issue:', statesError.message);

    // Step 3: Create societies table
    console.log('3️⃣ Creating societies table...');
    const { error: societiesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS societies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
          name VARCHAR(200) NOT NULL,
          address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(state_id, name)
        );
      `
    });
    if (societiesError) console.log('⚠️  Societies table issue:', societiesError.message);

    // Step 4: Create user_profiles table
    console.log('4️⃣ Creating user_profiles table...');
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          age INTEGER CHECK (age >= 13 AND age <= 100),
          phone VARCHAR(20) UNIQUE,
          interests TEXT[] DEFAULT '{}',
          address TEXT,
          society_id UUID REFERENCES societies(id) ON DELETE SET NULL,
          society VARCHAR(200),
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
    if (usersError) console.log('⚠️  User profiles table issue:', usersError.message);

    // Step 5: Create posts table
    console.log('5️⃣ Creating posts table...');
    const { error: postsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
          title VARCHAR(200),
          content TEXT NOT NULL,
          post_type VARCHAR(20) DEFAULT 'general' CHECK (post_type IN ('general', 'match', 'tournament', 'announcement')),
          is_announcement BOOLEAN DEFAULT false,
          is_pinned BOOLEAN DEFAULT false,
          likes_count INTEGER DEFAULT 0,
          comments_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (postsError) console.log('⚠️  Posts table issue:', postsError.message);

    // Step 6: Create matches table
    console.log('6️⃣ Creating matches table...');
    const { error: matchesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS matches (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(200) NOT NULL,
          description TEXT,
          host_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
          match_type VARCHAR(20) DEFAULT 'casual' CHECK (match_type IN ('casual', 'competitive')),
          max_participants INTEGER,
          current_participants INTEGER DEFAULT 0,
          venue VARCHAR(200) NOT NULL,
          scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
          duration_minutes INTEGER DEFAULT 60,
          status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (matchesError) console.log('⚠️  Matches table issue:', matchesError.message);

    // Step 7: Create match_participants table
    console.log('7️⃣ Creating match_participants table...');
    const { error: participantsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS match_participants (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(match_id, user_id)
        );
      `
    });
    if (participantsError) console.log('⚠️  Match participants table issue:', participantsError.message);

    // Step 8: Create stories table
    console.log('8️⃣ Creating stories table...');
    const { error: storiesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS stories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          media_url TEXT,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (storiesError) console.log('⚠️  Stories table issue:', storiesError.message);

    // Step 9: Create notifications table
    console.log('9️⃣ Creating notifications table...');
    const { error: notificationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          title VARCHAR(200) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(20) DEFAULT 'general' CHECK (type IN ('post', 'match', 'tournament', 'story', 'general')),
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (notificationsError) console.log('⚠️  Notifications table issue:', notificationsError.message);

    // Step 10: Create comments table
    console.log('🔟 Creating comments table...');
    const { error: commentsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS comments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (commentsError) console.log('⚠️  Comments table issue:', commentsError.message);

    // Step 11: Create likes table
    console.log('1️⃣1️⃣ Creating likes table...');
    const { error: likesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS likes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(post_id, user_id)
        );
      `
    });
    if (likesError) console.log('⚠️  Likes table issue:', likesError.message);

    console.log('\n✅ All tables created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

async function createIndexes() {
  try {
    console.log('\n📊 Creating indexes...');

    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_user_profiles_society_id ON user_profiles(society_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);',
      'CREATE INDEX IF NOT EXISTS idx_posts_society_id ON posts(society_id);',
      'CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);',
      'CREATE INDEX IF NOT EXISTS idx_matches_society_id ON matches(society_id);',
      'CREATE INDEX IF NOT EXISTS idx_matches_host_id ON matches(host_id);',
      'CREATE INDEX IF NOT EXISTS idx_matches_scheduled_date ON matches(scheduled_date);',
      'CREATE INDEX IF NOT EXISTS idx_match_participants_match_id ON match_participants(match_id);',
      'CREATE INDEX IF NOT EXISTS idx_match_participants_user_id ON match_participants(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_stories_society_id ON stories(society_id);',
      'CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at);',
      'CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);',
      'CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);',
      'CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);'
    ];

    for (const index of indexes) {
      const { error } = await supabase.rpc('exec_sql', { sql: index });
      if (error) console.log('⚠️  Index creation issue:', error.message);
    }

    console.log('✅ Indexes created successfully!');

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

async function populateData() {
  try {
    console.log('\n📝 Populating data...');

    // Insert India
    console.log('1️⃣ Inserting countries...');
    const { data: india, error: indiaError } = await supabase
      .from('countries')
      .upsert([{ name: 'India', code: 'IND' }], { onConflict: 'name' })
      .select()
      .single();

    if (indiaError) {
      console.log('⚠️  India creation issue:', indiaError.message);
      return;
    }

    // Insert states
    console.log('2️⃣ Inserting states...');
    const states = [
      { country_id: india.id, name: 'Delhi', code: 'DL' },
      { country_id: india.id, name: 'Karnataka', code: 'KA' },
      { country_id: india.id, name: 'Uttar Pradesh', code: 'UP' }
    ];

    const { data: statesData, error: statesError } = await supabase
      .from('states')
      .upsert(states, { onConflict: 'country_id,name' })
      .select();

    if (statesError) {
      console.log('⚠️  States creation issue:', statesError.message);
      return;
    }

    // Insert societies
    console.log('3️⃣ Inserting societies...');
    const societies = [];
    
    for (const state of statesData) {
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

    const { data: societiesData, error: societiesError } = await supabase
      .from('societies')
      .upsert(societies, { onConflict: 'state_id,name' })
      .select();

    if (societiesError) {
      console.log('⚠️  Societies creation issue:', societiesError.message);
      return;
    }

    // Insert users
    console.log('4️⃣ Inserting users...');
    const users = [
      // Delhi Users
      { name: 'Rahul Sharma', age: 25, phone: '+919876543210', interests: ['Football', 'Gym', 'Technology'], society: 'New Greens', flat: 'A-101', bio: 'Love playing football and staying fit!', gender: 'Male' },
      { name: 'Priya Singh', age: 23, phone: '+919876543211', interests: ['Arts & Dance', 'Music', 'Fashion'], society: 'New Greens', flat: 'B-205', bio: 'Dance enthusiast and music lover', gender: 'Female' },
      { name: 'Amit Kumar', age: 28, phone: '+919876543212', interests: ['Cricket', 'Gym', 'Travel'], society: 'Plak Rounds', flat: 'C-301', bio: 'Cricket fanatic and fitness enthusiast', gender: 'Male' },
      { name: 'Neha Gupta', age: 26, phone: '+919876543213', interests: ['Food & Drinks', 'Travel', 'Fashion'], society: 'Plak Rounds', flat: 'D-405', bio: 'Foodie and travel lover', gender: 'Female' },
      
      // Bangalore Users
      { name: 'Arjun Reddy', age: 24, phone: '+919876543214', interests: ['Technology', 'Gaming', 'Music'], society: 'Bangalore Heights', flat: 'E-101', bio: 'Tech geek and gamer', gender: 'Male' },
      { name: 'Ananya Rao', age: 22, phone: '+919876543215', interests: ['Arts & Dance', 'Fashion', 'Music'], society: 'Bangalore Heights', flat: 'F-202', bio: 'Creative soul and fashionista', gender: 'Female' },
      { name: 'Vikram Patel', age: 27, phone: '+919876543216', interests: ['Football', 'Gym', 'Technology'], society: 'Tech Park Residency', flat: 'G-303', bio: 'Football player and tech enthusiast', gender: 'Male' },
      { name: 'Sneha Iyer', age: 25, phone: '+919876543217', interests: ['Food & Drinks', 'Travel', 'Fashion'], society: 'Tech Park Residency', flat: 'H-404', bio: 'Food blogger and travel enthusiast', gender: 'Female' },
      
      // Uttar Pradesh Users
      { name: 'Rajesh Verma', age: 29, phone: '+919876543218', interests: ['Cricket', 'Gym', 'Travel'], society: 'Eldeco Utopia', flat: 'I-101', bio: 'Cricket coach and fitness trainer', gender: 'Male' },
      { name: 'Pooja Mishra', age: 24, phone: '+919876543219', interests: ['Arts & Dance', 'Music', 'Fashion'], society: 'Eldeco Utopia', flat: 'J-205', bio: 'Classical dancer and music teacher', gender: 'Female' },
      { name: 'Suresh Tyagi', age: 26, phone: '+919876543220', interests: ['Football', 'Gym', 'Technology'], society: 'Ajnara', flat: 'K-301', bio: 'Football player and gym enthusiast', gender: 'Male' },
      { name: 'Yash Bhatt', age: 23, phone: '+919876543221', interests: ['Gaming', 'Technology', 'Music'], society: 'Ajnara', flat: 'L-405', bio: 'Gamer and tech enthusiast', gender: 'Male' },
      { name: 'Aditya Arora', age: 25, phone: '+919876543222', interests: ['Cricket', 'Gym', 'Travel'], society: 'Shipra Neo', flat: 'M-101', bio: 'Cricket player and fitness enthusiast', gender: 'Male' },
      { name: 'Thripati', age: 27, phone: '+919876543223', interests: ['Football', 'Gym', 'Technology'], society: 'Shipra Neo', flat: 'N-202', bio: 'Football coach and tech lover', gender: 'Male' },
      { name: 'Rawat', age: 24, phone: '+919876543224', interests: ['Arts & Dance', 'Music', 'Fashion'], society: 'ATS Indira', flat: 'O-303', bio: 'Dance instructor and music lover', gender: 'Male' },
      { name: 'Navya Talwar', age: 22, phone: '+919876543225', interests: ['Food & Drinks', 'Travel', 'Fashion'], society: 'ATS Indira', flat: 'P-404', bio: 'Food blogger and travel enthusiast', gender: 'Female' }
    ];

    const { data: usersData, error: usersError } = await supabase
      .from('user_profiles')
      .upsert(users, { onConflict: 'phone' })
      .select();

    if (usersError) {
      console.log('⚠️  Users creation issue:', usersError.message);
      return;
    }

    // Insert sample posts
    console.log('5️⃣ Inserting sample posts...');
    const posts = [];
    
    for (const user of usersData) {
      const society = societiesData.find(s => s.name === user.society);
      if (society) {
        posts.push(
          {
            user_id: user.id,
            society_id: society.id,
            content: `Great day in ${user.society}! Who wants to join for some activities?`,
            post_type: 'general'
          },
          {
            user_id: user.id,
            society_id: society.id,
            content: `${user.society} community is amazing! Love living here.`,
            post_type: 'general'
          }
        );
      }
    }

    const { error: postsError } = await supabase
      .from('posts')
      .insert(posts);

    if (postsError) {
      console.log('⚠️  Posts creation issue:', postsError.message);
    }

    // Insert sample matches
    console.log('6️⃣ Inserting sample matches...');
    const hostUser = usersData.find(u => u.name === 'Rahul Sharma');
    if (hostUser) {
      const matches = [
        {
          title: '🏀 Basketball Match',
          description: 'Casual basketball game for New Greens residents',
          host_id: hostUser.id,
          society_id: societiesData.find(s => s.name === 'New Greens')?.id,
          venue: 'New Greens Basketball Court',
          scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          max_participants: 10
        },
        {
          title: '⚽ Football Tournament',
          description: 'Annual football tournament for Plak Rounds',
          host_id: hostUser.id,
          society_id: societiesData.find(s => s.name === 'Plak Rounds')?.id,
          venue: 'Plak Rounds Football Ground',
          scheduled_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          max_participants: 20
        }
      ];

      const { error: matchesError } = await supabase
        .from('matches')
        .insert(matches);

      if (matchesError) {
        console.log('⚠️  Matches creation issue:', matchesError.message);
      }
    }

    console.log('✅ Data populated successfully!');

  } catch (error) {
    console.error('❌ Error populating data:', error);
  }
}

async function verifySetup() {
  try {
    console.log('\n🔍 Verifying setup...');

    const tables = ['countries', 'states', 'societies', 'user_profiles', 'posts', 'matches'];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Error counting ${table}:`, error.message);
      } else {
        console.log(`📋 ${table}: ${count} records`);
      }
    }

    console.log('\n🎉 Setup verification complete!');
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
    console.error('❌ Error verifying setup:', error);
  }
}

async function runCompleteSetup() {
  console.log('🎯 Tangle Complete Database Setup');
  console.log('==================================\n');
  
  await createTables();
  await createIndexes();
  await populateData();
  await verifySetup();
  
  console.log('\n🎉 Your Tangle backend is now ready!');
  console.log('Users can sign up, join societies, create posts, host matches, and interact within their society boundaries.');
}

// Run the complete setup
if (require.main === module) {
  runCompleteSetup();
}

module.exports = { runCompleteSetup, createTables, createIndexes, populateData, verifySetup }; 
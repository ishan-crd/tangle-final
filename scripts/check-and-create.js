const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking existing tables...\n');

  const tables = [
    'countries',
    'states', 
    'societies',
    'user_profiles',
    'posts',
    'matches',
    'match_participants',
    'stories',
    'notifications',
    'comments',
    'likes'
  ];

  let existingTables = [];
  let missingTables = [];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        // Table doesn't exist
        missingTables.push(table);
        console.log(`❌ ${table}: Table does not exist`);
      } else if (error) {
        console.log(`⚠️  ${table}: ${error.message}`);
      } else {
        existingTables.push(table);
        console.log(`✅ ${table}: Table exists`);
      }
    } catch (error) {
      missingTables.push(table);
      console.log(`❌ ${table}: Table does not exist`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Existing tables: ${existingTables.length}`);
  console.log(`❌ Missing tables: ${missingTables.length}`);

  if (missingTables.length > 0) {
    console.log('\n🚨 ACTION REQUIRED:');
    console.log('You need to create the missing tables in your Supabase dashboard.');
    console.log('\n📋 Steps to create tables:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the following SQL:');
    console.log('\n' + '='.repeat(50));
    console.log('-- Create tables SQL');
    console.log('-- Copy this to Supabase SQL Editor');
    console.log('='.repeat(50));
    
    console.log(`
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(3) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- States table
CREATE TABLE states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_id, name),
    UNIQUE(country_id, code)
);

-- Societies table
CREATE TABLE societies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(state_id, name)
);

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Match participants table
CREATE TABLE match_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, user_id)
);

-- Stories table
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'general' CHECK (type IN ('post', 'match', 'tournament', 'story', 'general')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);
    `);
    
    console.log('\n4. Click "Run" to execute the SQL');
    console.log('5. After creating tables, run this script again to populate data');
    console.log('\n' + '='.repeat(50));
  } else {
    console.log('\n✅ All tables exist! Ready to populate data.');
    console.log('Run: node scripts/fix-database.js');
  }
}

// Run the check
if (require.main === module) {
  checkTables();
}

module.exports = { checkTables }; 
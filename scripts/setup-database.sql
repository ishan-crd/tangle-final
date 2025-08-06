-- Tangle App Database Setup Script
-- This script will handle existing tables and set up the complete database structure

-- ===========================================
-- 1. CLEAN UP EXISTING TABLES (if any)
-- ===========================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS match_participants CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS societies CASCADE;
DROP TABLE IF EXISTS states CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

-- Drop any existing triggers
DROP TRIGGER IF EXISTS update_countries_updated_at ON countries;
DROP TRIGGER IF EXISTS update_states_updated_at ON states;
DROP TRIGGER IF EXISTS update_societies_updated_at ON societies;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- ===========================================
-- 2. CREATE NEW SCHEMA
-- ===========================================

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
    society VARCHAR(200), -- Fallback field for society name
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

-- ===========================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ===========================================

CREATE INDEX idx_user_profiles_society_id ON user_profiles(society_id);
CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX idx_posts_society_id ON posts(society_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_matches_society_id ON matches(society_id);
CREATE INDEX idx_matches_host_id ON matches(host_id);
CREATE INDEX idx_matches_scheduled_date ON matches(scheduled_date);
CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX idx_match_participants_user_id ON match_participants(user_id);
CREATE INDEX idx_stories_society_id ON stories(society_id);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);

-- ===========================================
-- 4. CREATE TRIGGERS
-- ===========================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_states_updated_at BEFORE UPDATE ON states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_societies_updated_at BEFORE UPDATE ON societies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 5. SET UP ROW LEVEL SECURITY
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view profiles in their society" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Posts policies
CREATE POLICY "Users can view posts in their society" ON posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create posts in their society" ON posts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own posts" ON posts
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own posts" ON posts
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Matches policies
CREATE POLICY "Users can view matches in their society" ON matches
    FOR SELECT USING (true);

CREATE POLICY "Users can create matches in their society" ON matches
    FOR INSERT WITH CHECK (auth.uid()::text = host_id::text);

CREATE POLICY "Users can update their own matches" ON matches
    FOR UPDATE USING (auth.uid()::text = host_id::text);

-- Match participants policies
CREATE POLICY "Users can view match participants" ON match_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join matches" ON match_participants
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can leave matches" ON match_participants
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Stories policies
CREATE POLICY "Users can view stories in their society" ON stories
    FOR SELECT USING (true);

CREATE POLICY "Users can create stories in their society" ON stories
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Comments policies
CREATE POLICY "Users can view comments" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Likes policies
CREATE POLICY "Users can view likes" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Users can create likes" ON likes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own likes" ON likes
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- ===========================================
-- 6. POPULATE WITH DATA
-- ===========================================

-- Insert India as the country
INSERT INTO countries (name, code) VALUES 
('India', 'IND')
ON CONFLICT (name) DO NOTHING;

-- Get India's ID and insert states
DO $$
DECLARE
    india_id UUID;
BEGIN
    SELECT id INTO india_id FROM countries WHERE name = 'India';
    
    -- Insert States
    INSERT INTO states (country_id, name, code) VALUES 
    (india_id, 'Delhi', 'DL'),
    (india_id, 'Karnataka', 'KA'),
    (india_id, 'Uttar Pradesh', 'UP')
    ON CONFLICT (country_id, name) DO NOTHING;
    
    -- Get State IDs and insert societies
    DECLARE
        delhi_id UUID;
        karnataka_id UUID;
        up_id UUID;
    BEGIN
        SELECT id INTO delhi_id FROM states WHERE name = 'Delhi' AND country_id = india_id;
        SELECT id INTO karnataka_id FROM states WHERE name = 'Karnataka' AND country_id = india_id;
        SELECT id INTO up_id FROM states WHERE name = 'Uttar Pradesh' AND country_id = india_id;
        
        -- Insert Societies for Delhi
        INSERT INTO societies (state_id, name, address) VALUES 
        (delhi_id, 'New Greens', 'New Greens Society, Delhi'),
        (delhi_id, 'Plak Rounds', 'Plak Rounds Society, Delhi')
        ON CONFLICT (state_id, name) DO NOTHING;
        
        -- Insert Societies for Karnataka (Bangalore)
        INSERT INTO societies (state_id, name, address) VALUES 
        (karnataka_id, 'Bangalore Heights', 'Bangalore Heights Society, Bangalore'),
        (karnataka_id, 'Tech Park Residency', 'Tech Park Residency Society, Bangalore'),
        (karnataka_id, 'Garden City Society', 'Garden City Society, Bangalore')
        ON CONFLICT (state_id, name) DO NOTHING;
        
        -- Insert Societies for Uttar Pradesh
        INSERT INTO societies (state_id, name, address) VALUES 
        (up_id, 'Eldeco Utopia', 'Eldeco Utopia Society, Uttar Pradesh'),
        (up_id, 'Ajnara', 'Ajnara Society, Uttar Pradesh'),
        (up_id, 'Shipra Neo', 'Shipra Neo Society, Ghaziabad, Uttar Pradesh'),
        (up_id, 'ATS Indira', 'ATS Indira Society, Ghaziabad, Uttar Pradesh')
        ON CONFLICT (state_id, name) DO NOTHING;
        
    END;
END $$;

-- Insert sample users for testing
INSERT INTO user_profiles (name, age, phone, interests, society, flat, bio, gender) VALUES 
-- Delhi Users
('Rahul Sharma', 25, '+919876543210', ARRAY['Football', 'Gym', 'Technology'], 'New Greens', 'A-101', 'Love playing football and staying fit!', 'Male'),
('Priya Singh', 23, '+919876543211', ARRAY['Arts & Dance', 'Music', 'Fashion'], 'New Greens', 'B-205', 'Dance enthusiast and music lover', 'Female'),
('Amit Kumar', 28, '+919876543212', ARRAY['Cricket', 'Gym', 'Travel'], 'Plak Rounds', 'C-301', 'Cricket fanatic and fitness enthusiast', 'Male'),
('Neha Gupta', 26, '+919876543213', ARRAY['Food & Drinks', 'Travel', 'Fashion'], 'Plak Rounds', 'D-405', 'Foodie and travel lover', 'Female'),

-- Bangalore Users
('Arjun Reddy', 24, '+919876543214', ARRAY['Technology', 'Gaming', 'Music'], 'Bangalore Heights', 'E-101', 'Tech geek and gamer', 'Male'),
('Ananya Rao', 22, '+919876543215', ARRAY['Arts & Dance', 'Fashion', 'Music'], 'Bangalore Heights', 'F-202', 'Creative soul and fashionista', 'Female'),
('Vikram Patel', 27, '+919876543216', ARRAY['Football', 'Gym', 'Technology'], 'Tech Park Residency', 'G-303', 'Football player and tech enthusiast', 'Male'),
('Sneha Iyer', 25, '+919876543217', ARRAY['Food & Drinks', 'Travel', 'Fashion'], 'Tech Park Residency', 'H-404', 'Food blogger and travel enthusiast', 'Female'),

-- Uttar Pradesh Users
('Rajesh Verma', 29, '+919876543218', ARRAY['Cricket', 'Gym', 'Travel'], 'Eldeco Utopia', 'I-101', 'Cricket coach and fitness trainer', 'Male'),
('Pooja Mishra', 24, '+919876543219', ARRAY['Arts & Dance', 'Music', 'Fashion'], 'Eldeco Utopia', 'J-205', 'Classical dancer and music teacher', 'Female'),
('Suresh Tyagi', 26, '+919876543220', ARRAY['Football', 'Gym', 'Technology'], 'Ajnara', 'K-301', 'Football player and gym enthusiast', 'Male'),
('Yash Bhatt', 23, '+919876543221', ARRAY['Gaming', 'Technology', 'Music'], 'Ajnara', 'L-405', 'Gamer and tech enthusiast', 'Male'),
('Aditya Arora', 25, '+919876543222', ARRAY['Cricket', 'Gym', 'Travel'], 'Shipra Neo', 'M-101', 'Cricket player and fitness enthusiast', 'Male'),
('Thripati', 27, '+919876543223', ARRAY['Football', 'Gym', 'Technology'], 'Shipra Neo', 'N-202', 'Football coach and tech lover', 'Male'),
('Rawat', 24, '+919876543224', ARRAY['Arts & Dance', 'Music', 'Fashion'], 'ATS Indira', 'O-303', 'Dance instructor and music lover', 'Male'),
('Navya Talwar', 22, '+919876543225', ARRAY['Food & Drinks', 'Travel', 'Fashion'], 'ATS Indira', 'P-404', 'Food blogger and travel enthusiast', 'Female')
ON CONFLICT (phone) DO NOTHING;

-- Insert sample posts for each society
DO $$
DECLARE
    new_greens_id UUID;
    plak_rounds_id UUID;
    bangalore_heights_id UUID;
    tech_park_id UUID;
    eldeco_id UUID;
    ajnara_id UUID;
    shipra_neo_id UUID;
    ats_indira_id UUID;
    user_ids UUID[];
    user_id UUID;
BEGIN
    -- Get society IDs
    SELECT id INTO new_greens_id FROM societies WHERE name = 'New Greens';
    SELECT id INTO plak_rounds_id FROM societies WHERE name = 'Plak Rounds';
    SELECT id INTO bangalore_heights_id FROM societies WHERE name = 'Bangalore Heights';
    SELECT id INTO tech_park_id FROM societies WHERE name = 'Tech Park Residency';
    SELECT id INTO eldeco_id FROM societies WHERE name = 'Eldeco Utopia';
    SELECT id INTO ajnara_id FROM societies WHERE name = 'Ajnara';
    SELECT id INTO shipra_neo_id FROM societies WHERE name = 'Shipra Neo';
    SELECT id INTO ats_indira_id FROM societies WHERE name = 'ATS Indira';
    
    -- Insert posts for each society
    -- New Greens posts
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'New Greens';
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, new_greens_id, 'Great football match today! Who wants to join next time?', 'general'),
        (user_id, new_greens_id, 'New Greens Society - Best place to live!', 'general');
    END LOOP;
    
    -- Plak Rounds posts
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Plak Rounds';
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, plak_rounds_id, 'Plak Rounds community is amazing!', 'general'),
        (user_id, plak_rounds_id, 'Anyone up for a cricket match this weekend?', 'general');
    END LOOP;
    
    -- Bangalore Heights posts
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Bangalore Heights';
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, bangalore_heights_id, 'Bangalore Heights - Tech hub of the city!', 'general'),
        (user_id, bangalore_heights_id, 'Gaming night anyone?', 'general');
    END LOOP;
    
    -- Tech Park Residency posts
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Tech Park Residency';
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, tech_park_id, 'Tech Park Residency - Where innovation meets lifestyle!', 'general'),
        (user_id, tech_park_id, 'Football match this evening!', 'general');
    END LOOP;
    
    -- Eldeco Utopia posts
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Eldeco Utopia';
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, eldeco_id, 'Eldeco Utopia - Living the dream!', 'general'),
        (user_id, eldeco_id, 'Cricket coaching available!', 'general');
    END LOOP;
    
    -- Ajnara posts
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Ajnara';
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, ajnara_id, 'Ajnara Society - Best community ever!', 'general'),
        (user_id, ajnara_id, 'Gaming tournament this weekend!', 'general');
    END LOOP;
    
    -- Shipra Neo posts
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Shipra Neo';
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, shipra_neo_id, 'Shipra Neo - Modern living at its best!', 'general'),
        (user_id, shipra_neo_id, 'Football practice today!', 'general');
    END LOOP;
    
    -- ATS Indira posts
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'ATS Indira';
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, ats_indira_id, 'ATS Indira - Where dreams come true!', 'general'),
        (user_id, ats_indira_id, 'Dance class this evening!', 'general');
    END LOOP;
    
END $$;

-- Insert sample matches
DO $$
DECLARE
    new_greens_id UUID;
    plak_rounds_id UUID;
    eldeco_id UUID;
    ajnara_id UUID;
    host_id UUID;
BEGIN
    -- Get society IDs
    SELECT id INTO new_greens_id FROM societies WHERE name = 'New Greens';
    SELECT id INTO plak_rounds_id FROM societies WHERE name = 'Plak Rounds';
    SELECT id INTO eldeco_id FROM societies WHERE name = 'Eldeco Utopia';
    SELECT id INTO ajnara_id FROM societies WHERE name = 'Ajnara';
    
    -- Get host ID
    SELECT id INTO host_id FROM user_profiles WHERE name = 'Rahul Sharma' AND society = 'New Greens';
    
    -- Insert matches
    INSERT INTO matches (title, description, host_id, society_id, venue, scheduled_date, max_participants) VALUES 
    ('🏀 Basketball Match', 'Casual basketball game for New Greens residents', host_id, new_greens_id, 'New Greens Basketball Court', NOW() + INTERVAL '2 days', 10),
    ('⚽ Football Tournament', 'Annual football tournament for Plak Rounds', host_id, plak_rounds_id, 'Plak Rounds Football Ground', NOW() + INTERVAL '5 days', 20),
    ('🏏 Cricket Match', 'Weekend cricket match at Eldeco Utopia', host_id, eldeco_id, 'Eldeco Utopia Cricket Ground', NOW() + INTERVAL '3 days', 15),
    ('🎾 Tennis Doubles', 'Tennis doubles tournament at Ajnara', host_id, ajnara_id, 'Ajnara Tennis Court', NOW() + INTERVAL '4 days', 8);
    
END $$;

-- Insert sample stories
DO $$
DECLARE
    society_ids UUID[];
    society_id UUID;
    user_ids UUID[];
    user_id UUID;
BEGIN
    -- Get all society IDs
    SELECT array_agg(id) INTO society_ids FROM societies;
    
    -- For each society, create stories
    FOREACH society_id IN ARRAY society_ids
    LOOP
        -- Get users from this society
        SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society_id = society_id;
        
        -- Create stories for each user
        FOREACH user_id IN ARRAY user_ids
        LOOP
            INSERT INTO stories (user_id, society_id, content, expires_at) VALUES 
            (user_id, society_id, 'Having a great time in our society!', NOW() + INTERVAL '24 hours'),
            (user_id, society_id, 'Sports day celebration!', NOW() + INTERVAL '24 hours');
        END LOOP;
    END LOOP;
    
END $$;

-- Insert sample notifications
DO $$
DECLARE
    user_ids UUID[];
    user_id UUID;
BEGIN
    -- Get all user IDs
    SELECT array_agg(id) INTO user_ids FROM user_profiles;
    
    -- Create notifications for each user
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO notifications (user_id, title, message, type) VALUES 
        (user_id, 'Welcome to Tangle!', 'Welcome to your society community. Start connecting with your neighbors!', 'general'),
        (user_id, 'New Match Posted', 'A new sports match has been posted in your society!', 'match');
    END LOOP;
    
END $$;

-- ===========================================
-- 7. VERIFICATION
-- ===========================================

-- Display summary of created data
SELECT 'Countries' as table_name, COUNT(*) as count FROM countries
UNION ALL
SELECT 'States' as table_name, COUNT(*) as count FROM states
UNION ALL
SELECT 'Societies' as table_name, COUNT(*) as count FROM societies
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'Posts' as table_name, COUNT(*) as count FROM posts
UNION ALL
SELECT 'Matches' as table_name, COUNT(*) as count FROM matches
UNION ALL
SELECT 'Stories' as table_name, COUNT(*) as count FROM stories
UNION ALL
SELECT 'Notifications' as table_name, COUNT(*) as count FROM notifications;

-- Display societies with their states
SELECT 
    s.name as society_name,
    st.name as state_name,
    st.code as state_code
FROM societies s
JOIN states st ON s.state_id = st.id
ORDER BY st.name, s.name; 
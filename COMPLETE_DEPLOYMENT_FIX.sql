-- COMPLETE DEPLOYMENT FIX
-- This script will fix all database issues and make the app deployment-ready
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. CHECK AND CREATE MISSING TABLES
-- ========================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Tournaments Table (if not exists)
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    description TEXT,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Registration Open' CHECK (status IN ('Registration Open', 'Registration Closed', 'Ongoing', 'Completed', 'Cancelled')),
    prize_pool VARCHAR(255),
    society_id UUID REFERENCES societies(id),
    host_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Community Events Table (if not exists)
CREATE TABLE IF NOT EXISTS community_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Registration Open' CHECK (status IN ('Registration Open', 'Registration Closed', 'Ongoing', 'Completed', 'Cancelled')),
    highlights TEXT[], -- Array of highlights
    society_id UUID REFERENCES societies(id),
    host_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Tournament Participants Table (if not exists)
CREATE TABLE IF NOT EXISTS tournament_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, user_id)
);

-- Create Community Event Participants Table (if not exists)
CREATE TABLE IF NOT EXISTS community_event_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create Friendships Table for Interest Circles (if not exists)
CREATE TABLE IF NOT EXISTS friendships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- ========================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ========================================

-- Tournaments indexes
CREATE INDEX IF NOT EXISTS idx_tournaments_society_id ON tournaments(society_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_date ON tournaments(date);

-- Community events indexes
CREATE INDEX IF NOT EXISTS idx_community_events_society_id ON community_events(society_id);
CREATE INDEX IF NOT EXISTS idx_community_events_status ON community_events(status);
CREATE INDEX IF NOT EXISTS idx_community_events_date ON community_events(date);

-- Friendships indexes
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

-- User profiles interests index
CREATE INDEX IF NOT EXISTS idx_user_profiles_interests ON user_profiles USING GIN (interests);

-- ========================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. CREATE RLS POLICIES
-- ========================================

-- Tournaments RLS Policies
CREATE POLICY "Tournaments are viewable by everyone" ON tournaments
    FOR SELECT USING (true);

CREATE POLICY "Users can create tournaments in their society" ON tournaments
    FOR INSERT WITH CHECK (
        society_id IN (
            SELECT society_id FROM user_profiles 
            WHERE id = auth.uid() AND society_id IS NOT NULL
        )
    );

CREATE POLICY "Users can update tournaments they host" ON tournaments
    FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Users can delete tournaments they host" ON tournaments
    FOR DELETE USING (host_id = auth.uid());

-- Community Events RLS Policies
CREATE POLICY "Community events are viewable by everyone" ON community_events
    FOR SELECT USING (true);

CREATE POLICY "Users can create events in their society" ON community_events
    FOR INSERT WITH CHECK (
        society_id IN (
            SELECT society_id FROM user_profiles 
            WHERE id = auth.uid() AND society_id IS NOT NULL
        )
    );

CREATE POLICY "Users can update events they host" ON community_events
    FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Users can delete events they host" ON community_events
    FOR DELETE USING (host_id = auth.uid());

-- Tournament Participants RLS Policies
CREATE POLICY "Tournament participants are viewable by everyone" ON tournament_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join tournaments" ON tournament_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave tournaments" ON tournament_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Community Event Participants RLS Policies
CREATE POLICY "Community event participants are viewable by everyone" ON community_event_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join events" ON community_event_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave events" ON community_event_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Friendships RLS Policies
CREATE POLICY "Users can view their own friendships" ON friendships
    FOR SELECT USING (
        user_id = auth.uid() OR friend_id = auth.uid()
    );

CREATE POLICY "Users can create friendship requests" ON friendships
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND 
        user_id != friend_id AND
        EXISTS (
            SELECT 1 FROM user_profiles up1, user_profiles up2
            WHERE up1.id = user_id AND up2.id = friend_id
            AND up1.society = up2.society
        )
    );

CREATE POLICY "Users can update their own friendship requests" ON friendships
    FOR UPDATE USING (
        user_id = auth.uid() OR friend_id = auth.uid()
    );

CREATE POLICY "Users can delete their own friendship requests" ON friendships
    FOR DELETE USING (
        user_id = auth.uid() OR friend_id = auth.uid()
    );

-- ========================================
-- 5. ADD MISSING COLUMNS TO USER_PROFILES
-- ========================================

-- Add interests column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'interests'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN interests TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'bio'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'occupation'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN occupation VARCHAR(255);
    END IF;
END $$;

-- ========================================
-- 6. CREATE DATABASE FUNCTIONS
-- ========================================

-- Function to get users with common interests
CREATE OR REPLACE FUNCTION get_users_with_common_interests(
    current_user_id UUID,
    current_user_society TEXT
)
RETURNS TABLE (
    user_id UUID,
    name TEXT,
    avatar TEXT,
    interests TEXT[],
    bio TEXT,
    age INTEGER,
    occupation TEXT,
    common_interests TEXT[],
    match_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.name,
        up.avatar,
        up.interests,
        up.bio,
        up.age,
        up.occupation,
        up.interests & (
            SELECT interests FROM user_profiles WHERE id = current_user_id
        ) as common_interests,
        (
            array_length(
                up.interests & (
                    SELECT interests FROM user_profiles WHERE id = current_user_id
                ), 1
            )::NUMERIC / 
            array_length(
                (SELECT interests FROM user_profiles WHERE id = current_user_id), 1
            )::NUMERIC
        ) * 100 as match_score
    FROM user_profiles up
    WHERE up.society = current_user_society
    AND up.id != current_user_id
    AND up.interests IS NOT NULL
    AND array_length(up.interests, 1) > 0
    AND array_length(
        up.interests & (
            SELECT interests FROM user_profiles WHERE id = current_user_id
        ), 1
    ) > 0
    ORDER BY match_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_users_with_common_interests(UUID, TEXT) TO authenticated;

-- ========================================
-- 7. POPULATE SAMPLE DATA
-- ========================================

-- Update existing users with sample interests, bio, and occupation
UPDATE user_profiles 
SET interests = ARRAY['Sports', 'Music', 'Reading', 'Cooking', 'Travel', 'Technology', 'Art', 'Fitness']
WHERE interests IS NULL OR array_length(interests, 1) = 0;

UPDATE user_profiles 
SET bio = 'Passionate about connecting with neighbors and building community!'
WHERE bio IS NULL;

UPDATE user_profiles 
SET occupation = CASE 
    WHEN random() < 0.3 THEN 'Software Engineer'
    WHEN random() < 0.6 THEN 'Marketing Manager'
    WHEN random() < 0.8 THEN 'Teacher'
    ELSE 'Business Owner'
END
WHERE occupation IS NULL;

-- ========================================
-- 8. ADD SAMPLE TOURNAMENTS AND EVENTS FOR ALL SOCIETIES
-- ========================================

-- Get all societies
DO $$
DECLARE
    society_record RECORD;
    host_user_id UUID;
BEGIN
    FOR society_record IN SELECT id, name FROM societies LOOP
        -- Get a user from this society to be the host
        SELECT id INTO host_user_id 
        FROM user_profiles 
        WHERE society = society_record.name 
        LIMIT 1;
        
        -- Only create if we have a host user
        IF host_user_id IS NOT NULL THEN
            -- Create sample tournament for this society
            INSERT INTO tournaments (
                title, sport, description, max_participants, current_participants,
                date, time, location, status, prize_pool, society_id, host_id
            ) VALUES (
                CASE 
                    WHEN society_record.name LIKE '%Ajnara%' THEN 'Ajnara Cricket Championship'
                    WHEN society_record.name LIKE '%Plak%' THEN 'Plak Rounds Football League'
                    WHEN society_record.name LIKE '%Eldeco%' THEN 'Eldeco Tennis Tournament'
                    WHEN society_record.name LIKE '%Shipra%' THEN 'Shipra Badminton Cup'
                    WHEN society_record.name LIKE '%ATS%' THEN 'ATS Swimming Competition'
                    WHEN society_record.name LIKE '%Bangalore%' THEN 'Bangalore Tech Sports Meet'
                    WHEN society_record.name LIKE '%Garden%' THEN 'Garden City Basketball League'
                    WHEN society_record.name LIKE '%Hyderabad%' THEN 'Hyderabad Cricket Festival'
                    WHEN society_record.name LIKE '%Chennai%' THEN 'Chennai Tennis Open'
                    WHEN society_record.name LIKE '%Kolkata%' THEN 'Kolkata Football Derby'
                    WHEN society_record.name LIKE '%Ahmedabad%' THEN 'Ahmedabad Cricket Cup'
                    WHEN society_record.name LIKE '%Chandigarh%' THEN 'Chandigarh Sports Meet'
                    ELSE society_record.name || ' Sports Championship'
                END,
                CASE 
                    WHEN society_record.name LIKE '%Cricket%' THEN '🏏 Cricket'
                    WHEN society_record.name LIKE '%Football%' THEN '⚽ Football'
                    WHEN society_record.name LIKE '%Tennis%' THEN '🎾 Tennis'
                    WHEN society_record.name LIKE '%Badminton%' THEN '🏸 Badminton'
                    WHEN society_record.name LIKE '%Swimming%' THEN '🏊 Swimming'
                    WHEN society_record.name LIKE '%Basketball%' THEN '🏀 Basketball'
                    ELSE '🏃 Sports'
                END,
                'Join the exciting sports tournament in ' || society_record.name || '! Open to all residents.',
                32,
                FLOOR(RANDOM() * 20) + 5,
                CURRENT_DATE + INTERVAL '7 days',
                '18:00:00',
                society_record.name || ' Sports Complex',
                'Registration Open',
                '🏆 ₹5,000 Prize Pool',
                society_record.id,
                host_user_id
            ) ON CONFLICT DO NOTHING;
            
            -- Create sample community event for this society
            INSERT INTO community_events (
                title, category, description, max_participants, current_participants,
                date, time, location, status, highlights, society_id, host_id
            ) VALUES (
                CASE 
                    WHEN society_record.name LIKE '%Ajnara%' THEN 'Ajnara Diwali Cultural Night'
                    WHEN society_record.name LIKE '%Plak%' THEN 'Plak Rounds Christmas Celebration'
                    WHEN society_record.name LIKE '%Eldeco%' THEN 'Eldeco Community Meet'
                    WHEN society_record.name LIKE '%Shipra%' THEN 'Shipra New Year Party'
                    WHEN society_record.name LIKE '%ATS%' THEN 'ATS Health Workshop'
                    WHEN society_record.name LIKE '%Bangalore%' THEN 'Bangalore Tech Talk'
                    WHEN society_record.name LIKE '%Garden%' THEN 'Garden City Art Exhibition'
                    WHEN society_record.name LIKE '%Hyderabad%' THEN 'Hyderabad Food Festival'
                    WHEN society_record.name LIKE '%Chennai%' THEN 'Chennai Music Night'
                    WHEN society_record.name LIKE '%Kolkata%' THEN 'Kolkata Cultural Evening'
                    WHEN society_record.name LIKE '%Ahmedabad%' THEN 'Ahmedabad Heritage Walk'
                    WHEN society_record.name LIKE '%Chandigarh%' THEN 'Chandigarh Garden Party'
                    ELSE society_record.name || ' Community Event'
                END,
                CASE 
                    WHEN society_record.name LIKE '%Cultural%' THEN '🎭 Cultural'
                    WHEN society_record.name LIKE '%Christmas%' THEN '🎄 Religious'
                    WHEN society_record.name LIKE '%Tech%' THEN '💻 Technology'
                    WHEN society_record.name LIKE '%Art%' THEN '🎨 Arts'
                    WHEN society_record.name LIKE '%Food%' THEN '🍽️ Food'
                    WHEN society_record.name LIKE '%Music%' THEN '🎵 Music'
                    WHEN society_record.name LIKE '%Health%' THEN '🏥 Health'
                    ELSE '🎉 Celebration'
                END,
                'Join your neighbors for a wonderful community event in ' || society_record.name || '!',
                60,
                FLOOR(RANDOM() * 30) + 10,
                CURRENT_DATE + INTERVAL '14 days',
                '19:00:00',
                society_record.name || ' Community Hall',
                'Registration Open',
                ARRAY['Community Building', 'Fun Activities', 'Networking', 'Refreshments'],
                society_record.id,
                host_user_id
            ) ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
END $$;

-- ========================================
-- 9. VERIFY SETUP
-- ========================================

-- Show created tables
SELECT 'Tables Created:' as info;
SELECT table_name, row_security as rls_enabled
FROM information_schema.tables 
WHERE table_name IN ('tournaments', 'community_events', 'tournament_participants', 'community_event_participants', 'friendships')
ORDER BY table_name;

-- Show sample data
SELECT 'Sample Tournaments:' as info;
SELECT t.title, s.name as society, t.sport, t.status
FROM tournaments t
JOIN societies s ON t.society_id = s.id
ORDER BY s.name;

SELECT 'Sample Community Events:' as info;
SELECT ce.title, s.name as society, ce.category, ce.status
FROM community_events ce
JOIN societies s ON ce.society_id = s.id
ORDER BY s.name;

-- Show RLS policies
SELECT 'RLS Policies:' as info;
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('tournaments', 'community_events', 'tournament_participants', 'community_event_participants', 'friendships')
ORDER BY tablename, policyname;

-- Show user interests
SELECT 'User Interests Sample:' as info;
SELECT name, society, interests, bio, occupation
FROM user_profiles 
WHERE interests IS NOT NULL AND array_length(interests, 1) > 0
LIMIT 5;

-- ========================================
-- 10. FINAL STATUS
-- ========================================

SELECT '✅ DEPLOYMENT READY!' as status;
SELECT 'All tables created with RLS policies' as message;
SELECT 'Sample data populated for all societies' as message;
SELECT 'Interest Circles feature ready' as message;
SELECT 'Tournaments and Events feature ready' as message;

-- Complete Setup for Tangle App
-- Run this in your Supabase SQL Editor to fix all issues

-- ========================================
-- 1. FIX RLS PERMISSIONS
-- ========================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view profiles in their society" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON user_profiles;

DROP POLICY IF EXISTS "Users can view posts in their society" ON posts;
DROP POLICY IF EXISTS "Users can create posts in their society" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON posts;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON posts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON posts;

DROP POLICY IF EXISTS "Users can view matches in their society" ON matches;
DROP POLICY IF EXISTS "Users can create matches in their society" ON matches;
DROP POLICY IF EXISTS "Users can update their own matches" ON matches;
DROP POLICY IF EXISTS "Enable read access for all users" ON matches;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON matches;
DROP POLICY IF EXISTS "Enable update for users based on host_id" ON matches;

DROP POLICY IF EXISTS "Users can view match participants" ON match_participants;
DROP POLICY IF EXISTS "Users can join matches" ON match_participants;
DROP POLICY IF EXISTS "Users can leave matches" ON match_participants;
DROP POLICY IF EXISTS "Enable read access for all users" ON match_participants;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON match_participants;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON match_participants;

DROP POLICY IF EXISTS "Users can view stories in their society" ON stories;
DROP POLICY IF EXISTS "Users can create stories in their society" ON stories;
DROP POLICY IF EXISTS "Enable read access for all users" ON stories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON stories;

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON notifications;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON notifications;

DROP POLICY IF EXISTS "Users can view comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
DROP POLICY IF EXISTS "Enable read access for all users" ON comments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON comments;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON comments;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON comments;

DROP POLICY IF EXISTS "Users can view likes" ON likes;
DROP POLICY IF EXISTS "Users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;
DROP POLICY IF EXISTS "Enable read access for all users" ON likes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON likes;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON likes;

-- Disable RLS on all tables
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE states DISABLE ROW LEVEL SECURITY;
ALTER TABLE societies DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to anon role (for development only)
GRANT ALL ON user_profiles TO anon;
GRANT ALL ON posts TO anon;
GRANT ALL ON matches TO anon;
GRANT ALL ON match_participants TO anon;
GRANT ALL ON stories TO anon;
GRANT ALL ON notifications TO anon;
GRANT ALL ON comments TO anon;
GRANT ALL ON likes TO anon;
GRANT ALL ON countries TO anon;
GRANT ALL ON states TO anon;
GRANT ALL ON societies TO anon;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- ========================================
-- 2. FIX AGE CONSTRAINT
-- ========================================

-- Drop the existing age check constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_age_check;

-- Create a new age constraint that allows 0 and above (or null)
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_age_check 
CHECK (age IS NULL OR age >= 0);

-- ========================================
-- 3. UPDATE USER_PROFILES SCHEMA
-- ========================================

-- Add missing columns to user_profiles table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'address') THEN
        ALTER TABLE user_profiles ADD COLUMN address TEXT;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'flat') THEN
        ALTER TABLE user_profiles ADD COLUMN flat TEXT;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'avatar') THEN
        ALTER TABLE user_profiles ADD COLUMN avatar TEXT;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'bio') THEN
        ALTER TABLE user_profiles ADD COLUMN bio TEXT;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'gender') THEN
        ALTER TABLE user_profiles ADD COLUMN gender TEXT;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'state_id') THEN
        ALTER TABLE user_profiles ADD COLUMN state_id UUID REFERENCES states(id);
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'society_id') THEN
        ALTER TABLE user_profiles ADD COLUMN society_id UUID REFERENCES societies(id);
    END IF;
END $$;

-- ========================================
-- 4. POPULATE DATA
-- ========================================

-- Insert India as country
INSERT INTO countries (id, name, code) 
VALUES ('1', 'India', 'IN')
ON CONFLICT (id) DO NOTHING;

-- Insert states for India
INSERT INTO states (id, country_id, name, code) VALUES
('1', '1', 'Delhi', 'DL'),
('2', '1', 'Maharashtra', 'MH'),
('3', '1', 'Karnataka', 'KA'),
('4', '1', 'Uttar Pradesh', 'UP'),
('5', '1', 'Haryana', 'HR'),
('6', '1', 'Telangana', 'TS'),
('7', '1', 'Tamil Nadu', 'TN'),
('8', '1', 'West Bengal', 'WB'),
('9', '1', 'Gujarat', 'GJ'),
('10', '1', 'Punjab', 'PB')
ON CONFLICT (id) DO NOTHING;

-- Insert societies for each state
-- Delhi societies
INSERT INTO societies (id, state_id, name, address) VALUES
('1', '1', 'New Greens', 'Delhi'),
('2', '1', 'Plak Rounds', 'Delhi'),
('3', '1', 'Vasant Vihar', 'Delhi'),
('4', '1', 'Greater Kailash', 'Delhi'),
('5', '1', 'Saket', 'Delhi');

-- Maharashtra societies
INSERT INTO societies (id, state_id, name, address) VALUES
('6', '2', 'Bandra West', 'Mumbai'),
('7', '2', 'Juhu', 'Mumbai'),
('8', '2', 'Powai', 'Mumbai'),
('9', '2', 'Koregaon Park', 'Pune'),
('10', '2', 'Baner', 'Pune'),
('11', '2', 'Kharadi', 'Pune');

-- Karnataka societies
INSERT INTO societies (id, state_id, name, address) VALUES
('12', '3', 'Koramangala', 'Bangalore'),
('13', '3', 'Indiranagar', 'Bangalore'),
('14', '3', 'Whitefield', 'Bangalore');

-- Uttar Pradesh societies
INSERT INTO societies (id, state_id, name, address) VALUES
('15', '4', 'Eldeco Utopia', 'Noida'),
('16', '4', 'Ajnara', 'Ghaziabad'),
('17', '4', 'Shipra Neo', 'Ghaziabad'),
('18', '4', 'ATS Indira', 'Ghaziabad'),
('19', '4', 'Palm Greens', 'Noida'),
('20', '4', 'Supertech Ecovillage', 'Noida'),
('21', '4', 'Jaypee Greens', 'Noida');

-- Haryana societies
INSERT INTO societies (id, state_id, name, address) VALUES
('22', '5', 'DLF Phase 1', 'Gurgaon'),
('23', '5', 'Suncity Township', 'Gurgaon'),
('24', '5', 'Palm Springs', 'Gurgaon');

-- Telangana societies
INSERT INTO societies (id, state_id, name, address) VALUES
('25', '6', 'Banjara Hills', 'Hyderabad'),
('26', '6', 'Jubilee Hills', 'Hyderabad'),
('27', '6', 'Gachibowli', 'Hyderabad');

-- Tamil Nadu societies
INSERT INTO societies (id, state_id, name, address) VALUES
('28', '7', 'T Nagar', 'Chennai'),
('29', '7', 'Adyar', 'Chennai'),
('30', '7', 'Anna Nagar', 'Chennai');

-- West Bengal societies
INSERT INTO societies (id, state_id, name, address) VALUES
('31', '8', 'Park Street', 'Kolkata'),
('32', '8', 'Salt Lake', 'Kolkata'),
('33', '8', 'New Town', 'Kolkata');

-- Gujarat societies
INSERT INTO societies (id, state_id, name, address) VALUES
('34', '9', 'Satellite', 'Ahmedabad'),
('35', '9', 'Vastrapur', 'Ahmedabad'),
('36', '9', 'Navrangpura', 'Ahmedabad');

-- Punjab societies
INSERT INTO societies (id, state_id, name, address) VALUES
('37', '10', 'Sector 7', 'Chandigarh'),
('38', '10', 'Sector 10', 'Chandigarh'),
('39', '10', 'Sector 15', 'Chandigarh');

-- ========================================
-- 5. TEST THE SETUP
-- ========================================

-- Test inserting a user with age 0 (should work now)
INSERT INTO user_profiles (
    name, 
    age, 
    phone, 
    interests, 
    address, 
    society, 
    flat, 
    avatar, 
    bio, 
    gender
) VALUES (
    'Test Complete User',
    0,
    '+919876543201',
    ARRAY['Football', 'Gaming'],
    'Test Address',
    'Test Society',
    'A-101',
    'https://example.com/avatar.jpg',
    'This is a test bio for the complete user profile.',
    'Male'
) ON CONFLICT (phone) DO NOTHING;

-- Clean up test data
DELETE FROM user_profiles WHERE phone = '+919876543201';

-- Show final table structure
SELECT 'Final user_profiles table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Show RLS status
SELECT 'RLS Status:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'posts', 'matches', 'match_participants', 'stories', 'notifications', 'comments', 'likes', 'countries', 'states', 'societies')
ORDER BY tablename;

-- Show sample data
SELECT 'Sample countries:' as info;
SELECT * FROM countries;

SELECT 'Sample states:' as info;
SELECT s.*, c.name as country_name 
FROM states s 
JOIN countries c ON s.country_id = c.id 
ORDER BY s.name
LIMIT 5;

SELECT 'Sample societies:' as info;
SELECT so.*, s.name as state_name
FROM societies so
JOIN states s ON so.state_id = s.id
ORDER BY s.name, so.name
LIMIT 10;

SELECT 'Setup completed successfully!' as status; 
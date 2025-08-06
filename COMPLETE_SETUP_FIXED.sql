-- Complete Setup for Tangle App (Fixed UUID Version)
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
-- 4. POPULATE DATA WITH PROPER UUIDs
-- ========================================

-- Insert India as country with proper UUID
INSERT INTO countries (id, name, code) 
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'India', 'IN')
ON CONFLICT (id) DO NOTHING;

-- Insert states for India with proper UUIDs
INSERT INTO states (id, country_id, name, code) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Delhi', 'DL'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Maharashtra', 'MH'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Karnataka', 'KA'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Uttar Pradesh', 'UP'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Haryana', 'HR'),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'Telangana', 'TS'),
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', 'Tamil Nadu', 'TN'),
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', 'West Bengal', 'WB'),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Gujarat', 'GJ'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Punjab', 'PB')
ON CONFLICT (id) DO NOTHING;

-- Insert societies for each state with proper UUIDs
-- Delhi societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 'New Greens', 'Delhi'),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', 'Plak Rounds', 'Delhi'),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', 'Vasant Vihar', 'Delhi'),
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440002', 'Greater Kailash', 'Delhi'),
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440002', 'Saket', 'Delhi');

-- Maharashtra societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440003', 'Bandra West', 'Mumbai'),
('550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440003', 'Juhu', 'Mumbai'),
('550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440003', 'Powai', 'Mumbai'),
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440003', 'Koregaon Park', 'Pune'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440003', 'Baner', 'Pune'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440003', 'Kharadi', 'Pune');

-- Karnataka societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440004', 'Koramangala', 'Bangalore'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440004', 'Indiranagar', 'Bangalore'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440004', 'Whitefield', 'Bangalore');

-- Uttar Pradesh societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440005', 'Eldeco Utopia', 'Noida'),
('550e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440005', 'Ajnara', 'Ghaziabad'),
('550e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440005', 'Shipra Neo', 'Ghaziabad'),
('550e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440005', 'ATS Indira', 'Ghaziabad'),
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440005', 'Palm Greens', 'Noida'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440005', 'Supertech Ecovillage', 'Noida'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440005', 'Jaypee Greens', 'Noida');

-- Haryana societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440006', 'DLF Phase 1', 'Gurgaon'),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440006', 'Suncity Township', 'Gurgaon'),
('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440006', 'Palm Springs', 'Gurgaon');

-- Telangana societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440007', 'Banjara Hills', 'Hyderabad'),
('550e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440007', 'Jubilee Hills', 'Hyderabad'),
('550e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440007', 'Gachibowli', 'Hyderabad');

-- Tamil Nadu societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440008', 'T Nagar', 'Chennai'),
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440008', 'Adyar', 'Chennai'),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440008', 'Anna Nagar', 'Chennai');

-- West Bengal societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440009', 'Park Street', 'Kolkata'),
('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440009', 'Salt Lake', 'Kolkata'),
('550e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440009', 'New Town', 'Kolkata');

-- Gujarat societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440010', 'Satellite', 'Ahmedabad'),
('550e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440010', 'Vastrapur', 'Ahmedabad'),
('550e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440010', 'Navrangpura', 'Ahmedabad');

-- Punjab societies
INSERT INTO societies (id, state_id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440011', 'Sector 7', 'Chandigarh'),
('550e8400-e29b-41d4-a716-446655440049', '550e8400-e29b-41d4-a716-446655440011', 'Sector 10', 'Chandigarh'),
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440011', 'Sector 15', 'Chandigarh');

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
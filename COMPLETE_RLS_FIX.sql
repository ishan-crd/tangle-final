-- Complete RLS Fix for Tangle App
-- Run this in your Supabase SQL Editor

-- First, drop all existing policies
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

-- Now disable RLS on all tables
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on other tables that might exist
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

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'posts', 'matches', 'match_participants', 'stories', 'notifications', 'comments', 'likes', 'countries', 'states', 'societies')
ORDER BY tablename; 
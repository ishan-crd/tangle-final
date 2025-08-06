-- Temporarily disable RLS for development
-- This will allow your app to work during development
-- Run this in your Supabase SQL Editor

-- Disable RLS on all tables
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;

-- Note: This disables security for development
-- Re-enable RLS later with proper policies for production 
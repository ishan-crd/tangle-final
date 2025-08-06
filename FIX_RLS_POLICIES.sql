-- Fix RLS Policies for Tangle App
-- Run this in your Supabase SQL Editor after creating tables

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view profiles in their society" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Create new policies that allow initial user creation
CREATE POLICY "Enable read access for all users" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = id::text OR auth.uid() IS NULL);

CREATE POLICY "Enable update for users based on id" ON user_profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Enable delete for users based on id" ON user_profiles
    FOR DELETE USING (auth.uid()::text = id::text);

-- Fix posts policies
DROP POLICY IF EXISTS "Users can view posts in their society" ON posts;
DROP POLICY IF EXISTS "Users can create posts in their society" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

CREATE POLICY "Enable read access for all users" ON posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON posts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

CREATE POLICY "Enable update for users based on user_id" ON posts
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Enable delete for users based on user_id" ON posts
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Fix matches policies
DROP POLICY IF EXISTS "Users can view matches in their society" ON matches;
DROP POLICY IF EXISTS "Users can create matches in their society" ON matches;
DROP POLICY IF EXISTS "Users can update their own matches" ON matches;

CREATE POLICY "Enable read access for all users" ON matches
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON matches
    FOR INSERT WITH CHECK (auth.uid()::text = host_id::text OR auth.uid() IS NULL);

CREATE POLICY "Enable update for users based on host_id" ON matches
    FOR UPDATE USING (auth.uid()::text = host_id::text);

-- Fix match_participants policies
DROP POLICY IF EXISTS "Users can view match participants" ON match_participants;
DROP POLICY IF EXISTS "Users can join matches" ON match_participants;
DROP POLICY IF EXISTS "Users can leave matches" ON match_participants;

CREATE POLICY "Enable read access for all users" ON match_participants
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON match_participants
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

CREATE POLICY "Enable delete for users based on user_id" ON match_participants
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Fix stories policies
DROP POLICY IF EXISTS "Users can view stories in their society" ON stories;
DROP POLICY IF EXISTS "Users can create stories in their society" ON stories;

CREATE POLICY "Enable read access for all users" ON stories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON stories
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

-- Fix notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

CREATE POLICY "Enable read access for users based on user_id" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

CREATE POLICY "Enable update for users based on user_id" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Fix comments policies
DROP POLICY IF EXISTS "Users can view comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

CREATE POLICY "Enable read access for all users" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON comments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

CREATE POLICY "Enable update for users based on user_id" ON comments
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Enable delete for users based on user_id" ON comments
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Fix likes policies
DROP POLICY IF EXISTS "Users can view likes" ON likes;
DROP POLICY IF EXISTS "Users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;

CREATE POLICY "Enable read access for all users" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON likes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

CREATE POLICY "Enable delete for users based on user_id" ON likes
    FOR DELETE USING (auth.uid()::text = user_id::text); 
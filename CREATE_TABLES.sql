-- Tangle App Database Tables
-- Run this in your Supabase SQL Editor

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

-- Create indexes for better performance
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

-- Row Level Security (RLS) policies
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
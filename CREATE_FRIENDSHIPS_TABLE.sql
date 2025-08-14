-- Create Friendships Table for Interest Circles Feature
-- This table manages friend relationships between users in the same society

-- Create Friendships Table
CREATE TABLE IF NOT EXISTS friendships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
CREATE INDEX IF NOT EXISTS idx_friendships_user_friend ON friendships(user_id, friend_id);

-- Enable Row Level Security
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Friendships
-- Users can view friendships they are part of
CREATE POLICY "Users can view their own friendships" ON friendships
    FOR SELECT USING (
        user_id = auth.uid() OR friend_id = auth.uid()
    );

-- Users can create friendship requests
CREATE POLICY "Users can create friendship requests" ON friendships
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND 
        user_id != friend_id AND
        -- Ensure both users are in the same society
        EXISTS (
            SELECT 1 FROM user_profiles up1, user_profiles up2
            WHERE up1.id = user_id AND up2.id = friend_id
            AND up1.society = up2.society
        )
    );

-- Users can update their own friendship requests
CREATE POLICY "Users can update their own friendship requests" ON friendships
    FOR UPDATE USING (
        user_id = auth.uid() OR friend_id = auth.uid()
    );

-- Users can delete their own friendship requests
CREATE POLICY "Users can delete their own friendship requests" ON friendships
    FOR DELETE USING (
        user_id = auth.uid() OR friend_id = auth.uid()
    );

-- Add interests column to user_profiles if it doesn't exist
-- Note: This assumes user_profiles table already exists
-- If the column already exists, this will not create a duplicate

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

-- Create index on interests array for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_interests ON user_profiles USING GIN (interests);

-- Insert sample interests data for testing (remove in production)
-- Update existing users with sample interests
UPDATE user_profiles 
SET interests = ARRAY['Sports', 'Music', 'Reading', 'Cooking', 'Travel', 'Technology', 'Art', 'Fitness']
WHERE interests IS NULL OR array_length(interests, 1) = 0;

-- Add sample bios and occupations
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

-- Create a function to get users with common interests
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

-- Create a view for easy access to friendship status
CREATE OR REPLACE VIEW friendship_status AS
SELECT 
    f.id,
    f.user_id,
    f.friend_id,
    f.status,
    f.created_at,
    f.updated_at,
    up1.name as user_name,
    up2.name as friend_name,
    up1.society as user_society,
    up2.society as friend_society
FROM friendships f
JOIN user_profiles up1 ON f.user_id = up1.id
JOIN user_profiles up2 ON f.friend_id = up2.id;

-- Grant select permission on the view
GRANT SELECT ON friendship_status TO authenticated;

-- Create a function to check if two users are friends
CREATE OR REPLACE FUNCTION are_users_friends(
    user1_id UUID,
    user2_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM friendships 
        WHERE (user_id = user1_id AND friend_id = user2_id) 
           OR (user_id = user2_id AND friend_id = user1_id)
        AND status = 'accepted'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION are_users_friends(UUID, UUID) TO authenticated;

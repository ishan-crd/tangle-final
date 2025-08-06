-- Update User Profile Schema for Complete Onboarding Support
-- Run this in your Supabase SQL Editor

-- First, let's see the current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Add missing columns to user_profiles table
-- Note: We'll use ALTER TABLE ADD COLUMN IF NOT EXISTS to avoid errors if columns already exist

-- Add address column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'address') THEN
        ALTER TABLE user_profiles ADD COLUMN address TEXT;
    END IF;
END $$;

-- Add flat column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'flat') THEN
        ALTER TABLE user_profiles ADD COLUMN flat TEXT;
    END IF;
END $$;

-- Add avatar column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'avatar') THEN
        ALTER TABLE user_profiles ADD COLUMN avatar TEXT;
    END IF;
END $$;

-- Add bio column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'bio') THEN
        ALTER TABLE user_profiles ADD COLUMN bio TEXT;
    END IF;
END $$;

-- Add gender column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'gender') THEN
        ALTER TABLE user_profiles ADD COLUMN gender TEXT;
    END IF;
END $$;

-- Add state_id column if it doesn't exist (for linking to states table)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'state_id') THEN
        ALTER TABLE user_profiles ADD COLUMN state_id UUID REFERENCES states(id);
    END IF;
END $$;

-- Add society_id column if it doesn't exist (for linking to societies table)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'society_id') THEN
        ALTER TABLE user_profiles ADD COLUMN society_id UUID REFERENCES societies(id);
    END IF;
END $$;

-- Update the age constraint to allow 0 and above
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_age_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_age_check 
CHECK (age IS NULL OR age >= 0);

-- Show the updated table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Test inserting a complete user profile
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
    gender,
    society_id,
    state_id
) VALUES (
    'Test Complete User',
    25,
    '+919876543201',
    ARRAY['Football', 'Gaming'],
    'Test Address',
    'Test Society',
    'A-101',
    'https://example.com/avatar.jpg',
    'This is a test bio for the complete user profile.',
    'Male',
    NULL,
    NULL
) ON CONFLICT (phone) DO NOTHING;

-- Clean up test data
DELETE FROM user_profiles WHERE phone = '+919876543201';

-- Verify the constraint works with age 0
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
    'Test Age Zero User',
    0,
    '+919876543202',
    ARRAY['Technology'],
    '',
    '',
    '',
    '',
    '',
    ''
) ON CONFLICT (phone) DO NOTHING;

-- Clean up test data
DELETE FROM user_profiles WHERE phone = '+919876543202';

SELECT 'Schema updated successfully!' as status; 
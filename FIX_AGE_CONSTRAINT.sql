-- Fix Age Constraint for Tangle App
-- Run this in your Supabase SQL Editor

-- First, let's see what the current constraint is
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'user_profiles'::regclass 
AND contype = 'c';

-- Drop the existing age check constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_age_check;

-- Create a new age constraint that allows 0 and above (or null)
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_age_check 
CHECK (age IS NULL OR age >= 0);

-- Verify the constraint was updated
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'user_profiles'::regclass 
AND contype = 'c'
AND conname LIKE '%age%';

-- Test the constraint with some sample data
-- This should work now
INSERT INTO user_profiles (name, age, phone, interests, society, flat) 
VALUES ('Test User 0', 0, '+919876543200', ARRAY['Test'], 'Test Society', 'Test-101')
ON CONFLICT (phone) DO NOTHING;

-- Clean up test data
DELETE FROM user_profiles WHERE phone = '+919876543200';

-- Show the updated table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'age'; 
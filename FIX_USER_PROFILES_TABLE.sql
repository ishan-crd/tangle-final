-- Fix user_profiles table structure
-- Run this in your Supabase SQL Editor

-- Step 1: Add state_id column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id) ON DELETE SET NULL;

-- Step 2: Check if address column has any data
-- If the query below returns no rows, the address column is safe to remove
SELECT COUNT(*) as address_count 
FROM user_profiles 
WHERE address IS NOT NULL AND address != '';

-- Step 3: Remove address column if it's empty (uncomment if safe)
-- ALTER TABLE user_profiles DROP COLUMN IF EXISTS address;

-- Step 4: Verify the new structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Step 5: Add index on state_id for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_state_id ON user_profiles(state_id);

-- Step 6: Update existing users to have a default state if needed
-- Uncomment and modify the state_id below if you want to set a default state
-- UPDATE user_profiles 
-- SET state_id = '550e8400-e29b-41d4-a716-446655440002' -- Delhi state ID
-- WHERE state_id IS NULL;

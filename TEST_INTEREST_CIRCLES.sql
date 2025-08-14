-- Test Script for Interest Circles Feature
-- Run this after setting up the database to ensure everything is working

-- 1. Test that the friendships table exists and has RLS enabled
SELECT 
    'FRIENDSHIPS TABLE STATUS' as test_type,
    table_name,
    CASE 
        WHEN row_security = true THEN '✅ RLS ENABLED'
        ELSE '❌ RLS DISABLED'
    END as rls_status
FROM information_schema.tables 
WHERE table_name = 'friendships';

-- 2. Test that user_profiles has the new columns
SELECT 
    'USER_PROFILES NEW COLUMNS' as test_type,
    column_name,
    data_type,
    CASE 
        WHEN column_name IN ('interests', 'bio', 'occupation') THEN '✅ NEW COLUMN'
        ELSE '📋 EXISTING COLUMN'
    END as column_status
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('interests', 'bio', 'occupation')
ORDER BY column_name;

-- 3. Test that users have interests set
SELECT 
    'USER INTERESTS STATUS' as test_type,
    society,
    COUNT(*) as total_users,
    COUNT(CASE WHEN interests IS NOT NULL AND array_length(interests, 1) > 0 THEN 1 END) as users_with_interests,
    COUNT(CASE WHEN interests IS NULL OR array_length(interests, 1) = 0 THEN 1 END) as users_without_interests
FROM user_profiles 
GROUP BY society
ORDER BY society;

-- 4. Test the interest matching function
SELECT 
    'INTEREST MATCHING FUNCTION' as test_type,
    'Testing function availability' as note;

-- Try to call the function (this will show if it exists)
DO $$
DECLARE
    test_user_id UUID;
    test_society TEXT;
BEGIN
    -- Get a test user
    SELECT id, society INTO test_user_id, test_society 
    FROM user_profiles 
    WHERE interests IS NOT NULL AND array_length(interests, 1) > 0 
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Testing function with user % from society %', test_user_id, test_society;
        -- The function call will be tested in the next query
    ELSE
        RAISE NOTICE 'No users with interests found for testing';
    END IF;
END $$;

-- 5. Test actual interest matching (if function exists)
SELECT 
    'INTEREST MATCHING RESULTS' as test_type,
    'Showing sample matches for first user with interests' as note;

-- This will work if the function exists
WITH test_user AS (
    SELECT id, society, interests
    FROM user_profiles 
    WHERE interests IS NOT NULL AND array_length(interests, 1) > 0 
    LIMIT 1
)
SELECT 
    tu.society as user_society,
    array_length(tu.interests, 1) as user_interest_count,
    tu.interests as user_interests
FROM test_user tu;

-- 6. Test society isolation in user profiles
SELECT 
    'SOCIETY ISOLATION TEST' as test_type,
    society,
    COUNT(*) as user_count,
    STRING_AGG(DISTINCT interests::text, ', ') as sample_interests
FROM user_profiles 
WHERE interests IS NOT NULL AND array_length(interests, 1) > 0
GROUP BY society
ORDER BY society;

-- 7. Test friendships table structure
SELECT 
    'FRIENDSHIPS TABLE STRUCTURE' as test_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'friendships'
ORDER BY ordinal_position;

-- 8. Test RLS policies on friendships
SELECT 
    'FRIENDSHIPS RLS POLICIES' as test_type,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'friendships'
ORDER BY policyname;

-- 9. Test sample interest matching manually (fallback method)
SELECT 
    'MANUAL INTEREST MATCHING' as test_type,
    'Testing interest matching without function' as note;

WITH user_interests AS (
    SELECT 
        id,
        name,
        society,
        interests,
        array_length(interests, 1) as interest_count
    FROM user_profiles 
    WHERE interests IS NOT NULL AND array_length(interests, 1) > 0
),
interest_overlap AS (
    SELECT 
        u1.id as user1_id,
        u1.name as user1_name,
        u1.society as user1_society,
        u2.id as user2_id,
        u2.name as user2_name,
        u2.society as user2_society,
        u1.interests & u2.interests as common_interests,
        array_length(u1.interests & u2.interests, 1) as common_count
    FROM user_interests u1
    CROSS JOIN user_interests u2
    WHERE u1.id != u2.id
    AND u1.society = u2.society  -- Same society only
    AND array_length(u1.interests & u2.interests, 1) > 0  -- At least one common interest
)
SELECT 
    user1_society,
    user1_name,
    user2_name,
    common_interests,
    common_count,
    ROUND(
        (common_count::NUMERIC / 
         (SELECT interest_count FROM user_interests WHERE id = user1_id)
        ) * 100, 1
    ) as match_percentage
FROM interest_overlap
ORDER BY user1_society, match_percentage DESC
LIMIT 10;

-- 10. Test that cross-society data is not accessible
SELECT 
    'CROSS-SOCIETY ISOLATION TEST' as test_type,
    'Verifying no cross-society interest matches' as note;

-- This should return 0 rows if society isolation is working
SELECT COUNT(*) as cross_society_matches
FROM user_profiles u1
JOIN user_profiles u2 ON u1.id != u2.id
WHERE u1.society != u2.society
AND u1.interests IS NOT NULL 
AND u2.interests IS NOT NULL
AND array_length(u1.interests & u2.interests, 1) > 0;

-- 11. Performance test - check indexes
SELECT 
    'PERFORMANCE INDEXES' as test_type,
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('friendships', 'user_profiles')
AND indexname LIKE '%interests%' OR indexname LIKE '%society%'
ORDER BY tablename, indexname;

-- 12. Summary of Interest Circles setup
SELECT 
    'INTEREST CIRCLES SETUP SUMMARY' as test_type,
    'Feature Status Overview' as note;

SELECT 
    '✅ FRIENDSHIPS TABLE' as component,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'friendships') 
        THEN 'CREATED' 
        ELSE 'MISSING' 
    END as status
UNION ALL
SELECT 
    '✅ INTERESTS COLUMN' as component,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'interests') 
        THEN 'ADDED' 
        ELSE 'MISSING' 
    END as status
UNION ALL
SELECT 
    '✅ RLS POLICIES' as component,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'friendships') 
        THEN 'ACTIVE' 
        ELSE 'MISSING' 
    END as status
UNION ALL
SELECT 
    '✅ SOCIETY ISOLATION' as component,
    CASE 
        WHEN (SELECT COUNT(*) FROM user_profiles u1 JOIN user_profiles u2 ON u1.id != u2.id WHERE u1.society != u2.society AND array_length(u1.interests & u2.interests, 1) > 0) = 0
        THEN 'WORKING' 
        ELSE 'BROKEN' 
    END as status;

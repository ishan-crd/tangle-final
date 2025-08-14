-- VERIFY CURRENT DATABASE STATE
-- Run this first to see what's currently in your database

-- Check what tables exist
SELECT 'EXISTING TABLES:' as info;
SELECT table_name, row_security as rls_enabled
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if tournaments table exists
SELECT 'TOURNAMENTS TABLE STATUS:' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tournaments') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as status;

-- Check if community_events table exists
SELECT 'COMMUNITY EVENTS TABLE STATUS:' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'community_events') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as status;

-- Check if friendships table exists
SELECT 'FRIENDSHIPS TABLE STATUS:' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'friendships') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as status;

-- Check user_profiles structure
SELECT 'USER_PROFILES COLUMNS:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('interests', 'bio', 'occupation')
ORDER BY column_name;

-- Check societies
SELECT 'SOCIETIES COUNT:' as info;
SELECT COUNT(*) as total_societies FROM societies;

-- Check users with societies
SELECT 'USERS WITH SOCIETIES:' as info;
SELECT society, COUNT(*) as user_count
FROM user_profiles 
WHERE society IS NOT NULL
GROUP BY society
ORDER BY society;

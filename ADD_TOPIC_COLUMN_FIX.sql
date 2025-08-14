-- =====================================================
-- ADD TOPIC COLUMN TO GROUPS TABLE
-- =====================================================
-- This script will add the missing topic column to the groups table
-- Run this in your Supabase SQL Editor immediately!

-- =====================================================
-- STEP 1: ADD MISSING COLUMN
-- =====================================================

-- Add topic column to groups table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'groups' 
        AND column_name = 'topic'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.groups ADD COLUMN topic VARCHAR(50);
    END IF;
END $$;

-- =====================================================
-- STEP 2: UPDATE EXISTING RECORDS
-- =====================================================

-- Update existing groups with default topic if they don't have one
UPDATE public.groups 
SET topic = 'other' 
WHERE topic IS NULL;

-- =====================================================
-- STEP 3: MAKE COLUMN NOT NULL
-- =====================================================

-- Make topic column NOT NULL after updating existing records
ALTER TABLE public.groups ALTER COLUMN topic SET NOT NULL;

-- =====================================================
-- STEP 4: VERIFY THE FIX
-- =====================================================

-- Check if topic column exists
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'groups' 
AND column_name = 'topic'
AND table_schema = 'public';

-- Check existing groups and their topics
SELECT 
    name,
    topic,
    created_at
FROM public.groups
ORDER BY created_at DESC;

-- =====================================================
-- FIX COMPLETE!
-- =====================================================
-- The topic column has been added to the groups table.
-- 
-- What was fixed:
-- ✅ Added topic column to groups table
-- ✅ Updated existing records with default topic
-- ✅ Made topic column NOT NULL
-- ✅ Verified the fix
--
-- The Groups feature should now work without the "column topic does not exist" error!

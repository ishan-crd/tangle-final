-- =====================================================
-- CLEANUP EXISTING EMPTY GROUPS
-- =====================================================
-- This script finds and deletes any existing groups that have 0 members
-- Run this after setting up the auto-delete triggers

-- =====================================================
-- STEP 1: FIND EMPTY GROUPS
-- =====================================================

-- Show groups with their member counts
SELECT 
    g.id,
    g.name,
    g.society_id,
    COALESCE(member_count.count, 0) as member_count
FROM groups g
LEFT JOIN (
    SELECT group_id, COUNT(*) as count
    FROM group_members
    GROUP BY group_id
) member_count ON g.id = member_count.group_id
ORDER BY member_count.count ASC;

-- =====================================================
-- STEP 2: DELETE EMPTY GROUPS
-- =====================================================

-- Find groups with 0 members
WITH empty_groups AS (
    SELECT g.id
    FROM groups g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    WHERE gm.group_id IS NULL
)
-- Delete group messages for empty groups
DELETE FROM group_messages 
WHERE group_id IN (SELECT id FROM empty_groups);

-- Delete group invitations for empty groups
DELETE FROM group_invitations 
WHERE group_id IN (SELECT id FROM empty_groups);

-- Delete the empty groups themselves
DELETE FROM groups 
WHERE id IN (
    SELECT g.id
    FROM groups g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    WHERE gm.group_id IS NULL
);

-- =====================================================
-- STEP 3: VERIFY CLEANUP
-- =====================================================

-- Show remaining groups with their member counts
SELECT 
    g.id,
    g.name,
    g.society_id,
    COALESCE(member_count.count, 0) as member_count
FROM groups g
LEFT JOIN (
    SELECT group_id, COUNT(*) as count
    FROM group_members
    GROUP BY group_id
) member_count ON g.id = member_count.group_id
ORDER BY member_count.count ASC;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Count how many groups were deleted
    SELECT COUNT(*) INTO deleted_count
    FROM groups g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    WHERE gm.group_id IS NULL;
    
    RAISE NOTICE '✅ CLEANUP COMPLETE!';
    RAISE NOTICE 'Empty groups have been removed from the database.';
    RAISE NOTICE 'Auto-delete triggers are now active for future empty groups.';
END $$;

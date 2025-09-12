-- =====================================================
-- AUTO DELETE EMPTY GROUPS - DATABASE TRIGGER
-- =====================================================
-- This script creates a database trigger that automatically deletes groups
-- when they reach 0 members, ensuring data consistency

-- =====================================================
-- STEP 1: CREATE FUNCTION TO DELETE EMPTY GROUPS
-- =====================================================

CREATE OR REPLACE FUNCTION delete_empty_groups()
RETURNS TRIGGER AS $$
DECLARE
    group_id_to_check UUID;
    member_count INTEGER;
BEGIN
    -- Get the group_id from the deleted row
    group_id_to_check := COALESCE(OLD.group_id, NEW.group_id);
    
    -- Check if the group still exists and count members
    SELECT COUNT(*) INTO member_count
    FROM group_members
    WHERE group_id = group_id_to_check;
    
    -- If no members left, delete the group and related data
    IF member_count = 0 THEN
        -- Delete group messages first (due to foreign key constraints)
        DELETE FROM group_messages WHERE group_id = group_id_to_check;
        
        -- Delete group invitations
        DELETE FROM group_invitations WHERE group_id = group_id_to_check;
        
        -- Delete the group itself
        DELETE FROM groups WHERE id = group_id_to_check;
        
        RAISE NOTICE 'Group % automatically deleted due to zero members', group_id_to_check;
    END IF;
    
    RETURN COALESCE(OLD, NEW);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 2: CREATE TRIGGER ON GROUP_MEMBERS TABLE
-- =====================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_delete_empty_groups ON group_members;

-- Create the trigger
CREATE TRIGGER trigger_delete_empty_groups
    AFTER DELETE ON group_members
    FOR EACH ROW
    EXECUTE FUNCTION delete_empty_groups();

-- =====================================================
-- STEP 3: CREATE TRIGGER ON GROUPS TABLE (for manual deletions)
-- =====================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_cleanup_group_data ON groups;

-- Create function to cleanup group data when group is deleted
CREATE OR REPLACE FUNCTION cleanup_group_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete group messages
    DELETE FROM group_messages WHERE group_id = OLD.id;
    
    -- Delete group invitations
    DELETE FROM group_invitations WHERE group_id = OLD.id;
    
    RAISE NOTICE 'Cleaned up data for deleted group %', OLD.id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_cleanup_group_data
    BEFORE DELETE ON groups
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_group_data();

-- =====================================================
-- STEP 4: VERIFY SETUP
-- =====================================================

-- Check if triggers were created successfully
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name IN ('trigger_delete_empty_groups', 'trigger_cleanup_group_data');

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ AUTO DELETE EMPTY GROUPS SETUP COMPLETE!';
    RAISE NOTICE 'Groups will now be automatically deleted when they reach 0 members.';
    RAISE NOTICE 'All related data (messages, invitations) will also be cleaned up.';
END $$;

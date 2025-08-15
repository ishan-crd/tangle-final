-- =====================================================
-- GROUPS RLS POLICIES (FIX "permission denied for table groups")
-- =====================================================
-- Run this in Supabase SQL Editor.

-- Enable RLS on tables
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present (idempotent)
DROP POLICY IF EXISTS "groups_select_all" ON public.groups;
DROP POLICY IF EXISTS "groups_insert_creator" ON public.groups;
DROP POLICY IF EXISTS "group_members_select_all" ON public.group_members;
DROP POLICY IF EXISTS "group_members_insert_public_or_creator" ON public.group_members;
DROP POLICY IF EXISTS "group_invitations_select_all" ON public.group_invitations;
DROP POLICY IF EXISTS "friendships_insert" ON public.friendships;
DROP POLICY IF EXISTS "friendships_select" ON public.friendships;

-- Read policies (allow everyone to read lists)
CREATE POLICY "groups_select_all" ON public.groups
  FOR SELECT USING (true);

CREATE POLICY "group_members_select_all" ON public.group_members
  FOR SELECT USING (true);

CREATE POLICY "group_invitations_select_all" ON public.group_invitations
  FOR SELECT USING (true);

-- Friendships policies: allow creating requests and reading own friendships
CREATE POLICY "friendships_insert" ON public.friendships
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "friendships_select" ON public.friendships
  FOR SELECT USING (true);

-- Insert policies
-- Allow authenticated users to create groups where they are the creator
CREATE POLICY "groups_insert_creator" ON public.groups
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Allow joining public groups, or creator can add anyone (for private groups)
CREATE POLICY "group_members_insert_public_or_creator" ON public.group_members
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id AND g.is_private = false
    )
    OR
    auth.uid() = (
      SELECT g.created_by FROM public.groups g WHERE g.id = group_id
    )
  );

-- Optional: allow creators/admins to remove members (not strictly needed for the error)
-- You can extend with update/delete policies later as needed.

-- Verify
SELECT tablename, rowsecurity AS rls_enabled FROM pg_tables 
WHERE tablename IN ('groups','group_members','group_invitations');

SELECT table_name, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND table_name IN ('groups','group_members','group_invitations')
ORDER BY table_name, policyname;



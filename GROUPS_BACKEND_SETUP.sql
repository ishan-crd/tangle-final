-- =====================================================
-- GROUPS FEATURE - COMPLETE BACKEND SETUP
-- =====================================================
-- This script creates all necessary tables, policies, and sample data
-- for the Groups functionality in the Tangle app.

-- =====================================================
-- STEP 1: CREATE TABLES
-- =====================================================

-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    topic VARCHAR(50) NOT NULL,
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 50,
    is_private BOOLEAN DEFAULT false,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Create group_invitations table
CREATE TABLE IF NOT EXISTS public.group_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    invited_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, invited_user_id)
);

-- =====================================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for groups table
CREATE INDEX IF NOT EXISTS idx_groups_society_id ON public.groups(society_id);
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON public.groups(created_by);
CREATE INDEX IF NOT EXISTS idx_groups_topic ON public.groups(topic);

-- Indexes for group_members table
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON public.group_members(role);

-- Indexes for group_invitations table
CREATE INDEX IF NOT EXISTS idx_group_invitations_group_id ON public.group_invitations(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invitations_invited_user_id ON public.group_invitations(invited_user_id);
CREATE INDEX IF NOT EXISTS idx_group_invitations_status ON public.group_invitations(status);

-- =====================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: CREATE RLS POLICIES
-- =====================================================

-- Groups table policies
CREATE POLICY "Groups are viewable by society members" ON public.groups
    FOR SELECT USING (
        society_id IN (
            SELECT society_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can create groups in their society" ON public.groups
    FOR INSERT WITH CHECK (
        society_id IN (
            SELECT society_id FROM public.user_profiles 
            WHERE id = auth.uid()
        ) AND created_by = auth.uid()
    );

CREATE POLICY "Group admins can update their groups" ON public.groups
    FOR UPDATE USING (
        id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Group admins can delete their groups" ON public.groups
    FOR DELETE USING (
        id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Group members table policies
CREATE POLICY "Group members can view their group memberships" ON public.group_members
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Group admins can add members" ON public.group_members
    FOR INSERT WITH CHECK (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can leave groups themselves" ON public.group_members
    FOR DELETE USING (
        user_id = auth.uid()
    );

CREATE POLICY "Group admins can remove any member" ON public.group_members
    FOR DELETE USING (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Group invitations table policies
CREATE POLICY "Users can view invitations sent to them" ON public.group_invitations
    FOR SELECT USING (
        invited_user_id = auth.uid()
    );

CREATE POLICY "Group admins can view invitations for their groups" ON public.group_invitations
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Group admins can send invitations" ON public.group_invitations
    FOR INSERT WITH CHECK (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Invited users can update invitation status" ON public.group_invitations
    FOR UPDATE USING (
        invited_user_id = auth.uid()
    );

-- =====================================================
-- STEP 5: GRANT PERMISSIONS
-- =====================================================

-- Grant all privileges on tables to authenticated users
GRANT ALL PRIVILEGES ON public.groups TO authenticated;
GRANT ALL PRIVILEGES ON public.group_members TO authenticated;
GRANT ALL PRIVILEGES ON public.group_invitations TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- STEP 6: INSERT SAMPLE DATA
-- =====================================================

-- Insert sample groups for Greater Kailash society
-- First, get the society ID for Greater Kailash
DO $$
DECLARE
    gk_society_id UUID;
    sample_user_id UUID;
BEGIN
    -- Get Greater Kailash society ID
    SELECT id INTO gk_society_id FROM public.societies WHERE name = 'Greater Kailash' LIMIT 1;
    
    -- Get a sample user ID from Greater Kailash
    SELECT id INTO sample_user_id FROM public.user_profiles WHERE society_id = gk_society_id LIMIT 1;
    
    -- Insert sample groups if they don't exist
    IF NOT EXISTS (SELECT 1 FROM public.groups WHERE name = 'Sports Enthusiasts') THEN
        INSERT INTO public.groups (name, description, topic, society_id, created_by, max_members)
        VALUES (
            'Sports Enthusiasts',
            'A group for sports lovers to discuss games, organize matches, and share victories!',
            'sports',
            gk_society_id,
            sample_user_id,
            30
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.groups WHERE name = 'Music Lovers') THEN
        INSERT INTO public.groups (name, description, topic, society_id, created_by, max_members)
        VALUES (
            'Music Lovers',
            'Share your favorite tunes, discuss artists, and maybe organize a jam session!',
            'music',
            gk_society_id,
            sample_user_id,
            25
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.groups WHERE name = 'Work From Home Warriors') THEN
        INSERT INTO public.groups (name, description, topic, society_id, created_by, max_members)
        VALUES (
            'Work From Home Warriors',
            'Tips, tricks, and support for those working remotely. Let''s stay productive together!',
            'work',
            gk_society_id,
            sample_user_id,
            40
        );
    END IF;
    
    -- Add the creator as admin to each group
    INSERT INTO public.group_members (group_id, user_id, role)
    SELECT g.id, g.created_by, 'admin'
    FROM public.groups g
    WHERE g.society_id = gk_society_id
    ON CONFLICT (group_id, user_id) DO NOTHING;
    
END $$;

-- =====================================================
-- STEP 7: VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT 
    'Tables Created' as status,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('groups', 'group_members', 'group_invitations');

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('groups', 'group_members', 'group_invitations');

-- Check sample data
SELECT 
    'Sample Groups' as info,
    COUNT(*) as count
FROM public.groups;

SELECT 
    'Group Members' as info,
    COUNT(*) as count
FROM public.group_members;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your Groups feature is now ready to use!
-- 
-- What was created:
-- ✅ 3 new tables: groups, group_members, group_invitations
-- ✅ RLS policies for security
-- ✅ Sample groups for Greater Kailash society
-- ✅ Proper permissions for authenticated users
-- 
-- Next steps:
-- 1. Test the create group flow in the app
-- 2. Verify groups are society-bound
-- 3. Test member management functionality

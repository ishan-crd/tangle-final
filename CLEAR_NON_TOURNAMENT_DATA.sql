-- Clear all application data except tournaments and community events
-- Run this in the Supabase SQL Editor (it uses the service role and bypasses RLS)

BEGIN;

-- 1) Clear any participation rows that reference users
DELETE FROM public.tournament_participants;
DELETE FROM public.community_event_participants;

-- 2) Clear group chat/message metadata
DELETE FROM public.group_message_receipts;
DELETE FROM public.group_messages;

-- 3) Clear group membership/invitations and groups
DELETE FROM public.group_invitations;
DELETE FROM public.group_members;
DELETE FROM public.groups;

-- 4) Clear social content
DELETE FROM public.likes;
DELETE FROM public.comments;
DELETE FROM public.notifications;
DELETE FROM public.stories;
DELETE FROM public.match_participants;
DELETE FROM public.matches;
DELETE FROM public.posts;

-- 5) Clear friendships
DELETE FROM public.friendships;

-- 6) Finally clear user profiles, but keep hosts referenced by tournaments/events
DELETE FROM public.user_profiles
WHERE id NOT IN (
  SELECT host_id FROM public.tournaments WHERE host_id IS NOT NULL
  UNION
  SELECT host_id FROM public.community_events WHERE host_id IS NOT NULL
);

COMMIT;

-- NOTE:
-- - This keeps: public.tournaments and public.community_events
-- - It also keeps master data: public.countries, public.states, public.societies
-- - If you also want to clear master data, add DELETE statements for those tables (order matters)


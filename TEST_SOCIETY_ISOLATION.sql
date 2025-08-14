-- Test Script to Verify Society Isolation
-- Run this after setting up the database to ensure security is working

-- 1. Test that tournaments are properly isolated by society
SELECT 
    'TOURNAMENTS BY SOCIETY' as test_type,
    s.name as society_name,
    COUNT(t.id) as tournament_count,
    STRING_AGG(t.title, ', ') as tournament_titles
FROM societies s
LEFT JOIN tournaments t ON s.id = t.society_id
GROUP BY s.id, s.name
ORDER BY s.name;

-- 2. Test that community events are properly isolated by society
SELECT 
    'COMMUNITY EVENTS BY SOCIETY' as test_type,
    s.name as society_name,
    COUNT(ce.id) as event_count,
    STRING_AGG(ce.title, ', ') as event_titles
FROM societies s
LEFT JOIN community_events ce ON s.id = ce.society_id
GROUP BY s.id, s.name
ORDER BY s.name;

-- 3. Test participant counts are accurate
SELECT 
    'TOURNAMENT PARTICIPANT COUNTS' as test_type,
    t.title as tournament_title,
    s.name as society_name,
    t.current_participants as stored_count,
    COUNT(tp.id) as actual_participant_count,
    CASE 
        WHEN t.current_participants = COUNT(tp.id) THEN '✅ MATCH'
        ELSE '❌ MISMATCH'
    END as status
FROM tournaments t
JOIN societies s ON t.society_id = s.id
LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
GROUP BY t.id, t.title, s.name, t.current_participants
ORDER BY s.name, t.title;

-- 4. Test community event participant counts are accurate
SELECT 
    'COMMUNITY EVENT PARTICIPANT COUNTS' as test_type,
    ce.title as event_title,
    s.name as society_name,
    ce.current_participants as stored_count,
    COUNT(cep.id) as actual_participant_count,
    CASE 
        WHEN ce.current_participants = COUNT(cep.id) THEN '✅ MATCH'
        ELSE '❌ MISMATCH'
    END as status
FROM community_events ce
JOIN societies s ON ce.society_id = s.id
LEFT JOIN community_event_participants cep ON ce.id = cep.event_id
GROUP BY ce.id, ce.title, s.name, ce.current_participants
ORDER BY s.name, ce.title;

-- 5. Test RLS policies are working (this should only show data for the authenticated user's society)
-- Note: This will only work when run by an authenticated user
SELECT 
    'RLS TEST - USER SOCIETY ACCESS' as test_type,
    'Run this as an authenticated user to test RLS policies' as note;

-- 6. Verify foreign key constraints are working
SELECT 
    'FOREIGN KEY INTEGRITY' as test_type,
    'tournaments.society_id' as constraint_name,
    COUNT(*) as total_tournaments,
    COUNT(s.id) as valid_society_references,
    COUNT(*) - COUNT(s.id) as invalid_references
FROM tournaments t
LEFT JOIN societies s ON t.society_id = s.id;

SELECT 
    'FOREIGN KEY INTEGRITY' as test_type,
    'community_events.society_id' as constraint_name,
    COUNT(*) as total_events,
    COUNT(s.id) as valid_society_references,
    COUNT(*) - COUNT(s.id) as invalid_references
FROM community_events ce
LEFT JOIN societies s ON ce.society_id = s.id;

-- 7. Test that sample data is properly distributed
SELECT 
    'SAMPLE DATA DISTRIBUTION' as test_type,
    'Ajnara Society' as society,
    (SELECT COUNT(*) FROM tournaments WHERE society_id = (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1)) as tournaments,
    (SELECT COUNT(*) FROM community_events WHERE society_id = (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1)) as events
UNION ALL
SELECT 
    'SAMPLE DATA DISTRIBUTION' as test_type,
    'Plak Rounds Society' as society,
    (SELECT COUNT(*) FROM tournaments WHERE society_id = (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1)) as tournaments,
    (SELECT COUNT(*) FROM community_events WHERE society_id = (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1)) as events;

-- 8. Test unique constraints on participants
SELECT 
    'UNIQUE CONSTRAINT TEST' as test_type,
    'tournament_participants' as table_name,
    COUNT(*) as total_participants,
    COUNT(DISTINCT CONCAT(tournament_id, ':', user_id)) as unique_combinations,
    CASE 
        WHEN COUNT(*) = COUNT(DISTINCT CONCAT(tournament_id, ':', user_id)) THEN '✅ UNIQUE CONSTRAINT WORKING'
        ELSE '❌ DUPLICATE PARTICIPANTS FOUND'
    END as status
FROM tournament_participants;

SELECT 
    'UNIQUE CONSTRAINT TEST' as test_type,
    'community_event_participants' as table_name,
    COUNT(*) as total_participants,
    COUNT(DISTINCT CONCAT(event_id, ':', user_id)) as unique_combinations,
    CASE 
        WHEN COUNT(*) = COUNT(DISTINCT CONCAT(event_id, ':', user_id)) THEN '✅ UNIQUE CONSTRAINT WORKING'
        ELSE '❌ DUPLICATE PARTICIPANTS FOUND'
    END as status
FROM community_event_participants;

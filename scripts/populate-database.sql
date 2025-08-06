-- Populate Tangle Database with Required Data
-- Hierarchical structure: India > States > Societies

-- Insert India as the country
INSERT INTO countries (name, code) VALUES 
('India', 'IND')
ON CONFLICT (name) DO NOTHING;

-- Get India's ID
DO $$
DECLARE
    india_id UUID;
BEGIN
    SELECT id INTO india_id FROM countries WHERE name = 'India';
    
    -- Insert States
    INSERT INTO states (country_id, name, code) VALUES 
    (india_id, 'Delhi', 'DL'),
    (india_id, 'Karnataka', 'KA'),
    (india_id, 'Uttar Pradesh', 'UP')
    ON CONFLICT (country_id, name) DO NOTHING;
    
    -- Get State IDs
    DECLARE
        delhi_id UUID;
        karnataka_id UUID;
        up_id UUID;
    BEGIN
        SELECT id INTO delhi_id FROM states WHERE name = 'Delhi' AND country_id = india_id;
        SELECT id INTO karnataka_id FROM states WHERE name = 'Karnataka' AND country_id = india_id;
        SELECT id INTO up_id FROM states WHERE name = 'Uttar Pradesh' AND country_id = india_id;
        
        -- Insert Societies for Delhi
        INSERT INTO societies (state_id, name, address) VALUES 
        (delhi_id, 'New Greens', 'New Greens Society, Delhi'),
        (delhi_id, 'Plak Rounds', 'Plak Rounds Society, Delhi')
        ON CONFLICT (state_id, name) DO NOTHING;
        
        -- Insert Societies for Karnataka (Bangalore)
        INSERT INTO societies (state_id, name, address) VALUES 
        (karnataka_id, 'Bangalore Heights', 'Bangalore Heights Society, Bangalore'),
        (karnataka_id, 'Tech Park Residency', 'Tech Park Residency Society, Bangalore'),
        (karnataka_id, 'Garden City Society', 'Garden City Society, Bangalore')
        ON CONFLICT (state_id, name) DO NOTHING;
        
        -- Insert Societies for Uttar Pradesh
        INSERT INTO societies (state_id, name, address) VALUES 
        (up_id, 'Eldeco Utopia', 'Eldeco Utopia Society, Uttar Pradesh'),
        (up_id, 'Ajnara', 'Ajnara Society, Uttar Pradesh'),
        (up_id, 'Shipra Neo', 'Shipra Neo Society, Ghaziabad, Uttar Pradesh'),
        (up_id, 'ATS Indira', 'ATS Indira Society, Ghaziabad, Uttar Pradesh')
        ON CONFLICT (state_id, name) DO NOTHING;
        
    END;
END $$;

-- Insert sample users for testing
INSERT INTO user_profiles (name, age, phone, interests, society, flat, bio, gender) VALUES 
-- Delhi Users
('Rahul Sharma', 25, '+919876543210', ARRAY['Football', 'Gym', 'Technology'], 'New Greens', 'A-101', 'Love playing football and staying fit!', 'Male'),
('Priya Singh', 23, '+919876543211', ARRAY['Arts & Dance', 'Music', 'Fashion'], 'New Greens', 'B-205', 'Dance enthusiast and music lover', 'Female'),
('Amit Kumar', 28, '+919876543212', ARRAY['Cricket', 'Gym', 'Travel'], 'Plak Rounds', 'C-301', 'Cricket fanatic and fitness enthusiast', 'Male'),
('Neha Gupta', 26, '+919876543213', ARRAY['Food & Drinks', 'Travel', 'Fashion'], 'Plak Rounds', 'D-405', 'Foodie and travel lover', 'Female'),

-- Bangalore Users
('Arjun Reddy', 24, '+919876543214', ARRAY['Technology', 'Gaming', 'Music'], 'Bangalore Heights', 'E-101', 'Tech geek and gamer', 'Male'),
('Ananya Rao', 22, '+919876543215', ARRAY['Arts & Dance', 'Fashion', 'Music'], 'Bangalore Heights', 'F-202', 'Creative soul and fashionista', 'Female'),
('Vikram Patel', 27, '+919876543216', ARRAY['Football', 'Gym', 'Technology'], 'Tech Park Residency', 'G-303', 'Football player and tech enthusiast', 'Male'),
('Sneha Iyer', 25, '+919876543217', ARRAY['Food & Drinks', 'Travel', 'Fashion'], 'Tech Park Residency', 'H-404', 'Food blogger and travel enthusiast', 'Female'),

-- Uttar Pradesh Users
('Rajesh Verma', 29, '+919876543218', ARRAY['Cricket', 'Gym', 'Travel'], 'Eldeco Utopia', 'I-101', 'Cricket coach and fitness trainer', 'Male'),
('Pooja Mishra', 24, '+919876543219', ARRAY['Arts & Dance', 'Music', 'Fashion'], 'Eldeco Utopia', 'J-205', 'Classical dancer and music teacher', 'Female'),
('Suresh Tyagi', 26, '+919876543220', ARRAY['Football', 'Gym', 'Technology'], 'Ajnara', 'K-301', 'Football player and gym enthusiast', 'Male'),
('Yash Bhatt', 23, '+919876543221', ARRAY['Gaming', 'Technology', 'Music'], 'Ajnara', 'L-405', 'Gamer and tech enthusiast', 'Male'),
('Aditya Arora', 25, '+919876543222', ARRAY['Cricket', 'Gym', 'Travel'], 'Shipra Neo', 'M-101', 'Cricket player and fitness enthusiast', 'Male'),
('Thripati', 27, '+919876543223', ARRAY['Football', 'Gym', 'Technology'], 'Shipra Neo', 'N-202', 'Football coach and tech lover', 'Male'),
('Rawat', 24, '+919876543224', ARRAY['Arts & Dance', 'Music', 'Fashion'], 'ATS Indira', 'O-303', 'Dance instructor and music lover', 'Male'),
('Navya Talwar', 22, '+919876543225', ARRAY['Food & Drinks', 'Travel', 'Fashion'], 'ATS Indira', 'P-404', 'Food blogger and travel enthusiast', 'Female')
ON CONFLICT (phone) DO NOTHING;

-- Insert sample posts for each society
DO $$
DECLARE
    new_greens_id UUID;
    plak_rounds_id UUID;
    bangalore_heights_id UUID;
    tech_park_id UUID;
    eldeco_id UUID;
    ajnara_id UUID;
    shipra_neo_id UUID;
    ats_indira_id UUID;
    user_ids UUID[];
    user_id UUID;
BEGIN
    -- Get society IDs
    SELECT id INTO new_greens_id FROM societies WHERE name = 'New Greens';
    SELECT id INTO plak_rounds_id FROM societies WHERE name = 'Plak Rounds';
    SELECT id INTO bangalore_heights_id FROM societies WHERE name = 'Bangalore Heights';
    SELECT id INTO tech_park_id FROM societies WHERE name = 'Tech Park Residency';
    SELECT id INTO eldeco_id FROM societies WHERE name = 'Eldeco Utopia';
    SELECT id INTO ajnara_id FROM societies WHERE name = 'Ajnara';
    SELECT id INTO shipra_neo_id FROM societies WHERE name = 'Shipra Neo';
    SELECT id INTO ats_indira_id FROM societies WHERE name = 'ATS Indira';
    
    -- Get user IDs for each society
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'New Greens';
    
    -- Insert posts for New Greens
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, new_greens_id, 'Great football match today! Who wants to join next time?', 'general'),
        (user_id, new_greens_id, 'New Greens Society - Best place to live!', 'general');
    END LOOP;
    
    -- Get user IDs for Plak Rounds
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Plak Rounds';
    
    -- Insert posts for Plak Rounds
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, plak_rounds_id, 'Plak Rounds community is amazing!', 'general'),
        (user_id, plak_rounds_id, 'Anyone up for a cricket match this weekend?', 'general');
    END LOOP;
    
    -- Get user IDs for Bangalore Heights
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Bangalore Heights';
    
    -- Insert posts for Bangalore Heights
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, bangalore_heights_id, 'Bangalore Heights - Tech hub of the city!', 'general'),
        (user_id, bangalore_heights_id, 'Gaming night anyone?', 'general');
    END LOOP;
    
    -- Get user IDs for Tech Park Residency
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Tech Park Residency';
    
    -- Insert posts for Tech Park Residency
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, tech_park_id, 'Tech Park Residency - Where innovation meets lifestyle!', 'general'),
        (user_id, tech_park_id, 'Football match this evening!', 'general');
    END LOOP;
    
    -- Get user IDs for Eldeco Utopia
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Eldeco Utopia';
    
    -- Insert posts for Eldeco Utopia
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, eldeco_id, 'Eldeco Utopia - Living the dream!', 'general'),
        (user_id, eldeco_id, 'Cricket coaching available!', 'general');
    END LOOP;
    
    -- Get user IDs for Ajnara
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Ajnara';
    
    -- Insert posts for Ajnara
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, ajnara_id, 'Ajnara Society - Best community ever!', 'general'),
        (user_id, ajnara_id, 'Gaming tournament this weekend!', 'general');
    END LOOP;
    
    -- Get user IDs for Shipra Neo
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'Shipra Neo';
    
    -- Insert posts for Shipra Neo
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, shipra_neo_id, 'Shipra Neo - Modern living at its best!', 'general'),
        (user_id, shipra_neo_id, 'Football practice today!', 'general');
    END LOOP;
    
    -- Get user IDs for ATS Indira
    SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society = 'ATS Indira';
    
    -- Insert posts for ATS Indira
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO posts (user_id, society_id, content, post_type) VALUES 
        (user_id, ats_indira_id, 'ATS Indira - Where dreams come true!', 'general'),
        (user_id, ats_indira_id, 'Dance class this evening!', 'general');
    END LOOP;
    
END $$;

-- Insert sample matches
DO $$
DECLARE
    new_greens_id UUID;
    plak_rounds_id UUID;
    eldeco_id UUID;
    ajnara_id UUID;
    user_ids UUID[];
    host_id UUID;
BEGIN
    -- Get society IDs
    SELECT id INTO new_greens_id FROM societies WHERE name = 'New Greens';
    SELECT id INTO plak_rounds_id FROM societies WHERE name = 'Plak Rounds';
    SELECT id INTO eldeco_id FROM societies WHERE name = 'Eldeco Utopia';
    SELECT id INTO ajnara_id FROM societies WHERE name = 'Ajnara';
    
    -- Get host IDs
    SELECT id INTO host_id FROM user_profiles WHERE name = 'Rahul Sharma' AND society = 'New Greens';
    
    -- Insert matches
    INSERT INTO matches (title, description, host_id, society_id, venue, scheduled_date, max_participants) VALUES 
    ('🏀 Basketball Match', 'Casual basketball game for New Greens residents', host_id, new_greens_id, 'New Greens Basketball Court', NOW() + INTERVAL '2 days', 10),
    ('⚽ Football Tournament', 'Annual football tournament for Plak Rounds', host_id, plak_rounds_id, 'Plak Rounds Football Ground', NOW() + INTERVAL '5 days', 20),
    ('🏏 Cricket Match', 'Weekend cricket match at Eldeco Utopia', host_id, eldeco_id, 'Eldeco Utopia Cricket Ground', NOW() + INTERVAL '3 days', 15),
    ('🎾 Tennis Doubles', 'Tennis doubles tournament at Ajnara', host_id, ajnara_id, 'Ajnara Tennis Court', NOW() + INTERVAL '4 days', 8);
    
END $$;

-- Insert sample stories
DO $$
DECLARE
    society_ids UUID[];
    society_id UUID;
    user_ids UUID[];
    user_id UUID;
BEGIN
    -- Get all society IDs
    SELECT array_agg(id) INTO society_ids FROM societies;
    
    -- For each society, create stories
    FOREACH society_id IN ARRAY society_ids
    LOOP
        -- Get users from this society
        SELECT array_agg(id) INTO user_ids FROM user_profiles WHERE society_id = society_id;
        
        -- Create stories for each user
        FOREACH user_id IN ARRAY user_ids
        LOOP
            INSERT INTO stories (user_id, society_id, content, expires_at) VALUES 
            (user_id, society_id, 'Having a great time in our society!', NOW() + INTERVAL '24 hours'),
            (user_id, society_id, 'Sports day celebration!', NOW() + INTERVAL '24 hours');
        END LOOP;
    END LOOP;
    
END $$;

-- Insert sample notifications
DO $$
DECLARE
    user_ids UUID[];
    user_id UUID;
BEGIN
    -- Get all user IDs
    SELECT array_agg(id) INTO user_ids FROM user_profiles;
    
    -- Create notifications for each user
    FOREACH user_id IN ARRAY user_ids
    LOOP
        INSERT INTO notifications (user_id, title, message, type) VALUES 
        (user_id, 'Welcome to Tangle!', 'Welcome to your society community. Start connecting with your neighbors!', 'general'),
        (user_id, 'New Match Posted', 'A new sports match has been posted in your society!', 'match');
    END LOOP;
    
END $$; 
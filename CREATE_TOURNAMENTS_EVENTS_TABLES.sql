-- Create Tournaments Table
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    description TEXT,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Registration Open' CHECK (status IN ('Registration Open', 'Registration Closed', 'Ongoing', 'Completed', 'Cancelled')),
    prize_pool VARCHAR(255),
    society_id UUID REFERENCES societies(id),
    host_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Community Events Table
CREATE TABLE IF NOT EXISTS community_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Registration Open' CHECK (status IN ('Registration Open', 'Registration Closed', 'Ongoing', 'Completed', 'Cancelled')),
    highlights TEXT[], -- Array of highlights
    society_id UUID REFERENCES societies(id),
    host_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Tournament Participants Table
CREATE TABLE IF NOT EXISTS tournament_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, user_id)
);

-- Create Community Event Participants Table
CREATE TABLE IF NOT EXISTS community_event_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournaments_society_id ON tournaments(society_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_date ON tournaments(date);
CREATE INDEX IF NOT EXISTS idx_community_events_society_id ON community_events(society_id);
CREATE INDEX IF NOT EXISTS idx_community_events_status ON community_events(status);
CREATE INDEX IF NOT EXISTS idx_community_events_date ON community_events(date);

-- Create RLS policies
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_event_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Tournaments
CREATE POLICY "Tournaments are viewable by everyone" ON tournaments
    FOR SELECT USING (true);

CREATE POLICY "Users can create tournaments in their society" ON tournaments
    FOR INSERT WITH CHECK (
        society_id IN (
            SELECT society_id FROM user_profiles 
            WHERE id = auth.uid() AND society_id IS NOT NULL
        )
    );

CREATE POLICY "Users can update tournaments they host" ON tournaments
    FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Users can delete tournaments they host" ON tournaments
    FOR DELETE USING (host_id = auth.uid());

-- RLS Policies for Community Events
CREATE POLICY "Community events are viewable by everyone" ON community_events
    FOR SELECT USING (true);

CREATE POLICY "Users can create events in their society" ON community_events
    FOR INSERT WITH CHECK (
        society_id IN (
            SELECT society_id FROM user_profiles 
            WHERE id = auth.uid() AND society_id IS NOT NULL
        )
    );

CREATE POLICY "Users can update events they host" ON community_events
    FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Users can delete events they host" ON community_events
    FOR DELETE USING (host_id = auth.uid());

-- RLS Policies for Tournament Participants
CREATE POLICY "Tournament participants are viewable by everyone" ON tournament_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join tournaments" ON tournament_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave tournaments" ON tournament_participants
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Community Event Participants
CREATE POLICY "Community event participants are viewable by everyone" ON community_event_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join events" ON community_event_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave events" ON community_event_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Insert sample data for testing (remove in production)
-- Sample data for Ajnara Society
INSERT INTO tournaments (title, sport, description, max_participants, current_participants, date, time, location, status, prize_pool, society_id, host_id) VALUES
('Basketball Championship', '🏀 Basketball', 'Annual basketball championship for all age groups. Form teams of 5 players.', 32, 24, '2024-12-15', '18:00:00', 'Society Basketball Court', 'Registration Open', '🏆 ₹10,000 Prize Pool', 
 (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Ajnara' LIMIT 1)),
('Badminton Singles League', '🏸 Badminton', 'Single elimination tournament. All skill levels welcome.', 24, 18, '2024-12-20', '19:00:00', 'Society Badminton Court', 'Registration Open', '🏆 ₹5,000 Prize Pool',
 (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Ajnara' LIMIT 1)),
('Cricket T20 Tournament', '🏏 Cricket', 'T20 format cricket tournament. Teams of 11 players.', 60, 44, '2024-12-25', '16:00:00', 'Society Cricket Ground', 'Registration Open', '🏆 ₹15,000 Prize Pool',
 (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Ajnara' LIMIT 1)),
('Table Tennis Championship', '🏓 Table Tennis', 'Fast-paced table tennis tournament for all skill levels.', 16, 12, '2024-12-28', '17:00:00', 'Society Indoor Sports Complex', 'Registration Open', '🏆 ₹3,000 Prize Pool',
 (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Ajnara' LIMIT 1));

-- Sample data for Plak Rounds Society
INSERT INTO tournaments (title, sport, description, max_participants, current_participants, date, time, location, status, prize_pool, society_id, host_id) VALUES
('Football Premier League', '⚽ Football', 'Season-long football league with weekly matches.', 44, 38, '2024-12-10', '16:00:00', 'Plak Rounds Football Ground', 'Registration Open', '🏆 ₹20,000 Prize Pool',
 (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Plak Rounds' LIMIT 1)),
('Tennis Championship', '🎾 Tennis', 'Annual tennis championship with singles and doubles categories.', 32, 28, '2024-12-18', '18:00:00', 'Plak Rounds Tennis Courts', 'Registration Open', '🏆 ₹12,000 Prize Pool',
 (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Plak Rounds' LIMIT 1)),
('Swimming Competition', '🏊 Swimming', 'Swimming competition in various categories and age groups.', 40, 35, '2024-12-22', '15:00:00', 'Plak Rounds Swimming Pool', 'Registration Open', '🏆 ₹8,000 Prize Pool',
 (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Plak Rounds' LIMIT 1));

-- Sample data for another society (if exists)
INSERT INTO tournaments (title, sport, description, max_participants, current_participants, date, time, location, status, prize_pool, society_id, host_id) VALUES
('Volleyball Tournament', '🏐 Volleyball', 'Team volleyball tournament with mixed teams.', 36, 30, '2024-12-14', '19:00:00', 'Society Volleyball Court', 'Registration Open', '🏆 ₹6,000 Prize Pool',
 (SELECT id FROM societies WHERE name != 'Ajnara' AND name != 'Plak Rounds' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society != 'Ajnara' AND society != 'Plak Rounds' LIMIT 1));

-- Sample community events for Ajnara Society
INSERT INTO community_events (title, category, description, max_participants, current_participants, date, time, location, status, highlights, society_id, host_id) VALUES
('Diwali Cultural Night', '🎭 Cultural', 'Celebrate Diwali with cultural performances, music, and traditional food. Open to all residents.', 60, 45, '2024-12-12', '19:00:00', 'Society Community Hall', 'Registration Open', 
 ARRAY['Cultural Performances', 'Traditional Food', 'Music & Dance', 'Family Event'],
 (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Ajnara' LIMIT 1)),
('New Year''s Eve Party', '🎉 Celebration', 'Ring in the New Year with your neighbors! Live music, food, and countdown celebration.', 100, 78, '2024-12-31', '21:00:00', 'Society Garden Area', 'Registration Open',
 ARRAY['Live Music', 'Countdown Party', 'Food & Drinks', 'Fireworks'],
 (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Ajnara' LIMIT 1)),
('Health & Wellness Workshop', '🏥 Health', 'Learn about healthy living, nutrition, and fitness from certified health professionals.', 30, 22, '2024-12-18', '18:00:00', 'Society Conference Room', 'Registration Open',
 ARRAY['Expert Speakers', 'Health Tips', 'Q&A Session', 'Free Health Checkup'],
 (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Ajnara' LIMIT 1)),
('Art & Craft Exhibition', '🎨 Arts', 'Showcase your artistic talents and view amazing artwork from fellow residents.', 50, 35, '2024-12-26', '14:00:00', 'Society Art Gallery', 'Registration Open',
 ARRAY['Art Display', 'Live Demonstrations', 'Workshop Sessions', 'Awards Ceremony'],
 (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Ajnara' LIMIT 1));

-- Sample community events for Plak Rounds Society
INSERT INTO community_events (title, category, description, max_participants, current_participants, date, time, location, status, highlights, society_id, host_id) VALUES
('Christmas Carol Night', '🎄 Religious', 'Celebrate Christmas with carol singing, prayers, and festive activities.', 80, 65, '2024-12-24', '20:00:00', 'Plak Rounds Community Center', 'Registration Open',
 ARRAY['Carol Singing', 'Prayer Service', 'Christmas Tree Lighting', 'Refreshments'],
 (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Plak Rounds' LIMIT 1)),
('Tech Talk Series', '💻 Technology', 'Monthly technology discussions and workshops for tech enthusiasts.', 40, 28, '2024-12-16', '17:00:00', 'Plak Rounds Tech Hub', 'Registration Open',
 ARRAY['Expert Speakers', 'Hands-on Workshops', 'Networking', 'Q&A Sessions'],
 (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Plak Rounds' LIMIT 1)),
('Book Club Meeting', '📚 Education', 'Monthly book discussion and literary conversations.', 25, 20, '2024-12-20', '19:00:00', 'Plak Rounds Library', 'Registration Open',
 ARRAY['Book Discussion', 'Author Talks', 'Reading Groups', 'Tea & Snacks'],
 (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society = 'Plak Rounds' LIMIT 1));

-- Sample community events for other societies (if exist)
INSERT INTO community_events (title, category, description, max_participants, current_participants, date, time, location, status, highlights, society_id, host_id) VALUES
('Community Cleanup Drive', '🌱 Environment', 'Join hands to keep our society clean and green.', 100, 75, '2024-12-28', '08:00:00', 'Society Main Gate', 'Registration Open',
 ARRAY['Cleanup Activities', 'Tree Planting', 'Awareness Campaign', 'Refreshments'],
 (SELECT id FROM societies WHERE name != 'Ajnara' AND name != 'Plak Rounds' LIMIT 1),
 (SELECT id FROM user_profiles WHERE society != 'Ajnara' AND society != 'Plak Rounds' LIMIT 1));

-- Add some sample participants to demonstrate functionality
-- Note: These will only work if you have actual user_profiles in your database
-- You may need to adjust the user IDs based on your actual data

-- Sample tournament participants for Ajnara Basketball Championship
INSERT INTO tournament_participants (tournament_id, user_id) 
SELECT 
    (SELECT id FROM tournaments WHERE title = 'Basketball Championship' AND society_id = (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1) LIMIT 1),
    id
FROM user_profiles 
WHERE society = 'Ajnara' 
LIMIT 24;

-- Sample tournament participants for Plak Rounds Football League
INSERT INTO tournament_participants (tournament_id, user_id) 
SELECT 
    (SELECT id FROM tournaments WHERE title = 'Football Premier League' AND society_id = (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1) LIMIT 1),
    id
FROM user_profiles 
WHERE society = 'Plak Rounds' 
LIMIT 38;

-- Sample community event participants for Ajnara Diwali Night
INSERT INTO community_event_participants (event_id, user_id) 
SELECT 
    (SELECT id FROM community_events WHERE title = 'Diwali Cultural Night' AND society_id = (SELECT id FROM societies WHERE name = 'Ajnara' LIMIT 1) LIMIT 1),
    id
FROM user_profiles 
WHERE society = 'Ajnara' 
LIMIT 45;

-- Sample community event participants for Plak Rounds Christmas Carol Night
INSERT INTO community_event_participants (event_id, user_id) 
SELECT 
    (SELECT id FROM community_events WHERE title = 'Christmas Carol Night' AND society_id = (SELECT id FROM societies WHERE name = 'Plak Rounds' LIMIT 1) LIMIT 1),
    id
FROM user_profiles 
WHERE society = 'Plak Rounds' 
LIMIT 65;

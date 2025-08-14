# Database Setup for Tournaments and Community Events

## Overview
This guide provides the SQL scripts needed to set up the database tables for the tournaments and community events functionality in your Tangle app.

## 🔒 **CRITICAL: Society Isolation**
**Tournaments and events are completely isolated by society.** Users from one society cannot see or access tournaments/events from other societies. This is enforced at multiple levels:

1. **Database Level**: Each record has a `society_id` field
2. **Service Level**: All queries filter by the user's society
3. **RLS Level**: Row Level Security policies restrict access
4. **Frontend Level**: Only shows data from the user's society

## Prerequisites
- Access to your Supabase database
- Basic knowledge of SQL
- The database should already have the basic tables (user_profiles, societies, etc.)

## Step 1: Create the Database Tables

Run the following SQL script in your Supabase SQL editor:

```sql
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
```

## Step 2: Create Indexes for Performance

```sql
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournaments_society_id ON tournaments(society_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_date ON tournaments(date);
CREATE INDEX IF NOT EXISTS idx_community_events_society_id ON community_events(society_id);
CREATE INDEX IF NOT EXISTS idx_community_events_status ON community_events(status);
CREATE INDEX IF NOT EXISTS idx_community_events_date ON community_events(date);
```

## Step 3: Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_event_participants ENABLE ROW LEVEL SECURITY;
```

## Step 4: Create RLS Policies

### Tournaments Policies
```sql
-- Tournaments are viewable by everyone
CREATE POLICY "Tournaments are viewable by everyone" ON tournaments
    FOR SELECT USING (true);

-- Users can create tournaments in their society
CREATE POLICY "Users can create tournaments in their society" ON tournaments
    FOR INSERT WITH CHECK (
        society_id IN (
            SELECT society_id FROM user_profiles 
            WHERE id = auth.uid() AND society_id IS NOT NULL
        )
    );

-- Users can update tournaments they host
CREATE POLICY "Users can update tournaments they host" ON tournaments
    FOR UPDATE USING (host_id = auth.uid());

-- Users can delete tournaments they host
CREATE POLICY "Users can delete tournaments they host" ON tournaments
    FOR DELETE USING (host_id = auth.uid());
```

### Community Events Policies
```sql
-- Community events are viewable by everyone
CREATE POLICY "Community events are viewable by everyone" ON community_events
    FOR SELECT USING (true);

-- Users can create events in their society
CREATE POLICY "Users can create events in their society" ON community_events
    FOR INSERT WITH CHECK (
        society_id IN (
            SELECT society_id FROM user_profiles 
            WHERE id = auth.uid() AND society_id IS NOT NULL
        )
    );

-- Users can update events they host
CREATE POLICY "Users can update events they host" ON community_events
    FOR UPDATE USING (host_id = auth.uid());

-- Users can delete events they host
CREATE POLICY "Users can delete events they host" ON community_events
    FOR DELETE USING (host_id = auth.uid());
```

### Participants Policies
```sql
-- Tournament participants are viewable by everyone
CREATE POLICY "Tournament participants are viewable by everyone" ON tournament_participants
    FOR SELECT USING (true);

-- Users can join tournaments
CREATE POLICY "Users can join tournaments" ON tournament_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can leave tournaments
CREATE POLICY "Users can leave tournaments" ON tournament_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Community event participants are viewable by everyone
CREATE POLICY "Community event participants are viewable by everyone" ON community_event_participants
    FOR SELECT USING (true);

-- Users can join events
CREATE POLICY "Users can join events" ON community_event_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can leave events
CREATE POLICY "Users can leave events" ON community_event_participants
    FOR DELETE USING (auth.uid() = user_id);
```

## Step 5: Insert Comprehensive Sample Data

The setup script includes extensive sample data for multiple societies:

### **Ajnara Society**
- **Tournaments**: Basketball Championship, Badminton League, Cricket T20, Table Tennis
- **Events**: Diwali Cultural Night, New Year's Eve Party, Health Workshop, Art Exhibition

### **Plak Rounds Society**
- **Tournaments**: Football Premier League, Tennis Championship, Swimming Competition
- **Events**: Christmas Carol Night, Tech Talk Series, Book Club Meeting

### **Other Societies**
- **Tournaments**: Volleyball Tournament
- **Events**: Community Cleanup Drive

This demonstrates that **each society has completely separate data** and users can only see their own society's tournaments and events.

## Step 6: Verify Society Isolation

After setup, run the test script `TEST_SOCIETY_ISOLATION.sql` to verify:

1. ✅ **Data Isolation**: Each society only sees their own tournaments/events
2. ✅ **Participant Counts**: Accurate participant tracking per society
3. ✅ **RLS Policies**: Users can only access their society's data
4. ✅ **Foreign Keys**: Proper referential integrity
5. ✅ **Unique Constraints**: No duplicate participants

## Step 7: Test the Frontend

1. **Login as a user from Ajnara society** → Should only see Ajnara tournaments/events
2. **Login as a user from Plak Rounds society** → Should only see Plak Rounds tournaments/events
3. **Try to access other society's data** → Should be blocked by RLS policies

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Make sure you're running the scripts as a database owner or have the necessary permissions.

2. **Foreign Key Errors**: Ensure that the referenced tables (societies, user_profiles) exist and have data.

3. **RLS Policy Errors**: Check that the user_profiles table has the correct structure and that society_id exists.

4. **UUID Extension**: If you get errors about gen_random_uuid(), run this first:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

5. **Society Isolation Not Working**: Verify that:
   - RLS is enabled on all tables
   - All policies are created correctly
   - User profiles have correct society_id values
   - Frontend is filtering by society correctly

## Production Notes

- Remove all sample data before going to production
- Consider adding additional indexes based on your query patterns
- Monitor RLS performance and adjust policies if needed
- Set up proper backup and recovery procedures
- **Verify society isolation is working** before going live

## Security Features

- 🔒 **Complete Society Isolation**: Users cannot see other societies' data
- 🔒 **Row Level Security**: Database-level access control
- 🔒 **User Authentication**: Only authenticated users can access data
- 🔒 **Host Verification**: Users can only modify tournaments/events they host
- 🔒 **Participant Management**: Users can only join/leave as themselves

## Support

If you encounter any issues during setup, check the Supabase logs and ensure all prerequisites are met. The tables are designed to work with the existing Tangle app structure and provide complete society isolation.

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDIwMjkwOCwiZXhwIjoyMDY5Nzc4OTA4fQ.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createMissingTables() {
  console.log('🔧 Creating missing tables...');

  try {
    // Create states table
    console.log('🗺️ Creating states table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS states (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          code VARCHAR(10) UNIQUE,
          country VARCHAR(100) DEFAULT 'India',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create tournament_participants table
    console.log('🏆 Creating tournament_participants table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS tournament_participants (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          team_name VARCHAR(255),
          status VARCHAR(20) DEFAULT 'registered',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(tournament_id, user_id)
        );
      `
    });

    // Add default states
    console.log('🏛️ Adding default states...');
    await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO states (name, code) VALUES
        ('Delhi', 'DL'),
        ('Mumbai', 'MH'),
        ('Bangalore', 'KA'),
        ('Noida', 'UP'),
        ('Gurgaon', 'HR'),
        ('Pune', 'MH'),
        ('Hyderabad', 'TS'),
        ('Chennai', 'TN'),
        ('Kolkata', 'WB'),
        ('Ahmedabad', 'GJ')
        ON CONFLICT (name) DO NOTHING;
      `
    });

    // Update societies to reference states
    console.log('🏢 Updating societies with state references...');
    const { data: states } = await supabase
      .from('states')
      .select('id, name')
      .in('name', ['Delhi', 'Mumbai', 'Bangalore', 'Noida', 'Gurgaon']);

    if (states && states.length > 0) {
      const stateMap = {};
      states.forEach(state => {
        stateMap[state.name] = state.id;
      });

      // Update existing societies to have state_id
      if (stateMap['Noida']) {
        await supabase.rpc('exec_sql', {
          sql: `
            UPDATE societies 
            SET state_id = '${stateMap['Noida']}' 
            WHERE name IN ('Eldeco Utopia', 'Palm Greens', 'Supertech Ecovillage', 'Jaypee Greens')
            AND state_id IS NULL;
          `
        });
      }

      if (stateMap['Gurgaon']) {
        await supabase.rpc('exec_sql', {
          sql: `
            UPDATE societies 
            SET state_id = '${stateMap['Gurgaon']}' 
            WHERE name IN ('DLF Phase 1', 'Suncity Township', 'Palm Springs')
            AND state_id IS NULL;
          `
        });
      }
    }

    console.log('✅ Missing tables created successfully!');

  } catch (error) {
    console.error('❌ Error creating missing tables:', error);
  }
}

createMissingTables(); 
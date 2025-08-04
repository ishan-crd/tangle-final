const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixSocieties() {
  try {
    console.log('🔧 Fixing societies and database structure...');
    
    // First, let's check what societies exist
    const { data: existingSocieties, error: societiesError } = await supabase
      .from('societies')
      .select('*');
    
    if (societiesError) {
      console.log('❌ Error accessing societies:', societiesError.message);
      return;
    }
    
    console.log('📋 Existing societies:', existingSocieties?.length || 0);
    
    // Create Eldeco Utopia society
    console.log('📋 Creating Eldeco Utopia society...');
    const { data: eldecoSociety, error: eldecoError } = await supabase
      .from('societies')
      .insert([{
        name: 'Eldeco Utopia',
        description: 'Eldeco Utopia Society',
        address: 'Noida, Uttar Pradesh',
        member_count: 0,
        is_active: true
      }])
      .select()
      .single();
    
    if (eldecoError) {
      console.log('Eldeco society error:', eldecoError.message);
    } else {
      console.log('✅ Eldeco Utopia created with ID:', eldecoSociety.id);
    }

    // Get all societies
    const { data: allSocieties, error: allSocietiesError } = await supabase
      .from('societies')
      .select('*');
    
    if (allSocietiesError) {
      console.log('❌ Error getting societies:', allSocietiesError.message);
      return;
    }
    
    console.log('📊 All societies:');
    allSocieties?.forEach(society => {
      console.log(`   - ${society.name}: ${society.id}`);
    });

    // Get a user to create sample data
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      console.log('❌ No users found');
      return;
    }

    const userId = users[0].id;
    const eldecoSocietyId = eldecoSociety?.id || allSocieties?.find(s => s.name === 'Eldeco Utopia')?.id;
    const sampleSocietyId = allSocieties?.find(s => s.name === 'Sample Society')?.id;

    // Create sample posts for Eldeco Utopia
    if (eldecoSocietyId) {
      console.log('📋 Creating sample posts for Eldeco Utopia...');
      const { error: postsError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: userId,
            society_id: eldecoSocietyId,
            title: 'Basketball Game Tonight',
            content: 'Anyone up for basketball tonight at 7 PM?',
            post_type: 'general',
            is_announcement: false,
            is_pinned: false,
            likes_count: 3,
            comments_count: 1,
            is_active: true
          },
          {
            user_id: userId,
            society_id: eldecoSocietyId,
            title: 'Badminton Tournament',
            content: 'Planning a badminton tournament this weekend. Who\'s interested?',
            post_type: 'tournament',
            is_announcement: false,
            is_pinned: false,
            likes_count: 5,
            comments_count: 2,
            is_active: true
          }
        ]);
      
      if (postsError) {
        console.log('Posts error:', postsError.message);
      } else {
        console.log('✅ Sample posts created for Eldeco Utopia');
      }
    }

    // Create sports if they don't exist
    console.log('📋 Creating sports...');
    const { data: sportsData, error: sportsError } = await supabase
      .from('sports')
      .select('*');
    
    if (sportsError || !sportsData || sportsData.length === 0) {
      const { error: sportsInsertError } = await supabase
        .from('sports')
        .insert([
          { name: 'Basketball', description: 'Basketball games', icon: '🏀' },
          { name: 'Football', description: 'Football matches', icon: '⚽' },
          { name: 'Badminton', description: 'Badminton games', icon: '🏸' },
          { name: 'Cricket', description: 'Cricket matches', icon: '🏏' },
          { name: 'Tennis', description: 'Tennis games', icon: '🎾' }
        ]);
      
      if (sportsInsertError) {
        console.log('Sports insert error:', sportsInsertError.message);
      } else {
        console.log('✅ Sports created');
      }
    } else {
      console.log('✅ Sports already exist');
    }

    // Create sample match for Eldeco Utopia
    if (eldecoSocietyId) {
      console.log('📋 Creating sample match for Eldeco Utopia...');
      const { data: basketballSport } = await supabase
        .from('sports')
        .select('*')
        .eq('name', 'Basketball')
        .single();
      
      if (basketballSport) {
        const { error: matchError } = await supabase
          .from('matches')
          .insert([{
            title: 'Basketball Match',
            description: 'Casual basketball game',
            host_id: userId,
            society_id: eldecoSocietyId,
            sport_id: basketballSport.id,
            match_type: 'casual',
            max_participants: 10,
            venue: 'Society Basketball Court',
            scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration_minutes: 90,
            status: 'upcoming'
          }]);
        
        if (matchError) {
          console.log('Match error:', matchError.message);
        } else {
          console.log('✅ Sample match created for Eldeco Utopia');
        }
      }
    }

    console.log('🎉 Database setup completed!');
    console.log('📊 Summary:');
    console.log(`   - Eldeco Utopia ID: ${eldecoSocietyId}`);
    console.log(`   - Sample Society ID: ${sampleSocietyId}`);
    console.log(`   - User ID: ${userId}`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

fixSocieties(); 
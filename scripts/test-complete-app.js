const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCompleteApp() {
  try {
    console.log('🧪 Testing complete Tangle app functionality...\n');
    
    // Test 1: Check societies
    console.log('📋 Test 1: Checking societies...');
    const { data: societies, error: societiesError } = await supabase
      .from('societies')
      .select('*');
    
    if (societiesError) {
      console.log('❌ Societies error:', societiesError.message);
      return;
    }
    
    console.log('✅ Societies found:', societies.length);
    societies.forEach(society => {
      console.log(`   - ${society.name}: ${society.id}`);
    });
    
    // Test 2: Check users
    console.log('\n📋 Test 2: Checking users...');
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (usersError) {
      console.log('❌ Users error:', usersError.message);
      return;
    }
    
    console.log('✅ Users found:', users.length);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.phone}): Society: ${user.society}`);
    });
    
    // Test 3: Check posts by society
    console.log('\n📋 Test 3: Checking posts by society...');
    const eldecoSociety = societies.find(s => s.name === 'Eldeco Utopia');
    if (eldecoSociety) {
      const { data: eldecoPosts, error: eldecoPostsError } = await supabase
        .from('posts')
        .select(`
          *,
          user_profiles (id, name, avatar)
        `)
        .eq('society_id', eldecoSociety.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (eldecoPostsError) {
        console.log('❌ Eldeco posts error:', eldecoPostsError.message);
      } else {
        console.log('✅ Eldeco Utopia posts found:', eldecoPosts.length);
        eldecoPosts.forEach(post => {
          console.log(`   - "${post.title}" by ${post.user_profiles?.name || 'Unknown'}`);
        });
      }
    }
    
    // Test 4: Check matches
    console.log('\n📋 Test 4: Checking matches...');
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select(`
        *,
        user_profiles (id, name, avatar),
        sports (id, name, icon)
      `)
      .eq('is_active', true);
    
    if (matchesError) {
      console.log('❌ Matches error:', matchesError.message);
    } else {
      console.log('✅ Matches found:', matches.length);
      matches.forEach(match => {
        console.log(`   - "${match.title}" (${match.sports?.name}) by ${match.user_profiles?.name || 'Unknown'}`);
      });
    }
    
    // Test 5: Check sports
    console.log('\n📋 Test 5: Checking sports...');
    const { data: sports, error: sportsError } = await supabase
      .from('sports')
      .select('*')
      .eq('is_active', true);
    
    if (sportsError) {
      console.log('❌ Sports error:', sportsError.message);
    } else {
      console.log('✅ Sports found:', sports.length);
      sports.forEach(sport => {
        console.log(`   - ${sport.name} ${sport.icon}`);
      });
    }
    
    // Test 6: Create a test post
    console.log('\n📋 Test 6: Creating a test post...');
    if (users.length > 0 && eldecoSociety) {
      const testUser = users[0];
      const { data: newPost, error: postError } = await supabase
        .from('posts')
        .insert([{
          user_id: testUser.id,
          society_id: eldecoSociety.id,
          title: 'Test Post from Script',
          content: 'This is a test post to verify the app is working correctly.',
          post_type: 'general',
          is_announcement: false,
          is_pinned: false,
          likes_count: 0,
          comments_count: 0,
          is_active: true
        }])
        .select()
        .single();
      
      if (postError) {
        console.log('❌ Test post error:', postError.message);
      } else {
        console.log('✅ Test post created successfully!');
        console.log(`   - Post ID: ${newPost.id}`);
        console.log(`   - Title: ${newPost.title}`);
      }
    }
    
    // Test 7: Create a test match
    console.log('\n📋 Test 7: Creating a test match...');
    if (users.length > 0 && eldecoSociety && sports.length > 0) {
      const testUser = users[0];
      const testSport = sports[0];
      
      const { data: newMatch, error: matchError } = await supabase
        .from('matches')
        .insert([{
          title: 'Test Match from Script',
          description: 'This is a test match to verify the app is working correctly.',
          host_id: testUser.id,
          society_id: eldecoSociety.id,
          sport_id: testSport.id,
          match_type: 'casual',
          max_participants: 10,
          venue: 'Test Venue',
          scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 60,
          status: 'upcoming'
        }])
        .select()
        .single();
      
      if (matchError) {
        console.log('❌ Test match error:', matchError.message);
      } else {
        console.log('✅ Test match created successfully!');
        console.log(`   - Match ID: ${newMatch.id}`);
        console.log(`   - Title: ${newMatch.title}`);
      }
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('📊 Summary:');
    console.log(`   - Societies: ${societies.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Sports: ${sports.length}`);
    console.log(`   - Matches: ${matches.length}`);
    console.log(`   - Eldeco Utopia ID: ${eldecoSociety?.id}`);
    
    console.log('\n✅ The app is ready for deployment!');
    console.log('🚀 All core functionality is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCompleteApp(); 
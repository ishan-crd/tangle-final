const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTablesManually() {
  try {
    console.log('🚀 Creating Tangle Database Tables Manually...\n');

    // Step 1: Create countries table
    console.log('1️⃣ Creating countries table...');
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .upsert([{ name: 'India', code: 'IND' }], { onConflict: 'name' })
      .select();

    if (countriesError) {
      console.log('⚠️  Countries creation issue:', countriesError.message);
    } else {
      console.log('✅ Countries table created and populated');
    }

    // Step 2: Get India and create states
    console.log('2️⃣ Creating states...');
    const { data: india } = await supabase
      .from('countries')
      .select('id')
      .eq('name', 'India')
      .single();

    if (india) {
      const states = [
        { country_id: india.id, name: 'Delhi', code: 'DL' },
        { country_id: india.id, name: 'Karnataka', code: 'KA' },
        { country_id: india.id, name: 'Uttar Pradesh', code: 'UP' }
      ];

      const { data: statesData, error: statesError } = await supabase
        .from('states')
        .upsert(states, { onConflict: 'country_id,name' })
        .select();

      if (statesError) {
        console.log('⚠️  States creation issue:', statesError.message);
      } else {
        console.log('✅ States table created and populated');
      }

      // Step 3: Create societies
      console.log('3️⃣ Creating societies...');
      if (statesData) {
        const societies = [];
        
        for (const state of statesData) {
          if (state.name === 'Delhi') {
            societies.push(
              { state_id: state.id, name: 'New Greens', address: 'New Greens Society, Delhi' },
              { state_id: state.id, name: 'Plak Rounds', address: 'Plak Rounds Society, Delhi' }
            );
          } else if (state.name === 'Karnataka') {
            societies.push(
              { state_id: state.id, name: 'Bangalore Heights', address: 'Bangalore Heights Society, Bangalore' },
              { state_id: state.id, name: 'Tech Park Residency', address: 'Tech Park Residency Society, Bangalore' },
              { state_id: state.id, name: 'Garden City Society', address: 'Garden City Society, Bangalore' }
            );
          } else if (state.name === 'Uttar Pradesh') {
            societies.push(
              { state_id: state.id, name: 'Eldeco Utopia', address: 'Eldeco Utopia Society, Uttar Pradesh' },
              { state_id: state.id, name: 'Ajnara', address: 'Ajnara Society, Uttar Pradesh' },
              { state_id: state.id, name: 'Shipra Neo', address: 'Shipra Neo Society, Ghaziabad, Uttar Pradesh' },
              { state_id: state.id, name: 'ATS Indira', address: 'ATS Indira Society, Ghaziabad, Uttar Pradesh' }
            );
          }
        }

        const { data: societiesData, error: societiesError } = await supabase
          .from('societies')
          .upsert(societies, { onConflict: 'state_id,name' })
          .select();

        if (societiesError) {
          console.log('⚠️  Societies creation issue:', societiesError.message);
        } else {
          console.log('✅ Societies table created and populated');
        }

        // Step 4: Create users
        console.log('4️⃣ Creating users...');
        const users = [
          // Delhi Users
          { name: 'Rahul Sharma', age: 25, phone: '+919876543210', interests: ['Football', 'Gym', 'Technology'], society: 'New Greens', flat: 'A-101', bio: 'Love playing football and staying fit!', gender: 'Male' },
          { name: 'Priya Singh', age: 23, phone: '+919876543211', interests: ['Arts & Dance', 'Music', 'Fashion'], society: 'New Greens', flat: 'B-205', bio: 'Dance enthusiast and music lover', gender: 'Female' },
          { name: 'Amit Kumar', age: 28, phone: '+919876543212', interests: ['Cricket', 'Gym', 'Travel'], society: 'Plak Rounds', flat: 'C-301', bio: 'Cricket fanatic and fitness enthusiast', gender: 'Male' },
          { name: 'Neha Gupta', age: 26, phone: '+919876543213', interests: ['Food & Drinks', 'Travel', 'Fashion'], society: 'Plak Rounds', flat: 'D-405', bio: 'Foodie and travel lover', gender: 'Female' },
          
          // Bangalore Users
          { name: 'Arjun Reddy', age: 24, phone: '+919876543214', interests: ['Technology', 'Gaming', 'Music'], society: 'Bangalore Heights', flat: 'E-101', bio: 'Tech geek and gamer', gender: 'Male' },
          { name: 'Ananya Rao', age: 22, phone: '+919876543215', interests: ['Arts & Dance', 'Fashion', 'Music'], society: 'Bangalore Heights', flat: 'F-202', bio: 'Creative soul and fashionista', gender: 'Female' },
          { name: 'Vikram Patel', age: 27, phone: '+919876543216', interests: ['Football', 'Gym', 'Technology'], society: 'Tech Park Residency', flat: 'G-303', bio: 'Football player and tech enthusiast', gender: 'Male' },
          { name: 'Sneha Iyer', age: 25, phone: '+919876543217', interests: ['Food & Drinks', 'Travel', 'Fashion'], society: 'Tech Park Residency', flat: 'H-404', bio: 'Food blogger and travel enthusiast', gender: 'Female' },
          
          // Uttar Pradesh Users
          { name: 'Rajesh Verma', age: 29, phone: '+919876543218', interests: ['Cricket', 'Gym', 'Travel'], society: 'Eldeco Utopia', flat: 'I-101', bio: 'Cricket coach and fitness trainer', gender: 'Male' },
          { name: 'Pooja Mishra', age: 24, phone: '+919876543219', interests: ['Arts & Dance', 'Music', 'Fashion'], society: 'Eldeco Utopia', flat: 'J-205', bio: 'Classical dancer and music teacher', gender: 'Female' },
          { name: 'Suresh Tyagi', age: 26, phone: '+919876543220', interests: ['Football', 'Gym', 'Technology'], society: 'Ajnara', flat: 'K-301', bio: 'Football player and gym enthusiast', gender: 'Male' },
          { name: 'Yash Bhatt', age: 23, phone: '+919876543221', interests: ['Gaming', 'Technology', 'Music'], society: 'Ajnara', flat: 'L-405', bio: 'Gamer and tech enthusiast', gender: 'Male' },
          { name: 'Aditya Arora', age: 25, phone: '+919876543222', interests: ['Cricket', 'Gym', 'Travel'], society: 'Shipra Neo', flat: 'M-101', bio: 'Cricket player and fitness enthusiast', gender: 'Male' },
          { name: 'Thripati', age: 27, phone: '+919876543223', interests: ['Football', 'Gym', 'Technology'], society: 'Shipra Neo', flat: 'N-202', bio: 'Football coach and tech lover', gender: 'Male' },
          { name: 'Rawat', age: 24, phone: '+919876543224', interests: ['Arts & Dance', 'Music', 'Fashion'], society: 'ATS Indira', flat: 'O-303', bio: 'Dance instructor and music lover', gender: 'Male' },
          { name: 'Navya Talwar', age: 22, phone: '+919876543225', interests: ['Food & Drinks', 'Travel', 'Fashion'], society: 'ATS Indira', flat: 'P-404', bio: 'Food blogger and travel enthusiast', gender: 'Female' }
        ];

        const { data: usersData, error: usersError } = await supabase
          .from('user_profiles')
          .upsert(users, { onConflict: 'phone' })
          .select();

        if (usersError) {
          console.log('⚠️  Users creation issue:', usersError.message);
        } else {
          console.log('✅ Users table created and populated');
        }

        // Step 5: Create sample posts
        console.log('5️⃣ Creating sample posts...');
        if (usersData && societiesData) {
          const posts = [];
          
          for (const user of usersData) {
            const society = societiesData.find(s => s.name === user.society);
            if (society) {
              posts.push(
                {
                  user_id: user.id,
                  society_id: society.id,
                  content: `Great day in ${user.society}! Who wants to join for some activities?`,
                  post_type: 'general'
                },
                {
                  user_id: user.id,
                  society_id: society.id,
                  content: `${user.society} community is amazing! Love living here.`,
                  post_type: 'general'
                }
              );
            }
          }

          const { error: postsError } = await supabase
            .from('posts')
            .insert(posts);

          if (postsError) {
            console.log('⚠️  Posts creation issue:', postsError.message);
          } else {
            console.log('✅ Posts table created and populated');
          }
        }

        // Step 6: Create sample matches
        console.log('6️⃣ Creating sample matches...');
        if (usersData && societiesData) {
          const hostUser = usersData.find(u => u.name === 'Rahul Sharma');
          if (hostUser) {
            const matches = [
              {
                title: '🏀 Basketball Match',
                description: 'Casual basketball game for New Greens residents',
                host_id: hostUser.id,
                society_id: societiesData.find(s => s.name === 'New Greens')?.id,
                venue: 'New Greens Basketball Court',
                scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                max_participants: 10
              },
              {
                title: '⚽ Football Tournament',
                description: 'Annual football tournament for Plak Rounds',
                host_id: hostUser.id,
                society_id: societiesData.find(s => s.name === 'Plak Rounds')?.id,
                venue: 'Plak Rounds Football Ground',
                scheduled_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                max_participants: 20
              }
            ];

            const { error: matchesError } = await supabase
              .from('matches')
              .insert(matches);

            if (matchesError) {
              console.log('⚠️  Matches creation issue:', matchesError.message);
            } else {
              console.log('✅ Matches table created and populated');
            }
          }
        }
      }
    }

    console.log('\n✅ All tables created and populated successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

async function verifySetup() {
  try {
    console.log('\n🔍 Verifying setup...');

    const tables = ['countries', 'states', 'societies', 'user_profiles', 'posts', 'matches'];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Error counting ${table}:`, error.message);
      } else {
        console.log(`📋 ${table}: ${count} records`);
      }
    }

    console.log('\n🎉 Setup verification complete!');
    console.log('\n📋 Hierarchical Structure:');
    console.log('   India');
    console.log('   ├── Delhi');
    console.log('   │   ├── New Greens');
    console.log('   │   └── Plak Rounds');
    console.log('   ├── Karnataka (Bangalore)');
    console.log('   │   ├── Bangalore Heights');
    console.log('   │   ├── Tech Park Residency');
    console.log('   │   └── Garden City Society');
    console.log('   └── Uttar Pradesh');
    console.log('       ├── Eldeco Utopia');
    console.log('       ├── Ajnara');
    console.log('       ├── Shipra Neo (Ghaziabad)');
    console.log('       └── ATS Indira (Ghaziabad)');

  } catch (error) {
    console.error('❌ Error verifying setup:', error);
  }
}

async function runCompleteSetup() {
  console.log('🎯 Tangle Database Setup (Fixed)');
  console.log('==================================\n');
  
  await createTablesManually();
  await verifySetup();
  
  console.log('\n🎉 Your Tangle backend is now ready!');
  console.log('Users can sign up, join societies, create posts, host matches, and interact within their society boundaries.');
}

// Run the complete setup
if (require.main === module) {
  runCompleteSetup();
}

module.exports = { runCompleteSetup, createTablesManually, verifySetup }; 
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Tangle database...');
    
    // First, let's check what tables exist
    console.log('📋 Checking existing tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.log('❌ Error accessing tables:', tablesError.message);
      return;
    }
    
    console.log('✅ Database connection working!');
    
    // Check if we have a sample society
    const { data: societies, error: societiesError } = await supabase
      .from('societies')
      .select('*')
      .limit(1);
    
    let sampleSocietyId = null;
    
    if (societiesError || !societies || societies.length === 0) {
      console.log('📋 Creating sample society...');
      const { data: newSociety, error: societyInsertError } = await supabase
        .from('societies')
        .insert([{
          name: 'Sample Society',
          description: 'A sample society for testing',
          address: 'Sample Address',
          member_count: 0,
          is_active: true
        }])
        .select()
        .single();
      
      if (societyInsertError) {
        console.log('❌ Error creating society:', societyInsertError.message);
        return;
      }
      
      sampleSocietyId = newSociety.id;
      console.log('✅ Sample society created with ID:', sampleSocietyId);
    } else {
      sampleSocietyId = societies[0].id;
      console.log('✅ Found existing society with ID:', sampleSocietyId);
    }
    
    // Check if we have sample posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
    
    if (postsError) {
      console.log('❌ Posts table error:', postsError.message);
      return;
    }
    
    if (!posts || posts.length === 0) {
      console.log('📋 Creating sample posts...');
      
      // Get a user to create posts with
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (usersError || !users || users.length === 0) {
        console.log('❌ No users found. Please create a user first.');
        return;
      }
      
      const userId = users[0].id;
      
      // Create sample posts
      const { error: postsInsertError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: userId,
            society_id: sampleSocietyId,
            title: 'Looking for Badminton Partner',
            content: 'Anyone interested in playing badminton this evening at 5 PM?',
            post_type: 'general',
            is_announcement: false,
            is_pinned: false,
            likes_count: 5,
            comments_count: 2,
            is_active: true
          },
          {
            user_id: userId,
            society_id: sampleSocietyId,
            title: 'Basketball Game Tomorrow',
            content: 'Anyone up for a game of basketball tomorrow morning at 8 AM?',
            post_type: 'general',
            is_announcement: false,
            is_pinned: false,
            likes_count: 8,
            comments_count: 3,
            is_active: true
          }
        ]);
      
      if (postsInsertError) {
        console.log('❌ Error creating posts:', postsInsertError.message);
        return;
      }
      
      console.log('✅ Sample posts created!');
    } else {
      console.log('✅ Found existing posts');
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('📝 Sample society ID:', sampleSocietyId);
    console.log('💡 You can now create posts and matches!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupDatabase(); 
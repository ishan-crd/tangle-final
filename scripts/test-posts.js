const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPosts() {
  try {
    console.log('🧪 Testing post functionality...');
    
    // Get a user
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    const userId = users[0].id;
    const societyId = "41b6b714-8085-4bdf-92f4-8d14dbac5335";
    
    console.log('✅ Found user:', users[0].name);
    console.log('✅ Using society ID:', societyId);
    
    // Test creating a post
    console.log('📝 Creating test post...');
    const { data: newPost, error: createError } = await supabase
      .from('posts')
      .insert([{
        user_id: userId,
        society_id: societyId,
        title: 'Test Post from Script',
        content: 'This is a test post created by the script to verify functionality.',
        post_type: 'general',
        is_announcement: false,
        is_pinned: false,
        likes_count: 0,
        comments_count: 0,
        is_active: true
      }])
      .select()
      .single();
    
    if (createError) {
      console.log('❌ Error creating post:', createError.message);
      return;
    }
    
    console.log('✅ Post created successfully!');
    console.log('📄 Post ID:', newPost.id);
    console.log('📄 Post title:', newPost.title);
    
    // Test retrieving posts
    console.log('📋 Retrieving posts...');
    const { data: posts, error: retrieveError } = await supabase
      .from('posts')
      .select(`
        *,
        user_profiles (id, name, avatar)
      `)
      .eq('society_id', societyId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (retrieveError) {
      console.log('❌ Error retrieving posts:', retrieveError.message);
      return;
    }
    
    console.log('✅ Posts retrieved successfully!');
    console.log('📊 Total posts found:', posts.length);
    
    posts.forEach((post, index) => {
      console.log(`\n📄 Post ${index + 1}:`);
      console.log(`   Title: ${post.title || 'No title'}`);
      console.log(`   Content: ${post.content.substring(0, 50)}...`);
      console.log(`   Author: ${post.user_profiles?.name || 'Unknown'}`);
      console.log(`   Created: ${new Date(post.created_at).toLocaleString()}`);
    });
    
    console.log('\n🎉 All tests passed! Posts are working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPosts(); 
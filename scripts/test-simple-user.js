const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSimpleUser() {
  console.log('🧪 Testing simple user creation...');

  try {
    // Test 1: Create a basic user profile
    console.log('📝 Test 1: Creating basic user profile...');
    const testUser = {
      name: "Simple Test User",
      age: 25,
      phone: "+919999999997",
      interests: [],
      address: "",
      society: "Eldeco Utopia",
      flat: "",
      avatar: "",
      bio: "",
      gender: ""
    };

    const { data: newUser, error: createError } = await supabase
      .from('user_profiles')
      .insert([testUser])
      .select()
      .single();

    if (createError) {
      console.log('❌ Test 1 failed:', createError.message);
      return;
    }

    console.log('✅ Test 1 passed: User created successfully');
    console.log('📄 User ID:', newUser.id);
    console.log('👤 User name:', newUser.name);
    console.log('📱 Phone:', newUser.phone);
    console.log('🏘️ Society:', newUser.society);

    // Test 2: Create a post
    console.log('📝 Test 2: Creating a post...');
    
    // Get a society ID
    const { data: societies } = await supabase
      .from('societies')
      .select('*')
      .eq('name', 'Eldeco Utopia')
      .single();

    if (!societies) {
      console.log('❌ Test 2 failed: Could not find Eldeco Utopia society');
      return;
    }

    const testPost = {
      user_id: newUser.id,
      society_id: societies.id,
      title: "Test Post",
      content: "This is a test post to verify the new schema works!",
      post_type: "general",
      is_announcement: false,
      is_pinned: false,
      likes_count: 0,
      comments_count: 0
    };

    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert([testPost])
      .select()
      .single();

    if (postError) {
      console.log('❌ Test 2 failed:', postError.message);
      return;
    }

    console.log('✅ Test 2 passed: Post created successfully');
    console.log('📄 Post ID:', newPost.id);

    // Test 3: Fetch posts for the society
    console.log('📝 Test 3: Fetching posts for society...');
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select(`
        *,
        user_profiles!inner(name, avatar)
      `)
      .eq('society_id', societies.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.log('❌ Test 3 failed:', fetchError.message);
      return;
    }

    console.log('✅ Test 3 passed: Posts fetched successfully');
    console.log('📊 Number of posts:', posts.length);

    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await supabase.from('posts').delete().eq('id', newPost.id);
    await supabase.from('user_profiles').delete().eq('id', newUser.id);

    console.log('✅ All tests passed! User creation and post creation work correctly.');
    console.log('');
    console.log('🎉 Summary:');
    console.log('   ✅ User creation works');
    console.log('   ✅ Post creation works');
    console.log('   ✅ Post fetching works');
    console.log('   ✅ Foreign key relationships work');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testSimpleUser(); 
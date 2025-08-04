import { useEffect, useState } from "react";
import {
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useUser } from "../../../contexts/UserContext";
import { Post, postService } from "../../../lib/supabase";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    try {
      const postsData = await postService.getPostsBySocietyName('', '');
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.username}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getFirstName(user?.name || 'User').charAt(0)}
                </Text>
              </View>
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeSmall}>Welcome back,</Text>
              <Text style={styles.username}>{getFirstName(user?.name || 'User')}</Text>
            </View>
          </View>
        </View>

        {/* Stories Section */}
        <View style={styles.storiesSection}>
          <View style={styles.storiesHeader}>
            <Text style={styles.storiesTitle}>Stories</Text>
            <View>
              <Text style={styles.seeAllText}>See All</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
            {/* Add Story */}
            <View style={styles.storyItem}>
              <View style={styles.addStoryCircle}>
                <Text style={styles.addStoryPlus}>+</Text>
              </View>
              <Text style={styles.storyLabel}>Add Story</Text>
            </View>
            
            {/* Story 1 */}
            <View style={styles.storyItem}>
              <View style={styles.storyCircle}>
                <Text style={styles.storyAvatar}>👨‍🦰</Text>
              </View>
              <Text style={styles.storyLabel}>Suresh Tyagi</Text>
            </View>
            
            {/* Story 2 */}
            <View style={styles.storyItem}>
              <View style={styles.storyCircle}>
                <Text style={styles.storyAvatar}>👨‍🦱</Text>
              </View>
              <Text style={styles.storyLabel}>Yash Bhatt</Text>
            </View>
            
            {/* Story 3 */}
            <View style={styles.storyItem}>
              <View style={styles.storyCircle}>
                <Text style={styles.storyAvatar}>👩‍🦱</Text>
              </View>
              <Text style={styles.storyLabel}>Aditya Arora</Text>
            </View>
          </ScrollView>
        </View>

        {/* Feed Section */}
        <View style={styles.feedSection}>
          <Text style={styles.feedTitle}>Feed</Text>
          
          {posts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📝</Text>
              <Text style={styles.emptyStateTitle}>No posts yet</Text>
              <Text style={styles.emptyStateText}>
                Be the first to share something with your society!
              </Text>
            </View>
          ) : (
            posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postAvatar}>
                    <Text style={styles.postAvatarText}>
                      {post.user_profiles?.name?.charAt(0) || 'U'}
                    </Text>
                  </View>
                  <View style={styles.postUserInfo}>
                    <Text style={styles.postUsername}>
                      {post.user_profiles?.name || 'Anonymous'}
                    </Text>
                    <Text style={styles.postTime}>
                      {formatDate(post.created_at)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.postContent}>
                  {post.content}
                </Text>
                
                {/* Match/Event Card if it's a match post */}
                {post.post_type === 'match' && (
                  <View style={styles.eventCard}>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>
                        {post.title?.replace('🏀 ', '') || 'Match'}
                      </Text>
                      <Text style={styles.eventTime}>
                        Today at 5:00 PM
                      </Text>
                    </View>
                    <View style={styles.joinButton}>
                      <Text style={styles.joinButtonText}>Join</Text>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  
  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3575EC",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  welcomeText: {
    flexDirection: "column",
  },
  welcomeSmall: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Montserrat-Light",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "Montserrat-Bold",
  },
  
  // Stories Styles
  storiesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  storiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  storiesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "Neue-Plak-Extended-Bold",
  },
  seeAllText: {
    fontSize: 14,
    color: "#3575EC",
    fontFamily: "Montserrat-SemiBold",
  },
  storiesContainer: {
    flexDirection: "row",
  },
  storyItem: {
    alignItems: "center",
    marginRight: 20,
  },
  addStoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  addStoryPlus: {
    fontSize: 24,
    color: "#666666",
  },
  storyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  storyAvatar: {
    fontSize: 24,
  },
  storyLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    fontFamily: "Montserrat-SemiBold",
  },
  
  // Feed Styles
  feedSection: {
    paddingHorizontal: 20,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    fontFamily: "Neue-Plak-Extended-Bold",
  },
  postCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3575EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  postAvatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  postUserInfo: {
    flex: 1,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "Montserrat-Bold",
  },
  postTime: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Montserrat-Light",
  },
  postContent: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },
  eventCard: {
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 4,
    fontFamily: "Montserrat-Bold",
  },
  eventTime: {
    fontSize: 14,
    color: "#1976D2",
    fontFamily: "Montserrat-Light",
  },
  joinButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Montserrat-SemiBold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
}); 
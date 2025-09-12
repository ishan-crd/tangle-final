import { createClient } from '@supabase/supabase-js';
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SvgXml } from 'react-native-svg';
import { useUser } from "../../../contexts/UserContext";
import { ensureEmojiXmlLoaded, getEmojiXmlFromKey } from "../../../lib/avatar";
import { Post } from "../../../lib/supabase";

const supabase = createClient('https://lrqrxyqrmwrbsxgiyuio.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4');

const bestFriends = [
  { name: "Navya Talwar", distance: "<1 km", emojiIndex: 0 },
  { name: "Yash Bhati", distance: "2 km", emojiIndex: 1 },
  { name: "Thripati", distance: "1 km", emojiIndex: 2 },
  { name: "Rawat", distance: "—", emojiIndex: 3 },
];

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState("Connections");
  
  useEffect(() => { ensureEmojiXmlLoaded(); }, []);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [societyUsers, setSocietyUsers] = useState<Array<{ id: string; name: string; avatar?: string }>>([]);
  const [addingFriend, setAddingFriend] = useState<Set<string>>(new Set());
  const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());
  const [existingFriendIds, setExistingFriendIds] = useState<Set<string>>(new Set());
  const [postsCount, setPostsCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);

  useEffect(() => {
    if (activeTab === "Posts" && user?.id) {
      loadUserPosts();
    }
  }, [activeTab, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    fetchCounts();
  }, [user?.id]);

  useEffect(() => {
    fetchSocietyUsers();
    fetchExistingFriends();
  }, [user?.society_id, user?.society, user?.id]);

  const fetchExistingFriends = async () => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('friendships')
        .select('user_id, friend_id, status')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id})`);
      if (error) throw error;
      const ids = new Set<string>();
      (data || []).forEach((f: any) => {
        if (f.status === 'accepted' || f.status === 'pending') {
          const other = f.user_id === user.id ? f.friend_id : f.user_id;
          ids.add(other);
        }
      });
      setExistingFriendIds(ids);
    } catch (e) {
      console.error('Error fetching existing friends:', e);
    }
  };

  const fetchSocietyUsers = async () => {
    try {
      if (!user) return;
      let query = supabase.from('user_profiles').select('id, name, avatar');
      if (user.society_id) query = query.eq('society_id', user.society_id);
      else if (user.society) query = query.eq('society', user.society);
      if (user.id) query = query.neq('id', user.id);
      const { data, error } = await query.order('name');
      if (error) throw error;
      setSocietyUsers(data || []);
    } catch (e) {
      console.error('Error fetching society users:', e);
      setSocietyUsers([]);
    }
  };

  const fetchCounts = async () => {
    try {
      // Posts count
      const { count: postCnt } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user!.id);
      setPostsCount(postCnt || 0);

      // Friends count (accepted friendships where user is either side)
      const { count: friendCnt } = await supabase
        .from('friendships')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .or(`user_id.eq.${user!.id},friend_id.eq.${user!.id}`);
      setFriendsCount(friendCnt || 0);
    } catch (e) {
      console.error('Error fetching profile counts:', e);
    }
  };

  const parseAvatarIndex = (avatar?: string) => {
    const match = (avatar || '').match(/emoji(\d+)/);
    const oneBased = match ? parseInt(match[1], 10) : 7;
    const zeroBased = ((oneBased - 1) % EMOJI_SVG_URIS.length + EMOJI_SVG_URIS.length) % EMOJI_SVG_URIS.length;
    return zeroBased;
  };

  const addFriend = async (friendId: string) => {
    if (!user?.id) return;
    try {
      setAddingFriend(prev => new Set(prev).add(friendId));
      const { error } = await supabase
        .from('friendships')
        .upsert({ user_id: user.id, friend_id: friendId, status: 'accepted' }, { onConflict: 'user_id,friend_id' });
      if (error) throw error;
      setAddedFriends(prev => new Set(prev).add(friendId));
      setFriendsCount(prev => prev + 1);
      setExistingFriendIds(prev => { const n = new Set(prev); n.add(friendId); return n; });
    } catch (e) {
      console.error('Error adding friend:', e);
    } finally {
      setAddingFriend(prev => { const n = new Set(prev); n.delete(friendId); return n; });
    }
  };

  const loadUserPosts = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingPosts(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user_profiles(name, avatar)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading user posts:', error);
        return;
      }
      
      setUserPosts(data || []);
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setLoadingPosts(false);
    }
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

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/");
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert("Error", "Failed to logout");
            }
          },
        },
      ]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Posts":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Your Posts</Text>
            {loadingPosts ? (
              <Text>Loading posts...</Text>
            ) : userPosts.length === 0 ? (
              <Text>No posts yet. Be the first to share!</Text>
            ) : (
              userPosts.map((post, index) => (
                <View key={index} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    {getEmojiXmlFromKey(user?.avatar) ? (
                      <SvgXml xml={getEmojiXmlFromKey(user?.avatar) as string} width={40} height={40} style={styles.postAvatar} />
                    ) : (
                      <View style={[styles.postAvatar, { backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: '700', color: '#666' }}>?</Text>
                      </View>
                    )}
                    <View>
                      <Text style={styles.postAuthor}>You</Text>
                      <Text style={styles.postTime}>{formatDate(post.created_at)}</Text>
                    </View>
                  </View>
                  <Text style={styles.postText}>{post.content}</Text>
                  {post.image_url && (
                    <View style={styles.postImageContainer}>
                      <Image 
                        source={{ uri: post.image_url }} 
                        style={styles.postImage}
                        contentFit="cover"
                        transition={200}
                      />
                    </View>
                  )}
                  <View style={styles.postStats}>
                    <Text style={styles.postStat}>❤️ {post.likes_count}</Text>
                    <Text style={styles.postStat}>💬 {post.comments_count}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      // Stories removed
      case "Connections":
        return (
          <View style={styles.tabContent}>
            <View style={styles.stats}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{friendsCount}</Text>
                <Text style={styles.statLabel}>Friends</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{postsCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>

            <View style={styles.bestFriendsHeader}>
              <Text style={styles.bestFriendsTitle}>Add to Friends</Text>
            </View>

            {societyUsers.filter(u => !existingFriendIds.has(u.id) && !addedFriends.has(u.id)).map((u) => (
              <View key={u.id} style={styles.friendCard}>
                <View style={styles.friendInfo}>
                  {getEmojiXmlFromKey(u.avatar) ? (
                    <SvgXml xml={getEmojiXmlFromKey(u.avatar) as string} width={50} height={50} style={styles.friendAvatar} />
                  ) : (
                    <View style={[styles.friendAvatar, { backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center' }]}>
                      <Text style={{ fontWeight: '700', color: '#666' }}>{(u.name || '?').charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.friendName}>{u.name}</Text>
                  </View>
                </View>

                <View style={styles.friendActions}>
                  <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#3575EC' }]} onPress={() => addFriend(u.id)} disabled={addingFriend.has(u.id) || addedFriends.has(u.id)}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                      {addingFriend.has(u.id) ? '…' : addedFriends.has(u.id) ? '✓' : '+'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Text style={styles.actionIcon}>🚪</Text>
          </TouchableOpacity>
          <View style={styles.actionButton}>
            <Text style={styles.actionIcon}>⋮</Text>
          </View>
        </View>

        {getEmojiXmlFromKey(user?.avatar) ? (
          <SvgXml xml={getEmojiXmlFromKey(user?.avatar) as string} width={120} height={120} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontWeight: '700', color: '#666' }}>{(user?.name || '?').charAt(0).toUpperCase()}</Text>
          </View>
        )}
        
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
          <Text style={styles.userAge}>{user?.age ? `${user.age} years old` : ""}</Text>
          <Text style={styles.userLocation}>
            {user?.society ? `${user.society}, Flat ${user.flat}` : ""}
          </Text>
          
          {/* Interests */}
          {user?.interests && user.interests.length > 0 && (
            <View style={styles.interestsContainer}>
              <Text style={styles.interestsTitle}>Interests:</Text>
              <View style={styles.interestsList}>
                {user.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        {["Posts", "Connections"].map((tab) => (
          <View
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onTouchEnd={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </View>
        ))}
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  profileHeader: {
    backgroundColor: "#E8F5E8",
    paddingTop: Platform.OS === "android" ? 20 : 20,
    paddingBottom: 30,
    alignItems: "center",
    position: "relative",
  },
  headerActions: {
    position: "absolute",
    top: Platform.OS === "android" ? 20 : 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 18,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  userAge: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 5,
  },
  userLocation: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 15,
  },
  interestsContainer: {
    alignItems: "center",
  },
  interestsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  interestsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  interestTag: {
    backgroundColor: "#FFE4E1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  interestText: {
    fontSize: 12,
    color: "#000000",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
  activeTab: {
    backgroundColor: "#FFF3B0",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "bold",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: 20,
    height: 3,
    backgroundColor: "#000000",
    borderRadius: 2,
  },
  tabContent: {
    padding: 20,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  bestFriendsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  bestFriendsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  groupAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -10,
  },
  moreAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF69B4",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
  },
  moreText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  friendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  friendDistance: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  friendActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE4E1",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  postTime: {
    fontSize: 12,
    color: "#666666",
  },
  postText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 15,
  },
  postImageContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  postStats: {
    flexDirection: "row",
    gap: 20,
  },
  postStat: {
    fontSize: 14,
    color: "#666666",
  },
  storiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  storyCard: {
    alignItems: "center",
    width: 80,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  storyPlus: {
    fontSize: 24,
    color: "#666666",
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  storyLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
});

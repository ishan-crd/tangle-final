import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useUser } from "../../contexts/UserContext";
import { Group, groupsService } from "../../lib/supabase";

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user: userProfile } = useUser();

  useEffect(() => {
    if (userProfile?.society) {
      fetchGroups();
    }
  }, [userProfile?.society]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userProfile?.society || !userProfile?.id) {
        setError("No society or user ID found for user");
        setLoading(false);
        return;
      }

      const data = await groupsService.getAllGroupsInSocietyByName(userProfile.society, userProfile.id);
      setGroups(data);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    router.push("/main/create-group-topic");
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      if (!userProfile?.id) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      await groupsService.addMemberToGroup(groupId, userProfile.id, 'member');
      Alert.alert("Success", "You've joined the group!");
      
      // Refresh the groups list
      fetchGroups();
    } catch (err) {
      console.error('Error joining group:', err);
      Alert.alert("Error", "Failed to join group. Please try again.");
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      if (!userProfile?.id) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      await groupsService.removeMemberFromGroup(groupId, userProfile.id);
      Alert.alert("Success", "You've left the group!");
      
      // Refresh the groups list
      fetchGroups();
    } catch (err) {
      console.error('Error leaving group:', err);
      Alert.alert("Error", "Failed to leave group. Please try again.");
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGroupCard = ({ item }: { item: Group }) => {
    const isMember = item.is_member;
    
    return (
      <TouchableOpacity 
        style={styles.groupCard}
        onPress={() => isMember ? 
          Alert.alert("Group Info", `You are a member of ${item.name}`) : 
          handleJoinGroup(item.id)
        }
      >
        {/* Group Avatar Cluster */}
        <View style={styles.avatarCluster}>
          {item.member_count && item.member_count > 0 ? (
            <>
              {/* Show up to 5 avatars */}
              {Array.from({ length: Math.min(5, item.member_count) }).map((_, index) => (
                <View key={index} style={[styles.groupAvatar, { marginLeft: index > 0 ? -8 : 0 }]}>
                  <Text style={styles.avatarText}>
                    {String.fromCharCode(65 + (index % 26))}
                  </Text>
                </View>
              ))}
              
              {/* Show +X if more than 5 members */}
              {item.member_count > 5 && (
                <View style={[styles.groupAvatar, styles.moreAvatar, { marginLeft: -8 }]}>
                  <Text style={styles.moreAvatarText}>+{item.member_count - 5}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.groupAvatar}>
              <Text style={styles.avatarText}>?</Text>
            </View>
          )}
        </View>

        {/* Group Info */}
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.memberCount}>
          {item.member_count || 0} member{item.member_count !== 1 ? 's' : ''}
        </Text>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            isMember ? styles.leaveButton : styles.joinButton
          ]}
          onPress={() => isMember ? handleLeaveGroup(item.id) : handleJoinGroup(item.id)}
        >
          <Text style={[
            styles.actionButtonText,
            isMember ? styles.leaveButtonText : styles.joinButtonText
          ]}>
            {isMember ? 'Leave' : 'Join'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchGroups}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Groups</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search in the web"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>You have no groups yet</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No groups match your search.' : 'Create your first group to get started!'}
            </Text>
          </View>
        ) : (
          <View style={styles.groupsGrid}>
            <FlatList
              data={filteredGroups}
              renderItem={renderGroupCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.groupRow}
            />
          </View>
        )}

        {/* Create Group Button */}
        <TouchableOpacity style={styles.createGroupButton} onPress={handleCreateGroup}>
          <Text style={styles.createGroupIcon}>+</Text>
          <Text style={styles.createGroupText}>Create Group</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#4CAF50",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Search Container
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: "#666",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    fontSize: 16,
    color: "#666",
  },

  // Groups Grid
  groupsGrid: {
    marginBottom: 30,
  },
  groupRow: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  groupCard: {
    width: "48%",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarCluster: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  groupAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  moreAvatar: {
    backgroundColor: "#FF69B4",
  },
  moreAvatarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  groupName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  memberCount: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 15,
    textAlign: "center",
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: "#4CAF50",
  },
  leaveButton: {
    backgroundColor: "#FF6B6B",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  joinButtonText: {
    color: "#FFFFFF",
  },
  leaveButtonText: {
    color: "#FFFFFF",
  },

  // Create Group Button
  createGroupButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 30,
    marginBottom: 30,
    alignSelf: "center",
  },
  createGroupIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginRight: 10,
  },
  createGroupText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },

  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../../contexts/UserContext";
import { groupsService, supabase } from "../../lib/supabase";

export default function CreateGroupReviewScreen() {
  const { topic, groupName, description, selectedMembers, isPrivate, icon, color } = useLocalSearchParams<{
    topic: string;
    groupName: string;
    description: string;
    selectedMembers: string;
    isPrivate?: string;
    icon?: string;
    color?: string;
  }>();
  const { user: userProfile } = useUser();
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchMemberNames();
  }, []);

  const fetchMemberNames = async () => {
    try {
      const memberIds = selectedMembers.split(",");
      const { data, error } = await supabase
        .from("user_profiles")
        .select("full_name")
        .in("id", memberIds);

      if (error) throw error;
      setMemberNames(data?.map(member => member.full_name) || []);
    } catch (error) {
      console.error("Error fetching member names:", error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      setCreating(true);
      
      // Create the group
      const groupData = {
        name: groupName,
        description: description,
        topic: topic,
        society_id: userProfile?.society_id!,
        created_by: userProfile?.id!,
        max_members: 50, // Default max members
        is_private: isPrivate === 'true',
        icon: icon || '📱',
        color: color || '#FFFFFF'
      };

      const group = await groupsService.createGroup(groupData);

      // Add selected members to the group
      const memberIds = selectedMembers.split(",");
      for (const memberId of memberIds) {
        await groupsService.addMemberToGroup(group.id, memberId, "member");
      }

      // Add creator as admin
      await groupsService.addMemberToGroup(group.id, userProfile?.id!, "admin");

      Alert.alert(
        "Group Created!",
        `${groupName} has been created successfully.`,
        [
          {
            text: "Go to Groups",
            onPress: () => router.push("/main/interest-circles")
          }
        ]
      );

    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert(
        "Error",
        "Failed to create group. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setCreating(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const getTopicIcon = (topicId: string) => {
    const topicIcons: { [key: string]: string } = {
      sports: "⚽",
      music: "🎤",
      dance: "💃",
      work: "💻",
      travel: "✈️",
      other: "😊",
    };
    return topicIcons[topicId] || "📱";
  };
  
  const getGroupStyleIcon = () => icon || getTopicIcon(topic);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressSegment} />
            <View style={styles.progressSegment} />
            <View style={styles.progressSegment} />
            <View style={styles.progressSegment} />
            <View style={styles.progressSegmentDashed} />
          </View>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>Review & Create</Text>
        <Text style={styles.subtitle}>
          Review your group details before creating
        </Text>
      </View>

      {/* Review Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Info Card */}
        <View style={styles.reviewCard}>
          <Text style={styles.cardTitle}>Group Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Topic:</Text>
            <View style={styles.topicDisplay}>
              <Text style={styles.topicIcon}>{getTopicIcon(topic)}</Text>
              <Text style={styles.topicText}>{topic.charAt(0).toUpperCase() + topic.slice(1)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{groupName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Description:</Text>
            <Text style={styles.infoValue}>{description}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Privacy:</Text>
            <Text style={styles.infoValue}>{isPrivate === 'true' ? 'Private' : 'Public'}</Text>
          </View>
        </View>

        {/* Members Card */}
        <View style={styles.reviewCard}>
          <Text style={styles.cardTitle}>Selected Members</Text>
          <Text style={styles.memberCount}>
            {memberNames.length} member{memberNames.length !== 1 ? 's' : ''}
          </Text>
          
          <View style={styles.membersList}>
            {memberNames.map((name, index) => (
              <View key={index} style={styles.memberItem}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitial}>
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.memberName}>{name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Society Info */}
        <View style={styles.reviewCard}>
          <Text style={styles.cardTitle}>Society</Text>
          <Text style={styles.infoValue}>{userProfile?.society}</Text>
        </View>

        {/* Style Preview */}
        <View style={styles.reviewCard}>
          <Text style={styles.cardTitle}>Group Style</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: color || '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>{icon || '📱'}</Text>
            </View>
            <Text style={styles.infoValue}>Icon and color will be shown with the group later.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.createButton, creating && styles.createButtonDisabled]}
          onPress={handleCreateGroup}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.createButtonText}>Create Group</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "bold",
  },
  progressContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressSegment: {
    width: 40,
    height: 4,
    backgroundColor: "#000000",
    borderRadius: 2,
  },
  progressSegmentDashed: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Review Cards
  reviewCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: "#000000",
    flex: 1,
  },
  topicDisplay: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  topicIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  topicText: {
    fontSize: 16,
    color: "#000000",
    textTransform: "capitalize",
  },
  memberCount: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 16,
  },
  membersList: {
    gap: 12,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  memberName: {
    fontSize: 16,
    color: "#000000",
  },

  // Button
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SvgXml } from 'react-native-svg';
import { useUser } from "../../contexts/UserContext";
import { ensureEmojiXmlLoaded, getEmojiXmlFromKey, isLikelyRemoteUri } from "../../lib/avatar";
import { supabase } from "../../lib/supabase";

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  interests?: string[];
  bio?: string;
}

export default function CreateGroupMembersScreen() {
  const { topic, groupName, description, isPrivate } = useLocalSearchParams<{
    topic: string;
    groupName: string;
    description: string;
    isPrivate?: string;
  }>();
  const { user: userProfile } = useUser();
  const [societyMembers, setSocietyMembers] = useState<UserProfile[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureEmojiXmlLoaded();
    fetchSocietyMembers();
  }, []);

  const fetchSocietyMembers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("user_profiles")
        .select("id, full_name:name, avatar_url:avatar, interests, bio");

      if (userProfile?.society_id) {
        query = query.eq("society_id", userProfile.society_id);
      } else if (userProfile?.society) {
        query = query.eq("society", userProfile.society);
      }

      if (userProfile?.id) {
        query = query.neq("id", userProfile.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSocietyMembers(data || []);
    } catch (error) {
      console.error("Error fetching society members:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleNext = () => {
    router.push({
      pathname: "/main/create-group-style",
      params: {
        topic,
        groupName,
        description,
        selectedMembers: Array.from(selectedMembers).join(","),
        isPrivate: isPrivate === "true" ? "true" : "false"
      }
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  const filteredMembers = societyMembers.filter(member =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMemberItem = ({ item }: { item: UserProfile }) => {
    const isSelected = selectedMembers.has(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.memberCard, isSelected && styles.memberCardSelected]}
        onPress={() => toggleMemberSelection(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.memberInfo}>
          <View style={styles.avatarContainer}>
            {isLikelyRemoteUri(item.avatar_url) ? (
              <Image source={{ uri: item.avatar_url as string }} style={styles.avatar} />
            ) : getEmojiXmlFromKey(item.avatar_url) ? (
              <SvgXml xml={getEmojiXmlFromKey(item.avatar_url) as string} width={48} height={48} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.defaultAvatarText}>
                  {item.full_name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.memberDetails}>
            <Text style={styles.memberName}>{item.full_name}</Text>
            {item.interests && item.interests.length > 0 && (
              <Text style={styles.memberInterests}>
                {item.interests.slice(0, 2).join(", ")}
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.selectBadge, isSelected && styles.selectBadgeSelected]}>
          {isSelected && <Text style={styles.selectBadgeText}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

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
            <View style={styles.progressSegmentDashed} />
            <View style={styles.progressSegmentDashed} />
            <View style={styles.progressSegmentDashed} />
          </View>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>Add members</Text>
        <Text style={styles.subtitle}>
          select or invite people who will participate in your chat room
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Connections Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Connections</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownIcon}>⌄</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading connections...</Text>
            </View>
          ) : (
            <View style={styles.membersList}>
              {filteredMembers.slice(0, 3).map((member) => {
                const isSelected = selectedMembers.has(member.id);
                return (
                  <View key={member.id} style={styles.memberCard}>
                    <View style={styles.memberInfo}>
                      <View style={styles.avatarContainer}>
                        {isLikelyRemoteUri(member.avatar_url) ? (
                          <Image source={{ uri: member.avatar_url as string }} style={styles.avatar} />
                        ) : getEmojiXmlFromKey(member.avatar_url) ? (
                          <SvgXml xml={getEmojiXmlFromKey(member.avatar_url) as string} width={48} height={48} />
                        ) : (
                          <View style={styles.defaultAvatar}>
                            <Text style={styles.defaultAvatarText}>
                              {member.full_name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.memberName}>{member.full_name}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.addButton, isSelected && styles.addButtonSelected]}
                      onPress={() => toggleMemberSelection(member.id)}
                    >
                      <Text style={styles.addButtonIcon}>{isSelected ? '✓' : '+'}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Recommendation Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommendation</Text>
            <Text style={styles.recommendationSubtitle}>(users who are into sports)</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownIcon}>⌄</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.membersList}>
            {filteredMembers.slice(3, 5).map((member) => {
              const isSelected = selectedMembers.has(member.id);
              return (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <View style={styles.avatarContainer}>
                      {isLikelyRemoteUri(member.avatar_url) ? (
                        <Image source={{ uri: member.avatar_url as string }} style={styles.avatar} />
                      ) : getEmojiXmlFromKey(member.avatar_url) ? (
                        <SvgXml xml={getEmojiXmlFromKey(member.avatar_url) as string} width={48} height={48} />
                      ) : (
                        <View style={styles.defaultAvatar}>
                          <Text style={styles.defaultAvatarText}>
                            {member.full_name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.memberName}>{member.full_name}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.addButton, isSelected && styles.addButtonSelected]}
                    onPress={() => toggleMemberSelection(member.id)}
                  >
                    <Text style={styles.addButtonIcon}>{isSelected ? '✓' : '+'}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              Next: Group Style
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 10 : 50,
    paddingBottom: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 10 : 50,
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

  // Sections
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  recommendationSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },
  dropdownButton: {
    padding: 4,
  },
  dropdownIcon: {
    fontSize: 20,
    color: "#666666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  membersList: {
    paddingBottom: 20,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  memberCardSelected: {
    borderColor: "#000000",
    backgroundColor: "#F7F7F7",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  defaultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultAvatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666666",
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  memberInterests: {
    fontSize: 14,
    color: "#666666",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonSelected: {
    backgroundColor: "#4CAF50",
  },
  addButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectBadgeSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  selectBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // Button
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },
  nextButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#87CEEB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  nextButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButtonTextDisabled: {
    color: "#999999",
  },
});

import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useUser } from "../../contexts/UserContext";
import { groupsService } from "../../lib/supabase";

const ICONS = [
  "⚽", "🎱", "🏀", "🎾", "🥎", "🎲", "♟️", "🏐", "🥏", "🏇", "😊"
];

const COLORS = [
  "#FFF6BF", "#DDE5DE", "#FBE0D6", "#E9E0FF", "#D7EEFF",
  "#D9FFF4", "#E3E0FF", "#D3F0A8", "#FFD69E", "#F3E3B0"
];

export default function CreateGroupStyleScreen() {
  const { topic, groupName, description, selectedMembers, isPrivate } = useLocalSearchParams<{
    topic: string;
    groupName: string;
    description: string;
    selectedMembers: string;
    isPrivate?: string;
  }>();

  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const { user: userProfile } = useUser();
  const [creating, setCreating] = useState(false);

  const handleNext = async () => {
    try {
      setCreating(true);
      const groupData = {
        name: groupName as string,
        description: description as string,
        topic: topic as string,
        society_id: userProfile?.society_id!,
        created_by: userProfile?.id!,
        max_members: 50,
        is_private: isPrivate === 'true',
        icon: selectedIcon,
        color: selectedColor
      } as any;

      const group = await groupsService.createGroup(groupData);

      // Add selected members
      const memberIds = (selectedMembers as string)?.length ? (selectedMembers as string).split(",") : [];
      for (const memberId of memberIds) {
        if (memberId) {
          await groupsService.addMemberToGroup(group.id, memberId, 'member');
        }
      }

      // Navigate to chat screen
      router.replace({
        pathname: "/main/group-chat/[groupId]",
        params: { groupId: group.id, groupName, icon: selectedIcon, color: selectedColor }
      });
    } catch (error) {
      console.error('Error creating group from style step:', error);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressSegment} />
            <View style={styles.progressSegment} />
            <View style={styles.progressSegment} />
            <View style={styles.progressSegmentDashed} />
            <View style={styles.progressSegmentDashed} />
          </View>
        </View>
        <Text style={styles.title}>Style your group</Text>
        <Text style={styles.subtitle}>Make it visually appealing and unique</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.previewCircle, { backgroundColor: selectedColor }]}> 
          <Text style={styles.previewIcon}>{selectedIcon}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Color palette</Text>
          <View style={styles.palette}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotSelected]}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Icon Selection</Text>
          <View style={styles.iconGrid}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[styles.iconButton, selectedIcon === icon && styles.iconButtonSelected]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.nextButton, creating && {opacity: 0.6}]} onPress={handleNext} disabled={creating}>
          {creating ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.nextButtonText}>Create Group</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, alignItems: "center" },
  backButton: { position: "absolute", top: 60, left: 20, padding: 8 },
  backButtonText: { fontSize: 24, color: "#000000", fontWeight: "bold" },
  progressContainer: { marginTop: 20, marginBottom: 20 },
  progressBar: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressSegment: { width: 40, height: 4, backgroundColor: "#000000", borderRadius: 2 },
  progressSegmentDashed: { width: 40, height: 4, backgroundColor: "#E0E0E0", borderRadius: 2, borderWidth: 1, borderColor: "#E0E0E0", borderStyle: "dashed" },
  title: { fontSize: 24, fontWeight: "bold", color: "#000000", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#666666", textAlign: "center", lineHeight: 22, paddingHorizontal: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  previewCircle: { width: 140, height: 140, borderRadius: 70, alignSelf: "center", justifyContent: "center", alignItems: "center", marginVertical: 10 },
  previewIcon: { fontSize: 110 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E0E0E0", marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#000000", marginBottom: 12 },
  palette: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: "#FFFFFF" },
  colorDotSelected: { borderColor: "#000000" },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  iconButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#F7F7F7", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E0E0E0" },
  iconButtonSelected: { borderColor: "#000000", backgroundColor: "#FFFFFF" },
  iconText: { fontSize: 36 },
  buttonContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  nextButton: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#87CEEB", borderRadius: 12, paddingVertical: 16, alignItems: "center" },
  nextButtonText: { color: "#000000", fontSize: 16, fontWeight: "600" }
});



import { router } from "expo-router";
import { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  backgroundColor: string;
}

const topics: Topic[] = [
  {
    id: "sports",
    name: "Sports",
    description: "Get Together and discuss your victories",
    icon: "⚽",
    backgroundColor: "#FFF9C4", // Light yellow
  },
  {
    id: "music",
    name: "Music",
    description: "Get Together and discuss your victories",
    icon: "🎤",
    backgroundColor: "#E1BEE7", // Light lavender
  },
  {
    id: "dance",
    name: "Dance",
    description: "Get Together and discuss your victories",
    icon: "💃",
    backgroundColor: "#C8E6C9", // Light green
  },
  {
    id: "work",
    name: "Work",
    description: "Get Together and discuss your victories",
    icon: "💻",
    backgroundColor: "#FFCCBC", // Light peach
  },
  {
    id: "travel",
    name: "Travel",
    description: "Get Together and discuss your victories",
    icon: "✈️",
    backgroundColor: "#B3E5FC", // Light sky blue
  },
  {
    id: "other",
    name: "Other",
    description: "Get Together and discuss your victories",
    icon: "😊",
    backgroundColor: "#F8BBD9", // Light pink
  },
];

export default function CreateGroupTopicScreen() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    // Navigate to next step after a brief delay to show selection
    setTimeout(() => {
      router.push({
        pathname: "/main/create-group-details",
        params: { topic: topicId }
      });
    }, 300);
  };

  const handleBackPress = () => {
    router.back();
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
            <View style={styles.progressSegmentDashed} />
            <View style={styles.progressSegmentDashed} />
            <View style={styles.progressSegmentDashed} />
            <View style={styles.progressSegmentDashed} />
            <View style={styles.progressSegmentDashed} />
          </View>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>Select Room Topic</Text>
        <Text style={styles.subtitle}>
          Select a topic for your group to categorize collection
        </Text>
      </View>

      {/* Topic Cards */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={[
              styles.topicCard,
              { backgroundColor: topic.backgroundColor },
              selectedTopic === topic.id && styles.selectedTopicCard
            ]}
            onPress={() => handleTopicSelect(topic.id)}
            activeOpacity={0.8}
          >
            <View style={styles.topicContent}>
              <View style={styles.topicInfo}>
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
              <Text style={styles.topicIcon}>{topic.icon}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    paddingTop: Platform.OS === "android" ? 20 : 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 20 : 20,
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
    marginBottom: 30,
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

  // Topic Cards
  topicCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTopicCard: {
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  topicContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  topicIcon: {
    fontSize: 32,
    marginLeft: 20,
  },
});

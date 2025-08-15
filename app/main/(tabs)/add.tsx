import { useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useUser } from "../../../contexts/UserContext";
import { matchService, postService } from "../../../lib/supabase";

const { width, height } = Dimensions.get("window");

export default function AddScreen() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  // Match creation states
  const [matchTitle, setMatchTitle] = useState("");
  const [matchDescription, setMatchDescription] = useState("");
  const [matchVenue, setMatchVenue] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowModal(true);
  };

  const getSocietyId = async () => {
    return user?.society_id || null;
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert("Error", "Please write something to post");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "Please log in to create posts");
      return;
    }

    setIsPosting(true);
    try {
      const societyId = await getSocietyId();
      if (!societyId) {
        Alert.alert("Error", "Please complete your profile to create posts");
        return;
      }
      
      await postService.createPost({
        user_id: user.id,
        society_id: societyId,
        title: postTitle.trim() || undefined,
        content: postContent.trim(),
        media_url: imageUri || undefined,
        post_type: "general",
        is_announcement: false,
        is_pinned: false,
        likes_count: 0,
        comments_count: 0,
      });

      Alert.alert("Success", "Post created successfully!");
      setPostContent("");
      setPostTitle("");
      setImageUri(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert("Error", "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCreateMatch = async () => {
    if (!matchTitle.trim() || !matchDescription.trim() || !matchVenue.trim() || !matchDate.trim() || !matchTime.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "Please log in to create matches");
      return;
    }

    setIsCreatingMatch(true);
    try {
      const societyId = await getSocietyId();
      if (!societyId) {
        Alert.alert("Error", "Please complete your profile to create matches");
        return;
      }

      // Create match
      const match = await matchService.createMatch({
        title: matchTitle.trim(),
        description: matchDescription.trim(),
        host_id: user.id,
        society_id: societyId,
        match_type: "casual",
        max_participants: maxParticipants ? parseInt(maxParticipants) : undefined,
        current_participants: 0,
        venue: matchVenue.trim(),
        scheduled_date: new Date(`${matchDate}T${matchTime}`).toISOString(),
        duration_minutes: 60,
        status: "upcoming",
      });

      // Also create a post about the match
      await postService.createPost({
        user_id: user.id,
        society_id: societyId,
        title: `🏀 ${matchTitle}`,
        content: `${matchDescription}\n\n📍 Venue: ${matchVenue}\n📅 Date: ${matchDate}\n⏰ Time: ${matchTime}\n👥 Max Participants: ${maxParticipants || 'Unlimited'}`,
        post_type: "match",
        is_announcement: false,
        is_pinned: false,
        likes_count: 0,
        comments_count: 0,
      });

      Alert.alert("Success", "Match created successfully!");
      setMatchTitle("");
      setMatchDescription("");
      setMatchVenue("");
      setMatchDate("");
      setMatchTime("");
      setMaxParticipants("");
      setShowModal(false);
    } catch (error) {
      console.error('Error creating match:', error);
      Alert.alert("Error", "Failed to create match");
    } finally {
      setIsCreatingMatch(false);
    }
  };

  const handleCreateTournament = () => {
    Alert.alert("Coming Soon", "Tournament creation feature will be available soon!");
    setShowModal(false);
  };

  const handleAddStory = () => {
    Alert.alert("Coming Soon", "Story creation feature will be available soon!");
    setShowModal(false);
  };

  const renderModalContent = () => {
    switch (selectedOption) {
      case "post":
        return (
          <KeyboardAvoidingView 
            style={styles.modalContent}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 20}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Title (Optional)</Text>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Give your post a catchy title..."
                  value={postTitle}
                  onChangeText={setPostTitle}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>What's on your mind?</Text>
                <TextInput
                  style={styles.contentInput}
                  placeholder="Share your thoughts, plans, or updates with your society..."
                  value={postContent}
                  onChangeText={setPostContent}
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={[styles.inputSection, { marginTop: -10 }]}> 
                {imageUri ? (
                  <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Image source={{ uri: imageUri }} style={{ width: width - 60, height: (width - 60) * 0.6, borderRadius: 12 }} />
                  </View>
                ) : null}
                <TouchableOpacity
                  style={[styles.addImageButton, imageUri && { backgroundColor: '#E8F5E9' }]}
                  onPress={async () => {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== 'granted') {
                      Alert.alert('Permission needed', 'We need camera roll permission to select images');
                      return;
                    }
                    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
                    if (!result.canceled) {
                      setImageUri(result.assets[0].uri);
                    }
                  }}
                >
                  <Text style={styles.addImageText}>{imageUri ? 'Change Image' : 'Add Image'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.characterCount}>
                <Text style={styles.characterCountText}>
                  {postContent.length}/500 characters
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.actionButton, isPosting && styles.disabledButton]}
                onPress={handleCreatePost}
                disabled={isPosting}
              >
                <Text style={styles.actionButtonText}>
                  {isPosting ? "Creating..." : "Create Post"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        );
      case "match":
        return (
          <KeyboardAvoidingView 
            style={styles.modalContent}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 20}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Host a Match</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
              <View style={styles.matchIconContainer}>
                <Text style={styles.matchIcon}>🏀</Text>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Match Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Basketball Game Tonight"
                  value={matchTitle}
                  onChangeText={setMatchTitle}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell people about your match..."
                  value={matchDescription}
                  onChangeText={setMatchDescription}
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Venue *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Society Basketball Court"
                  value={matchVenue}
                  onChangeText={setMatchVenue}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Date *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={matchDate}
                    onChangeText={setMatchDate}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={[styles.inputSection, { flex: 1, marginLeft: 10 }]}>
                  <Text style={styles.inputLabel}>Time *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    value={matchTime}
                    onChangeText={setMatchTime}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Max Participants (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 10"
                  value={maxParticipants}
                  onChangeText={setMaxParticipants}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.actionButton, isCreatingMatch && styles.disabledButton]}
                onPress={handleCreateMatch}
                disabled={isCreatingMatch}
              >
                <Text style={styles.actionButtonText}>
                  {isCreatingMatch ? "Creating..." : "Host Match"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        );
      case "tournament":
        return (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Tournament</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonIcon}>🏆</Text>
              <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
              <Text style={styles.comingSoonText}>
                Tournament creation will be available in the next update.
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCreateTournament}>
                <Text style={styles.actionButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case "story":
        return (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Story</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonIcon}>📸</Text>
              <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
              <Text style={styles.comingSoonText}>
                Story creation will be available in the next update.
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.actionButton} onPress={handleAddStory}>
                <Text style={styles.actionButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create</Text>
        <Text style={styles.subtitle}>What would you like to create?</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.optionsGrid}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleOptionSelect("post")}
          >
            <Text style={styles.optionIcon}>📝</Text>
            <Text style={styles.optionTitle}>Create Post</Text>
            <Text style={styles.optionSubtitle}>Share your thoughts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleOptionSelect("match")}
          >
            <Text style={styles.optionIcon}>🏀</Text>
            <Text style={styles.optionTitle}>Host Match</Text>
            <Text style={styles.optionSubtitle}>Create a sports match</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleOptionSelect("tournament")}
          >
            <Text style={styles.optionIcon}>🏆</Text>
            <Text style={styles.optionTitle}>Create Tournament</Text>
            <Text style={styles.optionSubtitle}>Host a competition</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleOptionSelect("story")}
          >
            <Text style={styles.optionIcon}>📸</Text>
            <Text style={styles.optionTitle}>Add Story</Text>
            <Text style={styles.optionSubtitle}>Share a moment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          {renderModalContent()}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
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
  optionIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
    textAlign: "center",
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666666",
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  matchIconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  matchIcon: {
    fontSize: 60,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: "#333333",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
  },
  titleInput: {
    fontSize: 16,
    color: "#333333",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
  },
  contentInput: {
    fontSize: 16,
    color: "#333333",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    minHeight: 120,
    textAlignVertical: "top",
  },
  addImageButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  addImageText: {
    color: '#333',
    fontWeight: '600'
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    marginBottom: 20,
  },
  characterCount: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  characterCountText: {
    fontSize: 12,
    color: "#999999",
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  comingSoonIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    textAlign: "center",
  },
  comingSoonText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  actionButton: {
    backgroundColor: "#3575EC",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
}); 
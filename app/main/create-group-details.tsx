import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateGroupDetailsScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleNext = () => {
    if (groupName.trim() && description.trim()) {
      router.push({
        pathname: "/main/create-group-members",
        params: { 
          topic: topic,
          groupName: groupName.trim(),
          description: description.trim(),
          isPrivate: isPrivate ? "true" : "false"
        }
      });
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const isFormValid = groupName.trim().length > 0 && description.trim().length > 0;

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
        <Text style={styles.title}>Give your group an identity</Text>
        <Text style={styles.subtitle}>
          Tell neighbors what makes this group special
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your awesome group name</Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Try something catchy"
            placeholderTextColor="#999"
            maxLength={30}
          />
          <Text style={styles.characterCount}>{groupName.length}/30</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tell neighbors what makes this group special</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="This will be the first thing new members see"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            maxLength={150}
            textAlignVertical="top"
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <Text style={styles.characterCount}>{description.length}/150</Text>
        </View>

        {/* Privacy Settings */}
        <View style={styles.privacySection}>
          <Text style={styles.privacyTitle}>Privacy Settings:</Text>
          
          <TouchableOpacity
            style={[
              styles.privacyOption,
              !isPrivate && styles.privacyOptionSelected
            ]}
            onPress={() => setIsPrivate(false)}
            activeOpacity={0.8}
          >
            <View style={styles.privacyOptionContent}>
              <Text style={styles.privacyIcon}>🌐</Text>
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyOptionTitle}>Public Group</Text>
                <Text style={styles.privacyOptionSubtitle}>Anyone in your society can join</Text>
              </View>
            </View>
            <View style={[styles.radioButton, !isPrivate && styles.radioButtonSelected]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.privacyOption,
              isPrivate && styles.privacyOptionSelected
            ]}
            onPress={() => setIsPrivate(true)}
            activeOpacity={0.8}
          >
            <View style={styles.privacyOptionContent}>
              <Text style={styles.privacyIcon}>🔒</Text>
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyOptionTitle}>Private Group</Text>
                <Text style={styles.privacyOptionSubtitle}>Admin approval required</Text>
              </View>
            </View>
            <View style={[styles.radioButton, isPrivate && styles.radioButtonSelected]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={[styles.nextButtonText, !isFormValid && styles.nextButtonTextDisabled]}>
            Next: Add Members
          </Text>
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

  // Form
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  characterCount: {
    fontSize: 12,
    color: "#FF0000",
    textAlign: "right",
    marginTop: 4,
  },

  // Privacy Settings
  privacySection: {
    marginBottom: 24,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  privacyOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 12,
  },
  privacyOptionSelected: {
    borderColor: "#000000",
  },
  privacyOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  privacyIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  privacyOptionSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  radioButtonSelected: {
    borderColor: "#000000",
    backgroundColor: "#000000",
  },

  // Button
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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

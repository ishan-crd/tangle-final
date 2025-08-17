import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useUser } from "../../contexts/UserContext";

SplashScreen.preventAutoHideAsync();
const { height } = Dimensions.get("window");

export default function AboutYou() {
  const router = useRouter();
  const { user, updateUserProfile } = useUser();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "NeuePlak-ExtendedBold": require("../../assets/fonts/Neue-Plak-Extended-Bold.ttf"),
          "NeuePlak-ExtendedBlack": require("../../assets/fonts/Neue-Plak-Extended-Black.ttf"),
          "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
          "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
        });
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    }

    loadFonts();
  }, []);

  const handleNext = async () => {
    setError("");
    
    if (!bio.trim()) {
      setError("Please write something about yourself");
      return;
    }
    
    if (bio.trim().length < 10) {
      setError("Bio must be at least 10 characters long");
      return;
    }
    
    if (bio.length > 140) {
      setError("Bio must be 140 characters or less");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Updating bio with:', bio.trim());
      await updateUserProfile({
        bio: bio.trim(),
      });
      console.log('Bio updated successfully');
      router.push("/onboarding/EmojiAvatarScreen");
    } catch (error) {
      console.error('Error updating bio:', error);
      Alert.alert("Error", "Failed to save bio");
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Main content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Tell us about</Text>
          <Text style={styles.titleAccent}>yourself 😏</Text>
          <Text style={styles.subtitle}>
            Write a short bio. Make it funny, serious, or mysterious — it's your
            call!
          </Text>

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="Your story in 140 characters max."
            placeholderTextColor="#999"
            value={bio}
            onChangeText={(text) => {
              setBio(text);
              setError("");
            }}
            multiline={true}
            numberOfLines={4}
            maxLength={140}
          />
          
          {/* Character count */}
          <Text style={styles.charCount}>
            {bio.length}/140 characters
          </Text>
          
          {/* Error Message */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.continueButton, isLoading && styles.disabledButton]}
              activeOpacity={0.8}
              onPress={handleNext}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Saving..." : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS === "android" ? (
          <Text style={styles.footerTextAndroid}>
            We won't tell anyone if you copy-paste it from Google 😏
          </Text>
        ) : null}
      </ScrollView>
      
      {/* Footer (iOS only) */}
      {Platform.OS === "ios" ? (
        <Text style={styles.footerText}>
          We won't tell anyone if you copy-paste it from Google 😏
        </Text>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    marginTop: 100,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    lineHeight: 50,
  },
  titleAccent: {
    fontSize: 40,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    lineHeight: 42,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Thin",
    color: "#00000",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#000000ff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#b4b4b4ff",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 8,
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
    color: "#1A1A1A",
    height: 140,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    fontFamily: "Montserrat-Light",
    marginBottom: 16,
  },
  charCount: {
    fontSize: 12,
    fontFamily: "Montserrat-Light",
    color: "#666666",
    textAlign: "right",
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: "#D7E0FF",
    width: 100,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "#000000ff",
  },
  footerText: {
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Montserrat-Bold",
    color: "#000000",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  footerTextAndroid: {
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Montserrat-Bold",
    color: "#000000",
    marginTop: 20,
    marginBottom: 30,
  },
});

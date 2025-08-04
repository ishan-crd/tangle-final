import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useUser } from "../../contexts/UserContext";

SplashScreen.preventAutoHideAsync();
const { height } = Dimensions.get("window");

export default function AllSet() {
  const router = useRouter();
  const { user } = useUser();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleStartExploring = async () => {
    setIsLoading(true);
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem('onboardingComplete', 'true');
      
      // Save user data to AsyncStorage
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      
      router.push("/onboarding/findyourbuddy");
    } catch (error) {
      Alert.alert("Error", "Failed to complete onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Main content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>You're all set!</Text>
        <Text style={styles.subtitle}>
          That's it! You're ready to Tangle and meet new people in your society.
          Let's get this party started! 🎉
        </Text>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.disabledButton]}
            activeOpacity={0.8}
            onPress={handleStartExploring}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Setting up..." : "Start Exploring!"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  decorativeContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  avatarContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 8,
  },
  topLeft: {
    top: height * 0.47,
    left: 30,
  },
  topRight: {
    top: height * 0.38,
    right: 80,
  },
  bottomLeft: {
    bottom: height * 0.05,
    left: 25,
  },
  bottomRight: {
    bottom: height * 0.08,
    right: 30,
  },
  avatarOne: {
    width: 114,
    height: 114,
    borderRadius: 32,
  },
  avatarTwo: {
    width: 84,
    height: 84,
    borderRadius: 32,
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
    marginBottom: 40,
  },
  titleAccent: {
    fontSize: 40,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#000000ff",
    lineHeight: 42,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
    color: "#00000",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#000000ff",
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: "#C0D9BF",
    width: 220,
    height: 56,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "#000000ff",
  },
});

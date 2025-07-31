import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

SplashScreen.preventAutoHideAsync();
const { height } = Dimensions.get("window");

export default function AboutYou() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [society, setSociety] = useState("");
  const [flat, setFlat] = useState("");

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

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Main content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Tell us about</Text>
        <Text style={styles.titleAccent}>yourself 😏</Text>
        <Text style={styles.subtitle}>
          Write a short bio. Make it funny, serious, or mysterious — it’s your
          call!
        </Text>

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          placeholder="Your story in 140 characters max."
          placeholderTextColor="#999"
          value={society}
          onChangeText={setSociety}
          multiline={true}
          numberOfLines={4}
        />

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
            onPress={() => router.push("/onboarding/notifications")}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <Text style={styles.footerText}>
          We won’t tell anyone if you copy-paste it from Google 😏
        </Text>
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
    marginBottom: 100,
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
    color: "#1A1A1A",
    height: 140,
    textAlignVertical: "top",
  },

  continueButton: {
    backgroundColor: "#D7E0FF",
    width: 100,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "#000000ff",
  },
  footerText: {
    marginTop: 200,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Montserrat-Bold",
    color: "#000000",
  },
});

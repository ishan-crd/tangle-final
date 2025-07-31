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

export default function ProfileBasic() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

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
        <Text style={styles.title}>Set up your</Text>
        <Text style={styles.titleAccent}>profile ✍️</Text>
        <Text style={styles.subtitle}>Let’s start with the basics</Text>

        <Text style={styles.label}>What’s your name or nickname?</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>How young are you</Text>
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          placeholder="Select your gender"
          value={gender}
          onChangeText={setGender}
          placeholderTextColor="#999"
        />

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
            onPress={() => router.push("/onboarding/addressscreen")}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.footerText}>
        Don’t worry, we won’t ask for your blood type… yet 😜
      </Text>
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
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#666",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontFamily: "Montserrat-Thin",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#1A1A1A",
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
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 4,
  },
});

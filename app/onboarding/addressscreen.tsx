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

export default function AddressScreen() {
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
        <Text style={styles.title}>Where do you</Text>
        <Text style={styles.titleAccent}>live 🏢</Text>
        <Text style={styles.subtitle}>
          We’ll only show up if there’s free food involved 🔊
        </Text>

        <Text style={styles.label}>Your society’s name?</Text>
        <TextInput
          style={styles.input}
          placeholder="Society Name"
          placeholderTextColor="#999"
          value={society}
          onChangeText={setSociety}
        />

        <Text style={styles.label}>Flat Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Don’t worry, it’s safe with us"
          placeholderTextColor="#999"
          value={flat}
          onChangeText={setFlat}
        />

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
            onPress={() => router.push("/onboarding/interestscreen")}
          >
            <Text style={styles.buttonText}>Next</Text>
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
  },
  titleAccent: {
    fontSize: 40,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    lineHeight: 42,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 13,
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
});

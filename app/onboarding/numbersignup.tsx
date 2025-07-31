// numbersignup.tsx
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
const { width, height } = Dimensions.get("window");

export default function NumberSignup() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Main content */}
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Can we get your</Text>
        <Text style={styles.welcomeText}>number, please?</Text>
        <Text style={styles.descriptionText}>
          We only use phone numbers to make sure everyone on tangle is real.
        </Text>

        {/* Input Field */}
        <View style={styles.phoneInputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Country</Text>
            <View style={styles.countryInput} />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Phone number</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder=""
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>

        {/* Continue Button */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
            onPress={() => router.push("/onboarding/otpverify")}
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
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 24,
    justifyContent: "flex-start",
  },
  welcomeText: {
    fontSize: 36,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    lineHeight: 37,
  },
  tangleText: {
    fontSize: 40,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#FF917F",
    lineHeight: 42,
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
    color: "#666666",
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 48,
    maxWidth: 300,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 28,
  },
  countryCode: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Montserrat-Light",
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
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },

  countryInput: {
    width: 80,
    height: 44,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  phoneInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 70,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#1A1A1A",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  label: {
    fontSize: 13,
    fontFamily: "Montserrat-Light",
    color: "#1A1A1A",
  },
  inputGroup: {
    flexDirection: "column",
  },

  inputLabel: {
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
    color: "#1A1A1A",
    marginBottom: 6,
    marginLeft: 7,
  },
});

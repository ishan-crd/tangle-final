// numbersignup.tsx
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
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
      {/* Background avatars */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.avatarContainer, styles.topLeft]}>
          <Image
            source={require("../../assets/images/avatar1.png")}
            style={styles.avatarTwo}
          />
        </View>
        <View style={[styles.avatarContainer, styles.topRight]}>
          <Image
            source={require("../../assets/images/avatar2.png")}
            style={styles.avatarOne}
          />
        </View>
        <View style={[styles.avatarContainer, styles.bottomLeft]}>
          <Image
            source={require("../../assets/images/avatar3.png")}
            style={styles.avatarOne}
          />
        </View>
        <View style={[styles.avatarContainer, styles.bottomRight]}>
          <Image
            source={require("../../assets/images/avatar4.png")}
            style={styles.avatarTwo}
          />
        </View>
      </View>

      {/* Main content */}
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Can we get your</Text>
        <Text style={styles.tangleText}>number, please?</Text>
        <Text style={styles.descriptionText}>
          We only use phone numbers to make sure everyone on tangle is real.
        </Text>

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.8}
          onPress={() => router.push("/otpverify")}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
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
    fontFamily: "NeuePlak-ExtendedBold",
    color: "#1A1A1A",
    lineHeight: 50,
  },
  tangleText: {
    fontSize: 40,
    fontFamily: "NeuePlak-ExtendedBold",
    color: "#FF917F",
    lineHeight: 42,
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: "Montserrat-Light",
    color: "#666666",
    lineHeight: 24,
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
    backgroundColor: "#FF723B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FF723B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#FFFFFF",
  },
});

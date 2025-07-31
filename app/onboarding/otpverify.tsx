import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
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

export default function OtpVerify() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

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

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Verify your</Text>
        <Text style={styles.titleAccent}>number</Text>
        <View style={{ marginBottom: 30 }}>
          <Text style={styles.subtitle}>
            Enter the code we’ve sent by text to
            {"\n"}
            <Text style={{ fontFamily: "Montserrat-Bold" }}>
              +91 8383091028
            </Text>
            <Text>{"  "}</Text>
            <Text
              style={styles.changeNumberTextInline}
              onPress={() => router.push("/onboarding/changenumber")}
            >
              Change number
            </Text>
          </Text>
        </View>

        <Text style={styles.codeLabel}>Code</Text>

        {/* OTP boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref!)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        <Text style={styles.resendText}>
          Didn’t get a code?{" "}
          <Text style={{ textDecorationLine: "underline" }}>Resend</Text>
        </Text>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
            onPress={() => router.push("/onboarding/profilebasic")}
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
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#666",
    marginBottom: 30,
    maxWidth: 300,
  },
  codeLabel: {
    fontSize: 14,
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  otpInput: {
    width: 55,
    height: 64,
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 25,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
  },
  resendText: {
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#666",
    marginBottom: 32,
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
  changeNumberTextInline: {
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
    textDecorationLine: "underline",
  },
});

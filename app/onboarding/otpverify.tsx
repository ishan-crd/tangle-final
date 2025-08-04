import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
// import { sendOTP, verifyOTP } from "../../lib/firebase"; // Comment out real Firebase
import { useUser } from "../../contexts/UserContext";
import { getCurrentOTP, sendOTP, verifyOTP } from "../../lib/mockFirebase"; // Use mock for Expo Go

SplashScreen.preventAutoHideAsync();
const { height } = Dimensions.get("window");

export default function OtpVerify() {
  const router = useRouter();
  const { user } = useUser();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
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

  useEffect(() => {
    // Send OTP when component mounts, but only once
    if (user?.phone && !otpSent) {
      sendOTPToPhone();
    }
  }, [user, otpSent]);

  useEffect(() => {
    // Countdown timer for resend
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOTPToPhone = async () => {
    if (!user?.phone || otpSent) return;
    
    setIsLoading(true);
    try {
      const phoneNumber = user.phone.startsWith('+') ? user.phone : `+${user.phone}`;
      const result = await sendOTP(phoneNumber);
      setConfirmation(result);
      setCountdown(30); // 30 second countdown
      setOtpSent(true); // Mark OTP as sent
      
      // For mock testing, show the OTP in alert
      const currentOTP = getCurrentOTP();
      Alert.alert("Mock OTP", `For testing: ${currentOTP}\n\nIn real app, this would be sent via SMS.`);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      Alert.alert("Error", "Failed to send OTP: " + (error?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(confirmation, otpCode);
      Alert.alert("Success", "Phone number verified successfully!");
      
      // Check if user has completed onboarding (has name, age, etc.)
      if (user?.name && user.name !== "Number User" && user.name !== "Apple User" && user.name !== "Google User") {
        // User has completed onboarding, go to main app
        router.push("/main");
      } else {
        // User needs to complete onboarding
        router.push("/onboarding/profilebasic");
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      Alert.alert("Error", "Invalid OTP code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    setOtpSent(false); // Reset the flag to allow resending
    sendOTPToPhone();
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
            Enter the code we've sent by text to
            {"\n"}
            <Text style={{ fontFamily: "Montserrat-Bold" }}>
              {user?.phone || "+91 8383091028"}
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
              ref={(ref) => {
                if (ref) inputs.current[index] = ref;
              }}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        <Text style={styles.resendText}>
          Didn't get a code?{" "}
          <Text 
            style={{ 
              textDecorationLine: "underline",
              color: countdown > 0 ? "#999" : "#007AFF"
            }}
            onPress={handleResendOTP}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
          </Text>
        </Text>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.disabledButton]}
            activeOpacity={0.8}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Verifying..." : "Verify"}
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
  disabledButton: {
    backgroundColor: "#E0E0E0",
    opacity: 0.7,
  },
});

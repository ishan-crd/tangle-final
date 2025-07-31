import { useFonts } from "@expo-google-fonts/montserrat";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();
const router = useRouter();

export default function signupscreen() {
  const [fontsLoaded, fontError] = useFonts({
    "NeuePlak-ExtendedBold": require("../../assets/fonts/Neue-Plak-Extended-Bold.ttf"),
    "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Adjust status bar spacing on Android */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top illustration */}
      <Image
        source={require("../../assets/images/Header.png")}
        style={styles.topImage}
        resizeMode="cover"
      />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/Logo.png")}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Sign up</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Choose an option to Sign Up</Text>

      {/* Social login buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
          <Ionicons name="logo-apple" size={20} color="#000000" />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={20} color="#EA4335" />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          activeOpacity={0.8}
          onPress={() => router.push("/onboarding/numbersignup")}
        >
          <Ionicons name="call-outline" size={20} color="#666666" />
          <Text style={styles.buttonText}>Continue with Number</Text>
        </TouchableOpacity>
      </View>

      {/* Login link */}
      <TouchableOpacity style={styles.loginContainer} activeOpacity={0.8}>
        <Text style={styles.loginText}>Already have an account? Log In</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>hello@notadatingapp.co</Text>
        <Text style={styles.footerText}>© Tangle Co.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topImage: {
    width: "100%",
    height: 160,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 28,
    fontFamily: "NeuePlak-ExtendedBold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Light",
    color: "#666666",
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Montserrat-Light",
    color: "#1A1A1A",
  },
  loginContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  loginText: {
    fontSize: 16,
    fontFamily: "Montserrat-Light",
    color: "#666666",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 4,
  },

  footerText: {
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#999999",
  },
});

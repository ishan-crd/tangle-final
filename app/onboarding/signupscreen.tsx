import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../contexts/UserContext";
import { userService } from "../../lib/supabase";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function signupscreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded, fontError] = Font.useFonts({
    "NeuePlak-ExtendedBold": require("../../assets/fonts/Neue-Plak-Extended-Bold.ttf"),
    "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const handleNumberSignup = () => {
    router.push("/onboarding/numbersignup");
  };

  const handleLogin = () => {
    router.push("/onboarding/numbersignup?mode=login");
  };

  const handleAppleSignup = async () => {
    setIsLoading(true);
    try {
      // Create a user with minimal required data
      const mockUser = {
        name: "Apple User",
        age: 0, // Default age
        phone: "+1234567890",
        interests: [],
        address: "",
        society: "",
        flat: "",
        avatar: "",
        bio: "",
        gender: ""
      };

      console.log('Creating user profile:', mockUser);
      const userProfile = await userService.createUserProfile(mockUser);
      console.log('User profile created:', userProfile);
      
      // Set the user in context immediately
      setUser(userProfile);
      
      router.push("/onboarding/profilebasic");
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert("Error", "Failed to sign up with Apple");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      // Create a user with minimal required data
      const mockUser = {
        name: "Google User",
        age: 0, // Default age
        phone: "+1234567891",
        interests: [],
        address: "",
        society: "",
        flat: "",
        avatar: "",
        bio: "",
        gender: ""
      };

      console.log('Creating user profile:', mockUser);
      const userProfile = await userService.createUserProfile(mockUser);
      console.log('User profile created:', userProfile);
      
      // Set the user in context immediately
      setUser(userProfile);
      
      router.push("/onboarding/profilebasic");
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert("Error", "Failed to sign up with Google");
    } finally {
      setIsLoading(false);
    }
  };

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
        <TouchableOpacity
          style={[styles.socialButton, isLoading && styles.disabledButton]} 
          activeOpacity={0.8}
          onPress={handleAppleSignup}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Continue with Apple"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, isLoading && styles.disabledButton]} 
          activeOpacity={0.8}
          onPress={handleGoogleSignup}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Continue with Google"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, isLoading && styles.disabledButton]}
          activeOpacity={0.8}
          onPress={handleNumberSignup}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Continue with Number</Text>
        </TouchableOpacity>
      </View>

      {/* Login link */}
      <TouchableOpacity style={styles.loginContainer} activeOpacity={0.8} onPress={handleLogin}>
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
  disabledButton: {
    opacity: 0.7,
    backgroundColor: "#D7E0FF",
  },
  buttonText: {
    fontSize: 18,
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

import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("window");
const router = useRouter();

export default function WelcomeScreen() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "NeuePlak-ExtendedBold": require("../../assets/fonts/Neue-Plak-Extended-Bold.ttf"),
          "NeuePlak-ExtendedBlack": require("../../assets/fonts/Neue-Plak-Extended-Black.ttf"),
          "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
          "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
          "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
        });
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Background decorative elements */}
      <View style={styles.decorativeContainer}>
        {/* Top left avatar */}
        <View style={[styles.avatarContainer, styles.topLeft]}>
          <Image
            source={require("../../assets/images/avatar1.png")}
            style={styles.avatarTwo}
          />
        </View>

        {/* Top right avatar */}
        <View style={[styles.avatarContainer, styles.topRight]}>
          <Image
            source={require("../../assets/images/avatar2.png")}
            style={styles.avatarOne}
          />
        </View>

        {/* Bottom left avatar */}
        <View style={[styles.avatarContainer, styles.bottomLeft]}>
          <Image
            source={require("../../assets/images/avatar3.png")}
            style={styles.avatarOne}
          />
        </View>

        {/* Bottom right avatar */}
        <View style={[styles.avatarContainer, styles.bottomRight]}>
          <Image
            source={require("../../assets/images/avatar4.png")}
            style={styles.avatarTwo}
          />
        </View>
      </View>

      {/* Main content */}
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.welcomeText}>Hey, welcome to</Text>
          <Text style={styles.tangleText}>Tangle!</Text>
        </View>

        <Text style={styles.descriptionText}>
          Ready to find your squad in the society? Let's set up your profile
          real quick! 😎
        </Text>
      </View>

      {/* Bottom positioned button */}
      <TouchableOpacity
        style={styles.bottomButton}
        activeOpacity={0.8}
        onPress={() => router.push("/signupscreen")}
      >
        <Text style={styles.buttonText}>Let's Go</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    position: "absolute",
    top: 92,
    left: 18,
    right: 18,
    alignItems: "flex-start",
  },
  titleContainer: {
    alignItems: "flex-start",
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 36,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    lineHeight: 50,
  },
  tangleText: {
    fontSize: 40,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#000000ff",
    lineHeight: 42,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#000000ff",
    lineHeight: 24,
    marginBottom: 48,
    maxWidth: 280,
  },
  bottomButton: {
    position: "absolute",
    top: 552,
    left: 128,
    backgroundColor: "#C0D9BF",
    width: 144,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#C0D9BF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    backgroundColor: "#84dd80ff",
    width: 144,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#81cf7fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#000000ff",
    textAlign: "center",
  },
});

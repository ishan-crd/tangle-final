import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";
import { UserProvider } from "../contexts/UserContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "NeuePlak-ExtendedBold": require("../assets/fonts/Neue-Plak-Extended-Bold.ttf"),
          "NeuePlak-ExtendedBlack": require("../assets/fonts/Neue-Plak-Extended-Black.ttf"),
          "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
          "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
          "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
          "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        });
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Error loading fonts:", error);
        // Continue without fonts if they fail to load
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      }
    }

    async function checkOnboardingStatus() {
      try {
        const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
        setIsOnboardingComplete(onboardingComplete === 'true');
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsOnboardingComplete(false);
      }
    }

    loadFonts();
    checkOnboardingStatus();
  }, []);

  if (!fontsLoaded || isOnboardingComplete === null) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: "#FFFFFF" }}
            edges={Platform.OS === "android" ? ["top"] : ["top"]}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="main" />
            </Stack>
            <StatusBar style="dark" translucent={false} />
          </SafeAreaView>
        </ThemeProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

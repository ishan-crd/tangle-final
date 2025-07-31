import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

SplashScreen.preventAutoHideAsync();
const { height } = Dimensions.get("window");

export default function Notifications() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [activityAlert, setActivityAlert] = useState(false);
  const [eventReminder, setEventReminder] = useState(false);
  const [chatNotification, setChatNotification] = useState(true);

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
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Notification</Text>
        <Text style={styles.titleAccent}>Preference 🔔</Text>
        <Text style={styles.subtitle}>How do you want to stay updated?</Text>

        <Text style={styles.label}>Activity Alerts</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            Let me know about fun activities and new matches!
          </Text>
          <Switch
            trackColor={{ false: "#ccc", true: "#FF723B" }}
            thumbColor={activityAlert ? "#fff" : "#fff"}
            onValueChange={setActivityAlert}
            value={activityAlert}
          />
        </View>

        <Text style={styles.label}>Event Reminders</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Remind me about society events!</Text>
          <Switch
            trackColor={{ false: "#ccc", true: "#FF723B" }}
            thumbColor={eventReminder ? "#fff" : "#fff"}
            onValueChange={setEventReminder}
            value={eventReminder}
          />
        </View>

        <Text style={styles.label}>Chat Notifications</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Buzz me when I get a message</Text>
          <Switch
            trackColor={{ false: "#ccc", true: "#FF723B" }}
            thumbColor={chatNotification ? "#fff" : "#fff"}
            onValueChange={setChatNotification}
            value={chatNotification}
          />
        </View>

        <View style={{ alignItems: "center", marginTop: 32 }}>
          <TouchableOpacity
            style={styles.doneButton}
            activeOpacity={0.8}
            onPress={() => router.push("/onboarding/allset")}
          >
            <Text style={styles.doneButtonText}>Done with settings🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footerText}>Don’t worry, we won’t spam… much</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
    marginBottom: 6,
    marginTop: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  switchText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#1A1A1A",
    marginRight: 10,
  },
  doneButton: {
    backgroundColor: "#FFCCCC",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
  },
  footerText: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#666",
  },
});

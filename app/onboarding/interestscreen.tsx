import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

SplashScreen.preventAutoHideAsync();
const { height } = Dimensions.get("window");

const INTERESTS = [
  { emoji: "💃", label: "Arts & Dance" },
  { emoji: "🍕", label: "Food & Drinks" },
  { emoji: "🎮", label: "Gaming" },
  { emoji: "🎸", label: "Music" },
  { emoji: "🌿", label: "YK" },
  { emoji: "⚽", label: "Football" },
  { emoji: "💪", label: "Gym" },
  { emoji: "💻", label: "Technology" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "🏏", label: "Cricket" },
  { emoji: "👜", label: "Fashion" },
  { emoji: "🎾", label: "Tennis" },
];

export default function InterestScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

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

  const toggleInterest = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Title and subtitle */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose your interests</Text>
          <Text style={styles.subtitle}>
            Pick a few things you love so we can match you with people who share
            your vibe!
          </Text>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {INTERESTS.map(({ emoji, label }) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.interestItem,
                selected.includes(label) && styles.selectedItem,
              ]}
              onPress={() => toggleInterest(label)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
              <Text style={styles.interestLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => router.push("/onboarding/aboutyou")}
        >
          <Text style={styles.doneText}>Done with this!</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>
          No judgment if you pick ‘Pets’ over ‘Fitness’ 😌
        </Text>
      </View>
    </View>
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
    paddingTop: 90,
    paddingBottom: 24,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontFamily: "NeuePlak-ExtendedBold",
    color: "#1A1A1A",
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
    color: "#666",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  interestItem: {
    height: 100,
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  selectedItem: {
    backgroundColor: "#FFEEE7",
    borderColor: "#FF723B",
    borderWidth: 2,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  interestLabel: {
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
    textAlign: "center",
  },
  doneButton: {
    backgroundColor: "#FFC2B8",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#FF723B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    width: 180,
    alignSelf: "center",
  },
  doneText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#000000",
  },
  footerText: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Montserrat-Bold",
    color: "#000000",
    bottom: 30,
  },
});

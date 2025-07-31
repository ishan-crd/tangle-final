import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

SplashScreen.preventAutoHideAsync();
const { width } = Dimensions.get("window");

export default function EmojiAvatarScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
        console.error("Font loading error", error);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  const emojiImages = [
    require("../../assets/emojis/emoji1.png"),
    require("../../assets/emojis/emoji2.png"),
    require("../../assets/emojis/emoji3.png"),
    require("../../assets/emojis/emoji4.png"),
    require("../../assets/emojis/emoji5.png"),
    require("../../assets/emojis/emoji6.png"),
    require("../../assets/emojis/emoji7.png"),
    require("../../assets/emojis/emoji8.png"),
    require("../../assets/emojis/emoji9.png"),
    require("../../assets/emojis/emoji10.png"),
    require("../../assets/emojis/emoji11.png"),
    require("../../assets/emojis/emoji12.png"),
    require("../../assets/emojis/emoji13.png"),
    require("../../assets/emojis/emoji14.png"),
    require("../../assets/emojis/emoji15.png"),
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Time to Create</Text>
      <Text style={styles.titleAccent}>Your Emoji! 🥳</Text>
      <Text style={styles.subtitle}>
        We get it, not everyone wants to show their real face. So, let’s have
        some fun! Create your own emoji avatar that totally reflects your vibe.
        😎
      </Text>

      <Image
        source={require("../../assets/emojis/mainEmoji.png")}
        style={styles.mainEmoji}
      />

      <View style={styles.emojiGrid}>
        {emojiImages.map((emoji, index) => (
          <Image key={index} source={emoji} style={styles.emojiIcon} />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
                  onPress={() => router.push("/onboarding/notifications")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#FAFAFA",
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: "NeuePlak-ExtendedBold",
    color: "#1A1A1A",
    lineHeight: 46,
  },
  titleAccent: {
    fontSize: 34,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#FF917F",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Light",
    color: "#666",
    marginBottom: 28,
  },
  mainEmoji: {
    width: width - 100,
    height: width - 100,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#FFEFAA",
    marginBottom: 20,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  emojiIcon: {
    width: (width - 80) / 4,
    height: (width - 80) / 4,
    borderRadius: 14,
    marginBottom: 12,
  },
  button: {
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

import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform
} from "react-native";
import { SvgXml } from 'react-native-svg';
import { useUser } from "../../contexts/UserContext";
import { ensureEmojiXmlLoaded, getEmojiXmlFromKey } from '../../lib/avatar';

SplashScreen.preventAutoHideAsync();
const { width } = Dimensions.get("window");

export default function EmojiAvatarScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { user, updateUserProfile } = useUser();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "NeuePlak-ExtendedBold": require("../../assets/fonts/Neue-Plak-Extended-Bold.ttf"),
          "NeuePlak-ExtendedBlack": require("../../assets/fonts/Neue-Plak-Extended-Black.ttf"),
          "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
          "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
        });
        await ensureEmojiXmlLoaded();
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Font/SVG loading error", error);
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) return null;

  const EMOJI_XMLS = Array.from({ length: 16 }, (_, i) => getEmojiXmlFromKey(`emoji${i + 1}`));

  const bgColors = [
    "#FFEFAA", "#E0F7FA", "#EDE7F6", "#E8F5E9", "#FFF3E0",
    "#F3E5F5", "#E1F5FE", "#FFFDE7", "#FCE4EC", "#E0F2F1",
    "#FFF8E1", "#F1F8E9", "#E8EAF6", "#F9FBE7", "#FBE9E7",
    "#EDEDED"
  ];

  const selectedXml = EMOJI_XMLS[selectedIndex % EMOJI_XMLS.length] as string;
  const selectedBg = bgColors[selectedIndex % bgColors.length];

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleNext = async () => {
    try {
      // Persist avatar as app asset reference key (emoji1..emoji15)
      const avatarKey = `emoji${selectedIndex + 1}`;
      await updateUserProfile({ avatar: avatarKey });
      router.push("/onboarding/notifications");
    } catch (e) {
      console.error("Failed to save avatar", e);
      router.push("/onboarding/notifications");
    }
  };

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

      <View style={[styles.previewCard, { backgroundColor: selectedBg }]}> 
        {!!selectedXml && (
          <SvgXml xml={selectedXml} width={(width - 48) * 0.6} height={(width - 48) * 0.6} />
        )}
      </View>

      <View style={styles.emojiGrid}>
        {EMOJI_XMLS.map((xml, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelect(index)}
            style={[styles.emojiTile, { backgroundColor: bgColors[index % bgColors.length] }, selectedIndex === index && styles.emojiTileSelected]}
            activeOpacity={0.8}
          >
            {!!xml && (
              <SvgXml xml={xml as string} width={(width - 80) / 4} height={(width - 80) / 4} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
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
    paddingTop: Platform.OS === 'android' ? 24 : 60,
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
  previewCard: {
    width: width - 48,
    height: (width - 48) * 0.6,
    alignSelf: "center",
    borderRadius: 20,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  previewEmoji: { width: (width - 48) * 0.6, height: (width - 48) * 0.6 },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  emojiTile: {
    width: (width - 80) / 4,
    height: (width - 80) / 4,
    borderRadius: 14,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emojiTileSelected: {
    borderWidth: 2,
    borderColor: '#000'
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

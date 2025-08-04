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

const users = [
  { name: "Suresh Sharma", avatar: require("../../assets/emojis/emoji1.png") },
  { name: "Aditya Kapoor", avatar: require("../../assets/emojis/emoji2.png") },
  { name: "Omkar Jha", avatar: require("../../assets/emojis/emoji3.png") },
  { name: "Ayush Singh", avatar: require("../../assets/emojis/emoji4.png") },
  { name: "Mehak Sardana", avatar: require("../../assets/emojis/emoji5.png") },
  {
    name: "Navya Pratap Singh",
    avatar: require("../../assets/emojis/emoji6.png"),
  },
  { name: "Diya Singh", avatar: require("../../assets/emojis/emoji7.png") },
];

export default function FindYourBuddy() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "NeuePlak-ExtendedBlack": require("../../assets/fonts/Neue-Plak-Extended-Black.ttf"),
          "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
          "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
        });
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Font loading error", error);
      }
    }

    loadFonts();
  }, []);

  const handleNext = () => {
    // Navigate to the main app
    router.replace("/main");
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Find your buddy</Text>
        <Text style={styles.subtitle}>
          Here are some cool people in your society who share your interests.
          Tap on their profiles to say hello!
        </Text>

        {users.map((user, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.userInfo}>
              <Image source={user.avatar} style={styles.avatar} />
              <Text style={styles.name}>{user.name}</Text>
            </View>
            <TouchableOpacity style={styles.iconWrapper}>
              <Image
                source={require("../../assets/emojis/emoji16.png")}
                style={styles.icon}
              />
              {/* Replace with actual 'user-add' icon if needed */}
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Enter App</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#000000",
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#FFF3B0",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#000000",
  },
  iconWrapper: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 8,
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: "#fff",
  },
  nextButton: {
    backgroundColor: "#D5DAF5",
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#000000",
  },
});

import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

SplashScreen.preventAutoHideAsync();

const bestFriends = [
  {
    name: "Navya Talwar",
    distance: "<1 km",
    avatar: require("../../assets/emojis/emoji1.png"),
  },
  {
    name: "Yash Bhati",
    distance: "2 km",
    avatar: require("../../assets/emojis/emoji2.png"),
  },
  {
    name: "Thripati",
    distance: "1 km",
    avatar: require("../../assets/emojis/emoji3.png"),
  },
  {
    name: "Rawat",
    distance: "—",
    avatar: require("../../assets/emojis/emoji4.png"),
  },
];

export default function Profile() {
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
        console.error("Font load error:", error);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Image
          source={require("../../assets/emojis/emoji7.png")}
          style={styles.profileImage}
        />
        {/* Top left and right edit icons can be added here if needed */}
      </View>

      <View style={styles.tabBar}>
        <Text style={styles.tab}>Posts</Text>
        <Text style={styles.tab}>Stories</Text>
        <Text style={[styles.tab, styles.activeTab]}>Connections</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>78</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>20</Text>
          <Text style={styles.statLabel}>Followings</Text>
        </View>
      </View>

      <Text style={styles.bestFriendsTitle}>Best Friends</Text>

      {bestFriends.map((friend, index) => (
        <View key={index} style={styles.friendCard}>
          <View style={styles.friendInfo}>
            <Image source={friend.avatar} style={styles.friendAvatar} />
            <View>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendDistance}>{friend.distance}</Text>
            </View>
          </View>

          <View style={styles.friendActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={require("../../assets/icons/video-call.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: "#EDF1FD" }]}
            >
              <Image
                source={require("../../assets/icons/check.png")}
                style={[styles.icon, { tintColor: "#3575EC" }]}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* You can add bottom tab navigation or leave it to main layout */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    flex: 1,
    padding: 20,
  },
  avatarWrapper: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF3B0",
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 24,
  },
  tab: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#1A1A1A",
  },
  activeTab: {
    textDecorationLine: "underline",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "NeuePlak-ExtendedBlack",
    fontSize: 20,
    color: "#000",
  },
  statLabel: {
    fontFamily: "Montserrat-Light",
    fontSize: 13,
    color: "#1A1A1A",
  },
  bestFriendsTitle: {
    fontSize: 18,
    fontFamily: "NeuePlak-ExtendedBlack",
    marginBottom: 12,
    color: "#000",
  },
  friendCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 15,
    color: "#000",
  },
  friendDistance: {
    fontFamily: "Montserrat-Light",
    fontSize: 12,
    color: "#666",
  },
  friendActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    backgroundColor: "#FEE3DA",
    padding: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
});

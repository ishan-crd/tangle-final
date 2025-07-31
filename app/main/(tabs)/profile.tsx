import { useRouter } from "expo-router";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useState } from "react";

const bestFriends = [
  {
    name: "Navya Talwar",
    distance: "<1 km",
    avatar: require("../../../assets/emojis/emoji1.png"),
  },
  {
    name: "Yash Bhati",
    distance: "2 km",
    avatar: require("../../../assets/emojis/emoji2.png"),
  },
  {
    name: "Thripati",
    distance: "1 km",
    avatar: require("../../../assets/emojis/emoji3.png"),
  },
  {
    name: "Rawat",
    distance: "—",
    avatar: require("../../../assets/emojis/emoji4.png"),
  },
];

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Connections");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Posts":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Your Posts</Text>
            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <Image source={require("../../../assets/emojis/emoji7.png")} style={styles.postAvatar} />
                <View>
                  <Text style={styles.postAuthor}>You</Text>
                  <Text style={styles.postTime}>2 hours ago</Text>
                </View>
              </View>
              <Text style={styles.postText}>Just finished an amazing workout! 💪</Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>❤️ 24</Text>
                <Text style={styles.postStat}>💬 8</Text>
                <Text style={styles.postStat}>📤 3</Text>
              </View>
            </View>
          </View>
        );
      case "Stories":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Your Stories</Text>
            <View style={styles.storiesGrid}>
              <View style={styles.storyCard}>
                <View style={styles.storyAvatar}>
                  <Text style={styles.storyPlus}>+</Text>
                </View>
                <Text style={styles.storyLabel}>Add Story</Text>
              </View>
              <View style={styles.storyCard}>
                <Image source={require("../../../assets/emojis/emoji5.png")} style={styles.storyImage} />
                <Text style={styles.storyLabel}>Workout</Text>
              </View>
              <View style={styles.storyCard}>
                <Image source={require("../../../assets/emojis/emoji6.png")} style={styles.storyImage} />
                <Text style={styles.storyLabel}>Gym</Text>
              </View>
            </View>
          </View>
        );
      case "Connections":
        return (
          <View style={styles.tabContent}>
            <View style={styles.stats}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>78</Text>
                <Text style={styles.statLabel}>Friends</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>20</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

            <View style={styles.bestFriendsHeader}>
              <Text style={styles.bestFriendsTitle}>Best Friends</Text>
              <View style={styles.groupAvatars}>
                <Image source={require("../../../assets/emojis/emoji8.png")} style={styles.groupAvatar} />
                <Image source={require("../../../assets/emojis/emoji9.png")} style={styles.groupAvatar} />
                <Image source={require("../../../assets/emojis/emoji10.png")} style={styles.groupAvatar} />
                <View style={styles.moreAvatar}>
                  <Text style={styles.moreText}>+9</Text>
                </View>
              </View>
            </View>

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
                  <View style={styles.iconButton}>
                    <Image
                      source={require("../../../assets/icons/video-call.png")}
                      style={styles.icon}
                    />
                  </View>
                  <View style={[styles.iconButton, { backgroundColor: "#EDF1FD" }]}>
                    <Image
                      source={require("../../../assets/icons/check.png")}
                      style={[styles.icon, { tintColor: "#3575EC" }]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.headerActions}>
          <View style={styles.actionButton}>
            <Text style={styles.actionIcon}>✏️</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionIcon}>⋮</Text>
          </View>
        </View>
        <Image
          source={require("../../../assets/emojis/emoji7.png")}
          style={styles.profileImage}
        />
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        {["Posts", "Stories", "Connections"].map((tab) => (
          <View
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onTouchEnd={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </View>
        ))}
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  profileHeader: {
    backgroundColor: "#E8F5E8",
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
    position: "relative",
  },
  headerActions: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 18,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
  activeTab: {
    backgroundColor: "#FFF3B0",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "bold",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: 20,
    height: 3,
    backgroundColor: "#000000",
    borderRadius: 2,
  },
  tabContent: {
    padding: 20,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  bestFriendsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  bestFriendsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  groupAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -10,
  },
  moreAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF69B4",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
  },
  moreText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  friendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  friendDistance: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  friendActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE4E1",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  postTime: {
    fontSize: 12,
    color: "#666666",
  },
  postText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 15,
  },
  postStats: {
    flexDirection: "row",
    gap: 20,
  },
  postStat: {
    fontSize: 14,
    color: "#666666",
  },
  storiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  storyCard: {
    alignItems: "center",
    width: 80,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  storyPlus: {
    fontSize: 24,
    color: "#666666",
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  storyLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
});

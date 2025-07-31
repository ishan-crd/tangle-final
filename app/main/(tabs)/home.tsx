import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>I</Text>
              </View>
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeSmall}>Welcome back,</Text>
              <Text style={styles.username}>Ishan</Text>
            </View>
          </View>
          <View style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </View>
        </View>

        {/* Stories Section */}
        <View style={styles.storiesSection}>
          <View style={styles.storiesHeader}>
            <Text style={styles.storiesTitle}>Stories</Text>
            <View>
              <Text style={styles.seeAllText}>See All</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
            {/* Add Story */}
            <View style={styles.storyItem}>
              <View style={styles.addStoryCircle}>
                <Text style={styles.addStoryPlus}>+</Text>
              </View>
              <Text style={styles.storyLabel}>Add Story</Text>
            </View>
            
            {/* Story 1 */}
            <View style={styles.storyItem}>
              <View style={styles.storyCircle}>
                <Text style={styles.storyAvatar}>👨‍🦰</Text>
              </View>
              <Text style={styles.storyLabel}>Suresh Tyagi</Text>
            </View>
            
            {/* Story 2 */}
            <View style={styles.storyItem}>
              <View style={styles.storyCircle}>
                <Text style={styles.storyAvatar}>👨‍🦱</Text>
              </View>
              <Text style={styles.storyLabel}>Yash Bhatt</Text>
            </View>
            
            {/* Story 3 */}
            <View style={styles.storyItem}>
              <View style={styles.storyCircle}>
                <Text style={styles.storyAvatar}>👩‍🦱</Text>
              </View>
              <Text style={styles.storyLabel}>Aditya Arora</Text>
            </View>
          </ScrollView>
        </View>

        {/* Feed Section */}
        <View style={styles.feedSection}>
          <Text style={styles.feedTitle}>Feed</Text>
          
          {/* Post 1 */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>S</Text>
              </View>
              <View style={styles.postUserInfo}>
                <Text style={styles.postUsername}>Suresh</Text>
                <Text style={styles.postTime}>2 hours ago</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>
              Looking for a partner to play badminton this evening at 5 PM. Anyone interested?
            </Text>
            
            <View style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Badminton Match</Text>
                <Text style={styles.eventTime}>Today at 5:00 PM</Text>
              </View>
              <View style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </View>
            </View>
          </View>
          
          {/* Post 2 */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>Y</Text>
              </View>
              <View style={styles.postUserInfo}>
                <Text style={styles.postUsername}>Yash</Text>
                <Text style={styles.postTime}>1 hour ago</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>
              Anyone up for a game of basketball tomorrow morning at 8 AM?
            </Text>
            
            <View style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Basketball Game</Text>
                <Text style={styles.eventTime}>Tomorrow at 8:00 AM</Text>
              </View>
              <View style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </View>
            </View>
          </View>

          {/* Post 3 - Regular Social Post */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>A</Text>
              </View>
              <View style={styles.postUserInfo}>
                <Text style={styles.postUsername}>Aditya</Text>
                <Text style={styles.postTime}>3 hours ago</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>
              Just finished an amazing workout session! 💪 The new gym in our area is incredible. Anyone else tried it out?
            </Text>
          </View>

          {/* Post 4 - Achievement Post */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>P</Text>
              </View>
              <View style={styles.postUserInfo}>
                <Text style={styles.postUsername}>Priya</Text>
                <Text style={styles.postTime}>5 hours ago</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>
              Finally hit my goal of running 10km! 🏃‍♀️ It took months of training but totally worth it. Next target: half marathon!
            </Text>
          </View>

          {/* Post 5 - Equipment/Recommendation */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>R</Text>
              </View>
              <View style={styles.postUserInfo}>
                <Text style={styles.postUsername}>Rahul</Text>
                <Text style={styles.postTime}>6 hours ago</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>
              Just got these new running shoes and they're amazing! Perfect for long-distance runs. Anyone looking for good running gear recommendations?
            </Text>
          </View>

          {/* Post 6 - Another Match Invitation */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>M</Text>
              </View>
              <View style={styles.postUserInfo}>
                <Text style={styles.postUsername}>Meera</Text>
                <Text style={styles.postTime}>8 hours ago</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>
              Looking for a tennis partner for weekend matches. Intermediate level preferred. Anyone interested?
            </Text>
            
            <View style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Tennis Match</Text>
                <Text style={styles.eventTime}>This Weekend</Text>
              </View>
              <View style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </View>
            </View>
          </View>

          {/* Post 7 - Fitness Motivation */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>K</Text>
              </View>
              <View style={styles.postUserInfo}>
                <Text style={styles.postUsername}>Karan</Text>
                <Text style={styles.postTime}>10 hours ago</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>
              Remember: Every expert was once a beginner. Don't let the fear of being bad at something stop you from trying! 💪
            </Text>
          </View>

          {/* Post 8 - Local Event */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>S</Text>
              </View>
              <View style={styles.postUserInfo}>
                <Text style={styles.postUsername}>Sarah</Text>
                <Text style={styles.postTime}>12 hours ago</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>
              There's a local 5K charity run happening next month! Great cause and perfect for beginners. Who's joining?
            </Text>
            
            <View style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Charity 5K Run</Text>
                <Text style={styles.eventTime}>Next Month</Text>
              </View>
              <View style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  
  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3575EC",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  welcomeText: {
    flexDirection: "column",
  },
  welcomeSmall: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Montserrat-Light",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "Montserrat-Bold",
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    fontSize: 24,
  },
  
  // Stories Styles
  storiesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  storiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  storiesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "Neue-Plak-Extended-Bold",
  },
  seeAllText: {
    fontSize: 14,
    color: "#3575EC",
    fontFamily: "Montserrat-SemiBold",
  },
  storiesContainer: {
    flexDirection: "row",
  },
  storyItem: {
    alignItems: "center",
    marginRight: 20,
  },
  addStoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  addStoryPlus: {
    fontSize: 24,
    color: "#666666",
  },
  storyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  storyAvatar: {
    fontSize: 24,
  },
  storyLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    fontFamily: "Montserrat-SemiBold",
  },
  
  // Feed Styles
  feedSection: {
    paddingHorizontal: 20,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    fontFamily: "Neue-Plak-Extended-Bold",
  },
  postCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3575EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  postAvatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  postUserInfo: {
    flex: 1,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "Montserrat-Bold",
  },
  postTime: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Montserrat-Light",
  },
  postContent: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },
  eventCard: {
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 4,
    fontFamily: "Montserrat-Bold",
  },
  eventTime: {
    fontSize: 14,
    color: "#1976D2",
    fontFamily: "Montserrat-Light",
  },
  joinButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Montserrat-SemiBold",
  },
}); 
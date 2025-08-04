import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HubScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hub</Text>
        <Text style={styles.subtitle}>Discover and connect</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🏢</Text>
            <Text style={styles.actionTitle}>Societies</Text>
            <Text style={styles.actionSubtitle}>Find nearby societies</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>Groups</Text>
            <Text style={styles.actionSubtitle}>Join sports groups</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionTitle}>Challenges</Text>
            <Text style={styles.actionSubtitle}>Participate in challenges</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🏅</Text>
            <Text style={styles.actionTitle}>Achievements</Text>
            <Text style={styles.actionSubtitle}>View your badges</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending</Text>
        
        <View style={styles.trendingList}>
          <View style={styles.trendingItem}>
            <Text style={styles.trendingEmoji}>🔥</Text>
            <View style={styles.trendingContent}>
              <Text style={styles.trendingTitle}>Basketball Tournament</Text>
              <Text style={styles.trendingSubtitle}>15 people joined</Text>
            </View>
            <Text style={styles.trendingCount}>#1</Text>
          </View>
          
          <View style={styles.trendingItem}>
            <Text style={styles.trendingEmoji}>🏸</Text>
            <View style={styles.trendingContent}>
              <Text style={styles.trendingTitle}>Badminton League</Text>
              <Text style={styles.trendingSubtitle}>8 teams registered</Text>
            </View>
            <Text style={styles.trendingCount}>#2</Text>
          </View>
          
          <View style={styles.trendingItem}>
            <Text style={styles.trendingEmoji}>🎾</Text>
            <View style={styles.trendingContent}>
              <Text style={styles.trendingTitle}>Tennis Doubles</Text>
              <Text style={styles.trendingSubtitle}>12 players online</Text>
            </View>
            <Text style={styles.trendingCount}>#3</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Activities</Text>
        
        <View style={styles.activityList}>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityEmoji}>🏀</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Basketball Court</Text>
                <Text style={styles.activityLocation}>500m away</Text>
              </View>
              <View style={styles.activityStats}>
                <Text style={styles.participantCount}>8</Text>
                <Text style={styles.participantLabel}>players</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityEmoji}>🏸</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Badminton Court</Text>
                <Text style={styles.activityLocation}>1km away</Text>
              </View>
              <View style={styles.activityStats}>
                <Text style={styles.participantCount}>4</Text>
                <Text style={styles.participantLabel}>players</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityEmoji}>🎾</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Tennis Court</Text>
                <Text style={styles.activityLocation}>2km away</Text>
              </View>
              <View style={styles.activityStats}>
                <Text style={styles.participantCount}>2</Text>
                <Text style={styles.participantLabel}>players</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
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
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  trendingList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  trendingEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  trendingContent: {
    flex: 1,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  trendingSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  trendingCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3575EC",
  },
  activityList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  activityLocation: {
    fontSize: 14,
    color: "#666666",
  },
  activityStats: {
    alignItems: "center",
  },
  participantCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3575EC",
  },
  participantLabel: {
    fontSize: 10,
    color: "#666666",
  },
}); 
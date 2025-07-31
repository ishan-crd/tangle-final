import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HubScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hub</Text>
          <Text style={styles.headerSubtitle}>Discover everything in your community</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchText}>Search features...</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.actionRow}>
            <View style={styles.actionCard}>
              <Text style={styles.actionIcon}>🎁</Text>
              <Text style={styles.actionText}>Offers</Text>
            </View>
            <View style={styles.actionCard}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Polls</Text>
            </View>
            <View style={styles.actionCard}>
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionText}>Book Slots</Text>
            </View>
          </View>
        </View>

        {/* Feature Cards Grid - 2 Columns */}
        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            {/* Tournaments Card */}
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>🏆</Text>
                <Text style={styles.cardTitle}>Tournaments</Text>
                <Text style={styles.cardBadge}>3 Active</Text>
              </View>
            </View>

            {/* Community Events Card */}
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>🎉</Text>
                <Text style={styles.cardTitle}>Events</Text>
                <Text style={styles.cardBadge}>2 Upcoming</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardRow}>
            {/* Interest Groups Card */}
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>👥</Text>
                <Text style={styles.cardTitle}>Interest Circles</Text>
                <Text style={styles.cardBadge}>12 Groups</Text>
              </View>
            </View>

            {/* Announcements Card */}
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>📢</Text>
                <Text style={styles.cardTitle}>Announcements</Text>
                <Text style={styles.cardBadge}>5 New</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardRow}>
            {/* Local Services Card */}
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>🛠️</Text>
                <Text style={styles.cardTitle}>Local Services</Text>
                <Text style={styles.cardBadge}>8 Available</Text>
              </View>
            </View>

            {/* Safety & Security Card */}
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>🛡️</Text>
                <Text style={styles.cardTitle}>Safety Hub</Text>
                <Text style={styles.cardBadge}>24/7</Text>
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
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchText: {
    fontSize: 16,
    color: "#999999",
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333333",
  },
  cardsContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: (width - 60) / 2, // 2 columns with padding
    aspectRatio: 1, // Square boxes
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  cardBadge: {
    backgroundColor: "#E3F2FD",
    color: "#1976D2",
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
}); 
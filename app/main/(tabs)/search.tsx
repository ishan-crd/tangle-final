import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search sports, players, locations..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryEmoji}>🏃</Text>
              <Text style={styles.categoryName}>All</Text>
            </View>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryEmoji}>🏢</Text>
              <Text style={styles.categoryName}>Indoor</Text>
            </View>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryEmoji}>🌳</Text>
              <Text style={styles.categoryName}>Outdoor</Text>
            </View>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryEmoji}>👥</Text>
              <Text style={styles.categoryName}>Team</Text>
            </View>
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Popular Activities</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityEmoji}>🏸</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>Badminton</Text>
                <Text style={styles.activityLocation}>Court A</Text>
              </View>
              <View style={styles.activityStats}>
                <Text style={styles.participantCount}>12</Text>
                <Text style={styles.participantLabel}>players</Text>
              </View>
            </View>
            <View style={styles.activityFooter}>
              <Text style={styles.activityTime}>⏰ 5:00 PM</Text>
              <View style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Game</Text>
              </View>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityEmoji}>🏀</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>Basketball</Text>
                <Text style={styles.activityLocation}>Main Court</Text>
              </View>
              <View style={styles.activityStats}>
                <Text style={styles.participantCount}>8</Text>
                <Text style={styles.participantLabel}>players</Text>
              </View>
            </View>
            <View style={styles.activityFooter}>
              <Text style={styles.activityTime}>⏰ 8:00 AM</Text>
              <View style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Game</Text>
              </View>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityEmoji}>🎾</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>Tennis</Text>
                <Text style={styles.activityLocation}>Court B</Text>
              </View>
              <View style={styles.activityStats}>
                <Text style={styles.participantCount}>4</Text>
                <Text style={styles.participantLabel}>players</Text>
              </View>
            </View>
            <View style={styles.activityFooter}>
              <Text style={styles.activityTime}>⏰ 6:30 PM</Text>
              <View style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Game</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7FF",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 14,
    color: "#666666",
  },
  resultsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  activityEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 12,
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
  activityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityTime: {
    fontSize: 12,
    color: "#666666",
  },
  joinButton: {
    backgroundColor: "#3575EC",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  joinButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
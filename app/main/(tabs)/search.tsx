import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useUser } from "../../../contexts/UserContext";
import { Match, matchService } from "../../../lib/supabase";

export default function SearchScreen() {
  const { user } = useUser();
  const [ongoingMatches, setOngoingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOngoingMatches();
  }, [user]);

  const loadOngoingMatches = async () => {
    if (!user?.society_id) return;
    
    try {
      setLoading(true);
      const matches = await matchService.getMatchesBySociety(user.society_id);
      // Filter for upcoming and ongoing matches
      const activeMatches = matches.filter(match => 
        match.status === 'upcoming' || match.status === 'ongoing'
      );
      setOngoingMatches(activeMatches);
    } catch (error) {
      console.error('Error loading ongoing matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOngoingMatches();
    setRefreshing(false);
  };

  const handleJoinMatch = async (matchId: string) => {
    if (!user?.id) {
      Alert.alert("Error", "Please log in to join matches");
      return;
    }

    try {
      await matchService.joinMatch(matchId, user.id);
      Alert.alert("Success", "You've joined the match!");
      // Refresh the matches list
      loadOngoingMatches();
    } catch (error) {
      console.error('Error joining match:', error);
      Alert.alert("Error", "Failed to join match. Please try again.");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getMatchIcon = (matchType: string) => {
    switch (matchType) {
      case 'badminton':
        return '🏸';
      case 'basketball':
        return '🏀';
      case 'tennis':
        return '🎾';
      case 'football':
        return '⚽';
      case 'cricket':
        return '🏏';
      default:
        return '🏃';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find people and activities</Text>
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>Find People</Text>
            <Text style={styles.actionSubtitle}>Search by name or society</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🏀</Text>
            <Text style={styles.actionTitle}>Find Matches</Text>
            <Text style={styles.actionSubtitle}>Join available matches</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionTitle}>Find Tournaments</Text>
            <Text style={styles.actionSubtitle}>Join tournaments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionTitle}>Nearby</Text>
            <Text style={styles.actionSubtitle}>Find activities nearby</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <View style={styles.recentList}>
          <TouchableOpacity style={styles.recentItem}>
            <Text style={styles.recentText}>Basketball matches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recentItem}>
            <Text style={styles.recentText}>Badminton players</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recentItem}>
            <Text style={styles.recentText}>Tennis tournaments</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Popular Activities Section */}
      <View style={styles.popularSection}>
        <Text style={styles.sectionTitle}>Popular Activities</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading activities...</Text>
          </View>
        ) : ongoingMatches.length > 0 ? (
          ongoingMatches.map((match) => (
            <View key={match.id} style={styles.activityCard}>
              <View style={styles.activityLeft}>
                <Text style={styles.activityIcon}>{getMatchIcon(match.title.toLowerCase())}</Text>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{match.title}</Text>
                  <Text style={styles.activityLocation}>{match.venue}</Text>
                  <View style={styles.activityTime}>
                    <Text style={styles.timeIcon}>⏰</Text>
                    <Text style={styles.timeText}>{formatTime(match.scheduled_date)}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.activityRight}>
                <View style={styles.playerCount}>
                  <Text style={styles.playerNumber}>{match.current_participants}</Text>
                  <Text style={styles.playerLabel}>players</Text>
                </View>
                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => handleJoinMatch(match.id)}
                >
                  <Text style={styles.joinButtonText}>Join Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noActivitiesContainer}>
            <Text style={styles.noActivitiesText}>No ongoing activities in your society</Text>
            <Text style={styles.noActivitiesSubtext}>Create a match to get started!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 0 : 50, // Remove gap on Android
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
  searchSection: {
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
  recentSection: {
    padding: 20,
  },
  recentList: {
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
  recentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  recentText: {
    fontSize: 16,
    color: "#333333",
  },
  // Popular Activities Section Styles
  popularSection: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
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
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  activityIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  activityTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  timeText: {
    fontSize: 14,
    color: "#666666",
  },
  activityRight: {
    alignItems: "flex-end",
  },
  playerCount: {
    alignItems: "center",
    marginBottom: 8,
  },
  playerNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  playerLabel: {
    fontSize: 12,
    color: "#666666",
  },
  joinButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  noActivitiesContainer: {
    alignItems: "center",
    padding: 20,
  },
  noActivitiesText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 4,
  },
  noActivitiesSubtext: {
    fontSize: 14,
    color: "#999999",
  },
});
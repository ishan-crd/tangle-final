import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useUser } from "../../contexts/UserContext";
import { CommunityEvent, communityEventService } from "../../lib/supabase";

export default function CommunityEventsScreen() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: userProfile } = useUser();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userProfile?.society) {
        setError("No society found for user");
        setLoading(false);
        return;
      }

      const data = await communityEventService.getEventsBySocietyName(userProfile.society);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      if (!userProfile?.id) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      await communityEventService.joinEvent(eventId, userProfile.id);
      Alert.alert("Success", "Successfully joined event!");
      
      // Refresh the events list to update participant counts
      fetchEvents();
    } catch (err) {
      console.error('Error joining event:', err);
      Alert.alert("Error", "Failed to join event. Please try again.");
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Events</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{events.length}</Text>
            <Text style={styles.statLabel}>Active Events</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {events.reduce((sum, e) => sum + e.current_participants, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Participants</Text>
          </View>
        </View>

        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>No Events Available</Text>
            <Text style={styles.emptyText}>There are currently no active community events in your society.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>

            {events.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.categoryIcon}>{event.category}</Text>
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{event.status}</Text>
                  </View>
                </View>

                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>

                {event.highlights && event.highlights.length > 0 && (
                  <View style={styles.highlightsContainer}>
                    <Text style={styles.highlightsTitle}>Highlights:</Text>
                    {event.highlights.map((highlight, index) => (
                      <View key={index} style={styles.highlightItem}>
                        <Text style={styles.highlightBullet}>•</Text>
                        <Text style={styles.highlightText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <Text style={styles.detailText}>
                      {formatDate(event.date)} at {formatTime(event.time)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText}>{event.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>👥</Text>
                    <Text style={styles.detailText}>
                      {event.current_participants}/{event.max_participants} participants
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.joinButton,
                    event.current_participants >= event.max_participants && styles.joinButtonDisabled
                  ]}
                  onPress={() => handleJoinEvent(event.id)}
                  disabled={event.current_participants >= event.max_participants}
                >
                  <Text style={styles.joinButtonText}>
                    {event.current_participants >= event.max_participants ? 'Event Full' : 'Join Event'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 20 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "#333",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryIcon: {
    fontSize: 20,
  },
  statusContainer: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "600",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  highlightsContainer: {
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  highlightBullet: {
    fontSize: 16,
    color: "#2196F3",
    marginRight: 8,
    width: 15,
  },
  highlightText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  eventDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  joinButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  joinButtonDisabled: {
    backgroundColor: "#E0E0E0",
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

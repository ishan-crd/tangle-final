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
import { Tournament, tournamentService } from "../../lib/supabase";

export default function TournamentsScreen() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinedTournaments, setJoinedTournaments] = useState<Set<string>>(new Set());
  const [joiningTournament, setJoiningTournament] = useState<string | null>(null);
  const { user: userProfile } = useUser();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userProfile?.society) {
        setError("No society found for user");
        setLoading(false);
        return;
      }

      const data = await tournamentService.getTournamentsBySocietyName(userProfile.society);
      setTournaments(data);
      
      // Check which tournaments the user has already joined
      if (userProfile?.id) {
        await checkJoinedTournaments(data);
      }
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const checkJoinedTournaments = async (tournamentList: Tournament[]) => {
    try {
      const joinedSet = new Set<string>();
      
      for (const tournament of tournamentList) {
        const participants = await tournamentService.getTournamentParticipants(tournament.id);
        const isJoined = participants.some(p => p.user_id === userProfile?.id);
        if (isJoined) {
          joinedSet.add(tournament.id);
        }
      }
      
      setJoinedTournaments(joinedSet);
    } catch (err) {
      console.error('Error checking joined tournaments:', err);
    }
  };

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      if (!userProfile?.id) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      setJoiningTournament(tournamentId);

      await tournamentService.joinTournament(tournamentId, userProfile.id);
      
      // Update local state
      setJoinedTournaments(prev => new Set(prev).add(tournamentId));
      
      // Update tournament participant count locally
      setTournaments(prev => prev.map(t => 
        t.id === tournamentId 
          ? { ...t, current_participants: t.current_participants + 1 }
          : t
      ));
      
      Alert.alert("Success", "Successfully joined tournament!");
    } catch (err) {
      console.error('Error joining tournament:', err);
      Alert.alert("Error", "Failed to join tournament. Please try again.");
    } finally {
      setJoiningTournament(null);
    }
  };

  const handleLeaveTournament = async (tournamentId: string) => {
    try {
      if (!userProfile?.id) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      setJoiningTournament(tournamentId);

      await tournamentService.leaveTournament(tournamentId, userProfile.id);
      
      // Update local state
      setJoinedTournaments(prev => {
        const newSet = new Set(prev);
        newSet.delete(tournamentId);
        return newSet;
      });
      
      // Update tournament participant count locally
      setTournaments(prev => prev.map(t => 
        t.id === tournamentId 
          ? { ...t, current_participants: Math.max(0, t.current_participants - 1) }
          : t
      ));
      
      Alert.alert("Success", "Successfully left tournament!");
    } catch (err) {
      console.error('Error leaving tournament:', err);
      Alert.alert("Error", "Failed to leave tournament. Please try again.");
    } finally {
      setJoiningTournament(null);
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

  const isJoined = (tournamentId: string) => joinedTournaments.has(tournamentId);
  const isJoining = (tournamentId: string) => joiningTournament === tournamentId;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading tournaments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTournaments}>
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
        <Text style={styles.headerTitle}>Tournaments</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tournaments.length}</Text>
            <Text style={styles.statLabel}>Active Tournaments</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {tournaments.reduce((sum, t) => sum + t.current_participants, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Participants</Text>
          </View>
        </View>

        {tournaments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyTitle}>No Tournaments Available</Text>
            <Text style={styles.emptyText}>There are currently no active tournaments in your society.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Available Tournaments</Text>

            {tournaments.map((tournament) => {
              const joined = isJoined(tournament.id);
              const joining = isJoining(tournament.id);
              const isFull = tournament.current_participants >= tournament.max_participants;
              
              return (
                <View key={tournament.id} style={styles.tournamentCard}>
                  <View style={styles.tournamentHeader}>
                    <Text style={styles.sportIcon}>{tournament.sport}</Text>
                    <View style={styles.statusContainer}>
                      <Text style={styles.statusText}>{tournament.status}</Text>
                    </View>
                  </View>

                  <Text style={styles.tournamentTitle}>{tournament.title}</Text>
                  <Text style={styles.tournamentDescription}>{tournament.description}</Text>

                  <View style={styles.tournamentDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>📅</Text>
                      <Text style={styles.detailText}>
                        {formatDate(tournament.date)} at {formatTime(tournament.time)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>📍</Text>
                      <Text style={styles.detailText}>{tournament.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>👥</Text>
                      <Text style={styles.detailText}>
                        {tournament.current_participants}/{tournament.max_participants} participants
                      </Text>
                    </View>
                  </View>

                  {tournament.prize_pool && (
                    <View style={styles.prizeContainer}>
                      <Text style={styles.prizeText}>{tournament.prize_pool}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.joinButton,
                      joined && styles.joinedButton,
                      isFull && !joined && styles.joinButtonDisabled,
                      joining && styles.joiningButton
                    ]}
                    onPress={() => joined ? handleLeaveTournament(tournament.id) : handleJoinTournament(tournament.id)}
                    disabled={isFull && !joined || joining}
                  >
                    {joining ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={[
                        styles.joinButtonText,
                        joined && styles.joinedButtonText
                      ]}>
                        {isFull && !joined ? 'Tournament Full' : 
                         joined ? 'Joined ✓' : 'Join Tournament'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
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
    paddingTop: Platform.OS === "android" ? 20 : 60,
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
    color: "#4CAF50",
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
  tournamentCard: {
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
  tournamentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sportIcon: {
    fontSize: 20,
  },
  statusContainer: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  tournamentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  tournamentDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  tournamentDetails: {
    marginBottom: 15,
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
  prizeContainer: {
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  prizeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9800",
    textAlign: "center",
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  joinedButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  joiningButton: {
    backgroundColor: "#81C784",
    opacity: 0.8,
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  joinedButtonText: {
    color: "#4CAF50",
  },
  joinButtonDisabled: {
    backgroundColor: "#A5D6A7",
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
    fontSize: 16,
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
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
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

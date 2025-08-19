import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../../contexts/UserContext";
import { Match, matchService } from "../../lib/supabase";

export default function FindMatchesScreen() {
  const { user } = useUser();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;
  const societyId = user?.society_id || null;

  useEffect(() => {
    fetchMatches();
  }, [societyId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!societyId) {
        setMatches([]);
        setLoading(false);
        return;
      }
      const data = await matchService.getMatchesBySociety(societyId);
      const hostedByOthers = data.filter(m => m.host_id !== userId && (m.status === 'upcoming' || m.status === 'ongoing'));
      setMatches(hostedByOthers);
    } catch (e) {
      console.error('Error fetching matches:', e);
      setError('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (matchId: string) => {
    try {
      if (!userId) {
        Alert.alert('Error', 'Please log in');
        return;
      }
      await matchService.joinMatch(matchId, userId);
      Alert.alert('Joined', 'You have joined the match');
      fetchMatches();
    } catch (e) {
      console.error('join failed', e);
      Alert.alert('Error', 'Failed to join match');
    }
  };

  const handleBack = () => router.back();

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3575EC" />
        <Text style={styles.loadingText}>Loading matches...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMatches}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Matches</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏟️</Text>
            <Text style={styles.emptyTitle}>No matches available</Text>
            <Text style={styles.emptyText}>Check back later or create a match from Home.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Hosted by others</Text>
            {matches.map((m) => (
              <View key={m.id} style={styles.card}>
                <View style={styles.cardLeft}>
                  <Text style={styles.sportIcon}>🎮</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{m.title}</Text>
                    <Text style={styles.cardSubtitle}>{m.venue}</Text>
                    <Text style={styles.cardTime}>{formatTime(m.scheduled_date)}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.joinBtn} onPress={() => handleJoin(m.id)}>
                  <Text style={styles.joinBtnText}>Join</Text>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 20 : 20, paddingHorizontal: 20, paddingBottom: 20,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E5E5'
  },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 24, color: '#3575EC' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  sportIcon: { fontSize: 28, marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  cardTime: { fontSize: 12, color: '#999', marginTop: 4 },
  joinBtn: { backgroundColor: '#3575EC', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  joinBtnText: { color: '#FFF', fontWeight: '600' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 6 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loadingText: { marginTop: 8, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#D00', marginBottom: 10 },
  retryButton: { backgroundColor: '#3575EC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#FFF', fontWeight: '600' },
});



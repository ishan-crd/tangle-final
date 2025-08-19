import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SvgXml } from 'react-native-svg';
import { useUser } from "../../contexts/UserContext";
import { ensureEmojiXmlLoaded, getEmojiXmlFromKey, isLikelyRemoteUri } from "../../lib/avatar";
import { supabase, UserProfile } from "../../lib/supabase";

export default function FindPeopleScreen() {
  const { user } = useUser();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => { ensureEmojiXmlLoaded(); }, []);

  useEffect(() => {
    fetchMembers();
  }, [user?.society_id, user?.society]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      let q = supabase
        .from('user_profiles')
        .select('id, full_name:name, avatar_url:avatar, interests, society, society_id')
        .neq('id', user?.id as string);
      if (user?.society_id) q = q.eq('society_id', user.society_id);
      else if (user?.society) q = q.eq('society', user.society);
      const { data, error } = await q;
      if (error) throw error;
      setMembers((data || []) as any);
    } catch (e) {
      console.error('Error fetching members', e);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(m => (m.name || '').toLowerCase().includes(q));
  }, [members, query]);

  const sameInterest = useMemo(() => {
    const myInterests = (user?.interests || []) as unknown as string[];
    if (!myInterests || myInterests.length === 0) return [] as UserProfile[];
    return members.filter(m => Array.isArray(m.interests) && m.interests.some(i => myInterests.includes(i)));
  }, [members, user?.interests]);

  const handleBack = () => router.back();

  const renderAvatar = (avatar?: string, name?: string) => {
    if (isLikelyRemoteUri(avatar)) return <Image source={{ uri: avatar as string }} style={styles.avatar} />;
    const xml = getEmojiXmlFromKey(avatar as any);
    if (xml) return <SvgXml xml={xml as string} width={48} height={48} />;
    return (
      <View style={styles.defaultAvatar}>
        <Text style={styles.defaultAvatarText}>{(name || '?').charAt(0).toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find People</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search people"
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3575EC" />
            <Text style={styles.loadingText}>Loading people...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>People in your society</Text>
            {filtered.slice(0, 20).map(p => (
              <View key={p.id} style={styles.personCard}>
                <View style={styles.personLeft}>
                  {renderAvatar((p as any).avatar_url, (p as any).full_name || (p as any).name)}
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.personName}>{(p as any).full_name || (p as any).name}</Text>
                    {(p as any).society && <Text style={styles.personSociety}>{(p as any).society}</Text>}
                  </View>
                </View>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>View</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.sectionTitle}>People with similar interests</Text>
            {sameInterest.slice(0, 20).map(p => (
              <View key={p.id} style={styles.personCard}>
                <View style={styles.personLeft}>
                  {renderAvatar((p as any).avatar_url, (p as any).full_name || (p as any).name)}
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.personName}>{(p as any).full_name || (p as any).name}</Text>
                    {Array.isArray(p.interests) && p.interests.length > 0 && (
                      <Text style={styles.personInterests}>{p.interests.slice(0, 3).join(', ')}</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>View</Text>
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
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  searchIcon: { fontSize: 18, marginRight: 10, color: '#666' },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 10, marginBottom: 10 },
  personCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  personLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  defaultAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  defaultAvatarText: { fontWeight: '700', color: '#666' },
  personName: { fontSize: 16, fontWeight: '700', color: '#000' },
  personSociety: { fontSize: 12, color: '#666', marginTop: 2 },
  personInterests: { fontSize: 12, color: '#666', marginTop: 2 },
  actionBtn: { backgroundColor: '#3575EC', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  actionBtnText: { color: '#FFF', fontWeight: '700' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loadingText: { marginTop: 8, color: '#666' },
});



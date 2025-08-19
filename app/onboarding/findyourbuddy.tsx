import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from 'react-native-svg';
import { useUser } from "../../contexts/UserContext";
import { ensureEmojiXmlLoaded, getEmojiXmlFromKey } from "../../lib/avatar";
import { supabase } from "../../lib/supabase";

SplashScreen.preventAutoHideAsync();
const { width } = Dimensions.get("window");


type Buddy = { id: string; name: string; avatar?: string };

export default function FindYourBuddy() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { user } = useUser();
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [sending, setSending] = useState<Set<string>>(new Set());
  const [requested, setRequested] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "NeuePlak-ExtendedBlack": require("../../assets/fonts/Neue-Plak-Extended-Black.ttf"),
          "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
          "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
        });
        await ensureEmojiXmlLoaded();
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Font loading error", error);
      }
    }

    loadFonts();
  }, []);

  useEffect(() => {
    if (!user?.society_id && !user?.society) return;
    fetchSocietyUsers();
  }, [user?.society_id, user?.society]);

  const fetchSocietyUsers = async () => {
    try {
      let query = supabase.from('user_profiles').select('id, name, avatar');
      if (user?.society_id) query = query.eq('society_id', user.society_id);
      else if (user?.society) query = query.eq('society', user.society);
      if (user?.id) query = query.neq('id', user.id);
      const { data, error } = await query.order('name');
      if (error) throw error;
      setBuddies((data || []).map(u => ({ id: u.id, name: u.name, avatar: u.avatar })));
    } catch (e) {
      console.error('Error loading buddies:', e);
      setBuddies([]);
    }
  };

  const getAvatarXml = (avatar?: string) => getEmojiXmlFromKey(avatar || undefined);

  const sendFriendRequest = async (friendId: string) => {
    if (!user?.id) return;
    try {
      setSending(prev => new Set(prev).add(friendId));
      const { error } = await supabase.from('friendships').insert([{ user_id: user.id, friend_id: friendId, status: 'pending' }]);
      if (error) throw error;
      setRequested(prev => { const n = new Set(prev); n.add(friendId); return n; });
    } catch (e) {
      console.error('Error sending request:', e);
    } finally {
      setSending(prev => { const n = new Set(prev); n.delete(friendId); return n; });
    }
  };

  const handleNext = () => {
    router.replace("/main");
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Find your buddy</Text>
        <Text style={styles.subtitle}>
          Here are some cool people in your society who share your interests.
          Tap on their profiles to say hello!
        </Text>

        {buddies.map((b) => (
          <View key={b.id} style={styles.card}>
            <View style={styles.userInfo}>
              {getAvatarXml(b.avatar) ? (
                <SvgXml xml={getAvatarXml(b.avatar) as string} width={40} height={40} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ fontWeight: '700', color: '#666' }}>{(b.name || '?').charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <Text style={styles.name}>{b.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => sendFriendRequest(b.id)}
              disabled={sending.has(b.id) || requested.has(b.id)}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>
                {sending.has(b.id) ? '…' : requested.has(b.id) ? '✓' : '+'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Enter App</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#000000",
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#FFF3B0",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#000000",
  },
  iconWrapper: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 8,
    minWidth: 36,
    alignItems: 'center'
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: "#fff",
  },
  nextButton: {
    backgroundColor: "#D5DAF5",
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#000000",
  },
});

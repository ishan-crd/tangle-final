import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SvgUri } from 'react-native-svg';
import { useUser } from "../../../contexts/UserContext";
import { getEmojiUriFromKey } from "../../../lib/avatar";
import { chatService, supabase } from "../../../lib/supabase";

interface ChatMessageUI {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export default function GroupChatScreen() {
  const { groupId, groupName, icon, color } = useLocalSearchParams<{ groupId: string; groupName?: string; icon?: string; color?: string }>();
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessageUI[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, { name: string; avatar?: string }>>({});
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputBarHeight, setInputBarHeight] = useState(0);
  const ANDROID_EXTRA_OFFSET = 36;
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    let channel: any;
    const load = async () => {
      setLoading(true);
      const recent = await chatService.getRecentMessages(groupId as string, 50);
      setMessages(recent.map(m => ({ id: m.id, user_id: m.sender_id, content: m.content || '', created_at: m.created_at })));
      const senderIds = Array.from(new Set(recent.map(m => m.sender_id)));
      if (senderIds.length > 0) {
        const { data: profs } = await supabase.from('user_profiles').select('id, name, avatar').in('id', senderIds);
        const map: Record<string, { name: string; avatar?: string }> = {};
        (profs || []).forEach(p => { map[p.id] = { name: p.name, avatar: p.avatar }; });
        setProfiles(map);
      }
      channel = chatService.subscribeToGroupMessages(groupId as string, async (m) => {
        setMessages(prev => [...prev, { id: m.id, user_id: m.sender_id, content: m.content || '', created_at: m.created_at }]);
        if (!profiles[m.sender_id]) {
          const { data } = await supabase.from('user_profiles').select('id, name, avatar').eq('id', m.sender_id).single();
          if (data) setProfiles(prev => ({ ...prev, [data.id]: { name: data.name, avatar: data.avatar } }));
        }
      });
      setHasSubscribed(true);
      setLoading(false);
    };
    load();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [groupId]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates?.height || 0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    // Optimistic UI if realtime subscription isn't active yet
    if (!hasSubscribed) {
      setMessages(prev => [...prev, { id: `temp-${Date.now()}`, user_id: user?.id as string, content: text, created_at: new Date().toISOString() }]);
      if (user?.id && !profiles[user.id]) {
        setProfiles(prev => ({ ...prev, [user.id!]: { name: user?.name || 'Me', avatar: user?.avatar } }));
      }
    }
    try {
      const saved = await chatService.sendTextMessage(groupId as string, user?.id as string, text);
      setMessages(prev => {
        if (prev.some(m => m.id === saved.id)) return prev;
        return [...prev, { id: saved.id, user_id: saved.sender_id, content: saved.content || '', created_at: saved.created_at }];
      });
    } catch (e) {
      // no-op; you can surface error toast here
    }
  };

  const renderItem = ({ item }: { item: ChatMessageUI }) => {
    const isMe = item.user_id === user?.id;
    const profile = profiles[item.user_id];
    const avatarUri = profile?.avatar;
    const emojiUri = getEmojiUriFromKey(avatarUri);
    const initials = (profile?.name || '?').charAt(0).toUpperCase();
    return (
      <View style={[styles.messageRow, isMe ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
        {!isMe && (
          avatarUri && !emojiUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : emojiUri ? (
            <SvgUri uri={emojiUri} width={32} height={32} />
          ) : (
            <View style={styles.defaultAvatar}><Text style={styles.defaultAvatarText}>{initials}</Text></View>
          )
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={styles.bubbleText}>{item.content}</Text>
        </View>
        {isMe && (
          avatarUri && !emojiUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : emojiUri ? (
            <SvgUri uri={emojiUri} width={32} height={32} />
          ) : (
            <View style={styles.defaultAvatar}><Text style={styles.defaultAvatarText}>{initials}</Text></View>
          )
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={[styles.groupBadge, { backgroundColor: (color as string) || '#EEE' }]}>
          <Text style={styles.groupIcon}>{(icon as string) || '💬'}</Text>
        </View>
        <Text style={styles.title}>{groupName || 'Group Chat'}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        ref={listRef as any}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ 
          padding: 16,
          paddingBottom: (
            Platform.OS === 'android'
              ? ((keyboardHeight > 0 ? keyboardHeight + ANDROID_EXTRA_OFFSET : 0) + inputBarHeight + 16)
              : (inputBarHeight + 16)
          )
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      <View 
        style={[
          styles.inputBar, 
          Platform.OS === 'android'
            ? { position: 'absolute', left: 0, right: 0, bottom: (keyboardHeight > 0 ? keyboardHeight + ANDROID_EXTRA_OFFSET : 0), marginBottom: 0 }
            : null
        ]}
        onLayout={(e) => setInputBarHeight(e.nativeEvent.layout.height)}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
          value={input}
          onChangeText={setInput}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingTop: Platform.OS === 'android' ? 20 : 60, paddingBottom: 12, paddingHorizontal: 16, alignItems: 'center' },
  backButton: { position: 'absolute', left: 16, top: Platform.OS === 'android' ? 20 : 60, padding: 8 },
  backText: { fontSize: 22, fontWeight: 'bold' },
  groupBadge: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  groupIcon: { fontSize: 28 },
  title: { fontSize: 18, fontWeight: '700' },
  bubble: { maxWidth: '80%', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 22 },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: '#CDE6DA' },
  bubbleOther: { alignSelf: 'flex-start', backgroundColor: '#F6D6C6' },
  bubbleText: { fontSize: 16 },
  inputBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EEE', padding: 12, gap: 8, marginBottom: 7 },
  textInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 24, paddingHorizontal: 16, height: 44 },
  sendButton: { backgroundColor: '#000', paddingHorizontal: 16, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: '#FFF', fontWeight: '600' },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  defaultAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center' },
  defaultAvatarText: { fontWeight: '700', color: '#666' }
});



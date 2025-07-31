import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MainIndex() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to the tabs layout
    router.replace("/main/(tabs)/home");
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
}); 
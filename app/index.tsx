import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Tangle!</Text>
      <Text style={styles.subtitle}>Your sports social app</Text>
      <View 
        style={styles.button}
        onTouchEnd={() => router.push("/main")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </View>
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
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#3575EC",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    color: "#666666",
    fontSize: 14,
    marginTop: 20,
  },
}); 
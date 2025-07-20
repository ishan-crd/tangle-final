import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="signupscreen" />
      <Stack.Screen name="numbersignup" />
      <Stack.Screen name="otpverify" />
      <Stack.Screen name="profilebasic" />
      <Stack.Screen name="addressscreen" />
      <Stack.Screen name="interestscreen" />
      <Stack.Screen name="aboutyou" />
      <Stack.Screen name="EmojiAvatarScreen" />
    </Stack>
  );
}

import { StyleSheet, Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";
import { getAuthState } from "@/store/auth";
import { View } from "react-native";
import { Colors } from "@/constants/Colors";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function AppLayout() {
  const { loggedIn, busy } = useSelector(getAuthState);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (busy) {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: Colors.light.background,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <LoadingAnimation />
      </View>
    );
  }

  if (!loggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="search-user-to-chat"
        options={{ headerShown: true, headerTitle: "Search User" }}
      />

      <Stack.Screen
        name="(chat)/[user_id].tsx"
        options={{ headerShown: true }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  return (
    <ScreenWrapper>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Chats</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/(auth)/register" style={styles.newGroupLink}>
          Create Group
        </Link>
      </ThemedView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  newGroupLink: {
    color: Colors.light.tabIconSelected,
    textDecorationLine: "underline",
  },
});

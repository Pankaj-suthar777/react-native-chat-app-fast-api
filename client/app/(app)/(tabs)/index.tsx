import { Image, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Link, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useFetchMyChats } from "@/hooks/query";
import { User } from "@/@types/user";

export default function HomeScreen() {
  const { data } = useFetchMyChats();
  console.log(data);

  const onPress = (chat_id: number, user: User) => {
    router.navigate(`/(app)/(chat)/(my-chat)/${chat_id}?name=${user.username}`);
  };

  return (
    <ScreenWrapper>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Chats</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/(auth)/register" style={styles.newGroupLink}>
          Create Group
        </Link>
        {data?.map((info) => (
          <Pressable
            className="border-b border-b-gray-200"
            onPress={() => onPress(info.chat_id, info.other_user)}
          >
            <View className="flex flex-row items-center py-4 w-full">
              <View className="w-12 h-12 mr-4">
                <Image
                  className="rounded-full object-cover h-full w-full"
                  source={{
                    uri: "https://randomuser.me/api/portraits/women/72.jpg",
                  }}
                />
              </View>
              <View className="w-full">
                <ThemedText className="text-md font-medium text-gray-800">
                  {info.other_user.username}
                </ThemedText>
                <ThemedText type="default" className="text-gray-600 text-xs">
                  {info.last_message}
                </ThemedText>
              </View>
            </View>
          </Pressable>
        ))}
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

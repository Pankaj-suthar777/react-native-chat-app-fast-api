import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ScreenWrapper from "@/components/ScreenWrapper";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useFetchMyChats } from "@/hooks/query";
import { User } from "@/@types/user";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function HomeScreen() {
  const { data } = useFetchMyChats();
  const { profile } = useSelector((state: RootState) => state.auth);

  const onPress = (chat_id: number, user: User) => {
    router.navigate(
      `/(app)/(chat)/(my-chat)/${chat_id}?name=${user.username}` as any
    );
  };
  return (
    <ScreenWrapper>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Chats</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {data?.map((info, i) => (
          <Pressable
            key={i}
            className="flex-row items-center py-2"
            onPress={() => onPress(info.chat_id, info.other_user)}
          >
            <View className="w-12 h-12 mr-4">
              <Image
                className="rounded-full object-cover h-full w-full"
                source={{
                  uri: info.other_user.avatar
                    ? info.other_user.avatar
                    : "https://randomuser.me/api/portraits/women/72.jpg",
                }}
              />
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <ThemedText className="text-sm font-medium text-gray-800">
                  {info.other_user.username}
                </ThemedText>
                <View className="justify-center items-center relative">
                  <ThemedText className="text-gray-600 text-xs mb-2">
                    {moment(info.created_at).format("LT")}
                  </ThemedText>
                  {info.total_unseen_message > 0 &&
                  parseInt(info.last_message_send_by) !== profile?.id ? (
                    <View className="h-5 w-5 bg-green-500 justify-center items-center rounded-full absolute top-5">
                      <Text className="text-white text-xs">
                        {info.total_unseen_message}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <ThemedText className="text-gray-600 text-xs mt-1">
                {info.last_message}
              </ThemedText>
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
    marginBottom: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  newGroupLink: {
    color: Colors.light.tabIconSelected,
    textDecorationLine: "underline",
  },
});

import { ImageBackground, StyleSheet, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import MessageBubble from "@/components/MessageBubble";
import { ChatInfoResponse, useFetchChatInfo } from "@/hooks/query";
import { useSelector } from "react-redux";
import { getAuthState } from "@/store/auth";
import { getClient } from "@/api/client";
import { QueryClient, useQueryClient } from "react-query";

const Chat = () => {
  const [text, setText] = useState("");

  const { chat_id, name } = useLocalSearchParams();
  const navigation = useNavigation();
  const { profile } = useSelector(getAuthState);

  const { data, isLoading } = useFetchChatInfo(parseInt(chat_id as string));

  const queryClient = useQueryClient();

  const friend = data?.friend_info;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: friend?.username || name,
      headerShown: true,
      headerRight: () => (
        <TabBarIcon
          name="settings"
          size={25}
          className="mx-4"
          color={Colors.light.tabIconSelected}
          onPress={() => {
            router.navigate(`/(app)/(profile)/${data?.friend_info.id}` as any);
          }}
        />
      ),
    });
  }, [navigation]);

  const sendMessage = async () => {
    const client = await getClient();
    const { data } = await client.post<{ chat_id: number }>(
      "/message/send-message",
      {
        receiver_id: friend?.id,
        content: text,
      }
    );
    setText("");
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={{
          uri: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsb2ZmaWNlMTBfZmx1aWRfYWJzdHJhY3Rpb25fYmFja2dyb3VuZF9faGludF9vZl9wcmVjaXNpb18wMjk5YmM1ZS0yNjAyLTQxODgtOTExMy1kZTVkZTk1YWVmN2FfMS5qcGc.jpg",
        }}
        className="flex-1 bg-slate-800 p-2"
      >
        {data?.messages?.map((msg) => {
          const sender_id = msg.sender_id;
          return (
            <MessageBubble
              content={msg.content}
              type={
                sender_id === profile?.id
                  ? "my-message"
                  : "other-person-message"
              }
            />
          );
        })}
      </ImageBackground>
      <View className="h-12 justify-center px-2 flex-row w-full items-center">
        <AntDesign name="plus" size={24} />
        <TextInput
          value={text}
          onChangeText={(e) => setText(e)}
          className="w-[75%] border border-black text-lg px-4 rounded-full py-0.5 mx-4"
        />
        {text ? (
          <Feather name="send" size={24} onPress={sendMessage} />
        ) : (
          <Feather name="camera" size={24} />
        )}
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});

import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { useMutation, useQueryClient } from "react-query";
import { Message } from "@/@types/message";

const Chat = () => {
  const [text, setText] = useState("");

  const { chat_id, name } = useLocalSearchParams();
  const navigation = useNavigation();
  const { profile } = useSelector(getAuthState);

  const { data, isLoading } = useFetchChatInfo(parseInt(chat_id as string));

  const queryClient = useQueryClient();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [data?.messages]);

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
    const { data } = await client.post<{
      chat_id: number;
      message_id: number;
      newMessage: Message;
    }>("/message/send-message", {
      receiver_id: friend?.id,
      content: text,
    });
    return data;
  };

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      const existingChatInfo = queryClient.getQueryData<ChatInfoResponse>([
        "get-chat-info",
        parseInt(chat_id as string),
      ]);

      console.log("existingChatInfo", existingChatInfo);

      if (existingChatInfo) {
        const updatedMessages = [...existingChatInfo.messages, data.newMessage];

        queryClient.setQueryData(
          ["get-chat-info", parseInt(chat_id as string)],
          {
            ...existingChatInfo,
            messages: updatedMessages,
          }
        );
      } else {
        queryClient.refetchQueries(["get-chat-info", chat_id]);
      }

      setText("");
    },
  });

  return (
    <View className="flex-1">
      <ImageBackground
        source={{
          uri: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsb2ZmaWNlMTBfZmx1aWRfYWJzdHJhY3Rpb25fYmFja2dyb3VuZF9faGludF9vZl9wcmVjaXNpb18wMjk5YmM1ZS0yNjAyLTQxODgtOTExMy1kZTVkZTk1YWVmN2FfMS5qcGc.jpg",
        }}
        className="flex-1 bg-slate-800 p-2"
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <ScrollView ref={scrollViewRef} className="flex-1">
            {data?.messages?.map((msg, i) => {
              const sender_id = msg.sender_id;
              return (
                <MessageBubble
                  key={i}
                  content={msg.content}
                  type={
                    sender_id === profile?.id
                      ? "my-message"
                      : "other-person-message"
                  }
                />
              );
            })}
          </ScrollView>
        )}
      </ImageBackground>
      <View className="h-12 justify-center px-2 flex-row w-full items-center">
        <AntDesign name="plus" size={24} />
        <TextInput
          value={text}
          onChangeText={(e) => setText(e)}
          className="w-[75%] border border-black text-lg px-4 rounded-full py-0.5 mx-4"
        />
        {text ? (
          <Feather name="send" size={24} onPress={() => mutation.mutate()} />
        ) : (
          <Feather name="camera" size={24} />
        )}
      </View>
    </View>
  );
};

export default Chat;
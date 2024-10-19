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
import { useWebSocket } from "@/hooks/WebSocketContext";

const Chat = () => {
  const [text, setText] = useState("");
  const { chat_id, name } = useLocalSearchParams();
  const navigation = useNavigation();
  const { profile } = useSelector(getAuthState);
  const { sendMessage } = useWebSocket();

  const { data, isLoading } = useFetchChatInfo(parseInt(chat_id as string));
  const queryClient = useQueryClient();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (data?.messages) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
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
            router.navigate(`/(app)/(profile)/${friend?.id}` as any);
          }}
        />
      ),
    });
  }, [navigation, friend]);

  const mutation = useMutation({
    mutationFn: async () => {
      const client = await getClient();
      try {
        const { data } = await client.post<{
          chat_id: number;
          message_id: number;
          newMessage: Message;
        }>("/message/send-message", {
          receiver_id: friend?.id,
          content: text,
        });
        return data;
      } catch (error: any) {
        console.log("API Error:", error.message);
      }
    },
    onSuccess: (data: any) => {
      const existingChatInfo = queryClient.getQueryData<ChatInfoResponse>([
        "get-chat-info",
        parseInt(chat_id as string),
      ]);

      if (existingChatInfo) {
        const updatedMessages = [...existingChatInfo.messages, data.newMessage];

        queryClient.setQueryData(
          ["get-chat-info", parseInt(chat_id as string)],
          {
            ...existingChatInfo,
            messages: updatedMessages,
          }
        );
        queryClient.invalidateQueries(["get-my-chats"]);
      } else {
        queryClient.refetchQueries(["get-chat-info", chat_id]);
        queryClient.invalidateQueries(["get-my-chats"]);
      }

      setText("");
    },
  });

  const handleSend = async () => {
    sendMessage(text, parseInt(chat_id as string));
    mutation.mutate();
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <>
      <ImageBackground
        source={{
          uri: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsb2ZmaWNlMTBfZmx1aWRfYWJzdHJhY3Rpb25fYmFja2dyb3VuZF9faGludF9vZl9wcmVjaXNpb18wMjk5YmM1ZS0yNjAyLTQxODgtOTExMy1kZTVkZTk1YWVmN2FfMS5qcGc.jpg",
        }}
        className="flex-1 bg-slate-800 px-2"
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
          <Feather name="send" size={24} onPress={handleSend} />
        ) : (
          <Feather name="camera" size={24} />
        )}
      </View>
    </>
  );
};

export default Chat;

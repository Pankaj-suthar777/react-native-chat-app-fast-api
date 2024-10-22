import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
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
import {
  ChatInfoResponse,
  useFetchChatInfo,
  MyChatsResponse,
} from "@/hooks/query";
import { useSelector } from "react-redux";
import { getAuthState } from "@/store/auth";
import { getClient } from "@/api/client";
import { useMutation, useQueryClient } from "react-query";
import { Message } from "@/@types/message";
import { useWebSocket } from "@/hooks/WebSocketContext";
import AddImage from "@/components/chat/AddImage";

const Chat = () => {
  const [text, setText] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

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
      const formData = new FormData();

      formData.append("receiver_id", String(friend?.id));
      formData.append("content", text);

      if (previewImage) {
        const imageName = previewImage.split("/").pop();
        const response = await fetch(previewImage);
        const blob = await response.blob();

        // @ts-expect-error
        formData.append("image", {
          uri: previewImage,
          name: imageName,
          type: blob.type,
        });
      }

      try {
        const { data } = await client.post<{
          chat_id: number;
          message_id: number;
          newMessage: Message;
        }>("/message/send-message", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
        console.log("newMessage", data.newMessage);
        queryClient.setQueryData(
          ["get-chat-info", parseInt(chat_id as string)],
          {
            ...existingChatInfo,
            messages: updatedMessages,
          }
        );
      } else {
        queryClient.refetchQueries(["get-chat-info", chat_id]);
        queryClient.invalidateQueries(["get-my-chats"]);
      }

      setText("");
      setPreviewImage("");
    },
  });

  const handleSend = async () => {
    sendMessage(text, parseInt(chat_id as string));
    mutation.mutate();
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    queryClient.setQueryData(
      ["get-my-chats"],
      (oldData?: MyChatsResponse[]) => {
        if (oldData) {
          const newData = oldData.map((o) => {
            if (o.chat_id === parseInt(chat_id as string)) {
              const newData: MyChatsResponse = {
                ...o,
                total_unseen_message: 0,
              };
              return newData;
            } else {
              return o;
            }
          });
          return newData;
        }
        return [];
      }
    );
  }, [chat_id, queryClient]);

  const handleImagePress = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setIsImagePreviewVisible(true);
  };

  const closeImagePreview = () => {
    setPreviewImageUrl("");
    setIsImagePreviewVisible(false);
  };

  return (
    <>
      <ImageBackground
        source={require("../../../../assets/images/1.jpg")}
        className="flex-1 bg-slate-800 relative"
      >
        <Modal
          visible={isImagePreviewVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.previewContainer}>
            <Pressable style={styles.closeButton} onPress={closeImagePreview}>
              <AntDesign name="close" size={30} color="#fff" />
            </Pressable>
            <Image
              source={{ uri: previewImageUrl }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <ScrollView ref={scrollViewRef} className="flex-1 px-2">
            {data?.messages?.map((msg, i) => {
              const sender_id = msg.sender_id;
              const image = msg.image_url;
              return (
                <MessageBubble
                  handleImagePress={handleImagePress}
                  key={i}
                  image={image}
                  content={msg.content}
                  created_at={msg.created_at}
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
        {previewImage && (
          <View className="absolute bottom-0 w-full h-[50%] flex-1 left-0 right-0 p-4 bg-green-200">
            <Image
              source={{ uri: previewImage }}
              resizeMode="contain"
              className="h-full w-full z-10"
            />
            <Pressable
              className="top-2 right-2 absolute z-20 bg-slate-100 p-1 rounded-full"
              onPress={() => setPreviewImage("")}
            >
              <AntDesign name="close" size={24} />
            </Pressable>
          </View>
        )}
        {previewImage && <View className="h-[50%]" />}
      </ImageBackground>
      <View className="h-12 justify-center px-2 flex-row w-full items-center">
        <AddImage
          setPreviewImage={setPreviewImage}
          scrollViewRef={scrollViewRef}
        />
        <TextInput
          onFocus={(e) => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2ff",
  },
  messageInputView: {
    flexDirection: "row",
    marginHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  previewImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 1.5,
  },
});

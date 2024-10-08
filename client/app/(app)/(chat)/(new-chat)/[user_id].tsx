import {
  ImageBackground,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { getClient } from "@/api/client";

const Chat = () => {
  const [text, setText] = useState("");

  const { user_id, name } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name || "",
      headerShown: true,
      headerRight: () => (
        <TabBarIcon
          name="settings"
          size={25}
          className="mx-4"
          color={Colors.light.tabIconSelected}
          onPress={() => {
            router.navigate(`/(app)/(profile)/${user_id}` as any);
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
        receiver_id: user_id,
        content: text,
      }
    );
    setText("");
    console.log(data);
    router.replace(
      `/(app)/(chat)/(my-chat)/${data?.chat_id}?name=${name}` as any
    );
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={{
          uri: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsb2ZmaWNlMTBfZmx1aWRfYWJzdHJhY3Rpb25fYmFja2dyb3VuZF9faGludF9vZl9wcmVjaXNpb18wMjk5YmM1ZS0yNjAyLTQxODgtOTExMy1kZTVkZTk1YWVmN2FfMS5qcGc.jpg",
        }}
        className="flex-1 bg-slate-800 p-2"
      >
        {/* <MessageBubble type="my-message" />
        <MessageBubble type="other-person-message" />
        <MessageBubble type="system" /> */}
      </ImageBackground>
      <View className="h-12 justify-center px-2 flex-row w-full items-center">
        <AntDesign name="plus" size={24} />
        <TextInput
          value={text}
          onChangeText={(e) => setText(e)}
          className="w-[75%] border border-black text-lg px-4 rounded-full py-0.5 mx-4"
        />
        {text ? (
          <Pressable onPress={sendMessage}>
            <Feather name="send" size={24} />
          </Pressable>
        ) : (
          <Feather name="camera" size={24} />
        )}
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});

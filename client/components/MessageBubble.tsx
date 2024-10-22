import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import moment from "moment";

type type = "system" | "my-message" | "other-person-message";

interface Props {
  type: type;
  content: string;
  created_at: string;
  image?: string;
  handleImagePress: (imageUrl: string) => void;
}

const MessageBubble = (props: Props) => {
  const { type, content, created_at, image, handleImagePress } = props;
  let extraClassName = "p-3 rounded-lg shadow-sm";
  let extraTextClass = "text-sm";

  switch (type) {
    case "my-message":
      extraClassName = extraClassName + " bg-green-200 ml-auto rounded-br-none";
      break;
    case "other-person-message":
      extraClassName = extraClassName + " bg-white mr-auto rounded-bl-none";
      break;
    case "system":
      extraClassName =
        extraClassName + " bg-gray-100 w-full max-w-full opacity-80";
      extraTextClass = extraTextClass + " text-center text-xs text-gray-500";
      break;
  }

  return (
    <View className="w-full flex flex-row mb-3">
      <View className={`max-w-[70%] ${extraClassName}`}>
        {image && (
          <Pressable onPress={() => handleImagePress(image)}>
            <Image
              source={{ uri: image }}
              className="h-[200px] w-[220px] rounded-lg shadow-lg"
            />
          </Pressable>
        )}
        <Text className={`${extraTextClass} text-gray-800`}>{content}</Text>
        {created_at && (
          <Text className="text-[10px] text-gray-400 mt-1">
            {moment(created_at).format("LT")}
          </Text>
        )}
      </View>
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({});

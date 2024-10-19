import { StyleSheet, Text, View } from "react-native";
import React from "react";

type type = "system" | "my-message" | "other-person-message";

interface Props {
  type: type;
  content: string;
}

const MessageBubble = (props: Props) => {
  const { type, content } = props;

  let extraClassName = "flex-row p-2 rounded-lg";
  let extraTextClass = "";

  switch (type) {
    case "my-message":
      extraClassName =
        extraClassName + " flex-end bg-green-200 ml-auto rounded-br-none";
      break;
    case "other-person-message":
      extraClassName =
        extraClassName + " flex-start bg-white mr-auto rounded-bl-none";
      break;
    case "system":
      extraClassName =
        extraClassName + " bg-white w-full max-w-full opacity-[0.8]";
      extraTextClass = extraTextClass + " text-center w-full text-xs";
      break;
  }

  return (
    <View className="w-full flex-row mb-4">
      <View className={`max-w-[60%] ${extraClassName}`}>
        <Text className={extraTextClass}>{content}</Text>
      </View>
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({});

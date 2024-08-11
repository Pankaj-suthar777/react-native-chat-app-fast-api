import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import React from "react";
import LoadingAnimation from "./LoadingAnimation";

interface Props {
  loading?: boolean;
  disable?: boolean;
  label: string;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
}

const Button = (props: Props) => {
  const { disable = false, label, loading = false, onPress } = props;
  return (
    <Pressable
      onPress={disable ? () => {} : onPress}
      className={`w-ull h-10 justify-center items-center ${
        loading ? "bg-gray-800" : "bg-black"
      } flex-row`}
    >
      {loading ? (
        <LoadingAnimation />
      ) : (
        <Text className="text-white ml-4">{label}</Text>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({});

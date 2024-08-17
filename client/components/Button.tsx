import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import React, { ReactNode } from "react";
import LoadingAnimation from "./LoadingAnimation";

interface Props {
  loading?: boolean;
  disable?: boolean;
  label: string;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  style?: StyleProp<ViewStyle>;
  styleForText?: StyleProp<ViewStyle>;
  icon?: ReactNode;
}

const Button = (props: Props) => {
  const {
    disable = false,
    label,
    loading = false,
    onPress,
    style,
    styleForText,
    icon,
  } = props;

  return (
    <Pressable
      onPress={disable ? () => {} : onPress}
      className={`w-ull h-10 justify-center items-center ${
        loading ? "bg-gray-800" : "bg-black"
      } flex-row`}
      style={style}
    >
      {loading ? (
        <LoadingAnimation />
      ) : (
        <View className="flex-row px-4">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`text-white ${styleForText}`}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({});

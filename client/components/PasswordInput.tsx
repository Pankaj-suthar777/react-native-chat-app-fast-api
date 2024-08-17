import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface Props {
  label?: string;
  placeholder?: string;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  rightIcon?: ReactNode;
  onRightIconPress?(): void;
  errorMsg?: string;
  onChange?: ((text: string) => void) | undefined;
  showForgotPassword?: boolean;
  value: string;
}

const PasswordInput = (props: Props) => {
  const {
    label,
    placeholder,
    autoCapitalize,
    keyboardType,
    errorMsg,
    onChange,
    showForgotPassword,
    value,
  } = props;

  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const inputTransformValue = useSharedValue(0);

  const shakeUI = () => {
    inputTransformValue.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withSpring(0, {
        damping: 8,
        mass: 0.5,
        stiffness: 1000,
        restDisplacementThreshold: 0.1,
      })
    );
  };

  const inputStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: inputTransformValue.value,
        },
      ],
    };
  });

  useEffect(() => {
    if (errorMsg) {
      shakeUI();
    }
  }, [errorMsg]);

  return (
    <Animated.View style={[inputStyles]}>
      <View className="mb-2 justify-between flex-row">
        <ThemedText>{label}</ThemedText>
        {showForgotPassword ? (
          <ThemedText type="default" className="underline">
            Forgot Password?
          </ThemedText>
        ) : null}
      </View>

      <View className="flex-row w-full h-10 bg-slate-200 focus:bg-slate-300 border border-slate-300 rounded-lg">
        <View className="h-full justify-center pl-2">
          <Ionicons name="lock-closed" size={18} />
        </View>
        <TextInput
          passwordRules={"true"}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onChangeText={onChange}
          value={value}
          className="rounded-none h-full text-lg px-2 w-full"
        />
        <Pressable
          className="h-full justify-center absolute right-4"
          onPress={() => setSecureTextEntry(!secureTextEntry)}
        >
          {secureTextEntry ? (
            <Ionicons name="eye" size={18} />
          ) : (
            <Ionicons name="eye-off" size={18} />
          )}
        </Pressable>
      </View>
      {errorMsg ? (
        <View className="mt-1 bg-red-100 p-2">
          <Text className="text-red-500">{errorMsg}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
};

export default PasswordInput;

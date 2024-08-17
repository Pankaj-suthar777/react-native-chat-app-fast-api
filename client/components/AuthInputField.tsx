import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import React, { ReactNode, useEffect } from "react";
import { ThemedText } from "./ThemedText";
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
  secureTextEntry?: boolean;
  rightIcon?: ReactNode;
  onRightIconPress?(): void;
  errorMsg?: string;
  onChange?: ((text: string) => void) | undefined;
  value?: string | undefined;
  iconLabel?: React.ReactNode;
}

const AuthInputField = (props: Props) => {
  const {
    label,
    placeholder,
    autoCapitalize,
    keyboardType,
    secureTextEntry,
    errorMsg,
    onChange,
    value,
    iconLabel,
  } = props;

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
      <ThemedText className="mb-2">{label}</ThemedText>
      <View className="flex-row w-full h-10 bg-slate-200 focus:bg-slate-300 border border-slate-300 rounded-lg">
        {iconLabel ? (
          <View className="h-full justify-center pl-2">{iconLabel}</View>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChange}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          className="w-full rounded-none h-full text-lg px-2"
        />
      </View>
      {errorMsg ? (
        <View className="mt-1 bg-red-100 p-2">
          <Text className="text-red-500">{errorMsg}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
};

export default AuthInputField;

const styles = StyleSheet.create({});

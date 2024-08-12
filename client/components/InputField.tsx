import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import React, { ReactNode } from "react";
import { ThemedText } from "./ThemedText";

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

const InputField = (props: Props) => {
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

  return (
    <View>
      {label && <ThemedText className="mb-2">{label}</ThemedText>}
      <View className="w-full h-10 bg-slate-300 border border-slate-300">
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
          className="w-full rounded-none h-full text-lg px-4"
        />
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({});

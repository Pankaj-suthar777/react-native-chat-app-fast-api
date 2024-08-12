import { Text, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import AuthInputField from "@/components/AuthInputField";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import client from "@/api/client";
import Toast from "react-native-toast-message";
import { Keys, saveToAsyncStorage } from "@/utils/asyncStorage";
import { updateLoggedInState, updateProfile } from "@/store/auth";
import { useDispatch } from "react-redux";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password should be at least 6 characters."),
});

const login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const dispatch = useDispatch();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { data } = await client.post("/auth/login", {
        ...values,
      });

      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.access_token);

      dispatch(updateProfile(data.profile));
      dispatch(updateLoggedInState(true));
      router.replace("/(app)/about");
      Toast.show({
        type: "success",
        text1: data.message,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail;
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="w-[90%]">
        <ThemedText type="title">Login</ThemedText>
        <ThemedText type="default" className="mb-4 mt-2">
          Enter your email and password below to log into your account
        </ThemedText>
        <View className="mb-4">
          <Controller
            control={control}
            name={"email"}
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthInputField
                onChange={onChange}
                value={value}
                iconLabel={<MaterialCommunityIcons name="email" size={18} />}
                label="Email"
                placeholder="name@example.com"
                errorMsg={errors.email?.message}
              />
            )}
          />
        </View>
        <View className="mb-4">
          <Controller
            control={control}
            name={"password"}
            render={({ field: { value, onChange, onBlur } }) => (
              <PasswordInput
                onChange={onChange}
                value={value}
                placeholder="********"
                showForgotPassword={true}
                label="Password"
                errorMsg={errors.password?.message}
              />
            )}
          />
        </View>
        <Button
          loading={isSubmitting}
          disable={isSubmitting}
          label="Submit"
          onPress={handleSubmit(onSubmit)}
        />
        <View className="flex-row mt-4 justify-center w-full">
          <Text>Don't have an account </Text>
          <Link href={"/(auth)/register"} className="underline">
            sign up?
          </Link>
        </View>
      </View>
    </View>
  );
};

export default login;

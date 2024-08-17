import { Text, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import AuthInputField from "@/components/AuthInputField";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import client from "@/api/client";
import catchAsyncError from "@/api/catchError";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { Keys, saveToAsyncStorage } from "@/utils/asyncStorage";
import { updateLoggedInState, updateProfile } from "@/store/auth";

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, { message: "username is required" }),
  password: z.string().min(6, "Password should be at least 6 characters."),
});

const register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const dispatch = useDispatch();

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const { data } = await client.post("/auth/register", {
        ...values,
      });

      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.access_token);

      dispatch(updateProfile(data.profile));
      dispatch(updateLoggedInState(true));

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
        <ThemedText type="title">Register</ThemedText>
        <ThemedText type="default" className="mb-4 mt-2">
          Enter your email and password below to log into your account
        </ThemedText>
        <View className="mb-4">
          <Controller
            control={control}
            name={"username"}
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthInputField
                autoCapitalize={"none"}
                onChange={onChange}
                value={value}
                iconLabel={<Feather name="user" size={18} />}
                label="Username"
                placeholder="username"
                errorMsg={errors.username?.message}
              />
            )}
          />
        </View>
        <View className="mb-4">
          <Controller
            control={control}
            name={"email"}
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthInputField
                autoCapitalize={"none"}
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
                autoCapitalize={"none"}
                onChange={onChange}
                value={value}
                placeholder="********"
                showForgotPassword={false}
                label="Password"
                errorMsg={errors.password?.message}
              />
            )}
          />
        </View>
        <Button
          label="Submit"
          loading={isSubmitting}
          disable={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
        <View className="flex-row mt-4 justify-center w-full">
          <Text>Already have an account </Text>
          <Link href={"/(auth)/login"} className="underline">
            sign in?
          </Link>
        </View>
      </View>
    </View>
  );
};

export default register;

import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import InputField from "./InputField";
import Button from "./Button";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { getAuthState, updateProfile } from "@/store/auth";
import { getClient } from "@/api/client";
import Toast from "react-native-toast-message";
import { useState } from "react";

interface Props {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const infoSchema = z.object({
  username: z.string().min(1, { message: "username is required" }).optional(),
  bio: z
    .string()
    .min(6, "bio should be at least 6 characters.")
    .or(z.literal("")),
});

const ProfileInfoChangeForm = ({ setModalVisible }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const { profile } = useSelector(getAuthState);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || "",
    },
    resolver: zodResolver(infoSchema),
  });

  const onSubmit = async (values: z.infer<typeof infoSchema>) => {
    setLoading(true);
    const client = await getClient();
    console.log(values);
    try {
      const { data } = await client.put("/user/update-user", { ...values });
      console.log(data);
      setModalVisible(false);

      dispatch(updateProfile(data.userInfo));
      Toast.show({
        type: "success",
        text1: data.message,
      });
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.detail;
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View className="mt-4 mb-4">
        <ThemedText type="defaultSemiBold" className="mb-2">
          Username
        </ThemedText>
        <Controller
          control={control}
          name={"username"}
          render={({ field: { value, onChange, onBlur } }) => (
            <InputField
              placeholder="Username"
              onChange={onChange}
              value={value}
              errorMsg={errors?.username?.message}
            />
          )}
        />
      </View>
      <View className="mb-4">
        <ThemedText type="defaultSemiBold" className="mb-2">
          Bio
        </ThemedText>
        <Controller
          control={control}
          name={"bio"}
          render={({ field: { value, onChange, onBlur } }) => (
            <InputField
              placeholder="Bio"
              onChange={onChange}
              value={value}
              errorMsg={errors?.bio?.message}
            />
          )}
        />
      </View>
      <View className="flex-row justify-between w-full">
        <Button
          onPress={() => setModalVisible(false)}
          label="Cancel"
          style={{ width: "48%", backgroundColor: "#EE4B2B" }}
        />
        <Button
          loading={isLoading}
          label="Save Changes"
          style={{ width: "48%" }}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

export default ProfileInfoChangeForm;

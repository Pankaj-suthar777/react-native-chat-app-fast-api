import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  Pressable,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { getAuthState, updateLoggedInState, updateProfile } from "@/store/auth";
import InputField from "@/components/InputField";
import ProfileInfoChangeForm from "@/components/ProfileInfoChangeForm";
import { useState } from "react";
import PopUpModal from "@/components/PopUpModal";
import * as ImagePicker from "expo-image-picker";
import { getClient } from "@/api/client";
import axios from "axios";
import { getFromAsyncStorage, Keys } from "@/utils/asyncStorage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const { profile } = useSelector(getAuthState);
  const [profileImage, setProfileImage] = useState<null | FormData>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(
    profile?.avatar ||
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
  );

  const dispatch = useDispatch();

  const uploadProfileImage = async () => {
    const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

    try {
      const { data } = await axios.post(
        "http://192.168.196.227:8000/user/upload-profile-picture",
        profileImage,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Image uploaded successfully:", data);
    } catch (error) {
      console.error(error);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      // Convert image URI to Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const formData = new FormData();

      // @ts-expect-error
      formData.append("image", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      setProfileImage(formData);
      uploadProfileImage();
    } else {
      console.log("Image picker was canceled");
    }
  };

 
  return (
    <SafeAreaView className="flex-1 p-4 items-center">
      <View className="h-[200px] w-[200px]">
      <Image
        className="h-full w-full rounded-full"
        source={{
          uri: image,
        }}
      />
        <Pressable onPress={pickImage} className="bg-slate-800 p-3 max-w-fit absolute bottom-2 right-2 rounded-full">
          <Ionicons name="pencil" color={"white"} size={20} />
        </Pressable>

      </View>
      <View className="mt-12">
        <View className="items-end mb-4">
          <Pressable
            onPress={() => setModalVisible(true)}
            className="flex-row p-2 border items-center border-slate-600"
          >
            <Ionicons name="pencil" color={"black"} size={20} />
            <Text className="ml-2">Change Details</Text>
          </Pressable>
        </View>
        <View className="flex-row bg-slate-50 w-full border border-slate-400 p-4 justify-between mb-4">
          <ThemedText type="defaultSemiBold">Username : </ThemedText>
          <ThemedText>{profile?.username}</ThemedText>
        </View>
          <View className="flex-row bg-slate-50 w-full border border-slate-400 p-4 justify-between mb-4">
          <ThemedText type="defaultSemiBold">Email : </ThemedText>
          <ThemedText>{profile?.email}</ThemedText>
        </View>
        <View className="flex-row bg-slate-50 w-full border border-slate-400 p-4 justify-between mb-4">
          <ThemedText type="defaultSemiBold">Bio : </ThemedText>
          <ThemedText>{profile?.bio}</ThemedText>
        </View>
      </View>

      <PopUpModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ProfileInfoChangeForm setModalVisible={setModalVisible} />
      </PopUpModal>

      <ThemedView style={styles.titleContainer}>
        <Button
          style={{ borderRadius: 4, width: "100%" }}
          label="Logout"
          onPress={() => {
            dispatch(updateProfile(null));
            dispatch(updateLoggedInState(false));
          }}
        />
      </ThemedView>
      {/* <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the
          <ThemedText type="defaultSemiBold">@2x</ThemedText> and
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to
          provide files for different screen densities
        </ThemedText>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={{ alignSelf: "center" }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
  },
});

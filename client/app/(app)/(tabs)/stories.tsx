import { RootState } from "@/store";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { getFromAsyncStorage, Keys } from "@/utils/asyncStorage";
import Toast from "react-native-toast-message";
import ViewdStories from "@/components/story/ViewdStories";
import RecentStories from "@/components/story/RecentStories";

const Stories = () => {
  const { profile } = useSelector((state: RootState) => state.auth);
  const [image, setImage] = useState<FormData | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const uploadProfileImage = async () => {
    if (!image) return;
    const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
    try {
      const { data } = await axios.post(
        "http://192.168.226.227:8000/user/upload-profile-picture",
        image,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );
      Toast.show({
        type: "success",
        text1: data.message,
        position: "bottom",
      });
      console.log("Image uploaded successfully:", data);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
        position: "bottom",
      });
      setImage(null);
      console.error(error.message);
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
      setPreviewImage(imageUri);
      // Convert image URI to Blob
      const response = await fetch(imageUri);

      const blob = await response.blob();

      const formData = new FormData();

      // @ts-expect-error
      formData.append("image", {
        uri: imageUri,
        name: "status.jpg",
        type: blob.type,
      });

      setImage(formData);
      uploadProfileImage();
    } else {
      console.log("Image picker was canceled");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View style={styles.container}>
        <Text style={styles.title}>Status</Text>
        <View style={styles.account}>
          <Pressable onPress={() => pickImage()}>
            <Image
              source={{
                uri: profile?.avatar
                  ? profile?.avatar
                  : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
              }}
              style={styles.accountImage}
            />
            <View className="absolute h-6 w-6 bg-green-500 rounded-full bottom-0 left-8 border-white border justify-center items-center">
              <Entypo name="plus" color={"white"} size={18} />
            </View>
          </Pressable>
          <View style={styles.accountContent}>
            <Text style={styles.accountName}>My Status</Text>
            <Text style={styles.accountBalance}>Tap to add status update</Text>
          </View>
        </View>
        <RecentStories />
        <ViewdStories />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  account: {
    position: "relative",
    flexDirection: "row",
    marginBottom: 20,
  },
  accountImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 20,
  },
  accountContent: {
    justifyContent: "center",
  },
  accountName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  accountBalance: {
    fontSize: 16,
    color: "rgb(100 116 139)",
  },
});

export default Stories;

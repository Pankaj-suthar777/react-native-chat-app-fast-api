import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";

interface Props {
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
  scrollViewRef: React.RefObject<ScrollView>;
}

const AddImage = (props: Props) => {
  const { setPreviewImage, scrollViewRef } = props;

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
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setPreviewImage(imageUri);
    } else {
      console.log("Image picker was canceled");
    }
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };
  return (
    <TouchableOpacity onPress={pickImage}>
      <AntDesign name="plus" size={24} />
    </TouchableOpacity>
  );
};

export default AddImage;

const styles = StyleSheet.create({});

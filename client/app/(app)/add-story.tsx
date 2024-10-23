import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import Button from "@/components/Button";
import { getClient } from "@/api/client";
import { useMutation } from "react-query";
import Toast from "react-native-toast-message";

const AddStoryScreen = () => {
  const [imageType, setImageType] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [text, setText] = useState("");
  const [showText, setShowText] = useState(false);

  const navigation = useNavigation();

  const mutation = useMutation({
    mutationFn: async () => {
      const client = await getClient({ "Content-Type": "multipart/form-data" });

      const formData = new FormData();
      formData.append("text", text);

      if (previewImage) {
        // @ts-expect-error
        formData.append("image", {
          uri: previewImage,
          name: "status.jpg",
          type: imageType || "image/jpeg",
        });
      }
      console.log(formData);
      const { data } = await client.post<{ message: string }>(
        "/story/add-story",
        formData
      );

      return data;
    },
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: data?.message,
        position: "top",
      });
      navigation.goBack();
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        position: "top",
      });
      onAddCancelStory();
    },
  });

  const onAddCancelStory = () => {
    setPreviewImage("");
    navigation.goBack();
  };
  const addStoryHandler = () => {
    mutation.mutate();
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
      aspect: [9, 16],
    });

    if (result.canceled) {
      navigation.goBack();
    }

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setPreviewImage(imageUri);
      // Convert image URI to Blob
      const response = await fetch(imageUri);

      const blob = await response.blob();

      setImageType(blob.type);

      // const formData = new FormData();
      // formData.append("image", {
      //   uri: imageUri,
      //   name: "status.jpg",
      //   type: blob.type,
      // });
    } else {
      console.log("Image picker was canceled");
      navigation.goBack();
    }
  };

  useEffect(() => {
    pickImage();
  }, []);

  if (!previewImage) {
    return null;
  }

  return (
    <View className="flex-1">
      <ImageBackground
        className="flex-1 relative"
        source={{ uri: previewImage }}
        imageStyle={{ objectFit: "contain" }}
      >
        {showText && (
          <View className="absolute bottom-10 py-2 px-4 justify-center items-center bg-white opacity-0.5 w-full">
            <Text>{text}</Text>
          </View>
        )}
        {!showText && (
          <View className="absolute bottom-0 w-full left-0 right-0 h-12 bg-white flex-row justify-between items-center">
            <TextInput
              value={text}
              onChangeText={(e) => setText(e)}
              className="flex-1 text-lg px-4 py-2"
              placeholder="add text..."
            />
            <View className="px-2">
              <Button
                label="add"
                onPress={() => {
                  setShowText(true);
                }}
              />
            </View>
          </View>
        )}
      </ImageBackground>
      <View className="px-2 w-full py-4 flex-row">
        <Button
          label="Add story"
          style={{ flex: 1, marginRight: 1 }}
          onPress={addStoryHandler}
        />
        {text && showText && (
          <Button
            loading={mutation.isLoading}
            label="Edit Text"
            style={{ flex: 1, marginLeft: 1 }}
            onPress={() => {
              setShowText(false);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default AddStoryScreen;

const styles = StyleSheet.create({});

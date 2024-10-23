import * as ImagePicker from "expo-image-picker";

export const openCamera = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (permissionResult.granted === false) {
    console.log("No permission to access the camera");
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

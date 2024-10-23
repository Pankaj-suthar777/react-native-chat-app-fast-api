import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ChatInfoResponse, useFetchUser } from "@/hooks/query";
import { useQueryClient } from "react-query";
import { Message } from "@/@types/message";
import AntDesign from "@expo/vector-icons/AntDesign";

const Profile = () => {
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const { user_id, chat_id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [mediaMessage, setMediaMessage] = useState<Message[]>([]);

  const { data } = useFetchUser(parseInt(user_id as string));

  const queryClient = useQueryClient();

  const profile = data?.user;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: profile?.username,
      headerShown: true,
    });
  }, [navigation, data]);
  useEffect(() => {
    if (chat_id) {
      const data: ChatInfoResponse | undefined = queryClient.getQueryData([
        "get-chat-info",
        parseInt(chat_id as string),
      ]);
      if (data) {
        const mediaMessage = data.messages.filter((m) => m.image_url);
        setMediaMessage(mediaMessage);
      }
    }
  }, []);

  const handleImagePress = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setIsImagePreviewVisible(true);
  };

  const closeImagePreview = () => {
    setPreviewImageUrl("");
    setIsImagePreviewVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={isImagePreviewVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.previewContainer}>
          <Pressable style={styles.closeButton} onPress={closeImagePreview}>
            <AntDesign name="close" size={30} color="#fff" />
          </Pressable>
          <Image
            source={{ uri: previewImageUrl }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
      <Image
        style={styles.avatar}
        source={{
          uri: profile?.avatar
            ? profile.avatar
            : "https://bootdey.com/img/Content/avatar/avatar6.png",
        }}
      />
      <View style={styles.body}>
        <View
          style={styles.infoContainer}
          className="bg-slate-50 border border-slate-400  justify-between"
        >
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{profile?.username}</Text>
        </View>
        <View
          style={styles.infoContainer}
          className="bg-slate-50 border border-slate-400  justify-between"
        >
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{profile?.email}</Text>
        </View>
        {profile?.bio && (
          <View
            style={styles.infoContainer}
            className="bg-slate-50 border border-slate-400  justify-between"
          >
            <Text style={styles.infoLabel}>Bio:</Text>
            <Text style={styles.infoValue}>{profile.bio}</Text>
          </View>
        )}
        {mediaMessage.length > 0 ? (
          <View className="mt-4">
            <Text className="text-xl font-semibold mb-2">Media</Text>
            <FlatList
              horizontal
              data={mediaMessage}
              ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    onPress={() => handleImagePress(item.image_url as string)}
                  >
                    <Image
                      className="h-[120px] w-[120px]"
                      source={{ uri: item.image_url }}
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  avatar: {
    width: 180,
    height: 180,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "white",
    alignSelf: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    marginHorizontal: 14,
  },
  infoContainer: {
    marginTop: 20,
    width: "100%",
    padding: 16,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginTop: 5,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  previewImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 1.5,
  },
});

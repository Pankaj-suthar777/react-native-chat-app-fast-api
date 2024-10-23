import { RootState } from "@/store";
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import RecentStories from "@/components/story/RecentStories";
import { router } from "expo-router";
import { useFetchFriendStory } from "@/hooks/query";
import { setStories } from "@/store/story";

const Stories = () => {
  const { profile } = useSelector((state: RootState) => state.auth);

  const { data } = useFetchFriendStory();

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setStories(data.stories));
    }
  }, [data]);

  return (
    <View className="flex-1 bg-white">
      <View style={styles.container}>
        <Text style={styles.title}>Status</Text>
        <View style={styles.account}>
          <Pressable
            onPress={() => {
              router.push("/add-story");
            }}
          >
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
        <RecentStories data={data} />
        {/* <ViewdStories /> */}
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

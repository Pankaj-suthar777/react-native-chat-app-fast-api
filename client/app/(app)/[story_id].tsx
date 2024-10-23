import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getStoryState } from "@/store/story";
import { useSelector } from "react-redux";
import { IStoryResponse } from "@/hooks/query";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import moment from "moment";

const ShowStoryScreen = () => {
  const [currentStory, setCurrentStory] = useState<IStoryResponse | null>(null);
  const [indexOfCurrentStory, setIndexOfCurrentStory] = useState(0);
  const [text, setText] = useState("");
  const { story_id } = useLocalSearchParams();
  useEffect(() => {
    if (stories) {
      const story = stories.find((s) =>
        s.stories.some((s) => s.story_id === parseInt(story_id as string))
      );
      setCurrentStory(story || null);
    }
  }, []);

  const { stories } = useSelector(getStoryState);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Pressable
        className="flex-row items-center py-2 px-6 mb-2"
        onPress={() => {}}
      >
        <View className="w-12 h-12 mr-4">
          <Image
            className="rounded-full object-cover h-full w-full"
            source={{
              uri: currentStory?.avatar
                ? currentStory?.avatar
                : "https://randomuser.me/api/portraits/women/72.jpg",
            }}
          />
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <ThemedText className="text-sm font-medium text-gray-200">
              {currentStory?.username}
            </ThemedText>
          </View>
          <ThemedText className="text-gray-400 text-xs mb-2">
            {moment(
              currentStory?.stories[indexOfCurrentStory].created_at
            ).format("LT")}
          </ThemedText>
        </View>
      </Pressable>
      <ImageBackground
        className="flex-1 relative"
        source={{ uri: currentStory?.stories[indexOfCurrentStory].image }}
        imageStyle={{ objectFit: "cover" }}
      >
        <View className="absolute bottom-10 py-2 px-4 justify-center items-center bg-white opacity-0.2 w-full">
          <Text>{currentStory?.stories[indexOfCurrentStory].text}</Text>
        </View>
      </ImageBackground>
      <View className="px-2 w-full py-4 flex-row">
        <TextInput
          value={text}
          onChangeText={(e) => setText(e)}
          className="flex-1 text-lg px-4"
          placeholder="replay..."
        />
      </View>
    </SafeAreaView>
  );
};

export default ShowStoryScreen;

const styles = StyleSheet.create({});

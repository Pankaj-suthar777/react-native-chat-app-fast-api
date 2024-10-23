import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { FetchFriendStoryResponse } from "@/hooks/query";
import StoryItem from "./StoryItem";

interface Props {
  data: FetchFriendStoryResponse | undefined;
}

const RecentStories = ({ data }: Props) => {
  const [recentStoryHide, setRecentStoryHide] = useState(false);

  return (
    <View>
      <View className="mb-6 justify-between items-center flex-row">
        <Text className="text-slate-600 font-medium">Recent updates</Text>
        <TouchableOpacity onPress={() => setRecentStoryHide(!recentStoryHide)}>
          <Entypo
            name={recentStoryHide ? "chevron-down" : "chevron-up"}
            size={20}
          />
        </TouchableOpacity>
      </View>
      {!recentStoryHide &&
        data?.stories.map((story, i) => <StoryItem story={story} key={i} />)}
    </View>
  );
};

export default RecentStories;

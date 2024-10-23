// import { IStoryResponse } from "@/hooks/query";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import { Image, StyleSheet, Text, View } from "react-native";

// interface StoryItemProps {
//   story: IStoryResponse;
// }
// const StoryItem = ({ story }: StoryItemProps) => {
//   const [storyLength, setStoryLength] = useState(0);

//   useEffect(() => {
//     if (story) {
//       setStoryLength(story.stories.length);
//     }
//   }, [story]);

//   return (
//     <View key={story.user_id} style={styles.account}>
//       <Image
//         source={{ uri: story.stories[0].image }}
//         style={styles.accountImage}
//       />
//       <View style={styles.accountContent}>
//         <Text style={styles.accountName}>{story.username}</Text>
//         <Text style={styles.accountBalance}>
//           {moment(story.stories[0].created_at).format("LT")}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default StoryItem;

// const styles = StyleSheet.create({
//   account: {
//     position: "relative",
//     flexDirection: "row",
//     marginBottom: 20,
//   },
//   accountImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 30,
//     marginRight: 20,
//     borderWidth: 2,
//     borderColor: "#32CD32",
//   },
//   accountContent: {
//     justifyContent: "center",
//   },
//   accountName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   accountBalance: {
//     fontSize: 16,
//     color: "rgb(100 116 139)",
//   },
// });
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import moment from "moment";
import { IStoryResponse } from "@/hooks/query";
import { router } from "expo-router";

interface StoryItemProps {
  story: IStoryResponse;
}

const StoryItem = ({ story }: StoryItemProps) => {
  const [storyLength, setStoryLength] = useState(0);

  useEffect(() => {
    if (story) {
      setStoryLength(story.stories.length);
    }
  }, [story]);

  const renderStorySegments = (length: number) => {
    const strokeWidth = 3;
    const radius = 30 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const totalGap = 5 * length;
    const dashLength = (circumference - totalGap) / length;

    return (
      <Circle
        cx="50%"
        cy="50%"
        r={radius}
        stroke="#32CD32"
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLength} 5`}
        strokeDashoffset={-2.2}
        fill="none"
      />
    );
  };

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/(app)/[story_id]",
          params: { story_id: story.stories[0].story_id },
        });
      }}
      key={story.user_id}
      style={styles.account}
    >
      <View style={styles.svgWrapper}>
        <Svg height={60} width={60} style={styles.svg}>
          {storyLength > 1 ? (
            renderStorySegments(storyLength)
          ) : (
            <Circle
              cx="50%"
              cy="50%"
              r="28"
              stroke="#32CD32"
              strokeWidth="3"
              fill="none"
            />
          )}
        </Svg>
        <Image
          source={{ uri: story.stories[0].image }}
          style={styles.accountImage}
        />
      </View>
      <View style={styles.accountContent}>
        <Text style={styles.accountName}>{story.username}</Text>
        <Text style={styles.accountBalance}>
          {moment(story.stories[0].created_at).format("LT")}
        </Text>
      </View>
    </Pressable>
  );
};

export default StoryItem;

const styles = StyleSheet.create({
  account: {
    position: "relative",
    flexDirection: "row",
    marginBottom: 20,
  },
  svgWrapper: {
    position: "relative",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },
  accountImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  accountContent: {
    justifyContent: "center",
    marginLeft: 20,
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

import { FC, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";

interface Props {
  color?: string;
}

const LoadingAnimation: FC<Props> = ({
  color = Colors.light.tabIconSelected,
}) => {
  const initialRotation = useSharedValue(0);

  const transform = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${initialRotation.value}deg` }],
    };
  });

  useEffect(() => {
    initialRotation.value = withRepeat(withTiming(360), -1);
  });

  return (
    <Animated.View style={transform}>
      <AntDesign name="loading1" size={20} color={color} />
    </Animated.View>
  );
};

export default LoadingAnimation;

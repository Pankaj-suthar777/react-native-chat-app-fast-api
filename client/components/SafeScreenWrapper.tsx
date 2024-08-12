import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const SafeScreenWrapper = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
};

export default SafeScreenWrapper;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, backgroundColor: "#fff", flex: 1 },
});

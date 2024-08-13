import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import React from "react";

const ScreenWrapper = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <ScrollView style={[styles.container, style]}>
      <View style={{ flex: 1 }}>{children}</View>
    </ScrollView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, backgroundColor: "#fff", flex: 1 },
});

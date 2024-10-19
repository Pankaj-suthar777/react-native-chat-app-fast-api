import { router, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          headerTitle: "",
          headerShown: true,
          headerRight: ({ tintColor }) => (
            <TabBarIcon
              name="create"
              size={25}
              className="mx-4"
              color={Colors.light.tabIconSelected}
              onPress={() => {
                router.navigate("/(app)/search-user-to-chat");
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          title: "Stories",
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name={"feather"}
              size={28}
              style={[{ marginBottom: -3 }]}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name={"user"}
              size={28}
              style={[{ marginBottom: -3 }]}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

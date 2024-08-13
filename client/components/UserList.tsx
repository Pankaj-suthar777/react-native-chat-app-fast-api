import { Image, Pressable, View } from "react-native";
import React from "react";
import { ThemedText } from "./ThemedText";
import { User } from "@/@types/user";

const UserList = ({
  users,
  onPress,
}: {
  users: User[] | undefined;
  onPress?: (user: User) => void;
}) => {
  if (!users) {
    return null;
  }

  return (
    <View className="">
      {users?.map((user) => (
        <UserItem user={user} onPress={onPress} />
      ))}
    </View>
  );
};

export default UserList;

export const UserItem = ({
  user,
  onPress,
  lastMessage,
}: {
  user: User;
  onPress?: (user: User) => void;
  lastMessage?: string;
}) => {
  return (
    <Pressable
      className="border-b border-b-gray-200"
      onPress={onPress ? () => onPress(user) : () => {}}
    >
      <View className="flex flex-row items-center py-4 w-full">
        <View className="w-12 h-12 mr-4">
          <Image
            className="rounded-full object-cover h-full w-full"
            source={{
              uri: "https://randomuser.me/api/portraits/women/72.jpg",
            }}
          />
        </View>
        <View className="w-full">
          <ThemedText className="text-md font-medium text-gray-800">
            {user?.username}
          </ThemedText>
          <ThemedText type="default" className="text-gray-600 text-xs">
            {lastMessage ? lastMessage : user?.email}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
};

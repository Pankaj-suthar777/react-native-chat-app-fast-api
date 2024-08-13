import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import { useDebounce } from "use-debounce";
import { useFetchSearchUsers } from "@/hooks/query";
import UserList from "@/components/UserList";
import { router } from "expo-router";
import { User } from "@/@types/user";
import FontAwesome from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

const SearchUserToChat = () => {
  const [searchValue, setSearchValue] = useState("");
  const [value] = useDebounce(searchValue, 1000);

  const { data, isLoading } = useFetchSearchUsers(searchValue);

  const onPress = (user: User) => {
    router.push(
      `/(app)/(chat)/(new-chat)/${user.id}?name=${user.username}` as any
    );
  };

  return (
    <View className="flex-1 mt-4 px-4">
      <InputField
        placeholder="Search"
        onChange={(e) => {
          setSearchValue(e);
        }}
        value={searchValue}
      />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : (
        <View className="mt-5 flex-1">
          {data ? (
            <UserList users={data} onPress={onPress} />
          ) : (
            <View className="flex-1 justify-center h-full items-center">
              <FontAwesome name="user" size={40} />
              <Text className="mt-4">Search People's</Text>
            </View>
          )}
          {data && data?.length === 0 && searchValue.length > 0 && (
            <View className="flex-1 justify-center h-full items-center">
              <AntDesign name="questioncircleo" size={40} />
              <Text className="mt-4">no user found</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default SearchUserToChat;

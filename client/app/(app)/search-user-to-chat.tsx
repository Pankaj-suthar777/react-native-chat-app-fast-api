import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import { useDebounce } from "use-debounce";
import { useFetchSearchUsers } from "@/hooks/query";
import UserList from "@/components/UserList";
import { router } from "expo-router";
import { User } from "@/@types/user";
import ScreenWrapper from "@/components/ScreenWrapper";

const SearchUserToChat = () => {
  const [searchValue, setSearchValue] = useState("");
  const [value] = useDebounce(searchValue, 1000);

  const { data, isLoading } = useFetchSearchUsers(searchValue);

  const onPress = (user: User) => {
    router.push(`/(app)/(chat)/${user.id}?name=${user.username}` as any);
  };
  return (
    <ScreenWrapper>
      <View className="flex-1 mt-5">
        <InputField
          placeholder="Search"
          onChange={(e) => {
            setSearchValue(e);
          }}
          value={searchValue}
        />
        <View className="mt-5">
          <UserList users={data} onPress={onPress} />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SearchUserToChat;

const styles = StyleSheet.create({});

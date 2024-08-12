import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import { SafeAreaView } from "react-native-safe-area-context";
import SafeScreenWrapper from "@/components/SafeScreenWrapper";
import { useDebounce } from "use-debounce";

const SearchUserToChat = () => {
  const [searchValue, setSearchValue] = useState("");
  const [value] = useDebounce(searchValue, 1000);

  return (
    <SafeScreenWrapper>
      <View className="flex-1 mt-5">
        <InputField
          placeholder="Search"
          onChange={(e) => {
            setSearchValue(e);
          }}
          value={searchValue}
        />
      </View>
    </SafeScreenWrapper>
  );
};

export default SearchUserToChat;

const styles = StyleSheet.create({});

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";

const accounts = [
  {
    id: 1,
    name: "Checking Account",
    balance: 1000,
    image: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
  },
  {
    id: 2,
    name: "Savings Account",
    balance: 5000,
    image: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
  },
  {
    id: 3,
    name: "Pending Payments Account",
    balance: 3000,
    image: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
  },
];

const RecentStories = () => {
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
        accounts.map((account) => (
          <View key={account.id} style={styles.account}>
            <Image
              source={{ uri: account.image }}
              style={styles.accountImage}
            />
            <View style={styles.accountContent}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountBalance}>${account.balance}</Text>
            </View>
          </View>
        ))}
    </View>
  );
};

export default RecentStories;

const styles = StyleSheet.create({
  account: {
    position: "relative",
    flexDirection: "row",
    marginBottom: 20,
  },
  accountImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 20,
  },
  accountContent: {
    justifyContent: "center",
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

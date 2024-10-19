import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

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

const Stories = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status</Text>

      <View style={styles.accountContent}>
        <Text style={styles.accountName}>My Status</Text>
        <Text style={styles.accountBalance}>Tap to add status update</Text>
      </View>
      {accounts.map((account) => (
        <View key={account.id} style={styles.account}>
          <Image source={{ uri: account.image }} style={styles.accountImage} />
          <View style={styles.accountContent}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountBalance}>${account.balance}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  account: {
    flexDirection: "row",
    marginBottom: 20,
  },
  accountImage: {
    width: 60,
    height: 60,
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
    color: "#999",
  },
});

export default Stories;

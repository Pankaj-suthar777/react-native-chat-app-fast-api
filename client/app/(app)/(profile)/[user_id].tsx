import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useFetchUser } from "@/hooks/query";

const Profile = () => {
  const { user_id } = useLocalSearchParams();
  const navigation = useNavigation();

  const { data, isLoading } = useFetchUser(parseInt(user_id as string));

  const profile = data?.user;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: profile?.username,
      headerShown: true,
    });
  }, [navigation, data]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{
          uri: profile?.avatar
            ? profile.avatar
            : "https://bootdey.com/img/Content/avatar/avatar6.png",
        }}
      />
      <View style={styles.body}>
        <View
          style={styles.infoContainer}
          className="bg-slate-50 border border-slate-400  justify-between"
        >
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{profile?.username}</Text>
        </View>
        <View
          style={styles.infoContainer}
          className="bg-slate-50 border border-slate-400  justify-between"
        >
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{profile?.email}</Text>
        </View>
        {profile?.bio && (
          <View
            style={styles.infoContainer}
            className="bg-slate-50 border border-slate-400  justify-between"
          >
            <Text style={styles.infoLabel}>Bio:</Text>
            <Text style={styles.infoValue}>{profile.bio}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  avatar: {
    width: 180,
    height: 180,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "white",
    alignSelf: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    marginHorizontal: 14,
  },
  infoContainer: {
    marginTop: 20,
    width: "100%",
    padding: 16,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginTop: 5,
  },
});

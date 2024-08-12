import { User } from "@/@types/user";
import { getClient } from "@/api/client";
import Toast from "react-native-toast-message";
import { useQuery } from "react-query";

const fetchSearchUser = async (searchValue: string): Promise<User[]> => {
  const client = await getClient();
  const { data } = await client(`/user/get-search-users?search=${searchValue}`);
  return data.users;
};

export const useFetchSearchUsers = (searchValue: string) => {
  return useQuery(["search-user", searchValue], {
    queryFn: () => fetchSearchUser(searchValue),
    onError(error: any) {
      const errorMessage = error.response?.data?.detail;
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
};

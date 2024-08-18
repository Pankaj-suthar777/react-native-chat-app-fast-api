import { Message } from "@/@types/message";
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
    enabled: searchValue !== "",
  });
};

export interface ChatInfoResponse {
  chat_id: number;
  chat_info: {
    last_message: string;
    user_count: number;
  };
  friend_info: {
    id: number;
    username: string;
    email: string;
  };
  messages: Message[];
}

const fetchChatInfo = async (chat_id: number): Promise<ChatInfoResponse> => {
  const client = await getClient();
  const { data } = await client(`/chat/get-chat/${chat_id}`);
  return data;
};

export const useFetchChatInfo = (chat_id: number) => {
  return useQuery(["get-chat-info", chat_id], {
    queryFn: () => fetchChatInfo(chat_id),
    onError(error: any) {
      const errorMessage = error.response?.data?.detail;
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
};

interface MyChatsResponse {
  chat_id: number;
  last_message: string;

  other_user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
}

const fetchMyChats = async (): Promise<MyChatsResponse[]> => {
  const client = await getClient();
  const { data } = await client(`/chat/my-chats`);
  return data.chats;
};

export const useFetchMyChats = () => {
  return useQuery(["get-my-chats"], {
    queryFn: () => fetchMyChats(),
    onError(error: any) {
      const errorMessage = error.response?.data?.detail;
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
};

interface FetchUserResponse {
  user: User;
}

const fetchUser = async (id: number): Promise<FetchUserResponse> => {
  const client = await getClient();
  const { data } = await client(`/chat/user-details/${id}`);
  return data;
};

export const useFetchUser = (id: number) => {
  return useQuery(["chat-user", id], {
    queryFn: () => fetchUser(id),
    onError(error: any) {
      const errorMessage = error.response?.data?.detail;
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
};

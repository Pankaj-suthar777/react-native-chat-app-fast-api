import { Message } from "@/@types/message";
import { User } from "@/@types/user";
import { getClient } from "@/api/client";
import { StoreChats } from "@/store/chat";
import Toast from "react-native-toast-message";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";

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
  total_unseen_message: number;
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

export interface MyChatsResponse {
  chat_id: number;
  last_message: string;
  created_at: string;
  total_unseen_message: number;
  is_seen: boolean;
  last_message_send_by: string;
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
  const dispatch = useDispatch();
  return useQuery(["get-my-chats"], {
    queryFn: () => fetchMyChats(),
    onError(error: any) {
      const errorMessage = error.response?.data?.detail;
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
    onSuccess(data) {
      dispatch(StoreChats(data));
    },
  });
};

interface FetchUserResponse {
  user: User;
}

export const fetchUser = async (id: number): Promise<FetchUserResponse> => {
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
export interface IStoryResponse {
  user_id: number;
  username: string;
  avatar: string;
  stories: {
    story_id: number;
    image: string;
    text: string;
    created_at: string;
  }[];
}

export interface FetchFriendStoryResponse {
  stories: IStoryResponse[];
}

export const fetchFriendStory = async (): Promise<FetchFriendStoryResponse> => {
  const client = await getClient();
  const { data } = await client.get("/story/get-friends-story");
  return data;
};

export const useFetchFriendStory = () => {
  return useQuery(["friend-story"], {
    queryFn: fetchFriendStory,
    onError(error: any) {
      const errorMessage = error.response?.data?.detail;
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
};

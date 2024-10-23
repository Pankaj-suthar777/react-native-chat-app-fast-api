import { getAuthState } from "@/store/auth";
import { updateLastMessage } from "@/store/chat";
import React, { createContext, useContext, useEffect, useRef } from "react";
import Toast from "react-native-toast-message";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ChatInfoResponse, fetchUser, MyChatsResponse } from "./query";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

interface WebSocketContextProps {
  sendMessage: (content: string, chat_id: number) => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { profile } = useSelector(getAuthState);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!profile?.id) {
      console.error("Profile ID is not available");
      return;
    }

    wsRef.current = new WebSocket(`ws://192.168.62.227:8000/ws/${profile.id}`);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    wsRef.current.onmessage = async (event: MessageEvent) => {
      try {
        const newMessage = JSON.parse(event.data);
        const chatId = parseInt(newMessage.chat_id);

        const existingChatInfo = queryClient.getQueryData<ChatInfoResponse>([
          "get-chat-info",
          chatId,
        ]);

        queryClient.setQueryData(["get-chat-info", chatId], {
          ...existingChatInfo,
          messages: [...(existingChatInfo?.messages || []), newMessage],
        });

        scrollViewRef.current?.scrollToEnd({ animated: true });

        const { user } = await fetchUser(newMessage.sender_id);
        Toast.show({
          type: "info",
          text1: user.username,
          text2: newMessage.content,
          position: "top",
        });

        queryClient.setQueryData(
          ["get-my-chats"],
          (oldData?: MyChatsResponse[]) => {
            if (oldData) {
              const newData = oldData.map((o) => {
                if (o.chat_id === parseInt(newMessage.chat_id)) {
                  const newData: MyChatsResponse = {
                    ...o,
                    total_unseen_message: o.total_unseen_message + 1,
                  };
                  return newData;
                } else {
                  return o;
                }
              });
              return newData;
            }
            return [];
          }
        );
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      wsRef.current?.close();
    };
  }, [profile?.id]);

  const sendMessage = (content: string, chat_id: number) => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ content, chat_id }));
        dispatch(updateLastMessage({ chat_id, message: content }));
      } else {
        console.error("WebSocket is not open");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextProps => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import {Chat} from '@/@types/chat'


interface ChatState {
  chats: Chat[] | null;
}

const initialState: ChatState = {
  chats: null,
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    AddChatToStore(chatState, { payload }: PayloadAction<Chat>) {
      chatState.chats = [...chatState?.chats || [], payload ];
    },
    StoreChats(chatState, { payload }: PayloadAction<Chat[]>) {
      chatState.chats = payload;
    },
  },
});

export const { AddChatToStore, StoreChats } =
  slice.actions;

export const getChatState = createSelector(
  (state: RootState) => state,
  ({ chat }) => chat
);

export default slice.reducer;

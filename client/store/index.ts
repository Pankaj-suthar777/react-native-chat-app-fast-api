import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import chatReducer from "./chat";
import storyReducer from "./story";

const reducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  story: storyReducer,
});

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

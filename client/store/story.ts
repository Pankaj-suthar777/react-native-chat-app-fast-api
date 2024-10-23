import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { IStoryResponse } from "@/hooks/query";

interface StoryState {
  stories: IStoryResponse[] | null;
}

const initialState: StoryState = {
  stories: null,
};

const slice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setStories(storyState, { payload }: PayloadAction<IStoryResponse[]>) {
      storyState.stories = payload;
    },
  },
});

export const { setStories } = slice.actions;

export const getStoryState = createSelector(
  (state: RootState) => state,
  ({ story }) => story
);

export default slice.reducer;

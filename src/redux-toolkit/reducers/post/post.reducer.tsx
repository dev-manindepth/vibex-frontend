import { IPostData } from '@interfaces/index';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { emptyPostData } from '@services/utils/static.data';

const initialState: IPostData = emptyPostData;

function updatePostState<T>(state: T, payload: Partial<T>): void {
  for (const [key, value] of Object.entries(payload)) {
    (state as any)[key] = value;
  }
}
const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updatePostItem: (state, action: PayloadAction<Partial<IPostData>>) => {
      updatePostState(state, action.payload);
    },
    clearPost: () => {
      return emptyPostData;
    }
  }
});

export default postSlice.reducer;
export const { updatePostItem, clearPost } = postSlice.actions;

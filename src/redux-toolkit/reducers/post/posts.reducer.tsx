import { IPostData } from '@interfaces/index';
import { getPosts } from '@redux-toolkit/api/posts';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IPosts {
  posts: IPostData[];
  totalPostsCount: number;
  isLoading: boolean;
}
const initialState: IPosts = {
  posts: [],
  totalPostsCount: 0,
  isLoading: false
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addToPosts: (state, action: PayloadAction<IPostData[]>) => {
      state.posts = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      const { posts, totalPosts } = action.payload;
      state.posts = [...posts];
      state.totalPostsCount = totalPosts;
    });
    builder.addCase(getPosts.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export default postsSlice.reducer;
export const { addToPosts } = postsSlice.actions;

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';

const getPosts = createAsyncThunk<any, void, AsyncThunkConfig>('post/getPosts', async (name, { dispatch }) => {
  try {
    const response = await postService.getAllPosts(1);
    return response.data;
  } catch (err: any) {
    Utils.dispatchNotification(err.respone.data.message, 'error', dispatch);
  }
});

export { getPosts };

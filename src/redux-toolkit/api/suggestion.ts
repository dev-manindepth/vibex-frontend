import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { userService } from '@services/api/user/user.service';

export const getUserSuggestions = createAsyncThunk<any, void, AsyncThunkConfig>('user/getSuggestions', async (name, { dispatch }) => {
  try {
    const response = await userService.getUserSuggestions();
    return response.data;
  } catch (err) {
    console.log(err);
  }
});

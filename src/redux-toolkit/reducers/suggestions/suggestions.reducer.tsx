import { IUser } from '@interfaces/index';
import { getUserSuggestions } from '@redux-toolkit/api/suggestion';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ISuggestionsState {
  users: IUser[];
  isLoading: boolean;
}
const initialState: ISuggestionsState = {
  users: [],
  isLoading: false
};

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    addToSuggestions: (state, action: PayloadAction<ISuggestionsState>) => {
      const { isLoading, users } = action.payload;
      state.users = [...users];
      state.isLoading = isLoading;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserSuggestions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserSuggestions.fulfilled, (state, action) => {
      state.isLoading = false;
      const { users } = action.payload;
      state.users = [...users];
    });
    builder.addCase(getUserSuggestions.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { addToSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;

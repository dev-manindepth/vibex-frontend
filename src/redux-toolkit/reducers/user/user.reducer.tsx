import { IUser } from '@interfaces/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface UserState {
  token: string;
  profile: IUser | null;
}

const initialState: UserState = {
  token: '',
  profile: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserState>) => {
      const { token, profile } = action.payload;
      state.token = token;
      state.profile = profile;
    },
    clearUser: (state) => {
      state.token = '';
      state.profile = null;
    },
    updateUserProfile: (state, action: PayloadAction<UserState>) => {
      state.profile = action.payload.profile;
    }
  }
});

export const { addUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

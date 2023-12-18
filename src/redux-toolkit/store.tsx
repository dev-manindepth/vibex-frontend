// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@redux-toolkit/reducers/user/user.reducer';

const store = configureStore({
  reducer: {
    user: userReducer
  }
});

export default store;

// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@redux-toolkit/reducers/user/user.reducer';
import suggestionsReducer from './reducers/suggestions/suggestions.reducer';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionsReducer
  }
});

export default store;

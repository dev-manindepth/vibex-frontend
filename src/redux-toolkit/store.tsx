// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@redux-toolkit/reducers/user/user.reducer';
import suggestionsReducer from '@redux-toolkit/reducers/suggestions/suggestions.reducer';
import notificationReducer from '@redux-toolkit/reducers/notifications/notification.reducer';
import modalReducer from '@redux-toolkit/reducers/modal/modal.reducer';
import postReducer from './reducers/post/post.reducer';
import postsReducer from './reducers/post/posts.reducer';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionsReducer,
    notifications: notificationReducer,
    modal: modalReducer,
    post: postReducer,
    allPosts: postsReducer
  }
});

export default store;

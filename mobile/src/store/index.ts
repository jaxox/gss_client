import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import profileReducer from './profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

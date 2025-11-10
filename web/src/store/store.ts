import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import profileReducer from './profile/profileSlice';
import eventsReducer from './events/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

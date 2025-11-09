/**
 * Profile Redux Slice for Web
 * Manages user profile state and operations
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, ProfileUpdateRequest } from '@gss/shared';
import { MockUserService, getApiError } from '@gss/shared';

// Create user service instance (using mock for now)
const userService = new MockUserService();

export interface ProfileState {
  currentProfile: User | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: ProfileState = {
  currentProfile: null,
  isLoading: false,
  isEditing: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const profile = await userService.getProfile(userId);
      return profile;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (
    { userId, updates }: { userId: string; updates: ProfileUpdateRequest },
    { rejectWithValue }
  ) => {
    try {
      const profile = await userService.updateProfile(userId, updates);
      return profile;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    clearProfile: state => {
      state.currentProfile = null;
      state.isEditing = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Get Profile
      .addCase(getProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
        state.isEditing = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setEditing, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

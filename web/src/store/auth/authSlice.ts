/**
 * Auth Redux Slice for Web
 * Manages authentication state using Redux Toolkit
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AuthState,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  AuthTokens,
} from '@gss/shared';
import { AuthServiceImpl, secureStorage, getApiError } from '@gss/shared';

// Create auth service instance
const authService = new AuthServiceImpl();

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response: AuthResponse = await authService.register(userData);
      await secureStorage.storeTokens(response.tokens);
      return response;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    { credentials, rememberMe }: { credentials: LoginRequest; rememberMe?: boolean },
    { rejectWithValue }
  ) => {
    try {
      if (rememberMe !== undefined) {
        await secureStorage.setRememberMe(rememberMe);
      }

      const response: AuthResponse = await authService.login(credentials);
      await secureStorage.storeTokens(response.tokens);
      return response;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    await secureStorage.clearTokens();
  } catch (error) {
    const apiError = getApiError(error);
    return rejectWithValue(apiError.message);
  }
});

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }: { token: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await authService.resetPassword(token, newPassword);
      return { success: true };
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
    },
  },
  extraReducers: builder => {
    builder
      // Register
      .addCase(register.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.loginMethod = 'email';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.loginMethod = 'email';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, state => {
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = null;
        state.loginMethod = undefined;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;

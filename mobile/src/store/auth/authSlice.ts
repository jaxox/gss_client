import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthServiceImpl,
  createSecureStorage,
  getApiError,
  type User,
  type AuthResponse,
  type AuthTokens,
  type LoginRequest,
  type RegisterRequest,
  type SSOLoginRequest,
  type SessionState,
} from '@gss/shared';

const authService = new AuthServiceImpl();
const secureStorage = createSecureStorage();

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  session: SessionState;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isRefreshing: false,
  session: {
    isActive: true,
    lastActivity: Date.now(),
    timeoutDuration: 30 * 60 * 1000, // 30 minutes
  },
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
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response: AuthResponse = await authService.login(credentials);
      await secureStorage.storeTokens(response.tokens);
      return response;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const loginSSO = createAsyncThunk(
  'auth/loginSSO',
  async (ssoRequest: SSOLoginRequest, { rejectWithValue }) => {
    try {
      const response: AuthResponse = await authService.loginSSO(ssoRequest);
      await secureStorage.storeTokens(response.tokens);
      return response;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      await secureStorage.clearTokens();
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.forgotPassword(email);
      return { email };
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { token, newPassword }: { token: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      await authService.resetPassword(token, newPassword);
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const tokens = await secureStorage.getTokens();
      if (!tokens) {
        throw new Error('No refresh token available');
      }

      const newTokens: AuthTokens = await authService.refreshToken(
        tokens.refreshToken,
      );
      await secureStorage.storeTokens(newTokens);
      return newTokens;
    } catch (error) {
      const apiError = getApiError(error);
      await secureStorage.clearTokens();
      return rejectWithValue(apiError.message);
    }
  },
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    sessionExpired: state => {
      state.session.isActive = false;
    },
    sessionResumed: state => {
      state.session.isActive = true;
      state.session.lastActivity = Date.now();
    },
    updateLastActivity: state => {
      state.session.lastActivity = Date.now();
    },
    setSessionTimeout: (state, action: PayloadAction<number>) => {
      state.session.timeoutDuration = action.payload;
    },
  },
  extraReducers: builder => {
    // Register
    builder
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login SSO (Google)
    builder
      .addCase(loginSSO.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSSO.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginSSO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.pending, state => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, state => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, state => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, state => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, state => {
        state.isRefreshing = false;
        state.session.isActive = true;
        state.session.lastActivity = Date.now();
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isRefreshing = false;
        state.isAuthenticated = false;
        state.user = null;
        state.session.isActive = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setAuthenticated,
  sessionExpired,
  sessionResumed,
  updateLastActivity,
  setSessionTimeout,
} = authSlice.actions;

export default authSlice.reducer;

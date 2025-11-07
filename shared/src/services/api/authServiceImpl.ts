/**
 * Real AuthService Implementation for GSS Client
 * Uses ky HTTP client to communicate with backend API
 */

import { AuthService } from './auth.service';
import { httpClient, getApiError } from '../http/client';
import type {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  SSOLoginRequest,
  User,
  ProfileUpdateRequest,
} from '../../types/auth.types';

export class AuthServiceImpl extends AuthService {
  constructor(baseURL: string = '') {
    super(baseURL);
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient
        .post('auth/register', {
          json: userData,
        })
        .json<AuthResponse>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient
        .post('auth/login', {
          json: credentials,
        })
        .json<AuthResponse>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async loginSSO(request: SSOLoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient
        .post('auth/sso', {
          json: request,
        })
        .json<AuthResponse>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post('auth/logout').json();
    } catch (error) {
      throw getApiError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await httpClient
        .post('auth/refresh', {
          json: { refreshToken },
        })
        .json<{ tokens: AuthTokens }>();

      return response.tokens;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await httpClient.get('auth/me').json<{ user: User }>();
      return response.user;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await httpClient
        .post('auth/forgot-password', {
          json: { email },
        })
        .json();
    } catch (error) {
      throw getApiError(error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await httpClient
        .post('auth/reset-password', {
          json: { token, newPassword },
        })
        .json();
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getProfile(userId: string): Promise<User> {
    try {
      const response = await httpClient.get(`users/${userId}/profile`).json<{ user: User }>();
      return response.user;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async updateProfile(userId: string, updates: ProfileUpdateRequest): Promise<User> {
    try {
      const response = await httpClient
        .patch(`users/${userId}/profile`, {
          json: updates,
        })
        .json<{ user: User }>();

      return response.user;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await httpClient
        .post(`users/${userId}/avatar`, {
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary
          headers: {},
        })
        .json<{ avatarUrl: string }>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }
}

/**
 * Authentication Types for GSS Client
 * Based on Story 1-3 Google SSO Registration/Login context
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  homeCity: string;
  reliabilityScore: number; // 0.0-1.0, private by default
  level: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  homeCity: string;
}

export interface SSOLoginRequest {
  provider: 'google' | 'facebook' | 'apple';
  idToken: string;
}

export interface ProfileUpdateRequest {
  displayName?: string;
  homeCity?: string;
  avatar?: File | string; // File for upload, string for URL
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: string | null;
  loginMethod?: 'email' | 'google' | 'facebook' | 'apple';
}

export interface PrivacySettings {
  reliabilityScoreVisibility: 'private' | 'public';
  profileSearchable: boolean;
}

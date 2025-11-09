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
  privacySettings?: PrivacySettings;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface TokenMetadata {
  issuedAt: number;
  expiresAt: number;
  refreshExpiresAt: number;
}

export interface SessionState {
  isActive: boolean;
  lastActivity: number;
  timeoutDuration: number; // milliseconds
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
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
  isRefreshing: boolean;
  session: SessionState;
}

export interface PrivacySettings {
  reliabilityScoreVisible: boolean; // false by default (private)
  badgesVisible: boolean; // true by default (public)
  levelVisible: boolean; // true by default (public)
}

export type BiometricType = 'faceId' | 'touchId' | 'fingerprint' | 'webauthn' | 'none';

export interface BiometricSettings {
  enabled: boolean;
  type: BiometricType;
  enrolledAt?: Date;
}

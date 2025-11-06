/**
 * AuthService Interface for GSS Client
 * Based on Story 1-3 Google SSO and authentication requirements
 */

import type {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  SSOLoginRequest,
  User,
  ProfileUpdateRequest,
} from '../../types/auth.types';

export interface IAuthService {
  // Authentication Methods
  login(credentials: LoginRequest): Promise<AuthResponse>;
  loginSSO(request: SSOLoginRequest): Promise<AuthResponse>;
  register(userData: RegisterRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  
  // Token Management
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  getCurrentUser(): Promise<User>;
  
  // Password Management
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  
  // Profile Management
  getProfile(userId: string): Promise<User>;
  updateProfile(userId: string, updates: ProfileUpdateRequest): Promise<User>;
  uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }>;
}

/**
 * Abstract base class for AuthService implementations
 * Provides common functionality and enforces interface
 */
export abstract class AuthService implements IAuthService {
  protected baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  abstract login(credentials: LoginRequest): Promise<AuthResponse>;
  abstract loginSSO(request: SSOLoginRequest): Promise<AuthResponse>;
  abstract register(userData: RegisterRequest): Promise<AuthResponse>;
  abstract logout(): Promise<void>;
  abstract refreshToken(refreshToken: string): Promise<AuthTokens>;
  abstract getCurrentUser(): Promise<User>;
  abstract forgotPassword(email: string): Promise<void>;
  abstract resetPassword(token: string, newPassword: string): Promise<void>;
  abstract getProfile(userId: string): Promise<User>;
  abstract updateProfile(userId: string, updates: ProfileUpdateRequest): Promise<User>;
  abstract uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }>;
}

/**
 * GSS Client Shared Library
 * Main entry point for shared types, services, and utilities
 */

// Types
export * from './types/auth.types';
export * from './types/api.types';

// Services
export * from './services/api/auth.service';
export * from './services/mock/mockAuth.service';

// Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    SSO: '/api/auth/sso',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    AVATAR: '/api/users/avatar',
  },
} as const;

export const APP_CONFIG = {
  TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 90 * 24 * 60 * 60 * 1000, // 90 days
  API_TIMEOUT: 10000, // 10 seconds
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

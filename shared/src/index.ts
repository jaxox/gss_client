/**
 * GSS Client Shared Library
 * Main entry point for shared types, services, and utilities
 */

// Types
export * from './types/auth.types';
export * from './types/api.types';
export * from './types/event.types';
export * from './types/location.types';
export * from './types/payment.types';

// Services - Authentication
export * from './services/api/auth.service';
export * from './services/api/authServiceImpl';
export * from './services/api/user.service';
export * from './services/api/userServiceImpl';
export * from './services/mock/mockAuth.service';
export * from './services/mock/mockUser.service';

// Services - Events and Location
export * from './services/api/events.service';
export * from './services/api/eventsServiceImpl';
export * from './services/api/location.service';
export * from './services/api/locationServiceImpl';
export * from './services/mock/mockEvents.service';
export * from './services/mock/mockLocation.service';

// Services - Payment
export * from './services/api/payment.service';
export * from './services/api/paymentServiceImpl';
export * from './services/mock/mockPayment.service';

// Services - Infrastructure
export * from './services/http/client';
export * from './services/storage/secureStorage';
export * from './services/biometric/biometricAuth';
export * from './services/profilePersistence.service';

// Utilities
export * from './utils/validation';
export * from './utils/logger';
export * from './utils/inputSanitization';
export * from './utils/encryption';
export * from './components/avatarUtils';

// Validation Schemas
export * from './validation/eventValidation';

// Hooks
export * from './hooks/useProfile';

// Constants - Centralized error messages
export * from './constants/errorMessages';

// Theme - Shared theme configuration
export * from './theme/theme';

// Validation - Re-export existing validation utilities and add new constants
export * from './utils/validation';
// Export validation constants separately to avoid naming conflicts
export {
  EMAIL_REGEX,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_UPPERCASE_REGEX,
  PASSWORD_LOWERCASE_REGEX,
  PASSWORD_NUMBER_REGEX,
  PASSWORD_SPECIAL_REGEX,
  DISPLAY_NAME_MIN_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_REGEX,
  CITY_MIN_LENGTH,
  CITY_MAX_LENGTH,
  API_TIMEOUT_MS,
  TOKEN_REFRESH_TIMEOUT_MS,
  LOGIN_TIMEOUT_MS,
  REGISTRATION_TIMEOUT_MS,
  PROFILE_LOAD_TIMEOUT_MS,
  MAX_RETRY_ATTEMPTS,
  RETRY_DELAYS_MS,
  SESSION_TIMEOUT_MS,
  SESSION_WARNING_MS,
  LOADING_DELAY_MS,
  calculatePasswordStrength,
  PasswordStrength as PasswordStrengthEnum,
} from './constants/validationRules';

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

/**
 * Centralized Error Messages
 * All error messages used by both mobile and web platforms
 * Ensures consistent error text across platforms
 */

export const AUTH_ERRORS = {
  // Login errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in',
  ACCOUNT_DISABLED: 'This account has been disabled',
  ACCOUNT_LOCKED: 'Too many failed login attempts. Please try again later',

  // Registration errors
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  WEAK_PASSWORD: 'Password does not meet security requirements',
  INVALID_EMAIL: 'Please enter a valid email address',
  REGISTRATION_FAILED: 'Registration failed. Please try again',

  // Google SSO errors
  GOOGLE_AUTH_CANCELED: 'Google sign-in was canceled',
  GOOGLE_AUTH_FAILED: 'Google sign-in failed. Please try again',
  GOOGLE_TOKEN_INVALID: 'Google authentication token is invalid',

  // Token/Session errors
  TOKEN_EXPIRED: 'Your session has expired. Please sign in again',
  TOKEN_INVALID: 'Invalid authentication token',
  SESSION_TIMEOUT: 'Your session has timed out due to inactivity',
  REFRESH_FAILED: 'Failed to refresh session. Please sign in again',

  // General auth errors
  UNAUTHORIZED: 'You must be signed in to access this resource',
  FORBIDDEN: 'You do not have permission to access this resource',
} as const;

export const VALIDATION_ERRORS = {
  // Email validation
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  EMAIL_TOO_LONG: 'Email must be less than 255 characters',

  // Password validation
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_NO_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_NO_LOWERCASE: 'Password must contain at least one lowercase letter',
  PASSWORD_NO_NUMBER: 'Password must contain at least one number',
  PASSWORD_NO_SPECIAL: 'Password must contain at least one special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',

  // Display name validation
  DISPLAY_NAME_REQUIRED: 'Display name is required',
  DISPLAY_NAME_TOO_SHORT: 'Display name must be at least 2 characters',
  DISPLAY_NAME_TOO_LONG: 'Display name must be less than 50 characters',
  DISPLAY_NAME_INVALID: 'Display name can only contain letters, numbers, and spaces',

  // City validation
  CITY_REQUIRED: 'Home city is required',
  CITY_TOO_SHORT: 'City name must be at least 2 characters',
  CITY_TOO_LONG: 'City name must be less than 100 characters',

  // General validation
  FIELD_REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
} as const;

export const NETWORK_ERRORS = {
  // Connection errors
  NO_INTERNET: 'No internet connection. Please check your network',
  TIMEOUT: 'Request timed out. Please try again',
  CONNECTION_FAILED: 'Connection failed. Please check your internet connection',
  SERVER_UNREACHABLE: 'Unable to reach server. Please try again later',

  // Server errors
  SERVER_ERROR: 'Server error occurred. Please try again later',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later',
  BAD_REQUEST: 'Invalid request. Please check your input',

  // General network errors
  REQUEST_FAILED: 'Request failed. Please try again',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again',
} as const;

export const PROFILE_ERRORS = {
  // Profile operations
  UPDATE_FAILED: 'Failed to update profile. Please try again',
  FETCH_FAILED: 'Failed to load profile. Please try again',
  INVALID_PROFILE_DATA: 'Invalid profile data',

  // Avatar operations
  AVATAR_UPLOAD_FAILED: 'Failed to upload avatar. Please try again',
  AVATAR_TOO_LARGE: 'Avatar file is too large (max 5MB)',
  AVATAR_INVALID_FORMAT: 'Avatar must be a valid image file (JPG, PNG, or GIF)',
  AVATAR_DELETE_FAILED: 'Failed to delete avatar. Please try again',
} as const;

// Type exports for TypeScript autocomplete
export type AuthError = (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS];
export type ValidationError = (typeof VALIDATION_ERRORS)[keyof typeof VALIDATION_ERRORS];
export type NetworkError = (typeof NETWORK_ERRORS)[keyof typeof NETWORK_ERRORS];
export type ProfileError = (typeof PROFILE_ERRORS)[keyof typeof PROFILE_ERRORS];

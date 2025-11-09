/**
 * Centralized Validation Rules
 * All validation rules used by both mobile and web platforms
 * Ensures identical validation behavior across platforms
 */

// Email validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_MAX_LENGTH = 255;

// Password validation
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
export const PASSWORD_NUMBER_REGEX = /[0-9]/;
export const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

// Display name validation
export const DISPLAY_NAME_MIN_LENGTH = 2;
export const DISPLAY_NAME_MAX_LENGTH = 50;
export const DISPLAY_NAME_REGEX = /^[a-zA-Z0-9\s]+$/;

// City validation
export const CITY_MIN_LENGTH = 2;
export const CITY_MAX_LENGTH = 100;

// Performance and timeout constants
export const API_TIMEOUT_MS = 30000; // 30 seconds
export const TOKEN_REFRESH_TIMEOUT_MS = 500; // 500ms for transparent refresh
export const LOGIN_TIMEOUT_MS = 2000; // 2 seconds max for login
export const REGISTRATION_TIMEOUT_MS = 2000; // 2 seconds max for registration
export const PROFILE_LOAD_TIMEOUT_MS = 1000; // 1 second max for profile load

// Retry configuration
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAYS_MS = [1000, 2000, 4000]; // Exponential backoff: 1s, 2s, 4s

// Session configuration
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
export const SESSION_WARNING_MS = 5 * 60 * 1000; // 5 minutes before timeout

// Loading delay (prevent flicker)
export const LOADING_DELAY_MS = 200;

// Bundle size targets
export const MOBILE_BUNDLE_SIZE_MB = 50;
export const WEB_INITIAL_BUNDLE_SIZE_MB = 2;

// Memory usage targets
export const MOBILE_MEMORY_BASELINE_MB = 100;
export const WEB_MEMORY_BASELINE_MB = 50;

// Validation helper functions
export function validateEmail(email: string): boolean {
  if (!email || email.length > EMAIL_MAX_LENGTH) {
    return false;
  }
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password) {
    errors.push('PASSWORD_REQUIRED');
    return { isValid: false, errors };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push('PASSWORD_TOO_SHORT');
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    errors.push('PASSWORD_TOO_LONG');
  }

  if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
    errors.push('PASSWORD_NO_UPPERCASE');
  }

  if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
    errors.push('PASSWORD_NO_LOWERCASE');
  }

  if (!PASSWORD_NUMBER_REGEX.test(password)) {
    errors.push('PASSWORD_NO_NUMBER');
  }

  if (!PASSWORD_SPECIAL_REGEX.test(password)) {
    errors.push('PASSWORD_NO_SPECIAL');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateDisplayName(displayName: string): boolean {
  if (!displayName) {
    return false;
  }

  if (
    displayName.length < DISPLAY_NAME_MIN_LENGTH ||
    displayName.length > DISPLAY_NAME_MAX_LENGTH
  ) {
    return false;
  }

  return DISPLAY_NAME_REGEX.test(displayName);
}

export function validateCity(city: string): boolean {
  if (!city) {
    return false;
  }

  return city.length >= CITY_MIN_LENGTH && city.length <= CITY_MAX_LENGTH;
}

// Password strength calculator
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return PasswordStrength.WEAK;
  }

  let score = 0;

  // Length scoring
  if (password.length >= PASSWORD_MIN_LENGTH) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Complexity scoring
  if (PASSWORD_UPPERCASE_REGEX.test(password)) score += 1;
  if (PASSWORD_LOWERCASE_REGEX.test(password)) score += 1;
  if (PASSWORD_NUMBER_REGEX.test(password)) score += 1;
  if (PASSWORD_SPECIAL_REGEX.test(password)) score += 1;

  // Determine strength
  if (score < 4) return PasswordStrength.WEAK;
  if (score < 6) return PasswordStrength.MEDIUM;
  return PasswordStrength.STRONG;
}

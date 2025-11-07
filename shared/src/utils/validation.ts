/**
 * Validation utilities for GSS Client
 * Provides email and password validation with strength assessment
 */

export interface PasswordStrength {
  valid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  feedback: string[];
}

/**
 * Validates email format using RFC 5322 compliant regex
 * @param email - Email address to validate
 * @returns true if valid email format, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // RFC 5322 simplified regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password against security requirements
 * Requirements: min 8 chars, 1 uppercase, 1 number, 1 special char
 *
 * @param password - Password to validate
 * @returns Object with validation status, strength rating, and feedback
 */
export function validatePassword(password: string): PasswordStrength {
  const feedback: string[] = [];

  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      strength: 'weak',
      feedback: ['Password is required'],
    };
  }

  // Check minimum length
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain at least one number');
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  }

  const valid = feedback.length === 0;

  // Calculate strength based on various factors
  let strengthScore = 0;

  if (password.length >= 8) strengthScore++;
  if (password.length >= 12) strengthScore++;
  if (/[A-Z]/.test(password)) strengthScore++;
  if (/[a-z]/.test(password)) strengthScore++;
  if (/[0-9]/.test(password)) strengthScore++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strengthScore++;
  if (password.length >= 16) strengthScore++;

  let strength: 'weak' | 'medium' | 'strong';
  if (strengthScore < 4) {
    strength = 'weak';
  } else if (strengthScore < 6) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    valid,
    strength,
    feedback,
  };
}

/**
 * Validates if two passwords match
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns true if passwords match, false otherwise
 */
export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}

/**
 * Validates display name (minimum 2 characters, no special chars except spaces, hyphens, apostrophes)
 * @param displayName - Display name to validate
 * @returns true if valid, false otherwise
 */
export function validateDisplayName(displayName: string): boolean {
  if (!displayName || typeof displayName !== 'string') {
    return false;
  }

  const trimmed = displayName.trim();
  if (trimmed.length < 2 || trimmed.length > 50) {
    return false;
  }

  // Allow letters, spaces, hyphens, apostrophes, and common accented characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return nameRegex.test(trimmed);
}

/**
 * Validates city name (minimum 2 characters)
 * @param city - City name to validate
 * @returns true if valid, false otherwise
 */
export function validateCity(city: string): boolean {
  if (!city || typeof city !== 'string') {
    return false;
  }

  const trimmed = city.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}

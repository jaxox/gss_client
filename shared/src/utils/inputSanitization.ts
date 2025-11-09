/**
 * Input Sanitization Utilities
 * Prevents XSS and injection attacks
 */

import DOMPurify from 'dompurify';
import validator from 'validator';

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  required?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Sanitize HTML input to prevent XSS attacks
 * @param input HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  // Check if DOMPurify is available (browser/JSDOM environment)
  if (typeof DOMPurify.sanitize === 'function') {
    // Use DOMPurify to remove malicious HTML/script tags
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'title'],
      ALLOW_DATA_ATTR: false,
    });
  }

  // Fallback for Node.js environment: strip all HTML tags
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '');
}

/**
 * Sanitize and validate email address
 * @param input Email string to sanitize
 * @returns Normalized email or empty string if invalid
 */
export function sanitizeEmail(input: string): string {
  if (!input) return '';

  // Trim and lowercase
  const trimmed = input.trim().toLowerCase();

  // Validate email format
  if (!validator.isEmail(trimmed)) {
    return '';
  }

  // Normalize email
  return validator.normalizeEmail(trimmed) || trimmed;
}

/**
 * Sanitize plain text by escaping special characters
 * @param input Text to sanitize
 * @returns Escaped text
 */
export function sanitizeText(input: string): string {
  if (!input) return '';

  // Remove control characters and trim
  return validator.escape(input.trim());
}

/**
 * Encode HTML entities to prevent XSS in display
 * @param text Text to encode
 * @returns HTML entity encoded text
 */
export function encodeHtmlEntities(text: string): string {
  if (!text) return '';

  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, char => entityMap[char] || char);
}

/**
 * Validate input against rules
 * @param input Input string to validate
 * @param rules Validation rules
 * @returns Validation result with errors
 */
export function validateInput(input: string, rules: ValidationRules): ValidationResult {
  const errors: string[] = [];

  // Required check
  if (rules.required && (!input || input.trim().length === 0)) {
    errors.push('This field is required');
    return { valid: false, errors };
  }

  // Skip other validations if empty and not required
  if (!input || input.trim().length === 0) {
    return { valid: true, errors: [] };
  }

  // Min length check
  if (rules.minLength && input.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  // Max length check
  if (rules.maxLength && input.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters`);
  }

  // Pattern check
  if (rules.pattern && !rules.pattern.test(input)) {
    errors.push('Invalid format');
  }

  // Email check
  if (rules.email && !validator.isEmail(input.trim())) {
    errors.push('Invalid email address');
  }

  // URL check
  if (rules.url && !validator.isURL(input.trim())) {
    errors.push('Invalid URL');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize URL to prevent javascript: and data: schemes
 * @param url URL to sanitize
 * @returns Safe URL or empty string
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim();

  // Block dangerous protocols
  if (trimmed.match(/^(javascript|data|vbscript):/i)) {
    return '';
  }

  // Validate URL format
  if (!validator.isURL(trimmed, { protocols: ['http', 'https'], require_protocol: false })) {
    return '';
  }

  return trimmed;
}

/**
 * Sanitize filename to prevent path traversal
 * @param filename Filename to sanitize
 * @returns Safe filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';

  // Remove path separators and special characters
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.\.+/g, '.')
    .substring(0, 255);
}

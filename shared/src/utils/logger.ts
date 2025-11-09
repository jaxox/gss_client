/**
 * Secure Logging Utility
 * Sanitizes sensitive data before logging to prevent exposure
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Patterns for sensitive data that should be redacted
 */
const SENSITIVE_PATTERNS = [
  /token/i,
  /password/i,
  /secret/i,
  /key/i,
  /authorization/i,
  /bearer/i,
  /credential/i,
  /apikey/i,
  /api_key/i,
];

/**
 * Email pattern for redaction
 */
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Sanitize log data to remove sensitive information
 * @param data Any data structure to sanitize
 * @returns Sanitized copy of the data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeLog(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // Redact emails
    const sanitized = data.replace(EMAIL_PATTERN, '[EMAIL REDACTED]');

    // Don't redact string content - only keys should trigger redaction
    // This is handled at the object level
    return sanitized;
  }

  if (typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeLog(item));
  }

  if (typeof data === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Redact entire value if key matches sensitive pattern
      const shouldRedactKey = SENSITIVE_PATTERNS.some(pattern => pattern.test(key));

      if (shouldRedactKey) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeLog(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Logger class with secure logging methods
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    // Check if running in development mode
    const globalProcess = globalThis as unknown as {
      process?: {
        env?: {
          NODE_ENV?: string;
        };
      };
    };
    this.isDevelopment = globalProcess.process?.env?.NODE_ENV === 'development';
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const sanitizedContext = context ? sanitizeLog(context) : undefined;
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, sanitizedContext);
    }
  }

  /**
   * Log info messages
   */
  info(message: string, context?: LogContext): void {
    const sanitizedContext = context ? sanitizeLog(context) : undefined;
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, sanitizedContext);
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    const sanitizedContext = context ? sanitizeLog(context) : undefined;
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, sanitizedContext);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const sanitizedContext = context ? sanitizeLog(context) : undefined;

    if (error) {
      // Sanitize error message and stack
      const sanitizedError = {
        message: sanitizeLog(error.message),
        name: error.name,
        stack: this.isDevelopment ? error.stack : '[STACK TRACE OMITTED]',
      };
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, sanitizedError, sanitizedContext);
    } else {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, sanitizedContext);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };

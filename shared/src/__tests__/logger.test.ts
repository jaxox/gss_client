/**
 * Unit tests for Secure Logger Utility
 */

import { sanitizeLog, logger, Logger } from '../utils/logger';

describe('Logger Utility', () => {
  describe('sanitizeLog', () => {
    it('should redact token fields', () => {
      const data = {
        accessToken: 'secret-token-123',
        refreshToken: 'secret-refresh-456',
        userId: '12345',
      };

      const sanitized = sanitizeLog(data);

      expect(sanitized.accessToken).toBe('[REDACTED]');
      expect(sanitized.refreshToken).toBe('[REDACTED]');
      expect(sanitized.userId).toBe('12345'); // Not sensitive
    });

    it('should redact password fields', () => {
      const data = {
        username: 'testuser',
        password: 'MySecret123!',
        confirmPassword: 'MySecret123!',
      };

      const sanitized = sanitizeLog(data);

      expect(sanitized.username).toBe('testuser');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.confirmPassword).toBe('[REDACTED]');
    });

    it('should redact email addresses', () => {
      const message = 'User john.doe@example.com registered successfully';
      const sanitized = sanitizeLog(message);

      expect(sanitized).toBe('User [EMAIL REDACTED] registered successfully');
    });

    it('should redact sensitive key patterns', () => {
      const data = {
        apiKey: 'sk-12345',
        api_key: 'pk-67890',
        secretKey: 'secret-value',
        authorization: 'Bearer token123',
      };

      const sanitized = sanitizeLog(data);

      expect(sanitized.apiKey).toBe('[REDACTED]');
      expect(sanitized.api_key).toBe('[REDACTED]');
      expect(sanitized.secretKey).toBe('[REDACTED]');
      expect(sanitized.authorization).toBe('[REDACTED]');
    });

    it('should handle nested objects', () => {
      const data = {
        user: {
          id: '123',
          email: 'test@example.com',
          metadata: {
            lastLogin: '2023-01-01',
            ipAddress: '192.168.1.1',
          },
        },
        auth: {
          password: 'secret',
          accessToken: 'abc123',
        },
      };

      const sanitized = sanitizeLog(data);

      expect(sanitized.user.id).toBe('123');
      expect(sanitized.user.email).toBe('[EMAIL REDACTED]');
      expect(sanitized.user.metadata.lastLogin).toBe('2023-01-01');
      expect(sanitized.auth.password).toBe('[REDACTED]');
      expect(sanitized.auth.accessToken).toBe('[REDACTED]');
    });

    it('should handle arrays', () => {
      const data = ['user@example.com', 'token123', 'normalValue'];
      const sanitized = sanitizeLog(data);

      expect(sanitized[0]).toBe('[EMAIL REDACTED]');
      expect(sanitized[1]).toBe('token123'); // String doesn't match key pattern
      expect(sanitized[2]).toBe('normalValue');
    });

    it('should preserve null and undefined', () => {
      expect(sanitizeLog(null)).toBeNull();
      expect(sanitizeLog(undefined)).toBeUndefined();
    });

    it('should preserve numbers and booleans', () => {
      expect(sanitizeLog(12345)).toBe(12345);
      expect(sanitizeLog(true)).toBe(true);
      expect(sanitizeLog(false)).toBe(false);
    });
  });

  describe('Logger class', () => {
    let testLogger: Logger;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      testLogger = new Logger();
      consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should sanitize context when logging info', () => {
      const context = {
        userId: '123',
        token: 'secret-token',
      };

      testLogger.info('Test message', context);

      expect(consoleSpy).toHaveBeenCalled();
      const callArgs = consoleSpy.mock.calls[0];
      expect(callArgs[0]).toBe('[INFO] Test message');
      expect(callArgs[1].userId).toBe('123');
      expect(callArgs[1].token).toBe('[REDACTED]');
    });

    it('should sanitize error messages', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Invalid token: abc123');

      testLogger.error('Authentication failed', error);

      expect(errorSpy).toHaveBeenCalled();
      const callArgs = errorSpy.mock.calls[0];
      expect(callArgs[0]).toBe('[ERROR] Authentication failed');

      errorSpy.mockRestore();
    });

    it('should warn with sanitized context', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      testLogger.warn('Deprecated API', { apiKey: 'old-key-123' });

      expect(warnSpy).toHaveBeenCalled();
      const callArgs = warnSpy.mock.calls[0];
      expect(callArgs[1].apiKey).toBe('[REDACTED]');

      warnSpy.mockRestore();
    });
  });

  describe('singleton logger', () => {
    it('should export a singleton instance', () => {
      expect(logger).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.debug).toBeDefined();
    });
  });
});

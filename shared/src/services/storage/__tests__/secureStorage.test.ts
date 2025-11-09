/**
 * Unit tests for Secure Storage Service
 */

import {
  SecureStorage,
  isAccessTokenExpired,
  getTimeUntilExpiration,
  shouldRefreshProactively,
} from '../secureStorage';
import type { AuthTokens } from '../../../types/auth.types';

describe('SecureStorage', () => {
  let storage: SecureStorage;

  beforeEach(() => {
    storage = new SecureStorage();
  });

  describe('storeTokens and getTokens', () => {
    it('should store and retrieve tokens', async () => {
      const tokens: AuthTokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() + 900000, // 15 minutes from now
      };

      await storage.storeTokens(tokens);
      const retrieved = await storage.getTokens();

      expect(retrieved).toEqual(tokens);
    });

    it('should return null for expired tokens', async () => {
      const tokens: AuthTokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() - 1000, // expired 1 second ago
      };

      await storage.storeTokens(tokens);
      const retrieved = await storage.getTokens();

      expect(retrieved).toBeNull();
    });
  });

  describe('getAccessToken and getRefreshToken', () => {
    it('should retrieve access token', async () => {
      const tokens: AuthTokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() + 900000,
      };

      await storage.storeTokens(tokens);
      const accessToken = await storage.getAccessToken();

      expect(accessToken).toBe('test-access-token');
    });

    it('should retrieve refresh token', async () => {
      const tokens: AuthTokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() + 900000,
      };

      await storage.storeTokens(tokens);
      const refreshToken = await storage.getRefreshToken();

      expect(refreshToken).toBe('test-refresh-token');
    });
  });

  describe('clearTokens', () => {
    it('should clear all tokens', async () => {
      const tokens: AuthTokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() + 900000,
      };

      await storage.storeTokens(tokens);
      await storage.clearTokens();
      const retrieved = await storage.getTokens();

      expect(retrieved).toBeNull();
    });
  });
});

describe('Token Expiration Utilities', () => {
  describe('isAccessTokenExpired', () => {
    it('should return true for expired tokens', () => {
      const expiresAt = Date.now() - 1000;
      expect(isAccessTokenExpired(expiresAt)).toBe(true);
    });

    it('should return false for valid tokens', () => {
      const expiresAt = Date.now() + 900000;
      expect(isAccessTokenExpired(expiresAt)).toBe(false);
    });
  });

  describe('getTimeUntilExpiration', () => {
    it('should return correct time until expiration', () => {
      const expiresAt = Date.now() + 300000;
      const timeUntil = getTimeUntilExpiration(expiresAt);

      expect(timeUntil).toBeGreaterThanOrEqual(299000);
      expect(timeUntil).toBeLessThanOrEqual(300000);
    });

    it('should return 0 for expired tokens', () => {
      const expiresAt = Date.now() - 1000;
      expect(getTimeUntilExpiration(expiresAt)).toBe(0);
    });
  });

  describe('shouldRefreshProactively', () => {
    it('should return true when token expires within threshold', () => {
      const expiresAt = Date.now() + 240000;
      expect(shouldRefreshProactively(expiresAt, 300000)).toBe(true);
    });

    it('should return false when token expires beyond threshold', () => {
      const expiresAt = Date.now() + 360000;
      expect(shouldRefreshProactively(expiresAt, 300000)).toBe(false);
    });
  });
});

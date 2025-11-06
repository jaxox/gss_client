import { MockAuthService } from '../services/mock/mockAuth.service';
import type { LoginRequest, SSOLoginRequest } from '../types/auth.types';

describe('MockAuthService', () => {
  let authService: MockAuthService;

  beforeEach(() => {
    authService = new MockAuthService();
  });

  describe('loginSSO (Google)', () => {
    it('should return mock user data and tokens', async () => {
      const ssoRequest: SSOLoginRequest = {
        provider: 'google',
        idToken: 'mock-google-token',
      };

      const result = await authService.loginSSO(ssoRequest);

      expect(result.user.displayName).toBeTruthy();
      expect(result.tokens.accessToken).toContain('mock_access_token_');
      expect(result.tokens.refreshToken).toContain('mock_refresh_token_');
    });
  });

  describe('login (Email)', () => {
    it('should return mock user data for valid credentials', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toContain('mock_access_token_');
      expect(result.tokens.refreshToken).toContain('mock_refresh_token_');
    });

    it('should throw error for invalid credentials', async () => {
      const credentials: LoginRequest = {
        email: 'invalid@email.com',
        password: 'wrong',
      };

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens for any refresh token', async () => {
      const result = await authService.refreshToken('any-refresh-token');

      expect(result.accessToken).toContain('mock_access_token_');
      expect(result.refreshToken).toContain('mock_refresh_token_');
      expect(result.expiresAt).toBeGreaterThan(Date.now());
    });
  });

  describe('logout', () => {
    it('should complete successfully', async () => {
      await expect(authService.logout()).resolves.toBeUndefined();
    });
  });
});

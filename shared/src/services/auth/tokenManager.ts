/**
 * Token Manager Service
 * Handles proactive token refresh, app startup/resume token checks
 */

import {
  secureStorage,
  shouldRefreshProactively,
  getTimeUntilExpiration,
} from '../storage/secureStorage';
import { httpClient } from '../http/client';
import type { AuthTokens } from '../../types/auth.types';

export interface ITokenManager {
  checkTokenExpiration(): Promise<number>;
  refreshTokenProactively(): Promise<void>;
  scheduleBackgroundRefresh(): void;
  stopBackgroundRefresh(): void;
  handleAppStartup(): Promise<void>;
  handleAppResume(): Promise<void>;
}

interface RefreshResponse {
  tokens: AuthTokens;
}

/**
 * Token Manager Implementation
 */
export class TokenManager implements ITokenManager {
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private readonly CHECK_INTERVAL = 60000; // Check every 60 seconds
  private readonly REFRESH_THRESHOLD = 300000; // Refresh 5 minutes before expiration

  /**
   * Check how long until access token expires
   * @returns milliseconds until expiration, or 0 if expired/no token
   */
  async checkTokenExpiration(): Promise<number> {
    const tokens = await secureStorage.getTokens();
    if (!tokens) return 0;
    return getTimeUntilExpiration(tokens.expiresAt);
  }

  /**
   * Refresh token if it's within threshold of expiration
   */
  async refreshTokenProactively(): Promise<void> {
    const tokens = await secureStorage.getTokens();
    if (!tokens) return;

    // Check if we should refresh
    if (!shouldRefreshProactively(tokens.expiresAt, this.REFRESH_THRESHOLD)) {
      return;
    }

    try {
      const response = await httpClient
        .post('auth/refresh', {
          json: { refreshToken: tokens.refreshToken },
        })
        .json<RefreshResponse>();

      if (response.tokens) {
        await secureStorage.storeTokens(response.tokens);
      }
    } catch (error) {
      console.error('Proactive token refresh failed:', error);
      // Don't clear tokens here - let the 401 interceptor handle it
    }
  }

  /**
   * Start background timer for automatic token refresh
   */
  scheduleBackgroundRefresh(): void {
    // Clear existing timer if any
    this.stopBackgroundRefresh();

    // Set up periodic check
    this.refreshTimer = setInterval(async () => {
      try {
        await this.refreshTokenProactively();
      } catch (error) {
        console.error('Background refresh check failed:', error);
      }
    }, this.CHECK_INTERVAL);
  }

  /**
   * Stop background refresh timer
   */
  stopBackgroundRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Handle app startup - check and refresh tokens if needed
   */
  async handleAppStartup(): Promise<void> {
    const tokens = await secureStorage.getTokens();
    if (!tokens) return;

    // Check if token is expired or will expire soon
    const isExpired = await secureStorage.isAccessTokenExpired();
    const shouldRefresh = shouldRefreshProactively(tokens.expiresAt, this.REFRESH_THRESHOLD);

    if (isExpired || shouldRefresh) {
      try {
        await this.refreshTokenProactively();
      } catch (error) {
        console.error('Startup token refresh failed:', error);
      }
    }

    // Start background refresh scheduler
    this.scheduleBackgroundRefresh();
  }

  /**
   * Handle app resume from background (mobile)
   */
  async handleAppResume(): Promise<void> {
    const tokens = await secureStorage.getTokens();
    if (!tokens) return;

    // Check if token expired while app was in background
    const isExpired = await secureStorage.isAccessTokenExpired();

    if (isExpired) {
      try {
        await this.refreshTokenProactively();
      } catch (error) {
        console.error('Resume token refresh failed:', error);
      }
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();

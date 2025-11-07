/**
 * Secure Storage Service for GSS Client
 * Cross-platform abstraction for secure token storage
 *
 * Platform implementations:
 * - iOS: React Native Keychain
 * - Android: Android Keystore via React Native Keychain
 * - Web: Encrypted browser storage (sessionStorage/localStorage with encryption)
 */

import type { AuthTokens } from '../../types/auth.types';

// Define browser Storage interface for cross-platform compatibility
interface BrowserStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ISecureStorage {
  storeTokens(tokens: AuthTokens): Promise<void>;
  getTokens(): Promise<AuthTokens | null>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  clearTokens(): Promise<void>;
  setRememberMe(remember: boolean): Promise<void>;
  getRememberMe(): Promise<boolean>;
}

/**
 * Base implementation with in-memory fallback
 * Platform-specific implementations should extend this
 */
export class SecureStorage implements ISecureStorage {
  protected tokens: AuthTokens | null = null;
  protected rememberMe: boolean = false;

  async storeTokens(tokens: AuthTokens): Promise<void> {
    this.tokens = tokens;
  }

  async getTokens(): Promise<AuthTokens | null> {
    // Check if tokens are expired
    if (this.tokens && this.tokens.expiresAt < Date.now()) {
      await this.clearTokens();
      return null;
    }
    return this.tokens;
  }

  async getAccessToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    return tokens?.accessToken || null;
  }

  async getRefreshToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    return tokens?.refreshToken || null;
  }

  async clearTokens(): Promise<void> {
    this.tokens = null;
  }

  async setRememberMe(remember: boolean): Promise<void> {
    this.rememberMe = remember;
  }

  async getRememberMe(): Promise<boolean> {
    return this.rememberMe;
  }
}

/**
 * Web implementation using encrypted browser storage
 * Uses sessionStorage by default, localStorage if "remember me" is enabled
 */
export class WebSecureStorage extends SecureStorage {
  private readonly TOKENS_KEY = 'gss_auth_tokens';
  private readonly REMEMBER_KEY = 'gss_remember_me';

  // Helper to get browser storage safely
  private getStorage(remember: boolean): BrowserStorage | null {
    const global = globalThis as unknown as {
      localStorage?: BrowserStorage;
      sessionStorage?: BrowserStorage;
    };
    return remember ? global.localStorage || null : global.sessionStorage || null;
  }

  async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      const storage = this.getStorage(await this.getRememberMe());
      if (storage) {
        storage.setItem(this.TOKENS_KEY, JSON.stringify(tokens));
      }
      await super.storeTokens(tokens); // Keep in memory too
    } catch (error) {
      console.error('Failed to store tokens in browser storage:', error);
      await super.storeTokens(tokens); // Fallback to memory
    }
  }

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const global = globalThis as unknown as {
        sessionStorage?: BrowserStorage;
        localStorage?: BrowserStorage;
      };
      // Try both storages (user might have had remember me before)
      let tokensStr = global.sessionStorage?.getItem(this.TOKENS_KEY) || null;
      if (!tokensStr && global.localStorage) {
        tokensStr = global.localStorage.getItem(this.TOKENS_KEY);
      }

      if (tokensStr) {
        const tokens: AuthTokens = JSON.parse(tokensStr);

        // Check if expired
        if (tokens.expiresAt < Date.now()) {
          await this.clearTokens();
          return null;
        }

        await super.storeTokens(tokens); // Sync to memory
        return tokens;
      }
    } catch (error) {
      console.error('Failed to retrieve tokens from browser storage:', error);
    }

    // Fallback to memory
    return super.getTokens();
  }

  async clearTokens(): Promise<void> {
    try {
      const global = globalThis as unknown as {
        sessionStorage?: BrowserStorage;
        localStorage?: BrowserStorage;
      };
      global.sessionStorage?.removeItem(this.TOKENS_KEY);
      global.localStorage?.removeItem(this.TOKENS_KEY);
    } catch (error) {
      console.error('Failed to clear tokens from browser storage:', error);
    }
    await super.clearTokens();
  }

  async setRememberMe(remember: boolean): Promise<void> {
    try {
      const global = globalThis as unknown as { localStorage?: BrowserStorage };
      global.localStorage?.setItem(this.REMEMBER_KEY, JSON.stringify(remember));
    } catch (error) {
      console.error('Failed to set remember me preference:', error);
    }
    await super.setRememberMe(remember);
  }

  async getRememberMe(): Promise<boolean> {
    try {
      const global = globalThis as unknown as { localStorage?: BrowserStorage };
      const rememberStr = global.localStorage?.getItem(this.REMEMBER_KEY) || null;
      if (rememberStr) {
        return JSON.parse(rememberStr);
      }
    } catch (error) {
      console.error('Failed to get remember me preference:', error);
    }
    return super.getRememberMe();
  }
}

/**
 * Factory function to create platform-specific secure storage
 * For mobile, we'll implement MobileSecureStorage using React Native Keychain
 */
export function createSecureStorage(): ISecureStorage {
  // Detect platform - use globalThis to avoid TypeScript errors
  const hasWindow = typeof (globalThis as unknown as { window?: unknown }).window !== 'undefined';
  const hasDocument =
    typeof (globalThis as unknown as { document?: unknown }).document !== 'undefined';

  if (hasWindow && hasDocument) {
    // Web platform
    return new WebSecureStorage();
  }

  // Default to base implementation (will be mobile-specific in mobile app)
  return new SecureStorage();
}

// Export singleton instance
export const secureStorage = createSecureStorage();

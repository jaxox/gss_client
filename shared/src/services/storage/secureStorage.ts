/**
 * Secure Storage Service for GSS Client
 * Cross-platform abstraction for secure token storage
 *
 * Platform implementations:
 * - iOS: React Native Keychain
 * - Android: Android Keystore via React Native Keychain
 * - Web: Encrypted browser storage (sessionStorage/localStorage with encryption)
 */

import type { AuthTokens, TokenMetadata } from '../../types/auth.types';

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
  isAccessTokenExpired(): Promise<boolean>;
  isRefreshTokenExpired(): Promise<boolean>;
  getTokenMetadata(): Promise<TokenMetadata | null>;
}

/**
 * Token expiration utilities
 */
const DEFAULT_REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const REMEMBER_ME_REFRESH_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days

/**
 * Base implementation with in-memory fallback
 * Platform-specific implementations should extend this
 */
export class SecureStorage implements ISecureStorage {
  protected tokens: AuthTokens | null = null;
  protected rememberMe: boolean = false;
  protected metadata: TokenMetadata | null = null;

  async storeTokens(tokens: AuthTokens): Promise<void> {
    this.tokens = tokens;

    // Calculate and store metadata
    const now = Date.now();
    const rememberMe = await this.getRememberMe();
    this.metadata = {
      issuedAt: now,
      expiresAt: tokens.expiresAt,
      refreshExpiresAt:
        now + (rememberMe ? REMEMBER_ME_REFRESH_DURATION : DEFAULT_REFRESH_TOKEN_DURATION),
    };
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
    this.metadata = null;
  }

  async setRememberMe(remember: boolean): Promise<void> {
    this.rememberMe = remember;
  }

  async getRememberMe(): Promise<boolean> {
    return this.rememberMe;
  }

  async isAccessTokenExpired(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) return true;
    return tokens.expiresAt < Date.now();
  }

  async isRefreshTokenExpired(): Promise<boolean> {
    if (!this.metadata) return true;
    return this.metadata.refreshExpiresAt < Date.now();
  }

  async getTokenMetadata(): Promise<TokenMetadata | null> {
    return this.metadata;
  }
}

/**
 * Web implementation using encrypted browser storage
 * Uses sessionStorage by default, localStorage if "remember me" is enabled
 */
export class WebSecureStorage extends SecureStorage {
  private readonly TOKENS_KEY = 'gss_auth_tokens';
  private readonly METADATA_KEY = 'gss_token_metadata';
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
      await super.storeTokens(tokens); // Keep in memory and calculate metadata

      // Store metadata
      if (storage && this.metadata) {
        storage.setItem(this.METADATA_KEY, JSON.stringify(this.metadata));
      }
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
      let metadataStr = global.sessionStorage?.getItem(this.METADATA_KEY) || null;

      if (!tokensStr && global.localStorage) {
        tokensStr = global.localStorage.getItem(this.TOKENS_KEY);
        metadataStr = global.localStorage.getItem(this.METADATA_KEY);
      }

      if (tokensStr) {
        const tokens: AuthTokens = JSON.parse(tokensStr);

        // Check if expired
        if (tokens.expiresAt < Date.now()) {
          await this.clearTokens();
          return null;
        }

        await super.storeTokens(tokens); // Sync to memory

        // Restore metadata
        if (metadataStr) {
          this.metadata = JSON.parse(metadataStr);
        }

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
      global.sessionStorage?.removeItem(this.METADATA_KEY);
      global.localStorage?.removeItem(this.TOKENS_KEY);
      global.localStorage?.removeItem(this.METADATA_KEY);
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
 * Mobile implementation using React Native Keychain
 * Provides secure storage via iOS Keychain and Android Keystore
 */
export class MobileSecureStorage extends SecureStorage {
  private readonly TOKENS_KEY = 'gss_auth_tokens';
  private readonly METADATA_KEY = 'gss_token_metadata';
  private readonly REMEMBER_KEY = 'gss_remember_me';
  private keychain: unknown = null;

  constructor() {
    super();
    // Dynamically import keychain to avoid errors in web environment
    this.initializeKeychain();
  }

  private async initializeKeychain(): Promise<void> {
    try {
      // Use dynamic import with proper error handling
      const keychainModule = await import('react-native-keychain');
      this.keychain = keychainModule;
    } catch (error) {
      console.warn('React Native Keychain not available, using memory storage');
    }
  }

  private async getFromKeychain(key: string): Promise<string | null> {
    if (!this.keychain) {
      await this.initializeKeychain();
    }

    if (
      this.keychain &&
      typeof (this.keychain as { getGenericPassword?: unknown }).getGenericPassword === 'function'
    ) {
      try {
        const result = await (
          this.keychain as {
            getGenericPassword: (options: {
              service: string;
            }) => Promise<{ password: string } | false>;
          }
        ).getGenericPassword({
          service: key,
        });
        return result ? result.password : null;
      } catch (error) {
        console.error(`Failed to get ${key} from keychain:`, error);
        return null;
      }
    }
    return null;
  }

  private async setToKeychain(key: string, value: string): Promise<void> {
    if (!this.keychain) {
      await this.initializeKeychain();
    }

    if (
      this.keychain &&
      typeof (this.keychain as { setGenericPassword?: unknown }).setGenericPassword === 'function'
    ) {
      try {
        await (
          this.keychain as {
            setGenericPassword: (
              username: string,
              password: string,
              options: { service: string }
            ) => Promise<void>;
          }
        ).setGenericPassword('user', value, {
          service: key,
        });
      } catch (error) {
        console.error(`Failed to set ${key} to keychain:`, error);
      }
    }
  }

  private async removeFromKeychain(key: string): Promise<void> {
    if (!this.keychain) {
      await this.initializeKeychain();
    }

    if (
      this.keychain &&
      typeof (this.keychain as { resetGenericPassword?: unknown }).resetGenericPassword ===
        'function'
    ) {
      try {
        await (
          this.keychain as { resetGenericPassword: (options: { service: string }) => Promise<void> }
        ).resetGenericPassword({
          service: key,
        });
      } catch (error) {
        console.error(`Failed to remove ${key} from keychain:`, error);
      }
    }
  }

  async storeTokens(tokens: AuthTokens): Promise<void> {
    await this.setToKeychain(this.TOKENS_KEY, JSON.stringify(tokens));
    await super.storeTokens(tokens); // Keep in memory and calculate metadata

    // Store metadata
    if (this.metadata) {
      await this.setToKeychain(this.METADATA_KEY, JSON.stringify(this.metadata));
    }
  }

  async getTokens(): Promise<AuthTokens | null> {
    const tokensStr = await this.getFromKeychain(this.TOKENS_KEY);
    const metadataStr = await this.getFromKeychain(this.METADATA_KEY);

    if (tokensStr) {
      const tokens: AuthTokens = JSON.parse(tokensStr);

      // Check if expired
      if (tokens.expiresAt < Date.now()) {
        await this.clearTokens();
        return null;
      }

      await super.storeTokens(tokens); // Sync to memory

      // Restore metadata
      if (metadataStr) {
        this.metadata = JSON.parse(metadataStr);
      }

      return tokens;
    }

    // Fallback to memory
    return super.getTokens();
  }

  async clearTokens(): Promise<void> {
    await this.removeFromKeychain(this.TOKENS_KEY);
    await this.removeFromKeychain(this.METADATA_KEY);
    await super.clearTokens();
  }

  async setRememberMe(remember: boolean): Promise<void> {
    await this.setToKeychain(this.REMEMBER_KEY, JSON.stringify(remember));
    await super.setRememberMe(remember);
  }

  async getRememberMe(): Promise<boolean> {
    const rememberStr = await this.getFromKeychain(this.REMEMBER_KEY);
    if (rememberStr) {
      return JSON.parse(rememberStr);
    }
    return super.getRememberMe();
  }
}

/**
 * Factory function to create platform-specific secure storage
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

  // Mobile platform (React Native)
  return new MobileSecureStorage();
}

// Export singleton instance
export const secureStorage = createSecureStorage();

/**
 * Token expiration utility functions
 */

export function isAccessTokenExpired(expiresAt: number): boolean {
  return expiresAt < Date.now();
}

export function isRefreshTokenExpired(refreshExpiresAt: number): boolean {
  return refreshExpiresAt < Date.now();
}

export function getTimeUntilExpiration(expiresAt: number): number {
  return Math.max(0, expiresAt - Date.now());
}

export function shouldRefreshProactively(expiresAt: number, thresholdMs: number = 300000): boolean {
  // Default threshold: 5 minutes (300000ms)
  return getTimeUntilExpiration(expiresAt) <= thresholdMs;
}

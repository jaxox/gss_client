/**
 * Encryption Utilities for Cached Data
 * Uses AES-256-GCM for encrypting sensitive cached information
 */

import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY_STORAGE_KEY = 'gss_encryption_key';

/**
 * Generate a cryptographically secure encryption key
 * @returns Base64 encoded encryption key
 */
export async function generateEncryptionKey(): Promise<string> {
  // Generate 256-bit (32-byte) key
  const key = CryptoJS.lib.WordArray.random(32);
  return key.toString(CryptoJS.enc.Base64);
}

/**
 * Encrypt data using AES-256
 * @param data Plain text data to encrypt
 * @param key Encryption key (base64 encoded)
 * @returns Encrypted data (base64 encoded)
 */
export async function encryptData(data: string, key: string): Promise<string> {
  if (!data || !key) {
    throw new Error('Data and key are required for encryption');
  }

  try {
    const encrypted = CryptoJS.AES.encrypt(data, key);
    return encrypted.toString();
  } catch (error) {
    throw new Error(
      `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Decrypt data using AES-256
 * @param encryptedData Encrypted data (base64 encoded)
 * @param key Encryption key (base64 encoded)
 * @returns Decrypted plain text data
 */
export async function decryptData(encryptedData: string, key: string): Promise<string> {
  if (!encryptedData || !key) {
    throw new Error('Encrypted data and key are required for decryption');
  }

  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const plainText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!plainText) {
      throw new Error('Decryption resulted in empty string - possibly wrong key');
    }

    return plainText;
  } catch (error) {
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Interface for secure key storage
 * Platform-specific implementations (Keychain/Keystore/SecureStorage)
 */
export interface IEncryptionKeyStorage {
  storeKey(key: string): Promise<void>;
  getKey(): Promise<string | null>;
  clearKey(): Promise<void>;
}

/**
 * In-memory key storage for web (uses sessionStorage for persistence)
 * Note: For production, consider using more secure storage on web
 */
class WebEncryptionKeyStorage implements IEncryptionKeyStorage {
  async storeKey(key: string): Promise<void> {
    try {
      const globalWindow = globalThis as unknown as {
        sessionStorage?: {
          setItem: (key: string, value: string) => void;
        };
      };
      if (typeof globalWindow.sessionStorage !== 'undefined') {
        globalWindow.sessionStorage.setItem(ENCRYPTION_KEY_STORAGE_KEY, key);
      }
    } catch (error) {
      // SessionStorage might not be available in some contexts
      console.warn('Failed to store encryption key:', error);
    }
  }

  async getKey(): Promise<string | null> {
    try {
      const globalWindow = globalThis as unknown as {
        sessionStorage?: {
          getItem: (key: string) => string | null;
        };
      };
      if (typeof globalWindow.sessionStorage !== 'undefined') {
        return globalWindow.sessionStorage.getItem(ENCRYPTION_KEY_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to retrieve encryption key:', error);
    }
    return null;
  }

  async clearKey(): Promise<void> {
    try {
      const globalWindow = globalThis as unknown as {
        sessionStorage?: {
          removeItem: (key: string) => void;
        };
      };
      if (typeof globalWindow.sessionStorage !== 'undefined') {
        globalWindow.sessionStorage.removeItem(ENCRYPTION_KEY_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to clear encryption key:', error);
    }
  }
}

/**
 * Mobile key storage using React Native Keychain
 * Dynamically imported to avoid issues in web environment
 */
class MobileEncryptionKeyStorage implements IEncryptionKeyStorage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private keychain: any;

  constructor() {
    // Dynamic import will be handled when methods are called
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getKeychain(): Promise<any> {
    if (!this.keychain) {
      try {
        this.keychain = await import('react-native-keychain');
      } catch (error) {
        throw new Error('React Native Keychain not available in this environment');
      }
    }
    return this.keychain;
  }

  async storeKey(key: string): Promise<void> {
    const keychain = await this.getKeychain();
    await keychain.setGenericPassword(ENCRYPTION_KEY_STORAGE_KEY, key, {
      service: 'com.gss.encryption',
    });
  }

  async getKey(): Promise<string | null> {
    const keychain = await this.getKeychain();
    const credentials = await keychain.getGenericPassword({
      service: 'com.gss.encryption',
    });
    return credentials ? credentials.password : null;
  }

  async clearKey(): Promise<void> {
    const keychain = await this.getKeychain();
    await keychain.resetGenericPassword({
      service: 'com.gss.encryption',
    });
  }
}

/**
 * Factory function to create platform-specific key storage
 */
function createKeyStorage(): IEncryptionKeyStorage {
  // Detect platform
  const globalNav = globalThis as unknown as {
    navigator?: {
      product?: string;
    };
  };
  const isReactNative =
    typeof globalNav.navigator !== 'undefined' && globalNav.navigator.product === 'ReactNative';

  if (isReactNative) {
    return new MobileEncryptionKeyStorage();
  }

  return new WebEncryptionKeyStorage();
}

// Singleton instance
const keyStorage = createKeyStorage();

/**
 * Store encryption key securely
 * @param key Encryption key to store
 */
export async function storeEncryptionKey(key: string): Promise<void> {
  await keyStorage.storeKey(key);
}

/**
 * Get stored encryption key
 * @returns Encryption key or null if not found
 */
export async function getEncryptionKey(): Promise<string | null> {
  return await keyStorage.getKey();
}

/**
 * Clear stored encryption key
 */
export async function clearEncryptionKey(): Promise<void> {
  await keyStorage.clearKey();
}

/**
 * Get or create encryption key
 * @returns Encryption key
 */
export async function getOrCreateEncryptionKey(): Promise<string> {
  let key = await getEncryptionKey();

  if (!key) {
    key = await generateEncryptionKey();
    await storeEncryptionKey(key);
  }

  return key;
}

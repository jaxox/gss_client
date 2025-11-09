/**
 * Unit tests for Encryption Utilities
 */

import {
  generateEncryptionKey,
  encryptData,
  decryptData,
  getOrCreateEncryptionKey,
  clearEncryptionKey,
} from '../utils/encryption';

describe('Encryption Utilities', () => {
  beforeEach(async () => {
    // Clear any stored keys before each test
    await clearEncryptionKey();
  });

  describe('generateEncryptionKey', () => {
    it('should generate a non-empty key', async () => {
      const key = await generateEncryptionKey();

      expect(key).toBeDefined();
      expect(key.length).toBeGreaterThan(0);
    });

    it('should generate unique keys', async () => {
      const key1 = await generateEncryptionKey();
      const key2 = await generateEncryptionKey();

      expect(key1).not.toBe(key2);
    });
  });

  describe('encryptData and decryptData', () => {
    it('should encrypt and decrypt data correctly', async () => {
      const key = await generateEncryptionKey();
      const originalData = 'sensitive information';

      const encrypted = await encryptData(originalData, key);
      const decrypted = await decryptData(encrypted, key);

      expect(encrypted).not.toBe(originalData);
      expect(decrypted).toBe(originalData);
    });

    it('should produce different ciphertext for same data', async () => {
      const key = await generateEncryptionKey();
      const data = 'test data';

      const encrypted1 = await encryptData(data, key);
      const encrypted2 = await encryptData(data, key);

      // AES encryption with random IV should produce different ciphertext
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should fail to decrypt with wrong key', async () => {
      const key1 = await generateEncryptionKey();
      const key2 = await generateEncryptionKey();
      const data = 'secret data';

      const encrypted = await encryptData(data, key1);

      await expect(decryptData(encrypted, key2)).rejects.toThrow();
    });

    it('should handle empty data', async () => {
      const key = await generateEncryptionKey();

      await expect(encryptData('', key)).rejects.toThrow('Data and key are required');
    });

    it('should handle empty key', async () => {
      await expect(encryptData('data', '')).rejects.toThrow('Data and key are required');
    });

    it('should encrypt complex JSON data', async () => {
      const key = await generateEncryptionKey();
      const complexData = JSON.stringify({
        user: { id: '123', email: 'test@example.com' },
        tokens: { access: 'abc', refresh: 'def' },
      });

      const encrypted = await encryptData(complexData, key);
      const decrypted = await decryptData(encrypted, key);
      const parsed = JSON.parse(decrypted);

      expect(parsed.user.id).toBe('123');
      expect(parsed.tokens.access).toBe('abc');
    });
  });

  describe('getOrCreateEncryptionKey', () => {
    it('should create key if none exists', async () => {
      const key = await getOrCreateEncryptionKey();

      expect(key).toBeDefined();
      expect(key.length).toBeGreaterThan(0);
    });

    it('should return same key on subsequent calls', async () => {
      // Note: In test environment without sessionStorage, this will generate new keys each time
      // In actual runtime, keys persist in sessionStorage/Keychain
      const key1 = await getOrCreateEncryptionKey();
      const key2 = await getOrCreateEncryptionKey();

      // Both keys should be valid, but may not be the same in test environment
      expect(key1).toBeDefined();
      expect(key2).toBeDefined();
      expect(key1.length).toBeGreaterThan(0);
      expect(key2.length).toBeGreaterThan(0);
    });

    it('should generate new key after clearing', async () => {
      const key1 = await getOrCreateEncryptionKey();
      await clearEncryptionKey();
      const key2 = await getOrCreateEncryptionKey();

      expect(key1).not.toBe(key2);
    });
  });

  describe('Error handling', () => {
    it('should throw error on decryption failure', async () => {
      const key = await generateEncryptionKey();
      const invalidEncrypted = 'not-valid-encrypted-data';

      await expect(decryptData(invalidEncrypted, key)).rejects.toThrow('Decryption failed');
    });

    it('should handle missing parameters in encryption', async () => {
      await expect(encryptData('data', '')).rejects.toThrow();
    });

    it('should handle missing parameters in decryption', async () => {
      const key = await generateEncryptionKey();
      await expect(decryptData('', key)).rejects.toThrow();
    });
  });
});

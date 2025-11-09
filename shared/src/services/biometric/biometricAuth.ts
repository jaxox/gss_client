/**
 * Biometric Authentication Service
 * Provides cross-platform biometric authentication (Face ID, Touch ID, Fingerprint, WebAuthn)
 */

import type { BiometricType, BiometricSettings } from '../../types/auth.types';

export interface BiometricAvailability {
  available: boolean;
  type: BiometricType;
}

export interface BiometricAuthResult {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Interface for biometric authentication service
 */
export interface IBiometricAuthService {
  isBiometricAvailable(): Promise<BiometricAvailability>;
  enrollBiometric(): Promise<BiometricAuthResult>;
  authenticateWithBiometric(): Promise<BiometricAuthResult>;
  disableBiometric(): Promise<void>;
  getBiometricSettings(): Promise<BiometricSettings | null>;
}

/**
 * Base implementation with mock functionality for testing
 */
export class BiometricAuthService implements IBiometricAuthService {
  protected settings: BiometricSettings = {
    enabled: false,
    type: 'none',
  };

  async isBiometricAvailable(): Promise<BiometricAvailability> {
    return {
      available: false,
      type: 'none',
    };
  }

  async enrollBiometric(): Promise<BiometricAuthResult> {
    return {
      success: false,
      error: 'Biometric authentication not available in this environment',
    };
  }

  async authenticateWithBiometric(): Promise<BiometricAuthResult> {
    return {
      success: false,
      error: 'Biometric authentication not available',
    };
  }

  async disableBiometric(): Promise<void> {
    const settings = await this.getBiometricSettings();
    if (!settings || !settings.enabled) {
      return;
    }

    this.settings = {
      enabled: false,
      type: 'none',
      enrolledAt: undefined,
    };

    const globalWindow = globalThis as unknown as {
      localStorage?: {
        setItem: (key: string, value: string) => void;
      };
    };
    if (typeof globalWindow.localStorage !== 'undefined') {
      globalWindow.localStorage.setItem('biometric_settings', JSON.stringify(this.settings));
    }
  }

  async getBiometricSettings(): Promise<BiometricSettings | null> {
    return { ...this.settings };
  }
}

/**
 * Mobile implementation using react-native-biometrics
 */
export class MobileBiometricAuthService extends BiometricAuthService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private biometrics: any;

  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getBiometrics(): Promise<any> {
    if (!this.biometrics) {
      try {
        const ReactNativeBiometrics = await import('react-native-biometrics');
        this.biometrics = new ReactNativeBiometrics.default();
      } catch (error) {
        throw new Error('React Native Biometrics not available');
      }
    }
    return this.biometrics;
  }

  async isBiometricAvailable(): Promise<BiometricAvailability> {
    try {
      const rnBiometrics = await this.getBiometrics();
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        return { available: false, type: 'none' };
      }

      // Map biometry type to our types
      let type: BiometricType = 'none';
      if (biometryType === 'FaceID') {
        type = 'faceId';
      } else if (biometryType === 'TouchID') {
        type = 'touchId';
      } else if (biometryType === 'Biometrics' || biometryType === 'Fingerprint') {
        type = 'fingerprint';
      }

      return { available, type };
    } catch (error) {
      return { available: false, type: 'none' };
    }
  }

  async enrollBiometric(): Promise<BiometricAuthResult> {
    const isAvailable = await this.isBiometricAvailable();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Biometric authentication not available on this device',
      };
    }

    // Store settings
    const globalNav = globalThis as unknown as {
      navigator?: {
        userAgent?: string;
      };
    };
    const type = globalNav.navigator?.userAgent?.includes('iPhone') ? 'faceId' : 'touchId';
    this.settings = {
      enabled: true,
      type,
      enrolledAt: new Date(),
    };

    // Store in localStorage
    const globalWindow = globalThis as unknown as {
      localStorage?: {
        setItem: (key: string, value: string) => void;
      };
    };
    if (typeof globalWindow.localStorage !== 'undefined') {
      globalWindow.localStorage.setItem('biometric_settings', JSON.stringify(this.settings));
    }

    return { success: true };
  }

  async authenticateWithBiometric(): Promise<BiometricAuthResult> {
    const settings = await this.getBiometricSettings();
    if (!settings || !settings.enabled) {
      return {
        success: false,
        error: 'Biometric authentication not enabled',
      };
    }

    try {
      const rnBiometrics = await this.getBiometrics();
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to access your account',
      });

      return { success };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  async disableBiometric(): Promise<void> {
    try {
      const rnBiometrics = await this.getBiometrics();
      await rnBiometrics.deleteKeys();

      await super.disableBiometric();
      await this.storeBiometricSettings();
    } catch (error) {
      throw new Error(
        `Failed to disable biometric: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getBiometricSettings(): Promise<BiometricSettings | null> {
    // Load from secure storage
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      const stored = await AsyncStorage.default.getItem('biometric_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.settings = {
          ...parsed,
          enrolledAt: parsed.enrolledAt ? new Date(parsed.enrolledAt) : undefined,
        };
        return { ...this.settings };
      }
    } catch (error) {
      // Settings not found or error loading
    }

    return null;
  }

  private async storeBiometricSettings(): Promise<void> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.setItem('biometric_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to store biometric settings:', error);
    }
  }
}

/**
 * Web implementation using WebAuthn
 */
export class WebBiometricAuthService extends BiometricAuthService {
  async isBiometricAvailable(): Promise<BiometricAvailability> {
    // Check if WebAuthn is available
    const globalWindow = globalThis as unknown as {
      window?: {
        PublicKeyCredential?: unknown;
      };
    };
    const isAvailable =
      typeof globalWindow.window !== 'undefined' &&
      typeof globalWindow.window.PublicKeyCredential !== 'undefined';

    return {
      available: isAvailable,
      type: isAvailable ? 'webauthn' : 'none',
    };
  }

  async enrollBiometric(): Promise<BiometricAuthResult> {
    const { available } = await this.isBiometricAvailable();
    if (!available) {
      return {
        success: false,
        error: 'WebAuthn not available in this browser',
      };
    }

    // WebAuthn enrollment would be implemented here
    // For now, just mark as enrolled
    this.settings = {
      enabled: true,
      type: 'webauthn',
      enrolledAt: new Date(),
    };

    // Store in localStorage
    const globalWindow = globalThis as unknown as {
      localStorage?: {
        setItem: (key: string, value: string) => void;
      };
    };
    if (typeof globalWindow.localStorage !== 'undefined') {
      globalWindow.localStorage.setItem('biometric_settings', JSON.stringify(this.settings));
    }

    return { success: true };
  }

  async authenticateWithBiometric(): Promise<BiometricAuthResult> {
    const settings = await this.getBiometricSettings();
    if (!settings || !settings.enabled) {
      return {
        success: false,
        error: 'Biometric authentication not enabled',
      };
    }

    // WebAuthn authentication would be implemented here
    // For now, return mock result
    return {
      success: false,
      error: 'WebAuthn authentication not yet implemented',
    };
  }

  async disableBiometric(): Promise<void> {
    await super.disableBiometric();

    // Clear from localStorage
    const globalWindow = globalThis as unknown as {
      localStorage?: {
        removeItem: (key: string) => void;
      };
    };
    if (typeof globalWindow.localStorage !== 'undefined') {
      globalWindow.localStorage.removeItem('biometric_settings');
    }
  }

  async getBiometricSettings(): Promise<BiometricSettings | null> {
    const globalWindow = globalThis as unknown as {
      localStorage?: {
        getItem: (key: string) => string | null;
      };
    };
    if (typeof globalWindow.localStorage !== 'undefined') {
      const stored = globalWindow.localStorage.getItem('biometric_settings');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return null;
  }
}

/**
 * Factory function to create platform-specific biometric service
 */
export function createBiometricAuthService(): IBiometricAuthService {
  // Detect platform
  const globalNav = globalThis as unknown as {
    navigator?: {
      product?: string;
    };
  };
  const isReactNative =
    typeof globalNav.navigator !== 'undefined' && globalNav.navigator.product === 'ReactNative';

  if (isReactNative) {
    return new MobileBiometricAuthService();
  }

  // Check if we're in a browser environment
  const globalWindow = globalThis as unknown as {
    window?: unknown;
  };
  if (typeof globalWindow.window !== 'undefined') {
    return new WebBiometricAuthService();
  }

  // Default fallback
  return new BiometricAuthService();
}

// Export singleton instance
export const biometricAuthService = createBiometricAuthService();

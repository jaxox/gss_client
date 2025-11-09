/**
 * Jest setup for GSS Mobile React Native app
 */

// Basic setup without external dependencies

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock Google Sign In
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() =>
      Promise.resolve({ user: { email: 'test@example.com' } }),
    ),
    signOut: jest.fn(() => Promise.resolve()),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
    getCurrentUser: jest.fn(() => Promise.resolve(null)),
  },
  GoogleSigninButton: 'GoogleSigninButton',
  statusCodes: {
    SIGN_IN_CANCELLED: '0',
    IN_PROGRESS: '1',
    PLAY_SERVICES_NOT_AVAILABLE: '2',
  },
}));

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Mock Alert
  RN.Alert.alert = jest.fn();

  // Mock Linking
  RN.Linking.openURL = jest.fn(() => Promise.resolve());
  RN.Linking.canOpenURL = jest.fn(() => Promise.resolve(true));

  return RN;
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup global test utilities
global.__DEV__ = true;

// Mock fetch for API testing
global.fetch = jest.fn();

// Setup test environment variables
process.env.NODE_ENV = 'test';

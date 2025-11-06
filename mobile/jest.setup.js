/**
 * Jest setup for GSS Mobile React Native app
 */

// Basic setup without external dependencies

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

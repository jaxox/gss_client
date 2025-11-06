// Global test setup for shared library

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
global.createMockPromise = () => {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

// Common test data
global.testData = {
  validUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  },
  validGoogleToken: 'mock-google-token',
  validAccessToken: 'mock-access-token',
  validRefreshToken: 'mock-refresh-token',
};

// Setup test timeout
jest.setTimeout(5000);

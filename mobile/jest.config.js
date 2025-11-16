module.exports = {
  preset: 'react-native',

  // Test environment setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module mapping for shared library
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../shared/src/$1',
    '^@shared$': '<rootDir>/../shared/src/index',
    // Mock image/asset imports
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    // Mock react-native-linear-gradient
    'react-native-linear-gradient':
      '<rootDir>/__mocks__/react-native-linear-gradient.jsx',
  },

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { presets: ['@react-native/babel-preset'] },
    ],
  },

  // Transform react-redux and other ESM packages
  transformIgnorePatterns: [
    'node_modules/(?!(react-redux|@react-redux|@reduxjs|immer|react-native|@react-native|@react-navigation|ky|@react-native-google-signin|react-native-image-picker|react-native-linear-gradient)/)',
  ],

  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],

  // Exclude E2E tests that require Detox
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/e2e/'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**',
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Mock configuration
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Timeout for tests
  testTimeout: 10000,
};

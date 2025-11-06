module.exports = {
  preset: 'react-native',
  
  // Test environment setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module mapping for shared library
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../shared/src/$1',
    '^@shared$': '<rootDir>/../shared/src/index',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@react-native/babel-preset'] }],
  },
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  
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

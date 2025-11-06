module.exports = {
  // Test environment
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Root directory
  rootDir: '.',

  // Test file patterns
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,ts}', '<rootDir>/src/**/*.{test,spec}.{js,ts}'],

  // Transform configuration
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Mock configuration
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Timeout
  testTimeout: 5000,

  // Error handling
  errorOnDeprecated: true,

  // Module mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

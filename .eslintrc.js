module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    // Basic rules for all files
    'prefer-const': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      // TypeScript files
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-unused-vars': 'off', // Turn off base rule as it conflicts with TypeScript version
      },
    },
    {
      // Jest setup and test files
      files: ['**/*.setup.js', '**/__tests__/**/*.{js,ts}', '**/*.{test,spec}.{js,ts}'],
      env: {
        jest: true,
        node: true,
      },
    },
    {
      // React Web specific rules  
      files: ['web/**/*.{ts,tsx}'],
      env: {
        browser: true,
      },
    },
    {
      // Shared library rules
      files: ['shared/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
      },
    },
    {
      // Allow console in mock services for debugging
      files: ['**/mock/**/*.{js,ts}'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};

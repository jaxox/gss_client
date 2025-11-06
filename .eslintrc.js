module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  extends: [
    '@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Shared rules across all packages
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  overrides: [
    {
      // React Native specific rules
      files: ['mobile/**/*.{ts,tsx}'],
      extends: ['@react-native'],
      env: {
        'React-native/react-native': true,
      },
    },
    {
      // React Web specific rules
      files: ['web/**/*.{ts,tsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
      ],
      env: {
        browser: true,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      // Shared library rules
      files: ['shared/**/*.{ts,tsx}'],
      rules: {
        // Stricter rules for shared code
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
      },
    },
  ],
};

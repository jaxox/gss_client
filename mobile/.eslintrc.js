module.exports = {
  root: true,
  extends: '@react-native',
  env: {
    'jest/globals': true,
  },
  parserOptions: {
    requireConfigFile: false,
  },
  ignorePatterns: ['__mocks__/**'],
  overrides: [
    {
      files: ['*.js'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
      },
    },
  ],
};

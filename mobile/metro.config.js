const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration for GSS Mobile with shared library support
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const defaultConfig = getDefaultConfig(monorepoRoot);

const config = {
  projectRoot,
  watchFolders: [
    // Include the monorepo root
    monorepoRoot,
    // Include the shared library for hot reloading
    path.resolve(monorepoRoot, 'shared'),
  ],
  resolver: {
    // Support for shared library path mapping
    alias: {
      '@shared': path.resolve(monorepoRoot, 'shared/src'),
    },
    // Additional node modules locations
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    // Support for TypeScript files
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    // Platform-specific extensions
    platforms: ['ios', 'android', 'native', 'web'],
  },
  transformer: {
    // Optimize bundle size
    minifierPath: require.resolve('metro-minify-terser'),
    minifierConfig: {
      ecma: 8,
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
    // Enable hermes for better performance
    hermesParser: true,
    // Support for shared library transforms
    unstable_allowRequireContext: true,
  },
  server: {
    // Enhance dev server with better caching
    enhanceMiddleware: middleware => {
      return (req, res, next) => {
        // Add cache headers for static assets
        if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);

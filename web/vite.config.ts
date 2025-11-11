import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include .jsx files
      include: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'],
    }),
  ],

  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    open: true, // Auto-open browser
    cors: true,
    hmr: {
      overlay: true, // Show errors as overlay
    },
  },

  // Build configuration
  build: {
    // Generate source maps for production debugging
    sourcemap: true,
    // Optimize bundle size
    target: 'esnext',
    minify: 'terser',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
          }
          if (id.includes('shared/src')) {
            return 'shared';
          }
        },
      },
    },
  },

  // Path resolution for shared library
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // Optimize dependencies - exclude React Native packages
  optimizeDeps: {
    exclude: [
      'react-native',
      'react-native-keychain',
      '@react-native-async-storage/async-storage',
      '@react-native-community/netinfo',
    ],
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // CSS configuration
  css: {
    devSourcemap: true, // Enable CSS source maps in dev
    modules: {
      localsConvention: 'camelCase',
    },
  },

  // Preview server (for production builds)
  preview: {
    port: 4173,
    host: true,
    cors: true,
  },
});

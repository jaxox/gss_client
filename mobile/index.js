/**
 * @format
 */

// Must be first for gesture handler / react-navigation correctness
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Enable E2E mode ONLY when explicitly set via environment variable
// This flag is used to render E2E-friendly UI components (simple inputs vs modals)
// Set this in Detox configuration or test setup, not here by default
if (process.env.E2E_MODE === 'true' || process.env.NODE_ENV === 'test') {
  global.__E2E__ = true;
  console.log('🧪 E2E mode enabled');
} else {
  global.__E2E__ = false;
  console.log('📱 Normal mode (E2E disabled)');
}

AppRegistry.registerComponent(appName, () => App);

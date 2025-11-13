/**
 * @format
 */

// Must be first for gesture handler / react-navigation correctness
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Enable E2E mode for Detox testing
// This flag will be used to render E2E-friendly UI components (simple inputs vs modals)
global.__E2E__ = true;
console.log('🧪 E2E mode enabled globally');

AppRegistry.registerComponent(appName, () => App);

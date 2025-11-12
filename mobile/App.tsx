/**
 * GSS Client Mobile App
 * Gamified Social Sports Platform
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegistrationScreen from './src/screens/auth/RegistrationScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import CreateEventWizard from './src/screens/events/wizard/CreateEventWizard';
import MyEventsScreen from './src/screens/events/MyEventsScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import { logJsError } from './src/utils/jsLogger';
import { NativeModules } from 'react-native';
import 'react-native-vector-icons/MaterialCommunityIcons';

type Screen =
  | 'menu'
  | 'login'
  | 'register'
  | 'forgot'
  | 'reset'
  | 'profile'
  | 'createEvent'
  | 'myEvents'
  | 'createEvent';

function App() {
  // Global error handler to catch all errors
  useEffect(() => {
    // Diagnostics: verify native module presence once at startup
    // This will appear in DevTools console (j) and helps confirm bridge linkage.
    // Using console.warn (visible) without spamming error channel.
    // It will also be forwarded to DevTools only (RN 0.82 behavior).
    // We mirror that we saw it here for autonomous audit.
    // If undefined, native logging will be skipped silently.
    // We also proactively trigger an unhandled rejection test after 3s.
    const hasNative = !!(NativeModules as any).JSLoggerModule;
    console.warn('[JS_LOG_DIAG] JSLoggerModule present:', hasNative);

    const errorHandler = (error: any, isFatal?: boolean) => {
      console.error('🔴 GLOBAL ERROR:', error);
      console.error('🔴 ERROR STACK:', error?.stack);
      logJsError({
        source: 'global',
        isFatal: !!isFatal,
        name: error?.name,
        message: error?.message,
        stack: (error?.stack || '')
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean),
      });
    };

    // @ts-ignore react native global handler
    const prev = global.ErrorUtils?.getGlobalHandler?.();
    // @ts-ignore
    global.ErrorUtils?.setGlobalHandler?.((err: any, isFatal?: boolean) => {
      try {
        errorHandler(err, isFatal);
      } finally {
        prev?.(err, isFatal);
      }
    });

    return () => {
      // @ts-ignore
      global.ErrorUtils?.setGlobalHandler?.(prev);
    };
  }, []);

  // Attach unhandled promise rejection logging once.
  useEffect(() => {
    // React Native doesn't expose addEventListener('unhandledrejection'), so we polyfill via Promise + setTimeout trick.
    // We patch console.error to also mirror to native when message contains 'Unhandled promise'.
    const origConsoleError = console.error;
    console.error = (...args: any[]) => {
      try {
        const joined = args
          .map(a => (typeof a === 'string' ? a : JSON.stringify(a)))
          .join(' ');
        if (/Unhandled( Promise)? rejection/i.test(joined)) {
          logJsError({
            source: 'global',
            name: 'ConsoleDetectedUnhandledRejection',
            message: joined,
            stack: [],
          });
        }
      } catch {
        // swallow
      }
      return origConsoleError.apply(console, args as any);
    };
    // Disabled: This forced rejection was for testing error logging, but breaks CI
    // const testTimer = setTimeout(() => {
    //   Promise.reject(new Error('FORCED_TEST_UNHANDLED_REJECTION'));
    // }, 3500);
    return () => {
      // clearTimeout(testTimer);
      console.error = origConsoleError;
    };
  }, []);
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  const renderScreen = () => {
    if (currentScreen === 'menu') {
      return (
        <View style={styles.menu}>
          <Text variant="headlineLarge" style={styles.menuTitle}>
            GSS Auth Screens
          </Text>
          <Text variant="bodyMedium" style={styles.menuSubtitle}>
            Select a screen to preview
          </Text>
          <Button
            mode="contained"
            onPress={() => setCurrentScreen('login')}
            style={styles.menuButton}
          >
            Login Screen
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              // Force a synchronous render error to exercise ErrorBoundary.
              throw new Error('FORCED_TEST_RENDER_ERROR');
            }}
            style={styles.menuButton}
          >
            Force Render Error
          </Button>
          <Button
            mode="contained"
            onPress={() => setCurrentScreen('register')}
            style={styles.menuButton}
          >
            Registration Screen
          </Button>
          <Button
            mode="contained"
            onPress={() => setCurrentScreen('forgot')}
            style={styles.menuButton}
          >
            Forgot Password Screen
          </Button>
          <Button
            mode="contained"
            onPress={() => setCurrentScreen('reset')}
            style={styles.menuButton}
          >
            Reset Password Screen
          </Button>
          <Button
            mode="contained"
            onPress={() => setCurrentScreen('profile')}
            style={styles.menuButton}
          >
            Profile Screen
          </Button>
          <Button
            mode="contained"
            onPress={() => setCurrentScreen('createEvent')}
            style={styles.menuButton}
            testID="create-event-menu-button"
          >
            Create Event Screen
          </Button>
          <Button
            mode="contained"
            onPress={() => setCurrentScreen('myEvents')}
            style={styles.menuButton}
          >
            My Events Screen
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.screenContainer}>
        <View style={styles.backButton}>
          <Button
            mode="text"
            onPress={() => setCurrentScreen('menu')}
            icon="arrow-left"
          >
            Back to Menu
          </Button>
        </View>
        {currentScreen === 'login' && (
          <ErrorBoundary>
            <LoginScreen />
          </ErrorBoundary>
        )}
        {currentScreen === 'register' && (
          <ErrorBoundary>
            <RegistrationScreen />
          </ErrorBoundary>
        )}
        {currentScreen === 'forgot' && (
          <ErrorBoundary>
            <ForgotPasswordScreen />
          </ErrorBoundary>
        )}
        {currentScreen === 'reset' && (
          <ErrorBoundary>
            <ResetPasswordScreen />
          </ErrorBoundary>
        )}
        {currentScreen === 'profile' && (
          <ErrorBoundary>
            <ProfileScreen />
          </ErrorBoundary>
        )}
        {currentScreen === 'createEvent' && (
          <ErrorBoundary>
            <CreateEventWizard onCancel={() => setCurrentScreen('menu')} />
          </ErrorBoundary>
        )}
        {currentScreen === 'myEvents' && (
          <ErrorBoundary>
            <MyEventsScreen />
          </ErrorBoundary>
        )}
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <PaperProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          {renderScreen()}
        </PaperProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  menuTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  menuSubtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  menuButton: {
    marginBottom: 16,
  },
  screenContainer: {
    flex: 1,
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    paddingTop: 48,
    paddingHorizontal: 8,
  },
});

export default App;

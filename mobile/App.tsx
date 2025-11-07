/**
 * GSS Client Mobile App
 * Gamified Social Sports Platform
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegistrationScreen from './src/screens/auth/RegistrationScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen';

type Screen = 'menu' | 'login' | 'register' | 'forgot' | 'reset';

function App() {
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
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'register' && <RegistrationScreen />}
        {currentScreen === 'forgot' && <ForgotPasswordScreen />}
        {currentScreen === 'reset' && <ResetPasswordScreen />}
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

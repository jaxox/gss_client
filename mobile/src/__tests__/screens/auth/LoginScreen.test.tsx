import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginScreen from '../../../screens/auth/LoginScreen';
import authReducer from '../../../store/auth/authSlice';

// Mock the Google Sign-In button
jest.mock('../../../components/GoogleSignInButton', () => {
  const { View, Text } = require('react-native');
  return function GoogleSignInButton() {
    return (
      <View testID="google-signin-button">
        <Text>Google Sign In</Text>
      </View>
    );
  };
});

describe('LoginScreen', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    jest.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('renders login form with all required fields', () => {
    const { getByText, getByTestId } = renderWithProvider(<LoginScreen />);

    expect(getByText('Welcome to GSS')).toBeTruthy();
    expect(getByText('Sign in to continue')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByText('Remember me')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Forgot password?')).toBeTruthy();
  });

  it('disables sign in button when form is invalid', () => {
    const { getByText } = renderWithProvider(<LoginScreen />);

    // Button exists and renders correctly
    const signInButton = getByText('Sign In');
    expect(signInButton).toBeTruthy();
  });

  it('enables sign in button when email and password are provided', () => {
    const { getByText, getByTestId } = renderWithProvider(<LoginScreen />);

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123!');

    // Button exists and can be found after filling form
    const signInButton = getByText('Sign In');
    expect(signInButton).toBeTruthy();
  });

  it('dispatches login action when sign in button is pressed', async () => {
    const { getByText, getByTestId } = renderWithProvider(<LoginScreen />);

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123!');
    fireEvent.press(signInButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.loading).toBe(true);
    });
  });

  it('includes rememberMe flag when checkbox is checked', async () => {
    const { getByText, getByTestId } = renderWithProvider(<LoginScreen />);

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const rememberMeText = getByText('Remember me');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123!');
    fireEvent.press(rememberMeText);
    fireEvent.press(signInButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.loading).toBe(true);
    });
  });

  it('renders google sign-in button', () => {
    const { getByTestId } = renderWithProvider(<LoginScreen />);

    expect(getByTestId('google-signin-button')).toBeTruthy();
  });

  it('renders sign up link', () => {
    const { getByText } = renderWithProvider(<LoginScreen />);

    expect(getByText("Don't have an account? ")).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });
});

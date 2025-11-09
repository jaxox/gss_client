import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginSSO } from '../store/auth/authSlice';

// Google OAuth client ID - configure via environment variable or GoogleService-Info.plist
// @ts-ignore - React Native environment variables
const GOOGLE_WEB_CLIENT_ID = process?.env?.GOOGLE_WEB_CLIENT_ID;

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Only configure Google Sign-In if we have valid credentials
    // This prevents initialization errors when GoogleService-Info.plist is missing
    const configureGoogleSignIn = async () => {
      try {
        if (
          GOOGLE_WEB_CLIENT_ID &&
          GOOGLE_WEB_CLIENT_ID !==
            'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com'
        ) {
          GoogleSignin.configure({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            offlineAccess: true,
            forceCodeForRefreshToken: true,
          });
          setIsConfigured(true);
        } else {
          // Try to configure with default values (works if GoogleService-Info.plist exists)
          try {
            GoogleSignin.configure({
              offlineAccess: true,
              forceCodeForRefreshToken: true,
            });
            setIsConfigured(true);
          } catch (error) {
            console.warn(
              'Google Sign-In not configured. Add GoogleService-Info.plist or set GOOGLE_WEB_CLIENT_ID environment variable.',
            );
            setIsConfigured(false);
          }
        }
      } catch (error) {
        console.warn('Failed to configure Google Sign-In:', error);
        setIsConfigured(false);
      }
    };

    configureGoogleSignIn();
  }, []);

  // Don't render the button if Google Sign-In is not properly configured
  if (!isConfigured) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Trigger Google Sign-In
      const userInfo = await GoogleSignin.signIn();

      // Get the ID token from data
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Send to backend via Redux
      const result = await dispatch(
        loginSSO({
          provider: 'google',
          idToken,
        }),
      );

      if (loginSSO.fulfilled.match(result)) {
        onSuccess?.();
      } else {
        onError?.(result.payload as string);
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      // Handle specific error cases
      if (error.code === 'SIGN_IN_CANCELLED') {
        // User cancelled the sign-in - silent fail
        return;
      }

      const errorMessage = error.message || 'Failed to sign in with Google';
      onError?.(errorMessage);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Signing in with Google...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoogleSignIn} style={styles.button}>
        <GoogleSigninButton
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={handleGoogleSignIn}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  button: {
    width: '100%',
  },
  googleButton: {
    width: '100%',
    height: 48,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
  },
});

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginSSO } from '../store/auth/authSlice';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // From Google Cloud Console
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

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

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { forgotPassword, clearError } from '../../store/auth/authSlice';

export default function ForgotPasswordScreen() {
  const dispatch = useAppDispatch();
  const { loading, error: authError } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateEmail = (emailAddress: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const handleSubmit = async () => {
    setLocalError('');

    if (!email) {
      setLocalError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Invalid email format');
      return;
    }

    const result = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(result)) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Check Your Email
          </Text>
          <Text variant="bodyMedium" style={styles.message}>
            We've sent a password reset link to:
          </Text>
          <Text variant="bodyLarge" style={styles.email}>
            {email}
          </Text>
          <Text variant="bodyMedium" style={styles.instructions}>
            Click the link in the email to reset your password. The link will
            expire in 1 hour.
          </Text>
          <Button
            mode="contained"
            onPress={() => console.log('Go to login')}
            style={styles.button}
          >
            Back to Sign In
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Forgot Password?
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password
          </Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (localError) setLocalError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={styles.input}
            mode="outlined"
            error={!!localError || !!authError}
          />
          {localError || authError ? (
            <HelperText type="error" visible={!!(localError || authError)}>
              {localError || authError}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!email || loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {loading ? <ActivityIndicator color="white" /> : 'Send Reset Link'}
          </Button>

          <Button
            mode="text"
            onPress={() => console.log('Go to login')}
            style={styles.backButton}
          >
            Back to Sign In
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
  },
  message: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#666',
  },
  email: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  instructions: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 8,
  },
});

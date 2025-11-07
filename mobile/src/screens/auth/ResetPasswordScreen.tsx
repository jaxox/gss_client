import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  ActivityIndicator,
  ProgressBar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetPassword, clearError } from '../../store/auth/authSlice';

export default function ResetPasswordScreen() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  // In real app, get token from navigation params or URL
  const resetToken = 'demo-reset-token';

  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const getPasswordStrength = (
    pwd: string,
  ): { score: number; label: string; color: string } => {
    if (pwd.length === 0) return { score: 0, label: '', color: '#ccc' };
    if (pwd.length < 8) return { score: 0.25, label: 'Weak', color: '#f44336' };

    let score = 0.25;
    if (/[A-Z]/.test(pwd)) score += 0.25;
    if (/[0-9]/.test(pwd)) score += 0.25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 0.25;

    if (score <= 0.5) return { score, label: 'Weak', color: '#f44336' };
    if (score <= 0.75) return { score, label: 'Medium', color: '#ff9800' };
    return { score, label: 'Strong', color: '#4caf50' };
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain an uppercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain a number';
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = 'Password must contain a special character';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const result = await dispatch(
        resetPassword({ token: resetToken, newPassword: password }),
      );

      if (resetPassword.fulfilled.match(result)) {
        setSuccess(true);
        // Auto-navigate to login after 3 seconds
        setTimeout(() => {
          console.log('Navigate to login');
        }, 3000);
      }
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const isFormValid =
    password && confirmPassword && password === confirmPassword;

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Password Reset Successful!
          </Text>
          <Text variant="bodyMedium" style={styles.message}>
            Your password has been updated successfully.
          </Text>
          <Text variant="bodyMedium" style={styles.redirectMessage}>
            Redirecting to sign in...
          </Text>
          <ActivityIndicator size="large" style={styles.spinner} />
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
            Reset Password
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Enter your new password
          </Text>

          <TextInput
            label="New Password"
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errors.password) {
                setErrors({ ...errors, password: '' });
              }
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            style={styles.input}
            mode="outlined"
            error={!!errors.password}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {password.length > 0 && (
            <View style={styles.passwordStrength}>
              <ProgressBar
                progress={passwordStrength.score}
                color={passwordStrength.color}
                style={styles.progressBar}
              />
              <Text
                variant="bodySmall"
                style={[
                  styles.strengthLabel,
                  { color: passwordStrength.color },
                ]}
              >
                {passwordStrength.label}
              </Text>
            </View>
          )}
          {errors.password ? (
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>
          ) : null}

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: '' });
              }
            }}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            style={styles.input}
            mode="outlined"
            error={!!errors.confirmPassword}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          {errors.confirmPassword ? (
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!isFormValid || loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {loading ? <ActivityIndicator color="white" /> : 'Reset Password'}
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
    marginBottom: 16,
    textAlign: 'center',
    color: '#4caf50',
    fontSize: 16,
  },
  redirectMessage: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  spinner: {
    marginTop: 16,
  },
  input: {
    marginBottom: 8,
  },
  passwordStrength: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

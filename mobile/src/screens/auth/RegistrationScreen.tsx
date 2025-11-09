import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  ActivityIndicator,
  ProgressBar,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, clearError } from '../../store/auth/authSlice';
import GoogleSignInButton from '../../components/GoogleSignInButton';

export default function RegistrationScreen() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateEmail = (emailAddress: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

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

    if (!displayName) {
      newErrors.displayName = 'Display name is required';
    }

    if (!homeCity) {
      newErrors.homeCity = 'Home city is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(
        register({
          email,
          password,
          displayName,
          homeCity,
        }),
      );
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const isFormValid = email && password && displayName && homeCity;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text variant="headlineMedium" style={styles.title}>
              Create Account
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Join the GSS community
            </Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              style={styles.input}
              mode="outlined"
              error={!!errors.email}
              testID="email-input"
            />
            {errors.email ? (
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
            ) : null}

            <TextInput
              label="Password"
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
              testID="password-input"
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
              label="Display Name"
              value={displayName}
              onChangeText={text => {
                setDisplayName(text);
                if (errors.displayName) {
                  setErrors({ ...errors, displayName: '' });
                }
              }}
              autoCapitalize="words"
              autoComplete="name"
              style={styles.input}
              mode="outlined"
              error={!!errors.displayName}
              testID="displayName-input"
            />
            {errors.displayName ? (
              <HelperText type="error" visible={!!errors.displayName}>
                {errors.displayName}
              </HelperText>
            ) : null}

            <TextInput
              label="Home City"
              value={homeCity}
              onChangeText={text => {
                setHomeCity(text);
                if (errors.homeCity) {
                  setErrors({ ...errors, homeCity: '' });
                }
              }}
              autoCapitalize="words"
              style={styles.input}
              mode="outlined"
              error={!!errors.homeCity}
              testID="homeCity-input"
            />
            {errors.homeCity ? (
              <HelperText type="error" visible={!!errors.homeCity}>
                {errors.homeCity}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              disabled={!isFormValid || loading}
              style={styles.registerButton}
              contentStyle={styles.registerButtonContent}
            >
              {loading ? <ActivityIndicator color="white" /> : 'Create Account'}
            </Button>

            {/* Divider with "Or" text */}
            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text variant="bodySmall" style={styles.dividerText}>
                Or sign up with
              </Text>
              <Divider style={styles.divider} />
            </View>

            {/* Google Sign-In Button */}
            <GoogleSignInButton
              onSuccess={() => console.log('Google sign-up successful')}
              onError={error => console.error('Google sign-up failed:', error)}
            />

            <View style={styles.loginRow}>
              <Text variant="bodyMedium">Already have an account? </Text>
              <Button
                mode="text"
                compact
                onPress={() => console.log('Go to login')}
              >
                Sign In
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
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
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  registerButtonContent: {
    paddingVertical: 8,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
  },
});

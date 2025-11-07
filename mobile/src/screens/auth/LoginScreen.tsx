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
  Checkbox,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/auth/authSlice';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { loading, error: authError } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async () => {
    if (!email || !password) return;

    dispatch(login({ email, password, rememberMe }));
  };

  const isFormValid = email.length > 0 && password.length > 0;

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
              Welcome to GSS
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Sign in to continue
            </Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              style={styles.input}
              mode="outlined"
              error={!!authError}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              style={styles.input}
              mode="outlined"
              error={!!authError}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            {authError ? (
              <HelperText type="error" visible={!!authError}>
                {authError}
              </HelperText>
            ) : null}

            <View style={styles.rememberMeRow}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe(!rememberMe)}
              />
              <Text
                variant="bodyMedium"
                onPress={() => setRememberMe(!rememberMe)}
              >
                Remember me
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              disabled={!isFormValid || loading}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
            >
              {loading ? <ActivityIndicator color="white" /> : 'Sign In'}
            </Button>

            <Button mode="text" onPress={() => console.log('Forgot password')}>
              Forgot password?
            </Button>

            <View style={styles.registerRow}>
              <Text variant="bodyMedium">Don't have an account? </Text>
              <Button
                mode="text"
                compact
                onPress={() => console.log('Register')}
              >
                Sign Up
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
    justifyContent: 'center',
  },
  content: {
    padding: 24,
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
    marginBottom: 16,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButton: {
    marginBottom: 16,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});

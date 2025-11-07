import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, clearError } from '../../store/auth/authSlice';
import GoogleSignInButton from '../../components/GoogleSignInButton';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const getPasswordStrength = (
    pwd: string
  ): { score: number; label: string; color: 'error' | 'warning' | 'success' } => {
    if (pwd.length === 0) return { score: 0, label: '', color: 'error' };
    if (pwd.length < 8) return { score: 25, label: 'Weak', color: 'error' };

    let score = 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;

    if (score <= 50) return { score, label: 'Weak', color: 'error' };
    if (score <= 75) return { score, label: 'Medium', color: 'warning' };
    return { score, label: 'Strong', color: 'success' };
  };

  const validateEmail = (emailAddress: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } else if (/[0-9]/.test(password)) {
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
      const result = await dispatch(register({ email, password, displayName, homeCity }));
      if (register.fulfilled.match(result)) {
        // Navigate to dashboard on success
        navigate('/dashboard');
      }
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const isFormValid = email && password && displayName && homeCity;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="bold">
            Create Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Join GSS to start your fitness journey
          </Typography>

          <Box component="form" onSubmit={handleRegister} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={!!errors.email || !!error}
              helperText={errors.email}
              margin="normal"
              autoComplete="email"
              autoFocus
            />

            <TextField
              fullWidth
              label="Display Name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              error={!!errors.displayName}
              helperText={errors.displayName}
              margin="normal"
              autoComplete="name"
            />

            <TextField
              fullWidth
              label="Home City"
              value={homeCity}
              onChange={e => setHomeCity(e.target.value)}
              error={!!errors.homeCity}
              helperText={errors.homeCity}
              margin="normal"
              autoComplete="address-level2"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={!!errors.password || !!error}
              helperText={errors.password}
              margin="normal"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {password && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password Strength
                  </Typography>
                  <Typography variant="caption" color={`${passwordStrength.color}.main`}>
                    {passwordStrength.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength.score}
                  color={passwordStrength.color}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isFormValid || isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            {/* Divider with "Or" text */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Or sign up with
              </Typography>
            </Divider>

            {/* Google Sign-In Button */}
            <GoogleSignInButton
              mode="signup"
              onSuccess={() => navigate('/dashboard')}
              onError={error => console.error('Google sign-up failed:', error)}
            />

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ cursor: 'pointer' }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

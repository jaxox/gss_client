import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  LinearProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetPassword, clearError } from '../../store/auth/authSlice';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    if (Object.keys(newErrors).length === 0 && token) {
      const result = await dispatch(resetPassword({ token, newPassword: password }));
      if (resetPassword.fulfilled.match(result)) {
        setResetSuccess(true);
      }
    }
  };

  if (resetSuccess) {
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
          <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
              color="success.main"
            >
              Password Reset Successful
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Your password has been successfully reset. You can now sign in with your new password.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ mt: 2, py: 1.5 }}
            >
              Sign In
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  const passwordStrength = getPasswordStrength(password);
  const isFormValid = password && confirmPassword && password === confirmPassword;

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
            Reset Password
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Enter your new password below
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={!!errors.password || !!error}
              helperText={errors.password}
              margin="normal"
              autoComplete="new-password"
              autoFocus
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

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      aria-label="toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

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
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, Alert, Link } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { forgotPassword, clearError } from '../../store/auth/authSlice';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateEmail = (emailAddress: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const result = await dispatch(forgotPassword(email));
      if (forgotPassword.fulfilled.match(result)) {
        setEmailSent(true);
      }
    }
  };

  if (emailSent) {
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
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Check Your Email
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We've sent a password reset link to {email}. Please check your inbox and follow the
              instructions to reset your password.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ mt: 2, py: 1.5 }}
            >
              Back to Sign In
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

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
            Forgot Password
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Enter your email address and we'll send you a link to reset your password
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
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
              disabled={!email || isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer' }}
              >
                Back to Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

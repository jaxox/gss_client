import { useState } from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginSSO } from '../store/auth/authSlice';

// Google OAuth Client ID - should be in environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

interface GoogleSignInButtonInnerProps {
  mode?: 'signin' | 'signup';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

function GoogleSignInButtonInner({
  mode = 'signin',
  onSuccess,
  onError,
}: GoogleSignInButtonInnerProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setIsProcessing(true);
      try {
        // The tokenResponse contains the access_token
        // We need to exchange this for user info and then send to backend
        const result = await dispatch(
          loginSSO({
            provider: 'google',
            idToken: tokenResponse.access_token,
          })
        );

        if (loginSSO.fulfilled.match(result)) {
          onSuccess?.();
        } else {
          onError?.(result.payload as string);
        }
      } catch (error: unknown) {
        console.error('Google Sign-In Error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to sign in with Google';
        onError?.(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    },
    onError: error => {
      console.error('Google OAuth Error:', error);
      // User cancelled or other error - just fail silently for now
      onError?.('Failed to sign in with Google');
    },
    flow: 'implicit', // Use implicit flow for web
  });

  const handleClick = () => {
    login();
  };

  const loading = isLoading || isProcessing;

  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      onClick={handleClick}
      disabled={loading}
      sx={{
        py: 1.5,
        borderColor: '#dadce0',
        color: '#3c4043',
        textTransform: 'none',
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        '&:hover': {
          borderColor: '#dadce0',
          backgroundColor: '#f8f9fa',
        },
      }}
      startIcon={
        loading ? (
          <CircularProgress size={20} />
        ) : (
          <Box
            component="img"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            sx={{ width: 20, height: 20 }}
          />
        )
      }
    >
      {loading
        ? 'Signing in...'
        : mode === 'signup'
          ? 'Sign up with Google'
          : 'Sign in with Google'}
    </Button>
  );
}

  );
}

export default function GoogleSignInButton(props: GoogleSignInButtonInnerProps) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleSignInButtonInner {...props} />
    </GoogleOAuthProvider>
  );
}

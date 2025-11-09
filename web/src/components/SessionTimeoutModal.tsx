/**
 * Session Timeout Modal Component (Web)
 * Displays when user session expires due to inactivity
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface SessionTimeoutModalProps {
  visible: boolean;
  onContinue: () => void;
  onLogout: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  visible,
  onContinue,
  onLogout,
}) => {
  return (
    <Dialog open={visible} disableEscapeKeyDown maxWidth="sm" fullWidth>
      <DialogTitle>Session Expired</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Your session has expired due to inactivity. Please log in again to continue.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onLogout} variant="outlined" data-testid="logout-button">
          Log In Again
        </Button>
        <Button
          onClick={onContinue}
          variant="contained"
          color="primary"
          data-testid="continue-session-button"
        >
          Continue Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

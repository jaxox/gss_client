/**
 * Session Timeout Modal Component (Mobile)
 * Displays when user session expires due to inactivity
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';

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
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={styles.modal}
      >
        <Text variant="headlineSmall" style={styles.title}>
          Session Expired
        </Text>
        <Text variant="bodyMedium" style={styles.message}>
          Your session has expired due to inactivity. Please log in again to
          continue.
        </Text>
        <Button
          mode="contained"
          onPress={onContinue}
          style={styles.button}
          testID="continue-session-button"
        >
          Continue Session
        </Button>
        <Button
          mode="outlined"
          onPress={onLogout}
          style={styles.button}
          testID="logout-button"
        >
          Log In Again
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    marginBottom: 12,
  },
});

/**
 * AppButton Components
 * Standardized button variants for consistent UI
 */

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { theme } from '../../theme';

interface BaseButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  testID?: string;
}

export const AppButtonPrimary: React.FC<BaseButtonProps> = ({
  onPress,
  disabled,
  loading,
  icon,
  children,
  style,
  contentStyle,
  testID,
}) => {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={[styles.primaryButton, style]}
      contentStyle={[styles.buttonContent, contentStyle]}
      testID={testID}
    >
      {children}
    </Button>
  );
};

export const AppButtonSecondary: React.FC<BaseButtonProps> = ({
  onPress,
  disabled,
  loading,
  icon,
  children,
  style,
  contentStyle,
  testID,
}) => {
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={[styles.secondaryButton, style]}
      contentStyle={[styles.buttonContent, contentStyle]}
      testID={testID}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    borderRadius: theme.radius.md,
  },
  secondaryButton: {
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
});

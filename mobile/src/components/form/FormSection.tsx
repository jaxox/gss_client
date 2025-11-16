/**
 * FormSection Component
 * Reusable container for grouped form fields with optional title and description
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../theme';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  containerStyle?: object;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && (
        <Text variant="labelLarge" style={styles.title}>
          {title}
        </Text>
      )}
      {description && (
        <Text variant="bodySmall" style={styles.description}>
          {description}
        </Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.sm,
    fontWeight: theme.fontWeights.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral700,
  },
  description: {
    marginBottom: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
});

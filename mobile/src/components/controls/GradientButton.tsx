/**
 * GradientButton - Premium Athletic gradient button with 3D shadow effect
 * Uses orange gradient (#ff6b35 → #ff8c42) for primary actions
 */

import React from 'react';
import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme';

interface GradientButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  testID?: string;
  style?: object;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  onPress,
  children,
  disabled = false,
  loading = false,
  icon,
  testID,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      style={[styles.container, disabled && styles.disabledContainer, style]}
    >
      <LinearGradient
        colors={[
          theme.colors.primaryGradientStart,
          theme.colors.primaryGradientEnd,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, disabled && styles.disabledGradient]}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            {typeof children === 'string' ? (
              <Text style={styles.text}>{children}</Text>
            ) : (
              children
            )}
            {icon && (
              <Icon name={icon} size={18} color="#ffffff" style={styles.icon} />
            )}
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.radius.xl,
    ...theme.shadows.button,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabledGradient: {
    opacity: 0.6,
  },
  text: {
    color: '#ffffff',
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  icon: {
    marginLeft: theme.spacing.sm,
  },
});

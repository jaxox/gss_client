/**
 * FAB Button Component - Style 6 (Outlined Icon Button)
 * Reusable outlined button with strong borders for add/remove actions
 */

import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FABButtonProps {
  onPress: () => void;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  variant?: 'add' | 'remove';
  style?: ViewStyle;
}

const SIZES = {
  small: { button: 28, icon: 16 },
  medium: { button: 32, icon: 18 },
  large: { button: 36, icon: 20 },
};

const COLORS = {
  add: '#ff6b35',
  remove: '#fc3c3cff',
};

export default function FABButton({
  onPress,
  icon = 'plus',
  size = 'small',
  disabled = false,
  variant = 'add',
  style,
}: FABButtonProps) {
  const buttonSize = SIZES[size].button;
  const iconSize = SIZES[size].icon;
  const borderColor = COLORS[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderColor: disabled ? 'rgba(255, 255, 255, 0.3)' : borderColor,
          backgroundColor: pressed ? `${borderColor}20` : 'transparent',
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
        style,
      ]}
    >
      <Icon
        name={icon}
        size={iconSize}
        color={disabled ? 'rgba(255, 255, 255, 0.5)' : borderColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
});

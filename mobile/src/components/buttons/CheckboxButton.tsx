import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CheckboxButtonProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

export default function CheckboxButton({
  label,
  checked,
  onPress,
  disabled = false,
  style,
}: CheckboxButtonProps) {
  return (
    <Pressable
      style={[
        styles.container,
        checked && styles.containerActive,
        disabled && styles.containerDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.checkbox, checked && styles.checkboxActive]}>
        {checked && <Icon name="check" size={12} color="#fff" />}
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  containerActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.25)',
    borderColor: '#ff6b35',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  labelDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

/**
 * FormRow Component
 * Horizontal layout for form elements (e.g., label + input, toggle + label)
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface FormRowProps {
  children: React.ReactNode;
  gap?: number;
  style?: ViewStyle;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  gap = theme.spacing.md,
  style,
  align = 'center',
  justify = 'space-between',
}) => {
  return (
    <View
      style={[
        styles.row,
        {
          gap,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

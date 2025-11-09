/**
 * Shared Theme Configuration
 * Defines colors, typography, spacing, and border radius used by both platforms
 * Platform-specific adapters convert this to React Native Paper theme (mobile) or Material UI theme (web)
 */

// Color palette (Trust & Reliability - Blue-focused)
export const colors = {
  // Primary colors
  primary: '#3B82F6', // Blue 500
  primaryLight: '#60A5FA', // Blue 400
  primaryDark: '#2563EB', // Blue 600

  // Secondary colors
  secondary: '#10B981', // Green 500
  secondaryLight: '#34D399', // Green 400
  secondaryDark: '#059669', // Green 600

  // Accent colors
  accent: '#8B5CF6', // Purple 500
  accentLight: '#A78BFA', // Purple 400
  accentDark: '#7C3AED', // Purple 600

  // Status colors
  success: '#10B981', // Green 500
  warning: '#F59E0B', // Amber 500
  error: '#EF4444', // Red 500
  info: '#3B82F6', // Blue 500

  // Neutral colors
  background: '#FFFFFF',
  surface: '#F9FAFB', // Gray 50
  surfaceVariant: '#F3F4F6', // Gray 100

  // Text colors
  text: '#111827', // Gray 900
  textSecondary: '#6B7280', // Gray 500
  textDisabled: '#9CA3AF', // Gray 400
  textOnPrimary: '#FFFFFF',

  // Border colors
  border: '#E5E7EB', // Gray 200
  borderLight: '#F3F4F6', // Gray 100
  borderDark: '#D1D5DB', // Gray 300

  // Other
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  disabled: '#E5E7EB',
} as const;

// Typography
export const typography = {
  fontFamily: {
    regular: 'Inter',
    medium: 'Inter-Medium',
    bold: 'Inter-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing (8px base unit)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Helper function for spacing multiplier
export function getSpacing(factor: number): number {
  return spacing.sm * factor; // 8px base unit
}

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Shadows (elevation)
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

// Animation durations (milliseconds)
export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// Breakpoints (for responsive design on web)
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const;

// Complete theme object
export const theme = {
  colors,
  typography,
  spacing: getSpacing,
  borderRadius,
  shadows,
  animation,
  breakpoints,
} as const;

// Type exports
export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof spacing;
export type ThemeBorderRadius = typeof borderRadius;

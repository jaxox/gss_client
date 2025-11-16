/**
 * Design System Tokens - Premium Athletic Theme
 * Dark mode with orange gradient accents (Strava + Nike inspired)
 */

export const colors = {
  // Primary colors - Orange gradient
  primary: '#ff6b35',
  primaryLight: '#ff8c42',
  primaryDark: '#f97316',
  primaryGradientStart: '#ff6b35',
  primaryGradientEnd: '#ff8c42',

  // Secondary - Blue accent
  secondary: '#2563eb',
  secondaryLight: '#3b82f6',

  // Dark backgrounds
  background: '#1e1e1e',
  backgroundDark: '#18181b',
  surface: '#1a1a1a',
  surfaceElevated: '#27272a',

  // Neutral palette (for dark theme)
  neutral50: '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // UI colors (dark theme)
  border: '#404040',
  borderLight: '#525252',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textDisabled: 'rgba(255, 255, 255, 0.4)',
  textMuted: 'rgba(255, 255, 255, 0.6)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const fontSizes = {
  xxxs: 8,
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display: 28,
} as const;

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 14, // Premium Athletic uses 14px
  xxl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  // Premium button shadow
  button: {
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export const theme = {
  colors,
  spacing,
  fontSizes,
  fontWeights,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;

# GSS Client Design System

**Version:** 1.0  
**Last Updated:** November 9, 2025  
**Status:** Active

## Overview

This design system ensures consistent user experience across GSS Client's mobile (React Native) and web (React) platforms. All components, styles, and patterns are designed to work identically on both platforms while respecting platform-specific conventions.

## Design Principles

1. **Cross-Platform Consistency:** Same visual appearance and behavior on mobile and web
2. **Material Design 3:** Following Material Design guidelines with platform-appropriate implementations
3. **Accessibility First:** WCAG 2.1 Level AA compliance on all platforms
4. **Performance Conscious:** Optimized for mobile and web performance targets
5. **Maintainability:** Single source of truth for design tokens

## Color Palette

### Primary Colors (Trust & Reliability - Blue Theme)

```typescript
primary: '#3B82F6'; // Blue 500 - Main brand color
primaryLight: '#60A5FA'; // Blue 400 - Lighter variant
primaryDark: '#2563EB'; // Blue 600 - Darker variant
```

### Secondary Colors

```typescript
secondary: '#10B981'; // Green 500 - Success, growth
secondaryLight: '#34D399'; // Green 400
secondaryDark: '#059669'; // Green 600
```

### Status Colors

```typescript
success: '#10B981'; // Green 500 - Success states
warning: '#F59E0B'; // Amber 500 - Warning states
error: '#EF4444'; // Red 500 - Error states
info: '#3B82F6'; // Blue 500 - Informational
```

### Neutral Colors

```typescript
background: '#FFFFFF'; // White background
surface: '#F9FAFB'; // Gray 50 - Card/surface
surfaceVariant: '#F3F4F6'; // Gray 100 - Alternative surface

text: '#111827'; // Gray 900 - Primary text
textSecondary: '#6B7280'; // Gray 500 - Secondary text
textDisabled: '#9CA3AF'; // Gray 400 - Disabled text
textOnPrimary: '#FFFFFF'; // White text on primary color

border: '#E5E7EB'; // Gray 200 - Default borders
borderLight: '#F3F4F6'; // Gray 100 - Light borders
borderDark: '#D1D5DB'; // Gray 300 - Dark borders
```

## Typography

### Font Family

- **Primary:** Inter (all weights)
- **Mobile:** System font fallback for React Native
- **Web:** Inter loaded via Google Fonts

### Font Sizes

```typescript
xs: 12px    // Caption, helper text
sm: 14px    // Small text, labels
base: 16px  // Body text (default)
lg: 18px    // Emphasized body text
xl: 20px    // Section headers
2xl: 24px   // Page headers
3xl: 30px   // Large headers
4xl: 36px   // Hero text
```

### Font Weights

```typescript
regular: 400; // Body text
medium: 500; // Emphasized text
semibold: 600; // Headings
bold: 700; // Strong emphasis
```

### Line Heights

```typescript
tight: 1.25; // Headings
normal: 1.5; // Body text (default)
relaxed: 1.75; // Long-form content
```

## Spacing

### Base Unit: 8px

All spacing uses an 8px base unit for consistency:

```typescript
xs: 4px     // 0.5 × base (very tight spacing)
sm: 8px     // 1 × base (default tight spacing)
md: 16px    // 2 × base (default spacing)
lg: 24px    // 3 × base (generous spacing)
xl: 32px    // 4 × base (section spacing)
2xl: 48px   // 6 × base (large section spacing)
3xl: 64px   // 8 × base (page-level spacing)
```

### Usage Guidelines

- **Component padding:** Use `md` (16px) as default
- **Stack spacing:** Use `md` or `lg` between form elements
- **Section margins:** Use `xl` or `2xl` between major sections
- **Card padding:** Use `lg` (24px) for comfortable touch targets

## Border Radius

```typescript
none: 0px     // Sharp corners
sm: 4px       // Subtle rounding
base: 8px     // Default rounding (buttons, inputs)
md: 12px      // Medium rounding (cards)
lg: 16px      // Large rounding (modals, sheets)
xl: 24px      // Extra large rounding (prominent cards)
full: 9999px  // Fully rounded (pills, avatars)
```

## Shadows & Elevation

Shadows follow Material Design elevation system:

```typescript
none: No shadow (flat UI)
sm: Subtle shadow (level 1 - slightly raised)
base: Default shadow (level 2 - cards)
md: Medium shadow (level 4 - floating elements)
lg: Large shadow (level 8 - modals)
xl: Extra large shadow (level 12 - dialogs)
```

## Component Patterns

### Buttons

**Variants:**

- **Primary (Contained):** Solid background, primary color - Use for main actions
- **Secondary (Outlined):** Border with transparent background - Use for secondary actions
- **Text:** No border or background - Use for tertiary actions

**States:**

- Default, Hover, Pressed, Disabled, Loading

**Sizing:**

- Small: 32px height, 12px padding
- Medium: 40px height, 16px padding (default)
- Large: 48px height, 20px padding

**Implementation:**

- **Mobile:** React Native Paper `Button` component
- **Web:** Material UI `Button` component
- **Shared Props:** `variant`, `onPress`, `loading`, `disabled`, `children`

### Text Inputs

**Variants:**

- **Outlined:** Default style with border (mobile and web)
- **Filled:** Alternative style with background fill (web only)

**States:**

- Default, Focused, Error, Disabled

**Features:**

- Label, Helper Text, Error Message
- Icon support (left/right)
- Secure entry (password fields)
- Autocomplete hints

**Implementation:**

- **Mobile:** React Native Paper `TextInput` component with `mode="outlined"`
- **Web:** Material UI `TextField` component with `variant="outlined"`
- **Shared Props:** `label`, `value`, `onChangeText`, `error`, `helperText`, `secureTextEntry`

### Loading Indicators

**Types:**

- **Spinner:** Circular progress indicator
- **Linear:** Progress bar for determinate operations

**Sizing:**

- Small: 16px
- Medium: 24px (default)
- Large: 40px

**Implementation:**

- **Mobile:** React Native `ActivityIndicator`
- **Web:** Material UI `CircularProgress`
- **Colors:** Primary color by default, white on primary background

## Form Validation

### Validation Timing

- **On Blur:** Validate field when user leaves the field
- **On Submit:** Validate all fields when form is submitted
- **Real-time (Optional):** For password strength, character counts

### Error Display

- **Error State:** Red border on input field
- **Error Message:** Display below field in `sm` font size, error color
- **Icon:** Show error icon (!) in error state

### Success Feedback

- **Success State:** Green check icon (optional)
- **Toast/Snackbar:** Brief success message (3 seconds)

### Validation Rules

All validation uses centralized rules from `shared/src/constants/validationRules.ts`:

```typescript
// Email
EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
EMAIL_MAX_LENGTH = 255

// Password
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 128
Must contain: uppercase, lowercase, number, special character

// Display Name
DISPLAY_NAME_MIN_LENGTH = 2
DISPLAY_NAME_MAX_LENGTH = 50
Pattern: alphanumeric + spaces

// City
CITY_MIN_LENGTH = 2
CITY_MAX_LENGTH = 100
```

## Error Messaging

### Consistency Rules

1. **Centralized Messages:** All error messages defined in `shared/src/constants/errorMessages.ts`
2. **Never Hardcode:** Import error constants, never type error messages inline
3. **User-Friendly:** Use plain language, avoid technical jargon
4. **Actionable:** Tell user what to do next

### Error Categories

```typescript
// Authentication Errors
AUTH_ERRORS.INVALID_CREDENTIALS;
AUTH_ERRORS.TOKEN_EXPIRED;
AUTH_ERRORS.GOOGLE_AUTH_FAILED;

// Validation Errors
VALIDATION_ERRORS.EMAIL_INVALID;
VALIDATION_ERRORS.PASSWORD_TOO_SHORT;
VALIDATION_ERRORS.DISPLAY_NAME_REQUIRED;

// Network Errors
NETWORK_ERRORS.NO_INTERNET;
NETWORK_ERRORS.TIMEOUT;
NETWORK_ERRORS.SERVER_ERROR;

// Profile Errors
PROFILE_ERRORS.UPDATE_FAILED;
PROFILE_ERRORS.AVATAR_TOO_LARGE;
```

## Accessibility

### WCAG 2.1 Level AA Compliance

#### Color Contrast

- **Text on Background:** Minimum 4.5:1 ratio
- **Large Text (18pt+):** Minimum 3:1 ratio
- **UI Components:** Minimum 3:1 ratio

#### Touch Targets

- **Mobile:** Minimum 44×44pt (iOS), 48×48dp (Android)
- **Web:** Minimum 44×44px
- **Spacing:** Minimum 8px between interactive elements

#### Keyboard Navigation

- **Tab Order:** Logical tab order through all interactive elements
- **Focus Indicators:** Visible focus outline on all interactive elements
- **Enter/Space:** Activate buttons and controls
- **Escape:** Close modals and dialogs

#### Screen Readers

- **Semantic HTML:** Use proper HTML5 elements (`<button>`, `<input>`, `<label>`)
- **ARIA Labels:** Add `aria-label` for icon-only buttons
- **ARIA Live Regions:** Announce dynamic content changes
- **Form Labels:** Every input has associated label

## Platform-Specific Considerations

### Navigation

#### Mobile (React Navigation)

- Stack navigator for screen hierarchy
- Native transitions and gestures
- Hardware back button support (Android)

#### Web (React Router)

- URL-based routing
- Browser history API
- Breadcrumb navigation

### Storage

#### Mobile

- **Secure Storage:** React Native Keychain for tokens
- **Async Storage:** React Native AsyncStorage for preferences

#### Web

- **Secure Storage:** Encrypted sessionStorage for tokens
- **Local Storage:** localStorage for preferences

### Biometric Auth

#### Mobile

- **iOS:** Face ID, Touch ID via react-native-biometrics
- **Android:** Fingerprint, Face Unlock via react-native-biometrics

#### Web

- **WebAuthn:** Platform authenticators via @simplewebauthn/browser

## Performance Targets

### Authentication Flows

- Login: < 2 seconds
- Registration: < 2 seconds
- Token Refresh: < 500ms (transparent)
- Profile Load: < 1 second

### Network

- API Timeout: 30 seconds
- Retry Attempts: 3× with exponential backoff (1s, 2s, 4s)

### Bundle Size

- **Mobile:** < 50MB total app size
- **Web:** < 2MB initial bundle

### Memory Usage

- **Mobile:** < 100MB baseline for auth flows
- **Web:** < 50MB baseline for auth flows

## Testing Guidelines

### Unit Tests

- Test shared validation logic
- Test theme values consistency
- Test error message constants

### Integration Tests

- Test cross-platform business logic
- Test API client behavior
- Test storage abstraction

### Visual Regression Tests

- Capture screenshots of key screens
- Compare mobile (iOS, Android) and web (Chrome, Safari)
- Approve visual changes explicitly

### E2E Tests

- Mirror test scenarios between mobile (Detox) and web (Playwright)
- Validate same inputs produce same outputs
- Test critical user flows on both platforms

## Usage Examples

### Importing Design Tokens

```typescript
// Import colors
import { colors } from '@gss/shared';

// Use in styles
const styles = {
  button: {
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
  },
};
```

### Using Validation

```typescript
// Import validation
import { validateEmail, VALIDATION_ERRORS } from '@gss/shared';

// Validate email
if (!validateEmail(email)) {
  setError(VALIDATION_ERRORS.EMAIL_INVALID);
}
```

### Error Handling

```typescript
// Import error messages
import { AUTH_ERRORS } from '@gss/shared';

// Display consistent error
try {
  await authService.login(email, password);
} catch (error) {
  setError(AUTH_ERRORS.INVALID_CREDENTIALS);
}
```

## Maintenance

### Adding New Colors

1. Add to `shared/src/theme/theme.ts`
2. Update this documentation
3. Create visual regression tests

### Adding New Validation Rules

1. Add to `shared/src/constants/validationRules.ts`
2. Add helper function if needed
3. Create unit tests
4. Update this documentation

### Adding New Error Messages

1. Add to appropriate category in `shared/src/constants/errorMessages.ts`
2. Update this documentation
3. Ensure message is user-friendly and actionable

## Resources

- **Material Design 3:** https://m3.material.io/
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **React Native Paper:** https://callstack.github.io/react-native-paper/
- **Material UI:** https://mui.com/material-ui/

## Changelog

### Version 1.0 (November 9, 2025)

- Initial design system documentation
- Centralized color palette, typography, spacing
- Validation rules and error messages
- Cross-platform component patterns
- Accessibility guidelines
- Performance targets

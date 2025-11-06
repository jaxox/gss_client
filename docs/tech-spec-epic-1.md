# Epic Technical Specification: Platform Foundation & Core Identity

Date: November 5, 2025
Author: Jay
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the foundational infrastructure for the GSS Client frontend applications, implementing core authentication, user profiles, and deployment infrastructure. This epic focuses specifically on frontend client implementation (React Native mobile + React web) that integrates with existing backend APIs. The foundation enables user registration, secure SSO authentication, profile management, and initial reliability score display - creating the essential user identity layer that supports all subsequent epics focused on event management, gamification, and social features.

## Objectives and Scope

**In Scope:**

- Repository structure setup with CI/CD pipeline for mobile and web deployments
- User registration and authentication UI components (email/password + SSO providers)
- Google SSO integration on frontend (leveraging completed backend APIs)
- Profile management screens (view, edit) with avatar display (upload disabled in MVP)
- Reliability score display components (private by default)
- JWT token management and auto-refresh flows on client
- Basic security implementation (secure storage, token handling)
- Environment configuration for development, staging, and production builds

**Out of Scope:**

- Backend API implementation (exists in separate repository)  
- Advanced gamification features (Epic 3)
- Event creation/management features (Epic 2)
- Social interaction features (Epic 4)
- Push notification infrastructure (Epic 5)
- Payment/deposit functionality (Epic 2)

## System Architecture Alignment

This epic implements the foundational client architecture components defined in the architecture document, specifically:

- **Multi-Platform Structure:** Establishes mobile/, web/, and shared/ directories with React Native and React/Vite setup
- **Authentication Layer:** Implements secure JWT storage using React Native Keychain and browser secure storage
- **Service Abstraction:** Creates auth.service.ts interface enabling mock-first development before backend integration
- **State Management:** Integrates Redux Toolkit + TanStack Query for authentication state and user profile data
- **Design System:** Implements React Native Paper components for consistent UI across platforms
- **Development Environment:** Establishes TypeScript configuration, ESLint/Prettier, and debugging setup per architecture decisions

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs | Owner |
|--------|---------------|--------|---------|-------|
| **AuthService** | User authentication, token management | Login credentials, refresh tokens | JWT tokens, user session | shared/services/api/auth.service.ts |
| **UserService** | Profile CRUD, avatar management | Profile data, image files | User profiles, upload URLs | shared/services/api/user.service.ts |
| **StorageService** | Secure token storage, preferences | Tokens, app settings | Encrypted storage access | shared/services/storage/ |
| **AuthStore** | Authentication state management | Auth actions, API responses | Auth state, loading states | mobile/src/store/auth/, web/src/store/auth/ |
| **ProfileStore** | User profile state management | Profile actions, user data | Profile state, edit modes | mobile/src/store/profile/, web/src/store/profile/ |
| **AuthScreens** | Login/register UI components | User inputs, navigation | Screen renders, form handling | mobile/src/screens/auth/, web/src/pages/auth/ |
| **ProfileScreens** | Profile view/edit UI components | Profile data, edit actions | Profile displays, forms | mobile/src/screens/profile/, web/src/pages/profile/ |

### Data Models and Contracts

```typescript
// Core Authentication Models
interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  homeCity: string;
  reliabilityScore: number; // 0.0-1.0, private by default
  level: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  homeCity: string;
}

interface SSOLoginRequest {
  provider: 'google' | 'facebook' | 'apple';
  idToken: string;
}

interface ProfileUpdateRequest {
  displayName?: string;
  homeCity?: string;
  avatar?: File | string; // File for upload, string for URL
}

// API Response Wrappers
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
```

### APIs and Interfaces

```typescript
// Auth Service Interface (Mock + Real Implementation)
interface IAuthService {
  // Authentication
  login(credentials: LoginRequest): Promise<AuthResponse>;
  loginSSO(request: SSOLoginRequest): Promise<AuthResponse>;
  register(userData: RegisterRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  
  // Token Management
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  getCurrentUser(): Promise<User>;
  
  // Password Management
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}

// User Service Interface
interface IUserService {
  // Profile Management
  getProfile(userId: string): Promise<User>;
  updateProfile(userId: string, updates: ProfileUpdateRequest): Promise<User>;
  uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }>;
  
  // Privacy Controls
  updatePrivacySettings(userId: string, settings: PrivacySettings): Promise<void>;
}

// Storage Service Interface
interface IStorageService {
  // Secure Storage
  storeTokens(tokens: AuthTokens): Promise<void>;
  getTokens(): Promise<AuthTokens | null>;
  clearTokens(): Promise<void>;
  
  // App Preferences
  storePreference(key: string, value: any): Promise<void>;
  getPreference(key: string): Promise<any>;
}
```

### Workflows and Sequencing

**1. User Registration Flow:**

```text
User Input → Validation → API Call → Token Storage → Profile Setup → Dashboard Navigation
1. User enters email/password/display name
2. Client validates input (email format, password strength)
3. Call auth.register() API
4. Store returned JWT tokens securely
5. Initialize user profile state
6. Navigate to main dashboard
```

**2. SSO Authentication Flow (Google):**

```text
SSO Trigger → Provider Auth → Token Exchange → Backend Verification → Client Session
1. User taps "Sign in with Google"
2. Google SDK handles OAuth flow
3. Receive Google ID token
4. Send to backend auth.loginSSO()
5. Backend verifies token, returns JWT
6. Store JWT tokens, navigate to dashboard
```

**3. Profile Management Flow:**

```text
View Profile → Edit Mode → Validation → API Update → State Refresh → UI Update
1. User navigates to profile screen
2. Display current profile data with default avatar placeholder
3. User taps edit, enters edit mode (avatar upload disabled for MVP)
4. User modifies display name and home city fields
5. Validate changes, call user.updateProfile() for editable fields
6. Update local state, show success feedback
```

**4. Token Refresh Flow:**

```text
API Call → 401 Response → Token Refresh → Retry Original → Success/Logout
1. Any API call receives 401 Unauthorized
2. Interceptor catches 401, attempts refresh
3. Call auth.refreshToken() with stored refresh token
4. Store new tokens, retry original API call
5. If refresh fails, logout user to login screen
```

## Non-Functional Requirements

### Performance

- **App Cold Launch:** <3s on baseline devices (iPhone 11, Pixel 5) per NFR001
- **Authentication Flow:** Login/register completion <2s from submission to success screen
- **Profile Load Time:** User profile display <800ms after navigation
- **Token Refresh:** Background token refresh <500ms, transparent to user experience
- **Memory Usage:** Mobile app memory footprint <150MB during normal authentication flows

*Note: Avatar upload performance requirements excluded from MVP scope*

- **Bundle Size Targets:**
  - Mobile app: <50MB total size
  - Web app: <2MB initial bundle, lazy-load routes

### Security

- **Token Storage:** JWT tokens stored in React Native Keychain (iOS) / Android Keystore (Android) / Secure browser storage (Web)
- **HTTPS Enforcement:** All API communications over HTTPS, certificate pinning for production
- **Token Expiration:** Access tokens expire in 15 minutes, refresh tokens in 90 days
- **Input Validation:** Client-side validation for all forms (email format, password complexity, file size/type)
- **SSO Security:** Google OAuth2 implementation with PKCE, proper state parameter validation
- **Biometric Auth:** Optional biometric unlock for returning users (Face ID, Touch ID, fingerprint)
- **Session Management:** Automatic logout after 7 days of inactivity, secure session cleanup
- **Data Privacy:** Reliability score private by default per FR037, user controls visibility

### Reliability/Availability

- **Offline Capability:** Basic profile viewing available offline with cached data
- **Network Resilience:** Automatic retry with exponential backoff for failed API calls
- **Graceful Degradation:** App functions without network for cached profile data, clear offline indicators
- **Error Boundaries:** React error boundaries prevent app crashes from authentication errors
- **Token Recovery:** Automatic token refresh with fallback to re-authentication if refresh fails
- **State Persistence:** Authentication state persists across app kills/restarts
- **Avatar Fallback:** Default avatar system for failed uploads or network issues

### Observability

- **Authentication Analytics:** Track login success/failure rates, SSO adoption, registration funnel completion
- **Performance Monitoring:** Client-side timing for critical paths (login, profile load, avatar upload)
- **Error Tracking:** Structured error logging for authentication failures, network issues, validation errors
- **User Journey Tracking:** Anonymous analytics for onboarding flow completion rates
- **Security Events:** Log suspicious activities (multiple failed logins, token anomalies)
- **Crash Reporting:** Automatic crash reporting with user consent, privacy-safe stack traces
- **A/B Test Infrastructure:** Framework for testing authentication UI variations (registration flow, SSO button placement)

## Dependencies and Integrations

### Core Framework Dependencies

**React Native Mobile:**

```json
{
  "react-native": "^0.73.0",
  "@react-native-community/cli": "^12.0.0",
  "react": "^18.2.0",
  "typescript": "^5.0.0"
}
```

**React Web:**

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^5.0.0",
  "typescript": "^5.0.0"
}
```

### Authentication & Security Dependencies

**Mobile Platform:**

- `@react-native-keychain/react-native-keychain`: Secure token storage
- `@react-native-google-signin/google-signin`: Google SSO integration
- `react-native-biometrics`: Optional biometric authentication
- `@react-native-async-storage/async-storage`: App preferences storage

**Web Platform:**

- `@google-oauth/google-auth-library`: Google SSO for web
- Browser native secure storage APIs (no additional dependencies)

### State Management & API Dependencies

**Shared (Mobile + Web):**

- `@reduxjs/toolkit`: State management foundation
- `react-redux`: React Redux bindings
- `@tanstack/react-query`: Server state management and caching
- `ky`: HTTP client for API calls with interceptors
- `zod`: Runtime validation and TypeScript schema validation

### UI/UX Dependencies

**Mobile:**

- `react-native-paper`: Material Design 3 component library
- `react-native-vector-icons`: Icon system
- `react-navigation`: Navigation framework
- `react-native-reanimated`: Smooth animations for auth flows

*Note: Avatar upload dependencies (`react-native-image-picker`, `react-native-image-resizer`) excluded from MVP to reduce costs*

**Web:**

- `@mui/material`: Material Design components for web
- `react-router-dom`: Client-side routing
- `@emotion/react`: CSS-in-JS for theming

### Development & Build Dependencies

**Shared:**

- `eslint`: Code linting with React Native/React configs
- `prettier`: Code formatting
- `jest`: Unit testing framework
- `@testing-library/react-native` / `@testing-library/react`: Component testing
- `husky`: Git hooks for pre-commit checks

### Backend Integration Points

**API Endpoints (from existing backend):**

- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: Email/password authentication  
- `POST /api/auth/sso`: SSO authentication (Google, Facebook, Apple)
- `POST /api/auth/refresh`: Token refresh
- `POST /api/auth/logout`: Session termination
- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile
- `POST /api/users/avatar`: Avatar upload
- `POST /api/auth/forgot-password`: Password reset initiation
- `POST /api/auth/reset-password`: Password reset completion

**External Service Integrations:**

- **Google OAuth2:** Client-side SDK integration with backend token verification
- **Apple Sign In:** iOS native integration (future)
- **Facebook Login:** SDK integration (future)
- **Image CDN:** Backend-managed avatar storage and delivery
- **Analytics Service:** Client-side event tracking (Firebase Analytics or similar)

### Version Constraints & Compatibility

- **Node.js:** ≥18.0.0 for development environment
- **iOS:** ≥13.0 for React Native compatibility
- **Android:** API Level 21+ (Android 5.0+)
- **Web Browsers:** Chrome ≥88, Safari ≥14, Firefox ≥85, Edge ≥88
- **React Native CLI:** Latest stable for project initialization

## Acceptance Criteria (Authoritative)

### AC1: Repository Structure & Development Environment

1. Multi-platform repository structure with `mobile/`, `web/`, and `shared/` directories
2. React Native project initialized with TheCodingMachine boilerplate
3. React web project initialized with Vite + TypeScript template
4. Shared TypeScript library with common types and interfaces
5. CI/CD pipeline configured for both mobile and web builds
6. Environment configuration supports development, staging, and production
7. ESLint, Prettier, and pre-commit hooks configured

### AC2: User Registration System

1. Registration form with email, password, display name, and home city fields
2. Client-side validation for all registration fields (email format, password strength)
3. Registration API integration with backend `/api/auth/register` endpoint
4. Success flow stores JWT tokens securely and navigates to dashboard
5. Error handling displays appropriate messages for validation failures and API errors
6. Registration form accessible on both mobile and web platforms

### AC3: Google SSO Integration

1. Google Sign-In button displayed on login screen (mobile and web)
2. Google OAuth flow launches native SDK on mobile, web popup on browser
3. ID token received from Google sent to backend `/api/auth/sso` endpoint
4. Backend response with JWT tokens stored securely
5. User profile initialized with Google account data
6. Error handling for cancelled OAuth flows and invalid tokens

### AC4: Email/Password Authentication

1. Login form with email and password fields
2. Form validation prevents submission with invalid inputs
3. Login API integration with backend `/api/auth/login` endpoint
4. Success stores tokens and navigates to main dashboard
5. "Remember me" option for extended session duration
6. "Forgot password" link initiates password reset flow

### AC5: JWT Token Management

1. Access and refresh tokens stored in secure storage (Keychain/Keystore/Browser)
2. Automatic token refresh when API returns 401 Unauthorized
3. Token refresh uses stored refresh token with `/api/auth/refresh` endpoint
4. Failed refresh attempts redirect user to login screen
5. Token expiration handled gracefully without data loss
6. Logout clears all stored tokens and session data

### AC6: Profile Management System

1. Profile screen displays user data (name, email, default avatar, home city, level, XP)
2. Edit mode allows modification of display name and home city (avatar upload disabled in MVP)
3. Avatar section shows placeholder with "Coming Soon" message for MVP cost control
4. Profile updates call `/api/users/profile` endpoint for editable fields only
5. Reliability score displayed but marked as private
6. Profile changes reflected immediately in UI after successful save

### AC7: Security Implementation

1. All API communications use HTTPS with certificate validation
2. Sensitive data (tokens, passwords) never logged or exposed
3. Biometric authentication option available for returning users
4. Session timeout after configured inactivity period
5. Input sanitization prevents XSS and injection attacks
6. Privacy settings allow user to control data visibility

### AC8: Cross-Platform Consistency

1. Authentication flows function identically on mobile and web
2. UI components follow Material Design principles on both platforms
3. State management works consistently across platforms
4. Error messages and validation are uniform
5. Performance meets targets on both mobile and web
6. Offline capability available for cached profile data

## Traceability Mapping

| Acceptance Criteria | Spec Section | Component/API | Test Strategy |
|-------------------|-------------|---------------|---------------|
| **AC1: Repository Structure** | Services & Modules | Project structure, CI/CD | Integration tests for build process |
| **AC2: User Registration** | AuthService, AuthScreens | `/api/auth/register`, RegisterForm | Unit tests for validation, E2E for complete flow |
| **AC3: Google SSO** | AuthService, SSOLoginRequest | `/api/auth/sso`, GoogleSignIn | Mock Google SDK, test token exchange |
| **AC4: Email/Password Auth** | AuthService, LoginRequest | `/api/auth/login`, LoginForm | Unit tests for forms, integration for API calls |
| **AC5: JWT Token Management** | StorageService, AuthStore | Token interceptors, refresh logic | Unit tests for storage, integration for refresh |
| **AC6: Profile Management** | UserService, ProfileScreens | `/api/users/profile`, ProfileForm | Unit tests for validation, E2E for upload |
| **AC7: Security Implementation** | StorageService, Security NFRs | Keychain/Keystore, HTTPS | Security testing, penetration tests |
| **AC8: Cross-Platform Consistency** | All UI components | React Native Paper, MUI | Visual regression tests, cross-platform E2E |

### Functional Requirements Mapping

| FR# | Description | Epic 1 Component | Implementation Status |
|-----|-------------|-------------------|---------------------|
| **FR001** | User registration with email + password and optional social auth | Registration flow, SSO integration | ✅ Covered in AC2, AC3 |
| **FR002** | User profile (display name, avatar, home city, reliability score, level, XP) | Profile management system | ✅ Covered in AC6 |
| **FR003** | Sport tagging (pickleball default, tennis placeholder) | Profile model extension | ⏸️ Deferred to Epic 2 |
| **FR004** | Host role designation | User model extension | ⏸️ Deferred to Epic 2 |
| **FR037** | Privacy defaults (reliability score private, badges public, level toggle) | Privacy settings implementation | ✅ Covered in AC6, AC7 |
| **FR038** | Security & auth (OAuth2/JWT, refresh tokens, password reset) | Complete authentication system | ✅ Covered in AC3, AC4, AC5 |

## Risks, Assumptions, Open Questions

### Risks

**RISK-001: Backend API Compatibility**

- Risk: Frontend implementation may not align with actual backend API contracts
- Impact: Medium - Could require rework of service interfaces and data models
- Mitigation: Start with mock implementation, validate against backend API docs early
- Owner: Tech Lead

**RISK-002: Google SSO Platform Differences**

- Risk: Google OAuth implementation varies significantly between mobile and web
- Impact: Low - Well-documented patterns exist
- Mitigation: Use established libraries (react-native-google-signin, google-auth-library)
- Owner: Frontend Developer

**RISK-003: Secure Storage Limitations**

- Risk: Keychain/Keystore availability varies across devices and OS versions
- Impact: Medium - Could affect token persistence and user experience
- Mitigation: Implement fallback to encrypted AsyncStorage, graceful degradation
- Owner: Security Lead

**RISK-004: Bundle Size Constraints**

- Risk: Dependencies may exceed mobile app size targets (<50MB)
- Impact: Low - Modern bundling tools provide good optimization
- Mitigation: Tree shaking, code splitting, dependency audit during development
- Owner: DevOps

### Assumptions

**ASSUMPTION-001: Backend API Availability**

- Backend authentication and user management APIs are stable and documented
- API contracts match the interface definitions in this specification
- Backend supports all required authentication methods (email/password, Google SSO)

**ASSUMPTION-002: Design System Compatibility**

- React Native Paper provides sufficient components for authentication UI
- Material Design 3 principles align with UX requirements
- Custom components needed will be minimal

**ASSUMPTION-003: Platform Capabilities**

- Target devices support required security features (Keychain, biometric auth)
- Network connectivity is generally available for authentication flows
- Users accept permissions for camera (avatar), biometric authentication

**ASSUMPTION-004: Development Environment**

- Team has access to Google Developer Console for OAuth configuration
- CI/CD infrastructure supports React Native and React builds
- Testing devices/simulators available for all target platforms

### Open Questions

**QUESTION-001: Avatar Upload Strategy** ✅ RESOLVED

**MVP Strategy Decision:**

- Avatar upload functionality will be **disabled in MVP** to reduce infrastructure costs until app generates revenue
- Profile screens will show default avatar placeholder with "Upload Coming Soon" message
- Backend avatar upload endpoints can remain implemented but unused

**Technical Implementation (Future):**

- Image processing will be handled **client-side** (compression, resizing, format conversion)
- Upload flow: Client processing → Base64/File → Backend API → CDN storage
- Client libraries: react-native-image-picker + react-native-image-resizer for mobile
- Web: HTML5 File API + canvas manipulation for browser processing
- Target: 512x512px, <200KB, WebP format after client-side optimization

**Next Steps:**

- Implement profile UI with disabled avatar upload button
- Add feature flag system for easy activation post-MVP
- Document client-side image processing pipeline for future implementation

**QUESTION-002: Biometric Authentication UX** ✅ RESOLVED

**MVP Strategy Decision (Priority Level: 1/10):**

- **Minimal Implementation:** Basic biometric toggle in Settings > Security section
- **User Discovery:** No prompts or suggestions - users must discover and enable manually
- **Simple UX Flow:** Settings toggle → Enable → Next login uses biometric → Fallback to password if fails
- **Error Handling:** Always fallback to password input when biometric authentication fails

**Technical Implementation:**

- Settings screen with "Enable Face ID/Touch ID" toggle (iOS) / "Enable Fingerprint" (Android)
- Biometric prompt only appears if user manually enabled it in settings
- Graceful fallback: Failed biometric → Password input screen
- No biometric enrollment detection - if biometric fails, show password form

**UX Principle:** "Invisible until wanted" - zero friction for users who don't want biometric auth

**Next Steps:**

- Implement basic settings toggle with react-native-biometrics library
- Add biometric check to login flow only if user enabled it
- Always provide password fallback option

**QUESTION-003: Offline Data Sync** ✅ RESOLVED

**MVP Strategy Decision (Priority Level: 5/10):**

- **Minimal Offline Implementation:** Profile viewing offline is unnecessary for this app
- **Authentication State Only:** Cache only authentication status (logged in/out) for app startup
- **Read-Only Access:** No offline profile viewing or editing capabilities needed
- **Network-Required UX:** Show "Connect to internet" message when offline and accessing profile

**Technical Implementation:**

- Cache authentication tokens for app startup (already implemented via Keychain/Keystore)
- No profile data caching - profile screens require network connection
- Clear offline indicators: "No internet connection" banner when offline
- Graceful degradation: Disable profile navigation when offline

**Offline Behavior:**

- **App Startup:** Works offline if tokens exist (user stays logged in)
- **Profile Access:** Shows "Connect to internet to view profile" message
- **Login/Register:** Requires network connection (expected behavior)
- **Settings:** Basic cached preferences available offline

**Next Steps:**

- Implement network connectivity detection
- Add offline UI indicators and messaging
- Block profile screens when offline with helpful messaging

**QUESTION-004: Error Analytics** ✅ RESOLVED

**MVP Strategy Decision (Priority Level: 5/10):**

- **Balanced Tracking:** Monitor both user growth metrics and technical issues for business and debugging needs
- **Privacy-First Approach:** Use anonymous tracking with standard privacy compliance (no PII)
- **Business + Technical Focus:** Track user acquisition funnels AND app stability metrics

**What to Track (Anonymous & Aggregated):**

- **User Growth:** Registration completion rates, SSO vs email/password adoption, onboarding funnel drop-offs
- **Technical Issues:** Login failure rates, app crash counts, network error frequencies, performance bottlenecks
- **Feature Usage:** Authentication method preferences, settings usage patterns
- **System Health:** API response times, token refresh success rates, platform-specific issues

**What NOT to Track (Privacy Protected):**

- Personal identifiable information (emails, names, cities)
- Specific user behavior patterns that could identify individuals
- Detailed error messages containing user data
- Authentication tokens or password-related information

**Technical Implementation:**

- Anonymous session IDs for error correlation (rotate regularly)
- Error categorization: `auth_failure`, `network_error`, `validation_error`
- Aggregated metrics: "iOS login failures increased 15%" not individual user tracking
- Standard analytics SDK (Firebase Analytics) with privacy settings enabled

**Next Steps:**

- Implement privacy-compliant analytics service integration
- Define error categorization taxonomy for consistent tracking
- Set up automated alerts for critical failure rate thresholds

## Test Strategy Summary

### Test Pyramid Approach

**Unit Tests (70% coverage target)**

- Service layer: Mock API calls, test business logic, validate data transformations
- Components: Test rendering, prop handling, user interactions
- Utilities: Validation functions, token management, storage operations
- State management: Redux actions, reducers, selectors

**Integration Tests (20% coverage)**

- API integration: Test service layer against mock backend
- Authentication flows: End-to-end login/register/logout sequences
- State synchronization: Redux store updates, TanStack Query caching
- Platform-specific: Keychain storage, biometric authentication

**End-to-End Tests (10% strategic coverage)**

- Critical user journeys: Registration → Login → Profile update
- Cross-platform consistency: Same flows on mobile and web
- Error scenarios: Network failures, invalid credentials, expired tokens
- Performance validation: Meet NFR targets for timing and memory usage

### Test Implementation Framework

**Mobile Testing Stack:**

```typescript
// Jest + React Native Testing Library + Detox
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { by, device, element, expect as detoxExpect } from 'detox';

// Example unit test structure
describe('AuthService', () => {
  it('should store tokens securely after successful login', async () => {
    // Test implementation
  });
});
```

**Web Testing Stack:**

```typescript
// Jest + React Testing Library + Playwright
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from '@playwright/test';

// Example integration test
test('Google SSO flow completes successfully', async ({ page }) => {
  // Test implementation
});
```

### Test Data & Mocking Strategy

**Mock Services:**

- AuthService: Predefined user accounts, token responses, error scenarios
- Google OAuth: Simulate successful/failed OAuth flows without real Google
- Storage: In-memory implementation for consistent test environments
- API Client: Mock HTTP responses matching backend contracts

**Test Users:**

- Valid registered user (happy path testing)
- New user (registration flow testing)
- Invalid credentials (error handling)
- Expired tokens (refresh flow testing)

### Continuous Integration Testing

**PR Validation Pipeline:**

1. Unit tests run on every commit (must pass 100%)
2. Integration tests run on PR creation
3. E2E tests run on main branch merge
4. Performance tests run nightly
5. Security scan on dependency changes

**Test Environment Management:**

- Isolated test databases for integration tests
- Mock backend services for API testing
- Test device farms for mobile E2E validation
- Browser testing matrix for web compatibility

### Performance & Security Testing

**Performance Test Scenarios:**

- Cold app launch timing on baseline devices
- Authentication flow completion under various network conditions
- Memory usage profiling during normal authentication operations
- Bundle size monitoring with dependency updates

**Security Test Validation:**

- Token storage security (attempt to extract from device/browser)
- SSL certificate pinning verification
- Input validation bypass attempts
- Session management security (timeout, cleanup)

### Coverage & Quality Gates

**Quality Metrics:**

- Unit test coverage: ≥90% for service layer, ≥80% for components
- Integration test coverage: All API endpoints and auth flows
- E2E test coverage: All critical user journeys
- Performance: All tests must meet NFR targets
- Security: No high/critical vulnerabilities in dependencies

**Definition of Done:**

- All tests pass in CI/CD pipeline
- Code coverage meets targets
- Security scan passes
- Performance benchmarks met
- Cross-platform E2E tests successful

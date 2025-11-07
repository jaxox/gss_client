# Story 1.5: JWT Token Management

Status: ready-for-dev

## Story

As a **system**,
I want **automatic JWT token refresh and session management**,
so that **users remain authenticated without manual intervention and sessions expire securely when appropriate**.

## Acceptance Criteria

**AC1: Automatic Token Refresh**

1. API interceptor detects 401 Unauthorized responses from backend
2. Interceptor automatically calls `/api/auth/refresh` with stored refresh token
3. Successful refresh updates stored access and refresh tokens silently
4. Original failed API request retries automatically with new access token
5. Token refresh happens transparently without user awareness
6. Failed refresh (expired/invalid refresh token) redirects user to login screen

**AC2: Token Storage and Lifecycle**

1. Access tokens stored securely in platform-specific storage (Keychain/Keystore/Secure browser storage)
2. Refresh tokens stored separately with longer expiration (7 days default, 90 days with "Remember me")
3. Token expiration times stored alongside tokens for proactive refresh
4. App checks token expiration on startup and refreshes if needed
5. Logout clears all stored tokens (access, refresh, expiration data)
6. Token storage encrypted and inaccessible to other apps

**AC3: Session Timeout and Inactivity**

1. App tracks user activity (screen interactions, navigation)
2. After configured inactivity period (default 30 minutes), session expires
3. Session expiration shows modal: "Session expired due to inactivity. Please log in again."
4. "Continue Session" button attempts token refresh if refresh token still valid
5. If refresh token expired, user must re-authenticate
6. Active users never experience inactivity timeout

**AC4: Concurrent Request Handling**

1. Multiple simultaneous 401 responses trigger only one refresh request
2. Subsequent API calls wait for refresh completion before proceeding
3. All waiting requests use new access token after successful refresh
4. If refresh fails, all waiting requests fail gracefully
5. Request queue cleared on successful refresh
6. No duplicate refresh API calls during concurrent request handling

## Tasks / Subtasks

**Task 1: Implement Token Storage Service (AC: 2)**

- [ ] Create SecureStorageService in shared/src/services/storage/secureStorage.ts
- [ ] Implement storeTokens method (stores access token, refresh token, expiration times)
- [ ] Implement getTokens method (retrieves all token data)
- [ ] Implement clearTokens method (removes all token data on logout)
- [ ] Add platform-specific implementations: React Native Keychain (iOS/Android), encrypted sessionStorage (web)
- [ ] Create token expiration utilities (isAccessTokenExpired, isRefreshTokenExpired)
- [ ] Implement token metadata storage (issued at, expires at timestamps)
- [ ] Add error handling for storage failures
- [ ] Write unit tests for all storage methods
- [ ] Write integration tests for cross-platform storage consistency

**Task 2: Build Token Refresh Interceptor (AC: 1, 4)**

- [ ] Create API interceptor in shared/src/services/api/interceptors.ts
- [ ] Implement response interceptor catching 401 status codes
- [ ] Add refresh token logic: call /api/auth/refresh with refresh token
- [ ] Implement request queue to hold pending requests during refresh
- [ ] Update stored tokens after successful refresh
- [ ] Retry original failed request with new access token
- [ ] Implement mutex/lock to prevent concurrent refresh requests
- [ ] Handle refresh failure: clear tokens, dispatch logout action, redirect to login
- [ ] Add exponential backoff for failed refresh attempts (max 3 retries)
- [ ] Write unit tests for interceptor logic with mock API responses
- [ ] Write integration tests for concurrent request scenarios

**Task 3: Implement Proactive Token Refresh (AC: 2)**

- [ ] Create token expiration checker service (shared/src/services/auth/tokenManager.ts)
- [ ] Add checkTokenExpiration method (returns time until expiration)
- [ ] Implement proactive refresh 5 minutes before access token expiration
- [ ] Create background timer to check token expiration every minute
- [ ] Trigger refresh automatically when access token nearing expiration
- [ ] Handle app startup: check token validity, refresh if needed
- [ ] Add token refresh on app resume from background (mobile)
- [ ] Implement silent refresh (no UI indication for background refresh)
- [ ] Write unit tests for expiration calculation logic
- [ ] Write integration tests for proactive refresh timing

**Task 4: Build Session Timeout System (AC: 3)**

- [ ] Create activity tracker service (shared/src/services/auth/activityTracker.ts)
- [ ] Implement user activity detection (touch events, navigation, API calls)
- [ ] Add inactivity timer (resets on activity, triggers after 30 minutes idle)
- [ ] Create session timeout modal component (mobile and web)
- [ ] Implement "Continue Session" button triggering token refresh
- [ ] Handle refresh success: dismiss modal, reset inactivity timer
- [ ] Handle refresh failure: redirect to login screen
- [ ] Add configuration for inactivity timeout duration (environment variable)
- [ ] Write unit tests for activity tracking and timeout logic
- [ ] Write E2E tests for inactivity timeout flow

**Task 5: Integrate with Auth State Management (AC: 1, 2, 3)**

- [ ] Update authSlice to handle token refresh actions (refreshStart, refreshSuccess, refreshFailure)
- [ ] Add session expiration state to Redux store
- [ ] Dispatch logout action on refresh failure
- [ ] Update auth state on successful token refresh (update user data if included in response)
- [ ] Implement token storage synchronization with Redux state
- [ ] Add session timeout state and actions
- [ ] Create selectors for token expiration status (isTokenValid, isSessionActive)
- [ ] Write unit tests for auth slice with token refresh scenarios
- [ ] Write integration tests for auth state transitions during refresh

**Task 6: Cross-Platform Testing & Edge Cases (AC: 1, 2, 3, 4)**

- [ ] Test token refresh on mobile (iOS simulator + Android emulator)
- [ ] Test token refresh on web (Chrome, Safari, Firefox)
- [ ] Test concurrent API calls triggering single refresh
- [ ] Test token refresh on app startup with expired access token
- [ ] Test session timeout after 30 minutes of inactivity
- [ ] Test "Continue Session" flow with valid and expired refresh tokens
- [ ] Test logout clears all tokens from secure storage
- [ ] Test token persistence across app restarts
- [ ] Test token refresh during network instability (retry logic)
- [ ] Verify no tokens leaked to logs or console
- [ ] Write E2E tests for complete token lifecycle (login → use → refresh → logout)
- [ ] Verify performance: Token refresh <500ms transparent to user

## Dev Notes

**Implementation Priority:** This story is critical infrastructure for all authenticated API calls. Must be completed before any features requiring persistent authentication (profile management, event browsing, gamification).

**Architecture Alignment:**

- Implements JWT token management defined in tech-spec-epic-1.md AC5
- Uses secure storage abstraction following ADR-002 service pattern
- Integrates with Redux Toolkit for auth state synchronization
- Follows token refresh flow from architecture.md Authentication section

**Key Dependencies:**

- Story 1-1 (Repository Structure) - COMPLETED: Provides service abstraction patterns
- Story 1-2 (Email/Password Auth) - Required: Provides initial token acquisition on login
- Backend API endpoint: `POST /api/auth/refresh` (accepts refresh token, returns new tokens)

**Security Considerations:**

- Tokens never logged or exposed in error messages
- Refresh tokens stored separately from access tokens
- Token storage encrypted using platform-specific secure storage
- Refresh token rotation: Backend should issue new refresh token on each refresh (prevents token reuse attacks)
- Expired tokens immediately cleared from storage
- Network failures during refresh don't expose tokens

**Development Tools:**

- React Native Keychain for iOS/Android secure storage
- Encrypted browser storage wrapper for web
- ky HTTP client interceptors for request/response handling
- Redux Toolkit for auth state management
- Background task scheduling for proactive refresh (React Native: react-native-background-timer, Web: setInterval)

**Testing Standards:**

- Unit tests: Storage methods, interceptor logic, expiration calculations (≥90% coverage)
- Integration tests: Token refresh with mock API, concurrent requests
- E2E tests: Complete token lifecycle, session timeout flows
- Security tests: Verify tokens encrypted, verify token clearing on logout
- Performance tests: Token refresh <500ms requirement

### Learnings from Previous Stories

**From Story 1-1: Repository Structure Setup (Status: done)**

**Services to REUSE:**

- `shared/src/types/auth.types.ts` - Use existing AuthTokens interface (accessToken, refreshToken, expiresAt)
- `shared/src/services/api/client.ts` - Extend ky HTTP client with interceptors for this story

**From Story 1-2: Email/Password Authentication (Status: drafted)**

**Patterns to Follow:**

- Token storage abstraction: Create SecureStorageService following AuthService pattern
- Redux state management: Extend authSlice with token refresh actions
- Error handling: Map API errors to user-friendly messages
- Service interface: Create ITokenManager interface for testability

**New Patterns for This Story:**

- Request interceptors: Catch 401 responses, trigger refresh, retry original request
- Request queue: Hold pending API calls during refresh, process after completion
- Mutex pattern: Prevent concurrent refresh requests
- Background timers: Proactive refresh before expiration
- Activity tracking: Monitor user interactions for inactivity timeout

**Action Items:**

1. Create SecureStorageService in shared/src/services/storage/
2. Create TokenManager service in shared/src/services/auth/
3. Create ActivityTracker service in shared/src/services/auth/
4. Extend ky HTTP client with response interceptor
5. Update authSlice with token refresh actions and reducers
6. Create SessionTimeoutModal component for mobile and web

[Source: docs/stories/1-1-repository-structure-setup.md#Dev-Agent-Record]
[Source: docs/stories/1-2-email-password-authentication.md#Dev-Notes]

### Project Structure Notes

**Expected File Locations:**

**Shared Library:**

- Secure storage: `shared/src/services/storage/secureStorage.ts` (NEW)
- Token manager: `shared/src/services/auth/tokenManager.ts` (NEW)
- Activity tracker: `shared/src/services/auth/activityTracker.ts` (NEW)
- API interceptors: `shared/src/services/api/interceptors.ts` (NEW)
- Token types: Extend `shared/src/types/auth.types.ts` (add TokenMetadata interface)

**Mobile Platform:**

- Session timeout modal: `mobile/src/components/SessionTimeoutModal.tsx` (NEW)
- Auth state: Extend `mobile/src/store/auth/authSlice.ts` with token refresh actions

**Web Platform:**

- Session timeout modal: `web/src/components/SessionTimeoutModal.tsx` (NEW)
- Auth state: Extend `web/src/store/auth/authSlice.ts` with token refresh actions

**Platform-Specific Implementations:**

- iOS/Android: Use `@react-native-keychain/react-native-keychain` for token storage
- Web: Use encrypted `sessionStorage` with CryptoJS for encryption wrapper

### References

**Technical Specification:**

- [Source: docs/tech-spec-epic-1.md#AC5] - JWT Token Management acceptance criteria
- [Source: docs/tech-spec-epic-1.md#AuthService] - Token refresh method definition
- [Source: docs/tech-spec-epic-1.md#StorageService] - Secure token storage interface
- [Source: docs/tech-spec-epic-1.md#Workflows-and-Sequencing] - Token Refresh Flow sequence
- [Source: docs/tech-spec-epic-1.md#Security] - Token expiration, session management, secure storage
- [Source: docs/tech-spec-epic-1.md#Performance] - Token refresh <500ms requirement

**Architecture Decisions:**

- [Source: docs/architecture.md#Authentication] - JWT authentication flow with refresh tokens
- [Source: docs/architecture.md#Secure-Storage] - Token storage strategy (Keychain/Keystore/Browser)
- [Source: docs/architecture.md#ADR-002] - Service abstraction pattern for testability

**Epics and PRD:**

- [Source: docs/shared/epics.md#Epic-1] - Platform Foundation epic
- [Source: docs/shared/PRD.md#FR038] - Security & auth (JWT, refresh tokens, session management)

## Change Log

**v1.0 - November 5, 2025**

- Story created from Epic 1 tech spec AC5
- Acceptance criteria cover automatic refresh, storage, session timeout, concurrent requests
- Tasks structured for storage service, interceptors, proactive refresh, session timeout
- Status: drafted (ready for SM review)

## Dev Agent Record

### Context Reference

**Story Context:** `docs/stories/1-5-jwt-token-management.context.xml`

### Agent Model Used

<- ✅ No runtime errors, clean Dev agent populates during implementation -->

### Debug Log References

<- ✅ No runtime errors, clean Dev agent populates with implementation notes -->

### Completion Notes List

<- ✅ No runtime errors, clean Dev agent populates with completion summary -->

### File List

<- ✅ No runtime errors, clean Dev agent populates with created/modified files -->

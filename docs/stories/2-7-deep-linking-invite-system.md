# Story 2.7: Deep Linking & Private Event Invite System

Status: drafted

## Story

As a **event host**,
I want **to share private event invite links that open directly in the app**,
so that **invited participants can easily access and RSVP to exclusive events without navigating through the app**.

## Acceptance Criteria

**AC1: iOS Universal Links Configuration**

1. Configure Associated Domains capability in Xcode project
2. Create apple-app-site-association (AASA) file with event invite paths
3. AASA file hosted at `https://app.gss.com/.well-known/apple-app-site-association`
4. Universal Link format: `https://app.gss.com/events/invite/{token}`
5. Tapping link on iOS device opens GSS app (if installed) or web fallback
6. Deep link handler extracts token from URL and validates
7. Test on physical iOS device (simulator doesn't fully support Universal Links)
8. Handle app already running vs cold start scenarios

**AC2: Android App Links Configuration**

1. Configure intent filters in AndroidManifest.xml for event invite paths
2. Create assetlinks.json file with app package signature
3. AssetLinks file hosted at `https://app.gss.com/.well-known/assetlinks.json`
4. App Link format: `https://app.gss.com/events/invite/{token}` (same as iOS)
5. Tapping link on Android device opens GSS app (if installed) or web fallback
6. Deep link handler extracts token from URL and validates
7. Test on physical Android device or emulator with verified domain
8. Handle app already running vs cold start scenarios

**AC3: Custom URL Scheme (Fallback)**

1. Configure custom URL scheme: `gss://event/invite/{token}`
2. iOS: Add URL types in Info.plist
3. Android: Add scheme intent filter in AndroidManifest.xml
4. Custom scheme works when Universal Links/App Links fail or unavailable
5. Lower priority than Universal Links/App Links (web-first approach)
6. Handle deep link token extraction consistently with web URLs
7. Support both formats: `gss://event/invite/{token}` and `https://app.gss.com/events/invite/{token}`

**AC4: Deep Link Routing and Navigation**

1. Install and configure react-native-deep-linking or similar library
2. Register deep link listener on app launch (useEffect in App.tsx or equivalent)
3. Parse incoming URL to extract invite token
4. Dispatch validateInviteToken API call with token
5. If valid: navigate to EventDetailScreen/Page with event data
6. If invalid: show error modal "Invalid or expired invite link" with dismiss button
7. If unauthenticated: navigate to login with return URL parameter
8. Handle deep link while app is in foreground vs background vs not running
9. Prevent multiple navigation calls for same deep link (idempotency)
10. Log deep link events for analytics (token validated, event accessed via invite)

**AC5: Web Invite Route Handler**

1. Create web route: `/events/invite/:token` in App.tsx
2. InviteRedirectPage component loads on this route
3. Display loading spinner while validating token
4. Call validateInviteToken API with token from URL params
5. If valid: redirect to `/events/{eventId}` with event detail
6. If invalid: show error page with message and link to browse events
7. If unauthenticated: redirect to `/login?returnUrl=/events/invite/{token}`
8. Handle token expiration with clear messaging
9. Support sharing via social media, email, SMS with Open Graph tags
10. Test direct URL entry, link clicks, and deep link fallback scenarios

**AC6: Invite Link Generation (Host)**

1. Add "Share Event" button on EventDetailScreen/Page for event hosts
2. Button only visible to event creator (hostId === currentUser.id)
3. Tap/click "Share Event" opens share dialog with invite link
4. Call backend API to generate invite token: `POST /api/v1/events/:id/invite-link`
5. Backend returns secure token (JWT or UUID) with expiration
6. Construct full invite URL: `https://app.gss.com/events/invite/{token}`
7. Mobile: Use React Native Share API to open native share sheet
8. Web: Copy link to clipboard with success toast notification
9. Share dialog shows preview: event title, date, location snippet
10. Track invite link generation for analytics

**AC7: Invite Token Security and Expiration**

1. Backend generates cryptographically secure invite tokens (JWT or UUID v4)
2. Token includes: eventId, hostId, expiration timestamp (default 30 days)
3. Token validation checks: signature, expiration, event still active
4. Expired tokens return 410 Gone with clear error message
5. Cancelled/deleted events return 404 Not Found
6. Public events can also have invite links (bypass browsing)
7. Token reuse allowed (same token for multiple invitations)
8. Rate limit token generation per event (max 10 tokens per hour)

**AC8: Cross-Platform Consistency**

1. Same invite URL works for iOS, Android, and web
2. Mobile app opens on iOS/Android with app installed
3. Web fallback opens in browser when app not installed
4. Web experience identical to direct event access (same UI)
5. Mobile and web handle authentication state consistently
6. Error messages identical across platforms
7. Test invite flow: Host shares → Recipient clicks → RSVP completes

**AC9: Analytics and Tracking**

1. Track invite link generation events (eventId, hostId, timestamp)
2. Track invite link opens (token, platform, authenticated status)
3. Track successful event access via invite (conversion rate)
4. Track RSVP completion via invite link (attribution)
5. Dashboard for hosts: "X people accessed your event via invite link"

## Tasks / Subtasks

**Task 1: iOS Universal Links Setup (AC: 1)** ⚠️ NOT STARTED

- [ ] Configure Associated Domains in Xcode
  - [ ] Select project → Signing & Capabilities → Add Capability → Associated Domains
  - [ ] Add domain: `applinks:app.gss.com`
  - [ ] Ensure provisioning profile supports Associated Domains
- [ ] Create apple-app-site-association (AASA) file
  - [ ] Include app ID: `{TeamID}.{BundleID}` (e.g., `ABC123.com.gss.client`)
  - [ ] Specify paths: `/events/invite/*`
  - [ ] Host on backend: `https://app.gss.com/.well-known/apple-app-site-association`
  - [ ] Verify with Apple's AASA validator tool
- [ ] Implement deep link handler in AppDelegate
  - [ ] Override `application:continueUserActivity:restorationHandler:`
  - [ ] Pass URL to React Native via event emitter
- [ ] Test on physical iOS device

**Task 2: Android App Links Setup (AC: 2)** ⚠️ NOT STARTED

- [ ] Configure intent filters in AndroidManifest.xml
  - [ ] Add intent-filter with android:autoVerify="true"
  - [ ] Specify host: `app.gss.com`, path: `/events/invite/*`
- [ ] Create assetlinks.json file
  - [ ] Generate SHA256 fingerprints for keystores
  - [ ] Include relation: `delegate_permission/common.handle_all_urls`
  - [ ] Host on backend: `https://app.gss.com/.well-known/assetlinks.json`
- [ ] Implement deep link handler in MainActivity
  - [ ] Override `onNewIntent()` method
  - [ ] Pass URL to React Native
- [ ] Test on Android device or emulator

**Task 3: Custom URL Scheme Configuration (AC: 3)** ⚠️ NOT STARTED

- [ ] iOS: Configure URL types in Info.plist with scheme: `gss`
- [ ] Android: Add scheme intent filter in AndroidManifest.xml
- [ ] Update AppDelegate and MainActivity to handle custom schemes
- [ ] Test: `gss://event/invite/test-token`

**Task 4: React Native Deep Linking Integration (AC: 4)** ⚠️ NOT STARTED

- [ ] Create DeepLinkHandler service in `shared/src/services/deepLink/`
  - [ ] Parse URL to extract invite token
  - [ ] Validate token format
- [ ] Implement deep link listener in App.tsx
  - [ ] Use React Native Linking API
  - [ ] Handle initial URL: `Linking.getInitialURL()`
  - [ ] Handle URL events: `Linking.addEventListener('url', handler)`
- [ ] Implement navigation logic
  - [ ] Valid token: navigate to EventDetailScreen
  - [ ] Invalid token: show error modal
  - [ ] Unauthenticated: navigate to login with returnUrl
- [ ] Test all scenarios: app not running, background, foreground

**Task 5: Web Invite Route and Handler (AC: 5)** ⚠️ NOT STARTED

- [ ] Create InviteRedirectPage component
  - [ ] Extract token from URL params
  - [ ] Call validateInviteToken thunk
  - [ ] Display loading spinner
- [ ] Implement validation and redirect logic
  - [ ] Success: navigate to event detail
  - [ ] Failure: show error page
  - [ ] Unauthenticated: redirect to login
- [ ] Add route to App.tsx: `/events/invite/:token`
- [ ] Test direct URL entry and link clicks

**Task 6: Share Event Feature (Host) (AC: 6)** ⚠️ NOT STARTED

- [ ] Add "Share Event" button (mobile + web)
  - [ ] Show only for event host: `event.hostId === currentUser.id`
- [ ] Implement invite link generation
  - [ ] Create generateInviteLink thunk
  - [ ] API call: `POST /api/v1/events/:id/invite-link`
  - [ ] Construct full URL
- [ ] Mobile: React Native Share API
  - [ ] Call `Share.share({ message, url, title })`
- [ ] Web: Clipboard copy
  - [ ] Use `navigator.clipboard.writeText(inviteUrl)`
  - [ ] Show success Snackbar
- [ ] Test share functionality

**Task 7: Invite Token Security Implementation (AC: 7)** ⚠️ NOT STARTED

- [ ] Backend coordination: Generate invite tokens (JWT or UUID)
  - [ ] Endpoint: `POST /api/v1/events/:id/invite-link`
  - [ ] Include expiration (30 days)
- [ ] Backend coordination: Validate invite tokens
  - [ ] Endpoint: `POST /api/v1/events/validate-invite`
  - [ ] Check expiration, event status
  - [ ] Return appropriate HTTP status codes
- [ ] Frontend: Handle validation responses
  - [ ] 200: Valid → Navigate
  - [ ] 410: Expired → Show message
  - [ ] 404: Not found → Show message
- [ ] Implement rate limiting (backend)

**Task 8: Cross-Platform Testing (AC: 8)** ⚠️ NOT STARTED

- [ ] Test iOS Universal Links (physical device)
  - [ ] Host shares → Recipient taps → App opens
  - [ ] Test with app not installed → Web fallback
- [ ] Test Android App Links
  - [ ] Host shares → Recipient taps → App opens
  - [ ] Test with app not installed → Web fallback
- [ ] Test web invite URLs
  - [ ] Direct URL entry
  - [ ] Link clicks from email/social
  - [ ] Authenticated and unauthenticated users
- [ ] Test custom URL scheme fallback
- [ ] Verify cross-platform consistency

**Task 9: Analytics Integration (AC: 9)** ⚠️ NOT STARTED

- [ ] Track invite link generation: `invite_link_generated`
- [ ] Track invite link opens: `invite_link_opened`
- [ ] Track event access via invite: `invite_link_accessed`
- [ ] Track RSVP attribution: Add `source: 'invite'` to createRSVP
- [ ] Implement host dashboard metrics (optional future)

**Task 10: Documentation and Backend Coordination (AC: All)** ⚠️ NOT STARTED

- [ ] Document deep linking setup in mobile/README.md
- [ ] Coordinate with backend team on API endpoints
- [ ] Update AGENT-TESTING-GUIDE.md with deep linking tests
- [ ] Update tech-spec-epic-2.md with implementation notes

## Dev Notes

### Technical Summary

This story implements the deep linking infrastructure deferred from Story 2-2 Task 10. Deep linking enables private event invite links to open directly in the mobile app (iOS/Android) or web browser, providing seamless access to exclusive events. The implementation requires native platform configuration (iOS Universal Links, Android App Links), React Native integration, and web routing. This is critical infrastructure for viral growth and private event distribution.

### Implementation Priority

This story should be implemented after Story 2-2 (Event RSVP) is complete, as it depends on the validateInviteToken API and event detail screens. It can be implemented in parallel with Story 2-3 (QR Check-in) or Story 2-4 (Event Browse). Priority: Medium-High (enables private events and viral sharing).

### Architecture Alignment

- **Native Configuration:** iOS Universal Links and Android App Links require platform-specific setup
- **Deep Linking Library:** React Native Linking API (built-in) or react-native-deep-linking
- **Routing:** React Navigation (mobile), React Router (web) handle navigation from deep links
- **Services:** DeepLinkHandler service in `shared/src/services/deepLink/` for URL parsing
- **State Management:** Redux thunk for validateInviteToken API call
- **Backend Coordination:** Requires backend endpoints for token generation and validation

### Key Dependencies

- **Story 2-2 Complete:** validateInviteToken API, EventDetailScreen/Page, RSVP flows
- **Backend APIs:**
  - `POST /api/v1/events/:id/invite-link` (generate token)
  - `POST /api/v1/events/validate-invite` (validate token)
- **Native Platforms:** Xcode (iOS), Android Studio (Android) for configuration
- **Backend Team:** Host AASA and assetlinks.json files on domain
- **Domain Access:** Configure DNS and hosting for `https://app.gss.com`
- **Apple Developer Account:** For provisioning profiles with Associated Domains
- **Google Play Console:** For SHA256 fingerprint registration

### Technical Considerations

1. **iOS Universal Links:**
   - Requires HTTPS domain with valid SSL certificate
   - AASA file must be hosted at exact path: `/.well-known/apple-app-site-association`
   - No redirects allowed for AASA file (must be direct 200 OK response)
   - Physical device required for testing (simulator doesn't fully support)
   - Associated Domains entitlement required in provisioning profile

2. **Android App Links:**
   - Requires assetlinks.json with SHA256 fingerprints from both debug and release keystores
   - Domain verification can take hours to propagate
   - Test with `adb shell pm get-app-links com.gss.mobile` to verify status
   - Use `adb shell am start -a android.intent.action.VIEW -d "https://app.gss.com/events/invite/test-token" com.gss.mobile` for testing

3. **Custom URL Scheme:**
   - Works as fallback when Universal Links/App Links fail
   - Lower user trust (no domain association)
   - Can be hijacked by other apps (less secure)
   - Use as secondary option, prefer web-based links

4. **Token Security:**
   - Use JWT with eventId claim and expiration (nbf, exp)
   - Or UUID v4 stored in backend with expiration timestamp
   - HMAC-SHA256 signature validation
   - Rate limiting prevents abuse (10 tokens/hour per event)

5. **Navigation Edge Cases:**
   - App not running: Initial URL extracted on launch
   - App in background: URL event listener handles navigation
   - App in foreground: URL event listener with state check
   - Multiple deep links: Debounce or queue to prevent race conditions
   - Invalid token: Show modal, don't navigate

6. **Performance Targets:**
   - Deep link → app open: <1 second
   - Token validation: <500ms
   - Web invite page load: <1200ms

### Testing Strategy

**Unit Tests:**

- DeepLinkHandler.parseUrl() extracts token correctly
- Token format validation (JWT structure, UUID format)
- URL construction for invite links

**Integration Tests:**

- validateInviteToken API call with mock responses (valid, expired, not found)
- Navigation logic: valid token → EventDetail, invalid → error modal
- Authentication redirect: unauthenticated → login with returnUrl

**E2E Tests (Critical):**

- iOS: Physical device test with real AASA file
  - Share link → Messages → Tap → App opens → Event detail displayed
  - App not installed → Web fallback
- Android: Device test with verified domain
  - Share link → Email → Tap → App opens → Event detail displayed
  - App not installed → Web fallback
- Web: Direct URL entry, link clicks from various sources
- Cross-platform: Same invite URL works on all platforms

**Manual Testing Checklist:**

- [ ] iOS Universal Link opens app (physical device)
- [ ] Android App Link opens app (device or emulator)
- [ ] Web invite URL displays event detail
- [ ] Custom scheme fallback works: `gss://event/invite/{token}`
- [ ] Expired token shows appropriate error
- [ ] Invalid token shows appropriate error
- [ ] Unauthenticated user redirected to login
- [ ] Post-login redirect back to event
- [ ] Share functionality (mobile + web)
- [ ] Clipboard copy success toast (web)

### Security Considerations

- **Token Cryptography:** JWT with RS256 or HMAC-SHA256, or UUID v4 with backend validation
- **Expiration:** 30-day default (configurable per event or host preference)
- **HTTPS Required:** Universal Links and App Links require valid SSL certificates
- **Rate Limiting:** Prevent token generation abuse (10/hour per event)
- **Token Reuse:** Same token can be shared multiple times (improves UX, no security issue for public/private events)
- **No PII in Token:** Token should not encode user email or sensitive data
- **Audit Log:** Track token generation, validation, and usage for security monitoring

### UX Considerations

- **Seamless Experience:** Tap link → App opens → Event displayed (no extra steps)
- **Clear Errors:** "This invite link has expired" vs "Event not found" vs "Invalid link"
- **Share Preview:** Event title, date, location snippet in share dialog
- **Web Fallback:** Users without app installed get full web experience
- **Authentication Flow:** Unauthenticated users can see event preview, prompted to login for RSVP
- **Loading States:** Show spinner while validating token, don't leave user in limbo

### Performance Considerations

- **Lazy Load:** Only validate token when needed (on deep link trigger)
- **Cache Tokens:** Cache validated tokens (5-minute TTL) to prevent redundant API calls
- **Prefetch Event:** After token validation, prefetch event details for faster render
- **Error Recovery:** Retry token validation on network failure (exponential backoff)

### Project Structure Notes

**Deep Linking Service:**

```
shared/src/services/deepLink/
  deepLinkHandler.ts          # URL parsing, token extraction
  deepLinkHandler.test.ts     # Unit tests
  types.ts                    # DeepLink, InviteToken types
```

**Mobile Components:**

```
mobile/src/components/events/
  ShareEventButton.tsx        # Share button for hosts
  InviteErrorModal.tsx        # Invalid/expired token modal

mobile/ios/GSS_Mobile/
  AppDelegate.m               # Universal Links handler
  Info.plist                  # URL types configuration

mobile/android/app/src/main/
  AndroidManifest.xml         # Intent filters
  MainActivity.java           # App Links handler
```

**Web Components:**

```
web/src/pages/events/
  InviteRedirectPage.tsx      # /events/invite/:token route
  InviteErrorPage.tsx         # Error page for invalid tokens

web/src/components/events/
  ShareEventButton.tsx        # Clipboard copy + toast
```

**Backend Files (Coordination Required):**

```
https://app.gss.com/.well-known/
  apple-app-site-association  # iOS AASA file (no extension)
  assetlinks.json            # Android asset links
```

### Backend API Requirements

**Generate Invite Link:**

```typescript
POST /api/v1/events/:id/invite-link
Authorization: Bearer {jwt}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "inviteUrl": "https://app.gss.com/events/invite/{token}",
  "expiresAt": "2025-12-13T12:00:00Z"
}

Response 429: Rate limit exceeded
Response 404: Event not found
Response 403: Not event host
```

**Validate Invite Token:**

```typescript
POST /api/v1/events/validate-invite
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response 200:
{
  "valid": true,
  "eventId": "evt_123",
  "event": { /* full event object */ }
}

Response 410: Token expired
Response 404: Event not found
Response 400: Invalid token format
```

### References

- [Source: docs/stories/2-2-event-rsvp-deposit-authorization.md#Task 10: Private Event Deep Linking]
- [Source: docs/tech-spec-epic-2.md#AC9: Private Event Invite System]
- [Apple Universal Links Documentation](https://developer.apple.com/ios/universal-links/)
- [Android App Links Documentation](https://developer.android.com/training/app-links)
- [React Native Linking API](https://reactnative.dev/docs/linking)
- [React Native Share API](https://reactnative.dev/docs/share)

---

## Dev Agent Record

### Context Reference

- Story Context file to be generated: `docs/stories/2-7-deep-linking-invite-system.context.xml`

### Agent Model Used

TBD

### Debug Log References

None

### Completion Notes List

TBD

### File List

TBD

---

## Change Log

**2025-11-13:** Story drafted as follow-up to Story 2-2 Task 10 (deferred deep linking configuration)

# Story 2.3: QR Check-In & Deposit Refund

Status: drafted

## Story

As a **participant user**,
I want **to check in to events using QR codes with automatic deposit refunds**,
so that **I can confirm my attendance easily and get my deposit back immediately**.

## Acceptance Criteria

**AC1: QR Code Check-In Flow (Tech Spec AC4)**

1. Check-in button appears on event detail for user's RSVP'd events on event day
2. Tap check-in opens camera with QR scanner overlay and targeting guides
3. Camera permissions requested on first use with clear rationale: "Scan QR code to check in"
4. Scanner detects host's QR code displayed on their device
5. QR validation occurs client-side (format check: `gss://event/{eventId}/checkin/{token}`)
6. API call to `eventService.checkIn()` with scanned token
7. Backend validates: correct event, active RSVP, not already checked in, within time window
8. Success triggers deposit refund (if applicable) within 60s per NFR024
9. Success animation displays: confetti effect, "✓ Checked in!" message
10. Display confirmation: "Deposit refunded: $X" (if applicable), XP placeholder (Epic 3)
11. Participant list updates showing user as checked in with timestamp
12. Check-in status persists, prevents duplicate check-ins
13. Clear error messaging for invalid QR codes, wrong event, network failures

**AC2: Manual Check-In Fallback (Tech Spec AC5)**

1. "Request Manual Check-In" button available if QR scan fails (timeout 30s)
2. Tap button sends notification to event host
3. Host receives push notification: "User X needs manual check-in for Event Y"
4. Host opens event dashboard (Story 2-1), sees pending check-in request with user info
5. Host verifies user presence physically, taps "Confirm Check-In"
6. API call to `eventService.manualCheckIn()` with userId
7. Backend logs check-in method as 'manual' with host ID and timestamp audit trail
8. Deposit refund triggered same as QR check-in
9. Both user and host receive confirmation notifications
10. User's app updates to checked-in status with indication of manual method
11. Manual check-ins tracked separately in analytics (FR032 instrumentation)

**AC3: Deposit Refund Automation (Tech Spec NFR024)**

1. Deposit refund triggered automatically on successful check-in
2. API call to `paymentService.refundDeposit()` with authorization ID
3. Stripe refund processing completes in <60s (p95)
4. User receives immediate UI confirmation: "Deposit refunded"
5. Refund notification sent via push: "Your $X deposit has been refunded"
6. Refund appears in user's payment method within Stripe's standard timeframe (5-10 days)
7. RSVP status updated to 'checked-in' with refund confirmation
8. Idempotency prevents double refunds if check-in called multiple times
9. Refund failure handling: log error, notify user, manual reconciliation flag for admin

**AC4: QR Scanner UX and Error Handling**

1. QR scanner overlay includes targeting guides (corner brackets)
2. Flashlight toggle available for low-light conditions
3. Scanner provides haptic feedback on successful scan (mobile vibration)
4. Auto-focus on QR code detection
5. Error messages for common failures:
   - "Invalid QR code" - Wrong format or tampered
   - "Wrong event" - QR code is for different event
   - "Already checked in" - Duplicate check-in attempt
   - "Too early" - Before check-in window opens (event start - 30min)
   - "Too late" - After check-in window closes (event end + 30min)
   - "Network error" - Connectivity issue, retry available
6. Scanner timeout after 30s shows "Having trouble?" with manual check-in option
7. Cancel button returns to event detail

**AC5: Check-In Status and History**

1. Event detail shows check-in status indicator:
   - "Not Checked In" (gray) - Before check-in
   - "Checked In" (green) - Successfully checked in
   - "Manual Check-In" (blue) - Host manually confirmed
   - "No-Show" (red) - Did not check in (post-event)
2. Check-in timestamp displayed: "Checked in at 2:45 PM"
3. Deposit refund status visible: "Deposit refunded: $5" or "No deposit (free event)"
4. Check-in method logged: "QR Scan" or "Manual by Host"
5. Historical check-ins visible in "My RSVPs" list with filters
6. Check-in data used for reliability score calculation (Epic 1 foundation)

## Tasks / Subtasks

**Task 1: QR Check-In Service Layer (AC: 1, 3)**

- [ ] Implement `EventService.checkIn()` in `shared/services/api/events.service.ts`
  - [ ] API call to `POST /api/v1/events/:id/check-in` with QR token
  - [ ] Request body: `{ eventId, qrToken, method: 'qr' }`
  - [ ] Response parsing: CheckInResponse with success, refund status, message
  - [ ] Error handling: 400 (invalid), 409 (already checked in), 422 (wrong event/time)
- [ ] Implement `EventService.manualCheckIn()` for fallback
  - [ ] API call to `POST /api/v1/events/:id/manual-check-in` with userId
  - [ ] Host authentication validation
  - [ ] Audit logging parameters
- [ ] Implement `PaymentService.refundDeposit()` in `shared/services/api/payment.service.ts`
  - [ ] API call to `POST /api/v1/payments/refund` with authorization ID
  - [ ] Idempotency key generation to prevent double refunds
  - [ ] Stripe refund confirmation parsing
  - [ ] Error handling: Stripe API errors, network failures

**Task 2: QR Scanner Service (AC: 1, 4)**

- [ ] Implement `QRService` in `shared/services/qr/` (mobile and web)
  - [ ] `validateQRFormat()` - Regex validation of QR token format
  - [ ] `parseQRData()` - Extract eventId and token from scanned string
  - [ ] `generateQRCode()` - Create QR code image for hosts (from Story 2-1)
- [ ] Mobile: Configure react-native-vision-camera
  - [ ] Camera permission handling
  - [ ] QR code frame processor with vision-camera-code-scanner plugin
  - [ ] Real-time QR detection and parsing
- [ ] Web: Configure html5-qrcode
  - [ ] Browser camera access
  - [ ] QR code scanning in browser
  - [ ] Fallback for unsupported browsers

**Task 3: Check-In State Management (AC: 1, 5)**

- [ ] Update `RSVPStore` Redux slice with check-in state
  - [ ] State: checkInStatus, checkInTimestamp, refundStatus
  - [ ] Actions: checkInStart/Success/Failure, updateCheckInStatus
  - [ ] Selectors: selectCheckInStatus, selectRefundStatus
- [ ] Integrate TanStack Query for check-in mutation
  - [ ] `useCheckInMutation` hook with optimistic updates
  - [ ] Cache invalidation on successful check-in (event detail, RSVP list)
  - [ ] Error rollback on failed check-in

**Task 4: Mobile QR Check-In UI (AC: 1, 2, 4)**

- [ ] Create `CheckInScreen` in `mobile/src/screens/events/CheckInScreen.tsx`
  - [ ] Camera view with react-native-vision-camera
  - [ ] QR scanner overlay with targeting guides
  - [ ] Flashlight toggle button
  - [ ] Cancel button
  - [ ] Loading state during API call
- [ ] Create `CheckInSuccess` component
  - [ ] Success animation (react-native-confetti-cannon or lottie)
  - [ ] "✓ Checked in!" message
  - [ ] Deposit refund confirmation (if applicable)
  - [ ] XP award placeholder (Epic 3)
  - [ ] "Done" button returns to event detail
- [ ] Implement manual check-in request flow
  - [ ] "Request Manual Check-In" button after scanner timeout
  - [ ] Confirmation dialog before sending request
  - [ ] Loading state while request sent
  - [ ] Success message: "Host notified. They'll confirm your check-in."
- [ ] Error handling UI
  - [ ] Error dialog with specific messages
  - [ ] Retry button for network errors
  - [ ] Manual check-in option for persistent QR failures

**Task 5: Web QR Check-In UI (AC: 1, 2, 4)**

- [ ] Create `CheckInDialog` component in `web/src/components/events/CheckInDialog.tsx`
  - [ ] MUI Dialog with camera view
  - [ ] html5-qrcode scanner integration
  - [ ] Targeting guides overlay
  - [ ] Cancel and manual check-in buttons
- [ ] Create check-in success screen/modal
  - [ ] Success animation (CSS animations or lottie)
  - [ ] Confirmation message
  - [ ] Refund status display
- [ ] Implement manual check-in request (same as mobile logic)
- [ ] Error handling dialogs

**Task 6: Host Dashboard Manual Check-In UI (AC: 2)**

- [ ] Add "Pending Check-Ins" section to Host Dashboard (Story 2-1)
  - [ ] List of manual check-in requests
  - [ ] User avatar, name, RSVP time
  - [ ] "Confirm Check-In" and "Deny" buttons
  - [ ] Real-time updates when requests arrive (WebSocket or polling)
- [ ] Implement confirm check-in action
  - [ ] API call to manualCheckIn endpoint
  - [ ] Success feedback to host
  - [ ] Remove request from pending list
- [ ] Implement deny action (optional)
  - [ ] API call to deny request
  - [ ] Notify user of denial with reason option

**Task 7: Deposit Refund Notification (AC: 3)**

- [ ] Implement refund notification service
  - [ ] Push notification on successful refund: "Your $X deposit has been refunded"
  - [ ] In-app notification banner
  - [ ] Email confirmation (optional, deferred)
- [ ] Handle refund failure notifications
  - [ ] Error notification: "Refund processing issue. Contact support."
  - [ ] Admin alert for manual reconciliation

**Task 8: Testing (AC: All)**

- [ ] Unit tests for check-in and refund services
  - [ ] Test checkIn with valid/invalid QR tokens
  - [ ] Test manualCheckIn with host authentication
  - [ ] Test refundDeposit with idempotency
  - [ ] Test QR validation logic
- [ ] Unit tests for state management
  - [ ] Test check-in mutations and cache updates
  - [ ] Test optimistic updates and rollback
- [ ] Component tests for check-in flows
  - [ ] Test QR scanner UI
  - [ ] Test manual check-in request
  - [ ] Test success and error states
- [ ] Integration tests
  - [ ] Test complete QR check-in flow with API mocks
  - [ ] Test manual check-in flow end-to-end
  - [ ] Test refund automation
- [ ] E2E tests with Detox (mobile) and Playwright (web)
  - [ ] Test QR scan check-in (mock QR code)
  - [ ] Test manual check-in fallback
  - [ ] Test deposit refund confirmation
  - [ ] Test error scenarios

## Dev Notes

**Implementation Priority:** This story depends on Stories 2-1 (event creation, QR codes) and 2-2 (RSVP, deposits). Implements critical attendance confirmation and refund automation.

**Architecture Alignment:**

- Implements Tech Spec AC4 (QR Code Check-In System) and AC5 (Manual Check-In Fallback System)
- Implements Tech Spec NFR024 (Deposit Refund <60s)
- Aligns with EventService, PaymentService, QRService, CheckInFlow modules

**Key Dependencies:**

- Story 2-1: QR code generation on event creation
- Story 2-2: RSVP and deposit authorization must exist
- Stripe refund API configured and tested
- Firebase Cloud Messaging for check-in notifications
- Backend APIs: `POST /api/v1/events/:id/check-in`, `POST /api/v1/events/:id/manual-check-in`, `POST /api/v1/payments/refund`

**Technical Considerations:**

1. **QR Scanning:**
   - Mobile: react-native-vision-camera (^3.6.0) + vision-camera-code-scanner (^0.2.0)
   - Web: html5-qrcode (^2.3.8) for browser-based scanning
   - QR format: `gss://event/{eventId}/checkin/{token}` with HMAC signature
   - Token security: time-limited (24h), single-use, tamper-proof

2. **Deposit Refund:**
   - Stripe refund API with idempotency keys
   - Target: p95 <60s from check-in to refund confirmation
   - Idempotency prevents double refunds on duplicate check-ins
   - Refund appears in user's account in 5-10 business days (Stripe standard)

3. **Check-In Time Window:**
   - Opens: 30 minutes before event start
   - Closes: 30 minutes after event end
   - Backend validates time window, returns 422 if outside
   - Host can override time window via manual check-in

4. **Performance Targets:**
   - QR scan detection: <500ms from code in view to parse
   - Check-in API call: <2s from scan to success confirmation
   - Deposit refund: <60s from check-in to refund confirmation (NFR024)
   - Manual check-in notification delivery: <5s from host to user

5. **Security:**
   - QR tokens cryptographically signed (HMAC-SHA256) to prevent forgery
   - Single-use tokens invalidated after successful check-in
   - Manual check-in audit trail: host ID, timestamp, user ID, event ID
   - Refund idempotency keys prevent duplicate processing

**Testing Strategy:**

- **Unit Tests (70% coverage):**
  - EventService: checkIn, manualCheckIn with various scenarios
  - PaymentService: refundDeposit with idempotency
  - QRService: validateQRFormat, parseQRData
  - State management: check-in mutations, optimistic updates

- **Integration Tests (20% coverage):**
  - Complete QR check-in flow with API mocks
  - Manual check-in fallback flow
  - Deposit refund automation with Stripe test mode
  - Error handling and retry scenarios

- **E2E Tests (10% strategic coverage):**
  - Mobile: RSVP → Arrive at event → Scan QR → Check-in success → Refund
  - Mobile: QR scan failure → Manual check-in request → Host confirms
  - Web: Same scenarios on web platform
  - Error scenarios: Wrong QR, too early, already checked in, network failure

**Security Considerations:**

- QR token validation on backend (never trust client)
- Single-use tokens prevent replay attacks
- Manual check-in audit logging for accountability
- Refund idempotency prevents financial exploits
- Time window validation prevents early/late check-ins
- Host role verification for manual check-in approval

**UX Considerations:**

- Clear camera permission rationale: "Scan QR code to check in"
- QR scanner targeting guides for easier alignment
- Haptic feedback on successful scan (mobile vibration)
- Success animation celebrates attendance (confetti effect)
- Manual check-in fallback reduces frustration from QR failures
- Clear error messages with actionable next steps
- Deposit refund confirmation provides peace of mind

### Project Structure Notes

**Shared:**

- `shared/services/api/events.service.ts` - checkIn, manualCheckIn methods
- `shared/services/api/payment.service.ts` - refundDeposit method
- `shared/services/qr/qrService.ts` - QR validation and parsing
- `shared/types/checkin.ts` - CheckInRequest, CheckInResponse interfaces

**Mobile:**

- `mobile/src/screens/events/CheckInScreen.tsx` - QR scanner screen
- `mobile/src/components/checkin/CheckInSuccess.tsx` - Success celebration
- `mobile/src/components/checkin/ManualCheckInRequest.tsx` - Fallback UI
- `mobile/src/hooks/useQRScanner.ts` - QR scanning hook with vision-camera
- `mobile/src/hooks/useCheckIn.ts` - Check-in mutation hook

**Web:**

- `web/src/components/events/CheckInDialog.tsx` - Check-in modal with QR scanner
- `web/src/components/checkin/CheckInSuccess.tsx` - Success component
- `web/src/components/checkin/QRScanner.tsx` - html5-qrcode wrapper
- `web/src/hooks/useCheckIn.ts` - Check-in hook (shared logic with mobile)

### References

- [Source: docs/tech-spec-epic-2.md#AC4: QR Code Check-In System]
- [Source: docs/tech-spec-epic-2.md#AC5: Manual Check-In Fallback System]
- [Source: docs/tech-spec-epic-2.md#NFR024: Deposit Refund <60s]
- [Source: docs/tech-spec-epic-2.md#Services - EventService, PaymentService, QRService]
- [Source: docs/tech-spec-epic-2.md#Workflows - QR Code Check-In Flow, Manual Check-In Fallback Flow]
- [Source: docs/tech-spec-epic-2.md#Dependencies - vision-camera, html5-qrcode, Stripe]

## Dev Agent Record

### Context Reference

<!-- Story context XML will be generated by *story-context workflow when story is ready for dev -->

### Agent Model Used

Claude 3.5 Sonnet (Bob - Scrum Master Agent)

### Debug Log References

None

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->

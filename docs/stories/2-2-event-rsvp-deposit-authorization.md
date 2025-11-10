# Story 2.2: Event RSVP & Deposit Authorization

Status: ready-for-dev

## Story

As a **participant user**,
I want **to RSVP to events with secure deposit authorization**,
so that **I can commit to attending events and demonstrate my reliability**.

## Acceptance Criteria

**AC1: Event Discovery and Detail View (Tech Spec AC2, AC11)**

1. Events tab displays list of nearby public events sorted by date and distance
2. Event cards show: title, sport icon, date/time, location with distance, participant count (X/Y), deposit badge ($0/$5/$10)
3. Tap event card navigates to event detail screen with full information
4. Event detail shows: complete description, location map with marker, participant list with avatars, host details, RSVP button
5. Distance from user location calculated and displayed (requires location permission)
6. Empty state when no events match filters or location unavailable
7. Pull-to-refresh updates event list from backend (invalidates cache)
8. Events work identically on mobile and web platforms

**AC2: RSVP Flow for Free Events (Tech Spec AC3)**

1. For events with depositAmount = $0, RSVP button shows "RSVP (Free)"
2. Tap RSVP button shows confirmation dialog: event details, no payment required
3. Tap "Confirm RSVP" calls `eventService.createRSVP()` without payment flow
4. RSVP confirmation screen displays:
   - Event details with QR check-in instructions
   - "You're registered!" success message
   - Reminder notification schedule (24h, 1h before)
   - Navigation to "My RSVPs" or back to event list
5. Participant count increments immediately (optimistic update)
6. User's RSVP status persists across app restarts

**AC3: RSVP Flow with Stripe Deposit Authorization (Tech Spec AC3)**

1. For events with depositAmount > $0, RSVP button shows "RSVP ($5)" or "RSVP ($10)"
2. Tap RSVP button triggers Stripe payment sheet with deposit amount
3. Payment sheet displays:
   - Authorization notice: "We'll authorize $X. You'll only be charged if you don't check in."
   - Existing payment methods (if any)
   - "Add Payment Method" option for new cards
   - Stripe-native UI (compliant with PCI requirements)
4. User selects/adds payment method (card details never touch app servers)
5. Payment authorization occurs (no charge) via `paymentService.authorizeDeposit()`
6. Authorization ID stored with RSVP record
7. RSVP confirmation screen displays:
   - Event details with QR check-in instructions
   - Deposit amount authorized (refundable on check-in)
   - Clear messaging: "Deposit will be refunded when you check in"
   - Reminder notification schedule
8. Backend schedules reminder notifications (24h, 1h before event)
9. Error handling for payment failures: card declined, network error, insufficient funds
10. User can retry payment or cancel RSVP on error

**AC4: Private Event Access (Tech Spec AC9)**

1. Private events not visible in public browse or map views
2. User accesses private event via invite link (deep link or web URL)
3. Deep link format: `gss://event/invite/{token}` opens app to validation
4. Web URL format: `https://app.gss.com/events/invite/{token}` validates and displays event
5. API call to `eventService.validateInviteToken(token)` verifies access
6. If valid, event detail screen displays with RSVP option (standard flow)
7. If invalid, error message: "Invalid or expired invite link"
8. RSVP flow identical to public events (free or deposit)
9. Private event RSVPs tracked separately for host analytics

**AC5: RSVP Management and Status**

1. "My RSVPs" screen shows all user's confirmed RSVPs sorted by event date
2. RSVP cards display: event title, date/time, location, deposit status, check-in status
3. RSVP status indicators:
   - "Confirmed" (green) - Active RSVP
   - "Checked In" (blue) - Successfully attended
   - "Cancelled" (gray) - User cancelled
   - "No-Show" (red) - Did not check in (post-event)
4. Tap RSVP card navigates to event detail with "Cancel RSVP" option (before event)
5. Deposit status visible: "$5 Authorized - Refundable on check-in"
6. Real-time updates when check-in occurs or event cancelled
7. Historical RSVPs retained for reliability score calculation

**AC6: RSVP Capacity and Race Condition Handling**

1. RSVP button disabled if event at capacity (currentParticipants >= capacity)
2. Show "Event Full" badge on event detail
3. Optimistic UI update on RSVP tap, rollback if capacity race detected
4. Backend validates capacity on RSVP creation, returns 409 Conflict if full
5. Client handles 409 error with user-friendly message: "Event just filled up"
6. Refresh event detail to show updated capacity
7. Allow RSVP button re-enable if cancellation occurs and spot opens

## Tasks / Subtasks

**Task 1: Event Discovery Service Layer (AC: 1)**

- [ ] Implement `EventService.searchEvents()` in `shared/services/api/events.service.ts`
  - [ ] API call to `GET /api/v1/events` with filters (location, sport, date range)
  - [ ] Response parsing and Event model mapping
  - [ ] Error handling for network failures
- [ ] Implement `EventService.getEventById()` for detail view
  - [ ] API call to `GET /api/v1/events/:id`
  - [ ] Participant list fetching
- [ ] Implement `LocationService.getCurrentLocation()` for distance calculation
  - [ ] Location permission request with rationale
  - [ ] GPS coordinate retrieval (mobile) / browser geolocation (web)
  - [ ] Fallback to manual location entry if permission denied
- [ ] Implement `LocationService.calculateDistance()` using geolib
  - [ ] Haversine formula for accurate distance
  - [ ] Format distance display (miles/km based on locale)

**Task 2: RSVP and Payment Service Layer (AC: 2, 3, 4)**

- [ ] Implement `EventService.createRSVP()` in `shared/services/api/events.service.ts`
  - [ ] API call to `POST /api/v1/events/:id/rsvp`
  - [ ] Handle free events (no payment) vs deposit events
  - [ ] RSVP confirmation response parsing
- [ ] Implement `PaymentService.authorizeDeposit()` in `shared/services/api/payment.service.ts`
  - [ ] Stripe SDK integration for payment authorization
  - [ ] Payment method selection and addition
  - [ ] Authorization ID capture and storage
  - [ ] Error handling: card declined, network failure, API errors
- [ ] Implement `EventService.validateInviteToken()` for private events
  - [ ] API call to `POST /api/v1/events/validate-invite`
  - [ ] Token validation response handling
  - [ ] Deep link navigation to event detail
- [ ] Implement `EventService.getMyRSVPs()` for RSVP management
  - [ ] API call to `GET /api/v1/events/my-rsvps`
  - [ ] RSVP list with event details

**Task 3: State Management for Events and RSVPs (AC: 1, 5, 6)**

- [ ] Create `EventStore` Redux slice in `mobile/src/store/events/` and `web/src/store/events/`
  - [ ] State: eventList, selectedEvent, filters, loading, error
  - [ ] Actions: fetchEventsStart/Success/Failure, setSelectedEvent, updateFilters
  - [ ] Selectors: selectEventList, selectSelectedEvent, selectFilters
- [ ] Create `RSVPStore` Redux slice
  - [ ] State: myRSVPs, rsvpStatus, depositAuthorization
  - [ ] Actions: createRSVPStart/Success/Failure, updateRSVPStatus
  - [ ] Selectors: selectMyRSVPs, selectRSVPStatus
- [ ] Integrate TanStack Query for event caching
  - [ ] `useEvents` hook for event list with cache
  - [ ] `useEventDetail` hook for single event
  - [ ] `useCreateRSVPMutation` hook with optimistic updates
  - [ ] Cache invalidation on RSVP success
- [ ] Handle capacity race conditions
  - [ ] Optimistic participant count increment
  - [ ] Rollback on 409 Conflict error
  - [ ] Error state management and user messaging

**Task 4: Mobile Event Discovery UI (AC: 1, 4)**

- [ ] Create `EventsScreen` in `mobile/src/screens/events/EventsScreen.tsx`
  - [ ] Event list with FlatList (infinite scroll)
  - [ ] EventCard component: title, sport icon, date, location, distance, participants, deposit badge
  - [ ] Pull-to-refresh functionality
  - [ ] Empty state for no events
  - [ ] Loading skeleton while fetching
- [ ] Create `EventDetailScreen` in `mobile/src/screens/events/EventDetailScreen.tsx`
  - [ ] Event header: title, sport, date/time, location
  - [ ] Location map with marker (react-native-maps)
  - [ ] Full description with expandable text
  - [ ] Participant list with avatars (horizontal scroll)
  - [ ] Host info section with avatar and name
  - [ ] RSVP button (dynamic label based on deposit)
  - [ ] "Event Full" badge if at capacity
- [ ] Implement location permission flow
  - [ ] Request permission on first event browse
  - [ ] Clear rationale: "Show nearby events"
  - [ ] Fallback to manual location entry

**Task 5: Mobile RSVP Flow UI (AC: 2, 3)**

- [ ] Implement RSVP confirmation dialog for free events
  - [ ] Event summary with date, time, location
  - [ ] "Confirm RSVP" and "Cancel" buttons
  - [ ] Loading state during API call
- [ ] Integrate Stripe Payment Sheet for deposit events
  - [ ] `@stripe/stripe-react-native` setup
  - [ ] Payment sheet presentation with deposit amount
  - [ ] Payment method selection UI (Stripe-native)
  - [ ] Add payment method flow (Stripe-native card entry)
  - [ ] Authorization success/failure handling
- [ ] Create RSVP confirmation screen
  - [ ] Success animation (confetti or checkmark)
  - [ ] Event details recap
  - [ ] QR check-in instructions
  - [ ] Deposit authorization message (if applicable)
  - [ ] "View My RSVPs" and "Back to Events" buttons
- [ ] Error handling UI
  - [ ] Payment failure dialog with retry option
  - [ ] Network error with retry
  - [ ] Capacity full error message

**Task 6: Mobile RSVP Management UI (AC: 5)**

- [ ] Create `MyRSVPsScreen` in `mobile/src/screens/events/MyRSVPsScreen.tsx`
  - [ ] RSVP list with FlatList
  - [ ] RSVP card: event title, date, location, deposit status, check-in status
  - [ ] Status badges: Confirmed, Checked In, Cancelled, No-Show
  - [ ] Tap card navigates to event detail
  - [ ] Empty state for no RSVPs
- [ ] Add "Cancel RSVP" option on event detail (before event)
  - [ ] Confirmation dialog with impact warning
  - [ ] API call to cancel RSVP (handled in Story 2-5)

**Task 7: Web Event Discovery UI (AC: 1, 4)**

- [ ] Create `EventsPage` in `web/src/pages/events/EventsPage.tsx`
  - [ ] Event list with MUI Grid or List
  - [ ] EventCard component: title, sport, date, location, distance, participants, deposit
  - [ ] Refresh button (no pull-to-refresh on web)
  - [ ] Empty state message
  - [ ] Loading spinner
- [ ] Create `EventDetailPage` in `web/src/pages/events/EventDetailPage.tsx`
  - [ ] Event header section
  - [ ] Google Map with marker (@googlemaps/js-api-loader)
  - [ ] Description with typography formatting
  - [ ] Participant grid with avatars
  - [ ] Host info card
  - [ ] RSVP button (MUI Button)
  - [ ] Capacity indicator

**Task 8: Web RSVP Flow UI (AC: 2, 3)**

- [ ] Implement RSVP confirmation dialog (MUI Dialog)
  - [ ] Free event confirmation flow
- [ ] Integrate Stripe Payment Elements for deposit events
  - [ ] `@stripe/stripe-js` and `@stripe/react-stripe-js` setup
  - [ ] Stripe Elements for payment method selection
  - [ ] Add payment method modal
  - [ ] Authorization handling
- [ ] Create RSVP confirmation screen/modal
  - [ ] Success message with event details
  - [ ] Deposit messaging
  - [ ] Navigation options
- [ ] Error handling dialogs
  - [ ] Payment error with retry
  - [ ] Network error
  - [ ] Capacity error

**Task 9: Web RSVP Management UI (AC: 5)**

- [ ] Create `MyRSVPsPage` in `web/src/pages/events/MyRSVPsPage.tsx`
  - [ ] RSVP table or grid (MUI DataGrid or custom)
  - [ ] Status badges with color coding
  - [ ] Event details on row click
  - [ ] Empty state
- [ ] Add cancel RSVP functionality on event detail

**Task 10: Private Event Deep Linking (AC: 4)**

- [ ] Configure deep linking for mobile
  - [ ] iOS Universal Links setup (Associated Domains)
  - [ ] Android App Links setup (Intent Filters)
  - [ ] Deep link handler: `gss://event/invite/{token}`
- [ ] Configure web routing for invite URLs
  - [ ] Route: `/events/invite/:token`
  - [ ] Token validation on route load
  - [ ] Redirect to event detail or error page
- [ ] Implement invite token validation flow
  - [ ] API call on deep link open
  - [ ] Success: navigate to event detail
  - [ ] Failure: show error message with explanation

**Task 11: Testing (AC: All)**

- [ ] Unit tests for EventService and PaymentService
  - [ ] Test searchEvents with various filters
  - [ ] Test createRSVP for free and deposit events
  - [ ] Test Stripe authorization flow
  - [ ] Test invite token validation
- [ ] Unit tests for state management
  - [ ] Test event list fetching and caching
  - [ ] Test RSVP creation with optimistic updates
  - [ ] Test capacity race condition handling
- [ ] Component tests for RSVP flows
  - [ ] Test free event RSVP dialog
  - [ ] Test Stripe payment sheet interaction
  - [ ] Test RSVP confirmation display
  - [ ] Test error handling UI
- [ ] Integration tests for complete flows
  - [ ] Test mobile free RSVP end-to-end
  - [ ] Test mobile deposit RSVP with Stripe test mode
  - [ ] Test web RSVP flows
  - [ ] Test private event access via deep link
- [ ] E2E tests with Detox (mobile) and Playwright (web)
  - [ ] Test event discovery and detail view
  - [ ] Test free RSVP flow
  - [ ] Test deposit RSVP flow (Stripe test cards)
  - [ ] Test capacity full scenario
  - [ ] Test cross-platform consistency

## Dev Notes

**Implementation Priority:** This story depends on Story 2-1 (event creation) and should be implemented second. RSVP functionality is critical for enabling the check-in flow in Story 2-3.

**Architecture Alignment:**

- Implements Tech Spec AC2 (Event Discovery and Browsing System) and AC3 (RSVP Flow with Stripe Deposit Authorization) completely
- Implements Tech Spec AC9 (Private Event Invite System)
- Aligns with EventService, PaymentService, LocationService, EventStore, RSVPStore modules
- Uses Stripe SDK for PCI-compliant payment handling

**Key Dependencies:**

- Story 2-1 (Host Event Creation) must be complete - events must exist to RSVP
- Epic 1 authentication for JWT tokens in API calls
- Google Maps Platform API keys for location services
- Stripe account configured with publishable keys (test mode for development)
- Backend APIs: `GET /api/v1/events`, `GET /api/v1/events/:id`, `POST /api/v1/events/:id/rsvp`, `POST /api/v1/events/validate-invite`, `GET /api/v1/events/my-rsvps`, `POST /api/v1/payments/authorize`
- Deep linking configuration (iOS Universal Links, Android App Links)

**Technical Considerations:**

1. **Stripe Integration:**
   - Mobile: `@stripe/stripe-react-native` (^0.35.0) with native Payment Sheet UI
   - Web: `@stripe/stripe-js` (^2.2.0) + `@stripe/react-stripe-js` (^2.4.0) with Stripe Elements
   - Authorization-only flow: no charges occur until check-in failure
   - Test mode: use Stripe test publishable key `pk_test_...` and test cards
   - Error handling: card declined (use test card `4000000000000002`), network errors, validation errors

2. **Location Services:**
   - Mobile: react-native-geolocation-service (^5.3.1) for GPS location
   - Web: Browser Geolocation API with fallback to IP-based location
   - Shared: geolib (^3.3.4) for distance calculations (Haversine formula)
   - Permission handling: request with clear rationale, graceful fallback if denied

3. **Deep Linking:**
   - Mobile: Configure `react-native-deep-linking` or `@react-navigation/native` linking
   - iOS: Associated Domains entitlement for Universal Links
   - Android: Intent filters in AndroidManifest.xml for App Links
   - Web: React Router route for `/events/invite/:token`

4. **Performance Targets:**
   - Event list loads in <1200ms (p95) per Tech Spec NFR Performance
   - RSVP flow completes in <3s from button tap to confirmation
   - Distance calculations complete in <100ms for 50 events
   - Stripe payment sheet opens in <500ms

5. **Capacity Race Conditions:**
   - Optimistic UI updates for better UX
   - Backend validates capacity atomically (database-level check)
   - 409 Conflict response triggers rollback and error message
   - Retry not allowed for capacity errors (user must find different event)

**Testing Strategy:**

- **Unit Tests (70% coverage):**
  - EventService: searchEvents, getEventById, createRSVP, validateInviteToken, getMyRSVPs
  - PaymentService: authorizeDeposit with Stripe test mode
  - LocationService: getCurrentLocation, calculateDistance
  - State management: Event and RSVP Redux slices, TanStack Query mutations

- **Integration Tests (20% coverage):**
  - Complete RSVP flow with API mocks (free and deposit)
  - Stripe authorization flow with test cards
  - Deep link navigation and token validation
  - Capacity race condition handling

- **E2E Tests (10% strategic coverage):**
  - Mobile: Browse events → View detail → RSVP (free) → Confirmation
  - Mobile: Browse events → RSVP (deposit) → Stripe sheet → Authorization → Confirmation
  - Web: Same scenarios on web platform
  - Private event: Open invite link → Validate → RSVP
  - Capacity full: Attempt RSVP on full event → Error message

**Security Considerations:**

- Stripe SDK handles all card data client-side (PCI compliance)
- Payment authorization IDs stored securely on backend, not in client state
- Invite tokens cryptographically signed (HMAC-SHA256) with expiration
- Location data not stored persistently, only used for distance calculation
- RSVP API calls require valid JWT authentication
- Capacity validation on backend prevents race condition exploits

**UX Considerations:**

- Clear deposit authorization messaging: "We'll authorize $X but only charge if you don't check in"
- Deposit amount prominently displayed on RSVP button: "RSVP ($5)"
- Success confirmation with clear next steps: view QR code, add to calendar
- Error messages user-friendly with retry options
- Loading states for all async operations (API calls, geocoding, Stripe)
- Optimistic updates for immediate feedback, rollback on errors
- Empty states with helpful guidance: "No events nearby. Try expanding your search radius."

### Project Structure Notes

**Shared Library:**

- `shared/services/api/events.service.ts` - EventService with searchEvents, getEventById, createRSVP, validateInviteToken, getMyRSVPs
- `shared/services/api/payment.service.ts` - PaymentService with authorizeDeposit, getPaymentMethods
- `shared/services/api/location.service.ts` - LocationService with getCurrentLocation, calculateDistance
- `shared/types/event.ts` - Event, RSVP, EventSearchResult interfaces
- `shared/types/payment.ts` - PaymentAuthorization, PaymentMethod interfaces
- `shared/validation/rsvpValidation.ts` - RSVP form validation schemas

**Mobile:**

- `mobile/src/screens/events/EventsScreen.tsx` - Event discovery list
- `mobile/src/screens/events/EventDetailScreen.tsx` - Event detail with RSVP
- `mobile/src/screens/events/MyRSVPsScreen.tsx` - User's RSVP list
- `mobile/src/components/events/EventCard.tsx` - Event list item component
- `mobile/src/components/events/RSVPDialog.tsx` - Free event RSVP confirmation
- `mobile/src/components/events/RSVPConfirmation.tsx` - Success screen
- `mobile/src/store/events/eventSlice.ts` - Event state management
- `mobile/src/store/rsvp/rsvpSlice.ts` - RSVP state management
- `mobile/src/hooks/useCreateRSVP.ts` - RSVP creation hook
- `mobile/src/hooks/useStripePayment.ts` - Stripe integration hook

**Web:**

- `web/src/pages/events/EventsPage.tsx` - Event discovery page
- `web/src/pages/events/EventDetailPage.tsx` - Event detail page
- `web/src/pages/events/MyRSVPsPage.tsx` - User's RSVP page
- `web/src/pages/events/InvitePage.tsx` - Private event invite handler
- `web/src/components/events/EventCard.tsx` - Event card component
- `web/src/components/events/RSVPDialog.tsx` - RSVP confirmation dialog
- `web/src/components/events/StripePaymentForm.tsx` - Stripe Elements form
- `web/src/store/events/eventSlice.ts` - Event state (shared logic with mobile)
- `web/src/store/rsvp/rsvpSlice.ts` - RSVP state (shared logic with mobile)
- `web/src/hooks/useCreateRSVP.ts` - RSVP hook (shared logic with mobile)

### References

- [Source: docs/tech-spec-epic-2.md#AC2: Event Discovery and Browsing System]
- [Source: docs/tech-spec-epic-2.md#AC3: RSVP Flow with Stripe Deposit Authorization]
- [Source: docs/tech-spec-epic-2.md#AC9: Private Event Invite System]
- [Source: docs/tech-spec-epic-2.md#AC11: Geo-Location Integration and Distance Filtering]
- [Source: docs/tech-spec-epic-2.md#Services and Modules - EventService, PaymentService, LocationService]
- [Source: docs/tech-spec-epic-2.md#Data Models - Event, RSVP, RSVPRequest]
- [Source: docs/tech-spec-epic-2.md#APIs and Interfaces - IEventService, IPaymentService, ILocationService]
- [Source: docs/tech-spec-epic-2.md#Workflows - User Discovers and RSVPs to Event Flow, Private Event Invite Flow]
- [Source: docs/tech-spec-epic-2.md#Dependencies - Stripe SDK, react-native-geolocation, geolib]
- [Source: docs/shared/epics.md#Epic 2: Event Lifecycle & Attendance Commitment]

## Dev Agent Record

### Context Reference

- `docs/stories/2-2-event-rsvp-deposit-authorization.context.xml` - Generated: 2025-11-09

### Agent Model Used

Claude 3.5 Sonnet (Bob - Scrum Master Agent)

### Debug Log References

None

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->

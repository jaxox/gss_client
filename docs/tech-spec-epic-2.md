# Epic Technical Specification: Event Lifecycle & Attendance Commitment

Date: November 9, 2025
Author: Jay
Epic ID: 2
Status: Draft

---

## Overview

Epic 2 implements the core event lifecycle and attendance commitment system for the GSS Client, enabling users to discover, RSVP to, check into, and manage sports events with reliability mechanisms that reduce no-show rates. This epic focuses on frontend client implementation (React Native mobile + React web) integrating with existing backend Event APIs to deliver event creation by hosts, public/private event browsing with geo-filtering, RSVP flows with optional deposit authorization, QR code and manual check-in systems, and automated reminder/cancellation workflows. The implementation directly addresses the platform's primary goal of reducing recreational sports no-show rates from 30-40% to <15% through deposit commitments, reliable check-ins, and social accountability features. This epic builds upon the authentication foundation from Epic 1 and provides essential event infrastructure that will support gamification features (Epic 3) and social interactions (Epic 4).

## Objectives and Scope

**In Scope:**

- Event creation UI for hosts (title, description, location with map picker, date/time, capacity, deposit amount, visibility)
- Event browsing and discovery with list/map toggle views
- Advanced filtering by sport, date range, distance radius, capacity remaining, deposit requirements
- Geo-location integration for distance-based event sorting and map display
- RSVP flow with Stripe deposit authorization integration (when deposit >$0)
- Private event access via invite links with token-based authentication
- QR code generation for event hosts and QR scanning for attendee check-ins
- Manual check-in fallback system with audit logging
- Deposit refund automation triggered by successful check-ins
- Event reminder notification system (24h, 1h configurable intervals)
- Cancellation workflow with cut-off windows and reliability impact calculation
- ETA quick-reply system for late attendees integrated with host dashboards
- Real-time event capacity and attendance status updates
- Event detail screens showing full information, participant lists, and host details

**Out of Scope:**

- Gamification mechanics (XP awards, streaks, badges) - Epic 3
- Social features (kudos, event recaps, partner tracking) - Epic 4
- Advanced notification preferences UI - Epic 5
- Payment processing backend implementation (backend APIs assumed complete)
- Event recommendation algorithms - Epic 7
- Admin moderation tools - Epic 8
- Community/group features - Deferred Phase 2

## System Architecture Alignment

This epic implements event lifecycle components defined in the client architecture, specifically:

- **Event Discovery Components:** EventCard, EventFilters, MapView, EventList per architecture Component Library
- **Event Management Components:** EventDashboard, CheckInFlow per host management patterns
- **Service Layer:** EventService, LocationService, PaymentService interfaces in shared/services/api/
- **State Management:** Redux Toolkit event slices + TanStack Query for event data caching and real-time updates
- **Mobile Screens:** mobile/src/screens/events/ with EventsScreen, EventDetailScreen, CheckInScreen, CreateEventScreen
- **Web Pages:** web/src/pages/events/ with event management, analytics, host dashboards per architecture
- **Native Features:** react-native-vision-camera for QR scanning, react-native-maps for location display, Stripe SDK integration
- **Notification Integration:** Leverages Firebase Cloud Messaging foundation for reminder notifications
- **Offline Strategy:** Cache-first with background sync for event discovery, online-required for RSVP/check-in operations
- **Design System:** React Native Paper components customized with Trust & Reliability color theme (#3B82F6 primary blue)

## Detailed Design

### Services and Modules

| Module                  | Responsibility                                              | Inputs                                            | Outputs                                           | Owner                                                       |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| **EventService**        | Event CRUD operations, RSVP management, check-in processing | Event data, RSVP requests, check-in confirmations | Event objects, RSVP status, check-in results      | shared/services/api/events.service.ts                       |
| **LocationService**     | Geocoding, distance calculation, map integration            | Addresses, coordinates, user location             | Geocoded locations, distance metrics, map data    | shared/services/api/location.service.ts                     |
| **PaymentService**      | Stripe deposit authorization and refund flows               | Deposit amounts, payment methods, refund requests | Authorization tokens, refund confirmations        | shared/services/api/payment.service.ts                      |
| **QRService**           | QR code generation and scanning utilities                   | Event IDs, check-in tokens                        | QR code images, scanned data validation           | shared/services/qr/                                         |
| **NotificationService** | Event reminder scheduling and delivery                      | Event schedules, user preferences, ETA updates    | Notification triggers, delivery confirmations     | shared/services/api/notification.service.ts                 |
| **EventStore**          | Event browsing state, filters, cached events                | Browse actions, filter updates, API responses     | Event lists, selected event, filter state         | mobile/src/store/events/, web/src/store/events/             |
| **RSVPStore**           | User RSVP status, deposit flow state                        | RSVP actions, payment confirmations               | RSVP status, deposit state, confirmation data     | mobile/src/store/rsvp/, web/src/store/rsvp/                 |
| **EventScreens**        | Event discovery, detail, RSVP UI                            | User interactions, navigation                     | Screen renders, form handling, list displays      | mobile/src/screens/events/, web/src/pages/events/           |
| **CheckInFlow**         | QR scanning, manual check-in, success celebration           | Camera input, manual confirmations                | Check-in status, success animations               | mobile/src/components/checkin/, web/src/components/checkin/ |
| **HostDashboard**       | Event management, participant tracking, ETA display         | Host's events, RSVP data, ETA updates             | Dashboard UI, participant lists, real-time status | mobile/src/screens/host/, web/src/pages/host/               |

### Data Models and Contracts

```typescript
// Core Event Models
interface Event {
  id: string;
  title: string;
  description: string;
  sport: Sport;
  location: EventLocation;
  dateTime: string; // ISO 8601 format
  capacity: number;
  currentParticipants: number;
  depositAmount: number; // In cents, 0 for free events
  visibility: 'public' | 'private';
  hostId: string;
  host: User; // Embedded host info
  qrCode?: string; // Base64 or URL for QR image
  inviteToken?: string; // For private events
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  remindersSent: boolean[];
  createdAt: string;
  updatedAt: string;
}

interface EventLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  venueName?: string;
  venueType?: 'indoor' | 'outdoor';
}

interface Sport {
  id: string;
  name: string; // 'pickleball', 'tennis', etc.
  icon: string;
  skillLevels: string[]; // ['beginner', 'intermediate', 'advanced']
}

// RSVP and Participation Models
interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  user: User; // Embedded user info
  status: 'confirmed' | 'cancelled' | 'checked-in' | 'no-show';
  depositStatus?: 'authorized' | 'captured' | 'refunded' | 'forfeited';
  depositAuthorizationId?: string; // Stripe authorization ID
  checkedInAt?: string;
  checkedInBy?: string; // userId of host who manually checked in
  checkedInMethod?: 'qr' | 'manual';
  cancelledAt?: string;
  cancellationReason?: string;
  rsvpedAt: string;
  updatedAt: string;
}

interface EventParticipant {
  userId: string;
  displayName: string;
  avatar?: string;
  reliabilityScore: number;
  rsvpStatus: RSVP['status'];
  etaStatus?: ETAStatus;
  checkedIn: boolean;
}

interface ETAStatus {
  status: 'on-time' | 'running-late' | 'cant-make-it';
  estimatedArrival?: number; // Minutes from event start
  message?: string;
  updatedAt: string;
}

// Request/Response Models
interface CreateEventRequest {
  title: string;
  description: string;
  sportId: string;
  location: EventLocation;
  dateTime: string;
  capacity: number;
  depositAmount: number; // $0, $5, or $10 in cents
  visibility: 'public' | 'private';
}

interface EventFilterRequest {
  sport?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    radiusMiles: number;
  };
  depositRange?: {
    min: number;
    max: number;
  };
  capacityAvailable?: boolean;
  page?: number;
  limit?: number;
}

interface RSVPRequest {
  eventId: string;
  depositPaymentMethodId?: string; // Stripe payment method ID if deposit required
}

interface CheckInRequest {
  eventId: string;
  userId?: string; // For manual check-in by host
  qrToken?: string; // Scanned QR code token
  method: 'qr' | 'manual';
}

interface CheckInResponse {
  success: boolean;
  rsvp: RSVP;
  depositRefunded: boolean;
  xpAwarded?: number; // Placeholder for Epic 3
  message: string;
}

interface CancellationRequest {
  eventId: string;
  reason?: string;
}

interface ETAUpdateRequest {
  eventId: string;
  status: 'on-time' | 'running-late' | 'cant-make-it';
  estimatedMinutesLate?: number;
}

// Event Discovery Models
interface EventSearchResult {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalEvents: number;
  };
  filters: EventFilterRequest;
}

interface EventDetailView extends Event {
  participants: EventParticipant[];
  userRSVP?: RSVP;
  distance?: number; // Miles from user location
  weatherForecast?: WeatherInfo;
}

interface WeatherInfo {
  temperature: number;
  conditions: string; // 'sunny', 'rainy', etc.
  precipitation: number; // Percentage
  windSpeed: number;
}
```

### APIs and Interfaces

```typescript
// Event Service Interface (Mock + Real Implementation)
interface IEventService {
  // Event CRUD
  createEvent(event: CreateEventRequest): Promise<Event>;
  getEvent(eventId: string): Promise<EventDetailView>;
  updateEvent(eventId: string, updates: Partial<CreateEventRequest>): Promise<Event>;
  deleteEvent(eventId: string): Promise<void>;

  // Event Discovery
  searchEvents(filters: EventFilterRequest): Promise<EventSearchResult>;
  getNearbyEvents(latitude: number, longitude: number, radiusMiles: number): Promise<Event[]>;
  getMyEvents(userId: string): Promise<Event[]>; // Events user created (host)
  getMyRSVPs(userId: string): Promise<Event[]>; // Events user RSVP'd to

  // RSVP Management
  createRSVP(request: RSVPRequest): Promise<RSVP>;
  cancelRSVP(eventId: string, reason?: string): Promise<void>;
  getRSVPStatus(eventId: string): Promise<RSVP | null>;

  // Check-In Operations
  checkIn(request: CheckInRequest): Promise<CheckInResponse>;
  generateQRCode(eventId: string): Promise<string>; // Returns QR code image URL/base64
  validateQRToken(token: string): Promise<{ valid: boolean; eventId?: string }>;

  // Host Operations
  getEventParticipants(eventId: string): Promise<EventParticipant[]>;
  manualCheckIn(eventId: string, userId: string): Promise<CheckInResponse>;
  updateETAStatus(request: ETAUpdateRequest): Promise<void>;

  // Private Events
  generateInviteLink(eventId: string): Promise<string>;
  validateInviteToken(token: string): Promise<{ valid: boolean; eventId?: string }>;
}

// Location Service Interface
interface ILocationService {
  // Geocoding
  geocodeAddress(address: string): Promise<EventLocation>;
  reverseGeocode(latitude: number, longitude: number): Promise<EventLocation>;

  // Distance Calculations
  calculateDistance(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): Promise<number>; // Returns miles

  // User Location
  getCurrentLocation(): Promise<{ latitude: number; longitude: number }>;
  requestLocationPermission(): Promise<boolean>;
}

// Payment Service Interface
interface IPaymentService {
  // Stripe Integration
  authorizeDeposit(amount: number, paymentMethodId: string): Promise<string>; // Returns authorization ID
  captureDeposit(authorizationId: string): Promise<void>;
  refundDeposit(authorizationId: string): Promise<void>;

  // Payment Methods
  getPaymentMethods(): Promise<PaymentMethod[]>;
  addPaymentMethod(paymentMethodDetails: any): Promise<PaymentMethod>;
  setDefaultPaymentMethod(paymentMethodId: string): Promise<void>;
}

// QR Service Interface
interface IQRService {
  // QR Generation
  generateQR(data: string): Promise<string>; // Returns base64 image

  // QR Scanning
  scanQR(): Promise<string>; // Opens camera, returns scanned data
  validateQRData(data: string): Promise<{ valid: boolean; eventId?: string }>;
}

// Notification Service Interface
interface INotificationService {
  // Event Reminders
  scheduleEventReminder(eventId: string, userId: string, timeBeforeEvent: number): Promise<void>;
  cancelEventReminders(eventId: string, userId: string): Promise<void>;

  // ETA Notifications
  sendETAUpdate(eventId: string, hostId: string, etaStatus: ETAStatus): Promise<void>;

  // Cancellation Notifications
  notifyCancellation(eventId: string, participantIds: string[], reason?: string): Promise<void>;
}

// Backend API Endpoints (existing backend)
interface EventAPIEndpoints {
  // Event Management
  'POST /api/v1/events': (body: CreateEventRequest) => Event;
  'GET /api/v1/events/:id': () => EventDetailView;
  'PUT /api/v1/events/:id': (body: Partial<CreateEventRequest>) => Event;
  'DELETE /api/v1/events/:id': () => void;

  // Event Discovery
  'GET /api/v1/events': (query: EventFilterRequest) => EventSearchResult;
  'GET /api/v1/events/nearby': (query: { lat: number; lng: number; radius: number }) => Event[];
  'GET /api/v1/events/my-events': () => Event[];
  'GET /api/v1/events/my-rsvps': () => Event[];

  // RSVP Operations
  'POST /api/v1/events/:id/rsvp': (body: RSVPRequest) => RSVP;
  'DELETE /api/v1/events/:id/rsvp': (body: { reason?: string }) => void;
  'GET /api/v1/events/:id/rsvp': () => RSVP;

  // Check-In Operations
  'POST /api/v1/events/:id/check-in': (body: CheckInRequest) => CheckInResponse;
  'GET /api/v1/events/:id/qr-code': () => { qrCode: string };
  'POST /api/v1/events/validate-qr': (body: { token: string }) => {
    valid: boolean;
    eventId?: string;
  };

  // Host Operations
  'GET /api/v1/events/:id/participants': () => EventParticipant[];
  'POST /api/v1/events/:id/manual-check-in': (body: { userId: string }) => CheckInResponse;
  'PUT /api/v1/events/:id/eta': (body: ETAUpdateRequest) => void;

  // Private Events
  'POST /api/v1/events/:id/invite-link': () => { inviteLink: string; token: string };
  'POST /api/v1/events/validate-invite': (body: { token: string }) => {
    valid: boolean;
    eventId?: string;
  };

  // Payment Operations
  'POST /api/v1/payments/authorize': (body: { amount: number; paymentMethodId: string }) => {
    authorizationId: string;
  };
  'POST /api/v1/payments/refund': (body: { authorizationId: string }) => void;
}
```

### Workflows and Sequencing

**1. Host Creates Event Flow:**

```text
User Action → Input Validation → Location Geocoding → API Call → QR Generation → Navigation
1. Host taps "Create Event" button
2. Form displays: title, description, sport selector, location (with map picker)
3. Date/time picker, capacity input, deposit amount selector ($0/$5/$10)
4. Visibility toggle (public/private)
5. Validate all inputs (future date, capacity > 0, valid location)
6. Geocode address to coordinates if not using map picker
7. Call eventService.createEvent() with validated data
8. Backend generates event ID and QR code token
9. Store event locally, cache QR code
10. Navigate to event detail screen showing QR code for check-ins
```

**2. User Discovers and RSVPs to Event Flow:**

```text
Browse → Filter → Select → Deposit Flow → Confirmation
1. User opens Events tab, sees list of nearby events
2. Apply filters: sport, date range, distance radius, deposit amount
3. Toggle between list view and map view
4. Tap event card to view details
5. Event detail shows: full description, location map, participant list, host info
6. User taps "RSVP" button
7. If deposit required: Stripe payment sheet appears
8. User selects/adds payment method (authorization only, not charged)
9. Call eventService.createRSVP() with payment method ID
10. Backend authorizes deposit with Stripe, stores authorization ID
11. Show RSVP confirmation with QR code instructions
12. Schedule reminder notifications (24h, 1h before event)
13. Update event participant count in UI
```

**3. QR Code Check-In Flow (Happy Path):**

```text
Arrival → QR Scan → Backend Validation → Refund → Success Celebration
1. User arrives at venue, opens app
2. Taps "Check In" from event detail or notification quick action
3. Camera opens with QR scanner overlay and targeting guides
4. User scans host's QR code displayed on their device
5. Validate QR token locally (format check)
6. Call eventService.checkIn() with scanned token
7. Backend validates: correct event, RSVP exists, not already checked in
8. Backend triggers deposit refund if applicable
9. Backend updates RSVP status to 'checked-in'
10. Client shows success animation with confetti
11. Display check-in confirmation: "✓ Checked in! Deposit refunded."
12. Update participant list showing user as checked in
13. [Epic 3 placeholder: Award XP, update streak]
```

**4. Manual Check-In Fallback Flow:**

```text
QR Failure → Host Action → Backend Validation → Success
1. QR scan fails (poor lighting, camera issue, network error)
2. User taps "Request Manual Check-In" button
3. Notification sent to host: "User X needs manual check-in"
4. Host opens their event dashboard, sees pending check-in request
5. Host verifies user is present, taps "Confirm Check-In"
6. Call eventService.manualCheckIn() with userId
7. Backend logs check-in method as 'manual' with host audit trail
8. Backend triggers deposit refund
9. Both user and host receive confirmation
10. User's app updates to show checked-in status
```

**5. Late Arrival ETA Quick-Reply Flow:**

```text
Pre-Event Reminder → Late Notification → Quick Reply → Host Update
1. User receives 1-hour reminder notification
2. User realizes they'll be 10 minutes late
3. Tap notification to open quick-reply options
4. Select "Running 10 minutes late" from preset options (5/10/15 min)
5. Call eventService.updateETAStatus() with selected delay
6. Backend updates participant ETA status
7. Host's dashboard shows real-time ETA updates: "User X: +10 min"
8. Other participants notified via push: "Event starting soon, check-in open"
9. Host can delay start or proceed based on ETA information
```

**6. Event Cancellation Flow (Before Cut-Off):**

```text
User Decision → Impact Preview → Confirmation → Notifications → Refund
1. User navigates to event detail screen
2. Taps "Cancel RSVP" button
3. System checks cancellation window (e.g., 4+ hours before event)
4. Display reliability impact preview: "No penalty, within cancellation window"
5. User selects optional cancellation reason
6. Call eventService.cancelRSVP() with reason
7. Backend cancels RSVP, voids deposit authorization
8. Backend notifies host and other participants of cancellation
9. Show confirmation: "RSVP cancelled. Deposit not charged."
10. Update event capacity display (+1 available spot)
```

**7. Private Event Invite Flow:**

```text
Host Generation → Share Link → Recipient Access → RSVP
1. Host creates event with visibility='private'
2. Host taps "Generate Invite Link" from event detail
3. Call eventService.generateInviteLink()
4. Backend creates unique invite token, returns shareable link
5. Host shares link via messaging apps, email, etc.
6. Recipient taps link, app opens (or web browser for non-users)
7. Call eventService.validateInviteToken() to verify access
8. If valid, show event detail screen with RSVP option
9. Standard RSVP flow proceeds from there
10. Event remains hidden from public browse
```

**8. Host Event Management Dashboard Flow:**

```text
Dashboard View → Participant Tracking → Real-Time Updates → Actions
1. Host navigates to "My Events" section
2. List shows upcoming and past events with summary stats
3. Tap event to open host dashboard
4. Dashboard displays:
   - RSVP list with participant reliability scores
   - Check-in status (real-time updates)
   - ETA statuses for participants running late
   - QR code for check-ins
   - Manual check-in controls
5. Host can:
   - View participant details
   - Manually check in participants
   - Send event updates/messages
   - Cancel event (with participant notifications)
6. Real-time WebSocket/polling updates participant statuses
7. Post-event: View attendance summary, reliability confirmations
```

## Non-Functional Requirements

### Performance

- **Event List Load Time:** p95 <1200ms for initial event list display with 50 concurrent events (NFR001 target)
- **Event Search/Filter:** Response time <800ms for filter updates, <1500ms for map view rendering
- **RSVP Flow Completion:** End-to-end RSVP with deposit authorization <3s from button tap to confirmation
- **QR Code Scanning:** QR detection and validation <500ms, total check-in flow <2s including backend round-trip
- **Map Rendering:** Event map with 100+ pins loads in <2s, smooth 60fps panning and zooming
- **Real-Time Updates:** Host dashboard receives participant status updates within 2s of state change (WebSocket/polling)
- **Deposit Refund Latency:** Stripe refund processing <60s per NFR024, user notified immediately
- **Offline Event Cache:** Cached event list displays in <300ms when offline, no network delay for browsing
- **Image Loading:** Event images (if added) load progressively, thumbnails <500KB, lazy-loaded below fold
- **Background Sync:** Event data syncs in background every 5 minutes when app active, doesn't block UI
- **Memory Usage:** Event browsing and RSVP flows maintain <200MB memory footprint on baseline devices
- **Bundle Size Impact:** Event feature modules add <5MB to mobile app bundle with code splitting

### Security

- **Payment Data Handling:** Stripe SDK handles all payment data client-side, no card details touch app servers (PCI compliance)
- **Deposit Authorization:** Stripe authorization-only flow, no charges without explicit check-in trigger
- **QR Code Security:** Time-limited tokens (valid 24h), single-use check-in validation, tampering detection
- **Private Event Access:** Cryptographically secure invite tokens, validation on every access, token revocation support
- **Location Privacy:** User location shared only when explicitly browsing events, not persistent background tracking
- **Participant Data:** RSVP lists show only public profile data, reliability scores follow user privacy settings
- **API Security:** All event operations require valid JWT authentication, rate limiting prevents abuse
- **Host Verification:** Manual check-ins audit-logged with host ID and timestamp for accountability
- **Input Validation:** Client-side validation for all forms, server-side validation for all API calls
- **HTTPS Enforcement:** All event API communication over HTTPS with certificate pinning in production
- **Session Security:** Event RSVP state tied to authenticated session, cleared on logout
- **Refund Security:** Deposit refunds require confirmed check-in, idempotency keys prevent double-refunds

### Reliability/Availability

- **Offline Event Browsing:** Cached events viewable offline for up to 7 days, clear indicators for stale data
- **Network Resilience:** Automatic retry with exponential backoff (3 attempts) for failed API calls
- **Check-In Fallback:** Manual check-in system ensures attendance recorded even if QR scanning fails
- **Graceful Degradation:** App functions without real-time updates, shows last known state with offline banner
- **Error Recovery:** Failed RSVP/check-in operations queued for automatic retry when connectivity restored
- **State Persistence:** Event browsing state, filters, and draft RSVPs persist across app kills/restarts
- **Notification Reliability:** Event reminders delivered via Firebase FCM with 99%+ delivery rate
- **Payment Resilience:** Stripe authorization retries on transient failures, clear error messaging to users
- **Real-Time Fallback:** Host dashboard falls back to polling (15s interval) if WebSocket connection fails
- **Data Consistency:** TanStack Query ensures cached event data consistency with optimistic updates
- **QR Code Availability:** Generated QR codes cached locally, accessible offline for hosts
- **Cancellation Safety:** RSVP cancellations process even if deposit void fails, manual reconciliation support
- **Availability Target:** Event discovery and browsing maintain ≥95% uptime during peak windows (NFR002)

### Observability

- **Event Discovery Metrics:** Track event list loads, filter usage, map vs list view preference, search abandonment rate
- **RSVP Conversion Funnel:** Monitor RSVP button taps → deposit authorization → confirmation completion rates
- **Check-In Analytics:** Track QR scan success rate, manual check-in fallback frequency, average check-in time
- **Deposit Flow Tracking:** Monitor authorization success rates, refund latency p50/p95/p99, authorization void rates
- **Performance Monitoring:** Client-side timing for critical paths (event load, RSVP flow, check-in), alert on degradation
- **Error Tracking:** Structured logging for API failures, QR scan errors, payment errors with categorization and stack traces
- **User Journey Analytics:** Track complete flows from browse → RSVP → check-in with drop-off analysis
- **Instrumentation Events (FR032):** `event_created`, `event_browsed`, `event_rsvp_created`, `event_rsvp_cancelled`, `event_checked_in`, `deposit_authorized`, `deposit_refunded`, `qr_scan_success`, `qr_scan_failed`, `manual_checkin_requested`, `eta_updated`, `private_event_accessed`
- **Real-Time Monitoring:** Host dashboard active session counts, WebSocket connection stability, update latency
- **Notification Metrics:** Reminder delivery rates, notification open rates, ETA quick-reply usage, time-to-open distribution
- **Location Service Tracking:** Geocoding success rates, distance calculation errors, permission denial rates
- **A/B Test Framework:** Support for testing deposit amounts ($5 vs $10), reminder timing, RSVP UI variations
- **Crash Reporting:** Automatic crash reports with event/RSVP context for debugging, privacy-safe user data

## Dependencies and Integrations

### Core Framework Dependencies (From Epic 1)

**Mobile Platform (React Native):**

- `react-native`: ^0.82.1 - Core framework
- `react`: 19.1.1 - React library
- `@reduxjs/toolkit`: ^2.10.1 - State management (inherited)
- `@tanstack/react-query`: ^5.90.7 - Server state caching (inherited)
- `react-redux`: ^9.2.0 - Redux bindings (inherited)

**Web Platform (React + Vite):**

- `react`: 19.1.1 - React library
- `react-dom`: 19.1.1 - React DOM renderer
- `@reduxjs/toolkit`: ^2.10.1 - State management (inherited)
- `@tanstack/react-query`: ^5.90.7 - Server state caching (inherited)
- `react-router-dom`: ^7.9.5 - Client-side routing (inherited)

**Shared Library:**

- `typescript`: ^5.2.2 - Type safety
- `ky`: ^1.14.0 - HTTP client for API calls (inherited)
- `zod`: ^4.1.12 - Runtime validation (inherited)

### Epic 2 Specific Dependencies

**Mobile Event Features:**

```json
{
  "react-native-maps": "^1.7.1",
  "react-native-geolocation-service": "^5.3.1",
  "react-native-vision-camera": "^3.6.0",
  "vision-camera-code-scanner": "^0.2.0",
  "@stripe/stripe-react-native": "^0.35.0",
  "react-native-qrcode-svg": "^6.2.0",
  "@react-native-firebase/messaging": "^18.6.0",
  "react-native-push-notification": "^8.1.1"
}
```

**Web Event Features:**

```json
{
  "@googlemaps/js-api-loader": "^1.16.2",
  "@stripe/stripe-js": "^2.2.0",
  "@stripe/react-stripe-js": "^2.4.0",
  "qrcode.react": "^3.1.0",
  "html5-qrcode": "^2.3.8"
}
```

**Shared Event Logic:**

```json
{
  "date-fns": "^3.0.0",
  "geolib": "^3.3.4"
}
```

### Event-Specific Library Details

**1. Maps and Location (Mobile):**

- **react-native-maps** (^1.7.1): Native map views for event location display
  - Supports Google Maps (Android), Apple Maps (iOS)
  - Marker clustering for dense event displays
  - Custom map styles for brand consistency
- **react-native-geolocation-service** (^5.3.1): GPS location access
  - Accurate user location for distance calculation
  - Permission handling for iOS/Android
  - Background location updates for arrival detection

**2. Maps and Location (Web):**

- **@googlemaps/js-api-loader** (^1.16.2): Google Maps JavaScript API
  - Interactive event map display
  - Geocoding and place autocomplete
  - Distance matrix calculations

**3. QR Code Technology (Mobile):**

- **react-native-vision-camera** (^3.6.0): High-performance camera access
  - Fast QR code scanning with ML Kit integration
  - Low latency for check-in flow
  - Supports flashlight, zoom, focus controls
- **vision-camera-code-scanner** (^0.2.0): QR/barcode scanner plugin
  - Real-time QR detection and decoding
  - Supports multiple formats (QR, EAN, etc.)
- **react-native-qrcode-svg** (^6.2.0): QR code generation
  - Generates host QR codes for check-ins
  - Customizable size, error correction, colors

**4. QR Code Technology (Web):**

- **qrcode.react** (^3.1.0): React QR code generator
  - Server-side QR generation for host dashboards
  - SVG and canvas rendering options
- **html5-qrcode** (^2.3.8): Web camera QR scanner
  - Browser-based QR scanning for web check-ins
  - Fallback for mobile web users

**5. Payment Integration (Mobile):**

- **@stripe/stripe-react-native** (^0.35.0): Stripe SDK for React Native
  - Native payment sheet UI
  - Deposit authorization and capture
  - Payment method management
  - PCI-compliant card handling
  - Apple Pay and Google Pay support

**6. Payment Integration (Web):**

- **@stripe/stripe-js** (^2.2.0): Stripe.js library
  - Stripe Elements for secure card input
  - Payment method creation and management
- **@stripe/react-stripe-js** (^2.4.0): React bindings for Stripe
  - React components for payment UI
  - Hooks for payment intent creation

**7. Push Notifications (Mobile):**

- **@react-native-firebase/messaging** (^18.6.0): Firebase Cloud Messaging
  - Event reminder delivery
  - ETA update notifications
  - Cancellation alerts
  - Quick-reply actions support (inherited from Epic 1 foundation)

**8. Geospatial Utilities (Shared):**

- **geolib** (^3.3.4): Geospatial calculations
  - Distance between coordinates (Haversine formula)
  - Radius filtering for nearby events
  - Bounding box calculations for map views

**9. Date/Time Utilities (Shared):**

- **date-fns** (^3.0.0): Date manipulation and formatting
  - Event scheduling validation
  - Timezone handling for multi-region support
  - Relative time display ("2 hours from now")
  - Date range filtering

### Backend API Integration Points

**Event Management APIs (Existing Backend):**

- `POST /api/v1/events` - Create event
- `GET /api/v1/events` - Search/browse events with filters
- `GET /api/v1/events/:id` - Get event details
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete/cancel event
- `GET /api/v1/events/nearby` - Geo-based event discovery
- `GET /api/v1/events/my-events` - Host's events
- `GET /api/v1/events/my-rsvps` - User's RSVPs

**RSVP APIs:**

- `POST /api/v1/events/:id/rsvp` - Create RSVP with deposit
- `DELETE /api/v1/events/:id/rsvp` - Cancel RSVP
- `GET /api/v1/events/:id/rsvp` - Get RSVP status

**Check-In APIs:**

- `POST /api/v1/events/:id/check-in` - QR or manual check-in
- `GET /api/v1/events/:id/qr-code` - Generate QR code
- `POST /api/v1/events/validate-qr` - Validate QR token
- `POST /api/v1/events/:id/manual-check-in` - Host manual check-in

**Host Operations APIs:**

- `GET /api/v1/events/:id/participants` - Participant list
- `PUT /api/v1/events/:id/eta` - Update ETA status

**Private Event APIs:**

- `POST /api/v1/events/:id/invite-link` - Generate invite
- `POST /api/v1/events/validate-invite` - Validate invite token

**Payment APIs (Stripe Backend Integration):**

- `POST /api/v1/payments/authorize` - Authorize deposit
- `POST /api/v1/payments/refund` - Refund deposit
- `GET /api/v1/payments/methods` - List payment methods
- `POST /api/v1/payments/methods` - Add payment method

### External Service Integrations

**1. Stripe Payment Platform:**

- **Purpose:** Deposit authorization and refund processing
- **Integration:** SDK-based client-side, backend token exchange
- **Data Flow:** Client → Stripe SDK → Payment Method → Backend → Stripe API → Authorization
- **Security:** PCI compliance via Stripe.js/SDK, no card data touches servers
- **Configuration:** Requires Stripe publishable key (client), secret key (backend)

**2. Google Maps Platform:**

- **Purpose:** Geocoding, map display, distance calculations
- **Integration:** JavaScript API (web), native maps (mobile)
- **API Keys:** Separate keys for mobile (iOS/Android) and web
- **Quotas:** Geocoding, Maps JavaScript API, Distance Matrix API
- **Cost Optimization:** Client-side caching, request batching

**3. Firebase Cloud Messaging:**

- **Purpose:** Event reminder and ETA update notifications
- **Integration:** React Native Firebase SDK, FCM REST API
- **Configuration:** Firebase project setup, APNs cert (iOS), google-services.json (Android)
- **Features:** Topic-based notifications, data payloads, background handlers (inherited from Epic 1)

**4. Apple Maps (iOS) / Google Maps (Android):**

- **Purpose:** Native map rendering on mobile
- **Integration:** react-native-maps with platform-specific providers
- **Configuration:** Google Maps API key (Android), no key needed (iOS uses Apple Maps)

### Version Constraints and Compatibility

**Platform Requirements:**

- Node.js: ≥20.0 (development environment)
- iOS: ≥13.0 (react-native-maps, vision-camera support)
- Android: API Level 21+ (Android 5.0+), Google Play Services for maps
- Web Browsers: Chrome ≥88, Safari ≥14, Firefox ≥85, Edge ≥88

**Critical Version Pairings:**

- react-native-maps requires Google Play Services 15+ on Android
- vision-camera requires iOS 12+ for camera permissions, 13+ for ML Kit
- Stripe React Native SDK requires iOS 13+, Android 5.0+
- Firebase Messaging requires Google Play Services on Android

**Dependency Conflicts to Monitor:**

- react-native-maps and react-native-vision-camera both use native camera/location permissions (coordinate permission requests)
- Stripe SDK and Firebase can conflict on iOS build (exclude duplicate frameworks)
- date-fns and React Native's built-in Date handling (use date-fns consistently)

### Development Environment Setup

**Required API Keys and Configuration:**

1. **Stripe:** Publishable key (pk*test*...) for development, live key for production
2. **Google Maps:** API key with Geocoding, Maps JavaScript, Distance Matrix APIs enabled
3. **Firebase:** google-services.json (Android), GoogleService-Info.plist (iOS)
4. **Apple Developer:** Maps entitlement (iOS), location permissions in Info.plist
5. **Android:** Google Maps API key in AndroidManifest.xml

**Environment Variables:**

```bash
# Mobile .env
STRIPE_PUBLISHABLE_KEY=pk_test_...
GOOGLE_MAPS_API_KEY_ANDROID=...
FIREBASE_PROJECT_ID=...

# Web .env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GOOGLE_MAPS_API_KEY=...
```

**Native Build Configuration:**

- iOS: Info.plist location permissions, camera permissions for QR scanning
- Android: AndroidManifest.xml permissions (location, camera), Google Play Services dependency
- Xcode: Enable Maps capability, sign with team provisioning profile
- Android Studio: Add google-services.json, sync Gradle dependencies

## Acceptance Criteria (Authoritative)

### AC1: Host Event Creation System

1. Event creation form accessible from host-designated user accounts
2. Form inputs: title (required), description (required, max 500 chars), sport selector (pickleball default)
3. Location input with map picker or address autocomplete, geocoding to coordinates
4. Date/time picker with validation (future dates only, reasonable time range)
5. Capacity input (1-100 participants) with validation
6. Deposit amount selector: $0, $5, or $10 (radio buttons or dropdown)
7. Visibility toggle: public (default) or private
8. Client-side validation prevents submission with invalid data
9. Successful creation calls `eventService.createEvent()`, returns event with QR code
10. Navigate to event detail screen showing created event and QR code for check-ins
11. Error handling displays user-friendly messages for API failures or validation errors
12. Event creation works on both mobile and web platforms

### AC2: Event Discovery and Browsing System

1. Events tab displays list of nearby public events sorted by date
2. Toggle between list view and map view with smooth transition
3. Filter panel with: sport selector, date range picker, distance radius slider (5-50 miles)
4. Additional filters: deposit amount range, capacity available only
5. Apply filters updates event list in real-time (<800ms)
6. Event cards show: title, sport icon, time/date, location, participants (X/Y), deposit badge
7. Map view displays event markers, tap marker shows event card preview
8. Distance from user location displayed on each event card (requires location permission)
9. Pull-to-refresh updates event list from backend
10. Infinite scroll or pagination for large event lists
11. Empty state messaging when no events match filters
12. Offline mode displays cached events with staleness indicator

### AC3: RSVP Flow with Stripe Deposit Authorization

1. Event detail screen displays full event information with RSVP button
2. Participant list shows current attendees with avatars and count
3. RSVP button disabled if event at capacity or user already RSVP'd
4. Tap RSVP button triggers deposit flow if depositAmount > 0
5. For free events (depositAmount = 0), RSVP completes immediately without payment
6. For paid events, Stripe payment sheet opens with existing payment methods
7. User can select existing payment method or add new card
8. Payment authorization occurs (no charge), stores authorization ID
9. RSVP confirmation screen shows: event details, deposit amount (authorized, refundable), QR check-in instructions
10. Backend schedules reminder notifications (24h, 1h before event)
11. User's RSVP status updates in UI, participant count increments
12. Error handling for payment failures, network issues, capacity races
13. RSVP status persists across app restarts

### AC4: QR Code Check-In System

1. Check-in button appears on event detail for user's RSVP'd events
2. Tap check-in opens camera with QR scanner overlay and targeting guides
3. Camera permissions requested on first use, graceful handling of denied permissions
4. Scanner detects host's QR code displayed on their device
5. QR validation occurs client-side (format check) before API call
6. API call to `eventService.checkIn()` with scanned token
7. Backend validates: correct event, active RSVP, not already checked in
8. Success triggers deposit refund (if applicable) within 60s
9. Success animation displays: confetti effect, "✓ Checked in!" message
10. Display confirmation: deposit refunded amount, XP awarded (placeholder Epic 3)
11. Participant list updates showing user as checked in with timestamp
12. Check-in status persists, prevents duplicate check-ins
13. Clear error messaging for invalid QR codes, wrong event, network failures

### AC5: Manual Check-In Fallback System

1. "Request Manual Check-In" button available if QR scan fails
2. Tap button sends notification to event host
3. Host receives push notification: "User X needs manual check-in for Event Y"
4. Host opens event dashboard, sees pending check-in request with user info
5. Host taps "Confirm Check-In" after verifying user presence
6. API call to `eventService.manualCheckIn()` with userId
7. Backend logs check-in method as 'manual' with host ID and timestamp audit trail
8. Deposit refund triggered same as QR check-in
9. Both user and host receive confirmation notifications
10. User's app updates to checked-in status with indication of manual method
11. Manual check-ins tracked separately in analytics for monitoring abuse

### AC6: Event Reminder Notification System

1. Backend schedules reminders automatically on RSVP confirmation
2. 24-hour reminder sent with event details, location, participants count
3. 1-hour reminder sent with check-in instructions, QR code access shortcut
4. Notifications include deep links to event detail screen
5. Reminder notifications include quick actions: "View Event", "Cancel RSVP"
6. User can configure reminder preferences (inherited from Epic 1 notification foundation)
7. Reminders not sent for cancelled RSVPs
8. Reminders delivered via Firebase Cloud Messaging with 99%+ delivery rate
9. Notification tap opens app to event detail screen

### AC7: Cancellation Workflow with Reliability Impact

1. "Cancel RSVP" button available on event detail screen for confirmed RSVPs
2. Tap button checks cancellation window (e.g., 4 hours before event)
3. If within window: display "No penalty" message
4. If outside window: display reliability impact preview percentage
5. Cancellation reason selection optional (emergency, illness, conflict, other)
6. Confirmation dialog with impact summary before finalizing
7. API call to `eventService.cancelRSVP()` with reason
8. Backend voids deposit authorization (no charge occurs)
9. Backend updates reliability score based on timing and frequency
10. Notification sent to host about cancellation with participant count update
11. Confirmation screen: "RSVP cancelled. Deposit not charged."
12. Event capacity increments, participant list updates
13. User's RSVP list updates to reflect cancellation

### AC8: ETA Quick-Reply System for Late Attendees

1. 1-hour reminder notification includes quick-reply actions
2. Quick-reply options: "On time", "5 min late", "10 min late", "15 min late", "Can't make it"
3. Tap quick-reply option sends ETA update without opening app
4. API call to `eventService.updateETAStatus()` with selected delay
5. Host dashboard updates in real-time showing participant ETA statuses
6. Host sees: "User X: +10 min" next to participant name
7. Color coding: green (on-time), yellow (running late), red (can't make it)
8. "Can't make it" selection triggers cancellation flow with penalty
9. ETA updates visible to other participants (optional based on settings)
10. Multiple ETA updates allowed, shows latest status
11. ETA status clears after event start time + 30 minutes

### AC9: Private Event Invite System

1. Event creation form includes visibility toggle: public/private
2. Private events have "Generate Invite Link" button on event detail
3. Tap button calls `eventService.generateInviteLink()`, returns shareable URL
4. Copy link to clipboard with confirmation toast
5. Share link via native share sheet (messaging apps, email, etc.)
6. Recipient taps link, app opens (deep link) or web fallback for non-users
7. API validates invite token, displays event detail if valid
8. Private events excluded from public browse and map views
9. Invite token has expiration (e.g., 7 days) for security
10. Host can regenerate invite link, invalidating previous tokens
11. Invite link includes event ID and cryptographic token for validation

### AC10: Host Event Management Dashboard

1. "My Events" section accessible to host-designated users
2. List displays upcoming and past events with summary stats
3. Event cards show: title, date, RSVP count/capacity, check-in count
4. Tap event opens host dashboard with detailed management view
5. Dashboard displays: RSVP participant list with reliability scores
6. Real-time check-in status indicators (checked in, not checked in, late)
7. ETA status column showing late attendees with estimated arrival times
8. Large QR code display for check-ins, tap to enlarge full-screen
9. Manual check-in controls: search participants, tap name to check in
10. "Send Update" button to notify all participants with custom message
11. "Cancel Event" button with confirmation dialog, notifies all participants
12. Post-event summary: final attendance count, no-show list, reliability confirmations
13. Dashboard auto-refreshes or uses WebSocket for real-time updates (2s latency)

### AC11: Geo-Location Integration and Distance Filtering

1. App requests location permission on first event browse
2. User location used for distance calculation and sorting (nearest first)
3. Distance displayed on event cards in miles (e.g., "1.2 mi away")
4. Distance radius filter slider: 5, 10, 25, 50 miles options
5. Map view centers on user location with radius circle overlay
6. Location permission denial allows manual location entry (zip code)
7. Geocoding converts addresses to coordinates for distance calculation
8. Location services work on both mobile (native GPS) and web (browser geolocation)
9. Location data not stored persistently, used only for active session
10. Offline mode uses last known location for cached event distances

### AC12: Real-Time Event Capacity and Status Updates

1. Event participant count updates in real-time as RSVPs occur
2. Event cards show "FULL" badge when capacity reached
3. Event detail page disables RSVP button for full events
4. Optimistic UI updates: RSVP reflects immediately, rolls back on failure
5. TanStack Query cache invalidation triggers refresh on state changes
6. Host dashboard shows live participant status changes (RSVP, check-in, ETA)
7. WebSocket connection (preferred) or polling (15s fallback) for real-time updates
8. Offline mode prevents RSVP/check-in, displays clear messaging
9. Event status transitions: upcoming → ongoing (at start time) → completed (24h after end)
10. Cancelled events clearly marked, RSVPs prevented, refunds processed

## Traceability Mapping

| Acceptance Criteria         | Spec Section                      | Component/API                                           | Test Strategy                                                                   |
| --------------------------- | --------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **AC1: Event Creation**     | EventService, CreateEventScreen   | `POST /api/v1/events`, EventForm                        | Unit: form validation, Integration: API flow, E2E: complete creation            |
| **AC2: Event Discovery**    | EventService, EventList, MapView  | `GET /api/v1/events`, `GET /api/v1/events/nearby`       | Unit: filter logic, Integration: search API, E2E: browse and filter             |
| **AC3: RSVP with Deposit**  | PaymentService, RSVPFlow          | `POST /api/v1/events/:id/rsvp`, Stripe SDK              | Unit: payment flow, Integration: Stripe authorization, E2E: complete RSVP       |
| **AC4: QR Check-In**        | QRService, CheckInFlow            | `POST /api/v1/events/:id/check-in`, vision-camera       | Unit: QR validation, Integration: check-in API, E2E: scan to success            |
| **AC5: Manual Check-In**    | EventService, HostDashboard       | `POST /api/v1/events/:id/manual-check-in`               | Unit: request flow, Integration: notification + API, E2E: host confirms         |
| **AC6: Reminders**          | NotificationService               | Firebase FCM, reminder scheduling                       | Unit: scheduling logic, Integration: FCM delivery, E2E: receive notification    |
| **AC7: Cancellation**       | EventService, CancellationFlow    | `DELETE /api/v1/events/:id/rsvp`                        | Unit: window calculation, Integration: reliability update, E2E: cancel RSVP     |
| **AC8: ETA Quick-Reply**    | NotificationService, EventService | `PUT /api/v1/events/:id/eta`, FCM quick actions         | Unit: ETA update, Integration: dashboard sync, E2E: quick-reply flow            |
| **AC9: Private Events**     | EventService, InviteFlow          | `POST /api/v1/events/:id/invite-link`, token validation | Unit: token generation, Integration: deep linking, E2E: share and access        |
| **AC10: Host Dashboard**    | HostDashboard, EventService       | `GET /api/v1/events/:id/participants`, WebSocket        | Unit: dashboard rendering, Integration: real-time updates, E2E: host management |
| **AC11: Geo-Location**      | LocationService, MapView          | react-native-maps, geolib distance                      | Unit: distance calc, Integration: geocoding, E2E: location-based browse         |
| **AC12: Real-Time Updates** | EventStore, TanStack Query        | WebSocket/polling, cache invalidation                   | Unit: state updates, Integration: connection stability, E2E: multi-user sync    |

### Functional Requirements Mapping

| FR#           | Description                                                         | Epic 2 Component            | Acceptance Criteria      | Implementation Status |
| ------------- | ------------------------------------------------------------------- | --------------------------- | ------------------------ | --------------------- |
| **FR005**     | Create event (title, location, date, capacity, deposit, visibility) | Event creation system       | ✅ AC1                   | Complete spec         |
| **FR006**     | Browse events (list + map, filters)                                 | Event discovery system      | ✅ AC2, AC11             | Complete spec         |
| **FR007**     | RSVP flow with deposit authorization                                | RSVP system with Stripe     | ✅ AC3                   | Complete spec         |
| **FR008**     | QR code check-in (generation + scanning)                            | QR check-in system          | ✅ AC4                   | Complete spec         |
| **FR009**     | Manual check-in fallback with audit                                 | Manual check-in system      | ✅ AC5                   | Complete spec         |
| **FR011**     | Attendance reminders (48h, 4h, 1h)                                  | Notification system         | ✅ AC6                   | 24h/1h implemented    |
| **FR012**     | Cancellation workflow with cut-off                                  | Cancellation system         | ✅ AC7                   | Complete spec         |
| **FR024**     | Deposit refund automation (<60s)                                    | Payment service integration | ✅ AC4 (NFR Performance) | Complete spec         |
| **FR025**     | Private events with invite links                                    | Private event system        | ✅ AC9                   | Complete spec         |
| **FR026**     | Host dashboard with RSVP/attendance                                 | Host management system      | ✅ AC10                  | Complete spec         |
| **FR034**     | QR scan failure fallback                                            | Manual check-in fallback    | ✅ AC5                   | Complete spec         |
| **FR035**     | At-risk streak notification                                         | ⏸️ Epic 3 dependency        | ⏸️ Deferred              | Epic 3 integration    |
| **Journey 2** | ETA quick-reply for late check-in                                   | ETA notification system     | ✅ AC8                   | Complete spec         |

### Non-Functional Requirements Coverage

| NFR#       | Requirement                        | Epic 2 Implementation                        | Validation Method                         |
| ---------- | ---------------------------------- | -------------------------------------------- | ----------------------------------------- |
| **NFR001** | Event list p95 <1200ms             | TanStack Query caching, optimized queries    | Performance testing, monitoring           |
| **NFR002** | ≥95% uptime during peak hours      | Offline caching, graceful degradation        | Availability monitoring, uptime tracking  |
| **NFR003** | Support 5K MAU, 500 events/month   | Efficient state management, pagination       | Load testing, scalability testing         |
| **NFR004** | Stripe PCI compliance, HTTPS       | Stripe SDK handles card data, HTTPS enforced | Security audit, penetration testing       |
| **NFR005** | Deposit refund idempotency         | Idempotency keys on refund API calls         | Integration testing, duplicate prevention |
| **NFR006** | Structured logging and metrics     | FR032 instrumentation events                 | Analytics dashboard, error tracking       |
| **NFR009** | Rate limiting and abuse prevention | Client-side limits, backend enforcement      | Abuse testing, rate limit monitoring      |

### User Journey Coverage

| Journey                               | Epic 2 Coverage | Key Flows                                                                                  | Gaps/Dependencies                                 |
| ------------------------------------- | --------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| **Journey 1: New Player First Event** | Partial         | Event discovery (AC2), RSVP (AC3), check-in (AC4)                                          | XP/streak (Epic 3), kudos (Epic 4)                |
| **Journey 2: Host Creates Event**     | Complete        | Event creation (AC1), dashboard (AC10), ETA handling (AC8), check-in management (AC4, AC5) | Event recap (Epic 4)                              |
| **Journey 3: Quest Completion**       | Foundation      | Event attendance, partner tracking data                                                    | Quest system (Epic 4), partner diversity (Epic 4) |

### Story-Level Traceability (Epic 2 Stories from sprint-status.yaml)

| Story                                 | Acceptance Criteria                            | Functional Requirements             | Test Coverage            |
| ------------------------------------- | ---------------------------------------------- | ----------------------------------- | ------------------------ |
| **2-1: Host Event Creation**          | AC1 (full)                                     | FR005 complete                      | Unit + Integration + E2E |
| **2-2: RSVP & Deposit**               | AC3 (full), AC9 (private events)               | FR007, FR025                        | Unit + Integration + E2E |
| **2-3: QR Check-In & Refund**         | AC4 (QR), AC5 (manual)                         | FR008, FR009, FR024, FR034          | Unit + Integration + E2E |
| **2-4: Event Browse & Geo-Filtering** | AC2 (full), AC11 (location)                    | FR006 complete                      | Unit + Integration + E2E |
| **2-5: Reminders & Cancellation**     | AC6 (reminders), AC7 (cancellation), AC8 (ETA) | FR011, FR012, Journey 2 enhancement | Unit + Integration + E2E |

**Host Dashboard Coverage Note:** AC10 spans multiple stories as dashboard features integrate with event creation (2-1), check-in (2-3), and ETA handling (2-5).

**Real-Time Updates:** AC12 provides technical foundation used across all stories for consistent state synchronization.

## Risks, Assumptions, Open Questions

### Risks

**RISK-001: Stripe Integration Complexity**

- **Risk:** Deposit authorization flow may have edge cases not covered in initial implementation
- **Impact:** High - Could result in failed deposits or refunds, damaging user trust
- **Mitigation:** Extensive testing with Stripe test mode, implement comprehensive error handling, idempotency keys for all operations
- **Owner:** Payment Integration Lead

**RISK-002: QR Scanning Reliability in Various Conditions**

- **Risk:** QR scanning may fail in poor lighting, with glare, or on certain devices
- **Impact:** Medium - Could frustrate users at venue, increase manual check-in load on hosts
- **Mitigation:** Optimize scanner settings, provide clear lighting guidance, robust manual fallback system (AC5)
- **Owner:** Mobile Developer

**RISK-003: Real-Time Update Scalability**

- **Risk:** WebSocket connections or polling may not scale to 500 concurrent events with multiple participants
- **Impact:** Medium - Dashboard updates could lag, affecting host experience
- **Mitigation:** Implement connection pooling, fallback to polling, optimize update frequency, load testing
- **Owner:** Backend Integration Lead

**RISK-004: Location Permission Denial Impact**

- **Risk:** Users may deny location permissions, limiting event discovery effectiveness
- **Impact:** Low - Manual location entry available, but reduced UX quality
- **Mitigation:** Clear permission rationale, alternative zip code entry, cache last known location
- **Owner:** UX Lead

**RISK-005: Deposit Refund Timing and User Expectations**

- **Risk:** Stripe refund processing time may exceed user expectations despite <60s target
- **Impact:** Medium - Users may perceive delays as system failure
- **Mitigation:** Clear messaging about refund timing, immediate UI confirmation, email receipt
- **Owner:** Product Manager

**RISK-006: Network Failures During Critical Operations**

- **Risk:** Check-in or RSVP operations could fail mid-transaction due to network issues
- **Impact:** High - Could result in double charges, lost RSVPs, or attendance confusion
- **Mitigation:** Offline queue system, idempotency, retry logic, optimistic UI updates with rollback
- **Owner:** Technical Architect

**RISK-007: Map API Cost Overrun**

- **Risk:** Google Maps API usage could exceed free tier limits with 5K MAU
- **Impact:** Medium - Unexpected costs or service degradation
- **Mitigation:** Client-side caching, request batching, monitor usage, implement cost alerts
- **Owner:** DevOps Lead

**RISK-008: Cross-Platform Behavior Differences**

- **Risk:** Event features may behave differently on iOS, Android, and web
- **Impact:** Medium - Inconsistent user experience across platforms
- **Mitigation:** Comprehensive cross-platform testing, shared business logic in shared library
- **Owner:** QA Lead

### Assumptions

**ASSUMPTION-001: Backend API Stability**

- Backend Event APIs are stable, documented, and match interface definitions in this spec
- API contracts support all required operations (CRUD, RSVP, check-in, payments)
- Backend handles deposit authorization/refund with Stripe correctly
- Real-time update infrastructure (WebSocket or polling) is available

**ASSUMPTION-002: Stripe Account Configuration**

- Stripe account is properly configured for authorization-only flows
- Refund API access is enabled and tested
- Payment method management APIs work as documented
- PCI compliance requirements are met through Stripe SDK usage

**ASSUMPTION-003: Firebase Infrastructure**

- Firebase Cloud Messaging is configured for both iOS and Android
- Push notification delivery rates meet 99%+ target
- Quick-reply actions are supported on target OS versions
- Firebase project has sufficient quota for 5K MAU

**ASSUMPTION-004: Device Capabilities**

- Target devices (iPhone 11+, Pixel 5+) support required camera features for QR scanning
- GPS/location services are available on target devices
- Sufficient storage for offline event caching (estimated 50MB)
- Users have data plans sufficient for map tile downloads

**ASSUMPTION-005: User Behavior Patterns**

- Users will primarily discover events within 25-mile radius (typical metro area)
- Average event capacity is 10-15 participants
- RSVP-to-check-in conversion rate target of 85% is achievable
- Users understand deposit authorization vs. charge distinction

**ASSUMPTION-006: Network Connectivity**

- Users have network connectivity at event venues for check-in
- Typical network latency <500ms for API calls
- Occasional offline periods are acceptable with cached data
- WebSocket connections can be maintained for dashboard sessions

**ASSUMPTION-007: Third-Party Service Availability**

- Google Maps APIs maintain 99.9% uptime
- Stripe payment platform maintains 99.99% uptime
- Firebase services maintain 99.9% uptime
- Service degradation is rare and short-lived

**ASSUMPTION-008: Development Environment**

- Team has access to necessary API keys and test accounts
- iOS and Android development certificates are available
- CI/CD infrastructure supports React Native builds
- Testing devices/simulators cover target platforms

### Open Questions

**QUESTION-001: Deposit Amount Optimization** ✅ RESOLVED

- **Question:** Should deposit amounts be A/B tested ($5 vs $10) to find optimal commitment level?
- **Decision:** Start with configurable amounts ($0/$5/$10) as specified in PRD
- **Rationale:** Test framework prepared (AC in observability), business decision deferred to post-MVP data
- **Next Steps:** Implement A/B test infrastructure, defer experiments until baseline data collected

**QUESTION-002: Reminder Notification Timing** ✅ RESOLVED

- **Question:** Are 24h and 1h reminders optimal, or should we add additional intervals?
- **Decision:** Implement 24h and 1h as specified, make timing configurable via backend
- **Rationale:** PRD specifies these intervals, can adjust based on user feedback without client changes
- **Next Steps:** Implement with configurable backend timing, monitor notification open rates

**QUESTION-003: ETA Quick-Reply Options** ✅ RESOLVED

- **Question:** Should we support custom ETA messages or only preset options (5/10/15 min)?
- **Decision:** Preset options only for MVP (5/10/15 min late, can't make it)
- **Rationale:** Reduces complexity, covers 90% of cases, prevents abuse/spam
- **Next Steps:** Monitor usage patterns, consider custom messages in future iteration if needed

**QUESTION-004: Manual Check-In Abuse Prevention** ⚠️ NEEDS DECISION

- **Question:** How do we prevent hosts from checking in users who aren't present to boost attendance stats?
- **Options:**
  1. Trust-based system with post-event reporting (simplest)
  2. Require participant confirmation via push notification (adds friction)
  3. Audit logging with anomaly detection (deferred to Epic 8)
  4. Time-based validation (check-in only during event window ±30 min)
- **Recommendation:** Option 4 (time-based) + Option 3 (audit logging foundation)
- **Next Steps:** Implement time window validation, basic audit logging, defer anomaly detection to Epic 8

**QUESTION-005: Private Event Invite Expiration** ✅ RESOLVED

- **Question:** How long should private event invite tokens remain valid?
- **Decision:** Tokens valid until event end time + 7 days
- **Rationale:** Allows late invites close to event, expires after event completes
- **Next Steps:** Implement token expiration, include expiry in validation response

**QUESTION-006: Map View Performance with Large Event Counts** ⚠️ NEEDS MONITORING

- **Question:** How do we handle map performance when displaying 500+ events in dense metro areas?
- **Options:**
  1. Marker clustering (group nearby events)
  2. Server-side filtering by visible map bounds
  3. Lazy loading with viewport-based queries
  4. All of the above
- **Recommendation:** Option 1 (clustering) + Option 2 (server filtering) for MVP
- **Next Steps:** Implement react-native-maps clustering, add bounds parameter to event API, monitor performance

**QUESTION-007: Offline RSVP Queue Priority** ⚠️ NEEDS DECISION

- **Question:** If user makes multiple RSVPs offline, which should retry first when online?
- **Options:**
  1. FIFO (first created)
  2. Closest event start time
  3. User priority/importance
- **Recommendation:** Option 2 (closest event time) to maximize successful attendance
- **Next Steps:** Implement priority queue with event time sorting in offline sync service

**QUESTION-008: Check-In Success Rate Monitoring** ✅ RESOLVED

- **Question:** What check-in success rate warrants investigation (QR failures, network issues)?
- **Decision:** Alert on <90% QR scan success rate, <95% overall check-in success rate (QR + manual)
- **Rationale:** Manual fallback should keep overall success high, frequent QR failures indicate UX problem
- **Next Steps:** Implement analytics tracking (FR032), set up alerting thresholds, weekly review

## Test Strategy Summary

### Test Pyramid Approach

**Unit Tests (70% coverage target)**

- **Service Layer:** Mock backend APIs, test event CRUD logic, RSVP state management, check-in validation
- **Payment Integration:** Mock Stripe SDK, test authorization/refund flows, error handling
- **QR Service:** Test QR generation, token validation, scanning state machine
- **Location Service:** Mock geocoding, test distance calculations with known coordinates
- **Components:** Test EventCard rendering, form validation, filter logic, UI state management
- **State Management:** Redux event slices, RSVP store, cache invalidation logic

**Integration Tests (20% coverage)**

- **API Integration:** Test EventService against mock backend, verify request/response contracts
- **Stripe Integration:** Test deposit authorization flow with Stripe test mode
- **Firebase Integration:** Test notification scheduling, delivery confirmation
- **Map Integration:** Test geocoding accuracy, distance calculations with real coordinates
- **Real-Time Updates:** Test WebSocket connection handling, fallback to polling
- **Cross-Platform:** Verify shared services work identically on mobile and web

**End-to-End Tests (10% strategic coverage)**

- **Complete Event Lifecycle:** Create event → Browse → RSVP → Check-in → Refund
- **Host Management Flow:** Create event → View dashboard → Manual check-in → Cancel event
- **Private Event Flow:** Create private event → Generate invite → Access via link → RSVP
- **Cancellation Scenarios:** Cancel before/after cut-off, verify reliability impact
- **Error Recovery:** Network failure during RSVP, offline check-in queue, retry logic
- **Cross-Platform Consistency:** Same flows on iOS, Android, and web

### Test Implementation Framework

**Mobile Testing Stack:**

```typescript
// Jest + React Native Testing Library + Detox
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { by, device, element, expect as detoxExpect } from 'detox';

// Unit test example
describe('EventService', () => {
  it('should create RSVP with deposit authorization', async () => {
    const mockPaymentService = jest.fn().mockResolvedValue('auth_123');
    const result = await eventService.createRSVP({
      eventId: 'event_1',
      depositPaymentMethodId: 'pm_card_visa',
    });
    expect(result.depositStatus).toBe('authorized');
  });
});

// E2E test example
describe('RSVP Flow', () => {
  it('should complete RSVP with Stripe deposit', async () => {
    await element(by.id('event-card-0')).tap();
    await element(by.id('rsvp-button')).tap();
    await element(by.id('stripe-payment-button')).tap();
    await expect(element(by.text('RSVP Confirmed'))).toBeVisible();
  });
});
```

**Web Testing Stack:**

```typescript
// Jest + React Testing Library + Playwright
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from '@playwright/test';

// Integration test example
test('Event discovery with filters', async ({ page }) => {
  await page.goto('/events');
  await page.selectOption('[data-testid=sport-filter]', 'pickleball');
  await page.fill('[data-testid=distance-slider]', '10');
  await expect(page.locator('.event-card')).toHaveCount(5);
});
```

### Test Data Strategy

**Mock Event Data:**

- **Upcoming Events:** 20 test events with varied sports, locations, capacities, deposit amounts
- **Past Events:** 10 completed events for history testing
- **Test Users:** Host accounts (5), regular users (20), various reliability scores
- **Payment Methods:** Test cards from Stripe (success, failure, 3DS scenarios)
- **Location Data:** Known coordinates for major metros (SF, Seattle, NYC)

**Test Scenarios:**

- Happy path: Complete event lifecycle with all features working
- Error paths: Network failures, API errors, invalid inputs, edge cases
- Boundary conditions: Full events, expired events, permission denials
- Race conditions: Simultaneous RSVPs, capacity limits, concurrent check-ins
- Performance: Large event lists, rapid filter changes, map with 500+ events

### Mock Services Configuration

**Event Service Mock:**

```typescript
const mockEventService: IEventService = {
  searchEvents: jest.fn().mockResolvedValue({
    events: mockEvents,
    pagination: { page: 1, limit: 20, totalPages: 3, totalEvents: 50 },
  }),
  createRSVP: jest.fn().mockImplementation(req => {
    if (req.depositPaymentMethodId) {
      return Promise.resolve({
        id: 'rsvp_1',
        status: 'confirmed',
        depositStatus: 'authorized',
      });
    }
    return Promise.resolve({ id: 'rsvp_1', status: 'confirmed' });
  }),
  checkIn: jest.fn().mockResolvedValue({
    success: true,
    depositRefunded: true,
    message: 'Checked in successfully',
  }),
};
```

**Stripe Mock (Test Mode):**

- Use Stripe test publishable key: `pk_test_...`
- Test card numbers: `4242424242424242` (success), `4000000000000002` (decline)
- Mock payment sheet UI in unit tests, use real Stripe test mode in integration tests

**Firebase Mock:**

- Mock FCM token registration
- Simulate notification delivery with controlled delays
- Test quick-reply action handling without actual push notifications

### Continuous Integration Testing

**PR Validation Pipeline:**

1. **Static Analysis:** TypeScript type checking, ESLint, Prettier formatting
2. **Unit Tests:** All unit tests must pass (jest --coverage --watch=false)
3. **Integration Tests:** API integration tests with mock backend
4. **Build Verification:** Successful build for mobile (iOS + Android) and web
5. **Bundle Size Check:** Ensure Epic 2 additions stay within 5MB limit

**Pre-Merge Requirements:**

- 90% code coverage for service layer
- 80% code coverage for components
- All E2E critical paths passing (green status)
- No high/critical security vulnerabilities
- Performance benchmarks met (load time, RSVP flow timing)

**Nightly Test Suite:**

- Full E2E test suite on real devices (iOS + Android physical devices)
- Load testing: 500 concurrent events, 100 simultaneous RSVPs
- Network resilience testing: Varying latencies, packet loss scenarios
- Cross-browser testing: Chrome, Safari, Firefox, Edge on web
- Accessibility audit: WCAG 2.1 AA compliance verification

### Performance Testing Strategy

**Load Testing Scenarios:**

1. **Event Discovery:** 1000 users browsing events simultaneously, measure p95 load time
2. **RSVP Surge:** 50 users RSVP to same event within 10 seconds, verify capacity handling
3. **Check-In Rush:** 20 users check in within 5 minutes, measure refund processing time
4. **Map Performance:** Render 500 events on map, measure frame rate and interaction latency
5. **Dashboard Updates:** 10 hosts with 50 participants each, verify real-time update delivery

**Performance Benchmarks:**

- Event list initial load: <1200ms (p95)
- RSVP with deposit flow: <3s end-to-end
- QR check-in complete: <2s from scan to confirmation
- Deposit refund processing: <60s (Stripe + backend)
- Map rendering 500 events: <2s, 60fps pan/zoom
- Real-time dashboard update: <2s latency

### Security Testing

**Security Test Scenarios:**

1. **Payment Security:** Verify card data never touches client storage or logs
2. **QR Token Security:** Test token tampering, replay attacks, expiration
3. **Invite Token Security:** Test brute force prevention, token invalidation
4. **API Authorization:** Verify all event operations require valid JWT
5. **Location Privacy:** Confirm location data not persisted beyond session
6. **Audit Trail Integrity:** Verify manual check-in logs cannot be tampered

**Penetration Testing:**

- Manual check-in abuse attempts (fake check-ins)
- RSVP capacity race condition exploitation
- Private event access bypass attempts
- Deposit refund manipulation testing
- QR code forgery and replay attacks

### Coverage and Quality Gates

**Code Coverage Targets:**

- Event Service: ≥95% (critical business logic)
- Payment Service: ≥95% (financial operations)
- QR Service: ≥90% (reliability critical)
- Location Service: ≥85% (external dependencies)
- UI Components: ≥80% (visual regression primary)
- State Management: ≥90% (Redux slices, TanStack Query)

**Quality Metrics:**

- Zero high/critical security vulnerabilities
- All accessibility checklist items passing
- Performance benchmarks met on baseline devices
- Cross-platform E2E tests 100% passing
- API contract validation: 100% endpoint coverage
- Error handling: All error scenarios tested

**Definition of Done for Epic 2:**

- All 12 Acceptance Criteria validated with tests
- Unit test coverage ≥85% overall
- Integration tests cover all API endpoints
- E2E tests pass on iOS, Android, and web
- Performance benchmarks met in CI
- Security audit passed
- Documentation complete (API contracts, component library)
- No known high-priority bugs
- Sprint-status.yaml updated: epic-2 marked as "contexted"

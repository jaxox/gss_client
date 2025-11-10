# Story 2.1: Host Event Creation

Status: drafted

## Story

As a **host user**,
I want **to create and manage sports events with comprehensive details**,
so that **I can organize events with clear information and attract the right participants**.

## Acceptance Criteria

**AC1: Event Creation Form (Tech Spec AC1)**

1. Event creation form accessible from host-designated user accounts with clear "Create Event" button
2. Form inputs with validation:
   - Title (required, 3-100 characters)
   - Description (required, max 500 characters with counter)
   - Sport selector with pickleball as default (dropdown with icons)
   - Location input with map picker or address autocomplete
   - Date/time picker with validation (future dates only, reasonable time range)
   - Capacity input (1-100 participants) with validation
   - Deposit amount selector: $0, $5, or $10 (radio buttons or dropdown)
   - Visibility toggle: public (default) or private
3. Real-time client-side validation prevents submission with invalid data
4. Address geocoding to coordinates (LocationService) with error handling
5. Successful creation calls `eventService.createEvent()`, returns event with QR code
6. Navigate to event detail screen showing created event and QR code for check-ins
7. Error handling displays user-friendly messages for API failures or validation errors
8. Event creation works on both mobile (React Native) and web (React) platforms

**AC2: QR Code Generation**

1. QR code automatically generated on event creation with secure token
2. QR code displayed prominently on event detail screen for hosts
3. Tap/click QR code to enlarge full-screen for easier scanning
4. QR code cached locally for offline access
5. QR code includes event ID and cryptographic token for validation

**AC3: Location Integration**

1. Map picker allows hosts to select event location visually
2. Address autocomplete using Google Maps API for text-based location entry
3. Geocoding converts addresses to coordinates (latitude/longitude)
4. Location validation ensures coordinates are valid and within service area
5. Map preview displays selected location with marker
6. Venue type selection (indoor/outdoor) optional
7. Location permission requested on first use with clear rationale

**AC4: Form UX and Accessibility**

1. Form fields have clear labels and placeholder text
2. Validation errors display inline with field-specific messages
3. Loading states during geocoding and API calls with spinners
4. Form persistence: draft data saved to prevent loss on navigation
5. Clear "Cancel" option returns to previous screen with confirmation dialog
6. Accessibility: form keyboard navigable, screen reader friendly
7. Mobile: optimized keyboard types (numeric for capacity, date picker native)

**AC5: Event Management Post-Creation**

1. Created event appears in "My Events" list immediately (optimistic update)
2. Host can edit event details (title, description, time, capacity) before event starts
3. Host can cancel event with confirmation dialog and participant notifications
4. Event status indicators: Upcoming, Ongoing, Completed, Cancelled
5. Participant count updates in real-time as RSVPs occur
6. Event deletion restricted after RSVPs exist (only cancellation allowed)

## Tasks / Subtasks

**Task 1: Event Creation Service Layer (AC: 1, 2)**

- [ ] Implement `EventService.createEvent()` in `shared/services/api/events.service.ts`
  - [ ] Define `CreateEventRequest` and `CreateEventResponse` interfaces
  - [ ] API call to `POST /api/v1/events` with error handling
  - [ ] QR code token handling and storage
- [ ] Implement `LocationService.geocodeAddress()` in `shared/services/api/location.service.ts`
  - [ ] Google Maps Geocoding API integration
  - [ ] Coordinate validation and error handling
  - [ ] Location permission management
- [ ] Create mock implementations for testing
  - [ ] `MockEventService` with test event data
  - [ ] `MockLocationService` with known coordinates

**Task 2: State Management (AC: 1, 5)**

- [ ] Create `EventStore` in `mobile/src/store/events/` and `web/src/store/events/`
  - [ ] Redux slice for event creation state
  - [ ] Actions: `createEventStart`, `createEventSuccess`, `createEventFailure`
  - [ ] Selectors: `selectCreatedEvents`, `selectEventCreationStatus`
- [ ] Integrate TanStack Query for event caching
  - [ ] `useCreateEventMutation` hook
  - [ ] Cache invalidation on successful creation
  - [ ] Optimistic updates for "My Events" list

**Task 3: Mobile Event Creation UI (AC: 1, 2, 3, 4)**

- [ ] Create `CreateEventScreen` in `mobile/src/screens/events/CreateEventScreen.tsx`
  - [ ] Form layout with React Native Paper components
  - [ ] Title and description text inputs with validation
  - [ ] Sport selector dropdown (react-native-picker-select)
  - [ ] Location input with map picker integration
  - [ ] Date/time picker (DateTimePickerModal)
  - [ ] Capacity and deposit amount inputs
  - [ ] Visibility toggle (Switch component)
  - [ ] Submit and cancel buttons with loading states
- [ ] Implement `LocationPicker` component
  - [ ] react-native-maps MapView integration
  - [ ] Address autocomplete with Google Places API
  - [ ] Marker placement and drag handling
  - [ ] Location permission request flow
- [ ] Implement `QRCodeDisplay` component
  - [ ] react-native-qrcode-svg for QR generation
  - [ ] Full-screen modal on tap
  - [ ] Share QR code functionality

**Task 4: Web Event Creation UI (AC: 1, 2, 3, 4)**

- [ ] Create `CreateEventPage` in `web/src/pages/events/CreateEventPage.tsx`
  - [ ] Form layout with MUI components (TextField, Select, Button)
  - [ ] Title and description inputs with character counters
  - [ ] Sport selector dropdown (MUI Select)
  - [ ] Location input with Google Maps autocomplete
  - [ ] Date/time picker (MUI DateTimePicker)
  - [ ] Capacity and deposit amount inputs (MUI TextField)
  - [ ] Visibility toggle (MUI Switch)
  - [ ] Form submission with loading states
- [ ] Implement `MapPicker` component for web
  - [ ] @googlemaps/js-api-loader integration
  - [ ] Interactive map with marker placement
  - [ ] Address autocomplete (Google Places Autocomplete)
  - [ ] Geocoding on address selection
- [ ] Implement `QRCodeDisplay` component for web
  - [ ] qrcode.react for QR generation
  - [ ] Modal dialog for full-screen display
  - [ ] Download QR code as image option

**Task 5: Form Validation and Error Handling (AC: 1, 4)**

- [ ] Create validation schema in `shared/src/validation/eventValidation.ts`
  - [ ] Zod schema for event creation form
  - [ ] Custom validators: future date, capacity range, valid coordinates
  - [ ] Error message mapping to user-friendly text
- [ ] Implement real-time validation hooks
  - [ ] `useEventFormValidation` hook for mobile and web
  - [ ] Field-level validation on blur
  - [ ] Form-level validation on submit
- [ ] Error handling for API failures
  - [ ] Network error recovery with retry
  - [ ] Geocoding failure fallback to manual coordinates
  - [ ] User-friendly error messaging with actionable guidance

**Task 6: Event Management Features (AC: 5)**

- [ ] Implement event editing functionality
  - [ ] `EditEventScreen`/`EditEventPage` (reuse creation components)
  - [ ] API call to `PUT /api/v1/events/:id`
  - [ ] Validation: only allow edits before event starts
- [ ] Implement event cancellation flow
  - [ ] Confirmation dialog with impact warning
  - [ ] API call to `DELETE /api/v1/events/:id`
  - [ ] Participant notification handling
- [ ] Create "My Events" list view
  - [ ] API call to `GET /api/v1/events/my-events`
  - [ ] Event cards with status indicators
  - [ ] Real-time participant count updates
  - [ ] Filter by status: Upcoming, Ongoing, Completed

**Task 7: Testing (AC: All)**

- [ ] Unit tests for EventService and LocationService
  - [ ] Test `createEvent` with valid/invalid data
  - [ ] Test geocoding success and failure scenarios
  - [ ] Test QR code generation
- [ ] Unit tests for state management
  - [ ] Test Redux actions and reducers
  - [ ] Test TanStack Query mutations and cache updates
- [ ] Component tests for creation forms
  - [ ] Test form rendering and validation
  - [ ] Test location picker interaction
  - [ ] Test QR code display
- [ ] Integration tests for complete creation flow
  - [ ] Test mobile creation end-to-end
  - [ ] Test web creation end-to-end
  - [ ] Test error recovery scenarios
- [ ] E2E tests with Detox (mobile) and Playwright (web)
  - [ ] Test complete event creation flow
  - [ ] Test edit and cancellation flows
  - [ ] Test cross-platform consistency

## Dev Notes

**Implementation Priority:** This is the first Epic 2 story and establishes the foundation for all event-related features. Event creation must be fully functional before implementing RSVP and check-in features.

**Architecture Alignment:**

- Implements Tech Spec AC1 (Host Event Creation System) completely
- Aligns with architecture EventService, LocationService, EventStore modules
- Uses React Native Paper (mobile) and MUI (web) for consistent design
- Follows Trust & Reliability color theme (#3B82F6 primary blue)

**Key Dependencies:**

- Epic 1 authentication foundation (JWT tokens, user session)
- Google Maps Platform API keys configured (geocoding, maps, places)
- Backend Event APIs available: `POST /api/v1/events`, `PUT /api/v1/events/:id`, `DELETE /api/v1/events/:id`, `GET /api/v1/events/my-events`
- Stripe configuration for deposit amounts (validates against backend limits)
- Firebase Cloud Messaging setup for event notifications

**Technical Considerations:**

1. **Location Services:**
   - Mobile: react-native-maps (^1.7.1) for native maps, react-native-geolocation-service (^5.3.1) for GPS
   - Web: @googlemaps/js-api-loader (^1.16.2) for Google Maps JavaScript API
   - Shared: geolib (^3.3.4) for distance calculations

2. **QR Code Generation:**
   - Mobile: react-native-qrcode-svg (^6.2.0) for vector QR codes
   - Web: qrcode.react (^3.1.0) for React QR component
   - QR token format: `gss://event/{eventId}/checkin/{token}` with HMAC signature

3. **Form State Management:**
   - Use React Hook Form for form state and validation (mobile and web)
   - Persist draft data to AsyncStorage (mobile) / localStorage (web)
   - Clear draft on successful submission or explicit cancel

4. **Performance Targets:**
   - Form renders in <300ms on baseline devices
   - Geocoding completes in <1s for US addresses
   - Event creation API call completes in <2s
   - QR code generation instantaneous (<100ms)

5. **Offline Behavior:**
   - Event creation requires online connectivity (payment validation)
   - Show clear offline indicator if network unavailable
   - Draft form data persists locally for later submission

**Testing Strategy:**

- **Unit Tests (70% coverage):**
  - EventService: createEvent, updateEvent, deleteEvent, getMyEvents
  - LocationService: geocodeAddress, reverseGeocode, validateCoordinates
  - Form validation: all field validators, schema validation
  - State management: Redux actions/reducers, TanStack Query mutations

- **Integration Tests (20% coverage):**
  - Complete form submission with API mocks
  - Geocoding integration with Google Maps API
  - QR code generation and display
  - Error handling and recovery flows

- **E2E Tests (10% strategic coverage):**
  - Mobile: Create event flow with Detox (title → location → submit → success)
  - Web: Create event flow with Playwright (same scenario)
  - Cross-platform: Verify events created on mobile appear on web
  - Error scenarios: Network failure, geocoding failure, validation errors

**Security Considerations:**

- Validate all inputs client-side before API submission
- Sanitize event descriptions to prevent XSS
- QR code tokens cryptographically signed (HMAC-SHA256)
- Location data not stored persistently (only in events)
- Host-only access to creation form (role-based UI control)

**UX Considerations:**

- Clear onboarding for first-time hosts (tooltip guidance)
- Location picker with current location shortcut
- Sport selector with popular sports at top
- Deposit amount presets based on sport type ($0 for casual, $5-$10 for competitive)
- Draft autosave prevents data loss on accidental navigation
- Success confirmation with clear next steps (share event, view dashboard)

### Project Structure Notes

**Shared Library:**

- `shared/services/api/events.service.ts` - EventService implementation
- `shared/services/api/location.service.ts` - LocationService implementation
- `shared/types/event.ts` - Event, CreateEventRequest, CreateEventResponse interfaces
- `shared/validation/eventValidation.ts` - Zod schemas for event forms
- `shared/constants/eventConstants.ts` - Deposit amounts, capacity limits, sport types

**Mobile:**

- `mobile/src/screens/events/CreateEventScreen.tsx` - Main creation screen
- `mobile/src/screens/events/EditEventScreen.tsx` - Edit event screen (reuse form)
- `mobile/src/screens/events/MyEventsScreen.tsx` - Host's events list
- `mobile/src/components/events/LocationPicker.tsx` - Map-based location picker
- `mobile/src/components/events/QRCodeDisplay.tsx` - QR code display component
- `mobile/src/store/events/eventSlice.ts` - Redux slice for event state
- `mobile/src/hooks/useCreateEvent.ts` - Custom hook for creation logic

**Web:**

- `web/src/pages/events/CreateEventPage.tsx` - Main creation page
- `web/src/pages/events/EditEventPage.tsx` - Edit event page (reuse form)
- `web/src/pages/events/MyEventsPage.tsx` - Host's events list
- `web/src/components/events/MapPicker.tsx` - Web map picker component
- `web/src/components/events/QRCodeDisplay.tsx` - Web QR display component
- `web/src/store/events/eventSlice.ts` - Redux slice (shared logic with mobile)
- `web/src/hooks/useCreateEvent.ts` - Custom hook (shared logic with mobile)

### References

- [Source: docs/tech-spec-epic-2.md#AC1: Host Event Creation System]
- [Source: docs/tech-spec-epic-2.md#Services and Modules - EventService, LocationService]
- [Source: docs/tech-spec-epic-2.md#Data Models - Event, CreateEventRequest]
- [Source: docs/tech-spec-epic-2.md#APIs and Interfaces - IEventService, ILocationService]
- [Source: docs/tech-spec-epic-2.md#Workflows - Host Creates Event Flow]
- [Source: docs/tech-spec-epic-2.md#Dependencies - react-native-maps, @googlemaps/js-api-loader, geolib]
- [Source: docs/shared/epics.md#Epic 2: Event Lifecycle & Attendance Commitment]
- [Source: docs/architecture.md#Event Discovery Components - EventCard, EventFilters]

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

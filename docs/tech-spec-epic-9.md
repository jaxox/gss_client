# Frontend Technical Specification: Private Events & Privacy Controls

**Epic 9: Private Events & Privacy Controls Enhancement**

_Generated: November 9, 2025_  
_Project: gss_client (Frontend Implementation)_  
_Version: 1.0_

---

## Overview

This technical specification defines the **frontend implementation** for Epic 9 (Private Events & Privacy Controls Enhancement), covering refined private event handling with invite link generation/access gates and user profile privacy controls. This epic strengthens user trust by enabling granular control over profile visibility (level, badges, reliability score) and secure access to private events through token-based invite links.

**Context:** This is a **frontend-only specification**. Backend APIs (invite token generation/validation, privacy settings storage, access control logic) are assumed complete and documented in backend reference docs. This document focuses exclusively on mobile and web client implementations for creating private events, sharing invite links, redeeming invites, and managing profile privacy settings.

**Key Functional Requirements:** FR025 (Private events), FR037 (Privacy defaults)

**Problem Statement:** Users need more control over social boundaries and information sharing. Without private events, users cannot host closed gatherings (friends-only games, practice sessions, private tournaments). Without privacy controls, users may feel uncomfortable with public display of gamification stats (level, reliability score) before building trust in the community. This epic addresses both needs: secure private event access and flexible profile visibility settings.

**Goals:**

- Implement private event invite link generation with shareable URLs
- Build invite token validation and access gate for private event discovery
- Create profile privacy settings UI with granular toggles (level, badges, reliability)
- Apply privacy settings to all user profile displays (profile screen, participant lists, leaderboards)
- Ensure private events excluded from public browse and search
- Track private event usage metrics and privacy setting adoption

**User-Facing Features:**

1. **Private Event Creation (Mobile + Web):** Hosts create events with visibility="private", excluded from public browse
2. **Invite Link Generation (Mobile + Web):** Hosts generate shareable invite links with secure tokens
3. **Invite Link Sharing (Mobile):** Native share sheet for distributing invite links via messaging apps, email
4. **Invite Redemption Flow (Mobile + Web):** Recipients open invite links, validate tokens, access event details
5. **Profile Privacy Settings UI (Mobile):** Toggle visibility for level, badges, reliability score
6. **Privacy-Aware Profile Display:** Profile screens respect privacy settings (show/hide based on user preferences)

**Out of Scope (Deferred to Future Epics):**

- Group-based private events (assign admin roles, manage group invites) deferred to Phase 2
- Invite link analytics (track who accessed link, conversion rates) deferred to analytics epic expansion
- Advanced privacy controls (friend-only visibility, blocked users list) deferred to social features expansion
- Bulk invite management (create multiple invite links, track individual links) deferred
- Private event discovery via search (even for invited users) - private events discoverable only via direct link

---

## Objectives and Scope

### In Scope

**Mobile (React Native):**

1. **Private Event Creation:**
   - Event creation form includes visibility toggle: Public (default) / Private
   - Private event badge displayed on event cards ("Private Event")
   - Private events excluded from public event list and map views
   - Host can switch visibility after creation (public ↔ private) with confirmation

2. **Invite Link Generation:**
   - Event detail screen shows "Share Invite" button for private events (hosts only)
   - Tap button → generate invite token → shareable link: `gss://event/invite/{token}`
   - Copy link to clipboard with success toast
   - Share button opens native share sheet (iMessage, WhatsApp, Email, etc.)
   - Invite link expires when event completes (event end time + 24h)

3. **Invite Redemption Flow:**
   - Deep link opens app to invite validation screen
   - Loading state: "Validating invite..."
   - Valid token → display event detail screen with RSVP button
   - Invalid/expired token → error screen: "Invite expired or invalid"
   - User can RSVP to private event (standard RSVP flow from Epic 2)
   - Invited users see private event in "My RSVPs" list (not in public browse)

4. **Profile Privacy Settings:**
   - Settings screen has "Privacy" section with 3 toggles:
     - "Show Level" (default: ON)
     - "Show Badges" (default: ON)
     - "Show Reliability Score" (default: OFF per FR037)
   - Toggle changes saved immediately with optimistic UI update
   - Confirmation toast: "Privacy settings updated"
   - Privacy settings persist across app restarts

5. **Privacy-Aware Profile Display:**
   - User profile screen respects privacy settings:
     - Level hidden if "Show Level" = OFF → display "Level: Hidden"
     - Badges section hidden if "Show Badges" = OFF
     - Reliability score hidden if "Show Reliability Score" = OFF → display "Reliability: Private"
   - Participant lists (event attendees) respect privacy settings
   - Leaderboards/rankings respect privacy settings (hide level if toggle OFF)

**Web (React + Vite):**

1. **Private Event Management (Host Dashboard):**
   - Host dashboard displays private events with "Private" badge
   - Event detail shows "Generate Invite Link" button
   - Copy link button with clipboard success notification
   - Invite link displayed in modal with QR code for easy sharing
   - Regenerate link button (invalidates previous token, creates new one)

2. **Invite Link Web Access:**
   - Web route: `/events/invite/:token`
   - Token validation on route load
   - Valid token → display event detail page with RSVP button
   - Invalid token → redirect to home with error notification
   - Web users can RSVP to private events (if authenticated)

3. **Privacy Settings (Web Profile Page):**
   - Profile settings page includes "Privacy" section
   - Same 3 toggles as mobile (level, badges, reliability)
   - Real-time preview: Toggle changes update profile preview
   - Save button with confirmation: "Settings saved successfully"

4. **Admin Analytics (Web):**
   - Admin dashboard shows private event metrics:
     - Total private events created (count)
     - Private event fill rate (avg participants / capacity)
     - Invite link generation rate (invites per private event)
     - Privacy setting adoption rates (% users with each toggle OFF)

### Out of Scope

- Group-based private events with member management (deferred to social features expansion)
- Invite link click tracking and analytics (deferred to analytics epic)
- Advanced privacy: friend-only visibility, blocked users (deferred)
- Bulk invite management (multiple links per event, individual tracking)
- Private event search/discovery (even for invited users - only direct link access)

---

## System Architecture Alignment

### Mobile Architecture

**Screens:**

- `CreateEventScreen` (Extended with visibility toggle)
- `EventDetailScreen` (Extended with invite link generation for private events)
- `InviteRedemptionScreen` (Validate token, display event)
- `PrivacySettingsScreen` (Profile privacy toggles)

**Services:**

- `EventService` (Extended with private event methods: generateInviteLink, validateInviteToken)
- `PrivacyService` (Save/fetch privacy settings, apply to profile displays)

**Redux Slices:**

- `events.slice.ts` (Extended with privateEventInvite state)
- `privacy.slice.ts` (Privacy settings state, toggle management)

**Components:**

- `PrivateEventBadge` (Visual indicator for private events)
- `InviteLinkModal` (Display shareable link with copy/share buttons)
- `PrivacyToggle` (Reusable toggle component for privacy settings)
- `PrivacyAwareProfile` (Profile display respecting privacy settings)

### Web Architecture

**Pages:**

- `CreateEventPage` (Extended with visibility toggle)
- `EventDetailPage` (Extended with invite link generation)
- `InviteRedemptionPage` (`/events/invite/:token`)
- `PrivacySettingsPage` (Profile privacy settings)
- `AdminPrivacyMetricsPage` (Privacy adoption analytics)

**Services:**

- `EventService` (Extended with private event methods)
- `PrivacyService` (Save/fetch privacy settings)

**Components:**

- `PrivateEventBadge` (Visual indicator)
- `InviteLinkModal` (Display link with QR code)
- `PrivacySettingsForm` (Toggles with real-time preview)
- `PrivacyMetricsCard` (Admin dashboard metrics)

---

## Detailed Design

### Services and Modules

| Service/Module                       | Responsibility                                   | Key Methods                                                                                    | Platform    |
| ------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ----------- |
| **EventService (Extended)**          | Private event invite link generation, validation | `generateInviteLink(eventId)`, `validateInviteToken(token)`, `getPrivateEvent(eventId, token)` | Mobile, Web |
| **PrivacyService**                   | Privacy settings CRUD, apply to profile displays | `getSettings(userId)`, `updateSettings(settings)`, `applyPrivacyToProfile(profile, settings)`  | Mobile, Web |
| **DeepLinkService**                  | Handle invite link deep linking (mobile)         | `handleInviteLink(url)`, `parseInviteToken(url)`                                               | Mobile      |
| **AdminAnalyticsService (Extended)** | Fetch private event and privacy metrics          | `getPrivateEventMetrics()`, `getPrivacyAdoptionMetrics()`                                      | Web         |

### Data Models and Contracts

```typescript
// Private Event Models
interface PrivateEventInvite {
  eventId: string;
  token: string;
  inviteLink: string; // Full URL: gss://event/invite/{token} or https://gss.app/events/invite/\{token\}
  createdAt: string;
  expiresAt: string; // Event end time + 24h
  createdBy: string; // Host userId
  usageCount: number; // Number of users who accessed via this link
}

interface InviteTokenValidation {
  valid: boolean;
  eventId?: string;
  event?: Event; // Full event details if valid
  error?: string; // "expired" | "invalid" | "not_found"
}

// Privacy Settings Models
interface PrivacySettings {
  userId: string;
  showLevel: boolean; // Default: true
  showBadges: boolean; // Default: true
  showReliabilityScore: boolean; // Default: false (FR037)
  updatedAt: string;
}

interface PrivacyAwareProfile {
  userId: string;
  displayName: string;
  avatar?: string;
  level?: number; // null if showLevel = false
  badges?: Badge[]; // null if showBadges = false
  reliabilityScore?: number; // null if showReliabilityScore = false
  privacySettings: PrivacySettings;
}

// Event Model Extension (from Epic 2)
interface Event {
  // ... existing fields from Epic 2
  visibility: 'public' | 'private'; // Extended for Epic 9
  inviteToken?: string; // Only for private events
  inviteLink?: string; // Only for private events
}

// Admin Metrics Models
interface PrivateEventMetrics {
  totalPrivateEvents: number;
  avgFillRate: number; // % capacity filled for private events
  inviteGenerationRate: number; // Avg invites per private event
  lastUpdated: string;
}

interface PrivacyAdoptionMetrics {
  totalUsers: number;
  showLevelDisabled: number; // Count of users with showLevel = false
  showBadgesDisabled: number;
  showReliabilityDisabled: number; // Should be high per FR037 default
  adoptionRates: {
    levelHidden: number; // % of users
    badgesHidden: number;
    reliabilityHidden: number;
  };
  lastUpdated: string;
}
```

### APIs and Interfaces

**Backend API Endpoints (Assumed Complete):**

```typescript
// Private Event APIs
POST   /api/v1/events/:id/invite-link
  Response: { inviteLink: string, token: string, expiresAt: string }

POST   /api/v1/events/validate-invite
  Body: { token: string }
  Response: InviteTokenValidation

GET    /api/v1/events/:id/private?token={token}
  Response: Event (full event details if token valid)

PUT    /api/v1/events/:id/visibility
  Body: { visibility: 'public' | 'private' }
  Response: Event

// Privacy Settings APIs
GET    /api/v1/users/:userId/privacy-settings
  Response: PrivacySettings

PUT    /api/v1/users/:userId/privacy-settings
  Body: Partial<PrivacySettings>
  Response: PrivacySettings

// Admin Analytics APIs (Extended)
GET    /api/v1/admin/metrics/private-events
  Response: PrivateEventMetrics

GET    /api/v1/admin/metrics/privacy-adoption
  Response: PrivacyAdoptionMetrics
```

**Frontend Service Interfaces:**

```typescript
// EventService (Extended)
interface IEventService {
  // Existing methods from Epic 2...

  // Private Event Methods (Epic 9)
  generateInviteLink(eventId: string): Promise<PrivateEventInvite>;
  validateInviteToken(token: string): Promise<InviteTokenValidation>;
  getPrivateEvent(eventId: string, token: string): Promise<Event>;
  updateEventVisibility(eventId: string, visibility: 'public' | 'private'): Promise<Event>;
}

// PrivacyService
interface IPrivacyService {
  getSettings(userId: string): Promise<PrivacySettings>;
  updateSettings(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings>;
  applyPrivacyToProfile(profile: User, settings: PrivacySettings): PrivacyAwareProfile;
}

// DeepLinkService (Mobile)
interface IDeepLinkService {
  handleInviteLink(url: string): Promise<{ eventId: string; token: string }>;
  parseInviteToken(url: string): { token: string } | null;
}

// AdminAnalyticsService (Extended)
interface IAdminAnalyticsService {
  // Existing methods...

  // Privacy Metrics (Epic 9)
  getPrivateEventMetrics(): Promise<PrivateEventMetrics>;
  getPrivacyAdoptionMetrics(): Promise<PrivacyAdoptionMetrics>;
}
```

### Workflows and Sequencing

**Workflow 1: Host Creates Private Event (Mobile)**

1. User taps "Create Event" button
2. Event creation form displays with all fields (title, sport, location, date/time, capacity, deposit)
3. Visibility section shows toggle: "Public" (default) / "Private"
4. User toggles to "Private" → info tooltip: "Private events are invitation-only and excluded from public search"
5. User fills form, taps "Create Event"
6. Validation passes, API call: POST /api/v1/events with visibility='private'
7. Backend creates event, generates invite token, returns event with inviteToken
8. Navigate to event detail screen
9. "Private Event" badge displayed at top
10. "Share Invite" button appears (hosts only)
11. Public browse/search excludes this event (filtered out client-side)

**Workflow 2: Invite Link Generation and Sharing (Mobile)**

1. Host opens private event detail screen
2. "Share Invite" button visible below event description
3. Tap button → API call: POST /api/v1/events/:id/invite-link
4. Backend generates/refreshes invite token, returns inviteLink: `gss://event/invite/{token}`
5. InviteLinkModal opens showing:
   - Full invite link (selectable text)
   - "Copy Link" button
   - "Share" button (native share sheet)
   - Expiration notice: "Expires 24h after event ends"
6. User taps "Copy Link" → clipboard copy → toast: "Link copied!"
7. User taps "Share" → native share sheet opens with pre-filled message: "Join my event: [event title] [invite link]"
8. User selects messaging app (iMessage, WhatsApp, Email)
9. Message sent with invite link
10. Modal closes

**Workflow 3: Invite Redemption (Mobile)**

1. Recipient receives message with invite link
2. Tap link → opens app via deep link: `gss://event/invite/{token}`
3. App navigates to InviteRedemptionScreen
4. Loading state: "Validating invite..."
5. DeepLinkService.parseInviteToken() extracts token
6. API call: POST /api/v1/events/validate-invite with token
7. Valid response: { valid: true, eventId, event: {...} }
8. Navigate to event detail screen with full event data
9. RSVP button enabled (standard RSVP flow from Epic 2)
10. User RSVPs → private event appears in "My RSVPs" list
11. Event still excluded from public browse (only accessible via invite link)

**Workflow 4: Invalid/Expired Invite Token (Mobile)**

1. User taps old/expired invite link
2. Deep link opens app, navigates to InviteRedemptionScreen
3. API call: POST /api/v1/events/validate-invite
4. Invalid response: { valid: false, error: "expired" }
5. Error screen displays: "This invite has expired or is no longer valid"
6. "Browse Events" button → navigate to public event list
7. Analytics event logged: `invite_token_invalid` with error reason

**Workflow 5: Profile Privacy Settings (Mobile)**

1. User navigates to Settings screen (from profile menu)
2. "Privacy" section displays 3 toggles:
   - "Show Level" (currently ON)
   - "Show Badges" (currently ON)
   - "Show Reliability Score" (currently OFF - default per FR037)
3. User taps "Show Level" toggle → turns OFF
4. Optimistic UI update: toggle animates to OFF
5. API call: PUT /api/v1/users/:userId/privacy-settings with { showLevel: false }
6. Success response: updated PrivacySettings
7. Toast: "Privacy settings updated"
8. Navigate back to profile screen
9. Profile now displays "Level: Hidden" instead of "Level: 15"
10. Other users viewing this profile see "Level: Hidden" as well

**Workflow 6: Privacy-Aware Profile Display (Mobile)**

1. User A views User B's profile (from participant list)
2. PrivacyService.getSettings(userB.id) fetches privacy settings
3. PrivacyService.applyPrivacyToProfile(userB, settings) applies privacy rules:
   - showLevel = false → level field null
   - showBadges = true → badges displayed
   - showReliabilityScore = false → reliability field null
4. Profile screen renders:
   - Name: "User B"
   - Level: "Hidden" (grayed out text)
   - Badges: [Badge1, Badge2, Badge3] (visible)
   - Reliability: "Private" (grayed out text with lock icon)
5. Participant lists apply same logic (leaderboards, event attendees)

**Workflow 7: Switch Event Visibility (Mobile)**

1. Host opens public event detail screen (event already created)
2. "⋮" menu button in top-right corner
3. Menu includes "Change Visibility" option
4. Tap → confirmation dialog: "Make this event private? It will no longer appear in public search."
5. Confirm → API call: PUT /api/v1/events/:id/visibility with { visibility: 'private' }
6. Success response: updated event
7. Toast: "Event is now private"
8. "Share Invite" button now appears
9. Event removed from public browse lists (client-side filter)
10. Reverse flow (private → public) similar with confirmation

**Workflow 8: Admin Privacy Metrics Dashboard (Web)**

1. Admin navigates to Admin Analytics → "Privacy Metrics" tab
2. AdminAnalyticsService.getPrivateEventMetrics() API call
3. Response: { totalPrivateEvents: 150, avgFillRate: 0.78, inviteGenerationRate: 1.2 }
4. AdminAnalyticsService.getPrivacyAdoptionMetrics() API call
5. Response: { totalUsers: 5000, showLevelDisabled: 500, showBadgesDisabled: 200, showReliabilityDisabled: 4000 }
6. Dashboard renders metrics cards:
   - Private Events Created: 150 total
   - Private Event Fill Rate: 78% avg capacity filled
   - Invite Generation Rate: 1.2 invites per private event
   - Privacy Adoption: 90% users hide reliability (expected per FR037), 10% hide level, 4% hide badges
7. Trend charts show adoption over time (30d view)
8. Export CSV button for detailed privacy analytics

---

## Non-Functional Requirements

### Performance

- **Invite Link Generation:** <1s to generate invite token and return shareable link
- **Invite Token Validation:** <500ms to validate token and return event details
- **Privacy Settings Update:** <800ms to save privacy settings, immediate optimistic UI update
- **Private Event Filtering:** Public browse excludes private events in <100ms (client-side filter)
- **Privacy-Aware Profile Rendering:** <200ms to apply privacy rules and render profile (cached settings)
- **Deep Link Handling:** <1s from link tap to invite validation screen display

### Security

- **Invite Token Security:** Cryptographically secure tokens (UUID v4 or JWT), 128-bit entropy minimum
- **Token Expiration:** Tokens expire 24h after event end time, server-side enforcement
- **Token Revocation:** Regenerating invite link invalidates previous token immediately
- **Privacy Settings Access Control:** Users can only update their own privacy settings (JWT userId check)
- **Private Event Access Control:** Private events only accessible with valid token (server-side validation)
- **Deep Link Validation:** Client validates token format before API call (prevent malformed tokens)

### Reliability/Availability

- **Offline Privacy Settings:** Privacy settings cached locally, applied even when offline
- **Invite Link Caching:** Generated invite links cached for offline viewing (host dashboard)
- **Graceful Token Expiration:** Expired tokens return clear error messages, suggest browsing public events
- **Privacy Settings Fallback:** If privacy API fails, fallback to default settings (showLevel: true, showBadges: true, showReliabilityScore: false)
- **Event Visibility Consistency:** Visibility changes propagate immediately, no stale public listings

### Observability

- **Instrumentation Events:**
  - `private_event_created`: eventId, hostId
  - `invite_link_generated`: eventId, hostId, expiresAt
  - `invite_link_shared`: eventId, shareMethod (copy, native_share)
  - `invite_token_validated`: eventId, valid, error
  - `private_event_rsvp`: eventId, userId, invitedBy (if trackable)
  - `privacy_setting_updated`: userId, setting, oldValue, newValue
  - `event_visibility_changed`: eventId, oldVisibility, newVisibility

- **Metrics:**
  - Private event creation rate: % of events created as private (target <20%)
  - Private event fill rate: Avg capacity filled for private events (target >75%)
  - Invite link generation rate: Avg invites per private event (target >0.8)
  - Invite token validation success rate: % valid tokens (target >90%)
  - Privacy adoption rates: % users with each toggle disabled (track over time)
  - Level visibility toggle rate: % users hiding level (expected <10%)
  - Reliability visibility toggle rate: % users hiding reliability (expected >80% per FR037 default)

---

## Dependencies and Integrations

**Internal Dependencies:**

- Epic 1: User authentication, profile data model
- Epic 2: Event CRUD, RSVP flow, event detail screens (extended for private events)
- Epic 3: Level, badges (privacy settings apply to these fields)

**External Dependencies:**

- Backend Private Event API: Invite token generation, validation, access control
- Backend Privacy Settings API: CRUD operations, default settings initialization
- Backend Event Visibility API: Toggle public ↔ private

**Third-Party SDKs:**

- React Native Share: Native share sheet for invite links (already used in Epic 2)
- React Native Deep Linking: Handle `gss://event/invite/{token}` URLs (iOS Universal Links, Android App Links)

---

## Acceptance Criteria (Authoritative)

### AC1: Private Event Creation and Badge Display

1. Event creation form includes visibility toggle: "Public" (default) / "Private"
2. Toggle selection persists during form editing (doesn't reset on input change)
3. Info tooltip on "Private" option: "Private events are invitation-only and excluded from public search"
4. Submit form with visibility='private' → API call with correct payload
5. Successful creation navigates to event detail screen
6. "Private Event" badge displayed prominently at top of event detail (red or purple accent)
7. Public event browse (list + map views) excludes private events (client-side filter)
8. "My Events" host dashboard shows private events with "Private" indicator
9. Private events searchable only via invite link (not via search bar)
10. Host can view all details of their private event without invite token

**Validation:** Create 3 events (2 public, 1 private), verify private event doesn't appear in public browse, confirm "Private Event" badge displays on detail screen

### AC2: Invite Link Generation and Sharing (Mobile)

1. Private event detail screen shows "Share Invite" button (hosts only, not visible to non-hosts)
2. Tap button → API call to generate invite link
3. InviteLinkModal opens displaying:
   - Full invite link: `gss://event/invite/{token}` (mobile) or `https://gss.app/events/invite/{token}` (web fallback)
   - "Copy Link" button
   - "Share" button
   - Expiration notice: "Expires 24h after event ends: [date/time]"
4. Tap "Copy Link" → link copied to clipboard → toast: "Invite link copied!"
5. Tap "Share" → native share sheet opens with pre-filled message: "Join my event: [event title] [link]"
6. Share via messaging app (iMessage, WhatsApp, Email, etc.)
7. Modal has "Close" button to dismiss
8. "Regenerate Link" button available (invalidates previous token, creates new one with confirmation)
9. Regenerate confirmation: "This will invalidate the previous link. Continue?"
10. Multiple invites can be generated (token refreshed each time)

**Validation:** Create private event, generate invite link, copy to clipboard, verify link format correct, share via iMessage, confirm message sent with link

### AC3: Invite Token Validation and Redemption (Mobile)

1. Recipient taps invite link in message/email
2. Deep link opens app (if installed) or web browser (if not installed)
3. App navigates to InviteRedemptionScreen with loading state: "Validating invite..."
4. API call: POST /api/v1/events/validate-invite with token
5. Valid token response: Navigate to event detail screen with full event data
6. Event detail displays normally with RSVP button enabled
7. User can RSVP to private event (standard RSVP flow from Epic 2)
8. RSVP'd private event appears in "My RSVPs" list
9. Private event still excluded from public browse after RSVP
10. Invalid/expired token response: Error screen displays: "This invite has expired or is no longer valid" with "Browse Events" button

**Validation:** Generate invite link, send to second test user, tap link on second user's device, verify event detail loads, RSVP successfully, confirm event appears in "My RSVPs"

### AC4: Profile Privacy Settings UI (Mobile)

1. Settings screen (accessible from profile menu) includes "Privacy" section
2. Privacy section displays 3 toggles:
   - "Show Level" (default: ON)
   - "Show Badges" (default: ON)
   - "Show Reliability Score" (default: OFF per FR037)
3. Each toggle has explanatory text: "Controls who can see your [field] on your profile"
4. Tap toggle → immediate optimistic UI update (toggle animates to new state)
5. API call: PUT /api/v1/users/:userId/privacy-settings with updated setting
6. Success response → toast: "Privacy settings updated"
7. Failure response → rollback optimistic update, toast: "Update failed. Please try again."
8. Settings persist across app restarts (cached locally + server-side)
9. Navigate back to profile screen → verify changes applied (e.g., level hidden if toggle OFF)
10. Changes apply immediately to all profile displays (participant lists, leaderboards, search results)

**Validation:** Toggle all 3 settings OFF, verify API calls made, refresh app, confirm settings persist, check profile displays "Hidden" or "Private" for each field

### AC5: Privacy-Aware Profile Display (Mobile)

1. User A views User B's profile (from participant list, search, or leaderboard)
2. Profile fetches User B's privacy settings (API call or cached)
3. Privacy rules applied before rendering:
   - showLevel = false → display "Level: Hidden" (grayed out text)
   - showBadges = false → hide badges section entirely
   - showReliabilityScore = false → display "Reliability: Private" (grayed out text with lock icon)
4. Fields with privacy enabled display normally (e.g., showLevel = true → "Level: 15")
5. Participant lists apply same privacy rules (event attendee list shows "Level: Hidden" for users with toggle OFF)
6. Leaderboards apply privacy rules (users with level hidden show "—" in level column)
7. Privacy settings don't affect user's own profile view (user always sees their full profile)
8. Privacy-aware profile caches settings for 5 minutes (reduce API calls)
9. Profile refresh re-fetches privacy settings (pull-to-refresh invalidates cache)
10. Default privacy applies if settings fetch fails: showLevel=true, showBadges=true, showReliabilityScore=false

**Validation:** User A toggles level OFF, User B views User A's profile, confirm level shows "Hidden", User B views participant list, confirm User A's level "Hidden" there too

### AC6: Event Visibility Toggle (Mobile)

1. Host opens existing public event detail screen
2. "⋮" menu button in top-right corner includes "Change to Private" option
3. Tap option → confirmation dialog: "Make this event private? It will no longer appear in public search."
4. Confirm → API call: PUT /api/v1/events/:id/visibility with { visibility: 'private' }
5. Success response → toast: "Event is now private"
6. "Private Event" badge now displays
7. "Share Invite" button now appears
8. Event removed from public browse lists immediately (client-side filter)
9. Reverse flow (private → public): "Change to Public" option with confirmation: "Make this event public? Anyone can discover and RSVP."
10. Visibility toggle available only to host (not to participants)

**Validation:** Create public event, verify in browse list, change to private, confirm removed from browse, change back to public, confirm reappears

### AC7: Admin Privacy Metrics Dashboard (Web)

1. Admin Analytics page includes "Privacy Metrics" tab
2. Tab displays 4 metrics cards:
   - Private Events Created: [count] total
   - Private Event Fill Rate: [percentage] avg capacity filled
   - Invite Generation Rate: [number] avg invites per private event
   - Privacy Adoption: Breakdown by setting (level hidden: X%, badges hidden: Y%, reliability hidden: Z%)
3. Trend charts show adoption over time (7d, 30d, 90d views)
4. Table lists top 10 users with most privacy settings disabled (for support/outreach)
5. Export CSV button: "Export Privacy Metrics" → downloads CSV with user-level data
6. Metrics auto-refresh every 60s (manual refresh button also available)
7. Last updated timestamp: "Last updated: 2 min ago"
8. Empty state if no private events created: "No private events yet"
9. Privacy adoption rates calculated: (users with toggle OFF / total users) \* 100
10. Expected baseline: >80% users with reliability hidden (FR037 default)

**Validation:** Create 5 private events, generate invite links, toggle privacy settings for 10 users, verify admin dashboard shows correct counts and percentages

---

## Traceability Mapping

| Acceptance Criteria | PRD Functional Requirements    | User Journeys                | Architecture Components                                                   | Stories  |
| ------------------- | ------------------------------ | ---------------------------- | ------------------------------------------------------------------------- | -------- |
| AC1                 | FR025 (Private events)         | Journey 2 (event creation)   | CreateEventScreen, EventDetailScreen, PrivateEventBadge                   | 9-1, 9-2 |
| AC2                 | FR025 (Invite link generation) | Journey 2 (event sharing)    | InviteLinkModal, EventService.generateInviteLink                          | 9-1      |
| AC3                 | FR025 (Invite redemption)      | Journey 1 (event discovery)  | InviteRedemptionScreen, DeepLinkService, EventService.validateInviteToken | 9-2      |
| AC4                 | FR037 (Privacy defaults)       | N/A                          | PrivacySettingsScreen, PrivacyService                                     | 9-3      |
| AC5                 | FR037 (Privacy display)        | All journeys (profile views) | PrivacyAwareProfile, PrivacyService.applyPrivacyToProfile                 | 9-3, 9-4 |
| AC6                 | FR025 (Visibility toggle)      | Journey 2 (event management) | EventDetailScreen, EventService.updateEventVisibility                     | 9-1      |
| AC7                 | FR025, FR037 (Analytics)       | N/A                          | AdminPrivacyMetricsPage, AdminAnalyticsService                            | 9-4      |

**Story Breakdown (Estimated 6-9 stories):**

- Story 9-1: Private Event Invite Link Generation (AC1, AC2, AC6)
- Story 9-2: Private Event Access Gate and Invite Redemption (AC1, AC3)
- Story 9-3: Profile Privacy Settings UI (AC4)
- Story 9-4: Privacy-Aware Profile Display Logic (AC5, AC7)
- Story 9-5: Deep Link Handling for Invite Links (AC3)
- Story 9-6: Admin Privacy Analytics Dashboard (AC7)

---

## Risks, Assumptions, Open Questions

**Risks:**

- Invite link abuse: Users sharing invite links publicly, defeating private event purpose (mitigated by token expiration + regeneration)
- Privacy setting confusion: Users may not understand what "Show Level" toggle controls (mitigated by clear explanatory text)
- Default privacy mismatch: FR037 defaults reliability to hidden, but users may expect it visible (mitigated by onboarding education)
- Deep link conflicts: Invite links may conflict with other deep link routes (mitigated by unique route pattern)
- Private event discovery: Users may expect to search for private events they're invited to (clarify in UX: invite link only)

**Assumptions:**

- Invite tokens generated by backend with sufficient entropy (UUID v4 or JWT with secure signing)
- Backend enforces token expiration (event end time + 24h) consistently
- Privacy settings apply globally (all profile views, not per-view customization)
- Default privacy settings match FR037: showLevel=true, showBadges=true, showReliabilityScore=false
- Private events <20% of total events (monitoring metric for feature adoption)

**Open Questions:**

- Should invite links support custom expiration times? (Assumed no, fixed 24h post-event)
- Should hosts see who accessed their invite link? (Assumed no for MVP, deferred to analytics)
- Should privacy settings include "friends only" visibility tier? (Assumed no, deferred to social features)
- Should private events support multiple invite links with tracking? (Assumed no, single regeneratable link)
- Should we allow users to permanently delete their profile data (GDPR right to erasure)? (Assumed handled by backend, not in scope)

---

## Test Strategy Summary

**Unit Tests (70%):**

- EventService: generateInviteLink, validateInviteToken, updateEventVisibility
- PrivacyService: getSettings, updateSettings, applyPrivacyToProfile
- DeepLinkService: handleInviteLink, parseInviteToken
- Privacy rules logic: Apply showLevel, showBadges, showReliabilityScore to profiles
- Invite token validation: Valid/invalid/expired scenarios

**Integration Tests (20%):**

- Private event creation flow: Create event → generate invite → validate token
- Privacy settings update flow: Toggle setting → API call → profile updates
- Invite redemption flow: Deep link → validate → event detail → RSVP
- Event visibility toggle: Public → private → public transitions
- Admin metrics: Fetch private event metrics, privacy adoption metrics

**E2E Tests (10%):**

- Complete invite flow: Host creates private event → generates link → shares → recipient opens → RSVPs
- Privacy settings flow: User toggles all 3 settings → views own profile → another user views profile → hidden fields displayed
- Event visibility toggle: Host changes event visibility → verify public browse updates
- Invalid invite: Expired token → error screen → fallback to public browse

**Coverage Targets:**

- Unit tests: 80% line coverage
- Integration tests: All 7 AC scenarios validated
- E2E tests: Critical paths (invite redemption, privacy settings) verified

**Testing Tools:**

- Jest + React Native Testing Library for mobile unit/component tests
- Vitest for web unit tests
- Detox for mobile E2E testing
- Playwright for web E2E testing
- Mock Service Worker (MSW) for API mocking

---

**End of Epic 9 Frontend Technical Specification**

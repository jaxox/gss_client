# Frontend Technical Specification: Growth Gating & Invite Waves

**Epic 6: Growth Gating & Invite Waves**

_Generated: November 9, 2025_  
_Project: gss_client (Frontend Implementation)_  
_Version: 1.0_

---

## Overview

This technical specification defines the **frontend implementation** for Epic 6 (Growth Gating & Invite Waves), covering controlled growth mechanics through waitlist intake, wave-based activation, and invite allocation systems. This epic implements UI/UX flows for prospective user acquisition, friend invitation mechanics, and basic growth metrics visualization.

**Context:** This is a **frontend-only specification**. Backend APIs (waitlist management, scoring engine, wave promotion, invite redemption) are assumed complete and documented in `docs/shared/tech-specs/tech-spec-epic-6.md` (backend reference). This document focuses exclusively on mobile and web client implementations.

**Key Functional Requirements:** FR029 (Invite system), FR030 (Waitlist & scoring), FR031 (Wave promotion evaluation)

**Problem Statement:** Open registration risks diluting platform reliability through low-quality user onboarding. Without controlled activation, early adopters may experience poor event fill rates, no-show spikes, and weak network effects. Growth gating enables quality-focused scaling while invite mechanics drive organic acquisition and k-factor measurement.

**Goals:**

- Enable prospective users to join waitlist with scoring-ready data capture (city, sport, referral code)
- Provide activated users with invite allocation UI to share access with friends
- Support admin wave promotion workflows with health snapshot visualization
- Track invite usage, redemption rates, and basic growth metrics for optimization

**User-Facing Features:**

1. **Waitlist Signup Form:** Public landing page for prospective users (email, city, sport, referral code)
2. **Invite Management UI:** Activated users view remaining invites (5 default), generate shareable invite links, track usage
3. **Invite Redemption Flow:** Redeem invite code during registration to bypass waitlist
4. **Admin Growth Dashboard (Web):** Wave promotion controls, waitlist review queue, growth metrics (reliability avg, k-factor, wave health)

**Out of Scope (Deferred to Future Epics):**

- Automated wave promotion triggers based on health thresholds (manual admin-triggered for MVP)
- Invite expiration enforcement (backend supports but UI doesn't surface expiry dates)
- Referral incentive rewards (gamification integration deferred)
- Waitlist position tracking UI (backend doesn't expose real-time position for MVP)
- Email verification for waitlist signups (spam prevention deferred)

---

## Objectives and Scope

### In Scope

**Mobile (React Native):**

1. **Waitlist Signup Screen:**
   - Email input with validation (RFC 5322)
   - City dropdown (priority cities: SF, NYC, LA + free text for others)
   - Sport selector (pickleball default, tennis optional)
   - Optional referral code input (8-char alphanumeric)
   - Submit button triggers `POST /api/v1/waitlist` with score calculation
   - Confirmation toast: "You're on the waitlist! Check email for updates."

2. **Invite Management Screen (Profile Tab):**
   - Display remaining invite count: "5 invites left" (dynamic from backend)
   - "Generate Invite Link" button creates shareable deep link
   - Invite history list: sent invites with status (pending, redeemed, expired)
   - Copy invite code to clipboard with success feedback
   - Share invite via OS share sheet (SMS, WhatsApp, Email)

3. **Invite Redemption in Registration Flow:**
   - "Have an invite code?" link on login/register screen
   - Invite code input field (8-char alphanumeric validation)
   - On valid code: bypass waitlist, proceed to standard registration
   - On invalid code: error message "Invalid or expired invite code"
   - Success flow: User account created immediately, inviter's usage count incremented

**Web (React + Vite):**

1. **Admin Waitlist Review Dashboard:**
   - Paginated waitlist table (email, city, sport, score, status, created_at)
   - Sort by score (descending), filter by status (pending, activated, rejected)
   - Search by email or referral code
   - Manual activation action (one-off override for high-value users)

2. **Wave Promotion Controls:**
   - "Promote Wave" modal with criteria inputs:
     - Min score threshold (slider 0-100, default 50)
     - Max activations (input, default 100)
     - City priority (multi-select: SF, NYC, LA)
   - "Generate Health Snapshot" button fetches current metrics (reliability avg, RSVP→Check-In %, active users)
   - Confirm promotion triggers `POST /api/v1/admin/waves/promote`
   - Success: Display wave summary (wave #, activated count, avg reliability)

3. **Growth Metrics Dashboard:**
   - Key metrics cards:
     - Total waitlist size (pending count)
     - Total activated users (all-time)
     - Average reliability score (active users, last 30d)
     - RSVP→Check-In conversion rate (last 30d)
     - K-factor approximation (invites redeemed / active users)
     - Wave count (total promotion events)
   - Wave history table (wave #, target, actual activated, criteria, health snapshot, created_at)
   - Line chart: cumulative activations over time (by wave)

### Out of Scope

- Invite expiration countdown timers (backend supports expiry but MVP doesn't require UI)
- Waitlist position real-time updates (not exposed by backend for MVP)
- Referral incentive XP/badge rewards (gamification integration deferred)
- A/B test scoring rubric UI (admin adjusts weights backend-side)
- Automated wave promotion scheduling (manual admin trigger only for MVP)
- Email campaign management for waitlist nurturing (handled by external tool)

---

## System Architecture Alignment

### Mobile Architecture

**Screens:**

- `WaitlistSignupScreen` (Pre-Auth, Public Access)
- `InviteManagementScreen` (Profile Tab, Authenticated)
- `InviteRedemptionModal` (Login/Register Flow)

**Services:**

- `WaitlistService` (signup API integration)
- `InviteService` (generate, redeem, fetch usage APIs)
- `GrowthMetricsService` (fetch invite stats, waitlist count)

**Redux Slices:**

- `growth.slice.ts` (waitlist status, invite allocation, usage tracking)

**Navigation:**

- Tab Navigator: Add "Invites" badge on Profile tab when invites available
- Auth Navigator: Insert invite redemption step before registration completion

### Web Architecture

**Pages:**

- `AdminWaitlistPage` (dashboard view, table + filters)
- `WavePromotionPage` (promotion controls + health snapshot)
- `GrowthMetricsPage` (dashboard with charts + metrics)

**Services:**

- `AdminWaitlistService` (fetch waitlist, activate users)
- `WaveService` (promote wave, fetch history)
- `GrowthMetricsService` (fetch metrics, health snapshots)

**Components:**

- `WaitlistTable` (sortable, filterable data table)
- `WavePromotionModal` (criteria inputs + confirmation)
- `GrowthMetricsCard` (metric display with trend indicator)
- `WaveHistoryChart` (line chart for cumulative activations)

---

## Detailed Design

### Services and Modules

| Service/Module           | Responsibility                                | Key Methods                                                                  | Platform    |
| ------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------- | ----------- |
| **WaitlistService**      | Waitlist signup API integration               | `signup(email, city, sport, referralCode)`                                   | Mobile, Web |
| **InviteService**        | Invite generation, redemption, usage tracking | `generate()`, `redeem(code)`, `getUsage()`, `getHistory()`                   | Mobile, Web |
| **GrowthMetricsService** | Fetch growth metrics and health snapshots     | `getMetrics()`, `getHealthSnapshot()`, `getWaveHistory()`                    | Web         |
| **AdminWaitlistService** | Admin waitlist management                     | `getWaitlist(filters)`, `activateUser(waitlistId)`, `rejectUser(waitlistId)` | Web         |
| **WaveService**          | Wave promotion orchestration                  | `promoteWave(criteria)`, `getWaveHistory()`                                  | Web         |
| **GrowthStore (Redux)**  | Client-side state for invites and waitlist    | `setInviteAllocation()`, `addInviteUsage()`, `updateWaitlistStatus()`        | Mobile, Web |

### Data Models and Contracts

```typescript
// Waitlist Models
interface WaitlistSignup {
  email: string;
  city: string;
  sport: string;
  referralCode?: string;
}

interface WaitlistEntry {
  id: string;
  email: string;
  city: string;
  sport: string;
  referralCode?: string;
  score: number;
  scoreBreakdown: {
    geography: number;
    availability: number;
    referral: number;
    hostPotential: number;
    diversity: number;
  };
  status: 'pending' | 'activated' | 'rejected';
  activatedUserId?: string;
  activatedAt?: string;
  activatedWaveId?: string;
  createdAt: string;
}

// Invite Models
interface InviteAllocation {
  userId: string;
  totalInvites: number;
  usedInvites: number;
  remainingInvites: number;
}

interface InviteCode {
  id: string;
  code: string; // 8-char alphanumeric
  inviterId: string;
  inviteeEmail?: string;
  inviteeUserId?: string;
  status: 'pending' | 'redeemed' | 'expired';
  redeemedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

interface InviteUsageHistory {
  invites: InviteCode[];
  totalSent: number;
  totalRedeemed: number;
  redemptionRate: number;
}

// Wave Models
interface WavePromotionCriteria {
  minScore: number;
  maxActivations: number;
  cityPriority?: string[];
}

interface ActivationWave {
  id: string;
  waveNumber: number;
  targetUserCount: number;
  actualActivatedCount: number;
  promotionCriteria: WavePromotionCriteria;
  healthSnapshot: {
    reliabilityAvg: number;
    rsvpCheckInRate: number;
    kFactor: number;
    activeUsers: number;
  };
  createdBy: string;
  createdAt: string;
}

// Growth Metrics Models
interface GrowthMetrics {
  waitlistSize: number;
  totalActivatedUsers: number;
  reliabilityAvg: number;
  rsvpCheckInRate: number;
  kFactor: number;
  waveCount: number;
  lastUpdated: string;
}

interface HealthSnapshot {
  reliabilityAvg: number;
  rsvpCheckInRate: number;
  kFactor: number;
  activeUsers: number;
  timestamp: string;
}
```

### APIs and Interfaces

**Backend API Endpoints (Assumed Complete):**

```typescript
// Waitlist APIs (Public)
POST   /api/v1/waitlist
  Body: WaitlistSignup
  Response: { message: "Added to waitlist", score: number, position: number }

// Invite APIs (Authenticated Users)
GET    /api/v1/invites/allocation
  Response: InviteAllocation

POST   /api/v1/invites/generate
  Response: { code: string, deepLink: string }

POST   /api/v1/invites/redeem
  Body: { code: string }
  Response: { success: boolean, userId: string }

GET    /api/v1/invites/history
  Response: InviteUsageHistory

// Admin Waitlist APIs (Admin Only)
GET    /api/v1/admin/waitlist?status=pending&sort=score&order=desc&limit=50&offset=0
  Response: { entries: WaitlistEntry[], total: number }

POST   /api/v1/admin/waitlist/:id/activate
  Response: { userId: string, inviteAllocation: InviteAllocation }

POST   /api/v1/admin/waitlist/:id/reject
  Body: { reason?: string }
  Response: { success: boolean }

// Wave Promotion APIs (Admin Only)
POST   /api/v1/admin/waves/promote
  Body: WavePromotionCriteria
  Response: ActivationWave

GET    /api/v1/admin/waves/history?limit=10&offset=0
  Response: { waves: ActivationWave[], total: number }

// Growth Metrics APIs (Admin Only)
GET    /api/v1/admin/growth/metrics
  Response: GrowthMetrics

GET    /api/v1/admin/growth/health-snapshot
  Response: HealthSnapshot
```

**Frontend Service Interfaces:**

```typescript
// WaitlistService
interface IWaitlistService {
  signup(data: WaitlistSignup): Promise<{ score: number; position: number }>;
}

// InviteService
interface IInviteService {
  getAllocation(): Promise<InviteAllocation>;
  generate(): Promise<{ code: string; deepLink: string }>;
  redeem(code: string): Promise<{ success: boolean; userId: string }>;
  getHistory(): Promise<InviteUsageHistory>;
}

// AdminWaitlistService
interface IAdminWaitlistService {
  getWaitlist(filters: {
    status?: string;
    sort?: string;
    order?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ entries: WaitlistEntry[]; total: number }>;
  activateUser(waitlistId: string): Promise<{ userId: string }>;
  rejectUser(waitlistId: string, reason?: string): Promise<{ success: boolean }>;
}

// WaveService
interface IWaveService {
  promoteWave(criteria: WavePromotionCriteria): Promise<ActivationWave>;
  getWaveHistory(
    limit?: number,
    offset?: number
  ): Promise<{ waves: ActivationWave[]; total: number }>;
}

// GrowthMetricsService
interface IGrowthMetricsService {
  getMetrics(): Promise<GrowthMetrics>;
  getHealthSnapshot(): Promise<HealthSnapshot>;
}
```

### Workflows and Sequencing

**Workflow 1: Waitlist Signup (Mobile/Web Public)**

1. User navigates to landing page or opens app without invite code
2. "Join Waitlist" button navigates to WaitlistSignupScreen
3. User fills form: email, city (dropdown), sport (radio), optional referral code
4. Form validation: email RFC 5322, city not empty, sport selected
5. On submit: WaitlistService.signup() API call
6. Loading state: "Submitting..." button disabled
7. On success: Confirmation toast "You're on the waitlist! We'll email you when a spot opens."
8. Backend calculates score (0-100) and returns position estimate (e.g., "You're #42")
9. User redirected to login screen or app closes (mobile)
10. Email confirmation sent with waitlist status and score (optional backend feature)

**Workflow 2: Invite Generation and Sharing (Mobile)**

1. Activated user navigates to Profile tab → "Invites" section
2. InviteManagementScreen loads: displays remaining invite count (e.g., "5 invites left")
3. User taps "Generate Invite Link"
4. InviteService.generate() API call creates unique 8-char code
5. Backend returns: `{ code: "ABC12XYZ", deepLink: "gss://invite/ABC12XYZ" }`
6. Success feedback: "Invite code generated! ABC12XYZ"
7. User taps "Copy Code" → clipboard copy with toast "Copied to clipboard"
8. User taps "Share" → OS share sheet opens with message: "Join me on GSS! Use code ABC12XYZ or click: gss://invite/ABC12XYZ"
9. Friend receives message, taps deep link → opens app to InviteRedemptionModal
10. Invite history updates: new entry added with status "pending"

**Workflow 3: Invite Redemption During Registration (Mobile)**

1. New user opens app, sees login/register screen
2. User taps "Have an invite code?" link
3. InviteRedemptionModal appears with code input field
4. User enters code "ABC12XYZ" (case-insensitive)
5. Input validation: 8-char alphanumeric, trim whitespace
6. User taps "Redeem Code"
7. InviteService.redeem(code) API call
8. Backend validates code: checks status (pending), not expired
9. On success: `{ success: true, userId: "new-user-id" }`
10. User bypasses waitlist, proceeds to standard registration (profile setup)
11. Backend: creates User record, allocates 5 invites, updates inviter's usage count, marks code as "redeemed"
12. Inviter receives push notification: "Your friend joined GSS! 4 invites left."
13. On failure: Error message "Invalid or expired invite code. Try again or join the waitlist."

**Workflow 4: Admin Wave Promotion (Web)**

1. Admin navigates to Growth Dashboard → Wave Promotion section
2. Admin clicks "Promote Wave" button
3. WavePromotionModal opens with criteria inputs:
   - Min Score slider (0-100, default 50)
   - Max Activations input (default 100)
   - City Priority multi-select (SF, NYC, LA)
4. Admin clicks "Preview Health Snapshot"
5. GrowthMetricsService.getHealthSnapshot() fetches current metrics
6. Modal displays preview:
   - Reliability Avg: 0.89
   - RSVP→Check-In Rate: 92%
   - K-Factor: 1.2
   - Active Users: 450
7. Admin reviews criteria, clicks "Confirm Promotion"
8. WaveService.promoteWave(criteria) API call
9. Backend query: `SELECT * FROM waitlist WHERE status='pending' AND score >= 50 ORDER BY score DESC LIMIT 100`
10. Backend activates users: creates User records, allocates invites, updates waitlist status
11. Backend creates ActivationWave record with health snapshot
12. Success response: `{ waveNumber: 5, actualActivatedCount: 97, reliabilityAvg: 0.89 }`
13. Success toast: "Wave #5 promoted: 97 users activated"
14. Wave history table updates with new entry
15. Activated users receive email: "Welcome to GSS! You've been activated from the waitlist."

---

## Non-Functional Requirements

### Performance

- **Waitlist Signup Latency:** <1s for form submission, p95 <2s including score calculation
- **Invite Generation:** <500ms to generate unique code, <1s for deep link creation
- **Invite Redemption:** <2s from code validation to user activation confirmation
- **Admin Waitlist Table Load:** <1.5s for 50 entries with sort/filter, paginated for 500+ entries
- **Wave Promotion Execution:** <10s for 100 user batch activation, <30s for 500 users
- **Growth Metrics Dashboard Load:** <2s for all metrics cards, <1s for cached health snapshot

### Security

- **Invite Code Security:** 8-char alphanumeric codes (62^8 = 218 trillion combinations), single-use enforcement
- **Waitlist Email Validation:** Duplicate email detection, RFC 5322 validation client-side + server-side
- **Admin Authorization:** Wave promotion and waitlist activation restricted to admin role (JWT claims validation)
- **Invite Redemption Authorization:** Code validation requires active status, not expired, not already redeemed
- **Rate Limiting:** Invite generation limited to 5 per day per user (FR039), enforced backend
- **Deep Link Validation:** Deep links validated against whitelist scheme (gss://invite/\*), no arbitrary URL execution

### Reliability/Availability

- **Offline Invite Storage:** Generated invite codes cached locally, synced when connection restored
- **Failed Redemption Retry:** Retry logic with exponential backoff (1s, 5s, 30s) for network failures
- **Wave Promotion Idempotency:** Prevent duplicate wave promotion clicks with debounce (2s) + loading state
- **Graceful Degradation:** If invite allocation fetch fails, show "Invites unavailable, try again later"
- **Waitlist Signup Resilience:** Queue signup locally if offline, sync on reconnect with conflict resolution (email uniqueness check)

### Observability

- **Instrumentation Events:**
  - `waitlist_joined`: email, city, sport, referralCode, score
  - `invite_generated`: userId, code
  - `invite_shared`: userId, code, channel (sms, whatsapp, email)
  - `invite_redeemed`: inviterId, inviteeUserId, code
  - `wave_promoted`: waveNumber, targetCount, actualCount, criteria, healthSnapshot
  - `waitlist_activated_manual`: adminUserId, waitlistId, userId

- **Metrics:**
  - Waitlist signup rate (signups per day)
  - Invite generation rate (invites per active user per day)
  - Invite redemption rate (redeemed / total sent, target >30%)
  - Wave promotion frequency (waves per week)
  - Average users activated per wave (target 80-100)
  - K-factor trend (target >1.0 for organic growth)

---

## Dependencies and Integrations

**Internal Dependencies:**

- Epic 1: Authentication (JWT tokens, user profile creation)
- Epic 2: Event model (health snapshot requires RSVP/check-in data)
- Epic 3: Reliability score calculation (health snapshot metrics)

**External Dependencies:**

- Backend Waitlist Service: Signup, scoring engine, activation
- Backend Invite Service: Generation, redemption, allocation management
- Backend Wave Service: Promotion orchestration, health snapshot computation
- Deep Link Handler: Universal links (iOS), App Links (Android) for invite redemption
- Email Service: Waitlist confirmation, activation notifications (backend-triggered)

**Third-Party SDKs:**

- React Native Share API (v7.0+): Invite code sharing via OS share sheet
- React Native Clipboard (v1.14+): Copy invite code to clipboard
- React Router (v6.90+): Web routing for admin dashboards
- Chart.js (v4.4+): Growth metrics line charts (web)

---

## Acceptance Criteria (Authoritative)

### AC1: Waitlist Signup Form Implementation

1. Public landing page (mobile + web) includes "Join Waitlist" CTA
2. Waitlist form captures: email (required, validated), city (dropdown), sport (radio), referral code (optional)
3. Form validation: email RFC 5322, city selected, sport selected
4. Submit button triggers `POST /api/v1/waitlist` with form data
5. Backend calculates score (0-100) and returns confirmation
6. Success feedback: "You're on the waitlist! Check email for updates."
7. Error handling: Duplicate email shows "Email already registered", network errors show retry prompt
8. Form clears after successful submission
9. Mobile: form accessible without authentication
10. Web: form embedded on marketing landing page

**Validation:** Submit 10 test signups with varied data (high/low score cities, with/without referral codes), verify all accepted and scored correctly

### AC2: Invite Generation and Sharing UI

1. Authenticated users see "Invites" section in Profile tab
2. Invite count badge displays remaining invites (e.g., "5 invites left")
3. "Generate Invite Link" button triggers `POST /api/v1/invites/generate`
4. Backend returns unique 8-char code and deep link
5. Success feedback: "Invite code generated! ABC12XYZ"
6. "Copy Code" button copies code to clipboard with toast confirmation
7. "Share" button opens OS share sheet with pre-filled message + deep link
8. Invite history list shows sent invites with status (pending, redeemed, expired)
9. History updates in real-time when invites redeemed
10. If user has 0 invites remaining, "Generate" button disabled with tooltip "No invites left"

**Validation:** Generate 5 invites, share via SMS/WhatsApp, verify deep links work, confirm history updates when redeemed

### AC3: Invite Redemption Flow

1. Login/register screen includes "Have an invite code?" link
2. Link opens InviteRedemptionModal with code input field
3. Input validation: 8-char alphanumeric, case-insensitive, trim whitespace
4. "Redeem Code" button triggers `POST /api/v1/invites/redeem`
5. On valid code: User bypasses waitlist, proceeds to registration
6. Backend creates User record, allocates 5 invites, updates inviter's usage count
7. Inviter receives push notification: "Your friend joined GSS!"
8. On invalid code: Error message "Invalid or expired invite code"
9. Deep link opens app directly to redemption modal with code pre-filled
10. Mobile: deep link handled by universal links (iOS), app links (Android)

**Validation:** Redeem 5 invite codes (valid, expired, already used, invalid format), verify correct outcomes, confirm inviter notification sent

### AC4: Admin Waitlist Management Dashboard

1. Admin users access Waitlist Review Dashboard (web)
2. Paginated table displays: email, city, sport, score, status, created_at
3. Sort by score (descending), filter by status (pending, activated, rejected)
4. Search by email or referral code
5. Each row includes "Activate" and "Reject" action buttons
6. "Activate" triggers `POST /api/v1/admin/waitlist/:id/activate`
7. Success: User account created, invite allocation assigned, table row updated
8. "Reject" triggers `POST /api/v1/admin/waitlist/:id/reject` with optional reason
9. Table pagination supports 500+ entries with <1.5s load time per page
10. Audit log records admin actions (who activated/rejected, when)

**Validation:** Admin activates 10 users manually, verifies accounts created, invites allocated, waitlist status updated

### AC5: Wave Promotion Controls and Health Snapshot

1. Admin Growth Dashboard includes "Promote Wave" button
2. Button opens WavePromotionModal with criteria inputs
3. Criteria: Min Score (slider 0-100), Max Activations (input), City Priority (multi-select)
4. "Preview Health Snapshot" button fetches current metrics:
   - Reliability Avg, RSVP→Check-In %, K-Factor, Active Users
5. Admin reviews snapshot, confirms criteria
6. "Confirm Promotion" triggers `POST /api/v1/admin/waves/promote`
7. Backend activates users matching criteria (up to max count)
8. Success response includes wave #, activated count, health snapshot
9. Success toast: "Wave #5 promoted: 97 users activated"
10. Wave history table updates with new entry

**Validation:** Promote 3 test waves with different criteria, verify correct user counts activated, health snapshots logged

### AC6: Growth Metrics Dashboard Visualization

1. Admin Growth Metrics Dashboard displays key metrics cards:
   - Waitlist Size (pending count)
   - Total Activated Users (all-time)
   - Reliability Avg (active users, last 30d)
   - RSVP→Check-In Rate (last 30d)
   - K-Factor (invites redeemed / active users)
   - Wave Count (total promotions)
2. Wave History table shows: wave #, target, actual, criteria, health snapshot, created_at
3. Line chart: cumulative activations over time (by wave)
4. All metrics load from `GET /api/v1/admin/growth/metrics`
5. Metrics auto-refresh every 60s (configurable)
6. Chart responsive, accessible (WCAG 2.1 AA)
7. Export CSV button for wave history (optional)
8. Metrics cache for 5 minutes to reduce backend load

**Validation:** Load dashboard with 10 waves, verify all metrics display correctly, chart renders, CSV export functional

---

## Traceability Mapping

| Acceptance Criteria | PRD Functional Requirements      | User Journeys | Architecture Components                 | Stories  |
| ------------------- | -------------------------------- | ------------- | --------------------------------------- | -------- |
| AC1                 | FR030 (Waitlist signup)          | N/A           | WaitlistSignupScreen, WaitlistService   | 6-1      |
| AC2                 | FR029 (Invite allocation UI)     | N/A           | InviteManagementScreen, InviteService   | 6-4      |
| AC3                 | FR029 (Invite redemption)        | N/A           | InviteRedemptionModal, InviteService    | 6-4      |
| AC4                 | FR030 (Admin waitlist mgmt)      | N/A           | AdminWaitlistPage, AdminWaitlistService | 6-1      |
| AC5                 | FR031 (Wave promotion)           | N/A           | WavePromotionModal, WaveService         | 6-2, 6-3 |
| AC6                 | FR031 (Growth metrics dashboard) | N/A           | GrowthMetricsPage, GrowthMetricsService | 6-6      |

**Story Breakdown (Estimated 12-16 stories):**

- Story 6-1: Waitlist Signup Form + Admin Waitlist Review (AC1, AC4)
- Story 6-2: Wave Activation Engine Integration (AC5)
- Story 6-3: Wave Promotion Criteria Evaluation UI (AC5)
- Story 6-4: Invite Allocation UI + Generation/Redemption (AC2, AC3)
- Story 6-5: Invite Usage Tracking + History (AC2)
- Story 6-6: Growth Metrics Dashboard (AC6)
- Story 6-7: Deep Link Handling for Invite Redemption
- Story 6-8: Mobile Invite Sharing via OS Share Sheet
- Story 6-9: Admin Manual Activation Override
- Story 6-10: Wave History Visualization + Export

---

## Risks, Assumptions, Open Questions

**Risks:**

- Invite code collision risk (8-char alphanumeric = 62^8 combinations, negligible but collision detection required)
- Waitlist spam signups (no email verification for MVP, may attract fake emails)
- Wave promotion latency for large batches (>500 users may timeout, need async processing)
- Deep link redemption failure on Android (app link verification may fail on some OEMs)
- K-factor accuracy limited by invite tracking (users may share codes outside app, not tracked)

**Assumptions:**

- Backend scoring engine provides 0-100 score with breakdown (geography, availability, referral, host potential, diversity)
- Invite codes expire after 30 days (backend enforces, UI doesn't surface expiry countdown)
- Admin wave promotion is manual for MVP (no automated triggers based on health thresholds)
- Email confirmation sent by backend (frontend only triggers API, doesn't handle email delivery)
- Users share invite codes primarily via SMS/WhatsApp (OS share sheet most common method)

**Open Questions:**

- Should waitlist position be displayed to users? (Backend doesn't expose real-time position for MVP)
- What is the maximum invite allocation per user? (5 default, dynamic adjustments TBD)
- Should invite expiration be surfaced in UI? (Backend supports expiry but MVP doesn't require countdown)
- How should conflicting referral codes be handled? (User enters code A but already has code B from friend)
- Should wave promotion require admin approval from multiple admins? (Single admin sufficient for MVP)

---

## Test Strategy Summary

**Unit Tests (70%):**

- WaitlistService: Signup API integration, error handling, validation
- InviteService: Generate, redeem, get allocation/history APIs
- AdminWaitlistService: Fetch waitlist, activate/reject users
- WaveService: Promote wave, fetch history, health snapshot
- Redux Slices: Growth state management, invite allocation updates

**Integration Tests (20%):**

- Waitlist signup flow: Form submission → API call → confirmation toast
- Invite generation flow: Button tap → API call → clipboard copy
- Invite redemption flow: Code input → validation → user activation
- Wave promotion flow: Criteria input → API call → history update
- Metrics dashboard load: API call → state update → UI render

**E2E Tests (10%):**

- User joins waitlist → receives confirmation → admin activates → user logs in
- User generates invite → shares via SMS → friend redeems → both users see updated counts
- Admin promotes wave (50 users) → waitlist entries updated → activated users receive emails
- Admin views growth dashboard → metrics load → chart renders → CSV export works

**Coverage Targets:**

- Unit tests: 80% line coverage
- Integration tests: All 6 AC scenarios validated
- E2E tests: Critical paths (waitlist signup, invite redemption, wave promotion) verified

**Testing Tools:**

- Jest + React Native Testing Library for unit/component tests
- Detox for E2E mobile testing
- Vitest for web unit tests
- Playwright for web E2E testing
- Mock Service Worker (MSW) for API mocking

---

**End of Epic 6 Frontend Technical Specification**

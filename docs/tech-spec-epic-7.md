# Frontend Technical Specification: Advanced Partner Suggestions

**Epic 7: Advanced Partner Suggestions (Rule-Based Engine)**

_Generated: November 9, 2025_  
_Project: gss_client (Frontend Implementation)_  
_Version: 1.0_

---

## Overview

This technical specification defines the **frontend implementation** for Epic 7 (Advanced Partner Suggestions), covering a rule-based partner recommendation engine that increases social mixing and partner diversity. This epic implements UI/UX flows for surfacing partner suggestions during event discovery, quest completion workflows, and post-event interactions, with an extensible data schema prepared for future ML integration.

**Context:** This is a **frontend-only specification**. Backend APIs (partner analysis, suggestion scoring, recommendation engine) are assumed complete and documented in backend reference docs. This document focuses exclusively on mobile and web client implementations for displaying, accepting, and tracking partner suggestions.

**Key Functional Requirements:** FR021 (Partner suggestion engine), FR032 (Instrumentation events), FR036 (Partner diversity metric), NFR010 (ML-ready extensibility)

**Problem Statement:** Users tend to play with the same familiar partners repeatedly, limiting social network expansion and reducing platform stickiness. Without explicit partner suggestions, new users struggle to build connections, and existing users miss opportunities to diversify their social graph. Partner suggestions drive social mixing, increase partner diversity metrics, and improve long-term retention.

**Goals:**

- Surface partner suggestions during event browse, quest flows, and post-event interactions
- Implement rule-based suggestion algorithm (mutual play count, schedule overlap, location proximity)
- Prepare ML-ready data schema with extensibility fields (skill estimate, availability vector, interaction history)
- Track suggestion acceptance rates, click-through rates, and partner diversity impact
- Integrate suggestions with Social Butterfly quest and partner diversity metrics

**User-Facing Features:**

1. **Suggested Partners Widget:** Event browse screen shows "Play with someone new" badge on events with high suggestion match
2. **Quest Integration:** Social Butterfly quest detail screen shows suggested events filtered for new partners
3. **Post-Event Suggestions:** After check-in, "Play again with..." suggestions based on recent partners
4. **Partner Discovery Screen:** Dedicated screen showing ranked partner suggestions with match reasons
5. **Suggestion Feedback:** Accept/dismiss suggestions with optional feedback ("Not interested", "Already know them", "Too far")

**Out of Scope (Deferred to Future Epics):**

- ML-based suggestion scoring (rule-based MVP only, data schema prepared for ML)
- Advanced filtering (skill level matching, availability windows, personality compatibility)
- In-app messaging with suggested partners (social features deferred)
- Mutual friend connections (requires social graph expansion)
- Suggestion explanation UI (match reasons shown but not detailed scoring breakdowns)

---

## Objectives and Scope

### In Scope

**Mobile (React Native):**

1. **Event Browse Integration:**
   - "Play with new partners" badge on event cards when suggestion match >60%
   - Tap badge filters event list to show high-suggestion events
   - Event detail shows suggested partners section: "X new players attending"
   - Suggested partner cards: avatar, name, "X mutual events", suggestion score

2. **Quest Integration (Social Butterfly):**
   - Quest detail screen "Find Events" CTA filters for new partner opportunities
   - Suggested events ranked by partner diversity potential
   - Event cards show "+ N new partners" badge
   - Quest progress updates when attending suggested events

3. **Post-Event Suggestions:**
   - After check-in, "People you might enjoy playing with" card appears
   - Suggested partners based on co-attendance, similar reliability scores
   - "Connect" button sends friend request or adds to watch list (Epic 4 integration)
   - Dismiss button with feedback options

4. **Partner Discovery Screen:**
   - Dedicated tab or profile section: "Discover New Partners"
   - Ranked list of partner suggestions with match reasons
   - Filter by sport, location radius, availability
   - "See Events" button for each suggestion shows upcoming events they're attending

**Web (React + Vite):**

1. **Admin Analytics Dashboard:**
   - Suggestion metrics: served count, click-through rate, acceptance rate
   - Partner diversity trends: avg unique partners per user over time
   - Suggestion algorithm performance: conversion from suggestion to co-attendance
   - A/B test results for suggestion placements (event browse vs quest vs post-event)

2. **Host Event Management:**
   - Host dashboard shows "Expected partner diversity" metric for upcoming events
   - Suggestion to "Invite players who haven't met" to increase diversity

### Out of Scope

- ML model training interface (data schema supports ML, but model training is backend-only)
- Real-time collaborative filtering (batch processing nightly for MVP)
- Social graph visualization (network diagram of partner connections deferred)
- Automated friend request sending based on suggestions (requires explicit user action)
- Suggestion explanation detailed breakdown (simple match reasons only)

---

## System Architecture Alignment

### Mobile Architecture

**Screens:**

- `PartnerDiscoveryScreen` (Profile/Discover Tab)
- `SuggestedPartnersModal` (Event Detail, Post-Check-In)
- `QuestDetailScreen` (Enhanced with suggestion filtering)

**Services:**

- `PartnerSuggestionService` (fetch suggestions, track acceptance/dismissal)
- `PartnerService` (existing, extended with suggestion APIs)
- `EventService` (existing, extended with suggestion-filtered event queries)

**Redux Slices:**

- `suggestions.slice.ts` (suggestion state, served suggestions, acceptance tracking)
- `partners.slice.ts` (existing, extended with suggestion metadata)

**Components:**

- `SuggestedPartnerCard` (avatar, name, match score, reasons)
- `SuggestionBadge` (event card overlay: "Play with N new partners")
- `SuggestionFeedbackModal` (dismiss reasons, acceptance confirmation)

### Web Architecture

**Pages:**

- `AdminSuggestionAnalyticsPage` (metrics dashboard)
- `HostEventInsightsPage` (diversity metrics, suggestion impact)

**Services:**

- `SuggestionAnalyticsService` (fetch metrics, A/B test results)

**Components:**

- `SuggestionMetricsCard` (CTR, acceptance rate, diversity uplift)
- `PartnerDiversityChart` (line chart: avg unique partners per user over time)

---

## Detailed Design

### Services and Modules

| Service/Module                 | Responsibility                                                | Key Methods                                                                                                    | Platform    |
| ------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------- |
| **PartnerSuggestionService**   | Fetch partner suggestions, track acceptance/dismissal         | `getSuggestions(userId, filters)`, `acceptSuggestion(suggestionId)`, `dismissSuggestion(suggestionId, reason)` | Mobile, Web |
| **SuggestionAnalyticsService** | Fetch suggestion metrics and performance data                 | `getMetrics()`, `getDiversityTrends()`, `getABTestResults()`                                                   | Web         |
| **EventService (Extended)**    | Filter events by suggestion potential                         | `getEventsBySuggestionScore(userId, minScore)`                                                                 | Mobile      |
| **PartnerService (Extended)**  | Get partner diversity metrics, ML-ready data                  | `getPartnerDiversity(userId)`, `getSuggestionCandidates(userId)`                                               | Mobile, Web |
| **SuggestionStore (Redux)**    | Client-side state for served suggestions, acceptance tracking | `addServedSuggestion()`, `markAccepted()`, `markDismissed()`                                                   | Mobile, Web |

### Data Models and Contracts

```typescript
// Partner Suggestion Models
interface PartnerSuggestion {
  id: string;
  userId: string; // Recipient of suggestion
  suggestedPartnerId: string;
  suggestedPartner: SuggestedPartnerProfile;
  suggestionScore: number; // 0-100
  matchReasons: MatchReason[];
  mutualEventCount: number;
  lastPlayedTogetherAt?: string;
  suggestedEvents: SuggestedEvent[]; // Events where both might attend
  servedAt: string;
  acceptedAt?: string;
  dismissedAt?: string;
  dismissalReason?: string;
  status: 'pending' | 'accepted' | 'dismissed' | 'expired';
}

interface SuggestedPartnerProfile {
  userId: string;
  displayName: string;
  avatar?: string;
  homeCity: string;
  primarySport: string;
  reliabilityScore: number;
  levelBadge: string;
  uniquePartnersCount: number;
  // ML-ready extensibility fields (NFR010)
  skillEstimate?: number; // 1-10 scale (placeholder for ML)
  availabilityVector?: number[]; // Binary vector: [Mon, Tue, Wed, ...] (placeholder for ML)
  interactionHistory?: PartnerInteraction[]; // Event co-attendance history
}

interface MatchReason {
  type:
    | 'low_mutual_play'
    | 'schedule_overlap'
    | 'location_proximity'
    | 'similar_reliability'
    | 'sport_match';
  description: string;
  weight: number; // Contribution to suggestion score
}

interface SuggestedEvent {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  newPartnersCount: number; // Count of suggested partners attending
  diversityPotential: number; // 0-100 score for partner diversity impact
}

interface PartnerInteraction {
  eventId: string;
  eventDate: string;
  interactionType: 'co-attendance' | 'kudos_given' | 'kudos_received';
  timestamp: string;
}

// Suggestion Metrics Models
interface SuggestionMetrics {
  totalServed: number;
  totalAccepted: number;
  totalDismissed: number;
  acceptanceRate: number;
  clickThroughRate: number;
  avgPartnerDiversity: number; // Avg unique partners per user
  diversityUplift: number; // % increase from suggestion feature launch
  lastUpdated: string;
}

interface DiversityTrend {
  date: string;
  avgUniquePartners: number;
  usersWithSuggestions: number;
  usersWithoutSuggestions: number;
}

interface SuggestionPerformance {
  placementType: 'event_browse' | 'quest_detail' | 'post_event';
  servedCount: number;
  acceptanceRate: number;
  clickThroughRate: number;
  avgDiversityImpact: number;
}

// Suggestion Filters
interface SuggestionFilters {
  sport?: string;
  locationRadius?: number; // Miles
  minReliabilityScore?: number;
  minSuggestionScore?: number; // 0-100
  excludeUserIds?: string[];
}
```

### APIs and Interfaces

**Backend API Endpoints (Assumed Complete):**

```typescript
// Partner Suggestion APIs
GET    /api/v1/suggestions/partners?userId={userId}&filters={filters}
  Response: { suggestions: PartnerSuggestion[], total: number }

POST   /api/v1/suggestions/:id/accept
  Response: { success: boolean, partner: SuggestedPartnerProfile }

POST   /api/v1/suggestions/:id/dismiss
  Body: { reason: string }
  Response: { success: boolean }

GET    /api/v1/suggestions/events-by-partner-potential?userId={userId}&minScore=60
  Response: { events: SuggestedEvent[] }

// Partner Diversity APIs (Extended from Epic 4)
GET    /api/v1/partners/diversity?userId={userId}
  Response: { uniquePartnerCount: number, diversityTier: string, partners: Partner[] }

GET    /api/v1/partners/candidates?userId={userId}
  Response: { candidates: SuggestedPartnerProfile[] }

// Suggestion Analytics APIs (Admin Only)
GET    /api/v1/admin/suggestions/metrics
  Response: SuggestionMetrics

GET    /api/v1/admin/suggestions/diversity-trends?days=30
  Response: { trends: DiversityTrend[] }

GET    /api/v1/admin/suggestions/performance
  Response: { byPlacement: SuggestionPerformance[] }
```

**Frontend Service Interfaces:**

```typescript
// PartnerSuggestionService
interface IPartnerSuggestionService {
  getSuggestions(
    userId: string,
    filters?: SuggestionFilters
  ): Promise<{ suggestions: PartnerSuggestion[]; total: number }>;
  acceptSuggestion(
    suggestionId: string
  ): Promise<{ success: boolean; partner: SuggestedPartnerProfile }>;
  dismissSuggestion(suggestionId: string, reason: string): Promise<{ success: boolean }>;
  getEventsBySuggestionPotential(
    userId: string,
    minScore: number
  ): Promise<{ events: SuggestedEvent[] }>;
}

// SuggestionAnalyticsService
interface ISuggestionAnalyticsService {
  getMetrics(): Promise<SuggestionMetrics>;
  getDiversityTrends(days: number): Promise<{ trends: DiversityTrend[] }>;
  getPerformance(): Promise<{ byPlacement: SuggestionPerformance[] }>;
}

// PartnerService (Extended)
interface IPartnerService {
  // Existing methods from Epic 4
  getPartners(userId: string, limit?: number): Promise<Partner[]>;
  getPartnerDiversity(userId: string): Promise<PartnerDiversity>;
  logPartnerInteraction(partnerId: string, eventId: string): Promise<void>;

  // New suggestion-related methods
  getCandidates(userId: string): Promise<SuggestedPartnerProfile[]>;
}
```

### Workflows and Sequencing

**Workflow 1: Event Browse with Partner Suggestions (Mobile)**

1. User opens Events tab, event list loads
2. PartnerSuggestionService.getSuggestions() fetches top 10 suggestions for user
3. For each event: backend calculates suggestion score (count of suggested partners attending)
4. Event cards with suggestion score >60 display "Play with N new partners" badge
5. User taps badge on event card
6. SuggestedPartnersModal opens showing suggested partners for that event
7. Modal displays 3-5 partner cards: avatar, name, match reasons, suggestion score
8. Match reasons: "You've never played together", "Similar reliability", "Lives nearby"
9. User taps "See Profile" on partner card → navigates to PartnerDetailScreen (Epic 4)
10. User closes modal, decides to RSVP to event (standard RSVP flow from Epic 2)
11. On RSVP: backend logs `partner_suggestion_served` event with suggestionIds
12. Post-check-in: backend updates partner diversity, checks if suggestion led to co-attendance

**Workflow 2: Quest-Driven Partner Discovery (Social Butterfly)**

1. User navigates to Quests tab, taps Social Butterfly quest: "Play with 5 New Partners (2/5)"
2. Quest detail screen shows progress bar, partner history, "Find Events" CTA
3. User taps "Find Events" CTA
4. PartnerSuggestionService.getEventsBySuggestionPotential(userId, minScore=70) API call
5. Backend returns events ranked by partner diversity potential (# of new partners attending)
6. Event list displays with "Diversity Potential" badges: "🌟 High", "⭐ Medium"
7. Each event card shows: "+ N new partners" indicator
8. User taps event to view details, suggested partners section appears
9. Suggested partners section: "3 players you haven't met yet" with avatars
10. User RSVPs to event, attends, checks in with 2 new partners
11. Quest progress updates: 2/5 → 4/5
12. Quest completion triggered when 5 unique partners reached
13. Post-completion: Next related quest suggested: "Play with 10 Different Partners"

**Workflow 3: Post-Event Partner Suggestions (Mobile)**

1. User successfully checks in to event
2. Check-in confirmation screen displays: "Great game! ✓ Checked in"
3. After 2s delay: "People you might enjoy playing with" card slides up
4. PartnerSuggestionService.getSuggestions(userId, { sport: eventSport, locationRadius: 25 }) API call
5. Backend analyzes event co-attendees, filters for high-match candidates
6. Suggestion card displays 3 partner profiles: avatar, name, "Played X times together", suggestion score
7. Match reasons: "Similar reliability (0.89)", "Lives nearby (2.3 mi)", "Also plays tennis"
8. User has 3 options per suggestion:
   - "Connect" → Sends friend request (Epic 4 integration)
   - "See Events" → Shows upcoming events partner is attending
   - "Dismiss" → Opens feedback modal with reasons
9. If user taps "Connect": friend request sent, suggestion marked as accepted
10. If user taps "Dismiss": feedback modal appears with options:
    - "Not interested"
    - "Already know them"
    - "Too far away"
    - "Different skill level"
11. Feedback recorded, suggestion dismissed, analytics logged
12. User can swipe card away to dismiss all suggestions

**Workflow 4: Partner Discovery Screen (Dedicated Tab)**

1. User navigates to Profile tab → "Discover New Partners" section (or dedicated tab)
2. PartnerDiscoveryScreen loads with loading skeleton
3. PartnerSuggestionService.getSuggestions(userId) fetches ranked suggestions
4. Screen displays list of 10-20 suggested partners sorted by suggestion score
5. Filter panel at top: Sport selector, Distance radius slider, Min reliability score
6. Each partner card shows:
   - Avatar, name, level badge
   - Suggestion score bar (0-100) with visual indicator
   - Top 2 match reasons: "Never played together", "Lives 1.5 mi away"
   - "X mutual events" indicator (if any)
   - "See Events" button
7. User applies filters: sport=pickleball, radius=10mi, minReliability=0.80
8. List re-filters instantly (client-side if data cached, else API call)
9. User taps "See Events" on partner card
10. EventService.getEventsBySuggestionPotential() filters events where partner is attending
11. Event list displays with "Partner attending" badge
12. User RSVPs to event, partner suggestion marked as "conversion pending"
13. Post-check-in: if co-attendance confirmed, suggestion marked as "accepted"
14. Partner diversity metric updates, suggestion success logged

---

## Non-Functional Requirements

### Performance

- **Suggestion Load Time:** <1s to fetch top 10 suggestions, <2s for full discovery list (50 partners)
- **Event Filtering by Suggestions:** <800ms to filter event list by partner diversity potential
- **Suggestion Score Calculation:** Backend calculates scores nightly (batch), cached for 24h
- **Real-Time Diversity Updates:** Partner diversity metric recalculates within 5s of check-in
- **Client-Side Filtering:** Filter suggestions by sport/location/reliability <300ms (local filter if data cached)
- **Modal Load Time:** Suggested partners modal renders <500ms with 5 partner cards

### Security

- **Suggestion Privacy:** User can opt out of being suggested to others (profile privacy settings)
- **Abuse Prevention:** Rate limit suggestion dismissals (max 50/day) to prevent data poisoning
- **Profile Data Access:** Suggested partner profiles show public data only (no private reliability scores)
- **Suggestion Expiry:** Suggestions expire after 7 days if not accepted/dismissed (reduce stale data)

### Reliability/Availability

- **Offline Caching:** Cache last 10 suggestions locally, display with "Last updated X hours ago" indicator
- **Failed API Graceful Degradation:** If suggestion API fails, hide suggestion badges/widgets, don't block core flows
- **Stale Data Handling:** If suggestions >24h old, show "Suggestions may be outdated" message
- **Fallback Algorithm:** If ML model fails (future), fallback to rule-based algorithm

### Observability

- **Instrumentation Events (FR032):**
  - `partner_suggestion_served`: suggestionId, userId, partnerId, score, placement (event_browse, quest, post_event)
  - `partner_suggestion_accepted`: suggestionId, userId, partnerId, acceptanceMethod (connect, see_events)
  - `partner_suggestion_dismissed`: suggestionId, userId, partnerId, reason
  - `partner_suggestion_converted`: suggestionId, eventId, userId, partnerId (co-attendance confirmed)
  - `suggestion_filter_applied`: userId, filters (sport, radius, reliability)

- **Metrics:**
  - Suggestion click-through rate (CTR): % of served suggestions clicked (target >35%)
  - Suggestion acceptance rate: % of served suggestions accepted (target >15%)
  - Suggestion conversion rate: % of accepted suggestions leading to co-attendance (target >60%)
  - Partner diversity uplift: Avg unique partners pre/post suggestion feature (target +20%)
  - Suggestion placement performance: CTR by placement (event_browse vs quest vs post_event)

---

## Dependencies and Integrations

**Internal Dependencies:**

- Epic 1: User profiles, authentication
- Epic 2: Event model, RSVP data, check-in events
- Epic 3: Reliability scores, level badges
- Epic 4: Partner history, kudos, partner diversity metric, Social Butterfly quest

**External Dependencies:**

- Backend Partner Suggestion Engine: Rule-based algorithm, suggestion scoring
- Backend Partner Diversity Calculator: Unique partner count, 60-day window calculation
- Backend Event Filtering API: Filter events by suggestion potential
- Analytics Service: Suggestion metrics, A/B test tracking

**Third-Party SDKs:**

- None required (uses existing React Native and web dependencies)

---

## Acceptance Criteria (Authoritative)

### AC1: Event Browse Partner Suggestion Badge

1. Event cards display "Play with N new partners" badge when suggestion score >60
2. Badge shows count of suggested partners attending event
3. Tap badge opens SuggestedPartnersModal with 3-5 partner cards
4. Each partner card shows: avatar, name, match reasons (top 2), suggestion score bar
5. Match reasons examples: "Never played together", "Similar reliability", "Lives nearby"
6. User can tap "See Profile" to view full partner profile (Epic 4 PartnerDetailScreen)
7. User can close modal and proceed with standard RSVP flow
8. Suggestion badges only appear for authenticated users with >3 events attended
9. Backend logs `partner_suggestion_served` event when modal opened
10. Suggestion score recalculates nightly, cached for 24h

**Validation:** Browse 10 events, verify badges appear on high-suggestion events, tap badge, confirm partner cards display with correct data

### AC2: Quest Integration (Social Butterfly Quest Filter)

1. Social Butterfly quest detail screen shows "Find Events" CTA
2. Tap CTA triggers event filter: show events with highest partner diversity potential
3. Filtered event list displays "Diversity Potential" badges: 🌟 High (>70), ⭐ Medium (50-70)
4. Each event card shows "+ N new partners" indicator
5. Event detail shows "Suggested Partners" section: avatars of 3-5 new partners attending
6. User RSVPs and attends event with suggested new partners
7. Check-in triggers partner history update, quest progress updates (e.g., 2/5 → 4/5)
8. Quest completion triggered when 5 unique partners reached (within 60-day window)
9. Post-completion: Next related quest suggested: "Play with 10 Different Partners"
10. Analytics logs `partner_suggestion_served` → `partner_suggestion_converted` when co-attendance confirmed

**Validation:** User at 2/5 quest progress, tap "Find Events", RSVP to high-diversity event, check in with 2 new partners, verify progress → 4/5

### AC3: Post-Event Partner Suggestions

1. After successful check-in, "People you might enjoy playing with" card appears after 2s delay
2. Card displays 3 suggested partner profiles with avatars, names, match reasons
3. Match reasons include: reliability similarity, location proximity, sport match
4. Each suggestion has 3 action buttons: "Connect", "See Events", "Dismiss"
5. "Connect" button sends friend request (or adds to watch list), marks suggestion as accepted
6. "See Events" button navigates to event list filtered for partner's upcoming events
7. "Dismiss" button opens feedback modal with reasons: "Not interested", "Already know them", "Too far", "Different skill level"
8. Feedback recorded, suggestion dismissed, analytics logged
9. User can swipe card away to dismiss all suggestions
10. Post-event suggestions only appear for users with <10 unique partners (encourage low-diversity users)

**Validation:** Check in to event, post-check-in card appears, tap "Connect", verify friend request sent, suggestion marked accepted

### AC4: Partner Discovery Screen

1. "Discover New Partners" section accessible from Profile tab or dedicated Discover tab
2. Screen displays ranked list of 10-20 suggested partners sorted by suggestion score
3. Filter panel includes: Sport selector, Distance radius slider (5-50 mi), Min reliability score (0-1.0)
4. Each partner card shows:
   - Avatar, name, level badge, home city
   - Suggestion score bar (0-100) with visual indicator
   - Top 2 match reasons
   - "X mutual events" count (if any co-attendance history)
   - "See Events" button
5. Apply filters: list re-filters instantly (<300ms if cached, <1s if API call)
6. Tap "See Events" on partner card → event list filtered for partner's upcoming events
7. Event cards show "Partner attending" badge with partner's avatar
8. User RSVPs to event, suggestion marked as "conversion pending"
9. Post-check-in: if co-attendance confirmed, suggestion marked as "accepted", partner diversity updates
10. Empty state: "No suggestions yet. Attend more events to get personalized recommendations."

**Validation:** Navigate to Discover Partners, verify 10+ suggestions load, apply filters (sport=pickleball, radius=10mi), verify list updates, tap "See Events", confirm partner's events displayed

### AC5: Suggestion Dismissal Feedback and Tracking

1. Dismiss button available on all suggestion cards (event browse, post-event, discovery screen)
2. Tap "Dismiss" opens FeedbackModal with 4 reasons:
   - "Not interested"
   - "Already know them"
   - "Too far away"
   - "Different skill level"
3. User selects reason, taps "Submit Feedback"
4. API call: PartnerSuggestionService.dismissSuggestion(suggestionId, reason)
5. Success: suggestion removed from UI, analytics logged (`partner_suggestion_dismissed`)
6. Dismissed suggestions don't reappear for 30 days
7. User can dismiss max 50 suggestions/day (rate limit prevents abuse)
8. Analytics dashboard shows dismissal reasons breakdown for algorithm tuning
9. Feedback used to improve suggestion algorithm (reduce "Already know them" dismissals)
10. User can undo dismissal within 5s ("Undo" toast appears after dismissal)

**Validation:** Dismiss 5 suggestions with different reasons, verify dismissed suggestions removed, check analytics dashboard shows correct dismissal counts

### AC6: Admin Analytics Dashboard (Web)

1. Admin Suggestion Analytics page displays key metrics cards:
   - Total Suggestions Served (all-time)
   - Acceptance Rate (% accepted / served)
   - Click-Through Rate (% clicked / served)
   - Avg Partner Diversity (unique partners per user)
   - Diversity Uplift (% increase since feature launch)
2. Diversity Trends line chart: avg unique partners per user over 30 days
3. Suggestion Performance table by placement:
   - Placement (event_browse, quest_detail, post_event)
   - Served Count
   - Acceptance Rate
   - CTR
   - Avg Diversity Impact
4. Dismissal Reasons pie chart: breakdown of why users dismiss suggestions
5. All metrics auto-refresh every 60s
6. Export CSV button for suggestion performance data
7. Date range filter: last 7d, 30d, 90d, all-time
8. Metrics load from SuggestionAnalyticsService.getMetrics(), getDiversityTrends(), getPerformance()

**Validation:** Load admin dashboard, verify all metrics display, check trends chart renders correctly, export CSV, verify data matches dashboard

---

## Traceability Mapping

| Acceptance Criteria | PRD Functional Requirements                  | User Journeys | Architecture Components                          | Stories  |
| ------------------- | -------------------------------------------- | ------------- | ------------------------------------------------ | -------- |
| AC1                 | FR021 (Suggestion engine), FR036 (Diversity) | Journey 3     | SuggestedPartnersModal, EventCard                | 7-3, 7-4 |
| AC2                 | FR021, FR036, Journey 3 (Quest flow)         | Journey 3     | QuestDetailScreen, EventFilters                  | 7-3      |
| AC3                 | FR021, FR036                                 | Journey 3     | PostEventSuggestionCard                          | 7-4      |
| AC4                 | FR021, NFR010 (ML-ready schema)              | Journey 3     | PartnerDiscoveryScreen, PartnerSuggestionService | 7-1, 7-2 |
| AC5                 | FR032 (Instrumentation)                      | N/A           | FeedbackModal, Analytics                         | 7-5      |
| AC6                 | FR032 (Analytics)                            | N/A           | AdminAnalyticsPage, SuggestionAnalyticsService   | 7-5      |

**Story Breakdown (Estimated 10-13 stories):**

- Story 7-1: Rule-Based Suggestion Service Backend Integration (AC4)
- Story 7-2: ML-Ready Data Schema Implementation (AC4, NFR010)
- Story 7-3: Quest Flow Suggestion Surfacing (AC2)
- Story 7-4: Event Browse Suggestion Badges & Post-Event Cards (AC1, AC3)
- Story 7-5: Suggestion Instrumentation & Analytics Dashboard (AC5, AC6)
- Story 7-6: Partner Discovery Screen UI
- Story 7-7: Suggestion Dismissal & Feedback Flows
- Story 7-8: Suggestion Filtering & Ranking
- Story 7-9: Diversity Metric Integration
- Story 7-10: Suggestion Acceptance & Conversion Tracking

---

## Risks, Assumptions, Open Questions

**Risks:**

- Suggestion cold start problem: New users (<3 events) have insufficient data for accurate suggestions
- Suggestion fatigue: Over-serving suggestions may annoy users, leading to high dismissal rates
- Privacy concerns: Users may feel uncomfortable being suggested to strangers
- Algorithm bias: Rule-based algorithm may favor certain user types (high reliability, urban locations)
- Conversion tracking accuracy: Co-attendance after suggestion may be coincidental, not causal

**Assumptions:**

- Backend suggestion algorithm calculates scores nightly (batch processing), cached for 24h
- Suggestion score >60 indicates high partner diversity potential (validated by product team)
- Users want to expand social circles (Social Butterfly quest completion rate >50% validates this)
- Match reasons are self-explanatory (no detailed scoring breakdown needed for MVP)
- ML model integration deferred to post-MVP (data schema prepared, model training backend-only)

**Open Questions:**

- Should suggestions expire after 7 days or 30 days? (7 days assumed for MVP)
- What is the optimal suggestion score threshold for badges? (>60 assumed, needs A/B testing)
- Should "Connect" action require mutual acceptance or auto-add to watch list? (Auto-add watch list for MVP)
- How should we handle suggestions for users who opt out of being suggested? (Exclude from candidate pool)
- What is the maximum suggestions served per user per day? (No limit for MVP, monitor fatigue)

---

## Test Strategy Summary

**Unit Tests (70%):**

- PartnerSuggestionService: Fetch suggestions, accept/dismiss, filter logic
- SuggestionAnalyticsService: Metrics calculation, trend aggregation
- EventService (extended): Filter events by suggestion potential
- PartnerService (extended): Get candidates, diversity metrics
- Redux Slices: Suggestion state management, acceptance tracking

**Integration Tests (20%):**

- Event browse suggestion badge flow: Badge display → tap → modal → partner cards render
- Quest filter flow: Tap "Find Events" → API call → event list filtered → diversity badges
- Post-event suggestion flow: Check-in → suggestion card → accept/dismiss → analytics logged
- Discovery screen filter flow: Apply filters → API call → list updates → partner cards render
- Admin dashboard load: Fetch metrics → charts render → CSV export

**E2E Tests (10%):**

- User browses events → taps suggestion badge → views partners → RSVPs → checks in → co-attendance confirmed → diversity updated
- User completes Social Butterfly quest → taps "Find Events" → filters events → RSVPs to high-diversity event → quest completes
- User checks in → post-event suggestions appear → taps "Connect" → friend request sent → suggestion accepted
- Admin views analytics dashboard → metrics load → exports CSV → data correct

**Coverage Targets:**

- Unit tests: 80% line coverage
- Integration tests: All 6 AC scenarios validated
- E2E tests: Critical paths (event browse suggestions, quest flow, post-event suggestions) verified

**Testing Tools:**

- Jest + React Native Testing Library for unit/component tests
- Detox for E2E mobile testing
- Vitest for web unit tests
- Playwright for web E2E testing
- Mock Service Worker (MSW) for API mocking

---

**End of Epic 7 Frontend Technical Specification**

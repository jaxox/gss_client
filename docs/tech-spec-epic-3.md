# Epic Technical Specification: Gamification Core (XP, Levels, Badges, Streaks)

Date: November 9, 2025
Author: Jay
Epic ID: 3
Status: Draft

---

## Overview

Epic 3 implements the core gamification mechanics that drive habit formation and user engagement in the GSS Client. This epic focuses on building transparent progression systems through XP accumulation, level advancement, badge unlocks, and streak tracking. The gamification layer serves as the primary psychological reinforcement mechanism, rewarding consistent attendance, social participation, and community contribution while maintaining accessibility for users of all skill levels. This foundation enables the casual achievement layer (Epic 3) that precedes the opt-in competitive features (future epic).

**Key Value Proposition:** Transform recreational sports participation from sporadic activity into sustainable habits through visible progress, achievement recognition, and social reinforcement - all without monetary pressure or skill-based gatekeeping.

## Objectives and Scope

**In Scope:**

- XP computation service with configurable rule engine (FR013)
- Level progression system with thresholds 1-10 and visual unlocks (FR014)
- Badge system with 15-20 initial badge definitions and unlock engine (FR016)
- Streak tracking logic for "3 sessions in 10 days" baseline (FR015)
- At-risk streak notifications when 48h remain before window expires (FR035)
- Weekly email digest summarizing XP, streaks, upcoming events (FR033 - minimal)
- Progress visualization UI components (level progress bars, badge galleries, streak displays)
- Gamification state management in Redux store
- Mock gamification service for frontend development
- Configuration-driven rules (NFR008) for XP values, thresholds, badge criteria

**Out of Scope:**

- Quest system (deferred to Epic 4: Social Interaction & Quests)
- Kudos system (Epic 4)
- Partner diversity metrics (Epic 4)
- Competitive layer features (future epic, gated after 5 casual events)
- Leaderboards and rankings (future epic)
- Event creation/RSVP flows (Epic 2 dependency)
- Advanced analytics dashboard (Epic 8)

## System Architecture Alignment

This epic implements the gamification architecture components defined in the architecture document:

- **Gamification State:** Redux store manages XP, levels, badges, streaks with optimistic updates
- **Service Layer:** `gamification.service.ts` interface with mock implementation for development
- **Data Models:** TypeScript types for `GamificationState`, `Badge`, `Quest`, `Streak` entities
- **UI Components:** Custom React Native Paper extensions for progress indicators, badge displays, streak trackers
- **Constants:** Externalized configuration for XP values, level thresholds, badge criteria
- **Analytics:** Event instrumentation for XP gains, badge unlocks, streak preservation
- **State Sync:** TanStack Query for cache management and background sync of gamification data

**Architectural Decisions:**

- **Client-Side Calculation Preview:** XP and streak calculations previewed client-side for instant feedback, validated by backend
- **Config-Driven Rules:** All XP values, level thresholds, badge unlock criteria stored in `gamification.constants.ts` for easy tuning
- **Optimistic UI:** Badge unlocks and level-ups animate immediately, with rollback if backend validation fails
- **Progressive Enhancement:** Gamification data loads asynchronously, app remains functional if gamification service unavailable

## Detailed Design

### Services and Modules

| Module                  | Responsibility                            | Inputs                            | Outputs                               | Owner                                                                 |
| ----------------------- | ----------------------------------------- | --------------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| **GamificationService** | XP, badges, streaks, level APIs           | User actions, event participation | XP deltas, badge unlocks, level-ups   | shared/services/api/gamification.service.ts                           |
| **XPCalculator**        | Client-side XP preview calculations       | Action types, event data          | Estimated XP gains                    | shared/utils/xpCalculator.ts                                          |
| **BadgeEngine**         | Badge unlock logic and eligibility checks | User stats, badge criteria        | Eligible badges, unlock notifications | shared/utils/badgeEngine.ts                                           |
| **StreakTracker**       | Streak calculation and risk detection     | Attendance history, current date  | Current streak, at-risk status        | shared/utils/streakTracker.ts                                         |
| **GamificationStore**   | Gamification state management             | API responses, user actions       | Redux state, loading indicators       | mobile/src/store/gamification/, web/src/store/gamification/           |
| **ProgressComponents**  | XP, level, badge, streak UI               | Gamification state                | Visual progress displays              | mobile/src/components/gamification/, web/src/components/gamification/ |
| **NotificationService** | Streak at-risk alerts, badge unlocks      | Streak status, badge events       | Push notifications, in-app alerts     | mobile/src/services/notifications/                                    |

### Data Models and Contracts

```typescript
// Core Gamification Models
interface GamificationState {
  userId: string;
  currentXP: number;
  level: number;
  xpForNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  streakAtRisk: boolean;
  streakExpiresAt?: string; // ISO timestamp
  badges: UserBadge[];
  activeQuests: Quest[]; // Populated in Epic 4
  completedQuests: Quest[]; // Populated in Epic 4
  reliabilityScore: number; // From Epic 1, influences gamification
  partnerCount: number; // From Epic 4
  eventsAttended: number;
  lastEventDate?: string;
  weeklyDigestOptIn: boolean;
  lastUpdated: string;
}

interface UserBadge {
  badgeId: string;
  name: string;
  description: string;
  iconUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt: string;
  isNew: boolean; // UI flag for "new" indicator
}

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockCriteria: BadgeCriteria;
  category: 'attendance' | 'social' | 'streak' | 'reliability' | 'exploration' | 'achievement';
}

interface BadgeCriteria {
  type:
    | 'attendance_count'
    | 'streak_milestone'
    | 'kudos_given'
    | 'partner_count'
    | 'reliability_threshold'
    | 'event_variety'
    | 'first_event'
    | 'level_milestone';
  threshold?: number; // e.g., 10 events for "Veteran" badge
  minValue?: number; // e.g., 85% reliability for "Reliable Attendee"
  sportTypes?: string[]; // e.g., ['pickleball', 'tennis'] for sport-specific badges
  combinedConditions?: BadgeCriteria[]; // For composite badges
}

interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastEventDate: string;
  streakWindowDays: number; // Default 10, configurable
  streakRequirement: number; // Default 3 events, configurable
  atRisk: boolean;
  expiresAt?: string; // When streak will break if no event attended
}

interface XPEvent {
  eventType:
    | 'event_attendance'
    | 'first_time_partner'
    | 'kudos_received'
    | 'kudos_given'
    | 'quest_completed'
    | 'streak_milestone'
    | 'badge_unlock'
    | 'level_up';
  xpGained: number;
  multiplier?: number; // e.g., 1.5x for weekend events (future feature)
  metadata?: Record<string, any>; // Event-specific context
  timestamp: string;
}

interface LevelThreshold {
  level: number;
  xpRequired: number; // Total cumulative XP needed
  xpForNext: number; // XP needed to reach next level
  title: string; // e.g., "Rookie", "Player", "Athlete", "Pro"
  badgeReward?: string; // Optional badge unlock on level-up
  unlocksFeature?: string; // e.g., "Competitive opt-in" at Level 5
}

// API Request/Response Types
interface GetGamificationStateRequest {
  userId: string;
}

interface GetGamificationStateResponse {
  success: boolean;
  data: GamificationState;
}

interface AwardXPRequest {
  userId: string;
  eventType: string;
  metadata?: Record<string, any>;
}

interface AwardXPResponse {
  success: boolean;
  data: {
    xpGained: number;
    newTotalXP: number;
    levelUp?: {
      newLevel: number;
      title: string;
      badgeUnlocked?: UserBadge;
    };
    badgesUnlocked?: UserBadge[]; // Badges unlocked as result of XP gain
  };
}

interface GetBadgesRequest {
  userId: string;
  category?: string;
  includeUnlocked?: boolean;
  includeLocked?: boolean;
}

interface GetBadgesResponse {
  success: boolean;
  data: {
    unlocked: UserBadge[];
    locked: Badge[]; // Locked badges with progress towards unlock
    progress: Record<string, number>; // Badge ID -> % progress
  };
}

interface GetStreakRequest {
  userId: string;
}

interface GetStreakResponse {
  success: boolean;
  data: {
    streak: Streak;
    upcomingEvents?: Event[]; // Suggested events to preserve streak (if at risk)
  };
}

interface UpdateDigestPreferenceRequest {
  userId: string;
  optIn: boolean;
}

// Weekly Digest Data (Epic 3 minimal implementation)
interface WeeklyDigest {
  userId: string;
  weekStart: string;
  weekEnd: string;
  eventsAttended: number;
  xpGained: number;
  badgesUnlocked: UserBadge[];
  currentStreak: number;
  upcomingRSVPs: Event[];
}
```

### APIs and Interfaces

```typescript
// Gamification Service Interface (Mock + Real Implementation)
interface IGamificationService {
  // State Management
  getGamificationState(userId: string): Promise<GamificationState>;
  refreshGamificationState(userId: string): Promise<GamificationState>;

  // XP Management
  awardXP(request: AwardXPRequest): Promise<AwardXPResponse>;
  getXPHistory(userId: string, limit?: number): Promise<XPEvent[]>;

  // Badge Management
  getBadges(request: GetBadgesRequest): Promise<GetBadgesResponse>;
  getBadgeProgress(
    userId: string,
    badgeId: string
  ): Promise<{ progress: number; unlocked: boolean }>;
  markBadgeAsSeen(userId: string, badgeId: string): Promise<void>;

  // Streak Management
  getStreak(userId: string): Promise<GetStreakResponse>;
  checkStreakAtRisk(userId: string): Promise<{ atRisk: boolean; expiresAt?: string }>;

  // Level Management
  getLevelThresholds(): Promise<LevelThreshold[]>;
  getNextLevelProgress(
    userId: string
  ): Promise<{ currentXP: number; nextLevelXP: number; progress: number }>;

  // Weekly Digest
  getWeeklyDigest(userId: string): Promise<WeeklyDigest>;
  updateDigestPreference(request: UpdateDigestPreferenceRequest): Promise<void>;
}

// Mock Implementation Strategy
class MockGamificationService implements IGamificationService {
  private mockState: Map<string, GamificationState> = new Map();
  private mockBadges: Badge[] = INITIAL_BADGE_DEFINITIONS;

  async getGamificationState(userId: string): Promise<GamificationState> {
    // Return realistic mock data with simulated latency
    await this.simulateLatency(300);
    return this.mockState.get(userId) || this.createDefaultState(userId);
  }

  async awardXP(request: AwardXPRequest): Promise<AwardXPResponse> {
    // Simulate XP award with level-up and badge unlock logic
    await this.simulateLatency(500);
    const xpGained = this.calculateXP(request.eventType);
    const state = this.mockState.get(request.userId);
    // ... level-up and badge unlock logic
    return { success: true, data: { xpGained, newTotalXP: state.currentXP } };
  }

  // ... other mock methods
}
```

### Workflows and Sequencing

#### Workflow 1: XP Award Flow (Post-Event Check-In)

```text
1. User completes event check-in (Epic 2)
2. CheckInService triggers XP award event
3. GamificationService.awardXP(eventType='event_attendance')
4. Backend calculates XP (50 base + any bonuses)
5. Backend checks for level-up (currentXP >= nextLevelThreshold)
6. Backend checks for badge unlocks (attendance count reached threshold)
7. Response returns: XP gained, level-up data, badge unlocks
8. Frontend Redux store updates optimistically
9. UI animations trigger:
   - XP gain notification (+50 XP)
   - Level-up celebration (if triggered)
   - Badge unlock animation (if triggered)
10. Background sync validates optimistic update
```

#### Workflow 2: Badge Unlock Flow

```text
1. User action triggers badge eligibility check
   - Event attendance milestone
   - Kudos sent/received threshold
   - Partner diversity achieved
   - Reliability score threshold
2. BadgeEngine evaluates unlock criteria
3. If eligible:
   - Badge marked as unlocked
   - XP reward awarded
   - Push notification sent
   - In-app celebration animation
4. Badge marked as "new" in UI
5. User taps badge to view details
6. Badge marked as "seen"
7. Badge displayed in profile gallery
```

#### Workflow 3: Streak Tracking and At-Risk Notification

```text
1. Daily cron job (backend) evaluates all user streaks
2. For each user:
   - Calculate days since last event
   - Check if streak at risk (7+ days since last event)
   - Calculate expiration timestamp (10 days from last event)
3. If at risk:
   - Mark streak as at-risk
   - Trigger push notification (48h before expiration)
   - Include suggested events to preserve streak
4. User taps notification:
   - Opens app to event browse screen
   - Filters show nearby events within streak window
   - RSVP flow highlights "Preserve your streak!" message
5. User attends event and checks in:
   - Streak continues (e.g., Day 5 → Day 6)
   - At-risk flag cleared
   - Celebration notification: "Streak preserved! 🔥"
```

#### Workflow 4: Level-Up Flow

```text
1. XP award pushes user over level threshold
2. Backend calculates new level and title
3. Check if level-up unlocks badge or feature
4. Response includes:
   - New level number
   - New title (e.g., "Athlete")
   - Badge reward (if applicable)
   - Feature unlock (e.g., "Competitive opt-in" at Level 5)
5. Frontend triggers level-up animation:
   - Full-screen celebration overlay
   - Confetti animation
   - New title and badge display
   - Feature unlock announcement (if applicable)
6. User dismisses celebration
7. Profile updated with new level and title
```

#### Workflow 5: Weekly Digest Generation (Backend)

```text
1. Weekly cron job (Sunday night) generates digests
2. For each opted-in user:
   - Query events attended in past 7 days
   - Sum XP gained
   - List badges unlocked
   - Get current streak status
   - Query upcoming RSVPs (next 7 days)
3. Generate email HTML from template
4. Send via email service (SendGrid/AWS SES)
5. Log delivery status for analytics
```

## Non-Functional Requirements

### Performance

**Target Metrics:**

- **XP Award Latency:** p95 < 500ms from check-in to XP notification display
- **Badge Unlock Latency:** p95 < 1000ms from eligibility to unlock animation
- **Gamification State Load:** p95 < 800ms cold load, < 200ms cached load
- **Level-Up Animation:** 60 FPS animation, < 3 seconds duration
- **Streak Calculation:** Daily cron job completes for 5K users in < 5 minutes
- **Memory Footprint:** Gamification state < 50KB per user in Redux store

**Optimization Strategies:**

- TanStack Query caching for gamification state (5-minute stale time)
- Optimistic UI updates for XP gains (instant feedback, validated async)
- Badge unlock logic runs client-side for instant eligibility preview
- Level-up animations use React Native Reanimated for 60 FPS
- Weekly digest generation batched (100 users per batch, queued)

### Security

**Security Requirements:**

- **XP Tampering Prevention:** All XP awards validated server-side, client calculations are preview-only
- **Badge Unlock Validation:** Badge unlock criteria evaluated server-side, client-side checks are hints
- **API Authentication:** All gamification endpoints require valid JWT token
- **Rate Limiting:** Max 10 badge checks per minute per user to prevent API abuse
- **Input Validation:** XP event metadata sanitized to prevent injection attacks
- **Audit Logging:** All XP awards, badge unlocks, level-ups logged with timestamp and source

**Security Implementation:**

```typescript
// Server-side XP validation
function validateXPAward(eventType: string, metadata: any): boolean {
  // Verify event exists and user attended
  // Check for duplicate XP award (idempotency)
  // Validate metadata integrity
  return true;
}

// Audit logging
function logGamificationEvent(userId: string, eventType: string, details: any) {
  auditLogger.info({
    userId,
    eventType,
    details,
    timestamp: new Date().toISOString(),
    source: 'gamification-service',
  });
}
```

### Reliability/Availability

**Availability Targets:**

- **Gamification Service Uptime:** 99.5% (allows 3.6 hours downtime/month)
- **Graceful Degradation:** If gamification service unavailable, app remains functional (XP/badges disabled)
- **Background Sync:** Failed XP awards queued locally, retried on reconnection
- **Streak Calculation Reliability:** Cron job failures trigger alert, manual recovery within 1 hour

**Reliability Strategies:**

- **Fallback Mode:** If gamification API fails, display last cached state with "offline" indicator
- **Retry Logic:** Failed XP award requests retried 3 times with exponential backoff
- **Local Queue:** XP events queued locally if offline, synced when connection restored
- **Monitoring:** Gamification service health checks every 60 seconds, alert on 3 consecutive failures

### Observability

**Metrics to Track:**

- **XP Distribution:** Average XP per user per week, p50/p90/p99
- **Badge Unlock Rate:** % of users unlocking each badge, median time to unlock
- **Streak Retention:** % of users maintaining 7-day streak, streak break rate
- **Level Progression:** Median time to reach each level, level distribution histogram
- **At-Risk Notification Effectiveness:** % of at-risk users who preserve streak after notification
- **Weekly Digest Engagement:** Open rate, click-through rate to app

**Logging Strategy:**

```typescript
// Structured logging for analytics
logger.info('xp_awarded', {
  userId,
  eventType,
  xpGained,
  newTotalXP,
  levelUp: boolean,
  timestamp,
});

logger.info('badge_unlocked', {
  userId,
  badgeId,
  badgeName,
  rarity,
  xpReward,
  timestamp,
});

logger.info('streak_preserved', {
  userId,
  streakCount,
  wasAtRisk: boolean,
  timestamp,
});
```

## Dependencies and Integrations

**Epic Dependencies:**

- **Epic 1 (Platform Foundation):** Requires user authentication, profile management, storage service
- **Epic 2 (Event Lifecycle):** Requires event attendance data for XP awards, streak tracking
- **Blocks Epic 4 (Social Interaction):** Epic 4 quest system depends on XP/badge infrastructure
- **Blocks Epic 5 (Notifications):** Streak at-risk notifications depend on streak tracking

**External Integrations:**

- **Push Notification Service:** Firebase Cloud Messaging (FCM) for streak at-risk alerts
- **Email Service:** SendGrid or AWS SES for weekly digest emails
- **Analytics Service:** Firebase Analytics for gamification event tracking
- **Backend API:** REST endpoints for XP, badges, streaks, digest management

**Shared Components:**

- **Storage Service:** Secure storage for cached gamification state (Epic 1)
- **Notification Service:** Push notification infrastructure (shared with Epic 5)
- **HTTP Client:** Ky HTTP client with auth interceptors (Epic 1)

## Acceptance Criteria (Authoritative)

### AC1: XP Computation Service

1. XP awarded for event attendance (50 base XP, configurable)
2. XP awarded for first-time partner (25 bonus XP, Epic 4 integration)
3. XP awarded for kudos received/given (10 XP each, Epic 4 integration)
4. XP awarded for quest completion (100 XP, Epic 4 integration)
5. XP rules stored in `gamification.constants.ts` for easy configuration
6. XP history API returns last 50 XP events with timestamps
7. Client-side XP calculator provides instant preview (validated by backend)

### AC2: Level Progression System

1. Levels 1-10 defined with cumulative XP thresholds
2. Level titles displayed: Rookie (L1), Player (L2-3), Athlete (L4-6), Pro (L7-9), Champion (L10)
3. Level-up triggers full-screen celebration animation
4. Level-up unlocks visual badge (e.g., "Level 5 Champion" badge)
5. Level 5 unlock displays "Competitive opt-in" prompt (future epic enabler)
6. Level progress bar visible in profile with "X / Y XP to next level"
7. Level-up events logged for analytics

### AC3: Badge System

1. 15-20 initial badges defined across categories:
   - **Attendance:** Newcomer (1 event), Regular (5 events), Veteran (10 events), Elite (25 events)
   - **Streak:** Streak Starter (3-day), Streak Master (7-day), Unstoppable (30-day)
   - **Social:** Good Sport (10 kudos given), Social Butterfly (play with 10 partners)
   - **Reliability:** Reliable Attendee (85%+ reliability, 10+ events)
   - **Exploration:** Explorer (attend 5 different venues), Sport Sampler (try 3 sports)
   - **Achievement:** First Event, Level 5, Level 10, 100 Events Milestone
2. Badge unlock triggers animation with confetti effect
3. Badge gallery displays unlocked badges with rarity indicators
4. Locked badges visible with progress bars ("3 / 5 events to unlock")
5. Badge unlock awards bonus XP (common: 50, uncommon: 100, rare: 150, epic: 300, legendary: 500)
6. Badge details modal shows unlock criteria, rarity, XP reward, unlock date

### AC4: Streak Tracking

1. Streak defined as "3 events attended in 10-day rolling window"
2. Streak count displayed in profile and event check-in flow
3. Streak at-risk status calculated daily (7+ days since last event)
4. Push notification sent when 48h remain before streak expires
5. Notification includes 3 suggested nearby events to preserve streak
6. Streak preserved on event check-in (current streak increments)
7. Streak breaks silently (no punishment), restart encouraged with "Start a new streak!"
8. Longest streak saved and displayed in profile ("Personal best: 15 days")

### AC5: At-Risk Streak Notifications

1. Daily cron job evaluates all user streaks
2. At-risk users identified (7+ days since last event, streak > 0)
3. Push notification sent: "Your 5-day streak expires in 2 days! 🔥"
4. Notification deep-links to event browse with suggested events
5. In-app banner displays "Streak at risk" in profile
6. Notification respects user preference center (can disable streak notifications)
7. Notification effectiveness tracked (% of users who preserve streak)

### AC6: Weekly Digest Email

1. Weekly email sent to opted-in users (default: opt-out)
2. Email content includes:
   - Events attended this week (count + list)
   - XP gained this week (total + breakdown)
   - Badges unlocked this week (icons + names)
   - Current streak status ("5-day streak! Keep it going!")
   - Upcoming RSVPs (next 7 days)
3. Email template responsive (mobile and desktop)
4. Unsubscribe link included in footer
5. Email delivery logged for analytics (sent, opened, clicked)
6. Preference toggle available in app settings

### AC7: Progress Visualization UI

1. XP progress bar in profile with current level and next level
2. Badge gallery grid layout (3 columns mobile, 5 columns web)
3. Streak indicator with flame icon and current streak count
4. Level-up animation full-screen with confetti and title reveal
5. Badge unlock animation modal with badge zoom-in effect
6. XP gain toast notification on check-in (+50 XP animation)
7. Progress components accessible (screen reader labels, keyboard navigation)

## Traceability Mapping

| Acceptance Criteria            | Functional Requirements | Component/API                                    | Test Strategy                                                        |
| ------------------------------ | ----------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| **AC1: XP Computation**        | FR013                   | `GamificationService.awardXP`, `xpCalculator.ts` | Unit tests for XP rules, integration tests for XP award flow         |
| **AC2: Level Progression**     | FR014                   | `LevelThresholds`, `GamificationStore`           | Unit tests for level calculations, E2E test for level-up             |
| **AC3: Badge System**          | FR016                   | `BadgeEngine`, `BadgeGallery`                    | Unit tests for badge unlock logic, E2E test for unlock flow          |
| **AC4: Streak Tracking**       | FR015                   | `StreakTracker`, `StreakIndicator`               | Unit tests for streak calculation, integration test for streak logic |
| **AC5: At-Risk Notifications** | FR035                   | `NotificationService`, cron job                  | Integration test for notification trigger, E2E test for deep-link    |
| **AC6: Weekly Digest**         | FR033                   | Email service, digest template                   | Integration test for digest generation, E2E test for email delivery  |
| **AC7: Progress UI**           | All                     | React Native Paper components, animations        | Component tests for UI, visual regression tests                      |

## Risks, Assumptions, Open Questions

### Risks

#### R1: XP Inflation Risk (HIGH)

- **Risk:** Users accumulate XP too quickly, trivializing progression
- **Impact:** Reduced engagement, levels 1-10 reached in 2 weeks instead of 3 months
- **Mitigation:** XP values tuned based on target progression curve (Level 5 in 4 weeks), A/B testing planned
- **Monitoring:** Track median time to each level, adjust XP values via config if needed

#### R2: Badge Unlock Frequency (MEDIUM)

- **Risk:** Too many badges unlock too quickly, reducing specialness
- **Impact:** Badge fatigue, users ignore unlock notifications
- **Mitigation:** Badge criteria thresholds calibrated for 1 badge every 2-3 weeks for active users
- **Monitoring:** Track badge unlock rate, user feedback on badge value

#### R3: Streak Anxiety (MEDIUM)

- **Risk:** Streak tracking creates pressure, users feel obligated to attend events
- **Impact:** Negative psychological effect, opposite of intended habit formation
- **Mitigation:** Streak breaks handled gracefully (no punishment), optional streak notifications, "life happens" messaging
- **Monitoring:** Survey users on streak perception, track opt-out rate for streak notifications

#### R4: Backend Dependency (HIGH)

- **Risk:** Gamification service unavailable blocks core feature
- **Impact:** No XP awards, badge unlocks, streak tracking during downtime
- **Mitigation:** Graceful degradation (display cached state), local XP queue for retry
- **Monitoring:** Gamification service uptime SLA 99.5%, alerts on failures

### Assumptions

#### A1: Event Attendance Data Available

- **Assumption:** Epic 2 event check-in flow provides attendance data for XP awards
- **Validation:** Epic 2 must complete Story 2.3 (QR Check-In) before Epic 3 integration
- **Contingency:** Mock attendance data for Epic 3 development, real integration in Story 3.7

#### A2: Push Notification Infrastructure

- **Assumption:** FCM configured for streak at-risk notifications
- **Validation:** FCM setup in Epic 1 or parallel task
- **Contingency:** In-app notifications only if push unavailable (reduced effectiveness)

#### A3: Email Service Configured

- **Assumption:** SendGrid or AWS SES ready for weekly digest
- **Validation:** Email service setup in Epic 1 or parallel task
- **Contingency:** Defer weekly digest to future sprint if email unavailable

#### A4: User Engagement with Gamification

- **Assumption:** 60%+ of users engage with XP/badges (view progress, unlock badges)
- **Validation:** Analytics tracking in AC7, user interviews post-launch
- **Contingency:** Reduce gamification prominence if engagement < 40%

### Open Questions

#### Q1: XP Value Calibration

- **Question:** What XP values ensure Level 5 reached in 4 weeks for average user (2 events/week)?
- **Current Approach:** 50 XP per event, 200 XP cumulative for Level 2, 800 XP for Level 5 (10 events minimum)
- **Resolution Needed:** A/B test XP values in beta, adjust based on progression data

#### Q2: Badge Icon Design

- **Question:** Should badge icons be custom illustrations or emoji-based?
- **Current Approach:** Use emoji as placeholders (🏆, 🔥, ⭐), commission illustrations in future sprint
- **Resolution Needed:** Design review with UX designer, budget for custom icons

#### Q3: Streak Window Flexibility

- **Question:** Should streak window be configurable per user (e.g., 7 days for busy users)?
- **Current Approach:** Fixed 10-day window for all users, "3 events in 10 days" baseline
- **Resolution Needed:** User feedback post-launch, potential feature in future epic

#### Q4: Level Titles Branding

- **Question:** Should level titles be sport-specific (e.g., "Pickleball Pro") or generic ("Pro")?
- **Current Approach:** Generic titles for MVP (Rookie, Player, Athlete, Pro, Champion)
- **Resolution Needed:** Product decision, potential customization in future

#### Q5: Competitive Layer Unlock Messaging

- **Question:** How should Level 5 competitive opt-in be presented to avoid pressure?
- **Current Approach:** Friendly prompt: "You've unlocked competitive features! Try them out? (Optional)"
- **Resolution Needed:** UX copy review, A/B test messaging variants

## Test Strategy Summary

### Test Pyramid Approach

**Unit Tests (70% coverage target)**

- **XP Calculator:** Test all XP rules (attendance, kudos, quest, streak bonus)
- **Badge Engine:** Test badge unlock logic for all 15-20 badges
- **Streak Tracker:** Test streak calculation, at-risk detection, expiration logic
- **Level Thresholds:** Test level-up calculations, XP requirements
- **Mock Service:** Test mock gamification service responses

**Integration Tests (20% coverage)**

- **XP Award Flow:** Test end-to-end XP award from check-in to notification
- **Badge Unlock Flow:** Test badge eligibility check, unlock trigger, XP reward
- **Streak Preservation:** Test streak continuation on event attendance
- **Level-Up Flow:** Test level-up trigger, badge unlock, feature unlock
- **API Integration:** Test gamification service calls with mock backend

**End-to-End Tests (10% strategic coverage)**

- **Critical User Journey:** Check in → XP gain → Badge unlock → Level-up celebration
- **Streak At-Risk Flow:** Streak at risk → Notification → Event RSVP → Streak preserved
- **Badge Gallery Navigation:** View locked badges → See progress → Unlock badge → View details
- **Cross-Platform Consistency:** Verify gamification UI identical on mobile and web

### Test Data & Mocking Strategy

**Mock Gamification State:**

```typescript
const mockUserState: GamificationState = {
  userId: 'test-user-123',
  currentXP: 450,
  level: 3,
  xpForNextLevel: 800,
  currentStreak: 5,
  longestStreak: 12,
  streakAtRisk: false,
  badges: [
    {
      badgeId: 'newcomer',
      name: 'Newcomer',
      rarity: 'common',
      xpReward: 50,
      unlockedAt: '2025-11-01',
      isNew: false,
    },
    {
      badgeId: 'regular',
      name: 'Regular',
      rarity: 'uncommon',
      xpReward: 100,
      unlockedAt: '2025-11-08',
      isNew: true,
    },
  ],
  eventsAttended: 9,
  reliabilityScore: 0.88,
  weeklyDigestOptIn: true,
  lastUpdated: '2025-11-09T10:00:00Z',
};
```

**Mock Badge Definitions:**

```typescript
const INITIAL_BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'Attend your first event',
    iconUrl: '🌱',
    rarity: 'common',
    xpReward: 50,
    unlockCriteria: { type: 'attendance_count', threshold: 1 },
    category: 'attendance',
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    iconUrl: '🔥',
    rarity: 'rare',
    xpReward: 150,
    unlockCriteria: { type: 'streak_milestone', threshold: 7 },
    category: 'streak',
  },
  // ... 13-18 more badges
];
```

### Performance Testing

**Performance Test Scenarios:**

- **XP Award Latency:** Measure time from check-in to XP notification (target p95 < 500ms)
- **Badge Unlock Animation:** Verify 60 FPS animation on baseline devices
- **Gamification State Load:** Measure cold load time (target p95 < 800ms)
- **Streak Calculation:** Simulate 5K users, verify cron job completes in < 5 minutes
- **Memory Usage:** Monitor Redux store size with 50 badges + 100 XP events (target < 100KB)

### Security Testing

**Security Test Validation:**

- **XP Tampering:** Attempt to award XP via client-only API calls (should fail)
- **Badge Unlock Bypass:** Attempt to unlock badge without meeting criteria (should fail)
- **Rate Limiting:** Send 100 badge check requests in 1 minute (should throttle after 10)
- **Injection Attacks:** Send malicious metadata in XP award request (should sanitize)

### Coverage & Quality Gates

**Quality Metrics:**

- Unit test coverage: ≥90% for services/utils, ≥80% for components
- Integration test coverage: All gamification API flows
- E2E test coverage: Critical user journeys (XP award, badge unlock, streak preservation)
- Performance: All tests meet NFR targets
- Security: No high/critical vulnerabilities in dependencies

**Definition of Done:**

- All tests pass in CI/CD pipeline
- Code coverage meets targets (90%/80%)
- Security scan passes
- Performance benchmarks met
- Cross-platform E2E tests successful
- UX animations at 60 FPS on baseline devices

---

**Next Steps:**

1. Review technical specification with team
2. Create Story 3.1: XP Computation Service (Rule Config)
3. Set up mock gamification service for frontend development
4. Define badge icon design approach (emoji vs. custom illustrations)
5. Calibrate XP values for target progression curve (Level 5 in 4 weeks)

**Status:** Draft - Ready for Review

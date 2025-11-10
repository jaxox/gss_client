# Story 3.3: Badge System & Gallery UI

Status: drafted

## Story

As a **GSS platform user**,
I want **to unlock and collect badges for my achievements**,
so that **I can showcase my accomplishments and feel recognized for my participation**.

## Acceptance Criteria

### AC1: Badge Definition & Configuration

1. 15-20 initial badges defined in `gamification.constants.ts` with:
   - Badge ID, name, description, category, rarity, XP reward
   - Unlock criteria (event count, streak days, partner count, etc.)
   - Icon asset reference (SVG/PNG)
2. Badge categories:
   - **Attendance:** Newcomer (1 event), Regular (5 events), Veteran (10 events), Elite (25 events), Legend (50 events)
   - **Streak:** Streak Starter (3-day), Streak Master (7-day), Unstoppable (30-day)
   - **Social:** Good Sport (10 kudos given), Social Butterfly (10 partners), Team Player (5 group events)
   - **Reliability:** Reliable Attendee (85%+ reliability, 10+ events)
   - **Exploration:** Explorer (5 venues), Sport Sampler (3 sports), Adventurer (10 venues)
   - **Level:** Level 5 Champion, Level 10 Legend
   - **Milestone:** First Event, 100 Events Milestone, 1-Year Member
3. Badge rarity tiers: Common (50 XP), Uncommon (100 XP), Rare (150 XP), Epic (300 XP), Legendary (500 XP)
4. Badge unlock criteria validated (achievable but meaningful thresholds)
5. Badge icons designed with consistent visual style
6. Badge data exported as TypeScript constants

### AC2: Badge Unlock Logic

1. Badge unlock check runs on XP award, level-up, event check-in, profile update
2. `checkBadgeUnlock(userId, triggerEvent)` evaluates all badge criteria
3. Badge unlock returns: badgeId, badge metadata, XP bonus awarded
4. Multiple badges can unlock from single trigger (e.g., Regular + Explorer)
5. Badge unlock triggers bonus XP award (added to total XP)
6. Badge unlock persisted to user's badge collection
7. Badge unlock events logged for analytics

### AC3: Badge Unlock Animation

1. Badge unlock triggers modal animation:
   - Badge icon zooms in with scale effect (0.5 → 1.0)
   - Badge name and rarity displayed
   - Confetti effect (2 seconds)
   - "+100 XP Bonus" displayed with animation
   - "View Badge" button opens badge details
2. Animation runs at 60 FPS on baseline devices
3. Animation dismissible with tap/click or auto-dismiss after 4 seconds
4. Multiple badge unlocks queued (display one at a time)
5. Sound effect optional (can be muted in settings)
6. Animation skippable with "Skip" button

### AC4: Badge Gallery UI

1. Badge gallery displays all badges in grid layout:
   - 3 columns on mobile, 5 columns on web
   - Unlocked badges displayed in full color
   - Locked badges displayed as silhouettes with lock icon
2. Badge gallery filterable by:
   - All, Unlocked, Locked
   - Category (Attendance, Streak, Social, etc.)
3. Badge gallery sortable by:
   - Unlock date (newest first)
   - Rarity (legendary to common)
   - Name (A-Z)
4. Badge tap opens badge details modal
5. Badge gallery shows unlock progress ("12 / 18 badges unlocked")
6. Badge gallery accessible from profile screen

### AC5: Badge Details Modal

1. Badge details modal displays:
   - Badge icon (large, centered)
   - Badge name and rarity (with color indicator)
   - Badge description
   - Unlock criteria (e.g., "Attend 10 events")
   - Unlock progress bar (for locked badges: "7 / 10 events")
   - XP bonus awarded (for unlocked badges)
   - Unlock date (for unlocked badges)
2. Locked badges show progress towards unlock
3. Progress bar animated (smooth transition)
4. Modal dismissible with close button or backdrop tap
5. Modal responsive (full-screen mobile, dialog web)

### AC6: Badge Progress Tracking

1. Progress tracked for all progressive badges:
   - Event count (for Attendance badges)
   - Streak days (for Streak badges)
   - Partner count (for Social badges)
   - Venue count (for Exploration badges)
2. Progress updated on relevant trigger events:
   - Event attendance → Update event count, venue count
   - Streak update → Update streak days
   - Partner added → Update partner count
3. Progress visible in badge details modal
4. Progress saved to Redux state and persisted
5. Progress queryable via `getBadgeProgress(userId, badgeId)`

### AC7: Cross-Platform Consistency

1. Badge unlock logic identical on mobile and web
2. Badge gallery grid responsive (mobile vs web columns)
3. Badge unlock animations consistent across platforms
4. Badge icons render correctly (SVG support, fallback to PNG)
5. TypeScript types ensure type safety across platforms
6. E2E tests validate mobile and web badge flows

## Tasks / Subtasks

### Task 1: Badge Configuration & Constants (AC: 1)

- [ ] Define 15-20 initial badges in `shared/constants/gamification.constants.ts`
- [ ] Create badge data structure: id, name, description, category, rarity, xpReward, criteria
- [ ] Define unlock criteria types: eventCount, streakDays, partnerCount, etc.
- [ ] Assign rarity tiers (common, uncommon, rare, epic, legendary)
- [ ] Document badge progression (when users can expect to unlock each badge)
- [ ] Create unit tests for badge configuration validation

### Task 2: Badge TypeScript Types (AC: 1, 2)

- [ ] Add badge types to `shared/types/gamification.types.ts`
- [ ] Define `Badge` interface (id, name, description, category, rarity, xpReward, criteria)
- [ ] Define `UserBadge` interface (badgeId, unlockedAt, progress)
- [ ] Define `BadgeUnlockEvent` interface (badge, xpBonus, trigger)
- [ ] Define `BadgeCategory` and `BadgeRarity` enums
- [ ] Add JSDoc comments for all badge types
- [ ] Export types for mobile and web consumption

### Task 3: Badge Icon Assets (AC: 1)

- [ ] Design 15-20 badge icons (SVG format)
- [ ] Follow design system color palette and style
- [ ] Create locked badge silhouettes (grayscale + lock icon)
- [ ] Export icons to `mobile/assets/badges/` and `web/public/badges/`
- [ ] Create icon mapping in constants: `BADGE_ICONS[badgeId]`
- [ ] Test icon rendering on mobile and web
- [ ] Add PNG fallbacks for older devices

### Task 4: Badge Unlock Logic (AC: 2)

- [ ] Create `shared/utils/badgeUnlockChecker.ts` utility
- [ ] Implement `checkBadgeUnlock(userState, triggerEvent): BadgeUnlockEvent[]`
- [ ] Evaluate all badge criteria against user state
- [ ] Return array of newly unlocked badges
- [ ] Handle multi-badge unlocks (e.g., Regular + Explorer)
- [ ] Add edge case handling (already unlocked, invalid criteria)
- [ ] Write unit tests for badge unlock logic (20+ test cases)

### Task 5: Badge Progress Calculation (AC: 6)

- [ ] Create `shared/utils/badgeProgressCalculator.ts` utility
- [ ] Implement `calculateBadgeProgress(userState, badgeId): number`
- [ ] Calculate progress based on badge criteria type
- [ ] Return progress as percentage (0-100)
- [ ] Handle different criteria types (eventCount, streakDays, etc.)
- [ ] Write unit tests for progress calculation

### Task 6: Badge Unlock Integration in XP Award (AC: 2)

- [ ] Update `MockGamificationService.awardXP()` to check badge unlocks
- [ ] Call `checkBadgeUnlock()` after XP awarded
- [ ] Award bonus XP for unlocked badges
- [ ] Return badge unlock events in XP award response
- [ ] Update Redux state with newly unlocked badges
- [ ] Write integration tests for XP award → Badge unlock

### Task 7: Redux Badge State Management (AC: 2, 6)

- [ ] Update gamification Redux slice with badge state
- [ ] Add `unlockedBadges: UserBadge[]` to state
- [ ] Create `badgeUnlocked` action and reducer
- [ ] Create `updateBadgeProgress` action and reducer
- [ ] Add selectors: `selectUnlockedBadges`, `selectBadgeProgress`, `selectBadgeByCategory`
- [ ] Write unit tests for badge reducers and selectors

### Task 8: Badge Unlock Animation Component (AC: 3)

- [ ] Create `mobile/src/components/gamification/BadgeUnlockAnimation.tsx`
- [ ] Create `web/src/components/gamification/BadgeUnlockAnimation.tsx`
- [ ] Implement full-screen modal overlay
- [ ] Implement animation sequence (zoom-in, confetti, XP bonus)
- [ ] Use React Native Reanimated (mobile) / Framer Motion (web)
- [ ] Add confetti effect (reuse from Story 3.2)
- [ ] Implement dismiss and skip buttons
- [ ] Handle badge unlock queue (display one at a time)
- [ ] Write component tests for badge unlock animation

### Task 9: Badge Gallery Component (AC: 4)

- [ ] Create `mobile/src/components/gamification/BadgeGallery.tsx`
- [ ] Create `web/src/components/gamification/BadgeGallery.tsx`
- [ ] Implement grid layout (3 columns mobile, 5 columns web)
- [ ] Display unlocked badges (full color) and locked badges (silhouettes)
- [ ] Add filter controls (All, Unlocked, Locked, by Category)
- [ ] Add sort controls (Unlock date, Rarity, Name)
- [ ] Display unlock progress ("12 / 18 badges unlocked")
- [ ] Make badges tappable (open badge details modal)
- [ ] Write component tests for badge gallery

### Task 10: Badge Card Component (AC: 4)

- [ ] Create `mobile/src/components/gamification/BadgeCard.tsx`
- [ ] Create `web/src/components/gamification/BadgeCard.tsx`
- [ ] Display badge icon, name, rarity indicator
- [ ] Apply locked state styling (grayscale, lock icon)
- [ ] Add rarity color border (legendary: gold, epic: purple, etc.)
- [ ] Add tap handler to open badge details modal
- [ ] Add accessibility labels
- [ ] Write component tests for badge card

### Task 11: Badge Details Modal Component (AC: 5)

- [ ] Create `mobile/src/components/gamification/BadgeDetailsModal.tsx`
- [ ] Create `web/src/components/gamification/BadgeDetailsModal.tsx`
- [ ] Display badge icon (large), name, rarity, description
- [ ] Display unlock criteria and progress bar (for locked badges)
- [ ] Display XP bonus and unlock date (for unlocked badges)
- [ ] Implement animated progress bar
- [ ] Add close button and backdrop dismiss
- [ ] Make modal responsive (full-screen mobile, dialog web)
- [ ] Write component tests for badge details modal

### Task 12: Profile Screen Badge Gallery Integration (AC: 4)

- [ ] Update `mobile/src/screens/profile/ProfileScreen.tsx`
- [ ] Update `web/src/pages/profile/ProfilePage.tsx`
- [ ] Add "Badges" section to profile screen
- [ ] Display badge gallery (3-5 most recent unlocked badges)
- [ ] Add "View All Badges" button to open full badge gallery
- [ ] Test profile screen with various badge states (0, 5, 18 unlocked)
- [ ] Write component tests for profile badge integration

### Task 13: Badge Unlock Flow E2E Integration (AC: 2, 3)

- [ ] Integrate badge unlock logic with XP award flow
- [ ] Listen for badge unlock events from XP award response
- [ ] Trigger badge unlock animation on event
- [ ] Update badge gallery after badge unlock
- [ ] Update Redux state with newly unlocked badge
- [ ] Add integration test: XP award → Badge unlock → Animation → Gallery update

### Task 14: Analytics and Logging (AC: 2, 7)

- [ ] Add badge unlock event logging to analytics
- [ ] Log: userId, badgeId, badgeName, rarity, xpBonus, trigger, timestamp
- [ ] Track badge unlock distribution (which badges most common)
- [ ] Track median time to unlock each badge
- [ ] Track badge gallery engagement (opens, filters, sorts)
- [ ] Add structured logging for badge unlock events
- [ ] Write tests for analytics event emission

### Task 15: Testing and Validation (AC: All)

- [ ] Write unit tests for badge unlock logic (20+ test cases)
- [ ] Write unit tests for badge progress calculation
- [ ] Write component tests for gallery, card, details modal, animation
- [ ] Write integration tests: XP award → Badge unlock → UI update
- [ ] Write E2E test: Earn XP → Unlock badge → Animation → Gallery
- [ ] Test edge cases (multi-unlock, already unlocked, invalid criteria)
- [ ] Test animation performance (60 FPS on baseline devices)
- [ ] Test cross-platform consistency (mobile vs web)
- [ ] Validate accessibility (screen readers, keyboard nav)

## Dev Notes

**Frontend Implementation Focus:** This story implements the badge system on the frontend, including badge unlock logic, badge gallery UI, badge details modal, and badge unlock animations. Builds on Story 3.1 (XP Computation) and Story 3.2 (Level Progression).

**Architecture Patterns:**

- **Configuration-Driven Design:** Badge definitions in constants for easy expansion
- **Event-Driven Unlock:** Badge unlock triggered by XP award, level-up, check-in events
- **Declarative Criteria:** Badge criteria stored as data (eventCount: 10) vs hard-coded logic
- **Queue-Based Animation:** Multiple badge unlocks queued and displayed sequentially
- **Progress Tracking:** Real-time progress towards locked badges

**Badge Configuration:**

```typescript
// shared/constants/gamification.constants.ts
export const BADGES: Badge[] = [
  // Attendance Badges
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'Attended your first event',
    category: BadgeCategory.ATTENDANCE,
    rarity: BadgeRarity.COMMON,
    xpReward: 50,
    criteria: { type: 'eventCount', threshold: 1 },
    iconAsset: 'badges/newcomer.svg',
  },
  {
    id: 'regular',
    name: 'Regular',
    description: 'Attended 5 events',
    category: BadgeCategory.ATTENDANCE,
    rarity: BadgeRarity.UNCOMMON,
    xpReward: 100,
    criteria: { type: 'eventCount', threshold: 5 },
    iconAsset: 'badges/regular.svg',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Attended 10 events',
    category: BadgeCategory.ATTENDANCE,
    rarity: BadgeRarity.RARE,
    xpReward: 150,
    criteria: { type: 'eventCount', threshold: 10 },
    iconAsset: 'badges/veteran.svg',
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Attended 25 events',
    category: BadgeCategory.ATTENDANCE,
    rarity: BadgeRarity.EPIC,
    xpReward: 300,
    criteria: { type: 'eventCount', threshold: 25 },
    iconAsset: 'badges/elite.svg',
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Attended 50 events',
    category: BadgeCategory.ATTENDANCE,
    rarity: BadgeRarity.LEGENDARY,
    xpReward: 500,
    criteria: { type: 'eventCount', threshold: 50 },
    iconAsset: 'badges/legend.svg',
  },

  // Streak Badges
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    description: 'Maintained a 3-day streak',
    category: BadgeCategory.STREAK,
    rarity: BadgeRarity.COMMON,
    xpReward: 50,
    criteria: { type: 'streakDays', threshold: 3 },
    iconAsset: 'badges/streak-starter.svg',
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintained a 7-day streak',
    category: BadgeCategory.STREAK,
    rarity: BadgeRarity.UNCOMMON,
    xpReward: 100,
    criteria: { type: 'streakDays', threshold: 7 },
    iconAsset: 'badges/streak-master.svg',
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintained a 30-day streak',
    category: BadgeCategory.STREAK,
    rarity: BadgeRarity.LEGENDARY,
    xpReward: 500,
    criteria: { type: 'streakDays', threshold: 30 },
    iconAsset: 'badges/unstoppable.svg',
  },

  // Social Badges
  {
    id: 'good-sport',
    name: 'Good Sport',
    description: 'Gave 10 kudos',
    category: BadgeCategory.SOCIAL,
    rarity: BadgeRarity.COMMON,
    xpReward: 50,
    criteria: { type: 'kudosGiven', threshold: 10 },
    iconAsset: 'badges/good-sport.svg',
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Played with 10 different partners',
    category: BadgeCategory.SOCIAL,
    rarity: BadgeRarity.UNCOMMON,
    xpReward: 100,
    criteria: { type: 'partnerCount', threshold: 10 },
    iconAsset: 'badges/social-butterfly.svg',
  },

  // Level Badges
  {
    id: 'level-5-champion',
    name: 'Level 5 Champion',
    description: 'Reached Level 5',
    category: BadgeCategory.LEVEL,
    rarity: BadgeRarity.EPIC,
    xpReward: 300,
    criteria: { type: 'level', threshold: 5 },
    iconAsset: 'badges/level-5.svg',
  },
  {
    id: 'level-10-legend',
    name: 'Level 10 Legend',
    description: 'Reached Level 10',
    category: BadgeCategory.LEVEL,
    rarity: BadgeRarity.LEGENDARY,
    xpReward: 500,
    criteria: { type: 'level', threshold: 10 },
    iconAsset: 'badges/level-10.svg',
  },

  // Exploration Badges
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Attended events at 5 different venues',
    category: BadgeCategory.EXPLORATION,
    rarity: BadgeRarity.UNCOMMON,
    xpReward: 100,
    criteria: { type: 'venueCount', threshold: 5 },
    iconAsset: 'badges/explorer.svg',
  },
  {
    id: 'sport-sampler',
    name: 'Sport Sampler',
    description: 'Tried 3 different sports',
    category: BadgeCategory.EXPLORATION,
    rarity: BadgeRarity.UNCOMMON,
    xpReward: 100,
    criteria: { type: 'sportCount', threshold: 3 },
    iconAsset: 'badges/sport-sampler.svg',
  },

  // Milestone Badges
  {
    id: 'first-event',
    name: 'First Event',
    description: 'Attended your first event',
    category: BadgeCategory.MILESTONE,
    rarity: BadgeRarity.COMMON,
    xpReward: 50,
    criteria: { type: 'eventCount', threshold: 1 },
    iconAsset: 'badges/first-event.svg',
  },
  {
    id: '100-events',
    name: '100 Events Milestone',
    description: 'Attended 100 events',
    category: BadgeCategory.MILESTONE,
    rarity: BadgeRarity.LEGENDARY,
    xpReward: 500,
    criteria: { type: 'eventCount', threshold: 100 },
    iconAsset: 'badges/100-events.svg',
  },
];
```

**Badge Unlock Logic:**

```typescript
// shared/utils/badgeUnlockChecker.ts
export function checkBadgeUnlock(
  userState: GamificationState,
  triggerEvent: BadgeTriggerEvent
): BadgeUnlockEvent[] {
  const unlockedBadgeIds = new Set(userState.unlockedBadges.map(badge => badge.badgeId));

  const newlyUnlockedBadges: BadgeUnlockEvent[] = [];

  for (const badge of BADGES) {
    // Skip if already unlocked
    if (unlockedBadgeIds.has(badge.id)) continue;

    // Check criteria
    const isUnlocked = evaluateBadgeCriteria(badge.criteria, userState);

    if (isUnlocked) {
      newlyUnlockedBadges.push({
        badge,
        xpBonus: badge.xpReward,
        unlockedAt: new Date(),
        trigger: triggerEvent,
      });
    }
  }

  return newlyUnlockedBadges;
}

function evaluateBadgeCriteria(criteria: BadgeCriteria, userState: GamificationState): boolean {
  switch (criteria.type) {
    case 'eventCount':
      return userState.totalEventsAttended >= criteria.threshold;
    case 'streakDays':
      return userState.currentStreak.days >= criteria.threshold;
    case 'level':
      return userState.currentLevel >= criteria.threshold;
    case 'partnerCount':
      return userState.uniquePartners >= criteria.threshold;
    case 'venueCount':
      return userState.uniqueVenues >= criteria.threshold;
    case 'kudosGiven':
      return userState.kudosGiven >= criteria.threshold;
    default:
      return false;
  }
}
```

**Integration Points:**

- **Story 3.1 Integration:** Badge unlock triggered by XP award response
- **Story 3.2 Integration:** Level-up may unlock level badges (Level 5, Level 10)
- **Story 3.4 Integration:** Streak tracking may unlock streak badges
- **Future Epic Integration:** Social badges (kudos, partners) depend on Epic 4

**Performance Considerations:**

- Badge unlock check must be < 10ms (simple criteria evaluation)
- Badge gallery grid virtualized for 100+ badges (future-proofing)
- Badge unlock animation runs at 60 FPS
- Badge icons lazy-loaded (load on scroll in gallery)
- Redux state updates batched to prevent re-renders

**Animation Libraries:**

- **Mobile:** React Native Reanimated 2 (60 FPS declarative animations)
- **Web:** Framer Motion (smooth, performant CSS animations)
- **Confetti:** Reuse from Story 3.2 (react-native-confetti-cannon, canvas-confetti)

**Accessibility Considerations:**

- Badge gallery has semantic grid structure
- Badge cards have ARIA labels ("Veteran badge, rare, unlocked")
- Badge unlock modal dismissible with keyboard (Escape key)
- Screen reader announces badge unlock event
- Color-blind friendly rarity indicators (not color-only)

### Project Structure Notes

**Target Implementation Paths:**

```text
shared/
  constants/gamification.constants.ts    # Badge definitions
  types/gamification.types.ts            # Badge types
  utils/badgeUnlockChecker.ts            # Badge unlock logic
  utils/badgeProgressCalculator.ts       # Badge progress calculation
  services/mock/mockGamification.service.ts  # Badge unlock integration

mobile/
  assets/badges/                         # Badge SVG/PNG icons
  src/store/slices/gamification.slice.ts # Badge state management
  src/components/gamification/
    BadgeGallery.tsx                     # Badge gallery grid
    BadgeCard.tsx                        # Individual badge card
    BadgeUnlockAnimation.tsx             # Badge unlock modal
    BadgeDetailsModal.tsx                # Badge details modal
  src/screens/profile/ProfileScreen.tsx # Profile integration

web/
  public/badges/                         # Badge SVG/PNG icons
  src/store/slices/gamification.slice.ts # Badge state (shared logic)
  src/components/gamification/
    BadgeGallery.tsx                     # Badge gallery grid
    BadgeCard.tsx                        # Individual badge card
    BadgeUnlockAnimation.tsx             # Badge unlock modal
    BadgeDetailsModal.tsx                # Badge details dialog
  src/pages/profile/ProfilePage.tsx     # Profile integration
```

**Testing Strategy:**

- **Unit Tests (70%):** Badge unlock logic, progress calculation, Redux slice
- **Component Tests (20%):** Gallery, card, animation, details modal
- **Integration Tests (10%):** XP award → Badge unlock → UI update
- **E2E Test (1 critical path):** Earn XP → Unlock badge → Animation → Gallery

**Validation Checklist:**

- [ ] Badge unlock logic evaluates all criteria correctly
- [ ] Badge unlock animation plays at 60 FPS
- [ ] Badge gallery displays unlocked and locked badges correctly
- [ ] Badge details modal shows progress for locked badges
- [ ] Multi-badge unlock queues and displays sequentially
- [ ] Badge unlock awards bonus XP correctly
- [ ] Cross-platform consistency validated (mobile vs web)
- [ ] Accessibility validated (screen readers, keyboard nav)
- [ ] Performance validated (< 10ms unlock check, 60 FPS animation)

### References

- [Source: docs/tech-spec-epic-3.md#AC3-Badge-System] - Badge system requirements
- [Source: docs/tech-spec-epic-3.md#Data-Models] - Badge and UserBadge interfaces
- [Source: docs/tech-spec-epic-3.md#Workflow-2-Badge-Unlock-Flow] - Badge unlock sequence
- [Source: docs/tech-spec-epic-3.md#NFRs-Performance] - Performance targets
- [Source: docs/shared/PRD.md#FR016] - Badge system functional requirements
- [Source: docs/stories/3-1-xp-computation-service.md] - Story 3.1 XP system
- [Source: docs/stories/3-2-level-thresholds-progression-ui.md] - Story 3.2 Level progression

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

---

**Story Points:** 8 (3-4 dev sessions)

**Prerequisites:** Story 3.1 complete (XP Computation), Story 3.2 complete (Level Progression)

**Blocks:** Story 3.5 (Weekly Digest - badge display), Story 3.6 (At-Risk Notifications - badge mentions)

**Integration Points:**

- Story 3.1: Badge unlock triggered by XP award events
- Story 3.2: Level-up unlocks level badges (Level 5, Level 10)
- Story 3.4: Streak tracking unlocks streak badges
- Future Epic 4: Social badges (kudos, partners) depend on social features

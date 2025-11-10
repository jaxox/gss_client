# Story 3.2: Level Thresholds & Progression UI

Status: drafted

## Story

As a **GSS platform user**,
I want **to see my level and progress towards the next level**,
so that **I can understand my journey in the community and feel motivated to continue participating**.

## Acceptance Criteria

### AC1: Level Threshold Definition

1. Levels 1-10 defined with cumulative XP thresholds
2. Level thresholds stored in `gamification.constants.ts`:
   - Level 1: 0 XP (starting level)
   - Level 2: 200 XP (4 events)
   - Level 3: 500 XP (10 events)
   - Level 4: 1000 XP (20 events)
   - Level 5: 1800 XP (36 events)
   - Level 6: 2800 XP (56 events)
   - Level 7: 4000 XP (80 events)
   - Level 8: 5500 XP (110 events)
   - Level 9: 7500 XP (150 events)
   - Level 10: 10000 XP (200 events)
3. Level titles defined: Rookie (L1), Player (L2-3), Athlete (L4-6), Pro (L7-9), Champion (L10)
4. XP required for next level calculated dynamically
5. Level progression curve validated (reasonable pace for users)

### AC2: Level Calculation Logic

1. `calculateLevel(totalXP)` utility function returns current level
2. `getNextLevelXP(currentLevel)` returns XP needed for next level
3. `getLevelProgress(totalXP)` returns percentage progress to next level
4. Level calculation works for all XP ranges (0 to 10000+)
5. Level capped at 10 (post-10 users retain Champion title)
6. Client-side calculation matches backend logic (validation)

### AC3: Level-Up Detection and Notification

1. Level-up detected when XP award crosses level threshold
2. Level-up event emitted from XP award response
3. Full-screen level-up celebration animation triggered
4. Animation shows: new level number, new title, confetti effect
5. Level-up unlocks visual badge (e.g., "Level 5 Champion" badge)
6. Level 5 displays "Competitive opt-in available" message (future epic)
7. Level-up events logged for analytics

### AC4: Profile Level Display

1. Current level and title displayed prominently in profile header
2. XP progress bar shows progress to next level
3. Progress bar label: "X / Y XP to Level N" (e.g., "450 / 800 XP to Level 4")
4. Circular progress indicator on mobile, linear bar on web
5. Level badge icon displayed next to level number
6. Tap level badge to view level details modal

### AC5: Level Details Modal

1. Modal displays:
   - Current level and title
   - Total XP earned
   - XP needed for next level
   - Progress percentage to next level
   - All level thresholds (Level 1-10 with XP requirements)
   - Unlocked level badges
2. Modal shows "You're at max level!" message for Level 10 users
3. Modal accessible from profile level badge tap
4. Modal dismissible with close button or backdrop tap
5. Modal responsive (full-screen on mobile, dialog on web)

### AC6: Level-Up Celebration Animation

1. Full-screen overlay animation triggered on level-up
2. Animation sequence:
   - Fade in celebration background
   - Scale-in new level number and title
   - Confetti/particle effect (3 seconds)
   - Badge unlock display (if applicable)
   - "Dismiss" button appears after 2 seconds
3. Animation runs at 60 FPS on baseline devices
4. Animation skippable with tap/click
5. Animation dismisses automatically after 5 seconds
6. Sound effect optional (can be muted in settings)

### AC7: Cross-Platform Consistency

1. Level calculation logic identical on mobile and web
2. Level-up animations consistent across platforms (adjusted for screen size)
3. Profile level display responsive (mobile vs desktop layouts)
4. Level details modal responsive
5. TypeScript types ensure type safety across platforms
6. E2E tests validate mobile and web level-up flows

## Tasks / Subtasks

### Task 1: Level Threshold Configuration (AC: 1)

- [ ] Add level thresholds to `shared/constants/gamification.constants.ts`
- [ ] Define `LEVEL_THRESHOLDS` array with level, xpRequired, title
- [ ] Add level title mapping (Rookie, Player, Athlete, Pro, Champion)
- [ ] Document progression curve rationale (4 events for L2, etc.)
- [ ] Add TypeScript types for `LevelThreshold`, `LevelTitle`
- [ ] Create unit tests for level threshold validation

### Task 2: Level Calculation Utilities (AC: 2)

- [ ] Create `shared/utils/levelCalculator.ts` utility
- [ ] Implement `calculateLevel(totalXP): number` function
- [ ] Implement `getNextLevelXP(currentLevel): number` function
- [ ] Implement `getLevelProgress(totalXP): { current, next, percentage }` function
- [ ] Implement `getLevelTitle(level): string` function
- [ ] Add edge case handling (negative XP, > Level 10)
- [ ] Write unit tests for level calculator (15+ test cases)

### Task 3: TypeScript Types for Levels (AC: 1, 2)

- [ ] Add level types to `shared/types/gamification.types.ts`
- [ ] Define `LevelThreshold` interface
- [ ] Define `LevelProgress` interface
- [ ] Define `LevelUpEvent` interface
- [ ] Define `LevelTitle` type union
- [ ] Add JSDoc comments for all level types
- [ ] Export types for mobile and web consumption

### Task 4: Level-Up Detection in XP Award Flow (AC: 3)

- [ ] Update `MockGamificationService.awardXP()` to detect level-ups
- [ ] Check if `newTotalXP` crosses level threshold
- [ ] Return `levelUp` object in XP award response
- [ ] Include: newLevel, newTitle, badgeUnlocked (optional)
- [ ] Trigger level-up event in Redux gamification slice
- [ ] Write unit tests for level-up detection logic

### Task 5: Redux Level State Management (AC: 3, 4)

- [ ] Update gamification Redux slice with level state
- [ ] Add `level`, `levelTitle`, `xpForNextLevel` to state
- [ ] Create `levelUp` action and reducer
- [ ] Update state on XP award with level check
- [ ] Add selectors: `selectLevel`, `selectLevelProgress`, `selectLevelTitle`
- [ ] Write unit tests for level reducers and selectors

### Task 6: Level-Up Celebration Component (AC: 6)

- [ ] Create `mobile/src/components/gamification/LevelUpCelebration.tsx`
- [ ] Create `web/src/components/gamification/LevelUpCelebration.tsx`
- [ ] Implement full-screen modal overlay
- [ ] Implement animation sequence (fade-in, scale, confetti)
- [ ] Use React Native Reanimated (mobile) / Framer Motion (web)
- [ ] Add confetti/particle effect library integration
- [ ] Implement dismiss button and auto-dismiss (5 seconds)
- [ ] Add skip animation on tap/click
- [ ] Write component tests for level-up celebration

### Task 7: Confetti/Particle Animation (AC: 6)

- [ ] Research confetti libraries (react-native-confetti-cannon, canvas-confetti)
- [ ] Install and configure confetti library
- [ ] Implement confetti effect (burst from center, 3 seconds)
- [ ] Customize colors (primary theme colors)
- [ ] Optimize performance (60 FPS target)
- [ ] Test on baseline devices (iPhone 11, Pixel 5)

### Task 8: Profile Level Display Component (AC: 4)

- [ ] Create `mobile/src/components/gamification/LevelDisplay.tsx`
- [ ] Create `web/src/components/gamification/LevelDisplay.tsx`
- [ ] Display level number, title, and badge icon
- [ ] Implement circular progress indicator (mobile)
- [ ] Implement linear progress bar (web)
- [ ] Add progress label: "X / Y XP to Level N"
- [ ] Make level badge tappable (open level details modal)
- [ ] Write component tests for level display

### Task 9: Level Progress Bar Component (AC: 4)

- [ ] Create `mobile/src/components/gamification/LevelProgressBar.tsx`
- [ ] Create `web/src/components/gamification/LevelProgressBar.tsx`
- [ ] Implement animated progress bar (smooth transition)
- [ ] Display current XP, next level XP, and percentage
- [ ] Use theme colors (primary for progress, gray for background)
- [ ] Add accessibility labels (screen reader support)
- [ ] Write component tests for progress bar

### Task 10: Level Details Modal Component (AC: 5)

- [ ] Create `mobile/src/components/gamification/LevelDetailsModal.tsx`
- [ ] Create `web/src/components/gamification/LevelDetailsModal.tsx`
- [ ] Display current level summary (level, title, total XP, progress)
- [ ] Display all level thresholds (1-10) in scrollable list
- [ ] Highlight current level in threshold list
- [ ] Show "Max level" message for Level 10 users
- [ ] Add close button and backdrop dismiss
- [ ] Make modal responsive (full-screen mobile, dialog web)
- [ ] Write component tests for level details modal

### Task 11: Integration with XP Award Flow (AC: 3)

- [ ] Update XP award flow to handle level-up events
- [ ] Listen for `levelUp` event from XP award response
- [ ] Trigger level-up celebration animation on event
- [ ] Update profile level display after level-up
- [ ] Update Redux state with new level and title
- [ ] Add integration test: XP award → Level-up → Celebration

### Task 12: Profile Screen Integration (AC: 4, 5)

- [ ] Update `mobile/src/screens/profile/ProfileScreen.tsx`
- [ ] Update `web/src/pages/profile/ProfilePage.tsx`
- [ ] Add level display to profile header
- [ ] Add level progress bar below header
- [ ] Wire up level badge tap to open level details modal
- [ ] Test profile screen with various level states (1, 5, 10)
- [ ] Write component tests for profile integration

### Task 13: Analytics and Logging (AC: 3, 7)

- [ ] Add level-up event logging to analytics
- [ ] Log: userId, newLevel, newTitle, totalXP, timestamp
- [ ] Track level distribution (how many users at each level)
- [ ] Track median time to reach each level
- [ ] Add structured logging for level-up events
- [ ] Write tests for analytics event emission

### Task 14: Testing and Validation (AC: All)

- [ ] Write unit tests for level calculator (15+ test cases)
- [ ] Write unit tests for level-up detection logic
- [ ] Write component tests for level display, progress bar, modal
- [ ] Write integration tests: XP award → Level-up → UI update
- [ ] Write E2E test: Earn XP → Level-up → Celebration → Profile update
- [ ] Test edge cases (Level 1 → 2, Level 9 → 10, > Level 10)
- [ ] Test animation performance (60 FPS on baseline devices)
- [ ] Test cross-platform consistency (mobile vs web)
- [ ] Validate accessibility (screen readers, keyboard nav)

## Dev Notes

**Frontend Implementation Focus:** This story implements the level progression system on the frontend, including level calculation, level-up detection, celebration animations, and profile UI components. Builds on Story 3.1 (XP Computation Service).

**Architecture Patterns:**

- **Configuration-Driven Design:** Level thresholds in constants for easy tuning
- **Client-Side Calculation:** Level calculated client-side for instant feedback
- **Event-Driven Animation:** Level-up event triggers celebration animation
- **Responsive Design:** Components adapt to mobile (circular) vs web (linear) layouts
- **Performance-Focused Animation:** 60 FPS target using React Native Reanimated / Framer Motion

**Level Progression Curve:**

The level thresholds are designed for a 4-week journey to Level 5 (competitive opt-in unlock) for an average user attending 2 events per week:

```typescript
// shared/constants/gamification.constants.ts
export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xpRequired: 0, title: 'Rookie' },
  { level: 2, xpRequired: 200, title: 'Player' }, // 4 events
  { level: 3, xpRequired: 500, title: 'Player' }, // 10 events
  { level: 4, xpRequired: 1000, title: 'Athlete' }, // 20 events
  { level: 5, xpRequired: 1800, title: 'Athlete' }, // 36 events (4 weeks at 2/week)
  { level: 6, xpRequired: 2800, title: 'Athlete' }, // 56 events
  { level: 7, xpRequired: 4000, title: 'Pro' }, // 80 events
  { level: 8, xpRequired: 5500, title: 'Pro' }, // 110 events
  { level: 9, xpRequired: 7500, title: 'Pro' }, // 150 events
  { level: 10, xpRequired: 10000, title: 'Champion' }, // 200 events
];

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Rookie',
  2: 'Player',
  3: 'Player',
  4: 'Athlete',
  5: 'Athlete',
  6: 'Athlete',
  7: 'Pro',
  8: 'Pro',
  9: 'Pro',
  10: 'Champion',
};
```

**Level Calculator Implementation:**

```typescript
// shared/utils/levelCalculator.ts
export function calculateLevel(totalXP: number): number {
  if (totalXP < 0) return 1;

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i].xpRequired) {
      return LEVEL_THRESHOLDS[i].level;
    }
  }

  return 1; // Default to Level 1
}

export function getNextLevelXP(currentLevel: number): number {
  if (currentLevel >= 10) return LEVEL_THRESHOLDS[9].xpRequired; // Max level

  const nextLevelThreshold = LEVEL_THRESHOLDS.find(
    threshold => threshold.level === currentLevel + 1
  );

  return nextLevelThreshold?.xpRequired ?? LEVEL_THRESHOLDS[9].xpRequired;
}

export function getLevelProgress(totalXP: number): LevelProgress {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelXP = LEVEL_THRESHOLDS.find(t => t.level === currentLevel)?.xpRequired ?? 0;
  const nextLevelXP = getNextLevelXP(currentLevel);

  const xpIntoCurrentLevel = totalXP - currentLevelXP;
  const xpRequiredForNextLevel = nextLevelXP - currentLevelXP;
  const percentage = (xpIntoCurrentLevel / xpRequiredForNextLevel) * 100;

  return {
    currentLevel,
    currentLevelXP,
    nextLevelXP,
    xpIntoCurrentLevel,
    xpRequiredForNextLevel,
    percentage: Math.min(percentage, 100),
  };
}
```

**Level-Up Detection in XP Award:**

```typescript
// shared/services/mock/mockGamification.service.ts
async awardXP(request: AwardXPRequest): Promise<AwardXPResponse> {
  const xpGained = XP_RULES[request.eventType].base;
  const oldTotalXP = this.getUserState(request.userId).currentXP;
  const newTotalXP = oldTotalXP + xpGained;

  // Detect level-up
  const oldLevel = calculateLevel(oldTotalXP);
  const newLevel = calculateLevel(newTotalXP);

  let levelUp: LevelUpEvent | undefined;

  if (newLevel > oldLevel) {
    levelUp = {
      newLevel,
      newTitle: LEVEL_TITLES[newLevel],
      oldLevel,
      badgeUnlocked: this.checkLevelBadgeUnlock(newLevel),
    };
  }

  return {
    success: true,
    data: {
      xpGained,
      newTotalXP,
      levelUp,
      badgesUnlocked: [],
    },
  };
}
```

**Integration Points:**

- **Story 3.1 Integration:** Consumes XP award events to detect level-ups
- **Story 3.3 Integration:** Level-up may unlock level badges (Level 5, Level 10)
- **Story 3.4 Integration:** Streak tracking UI will reference level display component
- **Future Epic Integration:** Level 5 enables competitive opt-in (future epic)

**Performance Considerations:**

- Level calculation must be < 5ms (simple array lookup)
- Level-up animation must run at 60 FPS
- Confetti effect optimized (particle count, duration)
- Progress bar animation smooth (60 FPS, 300ms transition)
- Redux state updates batched to prevent re-renders

**Animation Libraries:**

- **Mobile:** React Native Reanimated 2 (60 FPS declarative animations)
- **Web:** Framer Motion (smooth, performant CSS animations)
- **Confetti:** react-native-confetti-cannon (mobile), canvas-confetti (web)

**Accessibility Considerations:**

- Level display has semantic labels ("Level 3 Athlete")
- Progress bar has ARIA labels ("450 of 800 XP to Level 4")
- Level-up modal dismissible with keyboard (Escape key)
- Screen reader announces level-up event
- Color contrast meets WCAG 2.1 AA standards

### Project Structure Notes

**Target Implementation Paths:**

```text
shared/
  constants/gamification.constants.ts    # Level thresholds, titles
  types/gamification.types.ts            # Level types
  utils/levelCalculator.ts               # Level calculation logic
  services/mock/mockGamification.service.ts  # Level-up detection

mobile/
  src/store/slices/gamification.slice.ts # Level state management
  src/components/gamification/
    LevelDisplay.tsx                     # Level badge + progress
    LevelProgressBar.tsx                 # Circular progress indicator
    LevelUpCelebration.tsx               # Full-screen animation
    LevelDetailsModal.tsx                # Level details modal
  src/screens/profile/ProfileScreen.tsx # Profile integration

web/
  src/store/slices/gamification.slice.ts # Level state (shared logic)
  src/components/gamification/
    LevelDisplay.tsx                     # Level badge + progress
    LevelProgressBar.tsx                 # Linear progress bar
    LevelUpCelebration.tsx               # Full-screen animation
    LevelDetailsModal.tsx                # Level details dialog
  src/pages/profile/ProfilePage.tsx     # Profile integration
```

**Testing Strategy:**

- **Unit Tests (70%):** Level calculator, level-up detection, Redux slice
- **Component Tests (20%):** Level display, progress bar, celebration, modal
- **Integration Tests (10%):** XP award → Level-up → UI update
- **E2E Test (1 critical path):** Earn XP → Level-up → Celebration → Profile

**Validation Checklist:**

- [ ] Level calculator returns correct level for all XP ranges
- [ ] Level-up detection triggers on threshold crossing
- [ ] Level-up celebration animation plays at 60 FPS
- [ ] Profile level display shows correct level and progress
- [ ] Level details modal displays all thresholds correctly
- [ ] Level 5 shows "Competitive opt-in" message
- [ ] Level 10 shows "Max level" message
- [ ] Cross-platform consistency validated (mobile vs web)
- [ ] Accessibility validated (screen readers, keyboard nav)
- [ ] Performance validated (< 5ms calculation, 60 FPS animation)

### References

- [Source: docs/tech-spec-epic-3.md#AC2-Level-Progression-System] - Level progression requirements
- [Source: docs/tech-spec-epic-3.md#Data-Models] - LevelThreshold interface
- [Source: docs/tech-spec-epic-3.md#Workflow-4-Level-Up-Flow] - Level-up flow sequence
- [Source: docs/tech-spec-epic-3.md#NFRs-Performance] - Performance targets
- [Source: docs/shared/PRD.md#FR014] - Level progression functional requirements
- [Source: docs/stories/3-1-xp-computation-service.md] - Story 3.1 XP system

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

---

**Story Points:** 5 (2-3 dev sessions)

**Prerequisites:** Story 3.1 complete (XP Computation Service)

**Blocks:** Story 3.3 (Badge System - level badges), Story 3.5 (Weekly Digest - level display)

**Integration Points:**

- Story 3.1: Consumes XP award events
- Story 3.3: Level-up may unlock level badges
- Future Epic: Level 5 enables competitive opt-in

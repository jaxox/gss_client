# Story 3.4: Streak Tracking Logic

Status: drafted

## Story

As a **GSS platform user**,
I want **to see my current streak and be motivated to maintain it**,
so that **I build consistent attendance habits and feel recognized for my commitment**.

## Acceptance Criteria

### AC1: Streak Definition and Calculation

1. Streak defined as "3 events attended in 10-day rolling window"
2. Streak count calculated as number of consecutive 10-day windows with 3+ events
3. Streak increments when user maintains 3+ events in rolling 10-day window
4. Streak calculation works retroactively (can calculate streak from historical data)
5. Streak calculation handles edge cases (same-day events, event cancellations)
6. Current streak displayed as number of consecutive 10-day periods

### AC2: Streak State Management

1. `currentStreak` tracked in gamification Redux state
2. `longestStreak` (personal best) tracked and displayed
3. `lastEventDate` tracked to determine streak status
4. `streakAtRisk` boolean flag indicates if streak expires soon (7+ days since last event)
5. `streakExpiresAt` timestamp shows when streak will break
6. Streak state synced with backend on app launch and after events

### AC3: Streak Preservation on Event Check-In

1. Streak recalculated after successful event check-in
2. If streak maintained (3+ events in 10 days), increment streak count
3. If streak broken (0 events in 10+ days), reset to 0 and start new streak
4. Streak update triggers UI animation (flame icon pulses)
5. Streak preservation celebrated with "+1 streak" toast notification
6. Analytics event logged on streak increment

### AC4: Streak Break Handling

1. Streak breaks silently (no penalty, no punishment)
2. Streak reset to 0 when 10+ days pass without 3 events
3. "Start a new streak!" message displayed after break
4. Previous streak becomes "longestStreak" if higher than current record
5. No negative reinforcement or loss aversion messaging
6. Encouraging message: "Life happens! Ready to start fresh?"

### AC5: Streak Display in Profile

1. Current streak displayed prominently in profile header
2. Flame icon with streak count (e.g., "🔥 5 streak")
3. Tap streak to view streak details modal
4. Longest streak displayed: "Personal best: 15 days"
5. Streak status indicator: "Active" (green), "At risk" (yellow), "Broken" (gray)
6. Progress bar showing events in current 10-day window (e.g., "2 / 3 events")

### AC6: Streak Details Modal

1. Modal displays:
   - Current streak count and status
   - Events in current 10-day window (list with dates)
   - Days since last event
   - Days remaining before streak at risk (if applicable)
   - Longest streak (personal best)
   - Streak history chart (last 30 days)
2. Modal shows "Streak expires in X days" warning if at risk
3. Modal accessible from profile streak badge tap
4. Modal dismissible with close button or backdrop tap
5. Modal responsive (full-screen mobile, dialog web)

### AC7: Cross-Platform Consistency

1. Streak calculation logic identical on mobile and web
2. Streak display components consistent across platforms
3. Streak state synchronized via Redux and TanStack Query
4. TypeScript types ensure type safety across platforms
5. E2E tests validate mobile and web streak flows

## Tasks / Subtasks

### Task 1: Streak Calculation Utility (AC: 1)

- [ ] Create `shared/utils/streakCalculator.ts`
- [ ] Implement `calculateStreak(attendanceHistory): StreakData` function
- [ ] Implement rolling 10-day window logic
- [ ] Count consecutive windows with 3+ events
- [ ] Handle edge cases (same-day events, gaps, cancellations)
- [ ] Write unit tests for streak calculation (20+ test cases)

### Task 2: Streak TypeScript Types (AC: 1, 2)

- [ ] Add streak types to `shared/types/gamification.types.ts`
- [ ] Define `StreakData` interface (currentStreak, longestStreak, lastEventDate, streakAtRisk, streakExpiresAt)
- [ ] Define `StreakStatus` enum (Active, AtRisk, Broken)
- [ ] Define `StreakUpdateEvent` interface
- [ ] Add JSDoc comments for all streak types
- [ ] Export types for mobile and web consumption

### Task 3: Redux Streak State Management (AC: 2, 3)

- [ ] Update gamification Redux slice with streak state
- [ ] Add `currentStreak`, `longestStreak`, `lastEventDate`, `streakAtRisk`, `streakExpiresAt` to state
- [ ] Create `updateStreak` action and reducer
- [ ] Create `breakStreak` action and reducer
- [ ] Add selectors: `selectCurrentStreak`, `selectLongestStreak`, `selectStreakStatus`
- [ ] Write unit tests for streak reducers and selectors

### Task 4: Streak Update Integration in Check-In Flow (AC: 3)

- [ ] Update `MockGamificationService.recordEventAttendance()` to recalculate streak
- [ ] Call `calculateStreak()` with updated attendance history
- [ ] Compare old vs new streak count
- [ ] Return streak update event in response
- [ ] Trigger streak increment animation if streak maintained
- [ ] Write integration tests for check-in → streak update

### Task 5: Streak Break Detection (AC: 4)

- [ ] Implement daily streak check logic (can be client-side for MVP)
- [ ] Detect when last event date is 10+ days ago
- [ ] Reset `currentStreak` to 0 when broken
- [ ] Update `longestStreak` if current > longest
- [ ] Display "Start a new streak!" encouragement message
- [ ] Write unit tests for streak break detection

### Task 6: Streak Display Component (AC: 5)

- [ ] Create `mobile/src/components/gamification/StreakDisplay.tsx`
- [ ] Create `web/src/components/gamification/StreakDisplay.tsx`
- [ ] Display flame icon with current streak count
- [ ] Add status indicator (Active/At Risk/Broken)
- [ ] Show progress bar: "2 / 3 events in 10 days"
- [ ] Make streak badge tappable (open streak details modal)
- [ ] Write component tests for streak display

### Task 7: Streak Details Modal Component (AC: 6)

- [ ] Create `mobile/src/components/gamification/StreakDetailsModal.tsx`
- [ ] Create `web/src/components/gamification/StreakDetailsModal.tsx`
- [ ] Display current streak, longest streak, last event date
- [ ] Display events in current 10-day window (list)
- [ ] Show "Streak expires in X days" warning if at risk
- [ ] Add streak history chart (last 30 days)
- [ ] Add close button and backdrop dismiss
- [ ] Make modal responsive (full-screen mobile, dialog web)
- [ ] Write component tests for streak details modal

### Task 8: Streak Animation Component (AC: 3)

- [ ] Create flame icon pulse animation on streak increment
- [ ] Implement "+1 streak" toast notification
- [ ] Use React Native Reanimated (mobile) / Framer Motion (web)
- [ ] Animation duration: 1 second
- [ ] Write component tests for streak animations

### Task 9: Profile Screen Streak Integration (AC: 5)

- [ ] Update `mobile/src/screens/profile/ProfileScreen.tsx`
- [ ] Update `web/src/pages/profile/ProfilePage.tsx`
- [ ] Add streak display to profile header (near level display)
- [ ] Wire up streak badge tap to open streak details modal
- [ ] Test profile screen with various streak states (0, 5, 15)
- [ ] Write component tests for profile streak integration

### Task 10: Streak History Chart (AC: 6)

- [ ] Research charting library (react-native-chart-kit, recharts)
- [ ] Install and configure charting library
- [ ] Implement 30-day streak history chart
- [ ] Display streak count per day (bar chart or line chart)
- [ ] Highlight current streak vs broken periods
- [ ] Test chart rendering on mobile and web

### Task 11: Analytics and Logging (AC: 3, 4, 7)

- [ ] Add streak increment event logging to analytics
- [ ] Log: userId, newStreak, oldStreak, eventsInWindow, timestamp
- [ ] Add streak break event logging
- [ ] Track streak distribution (how many users at each streak level)
- [ ] Track median streak length
- [ ] Add structured logging for streak events
- [ ] Write tests for analytics event emission

### Task 12: Testing and Validation (AC: All)

- [ ] Write unit tests for streak calculation (20+ test cases)
- [ ] Write unit tests for streak state management
- [ ] Write component tests for display, modal, animations
- [ ] Write integration tests: Check-in → Streak update → UI update
- [ ] Write E2E test: Attend event → Streak increments → Profile updates
- [ ] Test edge cases (same-day events, 10-day boundary, break scenarios)
- [ ] Test cross-platform consistency (mobile vs web)
- [ ] Validate accessibility (screen readers, keyboard nav)

## Dev Notes

**Frontend Implementation Focus:** This story implements the streak tracking system on the frontend, including streak calculation logic, streak display in profile, streak details modal, and streak animations. Builds on Story 3.1 (XP Computation) and Story 3.2 (Level Progression).

**Architecture Patterns:**

- **Client-Side Calculation:** Streak calculated client-side from attendance history for instant feedback
- **Rolling Window Logic:** 10-day rolling window allows flexible attendance patterns
- **Graceful Break Handling:** No punishment for streak breaks, encouraging restart
- **Real-Time Updates:** Streak updates immediately on event check-in
- **Historical Tracking:** Longest streak persisted for personal best comparison

**Streak Calculation Logic:**

```typescript
// shared/utils/streakCalculator.ts
export function calculateStreak(attendanceHistory: AttendanceRecord[]): StreakData {
  const sortedEvents = attendanceHistory
    .filter(event => event.checkedIn)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  if (sortedEvents.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastEventDate: null,
      streakAtRisk: false,
      streakExpiresAt: null,
      eventsInCurrentWindow: 0,
    };
  }

  const lastEventDate = new Date(sortedEvents[0].eventDate);
  const daysSinceLastEvent = differenceInDays(new Date(), lastEventDate);

  // Check if streak is broken (10+ days since last event)
  if (daysSinceLastEvent > 10) {
    return {
      currentStreak: 0,
      longestStreak: 0, // Will be loaded from persisted state
      lastEventDate: lastEventDate.toISOString(),
      streakAtRisk: false,
      streakExpiresAt: null,
      eventsInCurrentWindow: 0,
    };
  }

  // Calculate current streak
  let currentStreak = 0;
  let windowStart = new Date();

  while (true) {
    const windowEnd = windowStart;
    windowStart = subDays(windowEnd, 10);

    const eventsInWindow = sortedEvents.filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= windowStart && eventDate <= windowEnd;
    });

    if (eventsInWindow.length >= 3) {
      currentStreak++;
      windowStart = subDays(windowStart, 10); // Move to next 10-day window
    } else {
      break; // Streak broken
    }
  }

  // Count events in current 10-day window
  const currentWindowStart = subDays(new Date(), 10);
  const eventsInCurrentWindow = sortedEvents.filter(event => {
    const eventDate = new Date(event.eventDate);
    return eventDate >= currentWindowStart;
  }).length;

  // Check if streak is at risk (7+ days since last event)
  const streakAtRisk = daysSinceLastEvent >= 7;
  const streakExpiresAt = streakAtRisk ? addDays(lastEventDate, 10).toISOString() : null;

  return {
    currentStreak,
    longestStreak: currentStreak, // Will be compared with persisted longest
    lastEventDate: lastEventDate.toISOString(),
    streakAtRisk,
    streakExpiresAt,
    eventsInCurrentWindow,
  };
}
```

**Streak Definition Rationale:**

The "3 events in 10 days" definition balances:

- **Flexibility:** Users can attend 3 events any time within 10 days (not rigid "every 3 days")
- **Achievability:** 3 events/10 days = ~2 events/week, realistic for recreational athletes
- **Habit Formation:** 10-day window encourages regular participation without being overwhelming
- **No Punishment:** Streak breaks don't penalize users, avoiding loss aversion anxiety

**Integration Points:**

- **Story 3.1 Integration:** Streak update triggered by event check-in (XP award flow)
- **Story 3.2 Integration:** Streak display positioned near level display in profile
- **Story 3.3 Integration:** Streak milestones unlock streak badges (3-day, 7-day, 30-day)
- **Story 3.5 Integration:** At-risk detection feeds into notification system

**Performance Considerations:**

- Streak calculation must be < 50ms (client-side calculation)
- Attendance history limited to last 90 days for calculation (performance)
- Streak state cached in Redux, recalculated only on check-in
- Chart rendering optimized (virtualized for large datasets)

**Accessibility Considerations:**

- Streak display has semantic labels ("5-day streak, active")
- Streak details modal dismissible with keyboard (Escape key)
- Screen reader announces streak increments
- Flame icon has text alternative ("Streak indicator")
- Color-blind friendly status indicators (not color-only)

### Project Structure Notes

**Target Implementation Paths:**

```text
shared/
  types/gamification.types.ts            # Streak types
  utils/streakCalculator.ts              # Streak calculation logic
  services/mock/mockGamification.service.ts  # Streak update integration

mobile/
  src/store/slices/gamification.slice.ts # Streak state management
  src/components/gamification/
    StreakDisplay.tsx                    # Streak badge + progress
    StreakDetailsModal.tsx               # Streak details modal
    StreakAnimation.tsx                  # Streak increment animation
  src/screens/profile/ProfileScreen.tsx # Profile integration

web/
  src/store/slices/gamification.slice.ts # Streak state (shared logic)
  src/components/gamification/
    StreakDisplay.tsx                    # Streak badge + progress
    StreakDetailsModal.tsx               # Streak details dialog
    StreakAnimation.tsx                  # Streak increment animation
  src/pages/profile/ProfilePage.tsx     # Profile integration
```

**Testing Strategy:**

- **Unit Tests (70%):** Streak calculation, state management, edge cases
- **Component Tests (20%):** Streak display, details modal, animations
- **Integration Tests (10%):** Check-in → Streak update → UI update
- **E2E Test (1 critical path):** Attend event → Streak increments → Profile updates

**Validation Checklist:**

- [ ] Streak calculation handles 10-day rolling window correctly
- [ ] Streak increments on check-in when 3+ events in 10 days
- [ ] Streak breaks gracefully after 10+ days without 3 events
- [ ] Longest streak persisted and displayed correctly
- [ ] At-risk status triggers at 7+ days since last event
- [ ] Streak display shows correct status (Active/At Risk/Broken)
- [ ] Streak details modal displays events in current window
- [ ] Cross-platform consistency validated (mobile vs web)
- [ ] Accessibility validated (screen readers, keyboard nav)

### References

- [Source: docs/tech-spec-epic-3.md#AC4-Streak-Tracking] - Streak tracking requirements
- [Source: docs/tech-spec-epic-3.md#Data-Models] - Streak data model
- [Source: docs/tech-spec-epic-3.md#Workflow-3-Streak-Update-Flow] - Streak update sequence
- [Source: docs/tech-spec-epic-3.md#NFRs-Performance] - Performance targets
- [Source: docs/shared/PRD.md#FR015] - Streak tracking functional requirements
- [Source: docs/stories/3-1-xp-computation-service.md] - Story 3.1 XP system
- [Source: docs/stories/3-2-level-thresholds-progression-ui.md] - Story 3.2 Level progression
- [Source: docs/stories/3-3-badge-system-gallery-ui.md] - Story 3.3 Badge system

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

---

**Story Points:** 5 (2-3 dev sessions)

**Prerequisites:** Story 3.1 complete (XP Computation Service)

**Blocks:** Story 3.5 (At-Risk Notifications - needs streak status), Story 3.6 (Weekly Digest - displays streak)

**Integration Points:**

- Story 3.1: Streak update triggered by event check-in
- Story 3.2: Streak display positioned near level display
- Story 3.3: Streak badges unlock at milestones
- Story 3.5: At-risk detection feeds notification system

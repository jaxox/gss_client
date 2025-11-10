# Story 3.1: XP Computation Service (Rule Config)

Status: drafted

## Story

As a **GSS platform user**,
I want **to earn XP (experience points) for participating in events and social activities**,
so that **I can see my progress, level up, and feel recognized for my engagement with the sports community**.

## Acceptance Criteria

### AC1: XP Rules Configuration

1. XP values defined in `gamification.constants.ts` for easy configuration without code changes
2. Base XP for event attendance: 50 XP (configurable)
3. Bonus XP for first-time partner: 25 XP (Epic 4 integration, placeholder)
4. Bonus XP for kudos received/given: 10 XP each (Epic 4 integration, placeholder)
5. Bonus XP for quest completion: 100 XP (Epic 4 integration, placeholder)
6. XP rules follow data-driven design pattern for future rule additions
7. Configuration includes validation rules (min/max XP values)

### AC2: XP Calculation Utilities

1. Client-side XP calculator utility provides instant XP preview
2. `calculateXP(eventType, metadata)` function returns estimated XP gain
3. XP calculator supports all event types (attendance, social, quest placeholders)
4. XP calculations validated against backend rules for accuracy
5. XP preview displayed before action confirmation (e.g., "This will earn you +50 XP")
6. Calculation errors handled gracefully with fallback to base values

### AC3: Backend API Integration

1. `POST /api/gamification/xp` endpoint integrated for XP awards
2. Request includes: userId, eventType, metadata (event ID, partner ID, etc.)
3. Response includes: xpGained, newTotalXP, levelUp (if triggered), badgesUnlocked (if any)
4. API supports idempotency to prevent duplicate XP awards
5. Error handling for network failures, validation errors, rate limiting
6. Mock implementation available for frontend development

### AC4: XP Award Flow

1. XP award triggered automatically on event check-in (Epic 2 integration point)
2. Optimistic UI update shows XP gain immediately (+50 XP toast notification)
3. Background sync validates XP award with backend
4. Rollback mechanism if backend validation fails
5. XP gain animation plays on successful award (smooth number increment)
6. XP total updates in user profile and progress bar

### AC5: XP History Tracking

1. `GET /api/gamification/xp/history` endpoint returns last 50 XP events
2. XP history includes: eventType, xpGained, timestamp, source (event name/ID)
3. XP history displayed in profile with filterable list (by date, by type)
4. History pagination for users with >50 XP events
5. History cached locally for offline viewing
6. Pull-to-refresh updates history from server

### AC6: Redux State Management

1. Gamification state slice manages XP, level, total XP
2. Actions: `awardXP`, `updateXP`, `fetchXPHistory`, `syncXPState`
3. State includes: currentXP, level, xpForNextLevel, xpHistory[], lastUpdated
4. TanStack Query integration for XP API caching (5-minute stale time)
5. Optimistic updates for instant feedback, validated async
6. Error state handling with retry logic

### AC7: Cross-Platform Consistency

1. XP calculation logic identical on mobile and web
2. XP award animations consistent across platforms
3. XP history display responsive (mobile list, web table)
4. Configuration constants shared via `shared/constants/gamification.constants.ts`
5. TypeScript types ensure type safety across platforms
6. E2E tests validate mobile and web XP flows

## Tasks / Subtasks

### Task 1: XP Rules Configuration (AC: 1)

- [ ] Create `shared/constants/gamification.constants.ts` with XP rules
- [ ] Define base XP values (attendance: 50, partner: 25, kudos: 10, quest: 100)
- [ ] Add validation rules (min: 0, max: 1000 XP per event)
- [ ] Document XP rule configuration format
- [ ] Add TypeScript types for XP rules and event types
- [ ] Create unit tests for XP rule validation

### Task 2: XP Calculator Utility (AC: 2)

- [ ] Create `shared/utils/xpCalculator.ts` utility
- [ ] Implement `calculateXP(eventType, metadata)` function
- [ ] Add support for all XP event types (attendance, partner, kudos, quest)
- [ ] Implement XP preview logic with metadata context
- [ ] Add error handling for invalid event types
- [ ] Write unit tests for XP calculator (10+ test cases)

### Task 3: TypeScript Types and Interfaces (AC: 1, 2)

- [ ] Create `shared/types/gamification.types.ts`
- [ ] Define `XPEvent`, `XPEventType`, `XPRules` interfaces
- [ ] Define `AwardXPRequest`, `AwardXPResponse` API types
- [ ] Define `XPHistory`, `XPHistoryItem` interfaces
- [ ] Add JSDoc comments for all types
- [ ] Export types for mobile and web consumption

### Task 4: Gamification Service Interface (AC: 3, 5)

- [ ] Create `shared/services/api/gamification.service.ts` interface
- [ ] Define `IGamificationService` with XP methods:
  - `awardXP(request: AwardXPRequest): Promise<AwardXPResponse>`
  - `getXPHistory(userId: string, limit?: number): Promise<XPHistory>`
  - `getGamificationState(userId: string): Promise<GamificationState>`
- [ ] Add JSDoc comments for service methods
- [ ] Create service factory for mock/real service switching

### Task 5: Mock Gamification Service (AC: 3, 5)

- [ ] Create `shared/services/mock/mockGamification.service.ts`
- [ ] Implement `MockGamificationService` class
- [ ] Mock `awardXP()` with realistic delays (300-500ms)
- [ ] Mock `getXPHistory()` with sample data (10-20 events)
- [ ] Mock `getGamificationState()` with default user state
- [ ] Simulate level-up and badge unlock scenarios
- [ ] Write unit tests for mock service

### Task 6: Redux Gamification Slice (AC: 6)

- [ ] Create `mobile/src/store/slices/gamification.slice.ts`
- [ ] Create `web/src/store/slices/gamification.slice.ts` (shared logic)
- [ ] Define state shape: `{ currentXP, level, xpForNextLevel, xpHistory, loading, error }`
- [ ] Implement actions: `awardXP`, `updateXP`, `fetchXPHistory`, `syncXPState`
- [ ] Implement reducers with optimistic updates
- [ ] Add selectors for XP data access
- [ ] Write unit tests for slice (actions, reducers, selectors)

### Task 7: TanStack Query Integration (AC: 6)

- [ ] Create `shared/hooks/useXP.ts` custom hook
- [ ] Implement `useAwardXP()` mutation with optimistic updates
- [ ] Implement `useXPHistory()` query with caching (5-minute stale)
- [ ] Implement `useGamificationState()` query with background sync
- [ ] Add error handling and retry logic (3 retries, exponential backoff)
- [ ] Write unit tests for hooks

### Task 8: XP Award Flow Components (AC: 4)

- [ ] Create `mobile/src/components/gamification/XPToast.tsx`
- [ ] Create `web/src/components/gamification/XPToast.tsx`
- [ ] Implement XP gain animation (number increment, slide-in effect)
- [ ] Add visual feedback (checkmark icon, success color)
- [ ] Implement auto-dismiss after 3 seconds
- [ ] Add accessibility labels for screen readers
- [ ] Write component tests for XP toast

### Task 9: XP History UI Components (AC: 5)

- [ ] Create `mobile/src/components/gamification/XPHistory.tsx` (list view)
- [ ] Create `web/src/components/gamification/XPHistory.tsx` (table view)
- [ ] Implement date filtering (Today, This Week, This Month, All Time)
- [ ] Implement event type filtering (Attendance, Social, Quest)
- [ ] Add pagination controls for >50 events
- [ ] Add pull-to-refresh on mobile
- [ ] Implement empty state ("No XP history yet")
- [ ] Add loading skeleton for initial load
- [ ] Write component tests for XP history

### Task 10: Integration with Event Check-In (AC: 4)

- [ ] Identify Epic 2 check-in completion hook point
- [ ] Add `onCheckInSuccess()` callback to trigger XP award
- [ ] Pass event metadata (eventId, eventName) to XP service
- [ ] Display XP toast notification on successful check-in
- [ ] Handle XP award failures gracefully (queue for retry)
- [ ] Add integration test for check-in → XP award flow

### Task 11: Profile XP Display (AC: 4)

- [ ] Update mobile profile screen with XP display
- [ ] Update web profile page with XP display
- [ ] Show current XP and level prominently
- [ ] Add progress bar to next level ("450 / 800 XP to Level 4")
- [ ] Display recent XP gains (last 5 events)
- [ ] Add "View full XP history" link to XP history screen
- [ ] Write component tests for profile XP display

### Task 12: Testing and Validation (AC: All)

- [ ] Write unit tests for XP calculator (20+ test cases)
- [ ] Write unit tests for Redux slice (actions, reducers, selectors)
- [ ] Write integration tests for XP award flow (mock backend)
- [ ] Write component tests for XP toast and history UI
- [ ] Write E2E test: Event check-in → XP award → Profile update
- [ ] Test cross-platform consistency (mobile vs web)
- [ ] Test error scenarios (network failure, invalid event, rate limit)
- [ ] Test offline behavior (queue XP awards for sync)
- [ ] Validate accessibility (screen readers, keyboard navigation)
- [ ] Performance testing (XP calculation < 10ms, animation 60 FPS)

## Dev Notes

**Frontend Implementation Focus:** This story implements the XP computation and award system on the frontend (React Native mobile + React web), with mock backend integration. Real backend API integration will occur after Epic 2 (Event Check-In) is complete.

**Architecture Patterns:**

- **Configuration-Driven Design:** XP rules in `gamification.constants.ts` for easy tuning
- **Client-Side Preview:** XP calculator provides instant feedback before backend validation
- **Optimistic UI:** XP gains appear immediately, validated async by backend
- **Service Layer Abstraction:** `IGamificationService` interface enables mock-first development
- **Redux + TanStack Query:** State management for XP data, caching for API calls
- **Cross-Platform Code Sharing:** Shared utilities, types, and service logic

**Key Dependencies:**

- Epic 1: User authentication, secure storage, HTTP client
- Epic 2 (future): Event check-in flow triggers XP award
- Redux Toolkit for state management
- TanStack Query for API caching
- React Native Paper (mobile) / MUI (web) for UI components

**XP Rule Design:**

```typescript
// shared/constants/gamification.constants.ts
export const XP_RULES = {
  EVENT_ATTENDANCE: {
    base: 50,
    description: 'Awarded for checking in to an event',
    min: 50,
    max: 50,
  },
  FIRST_TIME_PARTNER: {
    base: 25,
    description: 'Bonus for playing with a new partner',
    min: 25,
    max: 25,
  },
  KUDOS_RECEIVED: {
    base: 10,
    description: 'Awarded when you receive kudos',
    min: 10,
    max: 10,
  },
  KUDOS_GIVEN: {
    base: 10,
    description: 'Awarded when you give kudos',
    min: 10,
    max: 10,
  },
  QUEST_COMPLETED: {
    base: 100,
    description: 'Awarded for completing a quest',
    min: 100,
    max: 200, // Variable based on quest difficulty
  },
} as const;

export type XPEventType = keyof typeof XP_RULES;
```

**Mock Service Strategy:**

The mock gamification service simulates realistic backend behavior:

```typescript
class MockGamificationService implements IGamificationService {
  async awardXP(request: AwardXPRequest): Promise<AwardXPResponse> {
    await this.simulateLatency(400); // Realistic network delay

    const xpGained = XP_RULES[request.eventType].base;
    const mockState = this.getUserState(request.userId);
    const newTotalXP = mockState.currentXP + xpGained;

    // Check for level-up (Story 3.2 integration point)
    const levelUp = this.checkLevelUp(newTotalXP);

    // Check for badge unlocks (Story 3.3 integration point)
    const badgesUnlocked = this.checkBadgeUnlocks(request.userId);

    return {
      success: true,
      data: {
        xpGained,
        newTotalXP,
        levelUp,
        badgesUnlocked,
      },
    };
  }
}
```

**Integration Points:**

- **Epic 2 Integration:** Story 2.3 (QR Check-In) will call `awardXP()` on successful check-in
- **Story 3.2 Integration:** Level-up logic will consume XP award events
- **Story 3.3 Integration:** Badge unlock logic will check XP milestones
- **Story 3.4 Integration:** Streak tracking may award bonus XP for streak milestones

**Performance Considerations:**

- XP calculation must be < 10ms for instant preview
- XP award API call target: p95 < 500ms
- XP history query cached for 5 minutes
- Animations must run at 60 FPS on baseline devices
- Redux state updates batched to prevent re-renders

**Security Considerations:**

- XP awards validated server-side (client calculation is preview only)
- Idempotency keys prevent duplicate XP awards
- Rate limiting enforced on backend (max 10 XP awards per minute)
- Input validation prevents malicious metadata injection

### Project Structure Notes

**Target Implementation Paths:**

```text
shared/
  constants/gamification.constants.ts    # XP rules configuration
  types/gamification.types.ts            # TypeScript interfaces
  utils/xpCalculator.ts                  # Client-side XP calculator
  services/api/gamification.service.ts   # Service interface
  services/mock/mockGamification.service.ts  # Mock implementation
  hooks/useXP.ts                         # TanStack Query hooks

mobile/
  src/store/slices/gamification.slice.ts # Redux state management
  src/components/gamification/
    XPToast.tsx                          # XP gain notification
    XPHistory.tsx                        # XP history list
    XPProgressBar.tsx                    # Level progress bar
  src/screens/profile/ProfileScreen.tsx # XP display in profile

web/
  src/store/slices/gamification.slice.ts # Redux state (shared logic)
  src/components/gamification/
    XPToast.tsx                          # XP gain notification
    XPHistory.tsx                        # XP history table
    XPProgressBar.tsx                    # Level progress bar
  src/pages/profile/ProfilePage.tsx     # XP display in profile
```

**Testing Strategy:**

- **Unit Tests (70%):** XP calculator, Redux slice, mock service
- **Component Tests (20%):** XP toast, XP history, XP progress bar
- **Integration Tests (10%):** XP award flow, API integration, state sync
- **E2E Test (1 critical path):** Event check-in → XP award → Profile update

**Validation Checklist:**

- [ ] XP calculator returns correct values for all event types
- [ ] XP award triggers on event check-in (Epic 2 integration)
- [ ] XP toast notification displays with correct animation
- [ ] XP history loads and displays correctly
- [ ] Profile shows current XP and progress bar
- [ ] Optimistic updates work correctly (instant feedback)
- [ ] Error handling works (network failure, validation error)
- [ ] Cross-platform consistency validated (mobile vs web)
- [ ] Accessibility validated (screen readers, keyboard nav)
- [ ] Performance validated (< 10ms calculation, 60 FPS animation)

### References

- [Source: docs/tech-spec-epic-3.md#AC1-XP-Computation-Service] - XP computation requirements
- [Source: docs/tech-spec-epic-3.md#Data-Models] - TypeScript interfaces for XP
- [Source: docs/tech-spec-epic-3.md#Workflow-1-XP-Award-Flow] - XP award flow sequence
- [Source: docs/tech-spec-epic-3.md#NFRs-Performance] - Performance targets for XP
- [Source: docs/shared/PRD.md#FR013] - XP system functional requirements
- [Source: docs/architecture.md#Gamification-State] - State management architecture

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

---

**Story Points:** 5 (2-3 dev sessions)

**Prerequisites:** Epic 1 complete (authentication, storage, HTTP client)

**Blocks:** Story 3.2 (Level Progression), Story 3.3 (Badge System), Story 3.4 (Streak Tracking)

**Epic 2 Integration Point:** Story 2.3 (QR Check-In) will call `awardXP()` on successful check-in

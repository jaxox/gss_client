# Story 4.1: Kudos Send/Receive Flow

Status: drafted
Completion: 0%

## Story

As a **participant user**,
I want **to send kudos to fellow participants after events and receive kudos recognition**,
so that **I can express appreciation for good sportsmanship and build social connections**.

## Acceptance Criteria

**AC1: Post-Event Kudos Button (Tech Spec Workflow 1)**

1. "Give Kudos" button appears on event detail screen after successful check-in
2. Button disabled before check-in with tooltip: "Check in to event to give kudos"
3. Button shows kudos count indicator: "Give Kudos (2/5 sent)" to indicate rate limit progress
4. Tapping button opens kudos selection modal with participant list
5. Modal displays all checked-in participants except current user
6. Each participant shows: avatar, display name, reliability score badge
7. Works on both mobile (React Native) and web (React) platforms

**AC2: Kudos Recipient Selection & Message (Tech Spec Workflow 1, Step 4-5)**

1. Participant list in modal is scrollable with search/filter by name
2. User can select multiple recipients (up to 5 per event total, not per send)
3. Selected recipients show checkmark indicator
4. Optional message text area with 140 character limit and counter
5. Message placeholder: "Great game! Thanks for playing"
6. Real-time validation: disable "Send" button if rate limit (5 kudos) exceeded
7. Display warning if recipient already received kudos from sender: "Already sent kudos to [Name]"
8. "Send Kudos" button shows count: "Send Kudos to 3 people"

**AC3: Kudos Send Flow & Backend Integration (Tech Spec Workflow 1, Step 6-11)**

1. User taps "Send Kudos", optimistic UI update shows sending state
2. SocialService.sendKudos() called for each recipient (sequential with proper error handling)
3. Backend validates: sender checked in, recipient checked in, rate limit not exceeded (<5 per event)
4. On success: Kudos record created, +10 XP awarded to both sender and receiver
5. Push notification sent to receiver: "[Sender] sent you kudos for [Event]"
6. Redux state updated with sent kudos, UI reflects updated sent count (3/5)
7. Error handling: Rate limit exceeded → "You've sent maximum kudos for this event (5)"
8. Error handling: Recipient not checked in → "Cannot send kudos to participants who haven't checked in"
9. Modal closes automatically after all successful sends
10. Success toast: "Kudos sent to 3 participants (+30 XP)"

**AC4: Kudos Received Notifications & Display (Tech Spec Workflow 1, Step 9)**

1. Receiver gets push notification when kudos received
2. Notification content: sender name, event name, optional message, XP bonus
3. Notification deep links to event detail screen showing kudos section
4. Event detail screen shows "Kudos Received" section with list of kudos
5. Each kudos displays: sender avatar, name, message (if provided), timestamp
6. Kudos list sorted by most recent first
7. Kudos count badge on profile: "Kudos Received: 47 total"
8. XP transaction log shows: "+10 XP from kudos received from [Sender]"

**AC5: Rate Limiting & User Feedback (Tech Spec NFR)**

1. Rate limit enforced: Maximum 5 kudos per user per event (server-side validation)
2. UI prevents sending beyond limit: "Send" button disabled when 5/5 kudos sent
3. Rate limit counter updates in real-time after each send
4. User can see who they've already sent kudos to in the modal (checkmark + "Sent" badge)
5. Rate limit resets per event (user can send 5 kudos at next event)
6. Error handling if server-side limit exceeded: Toast with friendly message
7. Loading states during kudos send: button shows spinner, list items disabled

**AC6: Offline Support & Retry (Tech Spec NFR - Reliability)**

1. Kudos queued locally if device offline when send attempted
2. Optimistic UI update shows "Sending..." state
3. Queued kudos automatically sync when connection restored
4. Exponential backoff retry (1s, 2s, 4s) for failed requests
5. After 3 failures: Toast "Couldn't send kudos. Will retry when online."
6. Queued kudos persisted across app restarts (Redux Persist)
7. Duplicate prevention via (eventId, senderId, receiverId) tuple check

## Tasks / Subtasks

**Task 1: Kudos Service Layer (AC: 3, 6)**

- [ ] Create `SocialService` interface in `shared/services/api/social.service.ts`
  - [ ] Define `sendKudos(eventId, receiverId, message?)` method
  - [ ] Define `getKudos(eventId)` method
  - [ ] Define `getUserKudos(userId, type)` method
  - [ ] Define Kudos, KudosStats interfaces in `shared/types/social.types.ts`
- [ ] Implement `SocialServiceImpl` with ky HTTP client
  - [ ] POST /api/v1/events/:eventId/kudos endpoint integration
  - [ ] GET /api/v1/events/:eventId/kudos endpoint integration
  - [ ] Error handling for rate limits, validation failures
  - [ ] Idempotency check for duplicate kudos prevention
- [ ] Create `MockSocialService` for development/testing
  - [ ] Mock kudos data with realistic participants
  - [ ] Simulate rate limiting (max 5 per event)
  - [ ] Simulate network delays (500-1500ms)

**Task 2: State Management (AC: 3, 6)**

- [ ] Create `SocialStore` Redux slice in `mobile/src/store/social/socialSlice.ts`
  - [ ] State: sentKudos, receivedKudos, kudosQueue (for offline), loading/error/success states
  - [ ] Async thunk: sendKudos (with optimistic update)
  - [ ] Async thunk: getEventKudos
  - [ ] Async thunk: getUserKudos (for profile display)
  - [ ] Actions: queueKudosOffline, syncQueuedKudos
  - [ ] Selectors: selectSentKudosCount, selectRemainingKudosAllowance
- [ ] Copy SocialStore to web: `web/src/store/social/socialSlice.ts`
- [ ] Configure Redux Persist for kudosQueue offline storage
- [ ] Integrate social reducer with mobile and web stores
- [ ] Implement offline queue sync logic with exponential backoff

**Task 3: Kudos Button & Modal UI - Mobile (AC: 1, 2, 5)**

- [ ] Create `KudosButton` component in `mobile/src/components/social/KudosButton.tsx`
  - [ ] Conditional rendering based on check-in status
  - [ ] Display kudos count indicator (X/5 sent)
  - [ ] Disabled state with tooltip before check-in
  - [ ] Tap handler opens kudos modal
- [ ] Create `KudosModal` component in `mobile/src/components/social/KudosModal.tsx`
  - [ ] FlatList of checked-in participants (exclude current user)
  - [ ] Search bar with filter by name
  - [ ] Participant item: avatar, name, reliability badge, checkmark selection
  - [ ] Multi-select support (track selected recipients)
  - [ ] "Already sent" indicator for previously sent kudos
  - [ ] Message TextInput with 140 char limit and counter
  - [ ] "Send Kudos to X people" button at bottom
  - [ ] Loading/disabled states during send
  - [ ] Close modal on successful send
- [ ] Integrate KudosButton into `EventDetailScreen`
  - [ ] Position button prominently after check-in section
  - [ ] Redux integration for sent kudos count
  - [ ] Navigate to kudos modal on tap

**Task 4: Kudos Button & Modal UI - Web (AC: 1, 2, 5)**

- [ ] Create `KudosButton` component in `web/src/components/social/KudosButton.tsx`
  - [ ] Material UI Button with kudos icon
  - [ ] Tooltip for disabled state (not checked in)
  - [ ] Badge showing kudos count (X/5 sent)
- [ ] Create `KudosModal` component in `web/src/components/social/KudosModal.tsx`
  - [ ] Material UI Dialog with participant list
  - [ ] TextField for search/filter participants
  - [ ] List of participants with Checkbox, Avatar, Name, Reliability score chip
  - [ ] Multi-select with selectedRecipients state
  - [ ] TextField for optional message (140 char limit, helper text with counter)
  - [ ] DialogActions with Cancel and "Send Kudos to X" button
  - [ ] Loading spinner during send operation
  - [ ] Auto-close dialog on success
- [ ] Integrate KudosButton into `EventDetailPage`
  - [ ] Add button below event details section
  - [ ] Redux integration for kudos state

**Task 5: Kudos Received Display (AC: 4)**

- [ ] Create `KudosReceivedSection` component in `mobile/src/components/social/KudosReceivedSection.tsx`
  - [ ] Section title: "Kudos Received"
  - [ ] FlatList of received kudos
  - [ ] Kudos item: sender avatar, name, message, timestamp, "+10 XP" badge
  - [ ] Sort by most recent first
  - [ ] Empty state: "No kudos yet. Check in to events to receive kudos!"
- [ ] Create `KudosReceivedSection` component in `web/src/components/social/KudosReceivedSection.tsx`
  - [ ] Material UI Card with kudos list
  - [ ] List items with sender info, message, timestamp
  - [ ] Chip showing "+10 XP" reward
- [ ] Add KudosReceivedSection to EventDetailScreen/Page
  - [ ] Load kudos via getEventKudos thunk on mount
  - [ ] Display kudos count badge

**Task 6: Push Notifications Integration (AC: 4)**

- [ ] Create `NotificationService` interface in `shared/services/notification/notification.service.ts`
  - [ ] Define `sendKudosNotification(receiverId, kudos)` method
  - [ ] Define notification payload structure
- [ ] Integrate Firebase Cloud Messaging (FCM) for mobile
  - [ ] Configure FCM in mobile app (android/ios)
  - [ ] Handle notification permissions request
  - [ ] Register device token with backend
  - [ ] Listen for incoming notifications
  - [ ] Deep link handler for kudos notifications → event detail screen
- [ ] Integrate Web Push Notifications for web
  - [ ] Service Worker setup for push notifications
  - [ ] Notification permission request UI
  - [ ] Deep link handler → event detail page
- [ ] Test notification flow: send kudos → receiver gets notification → tap notification → event detail screen

**Task 7: Error Handling & Loading States (AC: 3, 5, 6)**

- [ ] Implement error toast messages for all failure scenarios
  - [ ] Rate limit exceeded: "You've sent maximum kudos for this event (5)"
  - [ ] Recipient not checked in: "Cannot send kudos to [Name] - not checked in"
  - [ ] Network error: "Couldn't send kudos. Will retry when online."
  - [ ] Server error: "Something went wrong. Please try again."
- [ ] Implement loading states
  - [ ] KudosModal: button shows spinner during send
  - [ ] KudosModal: disable all interactions during send
  - [ ] Optimistic update: show "Sending..." state in UI
- [ ] Implement offline queue indicator
  - [ ] Show "Queued" badge on sent kudos when offline
  - [ ] Show sync progress when reconnecting
- [ ] Add retry logic with exponential backoff (1s, 2s, 4s delays)

**Task 8: Testing (AC: All)**

- [ ] Unit tests: SocialService methods (sendKudos, getKudos, rate limiting)
- [ ] Unit tests: Redux slice (sendKudos thunk, offline queue, selectors)
- [ ] Unit tests: Validation helpers (message length, rate limit check)
- [ ] Component tests: KudosButton (disabled states, kudos count)
- [ ] Component tests: KudosModal (recipient selection, message validation, send flow)
- [ ] Component tests: KudosReceivedSection (list rendering, empty state)
- [ ] Integration tests: Complete kudos send flow (button → modal → send → success)
- [ ] Integration tests: Offline queue and sync (send offline → reconnect → sync)
- [ ] E2E tests: Mobile (Detox) - complete kudos send/receive flow
- [ ] E2E tests: Web (Playwright) - complete kudos send/receive flow

## Dev Notes

### Learnings from Previous Story

**From Story 2-1 (Status: done)**

- **New Service Created**: `EventService` base class available at `shared/services/api/events.service.ts` - use this pattern for `SocialService` (interface → abstract base → real impl + mock impl)
- **State Management Pattern**: Redux Toolkit with async thunks established - follow same pattern for `socialSlice` with granular loading/error/success states per operation
- **Validation Pattern**: Zod schemas in shared library (`shared/src/validation/`) - create `kudosValidation.ts` for message length and rate limit checks
- **Mock Service Pattern**: MockEventService with realistic data and network delays - create `MockSocialService` following same structure
- **Form Validation**: Real-time validation on blur + comprehensive validation on submit - apply to kudos message textarea
- **Cross-Platform Components**: React Native Paper (mobile) + Material UI (web) - use Button, Modal/Dialog, TextInput/TextField, FlatList/List
- **Error Handling**: Auto-dismiss toasts after 5s with manual close option - apply to kudos send confirmations
- **Optimistic Updates**: Immediately update UI before API response - apply to kudos send (show "Sending..." then update count)
- **Redux Integration**: `useAppDispatch` + `useAppSelector` hooks - integrate kudos state with event detail screens
- **File Structure**: Screens in `screens/`, components in `components/`, services in `shared/services/` - follow established structure

**Technical Decisions from Epic 2:**

- Hardcoded coordinates used in Event creation (geocoding deferred) - not applicable to kudos
- Navigation handlers have TODOs for React Navigation - kudos modal can use simple state-based modal (no navigation needed)
- Redux slice duplication (mobile/web) noted as technical debt - acceptable for kudos slice too (can refactor to shared later)

**Services to Reuse (NOT recreate):**

- `EventService`: Use `getEvent()` to fetch event details for kudos context
- `AuthService`: Use auth state to get current user ID for kudos sender
- State patterns: Follow `eventsSlice` patterns for socialSlice structure

**Testing Setup:**

- Test suite patterns established in `shared/src/__tests__/services/` and `shared/src/__tests__/validation/`
- Follow existing patterns for SocialService tests and kudos validation tests
- Component test structure follows Epic 1 patterns

[Source: stories/2-1-host-event-creation.md#Dev-Agent-Record]

### Technical References

**Tech Spec:** [Epic 4 Tech Spec](../tech-spec-epic-4.md) - Sections: Kudos Models, Kudos APIs, Workflow 1 (Kudos Send), NFR (Performance, Security, Reliability)

**PRD References:**

- FR017: Post-event social features with kudos system
- FR032: Analytics instrumentation for kudos events
- Goal: 70% of users give/receive kudos post-event

**Architecture References:**

- Service Layer: Follow IEventService pattern from Epic 2 for ISocialService
- State Management: Redux Toolkit + TanStack Query (cache kudos data with 5min TTL)
- Component Library: KudosButton, PartnerAvatar per architecture
- Offline Strategy: Kudos queued locally, synced on reconnect with Redux Persist

**Rate Limiting:**

- Backend enforces 5 kudos per user per event (server-side validation)
- Frontend pre-validates and disables UI at limit
- Rate limit stored per (userId, eventId) tuple
- Error code: 429 Too Many Requests if limit exceeded

**XP Rewards:**

- +10 XP for sender on successful kudos send
- +10 XP for receiver when kudos received
- XP transaction logged with type: "kudos_given" / "kudos_received"
- XP state managed in gamification store (Epic 3 integration point)

**Push Notifications:**

- Firebase Cloud Messaging for mobile (iOS + Android)
- Web Push Notifications for web browsers
- Notification payload: { type: 'kudos_received', senderId, eventId, message }
- Deep link format: `gss://event/{eventId}?tab=kudos`

**Data Types (from Tech Spec):**
\`\`\`typescript
interface Kudos {
id: string;
eventId: string;
senderId: string;
sender: User;
receiverId: string;
receiver: User;
message?: string; // Optional, 140 char max
createdAt: string;
}

interface KudosStats {
userId: string;
totalGiven: number;
totalReceived: number;
givenThisMonth: number;
receivedThisMonth: number;
}
\`\`\`

### Implementation Notes

**Component Hierarchy:**
\`\`\`
EventDetailScreen/Page
├── EventDetailsSection (existing)
├── ParticipantsList (existing)
├── KudosButton ← NEW (Task 3/4)
│ └── Opens KudosModal
├── KudosModal ← NEW (Task 3/4)
│ ├── ParticipantSearch
│ ├── ParticipantList (FlatList/List)
│ ├── MessageInput
│ └── SendButton
└── KudosReceivedSection ← NEW (Task 5)
└── KudosList (FlatList/List)
\`\`\`

**Redux State Structure:**
\`\`\`typescript
social: {
sentKudos: Record<eventId, Kudos[]>,
receivedKudos: Record<eventId, Kudos[]>,
kudosStats: KudosStats | null,
kudosQueue: KudosQueueItem[], // For offline support
loading: {
sendKudos: boolean,
getKudos: boolean,
syncQueue: boolean,
},
error: {
sendKudos: string | null,
getKudos: string | null,
},
success: {
sendKudos: boolean,
},
}
\`\`\`

**Validation Rules:**

- Message: optional, max 140 characters, alphanumeric + basic punctuation
- Rate limit: max 5 kudos per (userId, eventId) tuple
- Participants: sender and receiver must have checked into event
- Duplicate prevention: cannot send kudos twice to same person in same event

**Error Scenarios:**

1. Rate limit exceeded (5/5 sent) → Disable button, show toast
2. Recipient not checked in → Show warning in modal, disable recipient selection
3. Network offline → Queue kudos, show "Queued" badge, sync on reconnect
4. Server error (500) → Show retry toast, exponential backoff
5. Invalid message (>140 chars) → Inline validation error, disable send button

**Performance Targets (from Tech Spec NFR):**

- Kudos send latency: <1s from button tap to confirmation (p95)
- Modal load time: <500ms to display participant list
- Optimistic UI update: Immediate (0ms) - don't wait for API response
- Offline queue sync: <2s to sync all queued kudos on reconnect

**Accessibility:**

- KudosButton: aria-label="Give kudos to event participants"
- KudosModal: focusable participant list, keyboard navigation
- Screen reader announces: "Kudos sent to [Name]" on success
- Color contrast: Kudos count badge readable on all themes

### Change Log

- **2025-11-10**: Story created with drafted status, next backlog item from Epic 4

# Story 2.5: Event Reminders & Cancellation Flow

Status: ready-for-dev

## Story

As a **participant user**,
I want **to receive event reminders and be able to cancel RSVPs with clear reliability impact**,
so that **I stay informed about my commitments and can manage conflicts responsibly**.

## Acceptance Criteria

**AC1: Event Reminder Notifications (Tech Spec AC6)**

1. Reminders automatically scheduled on RSVP confirmation
2. 24-hour reminder sent with event details, location, participants count
3. 1-hour reminder sent with check-in instructions, QR code access shortcut
4. Reminder notifications include:
   - Event title and sport
   - Date/time with countdown
   - Location with "Get Directions" link
   - Participant count: "X confirmed"
   - Quick actions: "View Event", "Cancel RSVP" (24h reminder only)
   - Deep link to event detail screen
5. Reminders delivered via Firebase Cloud Messaging with 99%+ delivery rate (inherited from Epic 1)
6. Reminders not sent for cancelled RSVPs
7. Notification tap opens app to event detail screen
8. Reminder timing configurable by backend (24h, 1h defaults per PRD)

**AC2: ETA Quick-Reply System (Tech Spec AC8, Journey 2)**

1. 1-hour reminder includes quick-reply actions (mobile push notification)
2. Quick-reply options without opening app:
   - "On time" ✓
   - "5 min late"
   - "10 min late"
   - "15 min late"
   - "Can't make it" ✗
3. Tap quick-reply option sends ETA update to backend
4. API call to `eventService.updateETAStatus()` with selected delay
5. Host dashboard updates in real-time showing participant ETA statuses
6. Host sees: "User X: +10 min" next to participant name with color coding
7. Color coding: green (on-time), yellow (running late 5-15min), red (can't make it)
8. "Can't make it" selection triggers cancellation flow with reliability penalty
9. ETA updates visible to other participants (optional, configurable)
10. Multiple ETA updates allowed, shows latest status
11. ETA status clears after event start time + 30 minutes

**AC3: Cancellation Workflow with Cut-Off Windows (Tech Spec AC7)**

1. "Cancel RSVP" button available on event detail screen for confirmed RSVPs (before event)
2. Tap button checks cancellation window (e.g., 4+ hours before event per PRD)
3. If within grace period window: display "No penalty" message
4. If outside window: display reliability impact preview:
   - "Cancelling less than 4 hours before the event"
   - "Your reliability score will decrease by X%"
   - "This will be marked as a late cancellation"
5. Cancellation reason selection (optional):
   - Emergency
   - Illness
   - Schedule conflict
   - Other (text input)
6. Confirmation dialog with impact summary before finalizing
7. API call to `eventService.cancelRSVP()` with reason and timestamp
8. Backend voids deposit authorization (no charge occurs via Stripe)
9. Backend updates reliability score based on timing and frequency
10. Notification sent to host: "User X cancelled their RSVP for Event Y"
11. Confirmation screen: "RSVP cancelled. Deposit not charged." (if applicable)
12. Event capacity increments, participant list updates immediately (optimistic UI)
13. User's RSVP list updates to show "Cancelled" status with timestamp

**AC4: Cancellation Grace Period Logic**

1. Grace period window: 4 hours before event start (configurable by backend)
2. Within grace period: no reliability penalty, deposit authorization voided
3. Outside grace period (late cancellation):
   - Reliability score decreases (backend calculation)
   - Marked as "late cancellation" in user's history
   - Deposit authorization voided (user still not charged)
   - Host notified with "late" indicator
4. Backend tracks cancellation patterns:
   - Frequency of late cancellations
   - Time-to-event distribution
   - Reason patterns (if provided)
5. Repeated late cancellations trigger warnings:
   - "You've cancelled 3 events in the last month"
   - "This affects your reliability score and event access"

**AC5: Host Notification System**

1. Host receives push notification when user cancels RSVP
2. Notification content:
   - "User X cancelled RSVP for Event Y"
   - Cancellation timing: "4 hours before event" or "Last minute"
   - Reason (if provided by user)
   - Updated participant count
   - Deep link to event dashboard
3. Host dashboard updates participant list in real-time
4. Cancelled participant shown with status: "Cancelled" and timestamp
5. Capacity indicator updates: "9/10 confirmed" → "8/10 confirmed"
6. Host can view cancellation reason if provided

**AC6: Reliability Score Impact Visibility**

1. Cancellation confirmation shows reliability impact:
   - "Your reliability score: 85% → 81%"
   - "This cancellation will be visible in your profile"
2. User profile shows reliability history (read-only):
   - Check-in rate: "X% of RSVPs attended"
   - Late cancellation rate: "Y% cancelled <4h before"
   - No-show rate: "Z% no-shows"
3. Reliability score calculation logic (backend):
   - Check-in: +1 point
   - Cancellation within grace period: 0 points
   - Late cancellation: -2 points
   - No-show: -5 points
   - Score = (Total points / Total RSVPs) \* 100
4. Score ranges displayed with indicators:
   - 90-100%: Excellent (green badge)
   - 75-89%: Good (blue badge)
   - 60-74%: Fair (yellow badge)
   - <60%: Needs improvement (red badge)

## Tasks / Subtasks

**Task 1: Reminder Notification Service (AC: 1)**

- [ ] Implement reminder scheduling in EventService
  - [ ] On RSVP creation, calculate reminder timestamps (event time - 24h, - 1h)
  - [ ] Backend API handles scheduling (client just confirms RSVP)
  - [ ] Reminder data includes: eventId, userId, reminderType, scheduledTime
- [ ] Implement NotificationService for reminder delivery
  - [ ] Integration with Firebase Cloud Messaging (inherited from Epic 1)
  - [ ] Notification payload: title, body, event data, deep link, quick actions
  - [ ] Handle notification permissions and delivery confirmation
- [ ] Implement deep linking for notification taps
  - [ ] Deep link format: `gss://event/{eventId}/detail`
  - [ ] Navigation to EventDetailScreen on notification tap
  - [ ] Handle app in foreground, background, or quit states

**Task 2: ETA Quick-Reply Implementation (AC: 2)**

- [ ] Implement `EventService.updateETAStatus()` in shared services
  - [ ] API call to `PUT /api/v1/events/:id/eta`
  - [ ] Request body: `{ status: 'on-time' | 'running-late', minutesLate?: number }`
  - [ ] Response parsing: ETAStatus with confirmation
- [ ] Configure push notification quick actions (mobile)
  - [ ] iOS: UNNotificationCategory with actions
  - [ ] Android: NotificationCompat.Action with PendingIntent
  - [ ] Action IDs: `eta_ontime`, `eta_late_5`, `eta_late_10`, `eta_late_15`, `eta_cant_make_it`
- [ ] Implement notification action handlers
  - [ ] Listen for notification action responses
  - [ ] Call updateETAStatus API with selected option
  - [ ] Show success toast/banner: "Host notified you're running 10 min late"
  - [ ] Handle "Can't make it" → trigger cancellation flow

**Task 3: Cancellation Service Layer (AC: 3, 4)**

- [ ] Implement `EventService.cancelRSVP()` in shared services
  - [ ] API call to `DELETE /api/v1/events/:id/rsvp`
  - [ ] Request body: `{ reason?: string, timestamp: ISO8601 }`
  - [ ] Response: cancellation confirmation, reliability impact, deposit void status
- [ ] Implement cancellation window calculation
  - [ ] Client-side: check current time vs event start time
  - [ ] Grace period: 4 hours (configurable from backend config endpoint)
  - [ ] Display appropriate messaging based on window
- [ ] Implement reliability impact calculation (backend handles, client displays)
  - [ ] API returns: previousScore, newScore, penaltyType
  - [ ] Client displays delta: "85% → 81%"

**Task 4: Cancellation UI Flow (AC: 3, 6)**

- [ ] Mobile: Implement cancellation dialog
  - [ ] Confirmation dialog with impact preview
  - [ ] Reason selection (radio buttons or dropdown)
  - [ ] Text input for "Other" reason
  - [ ] Warning message if late cancellation
  - [ ] "Confirm Cancellation" and "Keep RSVP" buttons
- [ ] Web: Implement cancellation dialog (same logic, MUI components)
  - [ ] MUI Dialog with form
  - [ ] Reason selection (MUI Select or RadioGroup)
  - [ ] TextField for other reason
  - [ ] Impact preview display
- [ ] Create cancellation confirmation screen
  - [ ] Success message: "RSVP cancelled"
  - [ ] Deposit void confirmation (if applicable)
  - [ ] Reliability score update display
  - [ ] "Back to Events" button

**Task 5: Host Notification System (AC: 5)**

- [ ] Implement host notification on cancellation
  - [ ] Backend triggers push notification to host
  - [ ] Notification payload: user name, event title, timing indicator, reason
  - [ ] Deep link to host dashboard: `gss://host/events/{eventId}`
- [ ] Update HostDashboard with cancellation indicators (Story 2-1 enhancement)
  - [ ] Real-time participant list updates
  - [ ] Cancelled participant shown with badge
  - [ ] Cancellation reason displayed (if provided)
  - [ ] Timestamp: "Cancelled 2 hours ago"

**Task 6: Reliability Score Display (AC: 6)**

- [ ] Enhance UserProfile with reliability section
  - [ ] Display reliability score with badge (color-coded)
  - [ ] Breakdown: check-in rate, late cancellation rate, no-show rate
  - [ ] Historical data: last 10 events with status (checked in, cancelled, no-show)
  - [ ] Read-only display (user cannot edit)
- [ ] Implement reliability score updates on cancellation
  - [ ] Update user profile state after cancellation
  - [ ] Show delta in cancellation confirmation
  - [ ] Persist updated score in local cache

**Task 7: State Management for Reminders and Cancellations (AC: All)**

- [ ] Update RSVPStore with cancellation state
  - [ ] State: cancellationStatus, cancellationReason, reliabilityImpact
  - [ ] Actions: cancelRSVPStart/Success/Failure, updateCancellationStatus
  - [ ] Selectors: selectCancellationStatus, selectReliabilityImpact
- [ ] Update EventStore with ETA state
  - [ ] State: etaStatus, etaTimestamp, etaMinutesLate
  - [ ] Actions: updateETAStart/Success/Failure
  - [ ] Selectors: selectETAStatus

**Task 8: Testing (AC: All)**

- [ ] Unit tests for reminder and cancellation services
  - [ ] Test cancelRSVP with various timing scenarios
  - [ ] Test updateETAStatus with different options
  - [ ] Test reminder scheduling logic
  - [ ] Test grace period calculation
- [ ] Unit tests for state management
  - [ ] Test cancellation mutations and cache updates
  - [ ] Test ETA updates and real-time sync
- [ ] Component tests for UI flows
  - [ ] Test cancellation dialog with impact preview
  - [ ] Test quick-reply action handling
  - [ ] Test reliability score display
- [ ] Integration tests
  - [ ] Test complete cancellation flow with API mocks
  - [ ] Test ETA quick-reply end-to-end
  - [ ] Test host notification delivery
- [ ] E2E tests
  - [ ] Test receive reminder notification
  - [ ] Test ETA quick-reply (mock notification action)
  - [ ] Test cancellation within/outside grace period
  - [ ] Test reliability score update after cancellation

## Dev Notes

**Implementation Priority:** This story completes Epic 2 and should be implemented after Stories 2-1, 2-2, and 2-3. Reminder and cancellation features are critical for user engagement and reliability.

**Architecture Alignment:**

- Implements Tech Spec AC6 (Event Reminder Notification System)
- Implements Tech Spec AC7 (Cancellation Workflow with Reliability Impact)
- Implements Tech Spec AC8 (ETA Quick-Reply System for Late Attendees)
- Aligns with NotificationService, EventService, RSVPStore modules

**Key Dependencies:**

- Stories 2-1, 2-2, 2-3: Complete event lifecycle must be functional
- Epic 1: Firebase Cloud Messaging setup for push notifications
- Backend APIs: `DELETE /api/v1/events/:id/rsvp`, `PUT /api/v1/events/:id/eta`, `POST /api/v1/notifications/schedule`
- Stripe: Deposit void API for cancellation refunds

**Technical Considerations:**

1. **Firebase Cloud Messaging:**
   - Push notification delivery with 99%+ rate (inherited from Epic 1)
   - Quick-reply actions: iOS UNNotificationCategory, Android NotificationCompat.Action
   - Notification action handlers in background service
   - Deep linking to event detail on notification tap

2. **Reliability Score Calculation (Backend):**
   - Check-in: +1 point
   - On-time cancellation (>4h): 0 points
   - Late cancellation (<4h): -2 points
   - No-show: -5 points
   - Score = (Total points / Total RSVPs) \* 100
   - Frontend displays score and delta, backend calculates

3. **Grace Period Configuration:**
   - Default: 4 hours before event (per PRD)
   - Configurable via backend client-config endpoint
   - Client validates timing client-side, backend authoritative

4. **ETA Status Duration:**
   - ETA status active until event start + 30 minutes
   - Backend clears expired ETA statuses automatically
   - Host dashboard hides ETA after event starts

5. **Performance Targets:**
   - Notification delivery: <5s from trigger to device
   - ETA update API: <500ms response time
   - Cancellation API: <2s including deposit void
   - Host dashboard ETA updates: <2s latency (WebSocket or polling)

**Testing Strategy:**

- **Unit Tests (70%):** cancelRSVP, updateETAStatus, grace period logic, reliability calculation display
- **Integration Tests (20%):** Complete cancellation flow, ETA quick-reply, host notifications
- **E2E Tests (10%):** Receive reminder, quick-reply ETA, cancel within/outside grace period

**Security Considerations:**

- Cancellation API requires valid JWT and RSVP ownership verification
- ETA updates validated: user has active RSVP for event
- Deposit void idempotency prevents double processing
- Grace period timing validated on backend (never trust client)

**UX Considerations:**

- Clear impact preview before cancellation (reliability delta, timing penalty)
- Quick-reply actions for fast ETA updates without opening app
- Success confirmations for all actions (cancel, ETA update)
- Color-coded reliability badges (green/blue/yellow/red) for at-a-glance status
- Helpful messaging: "Cancelling early helps hosts plan better"
- Host notifications provide context (timing, reason) for better understanding

### Project Structure Notes

**Shared:**

- `shared/services/api/events.service.ts` - cancelRSVP, updateETAStatus methods
- `shared/services/api/notification.service.ts` - Reminder scheduling
- `shared/types/cancellation.ts` - CancellationRequest, ReliabilityImpact interfaces
- `shared/types/eta.ts` - ETAStatus, ETAUpdateRequest interfaces

**Mobile:**

- `mobile/src/components/events/CancellationDialog.tsx` - Cancellation flow
- `mobile/src/components/events/ReliabilityScore.tsx` - Score display
- `mobile/src/services/notificationHandler.ts` - FCM action handlers
- `mobile/src/hooks/useCancelRSVP.ts` - Cancellation hook
- `mobile/src/hooks/useETAUpdate.ts` - ETA update hook

**Web:**

- `web/src/components/events/CancellationDialog.tsx` - Cancellation dialog
- `web/src/components/events/ReliabilityScore.tsx` - Score component
- `web/src/hooks/useCancelRSVP.ts` - Cancellation hook (shared logic)
- `web/src/hooks/useETAUpdate.ts` - ETA hook (shared logic)

### References

- [Source: docs/tech-spec-epic-2.md#AC6: Event Reminder Notification System]
- [Source: docs/tech-spec-epic-2.md#AC7: Cancellation Workflow with Reliability Impact]
- [Source: docs/tech-spec-epic-2.md#AC8: ETA Quick-Reply System for Late Attendees]
- [Source: docs/tech-spec-epic-2.md#Services - NotificationService, EventService]
- [Source: docs/tech-spec-epic-2.md#Workflows - Cancellation Flow, ETA Quick-Reply Flow]
- [Source: docs/tech-spec-epic-2.md#Dependencies - Firebase Cloud Messaging]
- [Source: docs/shared/PRD.md#FR011: Reminder notifications]
- [Source: docs/shared/PRD.md#FR012: Cancellation workflow]
- [Source: docs/shared/PRD.md#Journey 2: ETA quick-reply enhancement]

## Dev Agent Record

### Context Reference

`docs/stories/2-5-event-reminders-cancellation-flow.context.xml` - Generated: 2025-11-10

### Agent Model Used

Claude 3.5 Sonnet (Bob - Scrum Master Agent)

### Debug Log References

None

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->

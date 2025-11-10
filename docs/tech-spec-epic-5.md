# Epic Technical Specification: Notification & Preference Center + Automated Late ETA

Date: November 9, 2025
Author: Jay
Epic ID: 5
Status: Draft

---

## Overview

Epic 5 implements a comprehensive notification preference center and automated late arrival ETA system for the GSS Client, enabling users to control their engagement signals while improving host reliability visibility through real-time late arrival updates. This epic focuses on frontend client implementation (React Native mobile + React web) integrating with existing backend Notification APIs to deliver a preference center UI with 6 configurable notification categories, push notification dispatcher with templating support, quick-reply functionality for late check-in ETAs that updates host dashboards in real-time, and audit logging for notification delivery and user interactions. The implementation addresses Journey 2 enhancement (ETA quick-reply logic) and FR023 (preference center) while extending the notification infrastructure established in Epic 1 for authentication and Epic 2 for event reminders. This epic enhances user autonomy and trust by providing transparent control over notifications while simultaneously improving host planning capabilities through proactive late-arrival communication.

## Objectives and Scope

**In Scope:**

- Preference center UI with 6 toggleable notification categories
- Notification categories: event reminders, streak risk, quest progress, kudos, deposit reminders, competitive unlock
- Push notification dispatcher supporting FCM delivery
- Notification templating with dynamic content injection
- Quick-reply push notification actions for late check-in scenarios
- ETA options: On time, 5/10/15 min late, Can't make it
- Real-time host dashboard ETA status display with color coding
- Notification delivery audit logging
- In-app notification history view with read/unread status
- Deep linking from notifications to relevant screens
- Notification permission prompts with educational messaging
- Web notification support for host dashboard alerts

**Out of Scope:**

- Email digest generation (FR033 basic weekly digest placeholder only)
- SMS/text notification channels
- Advanced notification scheduling algorithms (ML-based timing)
- Rich notification media (images, videos)
- Admin notification broadcast tools - Epic 8
- Group/community notification channels - Deferred Phase 2
- Custom notification sounds per category
- DND schedule management

## System Architecture Alignment

This epic implements notification and preference components defined in the client architecture, specifically:

- **Notification Components:** NotificationPreferences, NotificationHistory, ETAQuickReply per architecture
- **Service Layer:** NotificationService, PreferenceService interfaces in shared/services/api/
- **State Management:** Redux Toolkit notification/preference slices + TanStack Query
- **Mobile Screens:** mobile/src/screens/settings/PreferencesScreen, NotificationHistoryScreen
- **Web Pages:** web/src/pages/settings/NotificationsSettings, web/src/pages/host/ETADashboard
- **Native Features:** @react-native-firebase/messaging for FCM push
- **Push Integration:** Firebase Cloud Messaging foundation from Epic 1
- **Offline Strategy:** Preference changes cached locally, synced on reconnect
- **Design System:** React Native Paper List components with toggle switches

## Detailed Design

### Services and Modules

| Module                       | Responsibility                    | Inputs                                    | Outputs                                | Owner                                                 |
| ---------------------------- | --------------------------------- | ----------------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| **PreferenceService**        | Notification preference CRUD      | Preference updates, category toggles      | Preference objects, sync confirmations | shared/services/api/preference.service.ts             |
| **NotificationService**      | Notification delivery, templating | Notification requests, templates          | Delivery status, notification IDs      | shared/services/api/notification.service.ts           |
| **ETAService**               | ETA update handling, host sync    | ETA selections, event IDs                 | ETA status updates, dashboard refresh  | shared/services/api/eta.service.ts                    |
| **PushNotificationHandler**  | FCM message handling, actions     | FCM tokens, payloads, quick-reply actions | Action confirmations, deep links       | mobile/src/services/pushNotificationHandler.ts        |
| **NotificationAuditLogger**  | Log delivery, opens, actions      | Notification events, interaction data     | Audit records, analytics events        | shared/services/analytics/notificationAudit.ts        |
| **PreferenceStore**          | Notification preference state     | Preference actions, sync status           | Preference state, pending changes      | mobile/src/store/preferences/                         |
| **NotificationHistoryStore** | In-app notification history       | Notification fetch, mark read actions     | History list, unread count             | mobile/src/store/notifications/                       |
| **PreferencesScreen**        | Preference center UI              | User interactions, toggle changes         | Updated preferences, confirmations     | mobile/src/screens/settings/PreferencesScreen.tsx     |
| **ETAQuickReplyFlow**        | Quick-reply UI for late check-in  | Notification actions, ETA selections      | ETA confirmations, host notifications  | mobile/src/components/notifications/ETAQuickReply.tsx |
| **HostETADashboard**         | Real-time ETA status display      | Event participants, ETA updates           | Color-coded participant list           | mobile/src/screens/host/ETADashboard.tsx              |

### Data Models and Contracts

```typescript
// Notification Preference Models
interface NotificationPreferences {
  userId: string;
  categories: {
    eventReminders: CategoryPreference;
    streakRisk: CategoryPreference;
    questProgress: CategoryPreference;
    kudos: CategoryPreference;
    depositReminders: CategoryPreference;
    competitiveUnlock: CategoryPreference;
  };
  globalSettings: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    inAppEnabled: boolean;
  };
  updatedAt: string;
  syncedAt: string;
}

interface CategoryPreference {
  enabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    inApp: boolean;
  };
}

// Notification Models
interface Notification {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  body: string;
  data: Record<string, any>;
  channels: NotificationChannel[];
  status: 'pending' | 'delivered' | 'failed' | 'read';
  actions?: NotificationAction[];
  priority: 'high' | 'normal' | 'low';
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

type NotificationCategory =
  | 'event-reminder'
  | 'streak-risk'
  | 'quest-progress'
  | 'kudos'
  | 'deposit-reminder'
  | 'competitive-unlock'
  | 'eta-request'
  | 'system';

type NotificationChannel = 'push' | 'email' | 'in-app';

interface NotificationAction {
  id: string;
  title: string;
  type: 'open-app' | 'quick-reply' | 'dismiss';
  payload?: Record<string, any>;
  deepLink?: string;
}

// ETA Models
interface ETAUpdate {
  eventId: string;
  userId: string;
  status: 'on-time' | 'running-late' | 'cant-make-it';
  estimatedMinutesLate?: number;
  message?: string;
  timestamp: string;
}

interface ParticipantETAStatus {
  userId: string;
  displayName: string;
  avatar?: string;
  rsvpStatus: 'confirmed' | 'checked-in' | 'cancelled';
  etaStatus?: ETAUpdate;
  checkedIn: boolean;
  checkedInAt?: string;
}

// Audit Logging Models
interface NotificationAuditRecord {
  notificationId: string;
  userId: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  action: 'sent' | 'delivered' | 'opened' | 'action-taken' | 'failed';
  actionPayload?: Record<string, any>;
  errorMessage?: string;
  timestamp: string;
  metadata: {
    deviceType?: 'ios' | 'android' | 'web';
    appVersion?: string;
    fcmToken?: string;
  };
}
```

### APIs and Interfaces

**Backend API Endpoints (Assumed Complete):**

```typescript
// Preference Management
GET    /api/v1/users/:userId/notification-preferences
PUT    /api/v1/users/:userId/notification-preferences
PATCH  /api/v1/users/:userId/notification-preferences/category/:category

// Notification History
GET    /api/v1/users/:userId/notifications?limit=50&offset=0&status=unread
PATCH  /api/v1/notifications/:notificationId/read
DELETE /api/v1/notifications/:notificationId

// ETA Updates
POST   /api/v1/events/:eventId/eta
  Body: { status: 'on-time' | 'running-late' | 'cant-make-it', minutesLate?: number }
GET    /api/v1/events/:eventId/participants/eta

// Audit Logging
POST   /api/v1/analytics/notification-audit
  Body: NotificationAuditRecord
```

**Frontend Service Interfaces:**

```typescript
// PreferenceService
interface IPreferenceService {
  getPreferences(): Promise<NotificationPreferences>;
  updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences>;
  updateCategoryPreference(category: string, preference: CategoryPreference): Promise<void>;
  resetToDefaults(): Promise<NotificationPreferences>;
}

// NotificationService
interface INotificationService {
  getHistory(limit?: number, offset?: number, status?: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
  getUnreadCount(): Promise<number>;
}

// ETAService
interface IETAService {
  updateETA(eventId: string, update: ETAUpdate): Promise<void>;
  getEventETAStatuses(eventId: string): Promise<ParticipantETAStatus[]>;
}
```

### Workflows and Sequencing

**Workflow 1: User Updates Notification Preferences**

1. User navigates to Settings → Notifications
2. PreferencesScreen loads current preferences via PreferenceService.getPreferences()
3. Redux state updated with current preference values
4. User toggles category switch (e.g., disable "Streak Risk" push notifications)
5. Optimistic UI update immediately reflects change
6. PreferenceService.updateCategoryPreference() API call dispatched
7. On success: Sync timestamp updated, confirmation toast shown
8. On failure: Revert optimistic update, show error message with retry option
9. Background sync queues pending changes if offline

**Workflow 2: Late Check-In ETA Quick-Reply (Mobile Push)**

1. Event start time - 1 hour: Backend sends reminder notification with ETA quick-reply actions
2. FCM delivers notification with action buttons: "On time", "5 min late", "10 min late", "15 min late", "Can't make it"
3. User taps "10 min late" action without opening app
4. PushNotificationHandler receives action event
5. ETAService.updateETA() called with eventId, userId, status='running-late', minutesLate=10
6. API request sent to backend, audit log recorded
7. Backend updates event participant ETA status, notifies host via WebSocket
8. Success confirmation shown via local notification: "Host notified you're running 10 min late"
9. Host dashboard subscribes to ETA updates, receives real-time status change
10. Host sees participant list updated: "John D: +10 min" with yellow indicator

**Workflow 3: Host Views ETA Dashboard**

1. Host opens event detail screen for upcoming event (within 2h of start)
2. EventDetailScreen shows "View ETA Status" button for events with active reminders sent
3. Host taps button, navigates to ETADashboard
4. ETAService.getEventETAStatuses() fetches current participant statuses
5. Dashboard displays participant list with columns: Name, RSVP Status, ETA Status, Check-In Status
6. Color coding applied: green (on-time), yellow (running late 5-15min), red (can't make it), gray (no response)
7. Real-time updates via TanStack Query polling (30s interval) or WebSocket
8. When participant submits ETA via quick-reply: callback triggers, Redux state updated, UI re-renders
9. Host can tap participant row to view full RSVP details and contact info
10. When event starts: ETA statuses clear after 30 minutes, check-in statuses become primary

## Non-Functional Requirements

### Performance

- **Preference Load Time:** <500ms for initial preference fetch (cached after first load)
- **Preference Update Latency:** <800ms for save confirmation, optimistic updates immediate
- **Notification History Load:** <1s for 50 notifications, virtualized list for 200+ items
- **ETA Update Latency:** <2s from quick-reply tap to host dashboard update
- **Push Notification Delivery:** p95 <5s from backend trigger to device delivery (FCM SLA)
- **Deep Link Navigation:** <300ms from notification tap to target screen render

### Security

- **FCM Token Security:** Tokens encrypted at rest, refreshed on expiry, revoked on logout
- **Preference Authorization:** Preference updates validated server-side, require valid JWT
- **Audit Log Integrity:** Immutable audit records, tampering detection via checksum validation
- **ETA Update Authorization:** ETA updates require active RSVP for event, validated backend
- **Notification Payload Sanitization:** Template injection prevented, user input escaped
- **Deep Link Validation:** Deep links validated against whitelist, no arbitrary URL execution

### Reliability/Availability

- **Offline Preference Changes:** Queued locally, synced on reconnect with conflict resolution (last-write-wins)
- **Failed Notification Retry:** Exponential backoff retry (1s, 5s, 30s) for failed deliveries, max 3 attempts
- **ETA Update Idempotency:** Duplicate ETA submissions deduplicated by timestamp + userId + eventId
- **Graceful Degradation:** If push disabled, fallback to in-app notifications with badge count
- **Notification Expiry:** Old notifications auto-deleted after 30 days, expired notifications not shown

### Observability

- **Instrumentation Events:**
  - `notification_preference_updated`: category, enabled, channels
  - `notification_sent`: category, channels, userId
  - `notification_delivered`: notificationId, channel, latency
  - `notification_opened`: notificationId, timeSinceSent
  - `notification_action_taken`: notificationId, actionType, payload
  - `eta_update_submitted`: eventId, status, minutesLate
  - `eta_dashboard_viewed`: eventId, hostId, participantCount
  - `notification_delivery_failed`: notificationId, channel, errorCode

- **Metrics:**
  - Notification delivery rate per category and channel (target >95%)
  - Notification open rate per category (target >40% for high-priority)
  - ETA quick-reply usage rate (target >30% of late arrivals)
  - Preference opt-out rate per category (monitor for user fatigue)
  - Average ETA update latency (target p95 <2s)

## Dependencies and Integrations

**Internal Dependencies:**

- Epic 1: Firebase Cloud Messaging setup, authentication tokens
- Epic 2: Event model, RSVP status, reminder scheduling foundation
- Epic 3: Quest progress notifications, streak risk detection
- Epic 4: Kudos notifications, partner activity triggers

**External Dependencies:**

- Firebase Cloud Messaging: Push notification delivery
- Browser Push API: Web push notifications for host dashboards
- WebSocket Server: Real-time ETA updates (or polling fallback)
- Backend Notification Service: Notification scheduling, templating, delivery orchestration

**Third-Party SDKs:**

- @react-native-firebase/messaging (v20.5.0+): FCM integration
- react-native-push-notification (v8.1.1+): Local notification handling
- socket.io-client (v4.8.1+): WebSocket client for real-time ETA updates
- @tanstack/react-query (v5.90.7+): Notification history caching

## Acceptance Criteria (Authoritative)

### AC1: Preference Center UI Implementation

1. Settings screen includes "Notifications" option with badge showing enabled category count
2. Preferences screen displays 6 categories with toggle switches
3. Each category toggle controls push notification delivery
4. Global settings section includes master toggle: "Push Notifications Enabled"
5. Tapping master toggle shows permission prompt if not granted
6. Changes auto-save with optimistic UI updates and confirmation toast
7. "Reset to Defaults" button restores recommended settings
8. Preferences load from backend on screen mount, cached for offline viewing
9. Offline changes queued and synced when connection restored
10. Web version matches mobile functionality with accessible form controls

**Validation:** All 6 categories toggle correctly, changes persist across app restarts

### AC2: Push Notification Dispatcher with Templating

1. NotificationService supports template-based notification generation
2. Backend triggers notification with template ID and context data
3. Frontend receives fully rendered notification via FCM
4. Deep links embedded in notification data navigate to correct screens
5. Notification badges update app icon count for unread
6. Silent notifications trigger background data sync
7. Notification priority determines presentation: high (full-screen), normal (banner), low (silent)
8. Delivery audit logged for each notification
9. Failed deliveries retry with exponential backoff
10. User can tap notification to open app, deep link navigation completes <300ms

**Validation:** Test notifications for all 6 categories render correctly, deep links navigate successfully

### AC3: Quick-Reply ETA Actions for Late Check-In

1. Event reminder notification (1h before start) includes quick-reply actions
2. Actions displayed: "On time" ✓, "5 min late", "10 min late", "15 min late", "Can't make it" ✗
3. User can tap action without opening app
4. Action triggers ETAService.updateETA() API call
5. Backend updates event participant ETA status in real-time
6. Success confirmation shown via local notification
7. "Can't make it" action triggers cancellation flow
8. Multiple ETA updates allowed, latest status displayed
9. ETA status clears after event start time + 30 minutes

**Validation:** Quick-reply actions send correct ETA updates, host dashboard reflects changes <2s

### AC4: Host ETA Dashboard Real-Time Display

1. Host can access ETA Dashboard from event detail screen
2. Dashboard displays participant list with ETA Status column
3. ETA Status shows: green "On time", yellow "+10 min late", red "Can't make it", gray "No response"
4. Real-time updates via polling (30s) or WebSocket
5. Participant count summary: "8 on time, 2 running late, 1 can't make it"
6. Host can tap participant row to view RSVP details
7. ETA statuses persist until event start + 30 minutes, then clear
8. Dashboard accessible on mobile and web with responsive layout

**Validation:** Dashboard shows accurate ETA statuses, updates within 2s of participant submission

### AC5: Notification History and Audit Logging

1. In-app notification history accessible from profile/settings
2. History displays last 50 notifications with infinite scroll
3. Each notification shows: category icon, title, body preview, timestamp, read/unread indicator
4. Tapping notification marks as read, deep links to relevant screen
5. Swipe-to-delete removes notification from history
6. "Mark all as read" action available when unread count >0
7. Notification expiry: auto-delete notifications >30 days old
8. Backend audit logs capture: sent, delivered, opened, action-taken, failed events
9. Audit records immutable
10. Analytics dashboard aggregates audit data

**Validation:** History loads correctly, read/unread status syncs, audit logs capture all events

### AC6: Notification Permission Handling and Graceful Degradation

1. On first app launch: permission prompt with educational message
2. If user grants permission: FCM token registered, preferences default to all enabled
3. If user denies permission: in-app notifications used as fallback
4. Settings screen shows permission status: "Granted", "Denied", "Not Determined"
5. If denied: "Enable Push Notifications" button navigates to system settings
6. Web notifications use browser Push API with permission prompt
7. Offline mode: notifications queued locally, delivered when connection restored
8. Category preferences respected even if push disabled
9. Graceful error handling: FCM token registration failure logs error, retries on next launch

**Validation:** Permission flows work correctly, fallback to in-app notifications functional

## Traceability Mapping

| Acceptance Criteria | PRD Functional Requirements                | User Journeys | Architecture Components                 | Stories  |
| ------------------- | ------------------------------------------ | ------------- | --------------------------------------- | -------- |
| AC1                 | FR023 (Preference Center)                  | N/A           | PreferencesScreen, PreferenceService    | 5-1      |
| AC2                 | FR032 (Instrumentation), FR011 (Reminders) | Journey 1     | NotificationService, Templating         | 5-2, 5-3 |
| AC3                 | Journey 2 (ETA quick-reply)                | Journey 2     | ETAQuickReply, PushNotificationHandler  | 5-4      |
| AC4                 | Journey 2, FR026 (Host Dashboard)          | Journey 2     | HostETADashboard, ETAService            | 5-5      |
| AC5                 | FR032 (Instrumentation)                    | N/A           | NotificationHistory, AuditLogger        | 5-6      |
| AC6                 | NFR004 (Security), FR023                   | Journey 1     | PermissionHandler, Graceful Degradation | 5-1      |

**Story Breakdown (Estimated 10-14 stories):**

- Story 5-1: Preference Center UI (AC1, AC6)
- Story 5-2: Notification Dispatcher & Templating (AC2)
- Story 5-3: Deep Link Navigation from Notifications (AC2)
- Story 5-4: ETA Quick-Reply Actions (AC3)
- Story 5-5: Host ETA Dashboard Real-Time Updates (AC4)
- Story 5-6: Notification History & Audit Logging (AC5)
- Story 5-7: Web Push Notifications for Host Dashboard
- Story 5-8: Notification Permission Flows & Fallbacks
- Story 5-9: Silent Notifications & Background Sync
- Story 5-10: Notification Analytics Dashboard

## Risks, Assumptions, Open Questions

**Risks:**

- FCM delivery latency variance (p95 <5s not guaranteed during network congestion)
- iOS notification action limitations (quick-reply text input not supported, predefined actions only)
- WebSocket connection stability for ETA updates (fallback to polling may increase latency)
- User notification fatigue from excessive categories
- Notification permission denial rates post-iOS 15+ privacy changes (30-40% denial rates observed)

**Assumptions:**

- Backend notification service provides templating, scheduling, delivery orchestration
- Firebase Cloud Messaging handles push delivery with 95%+ success rate
- WebSocket server supports real-time ETA updates with <2s latency
- User preferences stored server-side, synced across devices

**Open Questions:**

- Should quiet hours (DND schedule) be included in Epic 5 or deferred?
- What is the maximum notification history retention period? (30 days assumed)
- Should notification preferences sync across devices or remain per-device?
- How should conflicting preference changes be resolved? (last-write-wins assumed)

## Test Strategy Summary

**Unit Tests (70%):**

- PreferenceService: CRUD operations, validation, sync logic
- NotificationService: Template rendering, deep link generation, audit logging
- ETAService: ETA update API calls, status aggregation
- PreferenceStore: Redux actions, reducers, optimistic updates

**Integration Tests (20%):**

- Preference update flows: UI changes → API call → state update → confirmation
- Quick-reply ETA flow: Action tap → API call → host dashboard update
- Notification delivery: Backend trigger → FCM delivery → user receives
- Deep link navigation: Notification tap → app launch → screen navigation

**E2E Tests (10%):**

- User enables/disables notification category → receives/doesn't receive notification
- User submits late ETA via quick-reply → host sees updated status in dashboard
- User opens notification → navigates to correct screen → mark as read
- User denies notification permission → fallback to in-app notifications works

**Coverage Targets:**

- Unit tests: 80% line coverage
- Integration tests: All 6 AC scenarios validated
- E2E tests: Critical paths (permission flow, quick-reply, dashboard updates) verified

**Testing Tools:**

- Jest + React Native Testing Library for unit/component tests
- Detox for E2E mobile testing
- Mock Service Worker (MSW) for API mocking
- Firebase Test Lab for device testing

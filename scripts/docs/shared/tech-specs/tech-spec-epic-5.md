# Technical Specification: Notification & Preference Center + Automated Late ETA

**Epic:** Epic 5 - Notification & Preference Center + Automated Late ETA  
**Status:** DRAFT  
**Created:** 2025-11-01  
**Last Updated:** 2025-11-01

---

## Overview and Scope

### Epic Context

Epic 5 delivers the **notification infrastructure** and **user preference controls** required to complete the gamification and event management features introduced in Epics 1-4. This epic transforms stub notification services into production-ready push notification delivery with full preference management, while also implementing automated late arrival ETA quick-replies for hosts during event check-in.

**Key Deliverables:**

1. **Notification Preference Center** - User-facing UI to toggle 6 notification categories (event reminders, streak risk, quest progress, kudos, deposit reminders, competitive unlock availability)
2. **Push Notification Dispatcher** - Event-driven notification delivery system using Firebase Cloud Messaging (FCM) or managed service (decision to be finalized during prep sprint)
3. **Push Notification Templates** - Standardized message templates with variable substitution and CTA deep-linking
4. **ETA Quick-Reply System** - Push notifications with actionable buttons ("Arriving in 5/10/15 min" or "Can't make it") that update host dashboard in real-time
5. **Notification Audit Logging** - Instrumentation events for notification delivery (sent, opened, clicked, failed) to enable analytics and debugging

**Epic Goals:**

- Replace stub `NotificationService.sendPushNotification()` from Epic 2 with full FCM/APNs integration
- Enable users to control which notifications they receive (FR023)
- Provide hosts with real-time ETA visibility during event check-in (Journey 2, Step 5-6)
- Create reusable notification infrastructure for future features (social kudos, quest reminders, reliability alerts)

### Success Criteria

✅ **Epic Complete When:**

1. Users can toggle 6 notification categories in preference center UI (mobile Settings screen)
2. Push notifications respect user preferences (e.g., streak risk disabled → no streak risk push sent)
3. Host dashboard shows real-time ETA status when users quick-reply from check-in notification ("2 attendees running late - 10 min ETA")
4. Push notifications delivered within 30 seconds of trigger event (e.g., streak risk detected → notification sent)
5. Notification delivery metrics logged to `instrumentation_events` table (sent, opened, clicked, failed)
6. FCM/APNs token registration flow complete (mobile app registers device token on login, updates on token refresh)

### Dependencies

**Prerequisites (Epic 1-4 Complete):**

- Event RSVP system (`event_rsvps` table, check-in QR codes) - Epic 2
- Streak risk detection (`UserStreak.isAtRisk()` flag) - Epic 3
- Quest progress tracking (`UserQuest.progressPercentage`) - Epic 4
- Instrumentation events (`instrumentation_events` table) - Epic 1

**New External Services:**

- **Firebase Cloud Messaging (FCM)** - Push notification delivery for Android/iOS (or managed alternative like OneSignal/Pusher Beams - to be decided in prep sprint)
- **Apple Push Notification Service (APNs)** - iOS push notifications (if using FCM, APNs integration handled by Firebase)

**Blocked By:**

- None (Epic 5 is independent)

**Blocks:**

- Epic 6 (Social Interaction - Kudos) - Kudos notifications require Epic 5 preference center and dispatcher
- Epic 8 (Competitive Unlock) - Unlock availability notifications require Epic 5 infrastructure

---

## Detailed Design

### 1. Data Models

#### 1.1 User Notification Preferences (Existing Table Extension)

**Table:** `users.notification_preferences` (JSONB column, already exists)

**Schema Update (Migration V25):**

```sql
-- Epic 5: Expand notification preferences to include 6 categories
-- Existing: weekly_digest (Story 3.5)
-- New: event_reminders, streak_risk, quest_progress, kudos, deposit_reminders, competitive_unlock

UPDATE users 
SET notification_preferences = COALESCE(notification_preferences, '{}'::jsonb) || '{
  "event_reminders": true,
  "streak_risk": true,
  "quest_progress": true,
  "kudos": true,
  "deposit_reminders": true,
  "competitive_unlock": true
}'::jsonb
WHERE notification_preferences IS NULL 
   OR NOT notification_preferences ?& ARRAY['event_reminders', 'streak_risk', 'quest_progress', 'kudos', 'deposit_reminders', 'competitive_unlock'];

COMMENT ON COLUMN users.notification_preferences IS 'JSONB notification preferences: weekly_digest (boolean), event_reminders (boolean), streak_risk (boolean), quest_progress (boolean), kudos (boolean), deposit_reminders (boolean), competitive_unlock (boolean). Stories 3.5, 5.x';
```

**Java Model (User entity):**

```java
// src/main/java/com/gss/user/model/User.java (UPDATE)
@Type(JsonBinaryType.class)
@Column(name = "notification_preferences", columnDefinition = "jsonb")
private Map<String, Boolean> notificationPreferences = new HashMap<>(Map.of(
    "weekly_digest", true,
    "event_reminders", true,
    "streak_risk", true,
    "quest_progress", true,
    "kudos", true,
    "deposit_reminders", true,
    "competitive_unlock", true
));
```

#### 1.2 Device Tokens (New Table)

**Table:** `device_tokens`

**Purpose:** Store FCM/APNs device tokens for push notification delivery

```sql
-- Migration V26: Create device_tokens table
CREATE TABLE device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(10) NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
    token VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(user_id, platform, token)
);

CREATE INDEX idx_device_tokens_user_active ON device_tokens(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_device_tokens_token ON device_tokens(token) WHERE is_active = true;
```

#### 1.3 Notification Templates (New Table)

**Table:** `notification_templates`

```sql
-- Migration V27: Create notification_templates table
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL UNIQUE CHECK (category IN (
        'event_reminder', 'streak_risk', 'quest_progress', 'kudos',
        'deposit_reminder', 'competitive_unlock', 'check_in_prompt'
    )),
    title_template VARCHAR(200) NOT NULL,
    body_template VARCHAR(500) NOT NULL,
    cta_action VARCHAR(100),
    cta_deep_link VARCHAR(200),
    priority VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Seed Data (Migration V28):**

```sql
INSERT INTO notification_templates (category, title_template, body_template, cta_action, cta_deep_link, priority) VALUES
('event_reminder', 'Event Starting Soon!', '{eventTitle} starts in {minutes} minutes. Tap to check in.', 'Check In Now', 'gss://events/{eventId}/check-in', 'high'),
('streak_risk', 'Streak at Risk!', 'Your {streakDays}-day streak ends tomorrow. Attend an event to keep it alive!', 'Find Events', 'gss://events/discover', 'normal'),
('quest_progress', 'Quest Update', 'You''re {progressPercent}% done with "{questName}". {remaining} events to go!', 'View Quest', 'gss://quests/{questId}', 'low'),
('kudos', 'You Got Kudos!', '{senderName} sent you kudos: "{message}"', 'View Profile', 'gss://users/{senderId}', 'normal'),
('deposit_reminder', 'Refund Available', 'Your ${depositAmount} deposit for {eventTitle} is ready to refund.', 'Claim Refund', 'gss://events/{eventId}/refund', 'normal'),
('competitive_unlock', 'Competitive Mode Unlocked!', 'You''ve attended {attendanceCount} events. Opt-in to leaderboards!', 'Learn More', 'gss://settings/competitive', 'low'),
('check_in_prompt', '{eventTitle} is starting', 'Running late? Let the host know your ETA.', NULL, NULL, 'high');
```

#### 1.4 ETA Updates (New Table)

**Table:** `event_eta_updates`

```sql
-- Migration V29: Create event_eta_updates table
CREATE TABLE event_eta_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    eta_minutes INTEGER CHECK (eta_minutes IN (5, 10, 15) OR eta_minutes IS NULL),
    cant_make_it BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    superseded_at TIMESTAMP
);

CREATE INDEX idx_eta_updates_event_active ON event_eta_updates(event_id, superseded_at) WHERE superseded_at IS NULL;
```

### 2. Service Architecture

#### 2.1 NotificationDispatchService (New)

**Responsibility:** Central dispatcher for all push notifications (replaces stub `NotificationService`)

**Pattern:** Event-driven (listens to `PushNotificationRequestedEvent` from Epic 2 stubs)

**Key Methods:**

1. `dispatch(userId, category, variables, payload)` - Main entry point for sending notifications
   - Checks user preferences via `NotificationPreferenceService.isEnabled()`
   - Retrieves active device tokens from `device_tokens` table
   - Resolves template from `notification_templates` table
   - Substitutes variables (e.g., `{userName}` → "Alex")
   - Builds FCM message with Android/APNs config
   - Sends via `FirebaseMessaging.send()`
   - Updates token `last_used_at` timestamp
   - Logs `notification_sent` instrumentation event

2. `handleFCMError(token, exception)` - Error handling for FCM failures
   - Invalidates tokens on `NOT_FOUND` or `INVALID_ARGUMENT` errors
   - Logs delivery failures to instrumentation events
   - Retries transient failures via `@Retryable` (3 attempts, exponential backoff)

#### 2.2 NotificationPreferenceService (New)

**Methods:**

- `isEnabled(userId, category)` - Check if notification category enabled for user
- `updatePreference(userId, category, enabled)` - Toggle notification preference
- `getPreferences(userId)` - Retrieve all preferences as Map<String, Boolean>

#### 2.3 DeviceTokenService (New)

**Methods:**

- `registerToken(userId, platform, token)` - Register/update FCM device token
- `deactivateToken(userId, token)` - Mark token inactive (user logout)
- `getActiveTokens(userId)` - Retrieve active tokens for notification dispatch

#### 2.4 ETAUpdateService (New)

**Methods:**

- `updateETA(eventId, userId, request)` - Process ETA quick-reply, supersede previous ETA
- `getActiveETAs(eventId)` - Retrieve active ETA updates for event
- `getETASummary(eventId, totalRSVPs)` - Aggregate ETA data for host dashboard
  - Returns: `{ "arriving_soon": 3, "cant_make_it": 1, "no_response": 5 }`

### 3. API Endpoints

#### 3.1 Notification Preferences API

```
GET    /api/v1/notifications/preferences        - Get user preferences
PATCH  /api/v1/notifications/preferences        - Update preferences
```

#### 3.2 Device Token Registration API

```
POST   /api/v1/notifications/tokens             - Register FCM token
DELETE /api/v1/notifications/tokens             - Deactivate token (logout)
```

#### 3.3 ETA Update API

```
PATCH  /api/v1/events/{eventId}/eta             - Update user ETA (quick-reply)
GET    /api/v1/events/{eventId}/eta-summary     - Get ETA summary (host dashboard)
```

### 4. Event-Driven Workflows

#### 4.1 Notification Dispatch Flow

**Trigger:** Domain events (e.g., `StreakRiskDetectedEvent`, `QuestProgressUpdatedEvent`)

**Flow:**

1. Service publishes domain event → `ApplicationEventPublisher.publishEvent()`
2. `NotificationEventListener` (async, `@TransactionalEventListener`) receives event
3. Listener maps event to notification category (e.g., `streak_risk` → `NotificationCategory.STREAK_RISK`)
4. Listener calls `NotificationDispatchService.dispatch()` with template variables
5. Dispatcher checks preferences → retrieves tokens → sends FCM message → logs instrumentation event

**Example: Streak Risk Notification**

```java
// src/main/java/com/gss/gamification/service/StreakTrackingService.java (Epic 3)
public void evaluateStreakRisk(UUID userId) {
    UserStreak streak = streakRepository.findByUserId(userId);
    if (streak.isAtRisk()) {
        // Publish event
        eventPublisher.publishEvent(new StreakRiskDetectedEvent(userId, streak.getCurrentStreak()));
    }
}

// src/main/java/com/gss/notification/listener/NotificationEventListener.java (Epic 5)
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
@Async
public void onStreakRiskDetected(StreakRiskDetectedEvent event) {
    Map<String, String> variables = Map.of(
        "streakDays", String.valueOf(event.getCurrentStreak())
    );
    
    dispatchService.dispatch(event.getUserId(), NotificationCategory.STREAK_RISK, variables, Map.of());
}
```

#### 4.2 Check-In Reminder + ETA Quick-Reply Flow

**Trigger:** Scheduled job (every 5 minutes)

**Flow:**

1. `EventCheckInReminderScheduler.sendCheckInReminders()` runs via `@Scheduled` cron
2. Query events starting within next 15 minutes
3. For each event, fetch unchecked RSVPs
4. Dispatch check-in notification with `action_type: eta_quick_reply` payload
5. Mobile app shows quick-reply UI with 4 buttons (5/10/15 min, Can't Make It)
6. User taps button → app sends `PATCH /api/v1/events/{eventId}/eta`
7. `ETAUpdateService.updateETA()` saves update, supersedes previous ETA
8. Host dashboard polls `GET /api/v1/events/{eventId}/eta-summary` for real-time status

### 5. Mobile App Integration (React Native)

#### 5.1 FCM Token Registration

**File:** `mobile/src/services/notificationService.ts`

```typescript
import messaging from '@react-native-firebase/messaging';
import { api } from './api';

export const NotificationService = {
  async registerDeviceToken() {
    const authStatus = await messaging().requestPermission();
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();
      const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';

      await api.post('/api/v1/notifications/tokens', { platform, token });
      console.log('FCM token registered:', token);
    }
  },

  setupForegroundHandler() {
    messaging().onMessage(async remoteMessage => {
      // Show in-app notification banner
    });
  },

  setupBackgroundHandler() {
    messaging().onNotificationOpenedApp(remoteMessage => {
      const deepLink = remoteMessage.data?.deep_link;
      if (deepLink) {
        navigation.navigate(parseDeepLink(deepLink));
      }
    });
  }
};
```

#### 5.2 ETA Quick-Reply Handler

```typescript
// mobile/src/screens/CheckInScreen.tsx
const handleETAUpdate = async (etaMinutes: number | null, cantMakeIt: boolean) => {
  await api.patch(`/api/v1/events/${eventId}/eta`, { etaMinutes, cantMakeIt });
  Alert.alert('ETA Updated', 'Host has been notified.');
};

<Button title="Arriving in 5 min" onPress={() => handleETAUpdate(5, false)} />
<Button title="Arriving in 10 min" onPress={() => handleETAUpdate(10, false)} />
<Button title="Can't Make It" onPress={() => handleETAUpdate(null, true)} />
```

---

## Non-Functional Requirements

### Performance

- **Push Delivery Latency:** P95 < 30 seconds from trigger event to FCM delivery
- **Preference Toggle Response:** < 200ms for `PATCH /api/v1/notifications/preferences`
- **ETA Update Response:** < 300ms for `PATCH /api/v1/events/{eventId}/eta`

### Scalability

- **FCM Rate Limits:** 1M messages/day (free tier), 10M/day (Blaze plan) - sufficient for 5K MAU with 5 notifications/user/day
- **Database Indexes:** `idx_device_tokens_user_active`, `idx_eta_updates_event_active` for query performance

### Reliability

- **Retry Logic:** `@Retryable` with exponential backoff (1s, 2s, 4s) for FCM API failures
- **Token Invalidation:** Automatic deactivation on FCM error `NOT_FOUND`
- **Idempotency:** ETA updates supersede previous records (no duplicates)

### Security

- **Device Token Protection:** Tokens require authenticated user (JWT)
- **Deep Link Validation:** Mobile app validates format before navigation
- **Authorization:** ETA summary endpoint restricted to event hosts (future enhancement)

### Observability

- **Instrumentation Events:** `notification_sent`, `notification_opened`, `notification_clicked`, `eta_updated`
- **Error Logging:** FCM failures logged with error code, token ID, user ID
- **Metrics:** Micrometer counters for `notifications.sent`, `notifications.failed`

---

## Dependencies and Integrations

### 1. Firebase Cloud Messaging (FCM)

**Decision Status:** PENDING (Prep Sprint Task 1)

**Options:**

- **Option A: Firebase Cloud Messaging (FCM)** - Free tier: 1M messages/day, native Android support, iOS via APNs
  - Pros: Free tier sufficient, direct React Native integration
  - Cons: Vendor lock-in, APNs certificate configuration complexity

- **Option B: Managed Service (OneSignal, Pusher Beams)** - Unified multi-platform API
  - Pros: No certificate management, better analytics
  - Cons: Cost ($0.0005/notification after 10K/month)

**Recommendation:** Start with FCM for MVP, evaluate managed services if operational complexity becomes issue

**Prep Sprint Task:** Platform spike to validate FCM setup (Android + iOS Hello World)

### 2. React Native Firebase Library

**Dependency:** `@react-native-firebase/messaging` v18+  
**Integration:** Already included in mobile app dependencies (Epic 1)

### 3. Existing Services (Epic 1-4)

- **Event RSVP System:** `EventRSVPRepository.findUncheckedUserIdsByEvent()` - query unchecked users
- **Streak Risk Detection:** `StreakTrackingService` publishes `StreakRiskDetectedEvent`
- **Quest Progress:** `QuestProgressService` publishes `QuestProgressUpdatedEvent`
- **Instrumentation Events:** `InstrumentationEventService.logEvent()`

---

## Acceptance Criteria Traceability

| AC | PRD Requirement | Technical Implementation | Test Strategy |
|---|---|---|---|
| AC1 | FR023 - Notification preference center (6 categories) | `NotificationPreferenceController`, `notification_preferences` JSONB | Integration test: Toggle preferences, verify API + DB |
| AC2 | Journey 2 Step 5 - ETA quick-reply push | `NotificationDispatchService`, FCM action buttons | E2E test: Trigger reminder, verify FCM message |
| AC3 | Journey 2 Step 6 - Host dashboard ETA status | `ETAUpdateService.getETASummary()` | Integration test: Create ETAs, verify summary counts |
| AC4 | FR023 - Respect user preferences | `NotificationPreferenceService.isEnabled()` check | Unit test: Disable category, verify skipped |
| AC5 | FR032 - Instrumentation events | `InstrumentationEventService.logEvent("notification_sent")` | Integration test: Send notification, verify logged |
| AC6 | NFR002 - Push delivery < 30s | FCM API latency + async listener | Load test: 100 notifications/min, P95 < 30s |

---

## Risks and Assumptions

### Risks

1. **FCM Setup Complexity (MEDIUM):**
   - iOS APNs certificate configuration error-prone
   - Mitigation: Platform spike (Prep Sprint Task 1) to validate setup

2. **Push Delivery Reliability (MEDIUM):**
   - FCM best-effort service (no delivery guarantee)
   - Mitigation: Log all sent notifications to `instrumentation_events`, add retry logic for critical notifications

3. **Deep Link Navigation (LOW):**
   - Mobile app routing must handle all notification types
   - Mitigation: Define deep link schema upfront (Story 5.1), add validation

### Assumptions

1. **FCM Free Tier Sufficient:** 1M messages/day supports 5K MAU with 5 notifications/user/day (25K/day)
2. **Users Opt-In to Push Permissions:** Mobile app requests on first launch
3. **ETA Quick-Reply Sufficient:** 3 time options (5/10/15 min) + "Can't Make It" covers 90% of scenarios
4. **No Custom Notification Sounds:** Default system sound acceptable for MVP

---

## Test Strategy

### Unit Tests

- `NotificationPreferenceService.isEnabled()` - preference check logic
- `NotificationDispatchService.substituteVariables()` - template substitution
- `ETAUpdateService.getETASummary()` - ETA aggregation logic
- `DeviceTokenService.registerToken()` - token upsert logic

### Integration Tests

- **Preference Toggle:** `PATCH /api/v1/notifications/preferences` → verify DB update → verify next notification respects preference
- **Device Token Registration:** `POST /api/v1/notifications/tokens` → verify DB insert → verify token used
- **ETA Update Flow:** `PATCH /api/v1/events/{eventId}/eta` → verify DB insert + supersede → verify `GET /eta-summary`
- **Notification Dispatch:** Publish `StreakRiskDetectedEvent` → verify listener calls dispatch → verify FCM mock invoked

### E2E Tests (Mobile)

- **FCM Token Registration:** Launch app → login → verify token registered
- **ETA Quick-Reply:** Receive check-in notification → tap "Arriving in 10 min" → verify API call + toast
- **Deep Link Navigation:** Tap notification → verify correct screen (event detail, quest detail)

### Load Tests

- **Notification Burst:** 100 notifications in 1 minute → verify P95 latency < 30s
- **Preference Toggle Concurrency:** 50 concurrent `PATCH /preferences` → verify no race conditions

---

## Documentation Requirements

1. **API Documentation (OpenAPI):**
   - Add `/api/v1/notifications/preferences` endpoints to Swagger
   - Add `/api/v1/notifications/tokens` endpoints
   - Add `/api/v1/events/{eventId}/eta` endpoints

2. **Mobile App Deep Link Guide:**
   - Document schema (e.g., `gss://events/{eventId}/check-in`, `gss://quests/{questId}`)
   - Add React Navigation configuration

3. **Admin Runbook (docs/runbooks/notification-management.md):**
   - FCM project setup (Firebase Console configuration)
   - APNs certificate generation/upload (iOS push)
   - Troubleshooting: Invalid tokens, delivery failures, quota limits
   - How to query `device_tokens` table for user's active tokens

4. **User Guide (Help Center):**
   - How to enable/disable notification categories (Settings → Notifications)
   - How to use ETA quick-reply (tap notification → select ETA)
   - Troubleshooting: "Not receiving notifications" (check app permissions)

---

## Future Enhancements (Post-Epic 5)

1. **Custom Notification Sounds:** Per-category custom sounds (Epic 6+)
2. **Notification History:** UI to view past notifications (Settings)
3. **Rich Media Notifications:** Image attachments (event photos, badge graphics)
4. **Notification Scheduling:** Time-zone aware delivery (e.g., streak risk at 6 PM local time)
5. **A/B Testing:** Test different notification copy/CTAs to optimize open rates
6. **Analytics Dashboard:** Admin view of delivery rates, open rates, click-through rates per category

---

## Prep Sprint Tasks (3 Days, 18-22 Hours)

**Objective:** Validate FCM integration, finalize Epic 5 scope, prepare for story development

### Task List

1. **FCM Platform Spike (6 hours):**
   - Create Firebase project, enable FCM API
   - Configure APNs certificate for iOS push
   - Implement "Hello World" push notification (Android + iOS)
   - Validate deep link navigation from notification tap
   - **Deliverable:** Spike report with FCM setup steps, blockers identified

2. **Schema Design Review (3 hours):**
   - Review `device_tokens`, `notification_templates`, `event_eta_updates` table designs
   - Validate indexes for query patterns (10K MAU scale)
   - Confirm JSONB `notification_preferences` supports 6 categories
   - **Deliverable:** Updated migrations (V25-V29) ready for story implementation

3. **Template Specification (2 hours):**
   - Define all 7 notification templates (title, body, CTA, deep link)
   - Identify template variables (e.g., `{eventTitle}`, `{streakDays}`)
   - Create seed data SQL (Migration V28)
   - **Deliverable:** Template catalog document (markdown table)

4. **Testing Strategy (4 hours):**
   - Plan E2E test scenarios (FCM token registration, ETA quick-reply, deep linking)
   - Identify WireMock patterns for FCM API mocking
   - Define load test parameters (100 notifications/min, P95 target < 30s)
   - **Deliverable:** Testing checklist for Epic 5 stories

5. **UX Alignment (2 hours):**
   - Review mobile Settings screen design (notification preference toggles)
   - Validate ETA quick-reply button UX (bottom sheet vs notification actions)
   - Confirm host dashboard ETA summary placement
   - **Deliverable:** UX feedback incorporated into Story 5.2

6. **Scope Clarification (2 hours):**
   - Finalize 6 notification categories (confirm no additions)
   - Decide: FCM vs managed service (OneSignal, Pusher Beams)
   - Confirm email notifications out of scope (Epic 5 is push-only)
   - **Deliverable:** Updated epic scope, descoped features documented

7. **Story Breakdown (3 hours):**
   - Draft 10-14 stories for Epic 5 (preference center, dispatcher, templates, ETA, instrumentation)
   - Estimate each story (1-3 days)
   - Identify story dependencies (e.g., Story 5.1 FCM setup blocks Story 5.2 dispatcher)
   - **Deliverable:** Epic 5 story list (draft in `docs/stories/` folder)

---

## Appendix: Notification Category Definitions

| Category | Preference Key | Use Case | Example Notification |
|---|---|---|---|
| **Event Reminders** | `event_reminders` | RSVP'd event starting soon | "Pickleball starts in 15 minutes. Tap to check in." |
| **Streak Risk** | `streak_risk` | Streak expires tomorrow | "Your 7-day streak ends tomorrow. Attend an event!" |
| **Quest Progress** | `quest_progress` | Quest milestone reached | "You're 75% done with 'Social Butterfly'. 2 events to go!" |
| **Kudos** | `kudos` | Kudos received | "Alex sent you kudos: 'Great game today!'" |
| **Deposit Reminders** | `deposit_reminders` | Refund available | "Your $5 deposit for Pickleball is ready to refund." |
| **Competitive Unlock** | `competitive_unlock` | Leaderboard eligibility | "You've attended 5 events. Opt-in to leaderboards!" |
| **Check-In Prompt** | *(shares event_reminders)* | Event started, unchecked | "Pickleball is starting. Let the host know your ETA." |

---

**End of Epic 5 Technical Specification**

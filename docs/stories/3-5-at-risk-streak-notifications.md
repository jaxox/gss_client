# Story 3.5: At-Risk Streak Notifications

Status: drafted

## Story

As a **GSS platform user with an active streak**,
I want **to receive a notification when my streak is about to expire**,
so that **I can attend an event and preserve my progress**.

## Acceptance Criteria

### AC1: Daily Streak Evaluation

1. Daily background job evaluates all active user streaks
2. At-risk criteria: 7+ days since last event AND currentStreak > 0
3. Calculate days remaining until streak expiration (10-day window)
4. Identify users with 48h or less remaining
5. Generate notification payload for at-risk users
6. Job runs at 9 AM local time (timezone-aware)
7. Job execution logged for monitoring

### AC2: Push Notification Content

1. Notification title: "Your X-day streak expires in 2 days! 🔥"
2. Notification body: "Keep your streak alive! We found 3 nearby events."
3. Notification includes streak count and days remaining
4. Notification icon shows flame emoji 🔥
5. Notification sound (default system sound)
6. Notification priority: HIGH (Android), time-sensitive (iOS)

### AC3: Event Suggestions in Notification

1. Backend returns 3 suggested events (nearest by location)
2. Events filtered by: upcoming (next 3 days), user's preferred sports
3. Event suggestions embedded in notification payload
4. Fallback: if < 3 events found, show "Browse all events"
5. Events displayed in notification expanded view (Android rich notification)

### AC4: Deep-Link to Event Browse

1. Notification tap opens event browse screen
2. Deep-link URL: \`gss://events/browse?filter=streak-save\`
3. Event browse pre-filtered: upcoming events, user's location radius
4. Event browse shows banner: "Save your X-day streak!"
5. Deep-link works from killed app state (cold start)
6. Deep-link works on both iOS and Android

### AC5: In-App Streak At-Risk Banner

1. Banner displayed in profile screen when streak at risk
2. Banner message: "⚠️ Your X-day streak expires in Y days"
3. Banner color: orange (warning, not error red)
4. Banner tap opens event browse with streak-save filter
5. Banner dismissible (snooze for 24h)
6. Banner reappears on next app open if still at risk

### AC6: Notification Preference Center Integration

1. Preference toggle: "Streak reminder notifications" (default: ON)
2. Toggle accessible in app settings under "Notifications"
3. Backend respects user preference (no notification if opted out)
4. Preference synced across devices via backend
5. Opt-out tracked for analytics (% of users who disable)

### AC7: Notification Effectiveness Tracking

1. Track notification delivery: sent, delivered, failed
2. Track notification engagement: tapped, dismissed, ignored
3. Track streak preservation rate after notification
4. Track event attendance within 48h of notification
5. Analytics dashboard shows notification effectiveness metrics
6. A/B test different notification copy (future optimization)

## Tasks / Subtasks

### Task 1: At-Risk Detection Logic (AC: 1)

- [ ] Create \`shared/utils/streakRiskDetector.ts\` utility
- [ ] Implement \`isStreakAtRisk(lastEventDate, currentStreak): boolean\`
- [ ] Implement \`getDaysUntilExpiration(lastEventDate): number\`
- [ ] Handle edge cases (timezone boundaries, leap days)
- [ ] Write unit tests for risk detection (15+ test cases)

### Task 2: Background Job Setup (AC: 1)

- [ ] Research React Native background job libraries (react-native-background-fetch)
- [ ] Configure daily background job (9 AM local time)
- [ ] Implement job execution logic
- [ ] Call streak risk detector for current user
- [ ] Trigger notification if at risk
- [ ] Add job execution logging
- [ ] Test background job on iOS and Android

### Task 3: Push Notification Service Integration (AC: 2, 3)

- [ ] Update \`mobile/src/services/notifications/pushNotification.service.ts\`
- [ ] Create \`sendStreakRiskNotification(userData, eventSuggestions)\`
- [ ] Format notification title and body
- [ ] Include event suggestions in payload
- [ ] Set notification priority (HIGH/time-sensitive)
- [ ] Handle FCM (Android) and APNS (iOS) differences
- [ ] Write unit tests for notification service

### Task 4: Event Suggestions API (AC: 3)

- [ ] Update gamification service to return event suggestions
- [ ] API: \`GET /api/gamification/streak-risk?userId=X\`
- [ ] Backend returns 3 nearest upcoming events
- [ ] Filter by: user location radius, preferred sports, next 3 days
- [ ] Fallback: return empty array if < 3 events found
- [ ] Mock service implementation for frontend development
- [ ] Write integration tests for API

### Task 5: Deep-Link Configuration (AC: 4)

- [ ] Configure deep-link URL scheme: \`gss://events/browse\`
- [ ] Register deep-link handler in app navigation
- [ ] Implement \`gss://events/browse?filter=streak-save\`
- [ ] Navigate to event browse screen with filter applied
- [ ] Test deep-link from notification tap
- [ ] Test deep-link from killed app state (cold start)
- [ ] Write E2E test for deep-link navigation

### Task 6: Event Browse Streak-Save Filter (AC: 4)

- [ ] Update event browse screen to handle \`filter=streak-save\`
- [ ] Apply filters: upcoming (next 3 days), user location radius
- [ ] Display banner: "Save your X-day streak!"
- [ ] Banner shows days remaining and streak count
- [ ] Banner dismissible
- [ ] Write component tests for filtered browse

### Task 7: In-App Streak At-Risk Banner Component (AC: 5)

- [ ] Create \`mobile/src/components/gamification/StreakAtRiskBanner.tsx\`
- [ ] Create \`web/src/components/gamification/StreakAtRiskBanner.tsx\`
- [ ] Display banner in profile screen when streak at risk
- [ ] Banner message: "⚠️ Your X-day streak expires in Y days"
- [ ] Banner color: orange (warning)
- [ ] Banner tap opens event browse with streak-save filter
- [ ] Banner dismissible (snooze for 24h)
- [ ] Store snooze state in AsyncStorage
- [ ] Write component tests for banner

### Task 8: Profile Screen Banner Integration (AC: 5)

- [ ] Update \`mobile/src/screens/profile/ProfileScreen.tsx\`
- [ ] Update \`web/src/pages/profile/ProfilePage.tsx\`
- [ ] Check if streak at risk on profile load
- [ ] Display StreakAtRiskBanner if applicable
- [ ] Handle banner tap (navigate to event browse)
- [ ] Handle banner dismiss (snooze for 24h)
- [ ] Test profile screen with at-risk streak

### Task 9: Notification Preference Center (AC: 6)

- [ ] Update \`mobile/src/screens/settings/NotificationPreferencesScreen.tsx\`
- [ ] Add toggle: "Streak reminder notifications"
- [ ] Default state: ON
- [ ] Sync preference with backend via API
- [ ] Store preference locally (AsyncStorage fallback)
- [ ] Update notification service to check preference before sending
- [ ] Write component tests for preference screen

### Task 10: Backend Preference API (AC: 6)

- [ ] API: \`PATCH /api/users/preferences\` with \`streakNotificationsEnabled\`
- [ ] Backend stores preference in user profile
- [ ] Backend respects preference in daily streak evaluation job
- [ ] Mock service implementation for frontend development
- [ ] Write integration tests for preference API

### Task 11: Analytics Event Tracking (AC: 7)

- [ ] Track notification sent: \`streak_risk_notification_sent\`
- [ ] Track notification delivered: \`streak_risk_notification_delivered\`
- [ ] Track notification tapped: \`streak_risk_notification_tapped\`
- [ ] Track notification dismissed: \`streak_risk_notification_dismissed\`
- [ ] Track streak preserved after notification
- [ ] Track event attendance within 48h of notification
- [ ] Track notification opt-out rate
- [ ] Write tests for analytics events

### Task 12: Testing and Validation (AC: All)

- [ ] Write unit tests for streak risk detection
- [ ] Write unit tests for notification service
- [ ] Write component tests for banner
- [ ] Write integration tests: Risk detection → Notification → Deep-link
- [ ] Write E2E test: Streak at risk → Notification → Event browse → Attend
- [ ] Test background job execution on iOS and Android
- [ ] Test deep-link from killed app state
- [ ] Test notification preference toggle
- [ ] Validate timezone handling (9 AM local time)

## Dev Notes

**Frontend Implementation Focus:** This story implements at-risk streak notifications on the frontend, building on Story 3.4 (Streak Tracking). Requires background job setup and push notification integration.

**Story Points:** 5 (2-3 dev sessions)

**Prerequisites:** Story 3.4 (Streak Tracking Logic)

**Blocks:** None

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

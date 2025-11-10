# Frontend Technical Specification: Observability & Admin Moderation

**Epic 8: Observability & Admin Moderation**

_Generated: November 9, 2025_  
_Project: gss_client (Frontend Implementation)_  
_Version: 1.0_

---

## Overview

This technical specification defines the **frontend implementation** for Epic 8 (Observability & Admin Moderation), covering operational readiness through content moderation, abuse prevention, structured analytics instrumentation, and system health monitoring. This epic enables platform-wide observability with comprehensive logging/metrics, user-facing flag/report flows, and admin moderation tools for maintaining community safety.

**Context:** This is a **frontend-only specification**. Backend APIs (moderation queue, analytics aggregation, alert management, instrumentation storage) are assumed complete and documented in backend reference docs. This document focuses exclusively on mobile and web client implementations for flagging content, reviewing moderation queues, configuring alerts, and emitting analytics events.

**Key Functional Requirements:** FR027 (Admin moderation tools), FR028 (Photo moderation), FR032 (Instrumentation events), NFR006 (Observability), NFR009 (Abuse prevention)

**Problem Statement:** Without observability and moderation infrastructure, the platform cannot detect abuse, respond to safety concerns, or measure operational health. Users need mechanisms to report inappropriate content, admins need tools to review flagged items efficiently, and the development team needs structured analytics to monitor conversion funnels, reliability trends, and system performance. Lack of these capabilities risks community trust erosion, undetected abuse, and blind spots in product optimization.

**Goals:**

- Implement user-facing flag/report flows for photos and user profiles
- Build admin moderation review queue with auto-concealment threshold logic
- Emit comprehensive instrumentation events for all critical user actions
- Create admin dashboards for system health metrics (conversion %, churn proxies, streak retention)
- Configure alert rules for operational thresholds (reliability dips, refund latency, error spikes)
- Provide abuse prevention mechanisms (rate limiting flags, audit logging)

**User-Facing Features:**

1. **Flag/Report Flow (Mobile):** Long-press photo in recap or profile to flag with reason ("Inappropriate content", "Spam", "Harassment", "Other")
2. **Report User Profile (Mobile):** Report button on user profile with reason selection
3. **Auto-Concealment (Mobile):** Flagged content hidden after ≥2 distinct user flags (threshold configurable)
4. **Admin Moderation Queue (Web):** Paginated queue of flagged content with review actions (approve, remove, ban user)
5. **System Health Dashboard (Web):** Key metrics (RSVP conversion %, check-in rate, streak retention, refund latency p95)
6. **Alert Configuration (Web):** Define alert rules for metric thresholds (reliability <0.80, refund latency >60s, error rate >5%)

**Out of Scope (Deferred to Future Epics):**

- Automated ML-based content moderation (rule-based + manual review only for MVP)
- User appeal process for moderation actions (admin decision final for MVP)
- Real-time alert delivery via PagerDuty/Slack (email alerts only for MVP)
- Advanced analytics (cohort analysis, A/B test results, funnel attribution) deferred to Phase 2
- GDPR compliance tooling (data export, right to erasure) handled by backend, not in scope

---

## Objectives and Scope

### In Scope

**Mobile (React Native):**

1. **Flag/Report Photo Flow:**
   - Long-press photo in event recap or user profile → "Report Photo" option appears
   - Report modal with reason selection: "Inappropriate content", "Spam", "Harassment", "Offensive", "Other"
   - Optional text field for additional context (200 char max)
   - Submit report → API call → success toast: "Report submitted. Thank you."
   - Flagged photo appears with semi-transparent overlay + "Flagged by X users" badge (only visible to flaggers and admins)

2. **Report User Profile:**
   - User profile screen has "⋮" menu with "Report User" option
   - Report modal with reason selection: "Fake profile", "Harassment", "Spam", "Inappropriate behavior", "Other"
   - Optional text field (200 char max)
   - Submit report → API call → success confirmation
   - No visual indication to reported user (privacy protection)

3. **Auto-Concealment Logic:**
   - When photo reaches flag threshold (≥2 distinct users), photo automatically hidden from public view
   - Photo appears as placeholder: "Content under review" (visible to non-flaggers)
   - Original poster sees "Your photo has been flagged for review" message
   - Admin moderation decision overrides auto-concealment (approve → restore, remove → permanent deletion)

4. **Analytics Event Emission:**
   - Emit instrumentation events for all critical actions:
     - User events: registration, login, profile_update, logout
     - Event lifecycle: event_created, rsvp_submitted, check_in_completed, event_cancelled
     - Gamification: xp_awarded, badge_unlocked, quest_completed, streak_preserved, streak_broken
     - Social: kudos_given, recap_created, partner_history_viewed, suggestion_accepted
     - Moderation: photo_flagged, user_reported, content_concealed
   - Events include: userId, timestamp, eventType, metadata (specific to event type)
   - Use existing analytics service (e.g., Firebase Analytics, Mixpanel) with structured schema

**Web (React + Vite):**

1. **Admin Moderation Queue:**
   - Paginated table of flagged content (photos and users)
   - Columns: thumbnail/avatar, reporter count, flag reasons, reported date, status (pending, reviewed, resolved)
   - Filter by content type (photos, users), status, date range
   - Sort by reporter count (descending), date (newest first)
   - Row actions: "Review" button → opens detail modal

2. **Moderation Review Modal:**
   - Full-size photo or user profile preview
   - Reporter details: count, top 3 reasons, sample text feedback
   - Reported user info: profile, reliability score, past moderation history
   - Admin actions: "Approve" (restore content), "Remove" (delete photo or soft-ban user), "Escalate" (mark for senior review)
   - Action confirmation prompt with audit log entry: "Are you sure? This action will be logged."

3. **System Health Dashboard:**
   - Key metrics cards:
     - RSVP Conversion Rate: % of event views → RSVP (target >25%)
     - Check-In Rate: % of RSVPs → checked in (target >85%)
     - Streak Retention: % of active users maintaining 7-day streak (target >40%)
     - Refund Latency p95: 95th percentile refund processing time (target <60s)
     - Error Rate: API error rate per endpoint (target <1%)
   - Trend sparklines for each metric (7d, 30d views)
   - Alert status indicators: green (healthy), yellow (warning), red (critical)

4. **Alert Configuration UI:**
   - Alert rules table: rule name, metric, threshold, status (active, paused)
   - "Create Alert Rule" button → modal with fields:
     - Rule name (e.g., "Low Reliability Alert")
     - Metric selection dropdown (reliability avg, refund latency p95, error rate, etc.)
     - Threshold value and comparison operator (>, <, ≥, ≤)
     - Alert channels: Email (MVP), Slack (future), PagerDuty (future)
   - Test alert button: "Send Test Alert" to verify configuration
   - Alert history log: timestamp, rule triggered, metric value, recipients

### Out of Scope

- Automated ML-based moderation (image recognition, text toxicity detection) deferred to post-MVP
- User appeal flow for moderation actions (admin decisions final for MVP)
- Real-time dashboard auto-refresh (manual refresh for MVP, auto-refresh future)
- Advanced analytics: cohort analysis, retention curves, A/B test frameworks (Phase 2)
- Custom metric definitions (predefined metrics only for MVP)
- Alert escalation policies (on-call rotations, escalation chains deferred)

---

## System Architecture Alignment

### Mobile Architecture

**Screens:**

- `ReportPhotoModal` (flag photo with reason selection)
- `ReportUserModal` (report user profile with reason selection)
- `FlaggedContentNotice` (user notification when their content is flagged)

**Services:**

- `ModerationService` (submit reports, check flag status)
- `AnalyticsService` (emit instrumentation events, track user actions)

**Redux Slices:**

- `moderation.slice.ts` (flagged content state, report history)
- `analytics.slice.ts` (queued events, emission status)

**Components:**

- `FlagButton` (long-press handler for photos)
- `ReportMenu` (user profile menu with report option)
- `FlaggedPhotoOverlay` (semi-transparent "Flagged" badge on photos)

### Web Architecture

**Pages:**

- `AdminModerationQueuePage` (flagged content table + filters)
- `SystemHealthDashboardPage` (metrics cards + sparklines)
- `AlertConfigurationPage` (alert rules + history)

**Services:**

- `AdminModerationService` (fetch queue, review actions, audit logs)
- `MetricsService` (fetch system health metrics, trend data)
- `AlertService` (CRUD alert rules, send test alerts)

**Components:**

- `ModerationQueueTable` (paginated, filterable, sortable table)
- `ReviewModal` (moderation detail view with actions)
- `MetricsCard` (metric display with trend sparkline)
- `AlertRuleForm` (create/edit alert rules)
- `AlertHistoryLog` (triggered alerts log)

---

## Detailed Design

### Services and Modules

| Service/Module             | Responsibility                                 | Key Methods                                                                                                   | Platform    |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------- |
| **ModerationService**      | Submit flag/report, check flag status          | `flagPhoto(photoId, reason, context)`, `reportUser(userId, reason, context)`, `getFlagStatus(contentId)`      | Mobile      |
| **AdminModerationService** | Fetch moderation queue, perform review actions | `getQueue(filters, pagination)`, `approveContent(contentId)`, `removeContent(contentId)`, `banUser(userId)`   | Web         |
| **AnalyticsService**       | Emit instrumentation events, batch queue       | `trackEvent(eventType, metadata)`, `flushQueue()`, `getQueueStatus()`                                         | Mobile, Web |
| **MetricsService**         | Fetch system health metrics, trend data        | `getHealthMetrics()`, `getTrendData(metric, days)`, `getErrorRates()`                                         | Web         |
| **AlertService**           | CRUD alert rules, trigger test alerts          | `createRule(rule)`, `updateRule(ruleId, rule)`, `deleteRule(ruleId)`, `sendTestAlert(ruleId)`, `getHistory()` | Web         |
| **AuditService**           | Log admin actions for compliance               | `logAction(adminId, action, targetId, metadata)`, `getAuditLog(filters)`                                      | Web         |

### Data Models and Contracts

```typescript
// Moderation Models
interface FlagReport {
  id: string;
  contentType: 'photo' | 'user';
  contentId: string;
  reporterId: string;
  reason: FlagReason;
  contextText?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

type FlagReason =
  | 'inappropriate_content'
  | 'spam'
  | 'harassment'
  | 'offensive'
  | 'fake_profile'
  | 'inappropriate_behavior'
  | 'other';

interface FlaggedContent {
  id: string;
  contentType: 'photo' | 'user';
  contentId: string;
  content: FlaggedPhoto | FlaggedUser;
  reportCount: number;
  reports: FlagReport[];
  topReasons: { reason: FlagReason; count: number }[];
  status: 'pending' | 'auto_concealed' | 'approved' | 'removed';
  concealedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
}

interface FlaggedPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  uploaderId: string;
  uploaderName: string;
  eventId: string;
  eventTitle: string;
}

interface FlaggedUser {
  userId: string;
  displayName: string;
  avatar?: string;
  reliabilityScore: number;
  accountCreatedAt: string;
  pastModerationCount: number;
}

interface ModerationAction {
  contentId: string;
  action: 'approve' | 'remove' | 'ban_user' | 'escalate';
  adminId: string;
  adminName: string;
  reason?: string;
  timestamp: string;
}

// Analytics Models
interface InstrumentationEvent {
  eventId: string;
  eventType: InstrumentationEventType;
  userId: string;
  timestamp: string;
  metadata: Record<string, any>;
}

type InstrumentationEventType =
  // User lifecycle
  | 'user_registered'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'profile_updated'
  // Event lifecycle
  | 'event_created'
  | 'event_published'
  | 'event_viewed'
  | 'rsvp_submitted'
  | 'rsvp_cancelled'
  | 'check_in_completed'
  | 'check_in_failed'
  | 'event_cancelled'
  | 'recap_published'
  // Gamification
  | 'xp_awarded'
  | 'level_up'
  | 'badge_unlocked'
  | 'quest_started'
  | 'quest_progress_updated'
  | 'quest_completed'
  | 'streak_preserved'
  | 'streak_broken'
  | 'streak_risk_notification_sent'
  // Social
  | 'kudos_given'
  | 'kudos_received'
  | 'recap_created'
  | 'recap_viewed'
  | 'partner_history_viewed'
  | 'suggestion_served'
  | 'suggestion_accepted'
  | 'suggestion_dismissed'
  // Moderation
  | 'photo_flagged'
  | 'user_reported'
  | 'content_concealed'
  | 'content_approved'
  | 'content_removed'
  // Payments
  | 'deposit_authorized'
  | 'deposit_refunded'
  | 'deposit_voided'
  | 'refund_failed'
  // Notifications
  | 'notification_sent'
  | 'notification_delivered'
  | 'notification_opened'
  | 'notification_action_taken'
  // Growth
  | 'waitlist_joined'
  | 'invite_generated'
  | 'invite_redeemed'
  | 'wave_promoted';

// Metrics Models
interface SystemHealthMetrics {
  rsvpConversionRate: number; // % of event views → RSVP
  checkInRate: number; // % of RSVPs → check-in
  streakRetentionRate: number; // % of active users with 7+ day streak
  refundLatencyP95: number; // 95th percentile refund time (ms)
  errorRate: number; // API error rate (%)
  lastUpdated: string;
}

interface MetricTrend {
  date: string;
  value: number;
}

interface ErrorRateByEndpoint {
  endpoint: string;
  method: string;
  errorRate: number;
  totalRequests: number;
  errorCount: number;
}

// Alert Models
interface AlertRule {
  id: string;
  name: string;
  metricType: MetricType;
  threshold: number;
  comparisonOperator: '>' | '<' | '>=' | '<=';
  channels: AlertChannel[];
  status: 'active' | 'paused';
  createdBy: string;
  createdAt: string;
}

type MetricType =
  | 'reliability_avg'
  | 'refund_latency_p95'
  | 'error_rate'
  | 'rsvp_conversion_rate'
  | 'check_in_rate'
  | 'streak_retention_rate';

type AlertChannel = 'email' | 'slack' | 'pagerduty';

interface AlertHistory {
  id: string;
  ruleId: string;
  ruleName: string;
  metricType: MetricType;
  metricValue: number;
  threshold: number;
  triggeredAt: string;
  recipients: string[];
  acknowledged: boolean;
}

// Audit Log Models
interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'photo' | 'user' | 'event' | 'alert_rule';
  targetId: string;
  metadata: Record<string, any>;
  timestamp: string;
}
```

### APIs and Interfaces

**Backend API Endpoints (Assumed Complete):**

```typescript
// Moderation APIs
POST   /api/v1/moderation/flag-photo
  Body: { photoId: string, reason: FlagReason, contextText?: string }
  Response: { success: boolean, reportId: string }

POST   /api/v1/moderation/report-user
  Body: { userId: string, reason: FlagReason, contextText?: string }
  Response: { success: boolean, reportId: string }

GET    /api/v1/moderation/flag-status/:contentId
  Response: { status: string, reportCount: number, concealed: boolean }

// Admin Moderation APIs
GET    /api/v1/admin/moderation/queue?type={photo|user}&status={pending|auto_concealed}&page={n}&limit={n}
  Response: { items: FlaggedContent[], total: number, page: number }

POST   /api/v1/admin/moderation/approve/:contentId
  Response: { success: boolean, action: ModerationAction }

POST   /api/v1/admin/moderation/remove/:contentId
  Body: { reason?: string }
  Response: { success: boolean, action: ModerationAction }

POST   /api/v1/admin/moderation/ban-user/:userId
  Body: { reason: string, duration?: string }
  Response: { success: boolean, action: ModerationAction }

// Analytics APIs
POST   /api/v1/analytics/events/batch
  Body: { events: InstrumentationEvent[] }
  Response: { success: boolean, processed: number }

GET    /api/v1/analytics/events/:eventType/count?startDate={date}&endDate={date}
  Response: { count: number, breakdown: { date: string, count: number }[] }

// Metrics APIs
GET    /api/v1/metrics/health
  Response: SystemHealthMetrics

GET    /api/v1/metrics/trend/:metricType?days={n}
  Response: { trends: MetricTrend[] }

GET    /api/v1/metrics/error-rates?startDate={date}&endDate={date}
  Response: { byEndpoint: ErrorRateByEndpoint[] }

// Alert APIs
GET    /api/v1/admin/alerts/rules
  Response: { rules: AlertRule[] }

POST   /api/v1/admin/alerts/rules
  Body: AlertRule
  Response: { success: boolean, rule: AlertRule }

PUT    /api/v1/admin/alerts/rules/:id
  Body: Partial<AlertRule>
  Response: { success: boolean, rule: AlertRule }

DELETE /api/v1/admin/alerts/rules/:id
  Response: { success: boolean }

POST   /api/v1/admin/alerts/test/:ruleId
  Response: { success: boolean, message: string }

GET    /api/v1/admin/alerts/history?ruleId={id}&limit={n}
  Response: { history: AlertHistory[] }

// Audit Log APIs
GET    /api/v1/admin/audit-log?adminId={id}&action={action}&startDate={date}&endDate={date}&page={n}
  Response: { entries: AuditLogEntry[], total: number }
```

**Frontend Service Interfaces:**

```typescript
// ModerationService
interface IModerationService {
  flagPhoto(
    photoId: string,
    reason: FlagReason,
    contextText?: string
  ): Promise<{ success: boolean; reportId: string }>;
  reportUser(
    userId: string,
    reason: FlagReason,
    contextText?: string
  ): Promise<{ success: boolean; reportId: string }>;
  getFlagStatus(
    contentId: string
  ): Promise<{ status: string; reportCount: number; concealed: boolean }>;
}

// AdminModerationService
interface IAdminModerationService {
  getQueue(
    filters: { type?: 'photo' | 'user'; status?: string },
    pagination: { page: number; limit: number }
  ): Promise<{ items: FlaggedContent[]; total: number }>;
  approveContent(contentId: string): Promise<{ success: boolean; action: ModerationAction }>;
  removeContent(
    contentId: string,
    reason?: string
  ): Promise<{ success: boolean; action: ModerationAction }>;
  banUser(
    userId: string,
    reason: string,
    duration?: string
  ): Promise<{ success: boolean; action: ModerationAction }>;
}

// AnalyticsService
interface IAnalyticsService {
  trackEvent(eventType: InstrumentationEventType, metadata: Record<string, any>): Promise<void>;
  flushQueue(): Promise<{ success: boolean; processed: number }>;
  getQueueStatus(): { queuedEvents: number; lastFlush: string };
}

// MetricsService
interface IMetricsService {
  getHealthMetrics(): Promise<SystemHealthMetrics>;
  getTrendData(metricType: MetricType, days: number): Promise<{ trends: MetricTrend[] }>;
  getErrorRates(startDate: string, endDate: string): Promise<{ byEndpoint: ErrorRateByEndpoint[] }>;
}

// AlertService
interface IAlertService {
  getRules(): Promise<{ rules: AlertRule[] }>;
  createRule(
    rule: Omit<AlertRule, 'id' | 'createdAt'>
  ): Promise<{ success: boolean; rule: AlertRule }>;
  updateRule(
    ruleId: string,
    updates: Partial<AlertRule>
  ): Promise<{ success: boolean; rule: AlertRule }>;
  deleteRule(ruleId: string): Promise<{ success: boolean }>;
  sendTestAlert(ruleId: string): Promise<{ success: boolean; message: string }>;
  getHistory(ruleId?: string, limit?: number): Promise<{ history: AlertHistory[] }>;
}

// AuditService
interface IAuditService {
  logAction(
    action: string,
    targetType: string,
    targetId: string,
    metadata: Record<string, any>
  ): Promise<void>;
  getAuditLog(
    filters: { adminId?: string; action?: string; startDate?: string; endDate?: string },
    pagination: { page: number; limit: number }
  ): Promise<{ entries: AuditLogEntry[]; total: number }>;
}
```

### Workflows and Sequencing

**Workflow 1: Flag Photo (Mobile)**

1. User viewing event recap with 5 photos
2. User long-presses photo #3 → context menu appears: "Report Photo"
3. User taps "Report Photo" → ReportPhotoModal opens
4. Modal displays reason selection (6 radio buttons): "Inappropriate content", "Spam", "Harassment", "Offensive", "Other", "Cancel"
5. User selects "Inappropriate content", taps "Submit Report"
6. ModerationService.flagPhoto(photoId, 'inappropriate_content') API call
7. Success response: Toast message "Report submitted. Thank you for keeping our community safe."
8. Backend increments photo flag count (now 1)
9. User's local state updates: photo marked as "flagged by me" (UI shows small flag icon on photo)
10. If photo reaches threshold (≥2 flags from distinct users): Backend auto-conceals photo
11. All non-flagger users see placeholder: "Content under review"
12. Photo owner receives notification: "Your photo has been flagged for review"
13. Admin receives notification: "Photo flagged ≥2 times, auto-concealed for review"

**Workflow 2: Admin Moderation Review (Web)**

1. Admin navigates to Moderation Queue page
2. AdminModerationService.getQueue({ status: 'auto_concealed' }, { page: 1, limit: 20 }) API call
3. Table displays 15 flagged items: 12 photos, 3 users
4. Admin sorts by reporter count (descending) → photo with 5 flags appears at top
5. Admin clicks "Review" button on photo row
6. ReviewModal opens with:
   - Full-size photo preview
   - Reporter details: 5 reports, top reasons: "Inappropriate content" (3), "Offensive" (2)
   - Uploader info: "John Doe, reliability 0.85, 0 past violations"
   - Sample reporter feedback: "This photo is not related to the event", "Contains inappropriate gesture"
7. Admin assesses photo: Determines photo is inappropriate
8. Admin clicks "Remove" button → Confirmation prompt: "Are you sure? This action will be logged."
9. Admin confirms → AdminModerationService.removeContent(photoId, "Inappropriate content per community guidelines")
10. API response success: photo permanently deleted, audit log entry created
11. Success toast: "Photo removed successfully"
12. Photo owner receives notification: "Your photo was removed due to community guidelines violation"
13. Reporters receive notification: "Thank you for reporting. The photo has been removed."
14. Modal closes, table refreshes, reviewed item removed from queue

**Workflow 3: Alert Configuration (Web)**

1. Admin navigates to Alert Configuration page
2. AlertService.getRules() fetches 3 existing alert rules:
   - "Low Reliability Alert" (reliability_avg < 0.80)
   - "High Refund Latency" (refund_latency_p95 > 60000ms)
   - "API Error Spike" (error_rate > 5%)
3. Admin clicks "Create Alert Rule" button
4. Alert Rule Form modal opens with fields:
   - Rule Name: [input]
   - Metric Type: [dropdown]
   - Threshold: [number input]
   - Comparison: [dropdown: >, <, >=, <=]
   - Channels: [checkboxes: Email, Slack (disabled), PagerDuty (disabled)]
5. Admin fills form:
   - Name: "Low Check-In Rate Alert"
   - Metric: check_in_rate
   - Threshold: 0.75 (75%)
   - Comparison: <
   - Channels: Email (checked)
6. Admin clicks "Save" → AlertService.createRule(rule) API call
7. Success response: rule created with ID, status 'active'
8. Success toast: "Alert rule created successfully"
9. Table refreshes, new rule appears in list
10. Admin clicks "Send Test Alert" on new rule
11. AlertService.sendTestAlert(ruleId) API call
12. Test email sent to admin email address
13. Success toast: "Test alert sent. Check your email."
14. Admin checks email: receives test alert with formatted message: "Alert: Check-In Rate is 72% (threshold: 75%)"

**Workflow 4: Analytics Event Emission (Mobile)**

1. User completes check-in flow at event
2. Check-in success → XP awarded (50 XP)
3. AnalyticsService.trackEvent('check_in_completed', { userId, eventId, xpAwarded: 50, checkInMethod: 'qr_scan', timestamp })
4. Event added to client-side queue (IndexedDB/AsyncStorage)
5. Queue now has 3 events: [check_in_completed, xp_awarded, streak_preserved]
6. 30 seconds later: AnalyticsService.flushQueue() auto-triggered (background task)
7. API call: POST /api/v1/analytics/events/batch with 3 events
8. Backend processes events, stores in instrumentation_events table
9. Success response: { processed: 3 }
10. Client clears queue
11. Admin later views System Health Dashboard → "Check-In Rate" metric shows updated 87% (includes this check-in)

**Workflow 5: System Health Monitoring (Web)**

1. Admin opens System Health Dashboard page
2. MetricsService.getHealthMetrics() API call
3. Response: { rsvpConversionRate: 0.28, checkInRate: 0.87, streakRetentionRate: 0.42, refundLatencyP95: 45000, errorRate: 0.008 }
4. Dashboard renders 5 metrics cards:
   - RSVP Conversion: 28% (target >25%) → Green status ✅
   - Check-In Rate: 87% (target >85%) → Green status ✅
   - Streak Retention: 42% (target >40%) → Green status ✅
   - Refund Latency p95: 45s (target <60s) → Green status ✅
   - Error Rate: 0.8% (target <1%) → Green status ✅
5. Admin clicks "View Trend" on "Check-In Rate" card
6. MetricsService.getTrendData('check_in_rate', 30) API call
7. Response: 30 days of daily check-in rate data
8. Sparkline chart renders showing 7-day moving average: steady at ~85-88%
9. Admin notices all metrics healthy, no action needed
10. If "Refund Latency p95" had been 65s (red, exceeds threshold):
    - Alert rule "High Refund Latency" would trigger
    - Email sent to admin: "ALERT: Refund Latency p95 is 65s (threshold: 60s)"
    - Admin investigates payment service logs, identifies bottleneck
    - Admin escalates to backend team for resolution

---

## Non-Functional Requirements

### Performance

- **Flag/Report Submission:** <1s to submit flag/report, immediate optimistic UI update
- **Moderation Queue Load:** <2s to load 20 flagged items (paginated)
- **Review Modal Open:** <500ms to load full moderation detail (photo, reports, user info)
- **System Health Dashboard Load:** <3s to fetch and render 5 key metrics with sparklines
- **Alert Rule Creation:** <1s to create/update alert rule
- **Analytics Event Queue Flush:** Batch flush every 30s or when queue reaches 50 events (whichever first)
- **Audit Log Query:** <2s to load 50 audit log entries with filters

### Security

- **Admin Authentication:** All admin endpoints require JWT with 'admin' role claim
- **Flag Rate Limiting:** Users can submit max 20 flags/reports per day (prevent abuse)
- **Audit Logging:** All admin moderation actions logged with adminId, action, timestamp, target
- **Privacy Protection:** Reported users never see reporter identities
- **API Authorization:** Moderation APIs check user permissions before processing actions
- **Alert Channel Validation:** Email addresses validated before sending test alerts

### Reliability/Availability

- **Analytics Event Queueing:** Events queued locally if API fails, retry on next flush (max 500 events in queue)
- **Graceful Degradation:** If metrics API fails, dashboard shows "Unable to load metrics. Retry?" message
- **Offline Flag Submission:** Flags queued locally when offline, submitted when connectivity restored
- **Alert Delivery Retries:** Failed alert emails retried 3 times with exponential backoff
- **Moderation Queue Fallback:** If queue API fails, show cached last-loaded data with "Stale data" warning

### Observability

- **Instrumentation Events (FR032):**
  - User lifecycle: user_registered, user_logged_in, profile_updated
  - Event lifecycle: event_created, rsvp_submitted, check_in_completed, recap_published
  - Gamification: xp_awarded, badge_unlocked, quest_completed, streak_preserved
  - Social: kudos_given, suggestion_accepted, partner_history_viewed
  - Moderation: photo_flagged, user_reported, content_concealed, content_approved
  - Payments: deposit_authorized, deposit_refunded, refund_failed
  - Notifications: notification_sent, notification_opened
  - Growth: waitlist_joined, invite_redeemed, wave_promoted

- **Key Metrics (NFR006):**
  - RSVP Conversion Rate: % of event views → RSVP (target >25%)
  - Check-In Rate: % of RSVPs → check-in (target >85%)
  - Streak Retention Rate: % of active users with 7+ day streak (target >40%)
  - Refund Latency p95: 95th percentile refund time (target <60s)
  - Error Rate: API error rate per endpoint (target <1%)
  - Flag Resolution Time: Median time from flag → admin action (target <24h)
  - Auto-Concealment Rate: % of flagged content auto-concealed (monitor for abuse patterns)

- **Alert Thresholds:**
  - Reliability Avg <0.80 → Email alert to ops team
  - Refund Latency p95 >60s → Email alert to payment team
  - Error Rate >5% → Email alert to on-call engineer
  - RSVP Conversion Rate <20% → Email alert to product team (funnel issue)
  - Check-In Rate <75% → Email alert to ops team (potential deposit issue)

### Abuse Prevention (NFR009)

- **Flag Rate Limiting:** Max 20 flags/reports per user per day
- **Auto-Concealment Threshold:** ≥2 distinct user flags (configurable by admin)
- **Ban User Functionality:** Soft-ban restricts user from creating events, RSVPs, posting photos (profile remains visible)
- **Audit Trail:** All moderation actions logged for compliance review
- **False Flag Detection:** Monitor users with high flag submission rate but low approval rate (potential abuse)
- **Appeal Process (Future):** Placeholder for user appeal flow (not in MVP)

---

## Dependencies and Integrations

**Internal Dependencies:**

- Epic 1: User authentication, profile data
- Epic 2: Event model, RSVP data, check-in events
- Epic 3: XP awards, badge unlocks, streak tracking
- Epic 4: Kudos, recap photos, social interactions
- Epic 5: Notification events, preference updates
- Epic 6: Waitlist, invite, wave events
- Epic 7: Partner suggestion events

**External Dependencies:**

- Backend Analytics Service: Instrumentation event storage, metric aggregation
- Backend Moderation API: Flag threshold logic, auto-concealment, admin actions
- Backend Alert Service: Alert rule evaluation, email delivery
- Backend Audit Service: Audit log storage, compliance reporting

**Third-Party SDKs:**

- Firebase Analytics or Mixpanel: Event tracking (already integrated in Epic 1)
- Sentry: Error tracking and crash reporting
- Email Service (SendGrid or AWS SES): Alert email delivery

---

## Acceptance Criteria (Authoritative)

### AC1: Flag Photo Flow (Mobile)

1. User can long-press photo in event recap or user profile to open "Report Photo" option
2. Report modal displays 6 reason options: "Inappropriate content", "Spam", "Harassment", "Offensive", "Other", "Cancel"
3. User selects reason, optionally adds text context (200 char max)
4. Submit button enabled only when reason selected
5. On submit: API call to flag photo, success toast "Report submitted. Thank you."
6. Photo marked as "flagged by me" with small flag icon overlay (visible only to flagger)
7. If photo reaches ≥2 distinct user flags: photo auto-concealed (placeholder: "Content under review")
8. Photo owner receives notification: "Your photo has been flagged for review"
9. Rate limit enforced: Max 20 flags per user per day (exceed limit → error toast)
10. Offline queue: Flag queued locally if no connectivity, submitted when online

**Validation:** Flag 3 different photos, verify all submissions successful, check photo owner sees "Content under review" after 2nd flag from different user

### AC2: Report User Profile (Mobile)

1. User profile screen has "⋮" menu button in top-right corner
2. Menu includes "Report User" option
3. Report modal displays 6 reason options: "Fake profile", "Harassment", "Spam", "Inappropriate behavior", "Other", "Cancel"
4. User selects reason, optionally adds text context (200 char max)
5. Submit button enabled only when reason selected
6. On submit: API call to report user, success toast "Report submitted. Thank you."
7. No visual indication on reported user's profile (privacy protection)
8. Admin receives notification in moderation queue
9. Rate limit enforced: Max 20 reports per user per day
10. Reported user never sees reporter identity

**Validation:** Report 2 user profiles with different reasons, verify admin moderation queue shows both reports, confirm reported users see no indication

### AC3: Admin Moderation Queue (Web)

1. Admin Moderation Queue page displays paginated table (20 items per page)
2. Columns: thumbnail/avatar, content type (photo/user), reporter count, top reason, reported date, status
3. Filter options: content type (all, photos, users), status (pending, auto_concealed, reviewed), date range
4. Sort options: reporter count (descending default), date (newest/oldest)
5. Search bar: filter by uploader name or user ID
6. Row click opens Review Modal with full content detail
7. Table pagination: "Previous" and "Next" buttons, page number display
8. Empty state: "No flagged content. Community is healthy! 🎉"
9. Table auto-refreshes every 60s (manual refresh button also available)
10. Admin can filter to "auto_concealed" status → see only auto-concealed items (≥2 flags)

**Validation:** Flag 5 photos with different reasons, verify all appear in admin queue, apply filters (photos only, auto_concealed status), confirm table updates correctly

### AC4: Moderation Review Modal (Web)

1. Clicking "Review" on queue item opens modal with full content preview
2. Modal displays:
   - Full-size photo or user profile card (avatar, name, reliability, account age)
   - Reporter details: count, top 3 reasons with counts, sample text feedback (3 examples)
   - Reported user info: display name, reliability score, past moderation count
   - Timestamp: "Reported 2h ago, auto-concealed 1h ago"
3. Three action buttons: "Approve", "Remove", "Escalate"
4. "Approve" button: Confirmation prompt "Restore content? This will be logged." → Restores photo, notifies owner and reporters
5. "Remove" button: Confirmation prompt with reason input (required) → Deletes photo, notifies owner and reporters
6. "Ban User" button (only for user reports): Confirmation with reason + duration (1d, 7d, 30d, permanent) → Soft-bans user
7. All actions logged to audit log with adminId, action, timestamp, reason
8. Success toast after action: "Photo removed successfully" or "User approved"
9. Modal closes, queue table refreshes automatically
10. Admin can navigate to next item without closing modal ("Next →" button)

**Validation:** Review 3 flagged photos, approve 1, remove 2 with reasons, verify audit log shows all actions, confirm owners/reporters receive notifications

### AC5: System Health Dashboard (Web)

1. System Health Dashboard displays 5 key metrics cards:
   - RSVP Conversion Rate (% event views → RSVP)
   - Check-In Rate (% RSVPs → check-in)
   - Streak Retention Rate (% users with 7+ day streak)
   - Refund Latency p95 (95th percentile refund time)
   - Error Rate (API errors per endpoint)
2. Each card shows: current value, target threshold, status indicator (green/yellow/red)
3. Status logic: green if within target, yellow if 90-100% of threshold, red if exceeds threshold
4. Sparkline trend chart on each card (7-day view, hover shows daily values)
5. "View Trend" button opens detailed 30-day trend modal with line chart
6. Dashboard auto-refreshes every 60s (manual refresh button available)
7. Last updated timestamp displayed: "Last updated: 2 min ago"
8. If metrics API fails: Show "Unable to load metrics. [Retry]" with retry button
9. Export button: Download metrics CSV (date, metric, value)
10. Alert status section: "All systems operational ✅" or "2 active alerts ⚠️" with link to Alert Configuration page

**Validation:** Load dashboard, verify all 5 metrics display, check sparklines render, click "View Trend" on one metric, confirm 30-day chart appears

### AC6: Alert Configuration (Web)

1. Alert Configuration page displays table of alert rules (rule name, metric, threshold, status)
2. "Create Alert Rule" button opens form modal with fields:
   - Rule name (text input, required)
   - Metric type (dropdown: reliability_avg, refund_latency_p95, error_rate, rsvp_conversion_rate, check_in_rate, streak_retention_rate)
   - Threshold (number input, required)
   - Comparison operator (dropdown: >, <, >=, <=)
   - Alert channels (checkboxes: Email, Slack [disabled], PagerDuty [disabled])
3. "Save" button creates rule, adds to table with status "active"
4. "Test Alert" button on each rule sends test alert to configured channels
5. Test alert email format: "TEST ALERT: [Rule Name] - [Metric] is [Value] (threshold: [Threshold])"
6. "Pause/Resume" toggle on each rule to temporarily disable without deletion
7. "Delete" button with confirmation: "Are you sure? This cannot be undone."
8. Alert History section: Table of triggered alerts (timestamp, rule name, metric value, recipients, acknowledged status)
9. "Acknowledge" button on history items marks alert as seen (stops repeat alerts for same trigger)
10. Validation errors: "Threshold must be positive number", "At least one channel required"

**Validation:** Create 3 alert rules with different metrics, send test alerts, verify emails received, pause 1 rule, verify no alerts triggered, delete 1 rule, confirm removed from table

### AC7: Analytics Event Emission and Tracking (Mobile & Web)

1. All critical user actions emit instrumentation events via AnalyticsService.trackEvent()
2. Events include: userId, timestamp, eventType, metadata (action-specific)
3. Events queued locally in AsyncStorage/IndexedDB if API unavailable
4. Queue flushed every 30s or when reaching 50 events (batch POST /api/v1/analytics/events/batch)
5. Successful flush clears local queue
6. Failed flush retries with exponential backoff (1s, 2s, 4s delays)
7. Max queue size: 500 events (oldest events dropped if exceeded)
8. Critical events guaranteed delivery:
   - check_in_completed
   - deposit_refunded
   - content_removed
   - user_banned
9. Admin can view event counts in System Health Dashboard → "Analytics" section
10. Event breakdown by type: bar chart showing top 10 event types by count (last 7 days)

**Validation:** Perform 10 user actions (RSVP, check-in, kudos, flag photo), verify events queued, wait 30s, confirm batch sent to backend, check admin dashboard shows event counts

---

## Traceability Mapping

| Acceptance Criteria | PRD Functional Requirements | User Journeys                | Architecture Components                           | Stories  |
| ------------------- | --------------------------- | ---------------------------- | ------------------------------------------------- | -------- |
| AC1                 | FR027, FR028, NFR009        | Journey 2 (photo moderation) | ReportPhotoModal, ModerationService               | 8-1      |
| AC2                 | FR027, NFR009               | N/A                          | ReportUserModal, ModerationService                | 8-1      |
| AC3                 | FR027, FR028                | N/A                          | AdminModerationQueuePage, AdminModerationService  | 8-2      |
| AC4                 | FR027, FR028, NFR009        | N/A                          | ReviewModal, AdminModerationService, AuditService | 8-2, 8-3 |
| AC5                 | FR032, NFR006               | N/A                          | SystemHealthDashboardPage, MetricsService         | 8-4      |
| AC6                 | NFR006, NFR009              | N/A                          | AlertConfigurationPage, AlertService              | 8-5      |
| AC7                 | FR032, NFR006               | All journeys                 | AnalyticsService, event tracking infrastructure   | 8-4      |

**Story Breakdown (Estimated 9-12 stories):**

- Story 8-1: Flag/Report Flow for Photos and Users (AC1, AC2)
- Story 8-2: Admin Moderation Queue UI (AC3)
- Story 8-3: Moderation Review Modal and Actions (AC4)
- Story 8-4: Analytics Event Emission Infrastructure (AC7)
- Story 8-5: System Health Dashboard (AC5)
- Story 8-6: Alert Configuration UI (AC6)
- Story 8-7: Auto-Concealment Logic and Notifications
- Story 8-8: Audit Logging and Compliance
- Story 8-9: Error Tracking and Crash Reporting Integration

---

## Risks, Assumptions, Open Questions

**Risks:**

- Flag abuse: Users mass-flagging content maliciously (mitigated by rate limiting + audit trail)
- False positives: Legitimate content auto-concealed due to coordinated flagging (mitigated by admin review + restore action)
- Admin bottleneck: High volume of flagged content overwhelms admin capacity (mitigated by auto-concealment threshold tuning)
- Event queue loss: Local queue cleared if app crashes before flush (mitigated by persistent storage + retry logic)
- Alert fatigue: Too many alerts reduce response effectiveness (mitigated by threshold tuning + pause functionality)

**Assumptions:**

- Flag threshold of ≥2 distinct users is sufficient for auto-concealment (product decision, may need A/B testing)
- Admin moderation queue resolution time <24h acceptable for MVP (NFR009)
- Email-only alerts sufficient for MVP (Slack/PagerDuty deferred)
- Analytics event batch size of 50 or 30s interval balances real-time visibility and API load
- System health metrics refresh every 60s provides sufficient real-time monitoring

**Open Questions:**

- Should users receive notification when their flag leads to content removal? (Assumed yes for feedback loop)
- What is the soft-ban duration policy? (Assumed admin selects: 1d, 7d, 30d, permanent)
- Should there be a "report false flag" feature for users whose content is falsely flagged? (Deferred to post-MVP)
- How should we handle repeat offenders (users with multiple moderation violations)? (Assumed escalating bans: 1d → 7d → permanent)
- What metrics should trigger automatic admin notifications vs. dashboard-only display? (Assumed critical metrics only: error_rate, refund_latency)

---

## Test Strategy Summary

**Unit Tests (70%):**

- ModerationService: flagPhoto, reportUser, getFlagStatus, rate limit validation
- AdminModerationService: getQueue, approveContent, removeContent, banUser
- AnalyticsService: trackEvent, flushQueue, queue management, retry logic
- MetricsService: getHealthMetrics, getTrendData, getErrorRates
- AlertService: createRule, updateRule, deleteRule, sendTestAlert, validation logic
- Redux Slices: moderation state, analytics queue, metrics cache

**Integration Tests (20%):**

- Flag photo flow: Submit flag → API call → success toast → queue refresh
- Admin review flow: Open modal → approve/remove → API call → audit log entry → notification sent
- Alert trigger flow: Metric exceeds threshold → alert rule evaluated → email sent → history logged
- Analytics batch flush: Queue 50 events → flush triggered → API call → queue cleared
- System health dashboard: Fetch metrics → render cards → sparklines display

**E2E Tests (10%):**

- User flags photo (≥2 users) → photo auto-concealed → admin reviews → removes → owner/reporters notified
- Admin creates alert rule → metric exceeds threshold → alert email received
- User performs 10 actions → events queued → batch sent → admin views event counts in dashboard
- Admin reviews flagged user profile → bans user → user cannot create events or RSVP

**Coverage Targets:**

- Unit tests: 80% line coverage
- Integration tests: All 7 AC scenarios validated
- E2E tests: Critical moderation and alerting paths verified

**Testing Tools:**

- Jest + React Native Testing Library for mobile unit/component tests
- Vitest for web unit tests
- Detox for mobile E2E testing
- Playwright for web E2E testing
- Mock Service Worker (MSW) for API mocking
- Sentry for production error monitoring

---

**End of Epic 8 Frontend Technical Specification**

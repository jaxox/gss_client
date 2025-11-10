# Story 3.6: Weekly Digest Email

Status: drafted

## Story

As a **GSS platform user**,
I want **to receive a weekly email summarizing my activity and progress**,
so that **I stay engaged and informed about my accomplishments and upcoming events**.

## Acceptance Criteria

### AC1: Digest Preference Management

1. Settings screen includes "Email Preferences" section
2. Toggle: "Weekly activity digest" (default: OFF per opt-in best practices)
3. Toggle description: "Get a weekly email with your activity, progress, and upcoming events"
4. Toggle change saved immediately with optimistic UI
5. API call: PATCH /api/users/preferences with { weeklyDigestEnabled: boolean }
6. Confirmation toast: "Email preferences updated"
7. Preference synced across devices via backend
8. Opt-in tracked for analytics (digest adoption rate)

### AC2: Digest Content Requirements

1. Email subject: "Your GSS Week in Review - [Week Start Date]"
2. Email content sections:
   - **Header:** User name, week date range (Mon-Sun)
   - **Events Attended:** Count + list with titles, dates, sports
   - **XP Gained:** Total XP this week + breakdown by source (events, kudos, badges, quests)
   - **Badges Unlocked:** Badge icons + names (if any unlocked this week)
   - **Current Streak:** Streak count + status message ("5-day streak! Keep it going or "Start a new streak this week!")
   - **Upcoming RSVPs:** Next 7 days events with titles, dates, locations
   - **Call-to-Action:** "Browse More Events" button linking to app
   - **Footer:** Unsubscribe link, privacy policy link, app links (iOS, Android)
3. Empty state handling:
   - No events attended: "You didn't attend any events this week. Browse upcoming events!"
   - No upcoming RSVPs: "No upcoming events. Discover new activities near you!"
   - No badges unlocked: "Keep playing to unlock more badges!"
4. Personalized greeting: "Hi [FirstName],"
5. Brand-consistent design (Trust & Reliability colors, Inter font)

### AC3: Email Template Design

1. Responsive HTML email template (mobile and desktop)
2. Header with GSS logo and week date range
3. Content sections with clear visual hierarchy
4. Event cards with sport icons, titles, dates
5. XP breakdown chart (simple horizontal bars)
6. Badge icons displayed inline (40x40px, fallback to emoji)
7. Streak indicator with flame emoji and count
8. CTA buttons with brand colors (primary blue #3B82F6)
9. Footer with social links, unsubscribe, legal links
10. Dark mode support (media query for dark-themed email clients)

### AC4: Digest Generation Logic

1. Backend cron job runs weekly (Sunday night, 9 PM UTC)
2. Query all users with weeklyDigestEnabled = true
3. For each user:
   - Fetch events attended in past 7 days
   - Calculate total XP gained in past 7 days
   - Fetch badges unlocked in past 7 days
   - Get current streak status
   - Query upcoming RSVPs (next 7 days)
4. Generate email HTML from template with user data
5. Queue email for delivery (batched, 100 users per batch)
6. Track digest generation: userId, generatedAt, emailQueued
7. Job execution logged for monitoring

### AC5: Email Delivery and Tracking

1. Email sent via SendGrid or AWS SES
2. From address: "GSS Team <noreply@gss.app>" (or configured domain)
3. Reply-to: "support@gss.app"
4. Email includes tracking pixel for open rate (if enabled)
5. CTA links include UTM parameters for click tracking
6. Unsubscribe link: "https://gss.app/unsubscribe?token={token}"
7. Delivery status logged: sent, delivered, bounced, failed
8. Bounce handling: Disable digest for hard bounces (invalid email)
9. Email delivery retried 3 times on soft failures

### AC6: Unsubscribe Flow

1. Unsubscribe link in email footer opens web page
2. Unsubscribe page: "You've been unsubscribed from weekly digests"
3. Option to re-subscribe: "Change your mind? Re-enable in app settings"
4. One-click unsubscribe (no login required, token-based)
5. Unsubscribe updates user preference: weeklyDigestEnabled = false
6. Confirmation page with link to app settings
7. Unsubscribe event logged for analytics

### AC7: Analytics and Monitoring

1. Track digest metrics:
   - Digests sent (count per week)
   - Opt-in rate (% users with digest enabled)
   - Email open rate (% of sent emails opened)
   - Click-through rate (% clicked CTA or event links)
   - Unsubscribe rate (% of sent emails leading to unsubscribe)
   - Bounce rate (% of emails bounced)
2. Admin dashboard displays digest metrics
3. Weekly report: Digest performance summary
4. Alert on high bounce rate (>5%) or low open rate (<15%)
5. A/B test different subject lines (future optimization)

## Tasks / Subtasks

### Task 1: Digest Preference UI (AC: 1)

- [ ] Update `mobile/src/screens/settings/EmailPreferencesScreen.tsx`
- [ ] Update `web/src/pages/settings/EmailPreferencesPage.tsx`
- [ ] Add toggle: "Weekly activity digest" (default: OFF)
- [ ] Add description text below toggle
- [ ] Implement optimistic UI update on toggle change
- [ ] API call: PATCH /api/users/preferences with { weeklyDigestEnabled }
- [ ] Show confirmation toast on success
- [ ] Handle API failure: rollback toggle, show error toast
- [ ] Write component tests for preference toggle

### Task 2: Email Template Design (AC: 2, 3)

- [ ] Create `shared/templates/weeklyDigest.html` email template
- [ ] Design responsive layout (mobile and desktop)
- [ ] Add header section with logo and week range
- [ ] Add events attended section with cards
- [ ] Add XP breakdown section with chart
- [ ] Add badges unlocked section with icons
- [ ] Add streak status section with flame emoji
- [ ] Add upcoming RSVPs section
- [ ] Add CTA button: "Browse More Events"
- [ ] Add footer with unsubscribe, privacy, app links
- [ ] Test email rendering in major clients (Gmail, Outlook, Apple Mail)
- [ ] Add dark mode media query support

### Task 3: Email Template Data Binding (AC: 2, 4)

- [ ] Create `shared/utils/emailTemplateRenderer.ts`
- [ ] Implement `renderWeeklyDigest(userData, weekData): string`
- [ ] Replace template variables: {{userName}}, {{weekStart}}, {{weekEnd}}
- [ ] Populate events attended list dynamically
- [ ] Populate XP breakdown dynamically
- [ ] Populate badges unlocked (with icons)
- [ ] Populate current streak status
- [ ] Populate upcoming RSVPs
- [ ] Handle empty states (no events, no badges, no RSVPs)
- [ ] Write unit tests for template rendering

### Task 4: Backend Digest Generation Job (AC: 4)

- [ ] Create backend cron job (Sunday 9 PM UTC)
- [ ] Query users with weeklyDigestEnabled = true
- [ ] For each user, fetch weekly activity data:
  - Events attended (past 7 days)
  - XP gained (past 7 days, breakdown by source)
  - Badges unlocked (past 7 days)
  - Current streak status
  - Upcoming RSVPs (next 7 days)
- [ ] Call `renderWeeklyDigest()` with user data
- [ ] Queue email for delivery (batch 100 users at a time)
- [ ] Log digest generation: userId, generatedAt, emailQueued
- [ ] Add error handling: Skip user on data fetch failure, log error
- [ ] Write integration tests for digest generation

### Task 5: Email Delivery Service Integration (AC: 5)

- [ ] Configure SendGrid or AWS SES API credentials
- [ ] Create `shared/services/email/emailDeliveryService.ts`
- [ ] Implement `sendEmail(to, subject, htmlBody, metadata)`
- [ ] Set from address: "GSS Team <noreply@gss.app>"
- [ ] Set reply-to: "support@gss.app"
- [ ] Include tracking pixel for open rate (optional, privacy-aware)
- [ ] Add UTM parameters to all links for click tracking
- [ ] Handle delivery response: log status (sent, failed)
- [ ] Implement retry logic (3 attempts on soft failures)
- [ ] Write integration tests for email delivery

### Task 6: Unsubscribe Flow (AC: 6)

- [ ] Create unsubscribe web page: `/unsubscribe?token={token}`
- [ ] Validate unsubscribe token (JWT or signed token)
- [ ] Update user preference: weeklyDigestEnabled = false
- [ ] Display confirmation: "You've been unsubscribed"
- [ ] Show re-subscribe option: "Re-enable in app settings"
- [ ] Link to app settings page
- [ ] Log unsubscribe event for analytics
- [ ] Handle invalid/expired tokens gracefully
- [ ] Write E2E test for unsubscribe flow

### Task 7: Bounce Handling (AC: 5)

- [ ] Configure SendGrid/SES webhook for bounce notifications
- [ ] Create webhook endpoint: POST /api/webhooks/email-bounce
- [ ] Parse bounce notification payload
- [ ] Identify hard bounces (invalid email, mailbox full)
- [ ] Update user preference: weeklyDigestEnabled = false for hard bounces
- [ ] Log bounce event for analytics
- [ ] Alert admin on high bounce rate (>5%)
- [ ] Write integration tests for bounce handling

### Task 8: Analytics Event Tracking (AC: 7)

- [ ] Track digest generation: `weekly_digest_generated`
- [ ] Track email sent: `weekly_digest_sent`
- [ ] Track email opened: `weekly_digest_opened` (via tracking pixel)
- [ ] Track link clicked: `weekly_digest_clicked` (via UTM parameters)
- [ ] Track unsubscribe: `weekly_digest_unsubscribed`
- [ ] Track bounce: `weekly_digest_bounced` (hard vs soft)
- [ ] Calculate weekly metrics: opt-in rate, open rate, CTR, unsubscribe rate
- [ ] Write tests for analytics events

### Task 9: Admin Metrics Dashboard (AC: 7)

- [ ] Create admin page: "Email Digest Metrics"
- [ ] Display key metrics:
  - Total digests sent this week
  - Opt-in rate (% users with digest enabled)
  - Open rate (% opened)
  - Click-through rate (% clicked)
  - Unsubscribe rate (% unsubscribed)
  - Bounce rate (% bounced)
- [ ] Display trend charts (last 4 weeks)
- [ ] Add filters: Date range, user cohort
- [ ] Export CSV button for detailed metrics
- [ ] Add alerts: High bounce rate, low open rate
- [ ] Write component tests for metrics dashboard

### Task 10: Mock Email Service (Frontend Development) (AC: 2, 3)

- [ ] Create `shared/services/mock/mockEmailService.ts`
- [ ] Mock `sendEmail()` method with realistic delay
- [ ] Generate sample digest email HTML for preview
- [ ] Return mock delivery status: { sent: true, messageId: 'mock-123' }
- [ ] Log email preview to console for debugging
- [ ] Write unit tests for mock email service

### Task 11: Testing and Validation (AC: All)

- [ ] Write unit tests for email template rendering
- [ ] Write unit tests for digest data fetching
- [ ] Write integration tests: Digest generation → Email queued
- [ ] Write E2E test: User opts in → receives digest next Sunday
- [ ] Test email rendering in 5 major clients (Gmail, Outlook, Apple Mail, Yahoo, mobile)
- [ ] Test dark mode email rendering
- [ ] Test unsubscribe flow: Click link → preference updated
- [ ] Test bounce handling: Hard bounce → digest disabled
- [ ] Validate analytics tracking: All events logged correctly

## Dev Notes

**Frontend Implementation Focus:** This story implements the weekly digest email system, primarily backend-focused with frontend preference UI and web unsubscribe page. Builds on previous Epic 3 stories (XP, badges, streaks).

**Architecture Patterns:**

- **Opt-In Model:** Weekly digest default OFF, users opt in (GDPR-friendly)
- **Batch Processing:** Digest generation batched (100 users at a time) to avoid overload
- **Template-Based:** HTML email template with variable substitution
- **Privacy-Aware Tracking:** Open tracking optional, respectful of user privacy
- **Graceful Degradation:** Empty states for no activity (encourage engagement)

**Email Template Structure:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your GSS Week in Review</title>
    <style>
      /* Responsive styles */
      /* Dark mode support */
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header -->
      <header>
        <img src="{{logoUrl}}" alt="GSS Logo" />
        <h1>Your Week in Review</h1>
        <p>{{weekStart}} - {{weekEnd}}</p>
      </header>

      <!-- Greeting -->
      <p>Hi {{userName}},</p>

      <!-- Events Attended -->
      <section class="events-attended">
        <h2>🏃 Events Attended: {{eventsCount}}</h2>
        {{#each events}}
        <div class="event-card">
          <span class="sport-icon">{{sportIcon}}</span>
          <span class="event-title">{{title}}</span>
          <span class="event-date">{{date}}</span>
        </div>
        {{/each}} {{#if noEvents}}
        <p>
          You didn't attend any events this week.
          <a href="{{browseUrl}}">Browse upcoming events!</a>
        </p>
        {{/if}}
      </section>

      <!-- XP Gained -->
      <section class="xp-summary">
        <h2>⭐ XP Gained: {{totalXP}}</h2>
        <div class="xp-breakdown">
          <div class="xp-bar" style="width: {{eventXPPercent}}%">Events: {{eventXP}}</div>
          <div class="xp-bar" style="width: {{badgeXPPercent}}%">Badges: {{badgeXP}}</div>
          <div class="xp-bar" style="width: {{questXPPercent}}%">Quests: {{questXP}}</div>
        </div>
      </section>

      <!-- Badges Unlocked -->
      <section class="badges-unlocked">
        <h2>🏆 Badges Unlocked</h2>
        {{#each badges}}
        <div class="badge">
          <img src="{{iconUrl}}" alt="{{name}}" />
          <span>{{name}}</span>
        </div>
        {{/each}} {{#if noBadges}}
        <p>Keep playing to unlock more badges!</p>
        {{/if}}
      </section>

      <!-- Current Streak -->
      <section class="streak-status">
        <h2>🔥 Current Streak: {{streakCount}} days</h2>
        <p>{{streakMessage}}</p>
      </section>

      <!-- Upcoming RSVPs -->
      <section class="upcoming-rsvps">
        <h2>📅 Upcoming RSVPs</h2>
        {{#each upcomingEvents}}
        <div class="event-card">
          <span>{{title}}</span>
          <span>{{date}}</span>
          <span>{{location}}</span>
        </div>
        {{/each}} {{#if noUpcoming}}
        <p>No upcoming events. <a href="{{browseUrl}}">Discover new activities!</a></p>
        {{/if}}
      </section>

      <!-- CTA -->
      <div class="cta">
        <a href="{{browseUrl}}" class="btn-primary">Browse More Events</a>
      </div>

      <!-- Footer -->
      <footer>
        <p>
          <a href="{{unsubscribeUrl}}">Unsubscribe</a> | <a href="{{privacyUrl}}">Privacy Policy</a>
        </p>
        <p>Download: <a href="{{iosAppUrl}}">iOS</a> | <a href="{{androidAppUrl}}">Android</a></p>
        <p>&copy; 2025 GSS. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>
```

**Digest Generation Timing:**

- **Cron Schedule:** Sunday 9 PM UTC (captures full week Mon-Sun)
- **Delivery Window:** Sunday night to Monday morning (users receive Monday morning)
- **Batch Processing:** 100 users per batch, 1-second delay between batches
- **Total Time:** 5,000 users = 50 batches = ~1 minute total (plus email queue processing)

**Integration Points:**

- **Story 3.1 Integration:** XP breakdown in digest
- **Story 3.2 Integration:** Level progress in digest (optional future enhancement)
- **Story 3.3 Integration:** Badges unlocked in digest
- **Story 3.4 Integration:** Current streak status in digest
- **Epic 2 Integration:** Events attended and upcoming RSVPs

**Performance Considerations:**

- Digest generation < 5 seconds per user (data fetching + template rendering)
- Batch processing prevents server overload (100 users/batch)
- Email delivery asynchronous (queued, not blocking)
- Tracking pixel < 1KB (minimal email size impact)
- Template rendering cached for repeated use

**Privacy and Compliance:**

- Opt-in default (no unsolicited emails)
- One-click unsubscribe (GDPR-compliant)
- Clear privacy policy link
- Open tracking optional (respect user privacy)
- No sensitive data in email (no passwords, payment info)
- Bounce handling for invalid emails

**Accessibility Considerations:**

- Semantic HTML structure (h1, h2, sections)
- Alt text for all images (logo, badge icons)
- High contrast colors (WCAG AA compliant)
- Text-only fallback (plain text version)
- Dark mode support (media query)

### Project Structure Notes

**Target Implementation Paths:**

```text
shared/
  templates/weeklyDigest.html           # Email HTML template
  utils/emailTemplateRenderer.ts        # Template variable substitution
  services/email/
    emailDeliveryService.ts             # SendGrid/SES integration
    mockEmailService.ts                 # Mock for development

mobile/
  src/screens/settings/EmailPreferencesScreen.tsx  # Digest preference toggle

web/
  src/pages/settings/EmailPreferencesPage.tsx      # Digest preference toggle
  src/pages/unsubscribe/UnsubscribePage.tsx        # Unsubscribe confirmation
  src/pages/admin/EmailDigestMetricsPage.tsx       # Admin analytics

backend/ (reference only, separate repo)
  cron/weeklyDigestJob.ts               # Sunday 9 PM UTC job
  webhooks/emailBounceWebhook.ts        # Handle bounce notifications
```

**Testing Strategy:**

- **Unit Tests (60%):** Template rendering, data fetching, preference updates
- **Integration Tests (30%):** Digest generation, email delivery, bounce handling
- **E2E Tests (10%):** Opt-in → receive digest, unsubscribe flow

**Validation Checklist:**

- [ ] Weekly digest email generated with correct data
- [ ] Email renders correctly in 5 major clients
- [ ] Preference toggle updates backend correctly
- [ ] Unsubscribe link disables digest immediately
- [ ] Bounce handling disables digest for hard bounces
- [ ] Analytics track all digest metrics
- [ ] Admin dashboard displays correct metrics
- [ ] Dark mode email rendering works
- [ ] Empty states display encouragement messages
- [ ] Email delivery retries on soft failures

### References

- [Source: docs/tech-spec-epic-3.md#AC6-Weekly-Digest] - Weekly digest requirements
- [Source: docs/tech-spec-epic-3.md#Data-Models] - WeeklyDigest interface
- [Source: docs/tech-spec-epic-3.md#Workflow-5-Weekly-Digest-Generation] - Generation workflow
- [Source: docs/tech-spec-epic-3.md#NFRs-Performance] - Performance targets
- [Source: docs/shared/PRD.md#FR033] - Email digest functional requirements
- [Source: docs/stories/3-1-xp-computation-service.md] - Story 3.1 XP data
- [Source: docs/stories/3-3-badge-system-gallery-ui.md] - Story 3.3 Badge data
- [Source: docs/stories/3-4-streak-tracking-logic.md] - Story 3.4 Streak data

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Agent model name and version will be recorded here -->

### Debug Log References

### Completion Notes List

### File List

---

**Story Points:** 8 (3-4 dev sessions)

**Prerequisites:** Story 3.1 (XP Computation), Story 3.3 (Badges), Story 3.4 (Streak Tracking)

**Blocks:** None

**Integration Points:**

- Story 3.1: XP breakdown in digest email
- Story 3.3: Badges unlocked in digest email
- Story 3.4: Current streak status in digest email
- Epic 2: Events attended and upcoming RSVPs data

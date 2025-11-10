# Epics: Gamified Social Sports Platform

Version 0.1.0 | Date: 2025-10-24 | Owner: Product Management (Jay)
Status: Draft – To refine after review

## Sequencing Rationale

Deliver foundational reliability, habit loops, and host tooling before layering advanced social expansion (quests breadth, partner suggestions), then growth gating and analytics. Deferred Phase 2 group/community features excluded from active epic scope.

## Epic 1: Platform Foundation & Core Identity

Goal: Establish deployable infrastructure, authentication, user profiles, and reliability-scoped data model.

Scope FRs: FR001–FR004, FR037–FR038 (privacy defaults & auth), partial FR010 (data model stub, initial reliability calc), NFR001–NFR004 baseline.

Stories (est.): 12–16

Key Deliverables:

- Repo setup, CI/CD pipeline, environment configs
- User registration + SSO providers (Google, Facebook, Apple)
- **[Story 1.3: Google SSO Registration/Login](stories/story-1.3.md)** — Implement secure Google SSO registration and login flow, including idToken verification, new/existing user handling, JWT issuance, and error handling. (Status: Approved, 12 tests, 91.55% coverage)
- Profile CRUD, avatar upload (basic)
- Reliability score calculation baseline (private storage)
- JWT auth, refresh token flow, password reset

Next Story to Prepare: Story 1.4 – Profile CRUD & Avatar Upload

Exit Criteria: Successful login/logout, profile view/edit, reliability score updated post 3 test RSVPs.

## Epic 2: Event Lifecycle & Attendance Commitment

Goal: Enable event creation, browsing, RSVP with deposit, check-in, and refund automation.

Scope FRs: FR005–FR009, FR011–FR012, FR024, FR034, instrumentation subset FR032.

Stories: 5 (complete)

Key Deliverables:

- ✅ Host event creation (CRUD, validation, QR code generation) - Story 2.1
- ✅ Event list + map browse with geo-filtering - Story 2.4
- ✅ RSVP flow with Stripe deposit auth + private events - Story 2.2
- ✅ QR + manual check-in awarding XP stub + deposit refund - Story 2.3
- ✅ Reminder notifications (24h/1h configurable) & cancellation window logic - Story 2.5
- ✅ Edge fallback for failed QR (manual confirmation) - Story 2.3

Completed Stories:

- Story 2.1: Host Event Creation (DONE 2025-10-26)
- Story 2.2: Event RSVP & Deposit Authorization (DONE 2025-10-26)
- Story 2.3: QR Check-In & Deposit Refund (DONE 2025-10-26)
- Story 2.4: Event Browse & Search with Geo-Filtering (DONE 2025-10-26)
- Story 2.5: Event Reminders & Cancellation Flow (READY 2025-10-27)

Exit Criteria: ✅ MET - RSVP→Check-In conversion ≥85% in tests; refund latency p95 <60s achieved.

Status: **COMPLETE** (2025-10-27)

## Epic 3: Gamification Core (XP, Levels, Badges, Streaks)

Goal: Drive habit formation through transparent progression mechanics.

Scope FRs: FR013–FR016, FR033 (email digest - minimal), FR035 (streak risk), NFR008 (config externalization).

Stories (est.): 14–18

Key Deliverables:

- XP computation service (rule config)
- Level thresholds & progression UI
- Badge definitions (initial 15) + unlock engine
- Streak tracking logic + at-risk notifications
- Weekly digest summarizing XP, streak, upcoming events

Next Story to Prepare: Story 3.1 – XP Computation Service (Rule Config)

Exit Criteria: XP increments on attendance & kudos; badge unlock triggers animation; streak risk prompt generated in sandbox.

## Epic 4: Social Interaction & Quests

Goal: Enhance engagement via post-event social features and structured quests.

Scope FRs: FR017–FR020, FR018 (recap), FR019 (partner history), FR036 (diversity metric), instrumentation events (quest & partner).

Stories (est.): 16–20

Key Deliverables:

- Kudos send/receive flow + rate limit
- Event recap photo upload + highlight text
- Partner history logging + diversity metric calculation
- Quest engine (initial 5–8 quests) with progress bars & completion notifications
- Social Butterfly quest path integration

Next Story to Prepare: Story 4.1 – Kudos Send/Receive Flow

Exit Criteria: Quest completion updates XP; recap visible with photo thumbnails; partner diversity triggers quest.

## Epic 5: Notification & Preference Center + Automated Late ETA

Goal: Centralize user control over engagement signals and add reliability improvements via late arrival ETA quick replies.

Scope FRs: FR023, FR032 (expanded events), Journey 2 enhancement (ETA quick-reply logic), FR005 link for start detection.

Stories (est.): 10–14

Key Deliverables:

- Preference center UI (toggle 6 categories)
- Notification dispatcher (push) + templating
- Quick-reply push for late check-in (ETA options) updating host dashboard
- Audit logging for notification delivery & reply handling

Next Story to Prepare: Story 5.1 – Preference Center UI

Exit Criteria: User can toggle categories; host dashboard reflects real-time late ETAs; notifications respect preferences.

## Epic 6: Growth Gating & Invite Waves

Goal: Implement controlled activation to optimize reliability and organic growth metrics.

Scope FRs: FR029–FR031, instrumentation related (invite + wave events), NFR006 observability for gating metrics.

Stories (est.): 12–16

Key Deliverables:

- Waitlist intake & scoring rubric implementation
- Wave activation engine + promotion criteria evaluation
- Invite allocation UI & logic (dynamic adjustments)
- Metrics dashboard (basic numbers: reliability avg, RSVP→Check-In %, k-factor approximation)

Next Story to Prepare: Story 6.1 – Waitlist Intake & Scoring Rubric

Exit Criteria: Wave promotion script runs producing snapshot; invites redeemed tracked; throttle guardrails testable.

## Epic 7: Advanced Partner Suggestions (Rule-Based Engine)

Goal: Increase social mixing with foundational suggestion logic enabling future ML extension.

Scope FRs: FR021, FR032 (partner suggestion events), FR036 synergy, NFR010 extensibility fields.

Stories (est.): 10–13

Key Deliverables:

- Rule-based suggestion service (mutual play count, schedule overlap)
- Data schema with ML-ready placeholders
- Suggestion surfacing in quest flow and event browse (highlight badge)
- Instrumentation for served vs accepted suggestions

Next Story to Prepare: Story 7.1 – Rule-Based Suggestion Service

Exit Criteria: Suggestions list renders; acceptance updates partner diversity; schema reviewed for ML readiness.

## Epic 8: Observability & Admin Moderation

Goal: Round out operational readiness with moderation and analytics visibility.

Scope FRs: FR027–FR028, FR032 (moderation events), NFR006 (logging/metrics), NFR009 (abuse prevention).

Stories (est.): 9–12

Key Deliverables:

- Flag/report flow for photos/users
- Admin review queue with conceal threshold logic
- Structured logging & metrics emission (conversion %, churn proxies, streak retention)
- Alert rules configuration (reliability dips, refund latency breaches)

Next Story to Prepare: Story 8.1 – Flag/Report Flow for Photos/Users

Exit Criteria: Flagged photo auto-hides after threshold; alerts trigger in test environment; admin actions audit logged.

## Epic 9 (Conditional / Stretch): Private Events & Privacy Controls Enhancement

Goal: Strengthen trust with refined private event handling + level visibility toggle.

Scope FRs: FR025, FR037, refinements to reliability display logic.

Stories (est.): 6–9

Key Deliverables:

- Private event invite link generation + access gate
- Profile privacy settings UI (toggle level visibility)
- Reliability aggregated tier display design stub (future public exposure)

Next Story to Prepare: Story 9.1 – Private Event Invite Link Generation

Exit Criteria: Private events restricted; privacy toggles persist; audit logs updated.

## Epic 10: Developer Experience & API Infrastructure (Parallel Track)

**Status:** Active (Parallel to Epic 4-6)  
**Type:** Infrastructure / Developer Experience  
**Priority:** High (blocks frontend development)

Goal: Establish robust API contract layer and developer tooling to enable seamless frontend integration and improve overall development velocity.

Scope: Complete OpenAPI/Swagger documentation, client configuration endpoint, automated spec publishing, API versioning strategy.

Stories: 4 (8-12 dev sessions total)

Key Deliverables:

- Client configuration endpoint (shared constants/feature flags)
- Complete Swagger annotations for Epic 1-3 endpoints (Auth, Users, Events, Gamification)
- Complete Swagger annotations for Epic 4+ endpoints (Social, Notifications, future APIs)
- Automated OpenAPI spec publishing to GitHub Releases with CI/CD validation

**Implementation Timeline (Parallel Track):**

- **Week 1 (during Epic 4.2-4.3):** Story 10.1 - Client Configuration Endpoint
- **Week 2 (during Epic 4.4-4.5):** Story 10.2 - Swagger Annotations for Epic 1-3
- **Week 3 (during Epic 4.6-5.1):** Story 10.3 - Swagger Annotations for Epic 4+
- **Week 4 (during Epic 5.2-5.3):** Story 10.4 - OpenAPI Spec Publishing & CI/CD

**Stories:**

### Story 10.1: Client Configuration Endpoint

**Status:** Ready to start (Week 1)

As a **frontend developer**, I want **a single endpoint that returns all client-configurable constants**, so that **I don't hardcode values like rate limits, XP rewards, or feature flags in mobile/web apps**.

**Acceptance Criteria:**

1. `GET /api/v1/client-config` endpoint returns JSON with all client-facing constants
2. Response includes `Cache-Control: public, max-age=3600` header and `ETag`
3. Backend refactors all hardcoded magic numbers to use centralized `ClientConfig` class
4. Config values load from `application.yml` with environment variable overrides
5. Integration test verifies all expected config sections present and cached correctly

**Story Points:** 3 (2-3 dev sessions)

**Prerequisites:** None (can start immediately)

### Story 10.2: Swagger Annotations for Epic 1-3 Endpoints

**Status:** Backlog (Week 2)

As a **frontend developer**, I want **comprehensive OpenAPI documentation for authentication, user, and event APIs**, so that **I can understand API contracts without reading backend code**.

**Acceptance Criteria:**

1. All Epic 1 endpoints (Auth, User, SSO) have complete Swagger annotations
2. All Epic 2 endpoints (Event CRUD, RSVP, Check-in, Browse) have complete Swagger annotations
3. All Epic 3 endpoints (XP, Levels, Badges, Streaks) have complete Swagger annotations
4. All DTOs used in Epic 1-3 have `@Schema` descriptions on class and field level
5. Controllers grouped by `@Tag` (Auth, Users, Events, Gamification)
6. Swagger UI (`/swagger-ui.html`) displays all Epic 1-3 endpoints with accurate documentation
7. OpenAPI JSON spec (`/v3/api-docs`) validates with `openapi-generator validate`

**Story Points:** 5 (3-5 dev sessions)

**Prerequisites:** Story 10.1 (shared constants documented)

### Story 10.3: Swagger Annotations for Epic 4+ Endpoints

**Status:** Backlog (Week 3)

As a **frontend developer**, I want **comprehensive OpenAPI documentation for social, notification, and future APIs**, so that **I have complete API coverage for mobile app development**.

**Acceptance Criteria:**

1. All Epic 4 endpoints (Kudos, Event Recap, Partner History, Quests) have complete Swagger annotations
2. All Epic 5+ endpoints (as implemented) have complete Swagger annotations
3. All new DTOs have `@Schema` descriptions
4. Error response schemas documented (400/401/403/404/500 formats)
5. Authentication flow documented (JWT token format, refresh mechanism)
6. Rate limiting headers documented (`X-RateLimit-*`)
7. Complete OpenAPI spec validates with no errors or warnings

**Story Points:** 3 (2-3 dev sessions)

**Prerequisites:** Story 10.2 (Epic 1-3 annotations)

### Story 10.4: OpenAPI Spec Publishing & CI/CD Integration

**Status:** Backlog (Week 4)

As a **frontend developer**, I want **the OpenAPI spec automatically published to GitHub Releases**, so that **I can generate TypeScript API clients in my mobile/web projects with a single command**.

**Acceptance Criteria:**

1. GitHub Actions workflow publishes OpenAPI spec to GitHub Releases on tag push (`v*`)
2. Published spec follows SemVer (breaking changes = MAJOR, new endpoints = MINOR, docs = PATCH)
3. CI validates OpenAPI spec with `openapi-generator validate` on every PR
4. CI fails if spec has errors (missing descriptions, invalid refs)
5. Documentation includes example TypeScript client generation command
6. README explains versioning policy and usage
7. Test generation in example React Native project to verify usability

**Story Points:** 3 (2-3 dev sessions)

**Prerequisites:** Story 10.3 (complete OpenAPI spec)

**Technical Decision:** Using GitHub Releases for spec publishing (no npm organization account)

Exit Criteria: Frontend developers can generate TypeScript clients with single command; 100% of REST endpoints documented; automated spec publishing on every release.

**Business Value:**

- Faster frontend development (type-safe clients eliminate manual integration)
- Reduced integration bugs (contract-first approach prevents runtime errors)
- Better team collaboration (self-service API documentation)
- Versioned contracts (enables independent frontend/backend deployment)

**Dependencies:**

- **Builds on:** Epic 1-4 existing APIs
- **Enables:** Future Epic 11 (Mobile App), Epic 12 (Web Admin Dashboard)

## Epic 11: Groups & Communities

**Status:** Backlog (Phase 2 Feature)  
**Type:** Social / Community Building  
**Priority:** Medium (after Epic 4-6 completion)

Goal: Enable users to create and manage interest-based groups/communities, fostering recurring participation and deeper social connections through group events and shared spaces.

Scope FRs: FR042–FR052 (assumed from Phase 2), new group-specific requirements.

Stories (est.): 18-25

Key Deliverables:

- Group creation & basic profile management (name, description, avatar, category)
- Group membership flows (join requests, invitations, approval/rejection)
- Admin role management (owner, admin, moderator, member permissions)
- Group event creation (events linked to groups, member-only or open)
- Group discovery & search (browse by category, location, activity type)
- Group feed & communication (announcements, shared photos, discussions)
- Group privacy settings (public vs private groups, membership visibility)
- Group analytics for admins (member count, engagement metrics, event participation)
- Group badges & achievements (group-level XP, group streak tracking)
- Member management tools (remove members, ban users, transfer ownership)

**Implementation Timeline:**

- **Phase 2.1 (Weeks 1-3):** Core group infrastructure (Stories 11.1-11.6)
- **Phase 2.2 (Weeks 4-6):** Group events & discovery (Stories 11.7-11.12)
- **Phase 2.3 (Weeks 7-9):** Group communication & analytics (Stories 11.13-11.18)
- **Phase 2.4 (Weeks 10-12):** Advanced features & polish (Stories 11.19-11.25)

**Stories (Estimated Breakdown):**

### Phase 2.1: Core Group Infrastructure

**Story 11.1: Group Creation & Basic Profile**
As a **user**, I want **to create a group with a name, description, and category**, so that **I can organize recurring activities with like-minded people**.

- Group creation form (name, description, category, avatar upload)
- Group profile page (basic info display)
- Group owner permissions
- **Story Points:** 5 (3-4 dev sessions)

**Story 11.2: Group Membership - Join Requests & Invitations**
As a **user**, I want **to join groups via request or invitation**, so that **I can participate in group activities**.

- Join request flow (public groups)
- Invitation flow (private groups, email/in-app invites)
- Pending requests list (for group admins)
- Accept/reject membership actions
- **Story Points:** 5 (3-4 dev sessions)

**Story 11.3: Group Admin Role Management**
As a **group owner**, I want **to assign admin/moderator roles to members**, so that **I can delegate group management tasks**.

- Role hierarchy (Owner > Admin > Moderator > Member)
- Role assignment UI
- Permission matrix (create events, approve members, remove users)
- Transfer ownership flow
- **Story Points:** 3 (2-3 dev sessions)

**Story 11.4: Group Member List & Profiles**
As a **group member**, I want **to see all group members and their profiles**, so that **I can connect with other members**.

- Member list page with avatars, names, join dates
- Member profile view (tap to see user profile)
- Member search/filter (by name, role)
- Member count display
- **Story Points:** 3 (2-3 dev sessions)

**Story 11.5: Group Settings & Privacy Controls**
As a **group admin**, I want **to configure group privacy and membership settings**, so that **I can control who can join and what is visible**.

- Privacy toggle (Public vs Private)
- Membership approval mode (Auto-approve vs Manual-approve)
- Group visibility settings (discoverable vs invite-only)
- Member list visibility (public vs members-only)
- **Story Points:** 3 (2-3 dev sessions)

**Story 11.6: Leave Group & Remove Members**
As a **group member**, I want **to leave a group**, and as **admin**, I want **to remove members**, so that **group participation is voluntary and manageable**.

- Leave group flow (confirmation dialog)
- Remove member flow (admin action with reason)
- Ban member flow (prevent rejoining)
- Transfer ownership before leaving (for owners)
- **Story Points:** 3 (2-3 dev sessions)

### Phase 2.2: Group Events & Discovery

**Story 11.7: Group Event Creation**
As a **group admin**, I want **to create events linked to my group**, so that **members can easily find and RSVP to group activities**.

- Event creation form with group link
- Group event badge/indicator on event cards
- Member-only vs open event toggle
- Group members auto-notified of new events
- **Story Points:** 5 (3-4 dev sessions)

**Story 11.8: Group Event List & Calendar**
As a **group member**, I want **to see all upcoming group events in one place**, so that **I can plan my participation**.

- Group events tab (list and calendar views)
- Filter by date range, sport type
- RSVP status indicators
- Past events archive
- **Story Points:** 3 (2-3 dev sessions)

**Story 11.9: Group Discovery & Browse**
As a **user**, I want **to discover groups I might be interested in**, so that **I can expand my social network**.

- Group browse page (grid/list view)
- Category filters (Running, Cycling, Yoga, etc.)
- Location-based search (groups near me)
- Search by name/keyword
- **Story Points:** 5 (3-4 dev sessions)

**Story 11.10: Group Recommendations**
As a **user**, I want **to receive group recommendations based on my activity**, so that **I can find relevant communities**.

- Recommendation algorithm (based on attended events, sports preferences)
- "Suggested Groups" section on home screen
- "Similar Groups" on group profile pages
- Track recommendation acceptance rate
- **Story Points:** 5 (3-4 dev sessions)

**Story 11.11: Group Invitations via Link**
As a **group admin**, I want **to generate shareable invite links**, so that **I can easily invite people outside the app**.

- Generate invite link (unique URL per group)
- Link preview with group info
- Link expiration options (never, 7 days, 30 days)
- Track link usage analytics
- **Story Points:** 3 (2-3 dev sessions)

**Story 11.12: Group Badges & XP Integration**
As a **group member**, I want **to earn badges and XP for group participation**, so that **I feel recognized for my contributions**.

- Group-specific badges ("Group Founder", "Super Attendee", "Group MVP")
- Group XP tracking (separate from personal XP)
- Group leaderboard (most active members)
- Badge display on member profiles
- **Story Points:** 5 (3-4 dev sessions)

### Phase 2.3: Group Communication & Analytics

**Story 11.13: Group Feed & Announcements**
As a **group admin**, I want **to post announcements to the group feed**, so that **I can keep members informed**.

- Group feed (chronological posts)
- Announcement creation (admins only)
- Post types (text, photo, event link)
- Feed pagination & infinite scroll
- **Story Points:** 5 (3-4 dev sessions)

**Story 11.14: Group Photo Sharing**
As a **group member**, I want **to share event photos in the group**, so that **we can celebrate our activities together**.

- Photo upload to group feed
- Photo gallery view (grid layout)
- Photo comments & likes
- Photo moderation (admins can delete)
- **Story Points:** 3 (2-3 dev sessions)

**Story 11.15: Group Discussion Threads**
As a **group member**, I want **to start discussion threads**, so that **we can coordinate activities and share tips**.

- Discussion thread creation
- Threaded comments (reply to posts)
- Pinned threads (admin feature)
- Thread search & filter
- **Story Points:** 5 (3-4 dev sessions)

**Story 11.16: Group Notifications & Preferences**
As a **group member**, I want **to control which group notifications I receive**, so that **I'm not overwhelmed**.

- Notification preferences per group
- Notification types (new events, announcements, new members)
- Mute group option (stay in group but silence notifications)
- Push notification settings
- **Story Points:** 3 (2-3 dev sessions)

**Story 11.17: Group Analytics Dashboard (Admin)**
As a **group admin**, I want **to see group engagement metrics**, so that **I can understand group health and growth**.

- Member count over time (line chart)
- Event participation rate (% members attending)
- Active members (posted/commented in last 30 days)
- Growth metrics (new joins, churn rate)
- **Story Points:** 5 (3-4 dev sessions)

**Story 11.18: Group Moderation Tools**
As a **group moderator**, I want **to manage inappropriate content and behavior**, so that **the group remains welcoming**.

- Report post/comment flow
- Moderation queue (flagged content)
- Delete content action
- Ban member flow (with ban duration options)
- Moderation audit log
- **Story Points:** 5 (3-4 dev sessions)

### Phase 2.4: Advanced Features

**Story 11.19: Group Subgroups / Chapters**
As a **large group owner**, I want **to create subgroups for different regions or skill levels**, so that **members can find more relevant activities**.

- Subgroup creation (linked to parent group)
- Subgroup-specific events
- Cross-post to parent group option
- Subgroup member management
- **Story Points:** 5 (3-4 dev sessions) - Optional/Stretch

**Story 11.20: Group Event Series / Recurring Events**
As a **group admin**, I want **to create recurring event series**, so that **I don't have to manually create weekly/monthly events**.

- Recurring event pattern (weekly, monthly, custom)
- Series management (edit all vs single instance)
- Series cancellation handling
- Attendance tracking across series
- **Story Points:** 5 (3-4 dev sessions)

**Story 11.21: Group Co-Hosting (Multi-Admin Events)**
As a **group admin**, I want **to co-host events with other groups**, so that **we can cross-promote activities**.

- Multi-group event linking
- Co-host approval flow
- Event appears in all linked groups
- Split attendance tracking
- **Story Points:** 3 (2-3 dev sessions) - Optional/Stretch

**Story 11.22: Group Challenges & Competitions**
As a **group admin**, I want **to create group challenges**, so that **I can motivate members to stay active**.

- Challenge creation (e.g., "Attend 5 events this month")
- Challenge progress tracking
- Leaderboard for challenge participants
- Challenge completion badges
- **Story Points:** 5 (3-4 dev sessions) - Optional/Stretch

**Story 11.23: Group Fundraising / Dues**
As a **group admin**, I want **to collect optional dues or donations**, so that **we can fund group activities**.

- Dues collection flow (optional membership fee)
- Fundraising campaigns (group goal tracking)
- Payment integration (Stripe)
- Transparency dashboard (how funds are used)
- **Story Points:** 8 (4-5 dev sessions) - Optional/Stretch

**Story 11.24: Group Merchandise / Swag**
As a **group member**, I want **to purchase group-branded merchandise**, so that **I can represent my community**.

- Merchandise catalog (t-shirts, water bottles, etc.)
- Group admin can configure available items
- Order placement & fulfillment integration
- Revenue sharing with group
- **Story Points:** 8 (4-5 dev sessions) - Optional/Stretch

**Story 11.25: Group Export & Portability**
As a **group owner**, I want **to export group data**, so that **I have backup and portability**.

- Export member list (CSV)
- Export event history (CSV)
- Export discussion threads (JSON)
- GDPR compliance (data portability)
- **Story Points:** 3 (2-3 dev sessions)

Exit Criteria:

- Users can create and join public/private groups
- Group admins can create member-only events
- Group feed supports announcements and discussions
- Group discovery enables finding relevant communities
- Group analytics show engagement metrics
- 80% of active users have joined at least one group
- Group event RSVP rate ≥ individual event rate + 15%

**Dependencies:**

- **Builds on:** Epic 1 (Auth, Profiles), Epic 2 (Events, RSVP), Epic 3 (XP, Badges), Epic 4 (Social Interactions)
- **Enables:** Community-driven growth, recurring engagement, local chapter model

**Business Value:**

- Increase user retention through community belonging
- Drive recurring event participation (group events > one-off events)
- Enable grassroots community building (local chapters)
- Create network effects (members invite friends to groups)
- Potential monetization (group subscriptions, merchandise)

**Risks:**

- Group moderation overhead (toxic communities, spam)
- Group abandonment (inactive groups clutter discovery)
- Split focus (users prioritize groups over platform-wide events)
- Technical complexity (group permissions, nested data structures)

**Assumptions:**

- Backend group APIs need to be built (not part of current backend scope)
- Groups are optional (users can engage without joining groups)
- Group owners are responsible for moderation (platform provides tools)
- Groups enhance rather than replace individual event participation

**Open Questions:**

- Should groups support direct messaging between members? (Assumed no, deferred to chat epic)
- Should groups have their own currency/credits? (Assumed no, use platform XP only)
- Should groups be able to charge membership fees from launch? (Assumed optional/stretch goal)
- Maximum group size limits? (Assumed 500 members MVP, scalable later)

---

## Deferred Phase 3 Epics (Not in current delivery)

- Competitive Performance Layer Expansion (post-gating metrics)
- Sponsorship & Local Rewards Integration
- Advanced Analytics Dashboard for Hosts
- ML Partner Matching Service
- Group Direct Messaging & Chat

## Risk & Dependency Notes

- Epic 2 deposit refund latency critical path for habit mechanics (couples with Epic 3 XP delivery reliability).
- Epic 5 notification infrastructure dependency for streak risk (Epic 3) and ETA handling (Journey 2).
- Epic 7 schema decisions must not require future migration for ML fields.
- Growth gating (Epic 6) depends on foundational reliability metrics from Epic 2 + basic quest retention from Epic 3/4 for k-factor interpretation.

## Metrics Alignment Matrix (Excerpt)

| Epic | Primary KPI Influence               | Supporting Metrics                           |
| ---- | ----------------------------------- | -------------------------------------------- |
| 1    | Activation Funnel Completion        | Time to profile completion                   |
| 2    | RSVP→Check-In Conversion            | Deposit refund latency, No-show rate         |
| 3    | Streak Retention                    | Badge unlock rate, XP distribution           |
| 4    | Partner Diversity                   | Quest completion rate, Kudos activity        |
| 5    | Notification Opt-In Health          | Late ETA resolution time                     |
| 6    | Reliability Stability During Growth | Invite utilization %, Wave promotion success |
| 7    | Partner Suggestion Acceptance       | Social mixing uplift, Suggestion CTR         |
| 8    | Community Health                    | Flag resolution SLA, Abuse rate              |
| 9    | Privacy Setting Adoption            | Private event fill rate                      |

## Next Actions

1. Review sequencing for logical dependencies and potential parallelization.
2. Confirm story count ranges vs team velocity estimates.
3. Identify earliest meaningful pilot milestone (end of Epics 1–3) for soft launch.
4. Draft story breakdown for Epic 1 (foundation) including infra tasks.
5. Validate instrumentation spec alignment (FR032 events) across epics.

Reply options:

- Accept epic list: `c`
- Edit an epic: `e E#` (e.g., e E3)
- Add new epic: `add epic` with details
- Refine sequencing: `resequence` with proposed order

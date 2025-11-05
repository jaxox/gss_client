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

## Deferred Phase 2 Epics (Not in current delivery)

- Groups & Communities (FR042–FR052)
- Competitive Performance Layer Expansion (post-gating metrics)
- Sponsorship & Local Rewards Integration
- Advanced Analytics Dashboard for Hosts
- ML Partner Matching Service

## Risk & Dependency Notes

- Epic 2 deposit refund latency critical path for habit mechanics (couples with Epic 3 XP delivery reliability).
- Epic 5 notification infrastructure dependency for streak risk (Epic 3) and ETA handling (Journey 2).
- Epic 7 schema decisions must not require future migration for ML fields.
- Growth gating (Epic 6) depends on foundational reliability metrics from Epic 2 + basic quest retention from Epic 3/4 for k-factor interpretation.

## Metrics Alignment Matrix (Excerpt)

| Epic | Primary KPI Influence | Supporting Metrics |
|------|-----------------------|--------------------|
| 1 | Activation Funnel Completion | Time to profile completion |
| 2 | RSVP→Check-In Conversion | Deposit refund latency, No-show rate |
| 3 | Streak Retention | Badge unlock rate, XP distribution |
| 4 | Partner Diversity | Quest completion rate, Kudos activity |
| 5 | Notification Opt-In Health | Late ETA resolution time |
| 6 | Reliability Stability During Growth | Invite utilization %, Wave promotion success |
| 7 | Partner Suggestion Acceptance | Social mixing uplift, Suggestion CTR |
| 8 | Community Health | Flag resolution SLA, Abuse rate |
| 9 | Privacy Setting Adoption | Private event fill rate |

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

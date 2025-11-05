# Product Requirements Document (PRD)

Gamified Social Sports Platform

**Version:** 0.5.0 (In-Progress)
**Last Updated:** 2025-10-23
**Owner:** Product Management (Jay)
**Status:** Draft – Completing Step 6 (Epic List)

---

## 1. Goals

1. Reduce recreational sports no-show rates from 30–40% baseline to <15% through deposit commitments, check-ins, and reliability scoring.
2. Increase habit formation: 40% of new users maintain 3+ session streak in first month; 60% reach Level 3 (10+ events) within 3 months.
3. Strengthen social cohesion: 70% of active users give/receive kudos monthly; users play with ≥5 different partners in first 60 days.
4. Establish dual-layer gamification: Casual achievement layer drives broad engagement; competitive layer unlocks after habit anchoring (≥5 casual events) with ≥25% opt-in.
5. Build foundation for monetization via sponsorships and premium tiers while preserving user trust and transparent value exchange.
6. Validate pilot city market liquidity (SF Bay Area + Seattle backup) achieving ≥80% event fill rate and ≥45% 30-day retention.

## 2. Background Context

Recreational sports communities suffer from unreliable attendance, shallow progression pathways, and fragmented social experiences. Existing solutions (Meetup, WhatsApp groups, Strava) under-serve event reliability and multi-person coordination needs. Growth in pickleball and adult recreational leagues presents a timing window. Platform differentiates via psychology-informed habit loops (streaks, deposits as commitment devices, autonomy-preserving opt-ins), local sponsorship integration (real-world rewards), and a hybrid gamification architecture supporting both casual and competitive motivations without alienating beginners. MVP focuses on pickleball in SF Bay Area (plus Seattle as secondary) using a mobile-first stack (React Native + Spring Boot + PostgreSQL + Redis) with modular monolith architecture primed for service extraction (gamification, payments, notifications, analytics) via defined trigger criteria.

## 3. Functional Requirements

FR001 User registration with email + password and optional social auth.
FR002 User profile includes: display name, avatar, home city, reliability score (private default), level, badges, XP.
FR003 Sport tagging: users can tag participating sports (MVP: pickleball default plus optional tennis placeholder).
FR004 Host role designation (upgrade or during onboarding) with ability to create/manage events.
FR005 Create event: host specifies title, description, location (address + map), date/time, capacity, deposit amount (configurable $0/$5/$10 test arms), visibility (public or private invite-only).
FR006 Browse events: list + map view filtered by date, distance, sport, capacity remaining, deposit requirement.
FR007 RSVP flow: user confirms attendance; if deposit >0, Stripe authorization captured (refundable on check-in).
FR008 QR code generation per event (host side) and scanning (attendee side) to confirm check-in and trigger deposit refund + XP award.
FR009 Manual check-in fallback (host marks attendee present) with audit log (host id, timestamp) – refund + XP processed.
FR010 Reliability score calculation: based on last N (e.g., 10) RSVPs – weight check-ins vs no-shows (private by default; exposed only as badge or aggregated reliability tiers later).
FR011 Attendance reminders: automated push at 48h, 4h, 1h pre-event (user preference configurable).
FR012 Cancellation workflow: user can cancel RSVP pre cut-off (configurable, e.g., 4h); late cancellation counts as no-show for reliability.
FR013 XP system: base points for event attendance, first-time partner, kudos received/given, quest completion. Config table driven for rule tweaks without redeploy.
FR014 Level progression: defined XP thresholds for Levels 1–10 (MVP), awarding visual badge or title on level-up.
FR015 Streak tracking: “3 sessions in 10 days” baseline; push notification when streak at risk (no event attended within 7 days).
FR016 Badge system: 15–20 initial badge definitions (Newcomer, Streak Master, Social Butterfly, Good Sport, Reliable Attendee, Explorer, etc.) with unlock criteria (attendance count, kudos, partner diversity).
FR017 Kudos: post-event ability to send recognition (limit per event to reduce spam; e.g., 5 kudos). Users receive notification and XP bonus (configurable).
FR018 Event recap: host or attendees can upload photos (≤5 per event initially) and add highlights; recap visible to participants.
FR019 Partner history: system records co-attendance pairs; displays “partners played with” list + count; triggers “play with someone new” quest when diversity threshold unmet.
FR020 Quest system: initial set (attend 3 events, play with 5 new partners, bring a friend, complete streak). Visual progress bars and completion notifications.
FR021 Extensible partner suggestion engine: rule-based MVP (e.g., suggest attendees with low mutual play count + similar schedule) with data schema ready for ML scoring later.
FR022 Competitive layer gating: after 5 completed casual events, user receives opt-in prompt; acceptance enables future performance/stat modules (deferred features stubbed).
FR023 Notification preference center: toggle categories (event reminders, streak risk, quest progress, kudos, deposit reminders, competitive unlock availability).
FR024 Deposit refund automation: on confirmed check-in (QR or manual), Stripe refund triggered within target <60s confirmation.
FR025 Private events: host selects private visibility; access via direct invite link/token; excluded from public browse.
FR026 Host dashboard: summary of upcoming events, RSVPs list, attendance stats (check-in %), reliability aggregate summary (anonymized distribution optional).
FR027 Admin moderation tools (basic): flag/report photo or user; admin can remove photo or restrict user (soft-ban) – audit logged.
FR028 Photo moderation: user flag triggers admin review queue; flagged content hidden after threshold (e.g., ≥2 distinct user flags).
FR029 Invite system (growth gating): wave-based activation and invite allocation (initial 5 invites, dynamic adjustments). Basic UI to view remaining invites and send via link.
FR030 Waitlist & scoring: prospective users join waitlist; scoring rubric applied (geography, availability, referral, host potential, diversity) – internal only display for MVP.
FR031 Wave promotion evaluation snapshot: metrics computed (reliability, RSVP→check-in conversion, events/user) logged for audit.
FR032 Instrumentation events emitted for analytics (RSVP, check-in, quest_progress, quest_completed, streak_risk, streak_preserved, invite_sent, invite_redeemed, reliability_updated).
FR033 Weekly email digest (opt-in): summary of past week events attended, current streak status, upcoming RSVPs, newly unlocked badge.
FR034 Edge-case handling: if QR code scan fails (network issue), user can request host manual confirmation with one-tap fallback.
FR035 At-risk streak notification: triggered when 48h remain before streak window expires; includes immediate event suggestions.
FR036 Partner diversity metric: calculates unique partner count over trailing 60 days; quest triggers if <5.
FR037 Privacy defaults: reliability score private; badges public; user can opt to hide level (toggle in profile settings).
FR038 Security & auth: OAuth2/JWT token issuance, refresh token endpoint, password reset flow (email link).
FR039 Rate limiting: per-user for kudos (max 5/event), photo uploads (5/event), invite sends (5/day) – adjustable via config.
FR040 Offline cache: store next 7 days of user RSVPs + event static data + last 10 notifications; read-only when offline.
FR041 Data export (basic GDPR): user can request export (JSON bundle queued) and account deletion (soft-delete with 30-day reversal window).

### (Deferred Phase 2) Group & Community Features

FR042 Group creation & management: Users (with standard or host roles) can create a sport-specific group (e.g., "San Francisco Gay Pickleball") specifying: name, description, sport, visibility (public searchable / private invite-only), and optional location focus (city/zip cluster).
FR043 Membership criteria configuration: Group admins define criteria ranges/sets (skill level range, gender inclusion policy, age range, optional availability windows). System validates criteria (no inverted ranges, acceptable enum values) and stores for matching.
FR044 Group discovery & search: Users can browse/search public groups by keyword, sport, city, criteria match percentage. Private groups excluded unless invited. Search results show summary (name, member count, sport, match score).
FR045 Membership workflow: Users can request to join a group (pending state); group admins can invite, approve, or reject requests. States: invited, pending, approved, rejected, revoked. All transitions audit logged (actor, timestamp, reason optional).
FR046 Recommendation engine (Phase 1 scope): For each user’s primary group (per sport), system periodically generates candidate member suggestions from users not in the group who meet criteria (hard filters) and ranks by diversity contribution (e.g., underrepresented skill bracket) and recent activity. Delivered to admins as a candidate list (≤20 suggestions) with accept/reject actions.
FR047 Primary group designation: User can select exactly one primary group per sport from among approved memberships (if none, primary unset). Changing primary group allowed with cooldown (e.g., 14 days) to stabilize matching; system warns if attempt before cooldown expires.
FR048 Membership limit enforcement: User may belong to at most 3 groups per sport. Attempt to join additional group returns validation error and surfaces current memberships with leave option.
FR049 Group-related notifications: Push + in-app notifications for: invitation received, request approved, request rejected (with optional admin message), recommendation accepted (new member joined), primary group change confirmation, criteria changed (admins only).
FR050 Group activity & retention metrics: System tracks per group: active members (last 30d), average events attended with any group vs primary group, primary group participation ratio (% of user’s group-attached play sessions), join request acceptance rate, churn (members leaving). Metrics accessible to admins via summary dashboard (Phase 2 minimal read-only view).
FR051 Instrumentation events (extension): group_created, group_criteria_updated, group_search_performed, group_join_requested, group_invited, group_join_approved, group_join_rejected, group_primary_set, group_recommendation_served, group_recommendation_accepted, group_member_left, group_activity_session_logged, group_satisfaction_submitted.
FR052 Criteria change re-evaluation: When admin updates membership criteria, recommendation candidate list is invalidated and recomputed within target SLA (<5 minutes) with versioning (criteria_version increment) for traceability.

Note: These features are deferred to Phase 2 to protect MVP focus; numbering reserved now to support early architectural planning (data model & extensibility). Epics and stories for these FRs will be sequenced post-MVP validation.

## 4. Non-Functional Requirements

NFR001 Performance: App cold launch <3s on baseline devices (iPhone 11 / Pixel 5); event list p95 load <1200ms with 50 concurrent events.
NFR002 Availability: ≥95% uptime during peak windows (weekday evenings 5–10pm local, weekends 8am–10pm); graceful degradation (serve cached event list if real-time fails).
NFR003 Scalability: Support 5K MAU and 500 monthly events without architectural rework; clear extraction triggers for gamification, payments, notifications, analytics modules.
NFR004 Security & Privacy: Enforce HTTPS; encrypted storage of sensitive tokens; Stripe handles PCI scope; GDPR/CCPA deletion/export flows functional.
NFR005 Data Integrity: Payment + check-in operations are atomic; idempotency keys used for deposit refund API calls.
NFR006 Observability: Emit structured logs (JSON) and metrics (RSVP conversion %, no-show %, streak retention) to monitoring; alert thresholds defined pre-launch.
NFR007 Accessibility: WCAG 2.1 AA compliance (screen reader labels, high contrast mode, scalable text).
NFR008 Maintainability: Gamification rules (XP, badge thresholds) externally configurable (YAML/DB table) without code change; <1 day turnaround for new badge.
NFR009 Abuse Prevention: Rate limiting + moderation flag queue ensures ≤24h average resolution of flagged content; automatic concealment after threshold met.
NFR010 Extensibility: Partner suggestion schema includes fields (skill_estimate, availability_vector, interaction_count) enabling future ML model integration without migration.

## 5. User Journeys (Draft – Step 4)

Below are 3 primary user journeys for MVP validation. Pending stakeholder review and potential refinement.

### Journey 1: New Player Onboarding → First Event Check-In & Streak Initiation

Primary Actor: New recreational player (pickleball enthusiast)
Preconditions: User installed app; no prior account.
Trigger: User opens app to find local pickleball games.
Main Flow:

1. Launch screen displays concise value prop ("Play reliably. Level up socially.") and CTA to Sign Up.
2. User registers via email/password OR SSO (Google, Facebook, Apple); optional avatar skip; selects home city (SF Bay Area) and confirms sport (pickleball default).
3. System initializes profile (Level 1, 0 XP, blank badge set) and places user on waitlist if wave closed OR activates if wave open.
4. If waitlist: user sees placement status + invite code field (can redeem friend invite). Upon activation, proceeds automatically to event browse.
5. Event list loads (segmented: Recommended near user, Upcoming within 7 days). Performance requirements validated (<1.2s load).
6. User taps an event; sees details (deposit $5 refundable on check-in, capacity 10/12, reliability improvement messaging).
7. User RSVPs; deposit authorization captured via Stripe (pending status shown). RSVP confirmation screen shows QR check-in instructions.
8. Pre-event reminders triggered (48h, 4h, 1h) unless toggled off.
9. At venue, user taps Check-In; camera opens; scans host QR → success animation; deposit refund initiated; XP +50 awarded; streak counter initialized (1/3 sessions).
10. Post-event recap appears after host publishes (photo + participants). User gives 2 kudos → XP +25 per kudos (capped).
11. Home dashboard updates: XP total, Level progress bar, reliability baseline (1 attended / 1 RSVP), quest progress ("Attend 3 events" now 1/3).
Alternate/Edge Cases:
a. QR scan fails (poor lighting) → fallback manual check-in; host marks present; system logs fallback reason.
b. User cancels pre cut-off → deposit voided, reliability remains neutral.
c. Late cancellation or no-show → reliability score penalized; deposit withheld until refund review (if allowed by policy).
Data Events Emitted: user_registered, waitlist_joined (conditional), waitlist_activated, event_rsvp_created, deposit_authorized, check_in_success, deposit_refunded, xp_awarded, quest_progress_updated, kudos_given.
Success Metrics: RSVP→Check-In ≥85%; time_to_first_event ≤7 days; streak_initiated_rate ≥40%; deposit_refund_latency p95 <60s.

### Journey 2: Host Creates Event → Attendance Reliability & Recap Publishing

Primary Actor: Event Host (organizer) – existing activated user with host designation.
Preconditions: Host role enabled; has created ≥1 event previously (returning) or is newly designated.
Trigger: Host seeks to schedule a weekend pickleball session.
Main Flow:

1. Host taps "Create Event"; enters title, description, selects location (auto-suggest + map pin), date/time, capacity (e.g., 12), deposit ($5 test arm), visibility (public).
2. System validates inputs (date future, capacity within sport limits) and saves event; generates unique QR code and optional invite link.
3. Event appears in public browse; push suggestions to nearby users with open reliability-building quests.
4. RSVPs accumulate; host views dashboard: list of attendees, reliability distribution (private aggregated tiers), remaining spots.
5. At event start: Host opens QR code screen for attendee scanning; manual check-in option accessible. System automatically sends push notifications to RSVP'd players who haven't checked in, with quick-reply options: "I'll arrive in 5 / 10 / 15 min" or "Can't make it". User selections update attendance status in real-time on host dashboard.
6. Real-time dashboard updates check-in counts and ETA status from quick-replies; reliability improvement suggestions (e.g., "2 attendees running late – 10 min ETA").
7. Event ends; host uploads 3 photos; adds highlight text; submits recap for participants.
8. System processes recap: notifies attendees (kudos prompt), awards host XP for successful event completion.
9. Host reviews attendance stats: RSVP=12, Check-In=11 (91.7%). Reliability penalties automatically applied to 1 no-show.
Alternate/Edge Cases:
a. Capacity full → waitlist (if enabled future) or disabled RSVPs; host may increase capacity (MVP decision: capacity editable until first check-in).
b. Photo upload fails (network) → queued retry with user notification.
c. Host forgets QR code → manual check-in used; flagged for follow-up reliability confirmation.
Data Events Emitted: event_created, event_published, event_rsvp_list_viewed, check_in_batch_update, recap_published, photo_uploaded, xp_awarded_host, reliability_score_updated.
Success Metrics: Event_fill_rate ≥80%; host_recap_publish_rate ≥60%; average_check_in_rate ≥85%; photo_upload_success_rate ≥95%.

### Journey 3: Quest Completion & Partner Diversity Growth

Primary Actor: Returning Player aiming to expand social circle.
Preconditions: Player attended ≥3 events; quest "Play with 5 new partners" active.
Trigger: User opens app to plan next sessions and progress social quest.
Main Flow:

1. Dashboard shows quest card: "2/5 new partners – Play with 3 more to earn Social Butterfly badge +100 XP." CTA: "Find events with new players".
2. User taps CTA; partner suggestion engine filters events with highest potential unique partner matches (low overlap with past partners).
3. User RSVPs to two suggested events; system records prospective partner diversity delta.
4. At events, user checks in; partner history updates with new co-attendees; quest progress increments (3/5 then 5/5).
5. Quest completion screen triggers: animation, badge unlock (Social Butterfly), XP +100; prompts share/rematch suggestions with one of new partners.
6. Post-completion, system surfaces next related quest ("Bring a friend to an event") increasing invite system utilization.
7. Reliability score positively weighted (consistent attendance) – indirectly improves future invite allocation.
Alternate/Edge Cases:
a. Suggested event canceled → system recalculates suggestions; sends push notification.
b. Duplicate partner (already played) erroneously counted → data integrity check corrects quest progress; user receives clarification message.
Data Events Emitted: quest_viewed, partner_suggestion_served, event_rsvp_created, check_in_success, partner_history_updated, quest_completed, badge_unlocked, xp_awarded.
Success Metrics: quest_completion_rate ≥50%; average_unique_partners_first_60d ≥5; suggestion_click_through_rate ≥35%; badge_unlock_retention_uplift (30d) ≥+10% vs non-badge cohort.

---

### Editing Options

- Accept all journeys: reply `c`
- Edit a journey: reply `e J#` (e.g., e J2) with changes
- Request refinement or add new: `add` (specify focus)
- Advanced elicitation loop: reply `elicit journeys`

---

## 6. UX Design Principles

### Core Experience Qualities

1. **Frictionless Participation:** Minimize steps between intent and action. RSVP, check-in, and kudos flows should complete in ≤3 taps. Prioritize speed over data richness in high-frequency interactions.

2. **Psychology-Informed Motivation:** Leverage behavioral loops (streaks, badges, XP) that reinforce autonomy (opt-in competitive layer), mastery (visible progression), and relatedness (partner diversity, kudos). Avoid dark patterns; transparency in reliability scoring and deposit mechanics builds trust.

3. **Inclusive by Default, Aspirational by Choice:** Casual gamification accessible to all skill levels from onboarding. Competitive features gated behind habit formation (≥5 events) to prevent early intimidation. Visual hierarchy de-emphasizes rankings unless opted in.

4. **Real-World Primacy:** Digital experience serves in-person sports participation, not vice versa. Event details, QR check-in, and ETA quick-replies optimize for on-the-go, venue-context usage. Offline cache ensures core functionality without connectivity.

5. **Community Trust & Safety:** Reliability scores private by default; moderation tools accessible; photo flagging transparent. Host dashboard provides actionable insights without exposing individual user data unnecessarily.

### Key Accessibility & Usability Requirements

- **WCAG 2.1 AA Compliance:** Screen reader labels for all interactive elements, high contrast mode, scalable text (dynamic type support).
- **Mobile-First Performance:** Cold launch <3s; event list load <1.2s p95. Touch targets ≥44×44pt. One-handed navigation for core flows.
- **Progressive Disclosure:** Complex features (quest details, partner history, analytics) hidden behind taps to reduce cognitive load on primary screens.
- **Error Recovery:** Clear feedback for failed actions (QR scan, photo upload, payment auth) with one-tap retry or fallback paths.

## 7. Platform & UI Design Goals

### Target Platforms

- **Primary:** iOS (15+) and Android (10+) native mobile apps via React Native
- **Secondary:** Responsive web app (desktop-optimized for host event management, mobile-responsive for event browsing)
- **Device Support Baseline:** iPhone 11 / Pixel 5 and newer

### Core Screens & Navigation

**Primary User Flows:**

1. **Home Dashboard:** XP progress bar, active streak indicator, upcoming RSVPs (next 7 days), featured quests, quick CTA to browse events.
2. **Event Browse:** List + map toggle; filters (date, distance, sport, deposit, capacity). Event cards show: title, location, time, attendee count/capacity, deposit badge, host reliability tier (icon).
3. **Event Detail:** Hero image/map pin, full description, attendee avatars, RSVP CTA with deposit amount (if applicable), check-in QR placeholder (post-RSVP).
4. **Profile:** Level badge, XP total, badges earned (grid), reliability score (private default with toggle), partner count, quest history. Settings link for notification preferences.
5. **Check-In Flow:** QR scanner (camera permissions prompt if first use), success animation with XP award, deposit refund confirmation toast.
6. **Quest Dashboard:** Active quests (progress bars), completed quests (archive), quest detail modal with unlock criteria and reward.
7. **Host Dashboard (Role-Gated):** Event list (upcoming/past), create event FAB, event detail with RSVP list + check-in status + ETA quick-replies, QR code display, recap upload interface.

**Navigation Pattern:**

- Bottom tab bar (5 tabs): Home, Browse, Check-In (center FAB for quick QR scan), Quests, Profile.
- Context-aware: Check-In tab shows "Scan QR" by default; if user has imminent RSVP (within 2h), displays event detail shortcut.
- Host users see additional "My Events" tab replacing Quests (quests accessible via Home or profile overflow).

### Key Interaction Patterns

- **Swipe Actions:** Event cards support swipe-right for quick RSVP (if deposit-free), swipe-left for "Save for later" (future feature stub).
- **Pull-to-Refresh:** Event list and dashboard refresh attendance status and quest progress.
- **Quick-Reply Notifications:** Push notifications with actionable buttons (ETA update, kudos, RSVP confirmation).
- **Modals Over Navigation:** Quest details, badge unlocks, event recaps use bottom-sheet modals to maintain context (avoid full-screen transitions for lightweight content).
- **Progressive Photo Upload:** Recap photo upload shows thumbnail preview immediately; background upload with retry queue if network fails.

### Design Constraints & Guidelines

- **Design System:** Custom component library built on React Native Paper or similar (consistent spacing, typography, color palette).
- **Brand Tone:** Energetic, inclusive, non-competitive (casual layer). Celebratory animations for achievements (confetti on badge unlock, flame icon for streaks).
- **Color Accessibility:** Minimum 4.5:1 contrast ratio for text; color-blind friendly palette (avoid red/green alone for status indicators).
- **Technical UI Constraints:**
  - Support iOS Dynamic Type and Android font scaling.
  - Graceful degradation for older devices (reduce animation complexity).
  - Offline mode: Cached screens display "Offline" banner; interactive elements disabled until reconnect.
- **Browser Support (Web Companion):** Modern evergreen browsers (Chrome, Safari, Firefox, Edge); no IE11 support.

---

### Next Steps

- Accept UX/UI sections: reply `c`
- Edit principles or goals: reply `e ux` or `e ui` with changes
- Request refinement: reply `elicit ux`

Pending Next Step: Upon acceptance, proceed to Epic List (Step 6).

# Epic Technical Specification: Social Interaction & Quests

Date: November 9, 2025
Author: Jay
Epic ID: 4
Status: Draft

---

## Overview

Epic 4 implements post-event social features and structured quest mechanics for the GSS Client, enabling users to give/receive kudos, share event recaps with photos, track play partners, and complete quests that drive engagement and social cohesion. This epic focuses on frontend client implementation (React Native mobile + React web) integrating with existing backend Social and Quest APIs to deliver kudos send/receive flows with rate limiting, event recap photo uploads (≤5 per event) with highlight text, partner history logging and diversity metrics, quest engine with 5-8 initial quest definitions with progress tracking, and completion notifications. The implementation addresses PRD goals of strengthening social connection (70% kudos activity, 5+ different partners in 60 days) and habit formation (50% quest completion rate) while building upon gamification foundations from Epic 3. This epic extends the XP reward system with kudos and quest XP bonuses and provides essential social infrastructure for future partner suggestion features in Epic 7.

## Objectives and Scope

**In Scope:**

- Kudos system UI for post-event peer recognition
- Kudos send/receive flows with 5 kudos per event rate limiting
- Kudos notifications and XP bonuses (+10 XP per kudos)
- Event recap creation UI with photo upload (react-native-image-picker, max 5 photos)
- Event recap display showing photos, highlights, and participant list
- Partner history tracking via check-in events
- Partner list display showing co-attendance counts
- Partner diversity metric calculation (unique partners over 60 days)
- Quest engine with 5-8 initial quest definitions
- Quest progress tracking and real-time updates
- Quest completion animations and notifications
- Social Butterfly quest path (play with 5 new partners)
- Quest card UI on dashboard with progress bars
- Analytics instrumentation for kudos, recaps, partner events, quest progress

**Out of Scope:**

- Advanced notification preferences UI - Epic 5
- Partner suggestion algorithm (rule-based engine) - Epic 7
- Photo moderation dashboard and flagging UI - Epic 8
- Leaderboards and competitive quest variants - Deferred Phase 2
- Group/team quests - Deferred Phase 2
- Sponsor integration for quest rewards - Deferred Phase 2
- Video uploads for event recaps - future enhancement
- Quest sharing to social media - future enhancement

## System Architecture Alignment

This epic implements social and quest components defined in the client architecture, specifically:

- **Social Components:** KudosButton, PartnerAvatar, EventRecap, PartnerList per architecture Component Library
- **Quest Components:** QuestCard, QuestProgress, QuestCompletionModal per architecture
- **Service Layer:** SocialService, QuestService interfaces in shared/services/api/
- **State Management:** Redux Toolkit social/quest slices + TanStack Query for social data caching
- **Mobile Screens:** mobile/src/screens/social/ with RecapScreen, PartnersScreen, QuestsScreen
- **Web Pages:** web/src/pages/social/ with social analytics and moderation tools
- **Native Features:** react-native-image-picker for photo uploads, native image compression
- **Design System:** React Native Paper Card/Button components with Trust & Reliability theme
- **Offline Strategy:** Kudos and recap submissions queued offline, synced on reconnect
- **Analytics Integration:** Firebase Analytics events for kudos_given, recap_created, quest_completed

## Detailed Design

### Services and Modules

| Module             | Responsibility                                 | Inputs                                    | Outputs                           | Owner                                           |
| ------------------ | ---------------------------------------------- | ----------------------------------------- | --------------------------------- | ----------------------------------------------- |
| **SocialService**  | Kudos and event recap CRUD operations          | Kudos requests, recap data, photo uploads | Kudos confirmation, recap objects | shared/services/api/social.service.ts           |
| **PartnerService** | Partner history tracking and diversity metrics | User IDs, event check-ins                 | Partner lists, diversity scores   | shared/services/api/partner.service.ts          |
| **QuestService**   | Quest progress tracking and completion         | Quest IDs, progress updates               | Quest objects, completion status  | shared/services/api/quest.service.ts            |
| **ImageService**   | Photo upload, compression, validation          | Image URIs, quality settings              | Upload URLs, compressed images    | shared/services/image/                          |
| **SocialStore**    | Kudos and recap state management               | Social actions, API responses             | Kudos state, recap cache          | mobile/src/store/social/, web/src/store/social/ |
| **PartnerStore**   | Partner history and diversity state            | Partner actions, check-in events          | Partner lists, diversity metrics  | mobile/src/store/partners/                      |
| **QuestStore**     | Quest progress and completion state            | Quest actions, progress events            | Active quests, completion flags   | mobile/src/store/quests/                        |
| **RecapScreen**    | Event recap creation and viewing UI            | Event data, user interactions             | Photo uploads, highlight text     | mobile/src/screens/social/RecapScreen.tsx       |
| **QuestsScreen**   | Quest dashboard with progress cards            | Quest data, user progress                 | Quest list, progress bars         | mobile/src/screens/quests/QuestsScreen.tsx      |
| **PartnersScreen** | Partner history list and stats                 | Partner data, diversity metrics           | Partner list, diversity display   | mobile/src/screens/social/PartnersScreen.tsx    |

### Data Models and Contracts

\`\`\`typescript
// Kudos Models
interface Kudos {
id: string;
eventId: string;
senderId: string;
sender: User;
receiverId: string;
receiver: User;
message?: string;
createdAt: string;
}

interface KudosStats {
userId: string;
totalGiven: number;
totalReceived: number;
givenThisMonth: number;
receivedThisMonth: number;
}

// Event Recap Models
interface EventRecap {
id: string;
eventId: string;
event: Event; // Embedded event info
createdBy: string;
creator: User;
highlightText: string;
photos: RecapPhoto[];
participants: User[];
kudosEnabled: boolean;
createdAt: string;
updatedAt: string;
}

interface RecapPhoto {
id: string;
url: string;
thumbnailUrl: string;
uploadedBy: string;
uploadedAt: string;
width: number;
height: number;
sizeBytes: number;
}

// Partner Models
interface Partner {
userId: string;
displayName: string;
avatar?: string;
coAttendanceCount: number;
firstPlayedAt: string;
lastPlayedAt: string;
commonEvents: string[]; // Event IDs
reliabilityScore: number;
}

interface PartnerDiversity {
userId: string;
uniquePartnerCount: number;
calculatedForPeriodDays: number; // 60 days
partners: Partner[];
diversityTier: 'low' | 'medium' | 'high' | 'excellent';
lastCalculatedAt: string;
}

// Quest Models
interface Quest {
id: string;
name: string;
description: string;
category: 'attendance' | 'social' | 'streak' | 'exploration';
iconUrl: string;
xpReward: number;
badgeReward?: string;
requirement: QuestRequirement;
isRepeatable: boolean;
cooldownDays?: number;
}

interface QuestRequirement {
type:
| 'attend_events'
| 'play_with_unique_partners'
| 'give_kudos'
| 'complete_streak'
| 'bring_friend';
target: number;
metadata?: Record<string, any>;
}

interface UserQuest {
questId: string;
quest: Quest;
userId: string;
status: 'active' | 'completed' | 'expired';
progress: number;
target: number;
startedAt: string;
completedAt?: string;
expiresAt?: string;
}

interface QuestProgress {
questId: string;
userId: string;
currentValue: number;
targetValue: number;
percentage: number;
isComplete: boolean;
updatedAt: string;
}
\`\`\`

### APIs and Interfaces

**Backend API Endpoints (Assumed Complete):**

\`\`\`typescript
// Kudos APIs
POST /api/v1/events/:eventId/kudos
Body: { receiverId: string, message?: string }
GET /api/v1/users/:userId/kudos?type=given|received&limit=50
GET /api/v1/events/:eventId/kudos
DELETE /api/v1/kudos/:kudosId

// Event Recap APIs
POST /api/v1/events/:eventId/recap
Body: { highlightText: string, photoIds: string[] }
GET /api/v1/events/:eventId/recap
PUT /api/v1/recaps/:recapId
DELETE /api/v1/recaps/:recapId
POST /api/v1/recaps/:recapId/photos
Body: FormData with image file
DELETE /api/v1/recaps/photos/:photoId

// Partner APIs
GET /api/v1/users/:userId/partners?limit=50&sortBy=coAttendanceCount
GET /api/v1/users/:userId/partner-diversity
POST /api/v1/analytics/partner-interaction
Body: { partnerId: string, eventId: string }

// Quest APIs
GET /api/v1/quests?category=all|attendance|social|streak
GET /api/v1/users/:userId/quests?status=active|completed
GET /api/v1/users/:userId/quests/:questId/progress
POST /api/v1/users/:userId/quests/:questId/start
POST /api/v1/users/:userId/quests/:questId/complete
\`\`\`

**Frontend Service Interfaces:**

\`\`\`typescript
// SocialService
interface ISocialService {
sendKudos(eventId: string, receiverId: string, message?: string): Promise<Kudos>;
getKudos(eventId: string): Promise<Kudos[]>;
getUserKudos(userId: string, type: 'given' | 'received', limit?: number): Promise<Kudos[]>;
createRecap(eventId: string, recap: { highlightText: string; photoIds: string[] }): Promise<EventRecap>;
getRecap(eventId: string): Promise<EventRecap | null>;
uploadRecapPhoto(recapId: string, imageUri: string): Promise<RecapPhoto>;
deleteRecapPhoto(photoId: string): Promise<void>;
}

// PartnerService
interface IPartnerService {
getPartners(userId: string, limit?: number): Promise<Partner[]>;
getPartnerDiversity(userId: string): Promise<PartnerDiversity>;
logPartnerInteraction(partnerId: string, eventId: string): Promise<void>;
}

// QuestService
interface IQuestService {
getAvailableQuests(): Promise<Quest[]>;
getUserQuests(userId: string, status?: string): Promise<UserQuest[]>;
getQuestProgress(userId: string, questId: string): Promise<QuestProgress>;
startQuest(userId: string, questId: string): Promise<UserQuest>;
completeQuest(userId: string, questId: string): Promise<{ quest: UserQuest; xpAwarded: number }>;
}
\`\`\`

### Workflows and Sequencing

**Workflow 1: Send Kudos Post-Event**

1. User attends event, checks in successfully
2. Event detail screen shows "Give Kudos" button after check-in
3. User taps button, modal displays participant list (excluding self)
4. User selects recipient(s) from list (max 5 per event via rate limiting)
5. Optional: Add message text (140 char limit)
6. User taps "Send Kudos", optimistic UI update shows sent status
7. SocialService.sendKudos() API call dispatched
8. Backend validates: sender checked in, recipient checked in, rate limit not exceeded
9. On success: Kudos record created, receiver gets notification (+10 XP), sender confirmation
10. Redux state updated with sent kudos, button disabled for that recipient
11. Backend triggers XP award (+10 XP for sender, +10 XP for receiver)

**Workflow 2: Create Event Recap**

1. Host or participant navigates to event detail (post-event)
2. "Create Recap" button visible if no recap exists
3. User taps button, RecapCreationScreen loads
4. User adds highlight text in text area (500 char limit)
5. User taps "Add Photos", image picker opens (react-native-image-picker)
6. User selects 1-5 photos from camera roll
7. Photos compressed locally (max 1920px width, 80% quality, <2MB each)
8. Preview shown with thumbnails, user can remove photos
9. User taps "Publish Recap"
10. ImageService.uploadRecapPhoto() uploads each photo sequentially
11. SocialService.createRecap() called with highlightText and photoIds
12. Backend creates recap record, notifies all event participants
13. Recap appears on event detail screen for all participants
14. Host dashboard shows recap created indicator

**Workflow 3: View Partner History**

1. User navigates to Profile → Partners tab
2. PartnersScreen loads via PartnerService.getPartners()
3. Partner list displays with columns: Avatar, Name, Events Together, Last Played
4. Sort options: Most played, Recent, Alphabetical
5. User taps partner row, navigates to PartnerDetailScreen
6. Detail screen shows: partner profile summary, co-attendance count, mutual events list
7. "Play Again" button suggests upcoming events partner might attend
8. User taps "Play Again", filters event list to show partner's likely events
9. PartnerDiversity widget shows: "Played with X unique partners in last 60 days"
10. Diversity tier badge displayed: 🥉 Low (<3), 🥈 Medium (3-5), 🥇 High (6-10), 💎 Excellent (10+)

**Workflow 4: Quest Progress and Completion**

1. User dashboard shows active quests widget with 3 featured quests
2. User taps quest card, QuestDetailScreen loads
3. Progress bar shows current/target (e.g., "3/5 new partners")
4. Quest description explains requirement and rewards
5. User checks in to event, plays with new partner
6. Backend detects new partner interaction, increments quest progress
7. Real-time update via TanStack Query refetch or WebSocket push
8. Progress bar animates from 3/5 to 4/5
9. When target reached (5/5): Quest completion modal triggers
10. Celebration animation (confetti), XP awarded (+100), badge unlocked (Social Butterfly)
11. Quest marked completed, removed from active list
12. Next related quest suggested: "Bring a Friend to an Event"

## Non-Functional Requirements

### Performance

- **Kudos Send Latency:** <1s from button tap to confirmation (p95)
- **Photo Upload Time:** <5s per photo (1920px, compressed) on 4G connection
- **Recap Load Time:** <2s to display recap with 5 photos (thumbnail load)
- **Partner List Load:** <1s for 50 partners with pagination
- **Quest Progress Update:** <500ms real-time update latency
- **Image Compression:** <2s to compress 5 photos locally before upload

### Security

- **Kudos Authorization:** Sender and receiver must have checked into event
- **Rate Limiting:** Max 5 kudos per user per event, enforced server-side
- **Recap Permissions:** Only event participants can view/create recaps
- **Photo Upload Validation:** File type (JPEG/PNG), size (<5MB pre-compression), dimensions
- **Partner Data Privacy:** Partner lists only visible to authenticated user
- **Quest Manipulation Prevention:** Quest progress increments validated server-side

### Reliability/Availability

- **Offline Kudos:** Queued locally, synced on reconnect with retry (exponential backoff)
- **Photo Upload Retry:** Failed uploads retry 3 times with exponential backoff
- **Duplicate Prevention:** Kudos idempotency by (eventId, senderId, receiverId) tuple
- **Quest State Consistency:** Quest progress updates atomic, no partial increments
- **Image Compression Fallback:** If compression fails, upload original with warning
- **Graceful Degradation:** Recap displays without photos if image load fails

### Observability

- **Instrumentation Events:**
  - \`kudos_given\`: eventId, senderId, receiverId, hasMessage
  - \`kudos_received\`: eventId, receiverId, kudosId
  - \`recap_created\`: eventId, creatorId, photoCount, highlightTextLength
  - \`recap_viewed\`: recapId, viewerId
  - \`partner_history_viewed\`: userId, partnerCount
  - \`partner_diversity_calculated\`: userId, uniquePartnerCount, tier
  - \`quest_started\`: userId, questId, questCategory
  - \`quest_progress_updated\`: userId, questId, progress, target
  - \`quest_completed\`: userId, questId, xpAwarded, badgeUnlocked

- **Metrics:**
  - Kudos activity rate: 70% target (users giving/receiving kudos monthly)
  - Recap creation rate: 60% target (events with published recaps)
  - Average photos per recap: 3-5 target
  - Partner diversity distribution: track % users in each tier
  - Quest completion rate: 50% target
  - Quest engagement rate: % users with at least 1 active quest

## Dependencies and Integrations

**Internal Dependencies:**

- Epic 1: Authentication tokens for API requests, user profile data
- Epic 2: Event check-in events trigger partner tracking, recap availability
- Epic 3: XP service integration for kudos and quest XP awards, badge unlock system

**External Dependencies:**

- Backend Social Service: Kudos and event recap APIs
- Backend Partner Service: Partner history tracking and diversity calculation
- Backend Quest Service: Quest definitions, progress tracking, completion validation
- Image Storage: AWS S3 or similar for recap photo uploads
- Firebase Analytics: Event tracking for social and quest metrics
- Push Notifications: Kudos received, quest completed, recap published notifications

**Third-Party SDKs:**

- react-native-image-picker (v7.1.0+): Photo selection from camera/gallery
- react-native-image-resizer (v3.0.7+): Client-side image compression
- react-native-fast-image (v8.6.3+): Optimized image loading with caching
- @tanstack/react-query (v5.90.7+): Quest progress real-time updates

## Acceptance Criteria (Authoritative)

### AC1: Kudos Send/Receive Flow

1. "Give Kudos" button appears on event detail screen after check-in
2. Tap button opens modal with participant list (checked-in users, excluding sender)
3. User can select 1-5 recipients with checkboxes
4. Optional message field (140 char limit) with character counter
5. Send button dispatches kudos to selected recipients
6. Sender sees confirmation toast: "Kudos sent to [Name(s)]"
7. Receivers get push notification: "[Sender] sent you kudos for [Event]"
8. Backend awards +10 XP to sender and each receiver
9. Kudos count displays on event recap: "❤️ 12 kudos given"
10. Rate limit enforced: Max 5 kudos per user per event, button disabled when limit reached
11. Kudos history accessible from Profile → Kudos tab showing given/received tabs

**Validation:** User can send kudos to 5 participants, receives XP, recipients notified

### AC2: Event Recap Photo Upload

1. Event detail screen shows "Create Recap" button for post-event participants
2. Tap button opens RecapCreationScreen with text area and photo picker
3. User enters highlight text (500 char limit, optional)
4. Tap "Add Photos" opens image picker (camera or gallery)
5. User can select 1-5 photos
6. Selected photos display as thumbnails with remove (X) button
7. Photos compressed locally: max 1920px width, 80% quality, <2MB target
8. Tap "Publish Recap" uploads photos sequentially with progress indicator
9. Recap created with photoIds and highlightText via API
10. All event participants notified: "[Host/User] shared an event recap"
11. Recap displays on event detail with photo grid (1-2 cols) and highlight text
12. Photos tap to open full-screen gallery with swipe navigation
13. Host can edit/delete recap within 24 hours of creation

**Validation:** User uploads 5 photos, recap published, participants can view full-screen gallery

### AC3: Partner History Tracking and Display

1. Partner tracking triggers automatically on check-in (backend logs co-attendance)
2. Profile → Partners tab displays partner list sorted by co-attendance count
3. Each partner row shows: Avatar, Name, "Played X times", Last played date
4. Partner list loads via PartnerService.getPartners() with pagination (50/page)
5. Tap partner row opens PartnerDetailScreen with full history
6. Detail screen shows: co-attendance count, first/last played dates, reliability score
7. "Mutual Events" section lists events attended together with dates
8. "Play Again" button suggests upcoming events (filtered by sport/location overlap)
9. Partner diversity widget on dashboard: "Played with X unique partners (last 60 days)"
10. Diversity tier badge: 🥉 Low (<3), 🥈 Medium (3-5), 🥇 High (6-10), 💎 Excellent (10+)

**Validation:** After 3 events with different partners, partner list shows all 3 with correct counts

### AC4: Quest Engine with Progress Tracking

1. Dashboard displays "Active Quests" widget with 3 featured quest cards
2. Each quest card shows: icon, name, progress bar, current/target, XP reward
3. Tap quest card opens QuestDetailScreen with full description and requirements
4. "Start Quest" button available for new quests (backend activation)
5. Quest progress updates automatically when criteria met (check-in, kudos, partner)
6. Progress bar animates smoothly from current to new value (<500ms)
7. Real-time updates via TanStack Query refetch or push notifications
8. When quest completed: Celebration modal triggers with confetti animation
9. Completion modal shows: Quest icon, "Quest Complete!", XP awarded (+100), badge unlocked
10. Completed quests moved to "Completed" tab with completion date
11. Quest categories: Attendance, Social, Streak, Exploration

**Validation:** Complete "Attend 3 Events" quest, see progress update after each check-in, completion modal triggers

### AC5: Initial Quest Definitions (5-8 Quests)

1. **Attend 3 Events** - Attendance category, +100 XP, target 3 check-ins
2. **Play with 5 New Partners** - Social category, +100 XP, Social Butterfly badge, target 5 unique partners
3. **Give 10 Kudos** - Social category, +50 XP, Good Sport badge, target 10 kudos given
4. **Complete a 3-Day Streak** - Streak category, +75 XP, Streak Starter badge, target 3 consecutive days
5. **Bring a Friend** - Social category, +150 XP, Connector badge, target 1 referral signup + attend event together
6. **Attend 5 Different Venues** - Exploration category, +100 XP, Explorer badge, target 5 unique locations
7. **Try 3 Sports** - Exploration category, +75 XP, Sport Sampler badge, target 3 different sports
8. **Reach Level 5** - Achievement category, +50 XP, Rookie badge, target Level 5 via XP accumulation

**Validation:** All 8 quests visible in quests list, requirements and rewards display correctly

### AC6: Social Butterfly Quest Path Integration

1. Social Butterfly quest: "Play with 5 New Partners" active by default for new users
2. Quest progress tracked via partner diversity calculation (60-day window)
3. Each check-in triggers partner history update, quest progress check
4. Progress updates: 0/5 → 1/5 → 2/5 → ... → 5/5
5. Quest detail screen shows partner list with new/returning indicator
6. When 5 unique partners reached: Quest completion triggered
7. Social Butterfly badge (🦋) unlocked and displayed in badge gallery
8. +100 XP awarded, level progress updated
9. Next related quest suggested: "Play with 10 Different Partners" (advanced tier)
10. Quest completion notification sent: "You've completed Social Butterfly quest! 🦋"

**Validation:** Play with 5 new partners across 5 events, quest completes, badge unlocks, next quest suggested

## Traceability Mapping

| Acceptance Criteria | PRD Functional Requirements                | User Journeys      | Architecture Components         | Stories       |
| ------------------- | ------------------------------------------ | ------------------ | ------------------------------- | ------------- |
| AC1                 | FR017 (Kudos System)                       | Journey 3 (social) | KudosButton, SocialService      | 4-1           |
| AC2                 | FR018 (Event Recap)                        | Journey 2 (recap)  | RecapScreen, ImageService       | 4-2, 4-3      |
| AC3                 | FR019 (Partner History), FR036 (Diversity) | Journey 3          | PartnersScreen, PartnerService  | 4-4, 4-5      |
| AC4                 | FR020 (Quest System)                       | Journey 3          | QuestsScreen, QuestService      | 4-6, 4-7, 4-8 |
| AC5                 | FR020 (Quest Definitions)                  | Journey 3          | Quest data models               | 4-6           |
| AC6                 | FR020, FR036 (Social Butterfly)            | Journey 3          | QuestProgress, PartnerDiversity | 4-9           |

**Story Breakdown (Estimated 16-20 stories):**

- Story 4-1: Kudos Send/Receive Flow (AC1)
- Story 4-2: Event Recap Photo Upload (AC2)
- Story 4-3: Event Recap Highlight Text and Display (AC2)
- Story 4-4: Partner History Logging (AC3)
- Story 4-5: Partner Diversity Metric Calculation and Display (AC3)
- Story 4-6: Quest Engine Foundation and Quest Data Models (AC4, AC5)
- Story 4-7: Quest Progress Bars and Real-Time Updates (AC4)
- Story 4-8: Quest Completion Notifications and Animations (AC4)
- Story 4-9: Social Butterfly Quest Path Implementation (AC6)
- Story 4-10: Kudos History and Stats Display
- Story 4-11: Event Recap Editing and Deletion
- Story 4-12: Partner Detail Screen with Mutual Events
- Story 4-13: Quest Category Filtering and Search
- Story 4-14: Recap Photo Full-Screen Gallery
- Story 4-15: Partner "Play Again" Suggestions
- Story 4-16: Quest Achievement Sharing (optional)

## Risks, Assumptions, Open Questions

**Risks:**

- Photo upload failures on poor network connections (mitigate: retry logic, offline queue)
- Image compression quality variance across devices (mitigate: test on device matrix)
- Quest progress data inconsistency if multiple sources update simultaneously (mitigate: atomic updates)
- Kudos spam if rate limiting bypassed (mitigate: server-side validation, abuse detection)
- Partner diversity calculation performance with large event history (mitigate: 60-day window, caching)

**Assumptions:**

- Backend Social, Partner, and Quest APIs are complete and tested
- Image storage (S3) has sufficient capacity and bandwidth for photo uploads
- Users grant camera/photo library permissions for recap photo uploads
- Firebase Analytics can handle increased event volume from social/quest instrumentation
- Quest definitions stored in backend database, not hardcoded in client

**Open Questions:**

- Should quest progress updates use WebSocket real-time push or polling with TanStack Query?
- What is the photo retention policy? Delete after event deletion or permanent storage?
- Should partner diversity tier thresholds be configurable via client-config endpoint?
- How should conflicting recap edits be resolved if multiple users edit simultaneously?
- Should kudos message content be moderated? If so, what is the moderation flow?

## Test Strategy Summary

**Unit Tests (70%):**

- SocialService: sendKudos, createRecap, uploadPhoto, rate limiting validation
- PartnerService: getPartners, calculateDiversity, tier assignment logic
- QuestService: getQuests, trackProgress, completeQuest, requirement validation
- Image utilities: compression, validation, size calculation
- Redux stores: kudos state, recap state, partner state, quest progress state

**Integration Tests (20%):**

- Kudos flow: send kudos → API call → XP update → notification → state update
- Recap creation: select photos → compress → upload → create recap → display
- Partner tracking: check-in → partner log → diversity calculation → UI update
- Quest completion: progress increment → target reached → completion modal → XP award

**E2E Tests (10%):**

- User sends kudos to 3 participants → all receive notifications and XP
- User creates recap with 5 photos → recap published, participants can view full-screen
- User plays with 5 new partners → Social Butterfly quest completes → badge unlocks
- User views partner history → tap partner → see mutual events → tap Play Again

**Coverage Targets:**

- Unit tests: 80% line coverage
- Integration tests: All 6 AC scenarios validated
- E2E tests: Critical paths (kudos, recap, quest completion) verified

**Testing Tools:**

- Jest + React Native Testing Library for unit/component tests
- Detox for E2E mobile testing
- Mock Service Worker (MSW) for API mocking
- Firebase Test Lab for device testing (iOS/Android)

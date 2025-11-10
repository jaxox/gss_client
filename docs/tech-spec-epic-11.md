# Frontend Technical Specification: Groups & Communities

**Epic 11: Groups & Communities**

_Generated: November 9, 2025_  
_Project: gss_client (Frontend Implementation)_  
_Version: 1.0_  
_Status: Backlog (Phase 2)_

---

## Overview

This technical specification defines the **frontend implementation** for Epic 11 (Groups & Communities), enabling users to create, join, and manage interest-based communities that foster recurring participation and deeper social connections. This epic represents a **Phase 2 feature expansion** building on the social foundation established in Epics 1-4.

**Context:** This is a **frontend + backend collaborative epic**. Backend group APIs must be built in parallel (group CRUD, membership management, group events). This document focuses on frontend React Native (mobile) and React (web) implementation, consuming backend group APIs and integrating group features into existing event, profile, and social flows.

**Key Functional Requirements:** FR042-FR052 (assumed Phase 2 requirements for groups/communities)

**Problem Statement:** Users lack structured ways to form recurring communities around shared interests. Current platform supports one-off event attendance but doesn't foster long-term group belonging. Users want to find "their people" and participate in regular activities with consistent social groups. Epic 11 solves this through group creation, discovery, member management, group events, and group communication features.

**Goals:**

- Enable users to create interest-based groups (running clubs, cycling groups, yoga communities)
- Provide group discovery and recommendation mechanisms
- Implement group membership flows (join, invite, approve)
- Support group-specific events (member-only or open to platform)
- Build group communication features (feed, announcements, discussions)
- Offer group admin tools (moderation, analytics, role management)
- Drive recurring participation through community belonging

**User-Facing Features:**

1. **Group Creation (Mobile + Web):** Create group with name, description, category, avatar
2. **Group Discovery (Mobile + Web):** Browse, search, and discover groups by category/location
3. **Group Membership (Mobile + Web):** Join groups, accept/reject join requests, invite members
4. **Group Profile (Mobile + Web):** View group details, members, events, feed
5. **Group Events (Mobile + Web):** Create member-only or open events linked to groups
6. **Group Feed (Mobile + Web):** Announcements, discussions, photo sharing within groups
7. **Group Admin Dashboard (Web):** Manage members, view analytics, moderate content
8. **Group Notifications (Mobile):** New events, announcements, membership updates

**Out of Scope (Deferred):**

- Group direct messaging/chat (deferred to Epic 12: Chat & Messaging)
- Group fundraising/dues collection (optional stretch goal)
- Group merchandise/swag store (optional stretch goal)
- Group subgroups/chapters (optional stretch goal)
- Group challenges/competitions (deferred to Epic 13: Gamification Expansion)

---

## Objectives and Scope

### In Scope

**Mobile (React Native):**

1. **Group Creation Flow:**
   - Group creation form (name, description, category dropdown, avatar upload)
   - Privacy toggle (Public vs Private)
   - Membership approval mode (Auto-approve vs Manual-approve)
   - Group preview before publishing
   - Success confirmation with link to group profile

2. **Group Discovery & Browse:**
   - "Groups" tab in main navigation
   - Browse groups page (grid layout with group cards)
   - Category filters (Running, Cycling, Yoga, Basketball, etc.)
   - Location-based search (groups near me within X miles)
   - Search bar (search by group name/keyword)
   - Sorting options (Popular, Newest, Nearby)

3. **Group Profile:**
   - Group header (avatar, name, description, member count)
   - Tabs: About, Events, Members, Feed
   - Join/Leave group button
   - Admin actions menu (Edit, Manage Members, Settings - admin only)
   - Share group link action

4. **Group Membership Management:**
   - Join group flow (instant for public, request for private)
   - Join request submission (with optional message)
   - Pending requests list (for admins)
   - Accept/reject request actions
   - Invite member flow (search users, send invites)
   - Leave group confirmation dialog
   - Remove member action (admin only)

5. **Group Events:**
   - "Create Event" button on group profile (admins only)
   - Event creation with group link (badge: "Group Event")
   - Member-only vs open event toggle
   - Group events list (upcoming and past)
   - Event RSVP from group context
   - Group members auto-notified of new events

6. **Group Feed:**
   - Feed tab on group profile
   - Announcement posts (admins only, highlighted)
   - Discussion posts (all members)
   - Photo posts with caption
   - Like and comment on posts
   - Post creation form (text, photo, event link)
   - Infinite scroll pagination

7. **Group Settings (Admin):**
   - Edit group profile (name, description, avatar)
   - Privacy settings (public/private toggle)
   - Membership approval mode toggle
   - Member list visibility toggle
   - Delete group (with confirmation)

8. **Group Notifications:**
   - Push notification: New group event created
   - Push notification: Join request received (admin)
   - Push notification: Join request approved/rejected
   - Push notification: New group announcement
   - Notification preferences per group (mute option)

**Web (React + Vite):**

1. **Group Discovery Page:**
   - Hero section: "Find Your Community"
   - Featured groups carousel
   - Browse groups with grid layout
   - Advanced filters sidebar (category, location, size, activity level)
   - Search with autocomplete
   - Pagination (20 groups per page)

2. **Group Profile Page:**
   - Full-width header with cover photo (optional)
   - Group stats (members, events, founded date)
   - Tabs: About, Events, Members, Feed, Analytics (admin)
   - Join/request to join button
   - Share buttons (Copy Link, Facebook, Twitter)

3. **Group Admin Dashboard (Web-Only):**
   - Analytics tab on group profile (admin only)
   - Member growth chart (line graph)
   - Event participation metrics (avg RSVPs per event)
   - Active members count (posted/commented in last 30 days)
   - Pending join requests queue
   - Member management table (search, filter by role, remove)

4. **Group Event Management:**
   - Bulk event creation (create series of recurring events)
   - Event templates (save event config for reuse)
   - Co-host feature (invite other groups to co-host)
   - Event analytics (RSVP conversion, attendance rate)

5. **Group Moderation Tools:**
   - Flagged content queue (reported posts/comments)
   - Moderation actions (delete post, ban member)
   - Audit log (all admin actions logged)
   - Ban list management

### Out of Scope

- Group direct messaging (deferred to chat epic)
- Group video calls/conferencing (deferred)
- Group fundraising/payments (stretch goal)
- Group merchandise store (stretch goal)
- Group subgroups/chapters (stretch goal)
- Multi-language group descriptions (Phase 3)
- Group verification badges (Phase 3)

---

## System Architecture Alignment

### Mobile Architecture

**Screens:**

- `GroupsHomeScreen.tsx` (Browse/discover groups)
- `GroupProfileScreen.tsx` (Group detail with tabs)
- `CreateGroupScreen.tsx` (Group creation form)
- `GroupMembersScreen.tsx` (Member list with actions)
- `GroupSettingsScreen.tsx` (Admin settings)
- `GroupFeedScreen.tsx` (Group feed/discussions)
- `GroupEventsScreen.tsx` (Group events list)

**Components:**

- `GroupCard.tsx` (Group preview card in browse)
- `GroupHeader.tsx` (Group profile header)
- `GroupStatsBar.tsx` (Member count, event count)
- `GroupMemberItem.tsx` (Member row with role badge)
- `GroupPostCard.tsx` (Feed post with actions)
- `JoinGroupButton.tsx` (Join/request/leave states)
- `GroupInviteModal.tsx` (Invite members modal)

**Services:**

- `GroupService.ts` (API calls: CRUD, membership)
- `GroupFeedService.ts` (Feed posts API)
- `GroupEventService.ts` (Group event operations)
- `GroupModerationService.ts` (Admin/moderation actions)

**Redux Slices:**

- `groups.slice.ts` (Group list, current group, user's groups)
- `groupMembers.slice.ts` (Member list, roles, pending requests)
- `groupFeed.slice.ts` (Feed posts, pagination)
- `groupEvents.slice.ts` (Group events list)

**Hooks:**

- `useGroup(groupId)` (Fetch and cache group data)
- `useGroupMembers(groupId)` (Fetch members with pagination)
- `useGroupFeed(groupId)` (Fetch feed posts with infinite scroll)
- `useJoinGroup()` (Join/leave group mutations)
- `useGroupPermissions(groupId)` (Check user's role/permissions)

### Web Architecture

**Pages:**

- `GroupsPage.tsx` (Browse groups with filters)
- `GroupProfilePage.tsx` (Group detail with tabs)
- `CreateGroupPage.tsx` (Group creation wizard)
- `GroupSettingsPage.tsx` (Admin settings)
- `GroupAnalyticsPage.tsx` (Admin analytics dashboard)

**Components:**

- `GroupCardGrid.tsx` (Grid of group cards)
- `GroupFilterSidebar.tsx` (Category/location filters)
- `GroupAboutTab.tsx` (Group description and info)
- `GroupEventsTab.tsx` (Event list with calendar)
- `GroupMembersTab.tsx` (Member grid with search)
- `GroupFeedTab.tsx` (Feed with post composer)
- `GroupAnalyticsTab.tsx` (Charts and metrics)
- `GroupModerationPanel.tsx` (Flagged content queue)

### Shared Architecture

**Data Models (TypeScript):**

```typescript
interface Group {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  avatarUrl: string;
  coverPhotoUrl?: string;
  privacy: 'public' | 'private';
  membershipApprovalMode: 'auto' | 'manual';
  memberCount: number;
  eventCount: number;
  foundedDate: string; // ISO 8601
  location?: {
    city: string;
    state: string;
    country: string;
  };
  owner: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  stats: {
    activeMembers: number; // last 30 days
    avgEventAttendance: number;
  };
  createdAt: string;
  updatedAt: string;
}

enum GroupCategory {
  RUNNING = 'running',
  CYCLING = 'cycling',
  YOGA = 'yoga',
  BASKETBALL = 'basketball',
  SOCCER = 'soccer',
  TENNIS = 'tennis',
  HIKING = 'hiking',
  FITNESS = 'fitness',
  OTHER = 'other',
}

interface GroupMember {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    level: number;
  };
  groupId: string;
  role: GroupRole;
  joinedAt: string;
  status: 'active' | 'pending' | 'banned';
}

enum GroupRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}

interface GroupJoinRequest {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  groupId: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    role: GroupRole;
  };
  type: 'announcement' | 'discussion' | 'photo';
  content: string;
  photoUrls?: string[];
  eventId?: string; // if post links to event
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GroupEvent extends Event {
  groupId: string;
  group: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  memberOnly: boolean;
}
```

**API Endpoints (Backend - Assumed):**

```typescript
// Group CRUD
GET    /api/v1/groups?category=X&location=Y&page=1
POST   /api/v1/groups
GET    /api/v1/groups/:groupId
PATCH  /api/v1/groups/:groupId
DELETE /api/v1/groups/:groupId

// Group Membership
POST   /api/v1/groups/:groupId/join          // Join public or request private
POST   /api/v1/groups/:groupId/leave
GET    /api/v1/groups/:groupId/members?page=1
POST   /api/v1/groups/:groupId/members/invite
DELETE /api/v1/groups/:groupId/members/:userId

// Join Requests (Admin)
GET    /api/v1/groups/:groupId/requests?status=pending
POST   /api/v1/groups/:groupId/requests/:requestId/approve
POST   /api/v1/groups/:groupId/requests/:requestId/reject

// Group Feed
GET    /api/v1/groups/:groupId/posts?page=1
POST   /api/v1/groups/:groupId/posts
DELETE /api/v1/groups/:groupId/posts/:postId
POST   /api/v1/groups/:groupId/posts/:postId/like
GET    /api/v1/groups/:groupId/posts/:postId/comments

// Group Events
GET    /api/v1/groups/:groupId/events?upcoming=true
POST   /api/v1/events (with groupId in body)
PATCH  /api/v1/events/:eventId (update group link)

// Group Analytics (Admin)
GET    /api/v1/groups/:groupId/analytics

// My Groups
GET    /api/v1/users/me/groups?role=member
```

---

## Detailed Design

### Workflows and Sequencing

**Workflow 1: Create a Group (Mobile)**

1. User taps "Create Group" button (on Groups tab or profile)
2. Navigate to `CreateGroupScreen`
3. Form fields:
   - Group name (text input, max 50 chars)
   - Description (textarea, max 500 chars)
   - Category (dropdown: Running, Cycling, Yoga, etc.)
   - Avatar (photo picker, crop to square)
   - Privacy toggle: Public (anyone can join) vs Private (approval required)
   - Membership approval: Auto-approve vs Manual-approve (for public groups)
4. Validation:
   - Name required (min 3 chars)
   - Description required (min 20 chars)
   - Category required
   - Avatar required
5. Tap "Create Group" button
6. API call: POST /api/v1/groups with group data
7. Loading state (spinner on button)
8. Success:
   - Navigate to newly created group profile
   - Show success toast: "Group created! Start inviting members."
   - User automatically added as Owner
9. Failure: Show error toast with message

**Workflow 2: Discover and Join a Group (Mobile)**

1. User opens "Groups" tab in main navigation
2. `GroupsHomeScreen` displays:
   - Search bar at top
   - Category filter chips (All, Running, Cycling, etc.)
   - "Near Me" filter toggle
   - Grid of group cards (2 columns)
3. User taps category filter (e.g., "Running")
4. API call: GET /api/v1/groups?category=running&location=userLocation
5. Group cards display:
   - Group avatar
   - Group name
   - Member count
   - Distance (if location enabled)
   - Join button (or "Requested" if pending)
6. User taps a group card
7. Navigate to `GroupProfileScreen`
8. Profile displays:
   - Header (avatar, name, description)
   - Stats bar (X members, Y events)
   - Tabs: About, Events, Members, Feed
   - Join button (prominent, primary color)
9. User taps "Join Group"
10. If public group:
    - API call: POST /api/v1/groups/:groupId/join
    - Success: Button changes to "Joined" (checkmark), show toast
    - User added as Member role
11. If private group:
    - Show modal: "Request to Join [Group Name]"
    - Optional message field: "Tell the admins why you want to join"
    - Tap "Send Request"
    - API call: POST /api/v1/groups/:groupId/join (creates join request)
    - Success: Button changes to "Requested", show toast
    - Admins notified via push notification

**Workflow 3: Group Admin Approves Join Request (Mobile)**

1. Admin receives push notification: "[User Name] wants to join [Group Name]"
2. Tap notification → opens `GroupProfileScreen` on Members tab
3. "Pending Requests" section at top (badge showing count)
4. Tap "View Pending Requests"
5. List of join requests (user avatar, name, optional message, date)
6. Admin taps on a request row
7. Modal displays:
   - User profile preview (avatar, name, level, reliability score)
   - Request message (if provided)
   - Actions: "Approve" (green) and "Reject" (red)
8. Admin taps "Approve"
9. API call: POST /api/v1/groups/:groupId/requests/:requestId/approve
10. Success:
    - Request removed from pending list
    - User added to members list
    - User receives push notification: "You've been accepted to [Group Name]!"
11. Admin taps "Reject"
12. API call: POST /api/v1/groups/:groupId/requests/:requestId/reject
13. Success:
    - Request removed from pending list
    - User receives push notification: "Your request to join [Group Name] was not approved."

**Workflow 4: Create Group Event (Mobile)**

1. Group admin opens group profile
2. Navigate to Events tab
3. Tap "Create Event" button (FAB, admin only)
4. Navigate to event creation screen (same as regular event)
5. **Group-specific fields:**
   - Group link: Pre-filled with current group (read-only)
   - Member-only toggle: "Restrict to [Group Name] members" (default: ON)
6. Fill event details (title, date, time, location, sport, capacity, etc.)
7. Tap "Create Event"
8. API call: POST /api/v1/events with groupId and memberOnly flag
9. Success:
   - Event appears in group events list
   - Event card has "Group Event" badge
   - If memberOnly = false, event also appears in public browse
   - **All group members receive push notification:** "[Group Name] has a new event: [Event Title]"
10. Navigate to event detail screen

**Workflow 5: Group Feed - Post Announcement (Mobile)**

1. Group admin opens group profile
2. Navigate to Feed tab
3. Tap "+" FAB (post composer)
4. Composer modal:
   - Post type selector: Announcement (admin only) vs Discussion (all)
   - Text input (max 1000 chars)
   - Photo attachment (optional, up to 3 photos)
   - Event link (optional, search group events)
5. Admin selects "Announcement" type
6. Writes message: "Reminder: Group run this Saturday at 7 AM!"
7. Taps "Post"
8. API call: POST /api/v1/groups/:groupId/posts with type=announcement
9. Success:
   - Post appears at top of feed (highlighted with banner)
   - Push notification sent to all group members (respecting notification preferences)
10. Other members can like and comment (but not delete)

**Workflow 6: Group Discovery - Search and Filter (Web)**

1. User navigates to /groups (Groups page)
2. Page displays:
   - Hero section with search bar
   - Filter sidebar (Category, Location, Size, Activity Level)
   - Featured groups carousel
   - Group grid (3 columns on desktop)
3. User enters search query: "cycling"
4. As user types, autocomplete dropdown shows group name matches
5. User selects location filter: "Within 25 miles"
6. System uses user's current location (or profile location)
7. User selects category filter: "Cycling"
8. URL updates: /groups?q=cycling&category=cycling&radius=25
9. API call: GET /api/v1/groups?q=cycling&category=cycling&location=userLocation&radius=25&page=1
10. Group grid updates with matching groups
11. Each group card shows:
    - Avatar
    - Name
    - Member count
    - Distance
    - "2 mutual friends" (if applicable)
    - Preview of recent activity
12. User clicks on a group card
13. Navigate to /groups/:groupId (group profile page)

**Workflow 7: Group Admin Dashboard - View Analytics (Web)**

1. Group admin navigates to group profile: /groups/:groupId
2. Tabs include: About, Events, Members, Feed, **Analytics** (admin only)
3. Admin clicks "Analytics" tab
4. API call: GET /api/v1/groups/:groupId/analytics
5. Page displays:
   - **Member Growth Chart:** Line graph showing member count over time (last 6 months)
   - **Event Participation:** Avg RSVPs per event, attendance rate %
   - **Active Members:** Count of members who posted/commented/RSVPed in last 30 days
   - **Top Contributors:** List of most active members (posts, comments, event attendance)
   - **Growth Metrics:** New joins this month, churn rate %
   - **Engagement Rate:** % members who engage with posts (like/comment)
6. Charts powered by Chart.js or Recharts
7. Export button: "Export as CSV" (downloads analytics data)

---

## Non-Functional Requirements

### Performance

- **Group Browse Load:** <1s to load 20 groups with filters
- **Group Profile Load:** <800ms to load group details and initial feed posts
- **Join Group Action:** <500ms to process join/request
- **Feed Pagination:** <600ms to load next 20 posts
- **Member List Load:** <1s to load 50 members with pagination
- **Search Autocomplete:** <200ms to show results as user types
- **Image Upload (Avatar):** <3s to upload and process group avatar (max 5MB)

### Reliability/Availability

- **Offline Group Browse:** Cache last viewed groups for offline access
- **Join Request Retry:** Retry failed join requests on network restore
- **Feed Post Queue:** Queue posts locally if offline, sync when online
- **Optimistic UI:** Show join/leave actions immediately, rollback on failure
- **Error Recovery:** Handle group deletion gracefully (show "Group no longer exists" message)

### Security

- **Group Privacy Enforcement:** Private groups hidden from non-members in browse
- **Member-Only Events:** Backend validates user is group member before showing event details
- **Admin Action Validation:** All admin actions (remove member, delete post) validated on backend
- **Join Request Rate Limiting:** Max 5 join requests per user per day (prevent spam)
- **Content Moderation:** Flagged posts reviewed before appearing in feed

### Observability

- **Instrumentation Events:**
  - `group_created`: group_id, category, privacy, created_by
  - `group_joined`: group_id, join_type (instant | request_approved), user_id
  - `group_left`: group_id, user_id, member_duration_days
  - `group_event_created`: group_id, event_id, member_only
  - `group_post_created`: group_id, post_id, post_type (announcement | discussion)
  - `group_search`: query, filters, results_count
  - `join_request_submitted`: group_id, user_id
  - `join_request_approved`: group_id, user_id, admin_id
  - `member_removed`: group_id, user_id, removed_by, reason

- **Metrics:**
  - Group creation rate: # groups created per day
  - Join conversion rate: % users who join after viewing group profile
  - Member retention: % members still active after 30/60/90 days
  - Event attendance lift: Group event RSVP rate vs individual event rate
  - Feed engagement: % members who post/comment per week
  - Admin action frequency: # moderation actions per group per week

---

## Dependencies and Integrations

**Internal Dependencies:**

- Epic 1: User authentication (group membership tied to user accounts)
- Epic 2: Events (group events extend event model)
- Epic 3: Badges (potential group-specific badges: "Group Founder", "Super Member")
- Epic 4: Social interactions (kudos, partner history extend to group members)
- Epic 5: Notifications (group notification preferences)

**External Dependencies:**

- Backend Group APIs: All group CRUD, membership, feed endpoints must be built
- Image Upload Service: Group avatar and cover photo storage (S3)
- Push Notification Service: FCM/APNS for group notifications
- Search Infrastructure: Elasticsearch or similar for group search/autocomplete

**Third-Party SDKs:**

- `react-native-image-crop-picker`: Group avatar/cover photo selection
- `@react-navigation/material-top-tabs`: Group profile tabs (About, Events, Members, Feed)
- Chart library (web): `recharts` or `chart.js` for analytics visualizations

---

## Acceptance Criteria (Authoritative)

### AC1: Group Creation

1. User can create a group with required fields: name, description, category, avatar
2. Privacy options: Public (anyone can join) vs Private (approval required)
3. Membership approval mode: Auto-approve vs Manual-approve (for public groups)
4. Group name unique validation (suggest alternatives if taken)
5. Avatar upload with crop-to-square functionality
6. Creator automatically assigned Owner role
7. Group creation success navigates to group profile
8. Validation errors shown inline (e.g., "Name too short", "Description required")
9. Group appears in creator's "My Groups" list immediately
10. Group ID generated and shareable link created

**Validation:** Create 5 groups with different categories and privacy settings. Verify all fields saved, owner role assigned, groups appear in user's groups list.

### AC2: Group Discovery & Browse

1. Groups tab in main navigation (mobile) or /groups page (web)
2. Browse groups with grid layout (2 columns mobile, 3 columns web)
3. Category filter chips: All, Running, Cycling, Yoga, Basketball, etc.
4. Location filter: "Near Me" (within 25 miles) toggle
5. Search bar with autocomplete (matches group names)
6. Sorting options: Popular (by member count), Newest, Nearby
7. Group cards display: avatar, name, member count, distance
8. Pagination: Load 20 groups per page, infinite scroll on mobile
9. Empty state: "No groups found. Create one!"
10. Featured groups section (homepage recommendation algorithm)

**Validation:** Browse groups with different filters. Search for specific group names. Toggle location filter. Verify pagination works. Check empty state displays.

### AC3: Join Group & Membership

1. "Join Group" button on group profile (prominent, primary color)
2. Public groups: Instant join (user becomes Member immediately)
3. Private groups: "Request to Join" flow with optional message
4. Join request creates pending request visible to admins
5. Button states: Join → Joined (with checkmark) | Join → Requested (pending)
6. Leave group flow: Confirmation dialog "Are you sure?"
7. Leave group removes user from member list immediately
8. Re-join allowed (no cooldown period)
9. Owners cannot leave (must transfer ownership first)
10. Join/leave actions logged for analytics

**Validation:** Join 3 public groups instantly. Request to join 2 private groups. Leave 1 group. Verify button states update correctly. Check confirmation dialogs.

### AC4: Group Admin - Approve Join Requests

1. Admins see "Pending Requests" badge on Members tab
2. Pending requests list: user avatar, name, optional message, date
3. Tap request → modal with user profile preview and actions
4. Actions: "Approve" (green) and "Reject" (red)
5. Approve: User added to members, receives push notification
6. Reject: Request removed, user receives notification (polite message)
7. Bulk actions: Select multiple requests, approve/reject all
8. Request expiration: Auto-reject requests older than 30 days
9. Admin action logged in audit log
10. Request count updates in real-time

**Validation:** As admin, approve 3 join requests. Reject 2 requests. Verify users receive notifications. Check member list updates. Test bulk approval.

### AC5: Group Events

1. "Create Event" button on group Events tab (admins only)
2. Event creation pre-fills group link (read-only)
3. "Member-only" toggle (restrict to group members)
4. Event appears in group events list with "Group Event" badge
5. Member-only events hidden from non-members in public browse
6. All group members notified: "[Group Name] has a new event: [Title]"
7. Event RSVP from group context shows group badge
8. Group events list: upcoming and past sections
9. Past events archive (attendance stats visible)
10. Event deletion requires admin permission (or creator)

**Validation:** Create 2 group events (1 member-only, 1 open). Verify notifications sent. Check event appears in group and public browse (if open). RSVP to group event.

### AC6: Group Feed

1. Feed tab on group profile (all members can view)
2. Post types: Announcement (admins only), Discussion (all members)
3. Announcement posts highlighted with banner (e.g., blue background)
4. Post composer: Text input (max 1000 chars), photo attachment (up to 3)
5. Post actions: Like, Comment, Share (copy link)
6. Admin actions: Pin post (sticky at top), Delete post
7. Infinite scroll pagination (load 20 posts at a time)
8. Like count and comment count displayed
9. Tap comment count → open comments modal
10. Empty state: "No posts yet. Start a discussion!"

**Validation:** Post 2 announcements as admin. Post 3 discussions as member. Like and comment on posts. Pin 1 post. Verify infinite scroll works. Check empty state.

### AC7: Group Settings & Admin Tools

1. Settings icon on group profile (admins only)
2. Edit group profile: name, description, category, avatar, cover photo
3. Privacy toggle: Public ↔ Private (affects discoverability)
4. Membership approval mode toggle: Auto ↔ Manual
5. Member list visibility: Public (anyone) vs Members-only
6. Delete group: Confirmation dialog with "Type group name to confirm"
7. Group deletion removes all members, events remain (unlinked from group)
8. Transfer ownership: Search for member, confirm transfer
9. Role management: Promote member to Admin/Moderator
10. Ban member: Remove and prevent rejoining

**Validation:** Edit group profile fields. Toggle privacy and approval settings. Transfer ownership to another member. Promote 2 members to Admin. Ban 1 member. Delete test group.

### AC8: Group Notifications

1. Push notification: "[Group Name] has a new event: [Event Title]"
2. Push notification: "[User] wants to join [Group Name]" (admins)
3. Push notification: "You've been accepted to [Group Name]!"
4. Push notification: "Your join request to [Group Name] was not approved."
5. Push notification: "[Group Name] posted an announcement"
6. Notification preferences: Mute group (stay member but silence notifications)
7. Notification settings per group (new events, announcements, discussions)
8. Deep links: Tap notification → opens group profile or relevant screen
9. Notification badge on Groups tab (unread count)
10. Mark notifications as read on interaction

**Validation:** Create group event, verify all members notified. Submit join request, verify admin notified. Approve request, verify user notified. Mute group, verify no notifications received.

---

## Traceability Mapping

| Acceptance Criteria | PRD Functional Requirements | Architecture Components                               | Stories             |
| ------------------- | --------------------------- | ----------------------------------------------------- | ------------------- |
| AC1                 | FR042 (Group Creation)      | CreateGroupScreen, GroupService, groups.slice         | 11-1                |
| AC2                 | FR043 (Group Discovery)     | GroupsHomeScreen, GroupCard, GroupService             | 11-9                |
| AC3                 | FR044 (Membership)          | JoinGroupButton, GroupService, groupMembers.slice     | 11-2                |
| AC4                 | FR045 (Admin Approval)      | GroupMembersScreen, GroupService                      | 11-2                |
| AC5                 | FR046 (Group Events)        | GroupEventsTab, GroupEventService, EventService       | 11-7, 11-8          |
| AC6                 | FR047 (Group Feed)          | GroupFeedTab, GroupPostCard, GroupFeedService         | 11-13, 11-14, 11-15 |
| AC7                 | FR048 (Admin Tools)         | GroupSettingsScreen, GroupService                     | 11-5, 11-6          |
| AC8                 | FR049 (Notifications)       | PushNotificationService, GroupNotificationPreferences | 11-16               |

**Story Breakdown:** See Epic 11 in epics.md for complete 25-story breakdown

---

## Risks, Assumptions, Open Questions

**Risks:**

- Group moderation overhead (toxic communities, spam groups)
- Group abandonment (inactive groups clutter discovery)
- Backend API development timeline (parallel track required)
- Performance with large groups (1000+ members)
- Content moderation at scale (manual review not scalable)

**Assumptions:**

- Backend group APIs built in parallel with frontend
- Groups are optional (users can engage without joining)
- Group owners responsible for moderation (platform provides tools)
- Max 500 members per group (MVP), scalable later
- No group direct messaging (deferred to chat epic)

**Open Questions:**

- Should groups support video/audio posts in feed? (Assumed no, text/photo only)
- Should groups have their own XP/currency? (Assumed no, use platform XP)
- Maximum number of groups a user can join? (Assumed 20 groups limit)
- Should group creation require minimum user level? (Assumed Level 3+)
- How to handle group ownership transfer when owner abandons app? (Auto-transfer to most active admin after 90 days inactivity)

---

## Test Strategy Summary

**Unit Tests (70%):**

- GroupService API calls (create, join, leave, update)
- GroupFeedService post/comment operations
- Group permission checks (isAdmin, canPost, canModerate)
- Group validation logic (name uniqueness, field requirements)
- Redux slice actions and selectors

**Integration Tests (20%):**

- Group creation → join → post → event flow
- Join request → admin approval → member added
- Group feed pagination and infinite scroll
- Group search and filtering with backend
- Group notifications triggered correctly

**E2E Tests (10%):**

- Complete group lifecycle: Create → invite members → create event → post announcement
- Group discovery: Browse → filter → join → participate
- Admin workflow: Review requests → approve → manage members → view analytics
- Group settings: Update profile → change privacy → transfer ownership → delete group

**Coverage Targets:**

- Unit tests: 80% line coverage
- Integration tests: All 8 AC scenarios validated
- E2E tests: Critical user journeys (create, join, event, feed)

**Testing Tools:**

- Jest + React Native Testing Library (mobile)
- Vitest + React Testing Library (web)
- Detox (mobile E2E)
- Playwright (web E2E)
- MSW (Mock Service Worker) for API mocking

---

**End of Epic 11 Frontend Technical Specification**

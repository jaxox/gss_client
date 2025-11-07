# Story 1.4: Profile CRUD & Avatar Upload

Status: ready-for-dev

## Story

As a **registered user**,
I want **to view and edit my profile information including display name and home city**,
so that **I can keep my account information accurate and personalized** (Note: Avatar upload disabled in MVP for cost control).

## Acceptance Criteria

**AC1: Profile View Screen**

1. Profile screen displays user's current information: display name, email, home city, reliability score (marked as "Private"), level, XP
2. Avatar section shows default placeholder with "Avatar Upload Coming Soon" message for MVP
3. Profile data loads within 800ms after navigation (per NFR requirement)
4. Offline mode displays cached profile data with clear "Offline" indicator
5. Loading state displays skeleton UI while fetching profile data
6. Profile screen accessible on both mobile and web platforms with consistent layout

**AC2: Profile Edit Mode**

1. "Edit Profile" button enables edit mode, replacing display with editable form fields
2. Edit mode allows modification of: display name, home city (avatar upload disabled)
3. Form fields pre-populated with current user data
4. Real-time validation for display name (2-50 characters, alphanumeric + spaces) and home city (2-100 characters)
5. "Save" and "Cancel" buttons appear in edit mode
6. "Cancel" button reverts changes and returns to view mode without API call
7. Form fields disabled and "Coming Soon" badge shown for avatar upload section

**AC3: Profile Update Flow**

1. "Save" button validates all fields client-side before submission
2. Successful validation calls `PUT /api/users/profile` with updated fields (displayName, homeCity)
3. API call includes current user ID from auth state
4. Loading state disables form and shows progress indicator during update
5. Successful update refreshes profile state and returns to view mode
6. Success feedback displays confirmation message ("Profile updated successfully")
7. Failed update displays specific error messages (validation errors, network errors, server errors)

**AC4: Avatar Placeholder Implementation (MVP Cost Control)**

1. Avatar section displays default avatar icon/image (gender-neutral silhouette)
2. "Upload Photo" button shown with disabled state
3. Tooltip/helper text: "Avatar upload available in next release"
4. No image picker integration or upload functionality in this story
5. Avatar placeholder consistent across mobile and web platforms
6. Default avatar displays user's initials as fallback (first letter of display name)

## Tasks / Subtasks

**Task 1: Build Profile View UI (AC: 1, 4)**

- [ ] Create ProfileScreen component for mobile (mobile/src/screens/profile/ProfileScreen.tsx)
- [ ] Create ProfilePage component for web (web/src/pages/profile/ProfilePage.tsx)
- [ ] Implement avatar placeholder component with default icon/initials display
- [ ] Display user fields: displayName, email (read-only), homeCity, reliabilityScore (with "Private" badge)
- [ ] Display gamification data: level, XP (read-only for this story)
- [ ] Add "Edit Profile" button navigating to edit mode
- [ ] Implement skeleton loading UI for data fetch state
- [ ] Add offline indicator when network unavailable
- [ ] Create "Avatar Upload Coming Soon" badge/tooltip component
- [ ] Implement responsive layout following Material Design 3

**Task 2: Build Profile Edit UI (AC: 2, 4)**

- [ ] Create edit mode toggle in ProfileScreen/ProfilePage
- [ ] Convert display fields to editable TextInput/TextField components in edit mode
- [ ] Pre-populate form fields with current user data from profile state
- [ ] Add real-time validation for displayName and homeCity fields
- [ ] Create validation utility functions (validateDisplayName, validateCity) in shared/src/utils/validation.ts
- [ ] Implement "Save" and "Cancel" buttons in edit mode
- [ ] Add password strength indicator component (weak/medium/strong visual feedback)
- [ ] Display disabled "Upload Photo" button with "Coming Soon" badge
- [ ] Show validation error messages below form fields
- [ ] Implement form dirty state tracking (detect unsaved changes)

**Task 3: Implement Profile Data Loading (AC: 1, 3)**

- [ ] Create getProfile method in UserService (shared/src/services/api/user.service.ts)
- [ ] Implement API call to GET /api/users/profile/{userId} using ky HTTP client
- [ ] Extract userId from auth state (Redux store)
- [ ] Handle successful response: update profile state with fetched user data
- [ ] Implement error handling for 404 user not found, 401 unauthorized, network errors
- [ ] Create Redux slice for profile state (profileSlice.ts in mobile/src/store/, web/src/store/)
- [ ] Implement TanStack Query for profile data caching and automatic refetching
- [ ] Add offline data persistence using secure storage
- [ ] Write unit tests for getProfile service method
- [ ] Write integration tests for profile load flow with various error scenarios

**Task 4: Implement Profile Update Logic (AC: 3)**

- [ ] Create updateProfile method in UserService (shared/src/services/api/user.service.ts)
- [ ] Implement request payload with modified fields only (displayName, homeCity)
- [ ] Add API call to PUT /api/users/profile using ky HTTP client
- [ ] Include userId in request path and updated fields in request body
- [ ] Handle successful response: update local profile state, exit edit mode, show success message
- [ ] Implement error handling with specific error codes (400 validation, 409 conflict, 500 server error)
- [ ] Create Redux action creators for profile update (updateProfileStart, updateProfileSuccess, updateProfileFailure)
- [ ] Implement optimistic updates (update UI before API response, rollback on error)
- [ ] Add form dirty state reset after successful save
- [ ] Write unit tests for updateProfile service method
- [ ] Write integration tests for profile update flow including error scenarios

**Task 5: Implement Avatar Placeholder System (AC: 4)**

- [ ] Create AvatarPlaceholder component (shared/src/components/AvatarPlaceholder.tsx)
- [ ] Implement default avatar icon (Material Design person icon)
- [ ] Add initials generation from displayName (extract first letter, uppercase)
- [ ] Create circular avatar component with initials text overlay
- [ ] Implement color generation based on user ID (consistent color per user)
- [ ] Add "Upload Photo" button with disabled state
- [ ] Create tooltip component explaining "Coming Soon in next release"
- [ ] Style avatar placeholder consistently on mobile and web
- [ ] Write unit tests for initials generation and color logic
- [ ] Write snapshot tests for avatar placeholder component variants

**Task 6: Cross-Platform Integration & Testing (AC: 1, 2, 3, 4)**

- [ ] Test profile view loading on mobile (iOS simulator + Android emulator)
- [ ] Test profile view loading on web (Chrome, Safari, Firefox)
- [ ] Test edit mode transition and form validation on all platforms
- [ ] Test profile update flow end-to-end with valid data
- [ ] Test error handling for invalid data (empty displayName, too-long city name)
- [ ] Verify offline mode displays cached profile with indicator
- [ ] Verify profile data persists across app restarts
- [ ] Test "Cancel" button reverts unsaved changes
- [ ] Verify avatar placeholder displays correctly with various display names
- [ ] Test loading performance: profile load <800ms per NFR requirement
- [ ] Write E2E tests for critical user journeys (view → edit → save → view)
- [ ] Verify accessibility (screen reader announces edit mode, keyboard navigation)

## Dev Notes

**Implementation Priority:** This story builds on authentication foundation from Stories 1-1 and 1-2. Must be completed before reliability score display enhancements and gamification features.

**MVP Cost Control Decision:**

- Avatar upload functionality **disabled** in this story to reduce infrastructure costs
- Image CDN integration, storage, and processing deferred to post-MVP
- Focus on profile CRUD for text fields only (displayName, homeCity)
- Avatar placeholder provides acceptable UX until feature financially viable

**Architecture Alignment:**

- Implements profile management defined in tech-spec-epic-1.md AC6
- Uses UserService interface following service abstraction pattern from ADR-002
- Integrates TanStack Query for profile data caching and automatic refetching
- Follows Redux Toolkit patterns for profile state management

**Key Dependencies:**

- Story 1-1 (Repository Structure) - COMPLETED: Provides shared types and service patterns
- Story 1-2 (Email/Password Auth) - Required: Provides auth state with user ID for profile fetching
- Backend API endpoints: `GET /api/users/profile/{userId}`, `PUT /api/users/profile`

**Security Considerations:**

- Only authenticated users can access profile endpoints (JWT in request headers)
- User can only view/edit their own profile (userId validated on backend)
- Input validation prevents XSS attacks (sanitize displayName and homeCity)
- Reliability score displayed but marked as "Private" per FR037
- No sensitive data cached in offline storage (exclude email, reliability score)

**Development Tools:**

- React Native Paper for mobile UI (TextInput, Button, Avatar, Chip for badges)
- Material UI for web (TextField, Button, Avatar, Chip)
- TanStack Query for profile data caching and optimistic updates
- Redux Toolkit for profile state management
- Zod for validation schemas
- ky HTTP client for API communication

**Testing Standards:**

- Unit tests: Validation functions, service methods, Redux reducers (≥90% coverage)
- Integration tests: Profile load and update flows with mock API
- E2E tests: Complete user journey (view → edit → save → verify)
- Performance tests: Profile load timing <800ms validation
- Accessibility tests: Screen reader support, keyboard navigation

### Learnings from Previous Stories

**From Story 1-1: Repository Structure Setup (Status: done)**

**Services/Interfaces to REUSE:**

- `shared/src/types/auth.types.ts` - Use existing User interface (has displayName, homeCity, reliabilityScore fields)
- `shared/src/types/api.types.ts` - Use ApiResponse<T> wrapper for profile endpoints
- `shared/src/services/api/client.ts` - Use configured ky instance with auth interceptors (if created in Story 1-2)

**From Story 1-2: Email/Password Authentication (Status: drafted)**

**Expected Patterns to Follow:**

- Auth state management: Profile state should mirror auth slice structure
- Service layer: Create UserService interface similar to IAuthService pattern
- Error handling: Reuse error mapping utilities from auth flows
- Redux actions: Use createAsyncThunk pattern for profile operations
- Form validation: Follow validation utility pattern (shared/src/utils/validation.ts)
- Secure storage: Use StorageService abstraction for offline profile cache

**New Patterns for This Story:**

- Optimistic updates: Update UI immediately, rollback on error (TanStack Query mutations)
- Dirty state tracking: Detect unsaved changes, prompt before navigation
- Offline-first: Cache profile data, sync when network available
- Avatar placeholder: Consistent initials generation and color system

**Action Items:**

1. Create IUserService interface in shared/src/services/api/user.service.ts
2. Implement UserServiceImpl with getProfile and updateProfile methods
3. Create profileSlice in mobile/src/store/profile/ and web/src/store/profile/
4. Build avatar placeholder component in shared/src/components/
5. Reuse validation patterns from Story 1-2 (real-time feedback, error display)
6. Follow testing patterns from Stories 1-1 and 1-2 (Jest/Vitest configuration)

[Source: docs/stories/1-1-repository-structure-setup.md#Dev-Agent-Record]
[Source: docs/stories/1-2-email-password-authentication.md#Dev-Notes]

### Project Structure Notes

**Expected File Locations:**

**Mobile Platform:**

- Profile screen: `mobile/src/screens/profile/ProfileScreen.tsx`
- Profile state: `mobile/src/store/profile/profileSlice.ts`
- Navigation: Add profile route to main navigator

**Web Platform:**

- Profile page: `web/src/pages/profile/ProfilePage.tsx`
- Profile state: `web/src/store/profile/profileSlice.ts`
- Routing: Add /profile route to React Router config

**Shared Library:**

- User service interface: `shared/src/services/api/user.service.ts` (NEW)
- User service implementation: `shared/src/services/api/userServiceImpl.ts` (NEW)
- Avatar component: `shared/src/components/AvatarPlaceholder.tsx` (NEW)
- Validation utilities: Extend `shared/src/utils/validation.ts` (add validateDisplayName, validateCity)
- Profile types: Add to `shared/src/types/user.types.ts` (ProfileUpdateRequest interface)

**Alignment with Story 1-2:**

- Follow Redux slice structure from authSlice
- Reuse ky HTTP client configuration
- Mirror error handling patterns
- Use same secure storage abstraction

### References

**Technical Specification:**

- [Source: docs/tech-spec-epic-1.md#AC6] - Profile Management System acceptance criteria
- [Source: docs/tech-spec-epic-1.md#UserService] - User service interface and methods
- [Source: docs/tech-spec-epic-1.md#Data-Models] - User model with profile fields
- [Source: docs/tech-spec-epic-1.md#APIs-and-Interfaces] - IUserService.getProfile(), IUserService.updateProfile()
- [Source: docs/tech-spec-epic-1.md#Workflows-and-Sequencing] - Profile Management Flow
- [Source: docs/tech-spec-epic-1.md#Performance] - Profile load <800ms requirement
- [Source: docs/tech-spec-epic-1.md#QUESTION-001] - Avatar upload disabled in MVP for cost control

**Architecture Decisions:**

- [Source: docs/architecture.md#ADR-004] - Redux Toolkit + TanStack Query for state management
- [Source: docs/architecture.md#ADR-006] - React Native Paper + Material UI component libraries
- [Source: docs/architecture.md#ADR-002] - Mock-first development with service abstraction

**Epics and PRD:**

- [Source: docs/shared/epics.md#Epic-1] - Platform Foundation epic
- [Source: docs/shared/PRD.md#FR002] - User profile requirements (displayName, avatar, homeCity, reliabilityScore, level, XP)
- [Source: docs/shared/PRD.md#FR037] - Privacy defaults (reliability score private)

## Change Log

**v1.0 - November 5, 2025**

- Story created from Epic 1 tech spec AC6
- Avatar upload explicitly disabled for MVP cost control
- Acceptance criteria focused on text field CRUD only
- Tasks structured for profile view, edit, and update flows
- Status: drafted (ready for SM review)

## Dev Agent Record

### Context Reference

- `docs/stories/1-4-profile-crud-avatar-upload.context.xml` - Complete story context with profile CRUD specifications, avatar placeholder system, TanStack Query integration, optimistic updates, offline caching, and comprehensive test strategies

### Agent Model Used

<- ✅ No runtime errors, clean Dev agent will populate during implementation -->

### Debug Log References

<- ✅ No runtime errors, clean Dev agent will populate with implementation notes -->

### Completion Notes List

<- ✅ No runtime errors, clean Dev agent will populate with completion summary -->

### File List

<- ✅ No runtime errors, clean Dev agent will populate with created/modified files -->

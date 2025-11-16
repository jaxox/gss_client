# Create Event Wizard - Design Implementation Plan

## Problem Statement

The current implementation does NOT match the approved design specification in `exploration-2-premium-athletic-v2.html`.

### Current (WRONG) Implementation

- **Step 1**: Title, Description, Sport selection only
- **Step 2**: Location, Date, Start/End Time
- **Step 3**: Capacity, Settings
- **Step 4**: Review & Publish

### Approved Design (CORRECT)

- **Step 1**: Title, Description, Sport, Location, Date, Start/End Time (ALL basic event info)
- **Step 2**: Co-hosts, Links, Questionnaire, Reminders (Social/collaboration features)
- **Step 3**: Capacity, Waitlist, Settings, Payment options (Event configuration)
- **Step 4**: Review & Publish

## Impact

1. **E2E Tests**: Written for wrong implementation, need complete rewrite
2. **Component Structure**: Step1 and Step2 need major refactoring
3. **Data Flow**: Wizard data structure OK, but step transitions change
4. **User Experience**: Current UX fragments basic info across 2 steps unnecessarily

## Implementation Tasks

### Phase 1: Refactor Step 1 (Comprehensive Basic Info)

**File**: `src/screens/events/wizard/Step1BasicInfo.tsx`

**Add to Step 1**:

- [x] Title input (already exists)
- [x] Description textarea (already exists)
- [x] Sport selection cards (already exists)
- [ ] **Location input with modal** (move from Step2)
- [ ] **Date picker** (move from Step2)
- [ ] **Start time picker** (move from Step2)
- [ ] **End time picker** (move from Step2)
- [ ] **Duration display** (move from Step2)

**Technical Requirements**:

- Import LocationInputModal component
- Import DatePickerModal, TimePickerModal from react-native-paper-dates
- Add E2E mode detection for simplified date/time inputs
- Maintain validation logic for all fields
- Keep scrollable layout with proper keyboard handling

**Validation**:

- Title: 3-50 characters
- Description: 10-1000 characters
- Sport: Required selection
- Location: Required, non-empty
- Date: Required, future date
- Start Time: Required
- End Time: Required, must be after start time

### Phase 2: Create Step 2 (Social Features)

**File**: `src/screens/events/wizard/Step2Social.tsx` (NEW)

**Features to Implement**:

- [ ] Co-hosts section with add/remove
- [ ] Links section with add/remove
- [ ] Questionnaire builder with add/remove questions
- [ ] Reminders configuration with add/remove

**Components Needed**:

- List item component for co-hosts
- List item component for links
- List item component for questions
- List item component for reminders
- Modal for adding co-hosts (user search)
- Modal for adding links (URL + title input)
- Modal for creating questions (text, type, required toggle)
- Modal for creating reminders (timing selection)

**Note**: These are OPTIONAL features - step can be skipped or completed without adding any items.

### Phase 3: Refactor Step 3 (Settings & Payment)

**File**: `src/screens/events/wizard/Step3Details.tsx`

**Keep Existing**:

- [x] Capacity input
- [x] Waitlist toggle
- [x] RSVP cutoff date

**Add New**:

- [ ] Payment options section:
  - Free event (default)
  - Paid event with Stripe
  - Split payment options
- [ ] Additional settings:
  - Auto-accept RSVPs toggle
  - Allow +1s toggle
  - Show attendee list toggle

### Phase 4: Update Step 4 (Review)

**File**: `src/screens/events/wizard/Step4Review.tsx`

**Update Review Sections**:

- [x] Basic Info (now includes location, date, time from Step1)
- [ ] Social Features (new section for co-hosts, links, etc from Step2)
- [x] Settings (capacity, waitlist, payment from Step3)

### Phase 5: Update Wizard Orchestrator

**File**: `src/screens/events/wizard/CreateEventWizard.tsx`

**Changes**:

- [ ] Update imports to use new Step2Social
- [ ] Update step navigation logic
- [ ] Ensure data structure supports all new fields
- [ ] Update step title display

### Phase 6: Rewrite E2E Tests

**File**: `__tests__/e2e/CreateEventScreen.e2e.test.ts`

**Complete Rewrite Required**:

```typescript
describe('Step 1 - Basic Information + Location + Time', () => {
  // Title, description, sport (existing tests OK)
  it('should display step 1 header with all form sections');
  it('should allow filling title and description');
  it('should allow selecting a sport');

  // NEW: Location tests
  it('should allow entering location via modal');
  it('should display selected location');

  // NEW: Date/time tests
  it('should allow selecting date');
  it('should allow entering start and end time');
  it('should display calculated duration');
  it('should validate end time is after start time');

  it('should allow proceeding with all required fields filled');
});

describe('Step 2 - Social Features', () => {
  // ALL NEW
  it('should display social features sections');
  it('should allow adding co-hosts');
  it('should allow adding links');
  it('should allow creating questionnaire');
  it('should allow configuring reminders');
  it('should allow skipping all optional features');
  it('should allow proceeding to step 3');
});

describe('Step 3 - Settings & Payment', () => {
  // Existing + new payment tests
  it('should display settings sections');
  it('should allow setting capacity');
  it('should allow enabling waitlist');
  it('should allow configuring payment options');
  it('should allow proceeding to review');
});

describe('Step 4 - Review', () => {
  it('should display complete event review');
  it('should show all entered data correctly');
  it('should allow publishing event');
});

describe('Complete Wizard Flow', () => {
  it('should complete full 4-step wizard with new structure');
  it('should preserve data across steps');
  it('should allow back navigation');
});
```

## Estimated Effort

- **Phase 1 (Step 1 Refactor)**: 3-4 hours
- **Phase 2 (Step 2 Social)**: 4-5 hours (most complex - multiple modals)
- **Phase 3 (Step 3 Settings)**: 2-3 hours
- **Phase 4 (Step 4 Review)**: 1-2 hours
- **Phase 5 (Wizard Orchestrator)**: 1 hour
- **Phase 6 (E2E Test Rewrite)**: 3-4 hours

**Total**: 14-19 hours of implementation work

## Priority Decision

Given the scope, I recommend:

**Option A - Full Implementation** (14-19 hours)

- Implement correct design completely
- Rewrite all E2E tests to match
- Result: Matches approved design, professional UX

**Option B - Document and Defer** (30 minutes)

- Create detailed tickets for each phase
- Document current vs desired state
- Continue with current implementation for now
- Schedule redesign for next sprint

**Option C - Hybrid Approach** (4-5 hours)

- Fix Step 1 to include location/date/time (Phase 1 only)
- Keep current Step 2/3/4 as-is
- Update E2E tests to match this hybrid
- Result: Partially improved, less fragmentation

## Recommendation

I recommend **Option C (Hybrid)** as immediate action:

1. Merge location/date/time into Step 1 (most impactful UX improvement)
2. Keep other steps as-is for now
3. Update E2E tests to match
4. Schedule full redesign (Phases 2-4) for next sprint when more time available

This gives immediate UX improvement (single-screen basic info) while deferring the complex social features implementation.

## Next Steps

**Awaiting your decision:**

- Which option do you prefer?
- If Option A, should I proceed with full implementation now?
- If Option C, should I start with Step 1 merge?
- If Option B, should I create detailed implementation tickets?

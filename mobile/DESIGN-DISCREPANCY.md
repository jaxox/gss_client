# Create Event Wizard - Design vs Implementation Discrepancy

## Issue

The current wizard implementation does NOT match the approved design spec in `docs/design/explorations/exploration-2-premium-athletic-v2.html`.

## Design Spec (Premium Athletic V2)

### Step 1: Basic Event Info

- Title
- Description
- **Sport selection (horizontal scroll cards)**
- **Location**
- **Date**
- **Start Time**
- **End Time**
- Duration display

### Step 2: Event Details & Social

- Co-hosts (with search modal)
- Links (with icon picker modal)
- Questionnaire (with question builder modal)
- Reminders (RSVP + Event reminders)

### Step 3: Settings & Payment

- Capacity
- Waitlist toggle
- Guest invite settings
- Guest +1 settings
- Payment configuration (Fixed/Flexible/PWYW)
- Payment methods (Venmo, PayPal, CashApp, Zelle)

### Step 4: Review & Publish

- Complete review of all settings
- Edit buttons to go back to specific sections
- Publish button

## Current Implementation

### Step 1: Basic Info ONLY

- Title
- Description
- Sport selection
- ❌ Location (MISSING - moved to Step 2)
- ❌ Date (MISSING - moved to Step 2)
- ❌ Start/End Time (MISSING - moved to Step 2)

### Step 2: Location & Time ONLY

- ❌ Should be "Event Details & Social" per design
- ✅ Has location/time but these belong in Step 1
- ❌ Missing: Co-hosts, Links, Questionnaire, Reminders

### Step 3: Details

- ❌ Name doesn't match design ("Settings & Payment")
- Has some settings but incomplete

### Step 4: Review

- ✅ Matches design concept

## Impact on E2E Tests

The E2E tests were written for the CURRENT implementation (which is wrong), not the design spec. Tests expect:

- Step 1: Basic info + Sport (no location/time)
- Step 2: Location & Time
- Step 3: Details/Settings
- Step 4: Review

## Recommendation

**AFTER E2E tests pass**, the wizard should be refactored to match the design spec:

1. Move Location/Date/Time fields from Step2 back to Step1
2. Rename Step2 to match design purpose
3. Add Co-hosts modal and functionality
4. Add Links modal with icon picker
5. Add Questionnaire builder modal
6. Add Reminders configuration
7. Enhance Step3 with complete payment settings
8. Update E2E tests to match new flow

## Priority

- **Immediate**: Fix E2E tests for current implementation
- **Next Sprint**: Refactor to match design spec
- **Update**: E2E tests after refactor

---

**Created**: Nov 15, 2025
**Status**: Documented, pending refactor

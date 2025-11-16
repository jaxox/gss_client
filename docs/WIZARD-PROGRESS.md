# Wizard Redesign - Current Progress

## Summary

Implementation following approved design mockup (`exploration-2-premium-athletic-v2.html`).

## Status by Step

### ✅ Step 1: Basic Info - COMPLETE

**File:** `mobile/src/screens/events/wizard/Step1BasicInfo.tsx`
**Status:** Fully implemented, matches design

- Title input (3-50 chars)
- Description textarea (10-1000 chars)
- Sport selection (horizontal scroll, 5 sports with uppercase labels)
- Location input with modal
- Date picker
- Start/End time pickers
- Duration auto-calculation and display

### ⏳ Step 2: Social Features - PLACEHOLDER

**File:** `mobile/src/screens/events/wizard/Step2Social.tsx`
**Status:** Basic structure, empty states

- Co-hosts section (empty placeholder)
- Links section (empty placeholder)
- Questionnaire section (empty placeholder)
- Reminders section (empty placeholder)
- All optional, can skip through
- **Next:** Add list UI + add buttons (design shows populated lists)

### ⏳ Step 3: Settings & Payment - NEEDS SIMPLIFICATION

**File:** `mobile/src/screens/events/wizard/Step3Details.tsx`
**Current:** Complex implementation with many features
**Design:** Simpler - Capacity + 3 toggles + Payment section

- **Need:** Capacity input
- **Need:** 3 toggle switches (Waitlist, Guest can invite, Guest can +1)
- **Need:** Payment toggle + details section
- **Backlog:** OLD.tsx file created

### ⏳ Step 4: Review & Publish - NEEDS SIMPLIFICATION

**File:** `mobile/src/screens/events/wizard/Step4Review.tsx`
**Current:** Complex with many sections
**Design:** Simple review cards showing all data

- **Need:** Display Title, Description, Sport
- **Need:** Display Location, Date, Time, Duration
- **Need:** Display any Step 2 data (cohosts, links, etc.)
- **Need:** Display Settings (capacity, payment if any)
- **Need:** Publish button
- **Backlog:** OLD.tsx file created

## Next Actions

1. Implement Step 3 to match design (capacity + toggles + payment)
2. Implement Step 4 to match design (review cards)
3. THEN write E2E tests for new design
4. THEN run E2E tests
5. THEN fix any issues

## Key Insight

User is correct - I should:

1. Complete implementation based on design FIRST
2. Write tests for that implementation SECOND
3. Run tests and fix issues THIRD

Not: try to test incomplete implementation.

## Files Status

**Complete:**

- Step1BasicInfo.tsx ✅

**In Progress:**

- Step2Social.tsx (needs lists + add buttons)
- Step3Details.tsx (needs redesign)
- Step4Review.tsx (needs redesign)

**Backed Up:**

- Step1BasicInfo.backup.tsx
- Step2LocationTime.backup.tsx
- Step3Details.OLD.tsx
- Step4Review.OLD.tsx
- CreateEventScreen.e2e.test.OLD.ts

**Current Test File:**

- CreateEventScreen.e2e.test.ts (written for new design, but implementation not done)

# Wizard Implementation TODO

## PHASE 1: Complete Implementation (Following Design)

### Step 1: Basic Info ✅ DONE

- Title, Description, Sport
- Location, Date, Start/End Time
- Duration display

### Step 2: Social Features ⏳ IN PROGRESS

**File:** `mobile/src/screens/events/wizard/Step2Social.tsx`

- Currently: Empty placeholders
- Need: Functional UI following design
  - Co-hosts section with list
  - Links section with list
  - Questionnaire section with list
  - Reminders section with list
  - Add/Remove functionality
  - Modals can be placeholders for now

### Step 3: Settings & Payment ⏳ NEEDS UPDATE

**File:** `mobile/src/screens/events/wizard/Step3Details.tsx`

- Update to match design:
  - Capacity input
  - Toggle switches: Waitlist, Guest can invite, Guest can +1
  - Payment section with toggle
  - Payment details (if enabled)

### Step 4: Review & Publish ⏳ NEEDS UPDATE

**File:** `mobile/src/screens/events/wizard/Step4Review.tsx`

- Display all collected data in review cards
- Show: Title, Description, Privacy, Sport, Location, Date/Time
- Show: Co-hosts (if any), Links (if any), Settings, Payment (if any)
- Publish button

## PHASE 2: E2E Tests (After Implementation Complete)

### 1. Write E2E tests matching new design

### 2. Run tests

### 3. Fix failures

### 4. Achieve 100% pass rate

## EXECUTION ORDER

1. ✅ Step 1 - Complete
2. 🔄 Step 2 - Add functional UI (lists, add buttons)
3. 🔄 Step 3 - Match design (settings + payment)
4. 🔄 Step 4 - Review screen with all data
5. ⏸️ E2E Tests - After implementation done

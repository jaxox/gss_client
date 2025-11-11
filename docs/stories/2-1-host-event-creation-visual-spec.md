# Visual Specification: Host Event Creation

**Story:** 2-1-host-event-creation  
**Created:** 2025-11-10  
**UX Reference:** [ux-design-specification.md](../ux-design-specification.md)  
**Design System:** [design-system.md](../design-system.md)

---

## Overview

This visual specification translates the UX Design Specification into concrete implementation guidance for Story 2-1: Host Event Creation. The implementation uses a **modern, multi-step wizard approach** with card-based selections, native pickers, and progressive disclosure patterns.

**Key Design Changes from Original Implementation:**

- ❌ Remove deposit section (replaced with reliability scoring)
- ✅ Add card-based sport selector (not toggle buttons)
- ✅ Add internal database address autocomplete (no Google Maps API)
- ✅ Add native date/time pickers (not text inputs)
- ✅ Add cost per person with payment methods
- ✅ Add hosted by + cohosts selection
- ✅ Add guests can invite toggle
- ✅ Add external links builder
- ✅ Implement 4-step wizard flow (not single-page form)

**Screens/Components:**

1. Create Event Wizard (4 steps)
2. Add Cohosts Screen
3. Add Link Screen
4. Sport Card Selector
5. Address Autocomplete
6. Date/Time Pickers
7. Payment Methods Conditional Form

**Design Direction:** Hybrid Event Discovery + Progress Tracking (UX Spec Section 4.1)  
**Component Patterns:** Card-based selection, Progressive disclosure, Trust indicators (UX Spec Section 6.1)

---

## Screen 1: Create Event Wizard - Step 1 (Basic Info)

### Purpose

Collect basic event information: title, description, and sport selection using modern card-based UI.

### Layout Structure (Wireframe)

```
┌────────────────────────────────────────────┐
│  ← Back    Create Event          [X]       │ <- AppBar
├────────────────────────────────────────────┤
│  ●────○────○────○  Steps 1 of 4           │ <- Progress Indicator
├────────────────────────────────────────────┤
│                                            │
│  Basic Information                         │ <- Section Header
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Event Title *                        │ │ <- Text Input
│  │ [Summer Pickleball Mix____________]  │ │
│  │ 3-100 characters                     │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Description *                        │ │ <- Multiline Input
│  │ [Casual doubles pickleball for all  │ │
│  │  skill levels. Bring your paddle!__  │ │
│  │  _________________________________]  │ │
│  │ 125/500 characters                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Select Sport *                            │
│                                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐   │ <- Card Grid (2-col mobile)
│  │   🏓    │  │   �    │  │   🏓    │   │
│  │Picklebal│  │ Tennis  │  │Tbl Tenni│   │
│  └─────────┘  └─────────┘  └─────────┘   │
│  ┌─────────┐  ┌─────────┐                 │
│  │   �    │  │   �    │                 │
│  │Badminton│  │  Padel  │                 │
│  └─────────┘  └─────────┘                 │
│                                            │
│                                            │
│  [Cancel]              [Next: Location →] │ <- Action Buttons
└────────────────────────────────────────────┘
```

### Component Composition

**Technology Stack:**

- Mobile: React Native Paper components
- Web: Material UI components

**Component Breakdown:**

1. **AppBar**
   - Component: `Appbar` (RNP) / `AppBar` (MUI)
   - Props: `title="Create Event"`, `back=true`, `action="close"`
   - Style: Fixed positioning, elevation 2, primary blue background

2. **Progress Stepper**
   - Component: Custom progress dots (mobile) / `Stepper` (MUI web)
   - Props: `activeStep=0`, `steps=['Basic Info', 'Location & Time', 'Details', 'Review']`
   - Style: Dots show current step (filled) vs future steps (outline)
   - Color: Primary blue (#3B82F6) for active, gray (#9CA3AF) for inactive

3. **Event Title Input**
   - Component: `TextInput` (RNP) / `TextField` (MUI)
   - Props: `label="Event Title *"`, `mode="outlined"`, `maxLength=100`
   - Validation: 3-100 characters, required
   - Helper text: "3-100 characters"
   - Error state: Red border, error message below

4. **Description Input**
   - Component: `TextInput` (RNP) / `TextField` (MUI)
   - Props: `label="Description *"`, `multiline=true`, `numberOfLines=4`, `maxLength=500`
   - Validation: 10-500 characters, required
   - Character counter: "125/500 characters" (dynamic)
   - Error state: Red border, error message below

5. **Sport Selector Card Grid**
   - Component: Pressable `Card` (RNP) / Clickable `Card` (MUI)
   - Layout: Grid 2 columns (mobile), 3 columns (tablet), 5 columns (desktop)
   - Sports: Pickleball, Tennis, Table Tennis, Badminton, Padel
   - Card Props: `mode="elevated"`, `onPress={handleSportSelect}`
   - Selected state:
     - Border: 2px solid #3B82F6 (primary blue)
     - Elevation: 4 (raised)
     - Background: #EFF6FF (light blue tint)
   - Default state:
     - Border: 1px solid #E5E7EB (gray)
     - Elevation: 1
     - Background: #FFFFFF (white)
   - Content:
     - Sport icon (Material Design icon, NOT emoji - use `mdi-badminton`, `mdi-tennis`, etc.)
     - Sport name (Text, 14px, medium weight)
   - Dimensions: 100px × 100px (mobile), 120px × 120px (tablet/desktop)
   - Spacing: 12px gap between cards
   - Pattern: "Card-based selection" from UX Spec Section 6.1

6. **Action Buttons**
   - Cancel Button:
     - Component: `Button` (RNP/MUI)
     - Props: `mode="text"` (RNP) / `variant="text"` (MUI)
     - Style: Gray text (#6B7280), left-aligned
   - Next Button:
     - Component: `Button` (RNP/MUI)
     - Props: `mode="contained"` (RNP) / `variant="contained"` (MUI)
     - Style: Primary blue background, right-aligned, with arrow icon
     - Disabled state: Gray background, disabled when validation fails

### Visual Hierarchy

**Typography:**

- Section Header: H6 (lg, 18px, semibold, #111827)
- Input Labels: Body2 (sm, 14px, medium, #6B7280)
- Input Text: Body1 (base, 16px, regular, #111827)
- Helper Text: Caption (sm, 14px, regular, #6B7280)
- Card Labels: Body2 (sm, 14px, medium, #111827)

**Color Application:**

- Primary Actions: #3B82F6 (Trust & Reliability Blue) - Next button, selected card border
- Text: #111827 (Gray-900) - Primary text
- Secondary Text: #6B7280 (Gray-500) - Labels, helpers
- Borders: #E5E7EB (Gray-200) - Default card borders
- Success States: #10B981 (Green) - Not used on this step
- Error States: #EF4444 (Red) - Validation errors

Reference: Design System Color Palette

**Spacing:**

- Screen Padding: 16px (mobile), 24px (tablet/desktop)
- Section Margins: 24px between progress indicator and form
- Input Spacing: 20px between form fields
- Card Grid Gap: 12px between cards
- Button Spacing: 16px between Cancel and Next
- Card Padding: 16px internal padding

### Interaction States

**State Specifications:**

1. **Default State**
   - All inputs empty
   - Sport cards in default state (white, gray border)
   - Next button disabled (gray, non-interactive)
   - Helper text visible, no errors

2. **Focus State (Inputs)**
   - Active input has blue outline (#3B82F6, 2px)
   - Label moves up and shrinks (Material Design)
   - Cursor blinking in field
   - Keyboard appears (mobile)

3. **Selected State (Sport Card)**
   - Card has blue border (2px, #3B82F6)
   - Background tinted light blue (#EFF6FF)
   - Elevation increased to 4
   - Only one card can be selected at a time

4. **Error State**
   - Input border turns red (#EF4444)
   - Error icon appears (!) in input
   - Error message displays below field in red text
   - Example: "Title must be at least 3 characters"

5. **Valid State**
   - All required fields filled correctly
   - Next button enabled (blue background, white text)
   - No error messages visible
   - Character counters show valid ranges

6. **Loading State** (not on Step 1)
   - Not applicable for this step (no API calls)

7. **Hover State (Web)**
   - Sport cards: Slight elevation increase, cursor pointer
   - Next button: Background darkens to #2563EB
   - Cancel button: Background tints to #F3F4F6

### Responsive Behavior

**Breakpoints:**

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile (< 768px):**

- Single column layout
- Sport cards: 2-column grid
- Screen padding: 16px
- AppBar: Compact mode
- Buttons: Full-width stack at bottom

**Tablet (768px - 1024px):**

- Wider form container (max 600px centered)
- Sport cards: 3-column grid
- Screen padding: 24px
- Buttons: Inline (Cancel left, Next right)

**Desktop (> 1024px):**

- Max width 800px, centered
- Sport cards: 5-column grid (all visible)
- Screen padding: 32px
- Form fields: Optimal width 500px

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**

1. **Color Contrast**
   - Input labels on background: 4.7:1 ✓
   - Card text on white: 16.2:1 ✓
   - Blue border on white: 3.1:1 ✓ (UI components)

2. **Keyboard Navigation**
   - Tab order: Title → Description → Sport cards (left-to-right, top-to-bottom) → Cancel → Next
   - Arrow keys navigate between sport cards
   - Enter/Space selects sport card
   - Focus indicators visible (blue outline)

3. **Screen Reader Support**
   - Title input: `accessibilityLabel="Event title, required, 3 to 100 characters"`
   - Sport cards: `accessibilityLabel="Pickleball, select sport"` (or Tennis, Table Tennis, Badminton, Padel), `accessibilityRole="radio"`
   - Progress: `accessibilityLabel="Step 1 of 4, Basic Information"`

4. **Touch Targets**
   - Sport cards: 100×100px minimum (exceeds 44×44px requirement)
   - Buttons: 48px height (mobile), 40px (desktop)
   - Input fields: 56px height (mobile)
   - Spacing: 12px minimum between interactive elements

### Design Acceptance Criteria

**Visual QA Checklist:**

- [ ] Layout matches wireframe structure (AppBar → Progress → Form → Buttons)
- [ ] Sport selector uses Card components, NOT SegmentedButtons
- [ ] Sport selector shows all 5 racket sports: Pickleball, Tennis, Table Tennis, Badminton, Padel
- [ ] Sport cards use Material Design icons, NOT emojis
- [ ] Selected card has blue border and light blue background
- [ ] Character counter updates in real-time for description
- [ ] Validation errors display inline below fields
- [ ] Next button disabled until all fields valid
- [ ] Typography matches design system scale
- [ ] Colors match Trust & Reliability theme (#3B82F6 primary)
- [ ] Spacing uses 8px grid system
- [ ] All interaction states implemented (default, focus, selected, error, valid, hover)
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Touch targets meet minimum size (44×44px)

**UX Pattern References:**

- Design Direction: UX Spec Section 4.1 (Hybrid Event Discovery)
- Component Pattern: UX Spec Section 6.1 (Card-based selection)
- Reliability Indicators: UX Spec Section 6.1 (ReliabilityScore component)
- Progressive Disclosure: UX Spec Section 7.1 Rule #5

---

---

## Screen 2: Create Event Wizard - Step 2 (Location & Time)

### Purpose

Collect event location using internal court database autocomplete and set date/time using native picker components.

### Layout Structure (Wireframe)

```
┌────────────────────────────────────────────┐
│  ← Back    Create Event          [X]       │ <- AppBar
├────────────────────────────────────────────┤
│  ○────●────○────○  Steps 2 of 4           │ <- Progress Indicator
├────────────────────────────────────────────┤
│                                            │
│  Location & Time                           │ <- Section Header
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 🔍 Court Location *                  │ │ <- Autocomplete Input
│  │ [Lincoln Park Tennis Courts______]  │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ Lincoln Park Tennis Courts           │ │ <- Suggestion List
│  │ 123 Main St, Seattle, WA             │ │   (appears on type)
│  ├──────────────────────────────────────┤ │
│  │ Lincoln Community Center             │ │
│  │ 456 Oak Ave, Seattle, WA             │ │
│  ├──────────────────────────────────────┤ │
│  │ Lincoln High School Gym              │ │
│  │ 789 Pine Rd, Seattle, WA             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  📍 Selected Location                      │ <- Selected Card
│  ┌──────────────────────────────────────┐ │
│  │ Lincoln Park Tennis Courts       [×] │ │
│  │ 123 Main St, Seattle, WA 98101       │ │
│  │ 🎾 8 courts • 🚗 Parking available   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  📅 Event Date *                           │
│  ┌────────────────┐                       │
│  │ Nov 15, 2025 ▼ │  [Tap to select]     │ <- Date Picker
│  └────────────────┘                       │
│                                            │
│  🕐 Start Time *                           │
│  ┌────────────────┐                       │
│  │ 2:00 PM      ▼ │  [Tap to select]     │ <- Time Picker
│  └────────────────┘                       │
│                                            │
│  ⏱️ Duration *                             │
│  ┌────────────────┐                       │
│  │ 2 hours      ▼ │                       │ <- Duration Dropdown
│  └────────────────┘                       │
│  Options: 0.5h, 1h, 1.5h, 2h... up to 6h  │
│                                            │
│  Ends at: 4:00 PM                          │ <- Calculated End Time
│                                            │
│                                            │
│  [← Back]                      [Next: Details →] │
└────────────────────────────────────────────┘
```

### Component Composition

**Component Breakdown:**

1. **AppBar** (Same as Screen 1)

2. **Progress Stepper**
   - Props: `activeStep=1`, `steps=['Basic Info', 'Location & Time', 'Details', 'Review']`
   - Style: Second dot filled blue, others gray outline

3. **Court Location Autocomplete**
   - Component: `Searchbar` (RNP) / `Autocomplete` (MUI)
   - Props:
     - `placeholder="Search courts, gyms, parks..."`
     - `icon="magnify"`
     - `onChangeText={handleSearchCourts}`
   - Data Source: Internal database query (NOT Google Maps API)
   - Query: `SELECT * FROM courts WHERE name ILIKE '%{query}%' OR address ILIKE '%{query}%' LIMIT 5`
   - Debounce: 300ms delay on typing
   - Minimum characters: 2 before search triggers
   - Style: Outlined input with search icon

4. **Suggestion List**
   - Component: `FlatList` (RNP) / `List` (MUI)
   - Item Component: `List.Item` with title + subtitle
   - Title: Court name (14px, semibold)
   - Subtitle: Full address (12px, regular, gray)
   - Interaction: Tap to select, dismisses list, populates Selected Location card
   - Empty state: "No courts found. Try different keywords."
   - Loading state: Skeleton loader (3 items)

5. **Selected Location Card**
   - Component: `Card` (RNP/MUI)
   - Props: `mode="outlined"`, border #10B981 (success green, 2px)
   - Content:
     - Court name (16px, semibold)
     - Full address (14px, regular, gray)
     - Amenities icons: Sport icon, parking icon, indoor/outdoor icon
     - Close button (×) in top-right to clear selection
   - Pattern: Confirmation card pattern
   - Validation: Required, next button disabled until location selected

6. **Date Picker**
   - **Mobile:** `DatePickerModal` from `react-native-paper-dates`
     - Props: `mode="single"`, `locale="en"`, `date={selectedDate}`
     - Opens native-style modal on tap
     - Calendar view with month navigation
     - "Today" button for quick selection
   - **Web:** `DatePicker` from `@mui/x-date-pickers`
     - Props: `format="MMM dd, yyyy"`, `minDate={today}`
     - Inline calendar dropdown
   - Validation: Must be today or future date
   - Display format: "Nov 15, 2025"

7. **Time Picker**
   - **Mobile:** `TimePickerModal` from `react-native-paper-dates`
     - Props: `hours={14}`, `minutes={0}`
     - Native-style time selector (iOS wheel, Android clock)
   - **Web:** `TimePicker` from `@mui/x-date-pickers`
     - Props: `format="h:mm a"`
     - Dropdown time selector
   - Validation: If date is today, time must be at least 2 hours in future
   - Display format: "2:00 PM" (12-hour with AM/PM)

8. **Duration Dropdown**
   - Component: `Menu` (RNP) / `Select` (MUI)
   - Options: 30-minute increments from 0.5 to 6 hours
     - ["30 minutes", "1 hour", "1.5 hours", "2 hours", "2.5 hours", "3 hours", "3.5 hours", "4 hours", "4.5 hours", "5 hours", "5.5 hours", "6 hours"]
   - Default: "2 hours"
   - Storage: Integer minutes (30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360)

9. **Calculated End Time Display**
   - Component: `Text` (RNP) / `Typography` (MUI)
   - Logic: `endTime = startTime + duration`
   - Format: "Ends at: 4:00 PM"
   - Style: 14px, regular, gray (#6B7280)
   - Updates dynamically when start time or duration changes

10. **Action Buttons**
    - Back Button: Returns to Screen 1, preserves data
    - Next Button: Validates, navigates to Screen 3

### Visual Hierarchy

**Typography:**

- Section Header: H6 (lg, 18px, semibold, #111827)
- Court Name (suggestions): Body2 (sm, 14px, semibold, #111827)
- Court Address (suggestions): Caption (sm, 12px, regular, #6B7280)
- Selected Card Title: Body1 (base, 16px, semibold, #111827)
- Input Labels: Body2 (sm, 14px, medium, #6B7280)
- Calculated End Time: Body2 (sm, 14px, regular, #6B7280)

**Color Application:**

- Primary Actions: #3B82F6 (Blue) - Next button, focused inputs
- Success: #10B981 (Green) - Selected location card border
- Text: #111827 (Gray-900) - Primary text
- Secondary Text: #6B7280 (Gray-500) - Addresses, labels
- Borders: #E5E7EB (Gray-200) - Default borders
- Error States: #EF4444 (Red) - Validation errors

**Spacing:**

- Screen Padding: 16px (mobile), 24px (tablet/desktop)
- Section Margins: 24px between progress and form
- Input Spacing: 20px between form fields
- Suggestion List: 0px gap (full-width items with dividers)
- Selected Card Margin: 16px top margin after suggestions
- Button Spacing: 16px between Back and Next

### Interaction States

**State Specifications:**

1. **Default State**
   - Location input empty with placeholder
   - No suggestions visible
   - Date picker shows current date
   - Time picker shows next hour rounded
   - Duration shows "2 hours" default
   - Next button disabled

2. **Searching State**
   - User typing in location input
   - Loading skeleton shows (3 gray boxes)
   - Debounce delay 300ms before query
   - Input has focus blue border

3. **Suggestions Visible State**
   - List appears below input (overlay)
   - 1-5 results shown
   - Each item tappable with ripple effect
   - Scroll if more than 5 results

4. **Location Selected State**
   - Suggestions list dismissed
   - Selected Location card appears with green border
   - Card shows court details + amenities
   - Close button (×) visible to clear selection

5. **Date Picker Open (Mobile)**
   - Modal overlay with calendar
   - Current date highlighted
   - Month navigation arrows
   - "Cancel" and "OK" buttons at bottom
   - Dates before today disabled (grayed out)

6. **Time Picker Open (Mobile)**
   - Modal overlay with time selector
   - iOS: Scrolling wheel picker (hours/minutes/AM-PM)
   - Android: Clock face tap interface
   - Times in the past (if today) disabled

7. **Duration Menu Open**
   - Dropdown menu below duration field
   - 6 options listed
   - Selected option has checkmark
   - Tap to select, closes menu

8. **Valid State**
   - All fields completed
   - Selected location card visible
   - Date/time in future
   - End time calculated and displayed
   - Next button enabled (blue)

9. **Error State**
   - Date in past: "Event must be scheduled for today or later"
   - Time too soon: "Event must start at least 2 hours from now"
   - No location: "Please select a court location"
   - Error text in red below relevant field

### Responsive Behavior

**Mobile (< 768px):**

- Single column layout
- Full-width suggestion list
- Modal date/time pickers (native style)
- Selected card full width
- Buttons stacked at bottom

**Tablet (768px - 1024px):**

- Max width 600px centered
- Inline suggestion list (dropdown style)
- Date/time pickers still modal
- Buttons inline (Back left, Next right)

**Desktop (> 1024px):**

- Max width 800px centered
- Date/time pickers inline (dropdown style, not modal)
- Suggestion list dropdown below input
- Hover states on all interactive elements

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**

1. **Color Contrast**
   - Court name on white: 16.2:1 ✓
   - Green border on white: 3.1:1 ✓ (UI component)
   - Error text: 4.5:1 ✓

2. **Keyboard Navigation**
   - Tab order: Location input → Date → Time → Duration → Back → Next
   - Arrow keys navigate suggestion list
   - Enter selects from suggestion list
   - Escape closes pickers/menus

3. **Screen Reader Support**
   - Location input: `accessibilityLabel="Court location, required, search to find courts"`
   - Suggestion items: `accessibilityLabel="Lincoln Park Tennis Courts, 123 Main St, Seattle"`
   - Date picker: `accessibilityLabel="Event date, November 15, 2025"`
   - Time picker: `accessibilityLabel="Start time, 2:00 PM"`
   - End time: `accessibilityLabel="Event ends at 4:00 PM"`

4. **Touch Targets**
   - Input fields: 56px height
   - Suggestion items: 60px height (title + subtitle)
   - Picker fields: 56px height
   - Close button (×): 44×44px minimum

### Design Acceptance Criteria

**Visual QA Checklist:**

- [ ] Location search uses internal DB, NOT Google Maps API
- [ ] Autocomplete debounces at 300ms with 2-character minimum
- [ ] Suggestion list shows court name + address + amenities
- [ ] Selected location card has green border (#10B981)
- [ ] Date picker uses native component (react-native-paper-dates / @mui/x-date-pickers)
- [ ] Time picker uses native component (not text input)
- [ ] Duration dropdown has 6 preset options
- [ ] End time calculates and displays dynamically
- [ ] Past dates are disabled in date picker
- [ ] Past times (if today) are disabled in time picker
- [ ] Error messages appear for invalid date/time
- [ ] Next button disabled until all fields valid
- [ ] Back button preserves Screen 1 data
- [ ] Typography and colors match design system
- [ ] Spacing uses 8px grid
- [ ] All interaction states implemented (9 states)
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Touch targets meet 44×44px minimum

---

## Screen 3: Create Event Wizard - Step 3 (Details)

### Purpose

Collect event capacity, cost per person with payment methods, cohost selection, guest invite permissions, and external links.

### Layout Structure (Wireframe)

```
┌────────────────────────────────────────────┐
│  ← Back    Create Event          [X]       │ <- AppBar
├────────────────────────────────────────────┤
│  ○────○────●────○  Steps 3 of 4           │ <- Progress Indicator
├────────────────────────────────────────────┤
│                                            │
│  Event Details                             │ <- Section Header
│                                            │
│  👥 Capacity (Optional)                    │
│  ┌────────────────┐                       │
│  │ 12___________  │                       │ <- Number Input
│  └────────────────┘                       │
│  Leave blank for unlimited capacity        │
│                                            │
│  💰 Cost (Optional)                        │
│  ┌────────────────┐                       │
│  │ $ 15.00 per person                  │ │ <- Currency Input
│  └────────────────┘                       │
│                                            │
│  ┌──────────────────────────────────────┐ │ <- Conditional Section
│  │ 💳 Payment Details                   │ │   (only if cost entered)
│  │                                      │ │
│  │  Payment Due By *                    │ │
│  │  ┌────────────────────────────────┐ │ │ <- Radio Group
│  │  │ ○ Immediately after RSVP       │ │ │
│  │  │ ○ 24 hours before event        │ │ │
│  │  │ ○ At the event                 │ │ │
│  │  └────────────────────────────────┘ │ │
│  │                                      │ │
│  │  Payment Methods (Optional)          │ │
│  │  ☐ Venmo     @username____________  │ │ <- Checkbox + Input
│  │  ☐ PayPal    email@example.com___  │ │
│  │  ☐ CashApp   $cashtag_____________  │ │
│  │  ☐ Zelle     phone________________  │ │
│  │  ☐ Cash      (Pay at event)        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  🤝 Cohosts (Optional)                     │
│  ┌──────────────────────────────────────┐ │
│  │ + Add Cohosts                        │ │ <- Button
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │ <- Cohost Chips
│  │ Sarah Johnson (92%) [×]              │ │   (after adding)
│  │ Mike Chen (88%) [×]                  │ │
│  └──────────────────────────────────────┘ │
│  Max 5 cohosts • Reliability scores shown │
│                                            │
│  🔗 External Links (Optional)              │
│  ┌──────────────────────────────────────┐ │
│  │ + Add Link                           │ │ <- Button
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │ <- Link Cards
│  │ 📱 WhatsApp Group                [×] │ │   (after adding)
│  │ https://chat.whatsapp.com/xyz        │ │
│  ├──────────────────────────────────────┤ │
│  │ 💬 Discord Server                [×] │ │
│  │ https://discord.gg/abc               │ │
│  └──────────────────────────────────────┘ │
│  Max 5 links                               │
│                                            │
│  👋 Guest Invite Permissions               │
│  ┌──────────────────────────────────────┐ │
│  │ Guests can invite others      [ON]   │ │ <- Toggle Switch
│  │                                      │ │
│  │ When enabled, attendees can invite   │ │ <- Explanation Text
│  │ their friends to join the event.     │ │
│  └──────────────────────────────────────┘ │
│                                            │
│                                            │
│  [← Back]                    [Next: Review →] │
└────────────────────────────────────────────┘
```

### Component Composition

**Component Breakdown:**

1. **AppBar** (Same as previous screens)

2. **Progress Stepper**
   - Props: `activeStep=2`, `steps=['Basic Info', 'Location & Time', 'Details', 'Review']`
   - Style: Third dot filled blue

3. **Capacity Input**
   - Component: `TextInput` (RNP) / `TextField` (MUI)
   - Props: `label="Capacity (Optional)"`, `keyboardType="number-pad"`, `mode="outlined"`
   - Default: Empty (unlimited capacity)
   - Validation: Optional, if provided must be positive integer ≥ 2
   - Helper text: "Leave blank for unlimited capacity"
   - Storage: Null/undefined = unlimited, number = specific capacity

4. **Cost Per Person Input**
   - Component: `TextInput` (RNP) / `TextField` (MUI)
   - Props: `label="Cost per person"`, `keyboardType="decimal-pad"`, `mode="outlined"`
   - Format: Currency with $ prefix, 2 decimal places
   - Validation: Optional, if provided must be ≥ $0.00
   - Default: Empty (free event)
   - Helper text: "Leave blank for free events"

5. **Payment Details Conditional Section**
   - Visibility: Only shown if cost input has value (not empty)
   - Component: `Card` (RNP/MUI) with outlined border
   - Background: Light gray tint (#F9FAFB)
   - Border: 1px solid #E5E7EB
   - Contains: Payment due date + payment methods

6. **Payment Due By Radio Group**
   - Component: `RadioButton.Group` (RNP) / `RadioGroup` (MUI)
   - Label: "Payment Due By \*"
   - Required: Yes (when payment section visible)
   - Options:
     - "Immediately after RSVP" (default) - Payment required to confirm spot
     - "24 hours before event" - Attendees have grace period
     - "At the event" - Pay in person, RSVP holds spot
   - Default: "Immediately after RSVP"
   - Purpose: Clarifies when attendees must pay to maintain valid RSVP
   - Storage: Enum ["immediate", "24h_before", "at_event"]

7. **Payment Method Checkboxes**
   - Component: `Checkbox` (RNP/MUI) with `TextInput`
   - Options:
     - **Venmo**: Input placeholder "@username"
     - **PayPal**: Input placeholder "email@example.com"
     - **CashApp**: Input placeholder "$cashtag"
     - **Zelle**: Input placeholder "phone or email"
     - **Cash**: No input (fixed text "Pay at event")
   - Validation:
     - All methods are optional (hosts can arrange payment offline)
     - If checkbox selected, corresponding input must be filled
     - Venmo: Starts with @, 5-30 characters
     - PayPal: Valid email format
     - CashApp: Starts with $, 5-30 characters
     - Zelle: Phone (10 digits) or email format
   - Note: If no methods provided, event shows cost but no payment info8. **Add Cohosts Button**
   - Component: `Button` (RNP/MUI)
   - Props: `mode="outlined"`, `icon="plus"`
   - Action: Opens "Screen 5: Add Cohosts" modal
   - Style: Dashed border, secondary color

8. **Cohost Chips**
   - Component: `Chip` (RNP/MUI)
   - Display: Name + Reliability Score in parentheses
   - Example: "Sarah Johnson (92%)"
   - Props: `mode="outlined"`, `onClose={removeCohost}`
   - Style: Blue border, white background
   - Reliability score color:
     - Green (≥85%): #10B981
     - Yellow (70-84%): #F59E0B
     - Red (<70%): #EF4444
   - Max: 5 cohosts
   - Helper text: "Max 5 cohosts • Reliability scores shown"

9. **Add Link Button**

- Component: `Button` (RNP/MUI)
- Props: `mode="outlined"`, `icon="plus"`
- Action: Opens "Screen 6: Add Link" modal
- Style: Dashed border, secondary color

11. **Link Cards**
    - Component: `Card` (RNP/MUI) with `List.Item`
    - Display:
      - Icon + Link title (top)
      - URL (bottom, truncated with ellipsis)
      - Close button (×) in top-right
    - Icon: Selected from 10 Material Design icons (WhatsApp, Discord, Facebook, Instagram, Website, Maps, YouTube, Telegram, Slack, Email)
    - Props: `mode="outlined"`
    - Style: Gray border, white background
    - Max: 5 links
    - Helper text: "Max 5 links"

12. **Guest Invite Toggle**

- Component: `Switch` (RNP) / `Switch` (MUI) with label and explanation
- Layout:
  - Left: Label "Guests can invite others"
  - Right: Toggle switch
- Explanation text below: "When enabled, attendees can invite their friends to join the event."
- Default: Checked (true)
- Props: `value={guestsCanInvite}`, `onValueChange={setGuestsCanInvite}`
- Style:
  - Label: 14px, semibold
  - Explanation: 12px, regular, gray
  - Switch: Standard platform size13. **Action Buttons**
- Back: Returns to Screen 2, preserves data
- Next: Validates, navigates to Screen 4 (Review)

### Visual Hierarchy

**Typography:**

- Section Header: H6 (lg, 18px, semibold, #111827)
- Input Labels: Body2 (sm, 14px, medium, #6B7280)
- Input Text: Body1 (base, 16px, regular, #111827)
- Helper Text: Caption (sm, 12px, regular, #6B7280)
- Cohost Names: Body2 (sm, 14px, medium, #111827)
- Reliability Scores: Body2 (sm, 14px, semibold, color-coded)
- Link Titles: Body2 (sm, 14px, medium, #111827)
- Link URLs: Caption (sm, 12px, regular, #6B7280)

**Color Application:**

- Primary Actions: #3B82F6 (Blue) - Next button, active toggles
- Success: #10B981 (Green) - High reliability (≥85%)
- Warning: #F59E0B (Yellow/Amber) - Medium reliability (70-84%)
- Error: #EF4444 (Red) - Low reliability (<70%), validation errors
- Payment Section Background: #F0F9FF (Light blue tint)
- Text: #111827 (Gray-900) - Primary text
- Secondary Text: #6B7280 (Gray-500) - Labels, URLs

**Spacing:**

- Screen Padding: 16px (mobile), 24px (tablet/desktop)
- Section Margins: 24px between sections
- Input Spacing: 16px between form fields
- Checkbox Spacing: 12px between payment method options
- Chip Spacing: 8px gap between cohost chips
- Link Card Spacing: 12px gap between link cards
- Button Spacing: 16px between Back and Next

### Interaction States

**State Specifications:**

1. **Default State (Free Event)**
   - Capacity input empty (unlimited)
   - Cost input empty
   - Payment methods section hidden
   - No cohosts added
   - No links added
   - Guest invite toggle on (checked)
   - Next button enabled (no required fields on this screen)

2. **Paid Event State**
   - User enters cost value (e.g., "$15.00")
   - Payment Details section appears with animation (slide down)
   - "Payment Due By" radio group shows with "Immediately after RSVP" selected
   - Payment methods checkboxes all unchecked (optional)
   - Next button remains enabled (payment methods are optional, due date required)

3. **Payment Due Date Selected**
   - User taps different radio option ("24 hours before event")
   - Radio button animates selection
   - Previous selection deselects
   - Only one option selectable at a time

4. **Payment Method Selected State**
   - User checks Venmo checkbox
   - Input field becomes required (blue outline)
   - Validation runs on blur
   - Example: "@jsmith" (valid), "jsmith" (invalid - missing @)

5. **Cohosts Added State**
   - User clicks "+ Add Cohosts"
   - Modal opens (Screen 5)
   - After selection, chips appear below button
   - Each chip shows name + reliability score (color-coded)
   - Close button (×) on each chip to remove
   - If 5 cohosts added, "+ Add Cohosts" button disabled

6. **Links Added State**
   - User clicks "+ Add Link"
   - Modal opens (Screen 6)
   - After creation, link card appears below button
   - Card shows icon + title + URL
   - Close button (×) on each card to remove
   - If 5 links added, "+ Add Link" button disabled

7. **Guest Invite Toggle State**
   - Default: Switch on (blue), label + explanation visible
   - User taps: Switch animates off (gray)
   - Explanation text remains visible: "When enabled, attendees can invite their friends to join the event."
   - OFF state: Attendees cannot invite others (private event)

8. **Validation Error State (Payment)**
   - User checks Venmo but enters invalid username
   - Red border on input
   - Error message: "Venmo username must start with @"
   - Next button remains enabled (payment optional, just shows warning)

9. **Capacity Entered State**
   - User enters capacity: "12"
   - Validation: Must be positive integer ≥ 2
   - If invalid (0, 1, negative, decimal): Error "Capacity must be at least 2"
   - Preview will show "X/12 spots" instead of "X spots"

10. **All Valid State**

- No required fields on this screen
- Next button always enabled unless validation errors present
- User can skip capacity, payment methods, cohosts, links entirely

### Responsive Behavior

**Mobile (< 768px):**

- Single column layout
- Payment methods stack vertically
- Checkbox + input on separate lines for small screens
- Cohost chips wrap to multiple rows
- Link cards full width
- Buttons stacked at bottom

**Tablet (768px - 1024px):**

- Max width 600px centered
- Payment methods: 2 columns (Venmo/PayPal, Zelle/Cash)
- Cohost chips in flexible wrap layout
- Link cards full width
- Buttons inline

**Desktop (> 1024px):**

- Max width 800px centered
- Payment methods: 2×2 grid layout
- All elements use optimal spacing
- Hover states on all interactive elements

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**

1. **Color Contrast**
   - Labels on background: 4.7:1 ✓
   - Reliability scores: High contrast colors used
   - Payment section background: Sufficient contrast maintained

2. **Keyboard Navigation**
   - Tab order: Capacity → Cost → Payment checkboxes (if visible) → Payment inputs → Add Cohosts → Cohost chips → Add Link → Link cards → Guest toggle → Back → Next
   - Enter/Space activates checkboxes and buttons
   - Escape closes modals (Add Cohosts, Add Link)

3. **Screen Reader Support**
   - Capacity: `accessibilityLabel="Event capacity, 12 people"`
   - Cost: `accessibilityLabel="Cost per person, optional"`
   - Payment section: `accessibilityLabel="Payment methods required"`
   - Cohosts: `accessibilityLabel="Sarah Johnson, reliability 92 percent, remove button"`
   - Links: `accessibilityLabel="WhatsApp Group link, remove button"`
   - Toggle: `accessibilityLabel="Guests can invite others, enabled"`

4. **Touch Targets**
   - Dropdowns: 56px height
   - Checkboxes: 44×44px minimum
   - Chips close buttons: 32×32px (centered, touch area 44×44px)
   - Link card close buttons: 32×32px (touch area 44×44px)
   - Toggle switch: 48×28px (thumb 24px)

### Design Acceptance Criteria

**Visual QA Checklist:**

- [ ] Capacity input accepts numbers only, optional (unlimited if blank)
- [ ] Capacity validates: must be ≥ 2 if provided
- [ ] Cost input formats as currency ($15.00)
- [ ] Payment Details section only appears when cost input has value (not empty)
- [ ] Payment section has light gray background (#F9FAFB)
- [ ] "Payment Due By" radio group required with 3 options (immediate, 24h before, at event)
- [ ] "Payment Due By" defaults to "Immediately after RSVP"
- [ ] Payment methods are optional (hosts can arrange offline)
- [ ] CashApp option included alongside Venmo, PayPal, Zelle, Cash
- [ ] Payment method inputs validate format (Venmo @, PayPal email, CashApp $, Zelle phone/email)
- [ ] Cohost chips show name + reliability score (color-coded)
- [ ] Reliability score colors: Green ≥85%, Yellow 70-84%, Red <70%
- [ ] Max 5 cohosts enforced (button disables)
- [ ] Link cards show icon + title + URL (truncated)
- [ ] Max 5 links enforced (button disables)
- [ ] Guest invite toggle defaults to ON
- [ ] Guest invite explanation text clearly describes feature: "When enabled, attendees can invite their friends to join the event."
- [ ] Duration dropdown offers 30-minute increments from 0.5 to 6 hours (12 options)
- [ ] Back button preserves all data from previous screens
- [ ] Next button enabled unless validation errors present
- [ ] Next button does NOT require payment methods (optional)
- [ ] All fields on this screen are optional except validation rules
- [ ] Typography and colors match design system
- [ ] Spacing uses 8px grid
- [ ] All interaction states implemented (9 states)
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Touch targets meet 44×44px minimum

---

## Screen 4: Create Event Wizard - Step 4 (Review & Publish)

### Purpose

Final review screen showing event preview card with all details, community policy reminder, and publish confirmation.

### Layout Structure (Wireframe)

```
┌────────────────────────────────────────────┐
│  ← Back    Create Event          [X]       │ <- AppBar
├────────────────────────────────────────────┤
│  ○────○────○────●  Steps 4 of 4           │ <- Progress Indicator
├────────────────────────────────────────────┤
│                                            │
│  Review & Publish                          │ <- Section Header
│                                            │
│  📋 Event Preview                          │
│  ┌──────────────────────────────────────┐ │
│  │ Summer Pickleball Mix                │ │ <- Event Card
│  │                                      │ │   (matches browse view)
│  │ 🏓 Pickleball                        │ │
│  │ 📅 Nov 15, 2025 • 2:00 PM - 4:00 PM │ │
│  │ 📍 Lincoln Park Tennis Courts        │ │
│  │     123 Main St, Seattle, WA         │ │
│  │                                      │ │
│  │ Casual doubles pickleball for all    │ │
│  │ skill levels. Bring your paddle!     │ │
│  │                                      │ │
│  │ 👥 4/12 spots • 💰 $15/person        │ │
│  │                                      │ │
│  │ 🤝 Cohosts: Sarah J., Mike C.        │ │
│  │ 🔗 2 links • 👋 Guests can invite    │ │
│  │                                      │ │
│  │ Hosted by You • 92% reliable         │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [Edit Event Details]                      │ <- Edit Button
│                                            │
│                                            │
│  [← Back]              [🚀 Publish Event] │ <- Action Buttons
│                                            │
└────────────────────────────────────────────┘
```

### Component Composition

**Component Breakdown:**

1. **AppBar** (Same as previous screens)

2. **Progress Stepper**
   - Props: `activeStep=3`, `steps=['Basic Info', 'Location & Time', 'Details', 'Review']`
   - Style: Fourth dot filled blue (all complete)

3. **Event Preview Card**
   - Component: `Card` (RNP/MUI)
   - Props: `mode="elevated"`, `elevation=2`
   - Style: Matches exact appearance of event card in browse/discovery screens
   - Purpose: Show user exactly how their event will appear to others
   - Content (read-only):
     - **Title**: Event title (18px, bold)
     - **Sport Icon + Name**: Material Design icon + sport name
     - **Date/Time**: Formatted with emoji icons
     - **Location**: Court name + address (truncated if long)
     - **Description**: First 2 lines with ellipsis if longer
     - **Capacity**: "X/Y spots" where X=cohosts+1 (initial), Y=total capacity
     - **Cost**: "$15/person" or "Free" if no cost
     - **Cohosts**: "Cohosts: Sarah J., Mike C." (first names + initial, max 2 shown)
     - **Links**: "2 links" count
     - **Guest Invite**: "👋 Guests can invite" if enabled
     - **Host Info**: "Hosted by You • 92% reliable" (shows user's own score)
   - Pattern: Preview pattern - exact WYSIWYG representation

4. **Edit Details Button**
   - Component: `Button` (RNP/MUI)
   - Props: `mode="outlined"`, `icon="pencil"`
   - Action: Returns to Step 1 with all data preserved
   - Style: Secondary color, centered below card
   - Text: "Edit Event Details"

5. **Publish Event Button**
   - Component: `Button` (RNP/MUI)
   - Props: `mode="contained"`, `icon="rocket"`
   - Style:
     - Background: #3B82F6 (primary blue)
     - Large size (56px height mobile)
     - Prominent placement
   - States:
     - Disabled: Gray, checkbox not checked
     - Enabled: Blue, checkbox checked
     - Loading: Shows spinner, "Publishing..."
     - Success: Briefly shows checkmark before navigation
   - Text: "🚀 Publish Event"

6. **Back Button**
   - Returns to Step 3, preserves all data

### Visual Hierarchy

**Typography:**

- Section Header: H6 (lg, 18px, semibold, #111827)
- Event Card Title: H6 (base, 18px, bold, #111827)
- Event Card Body: Body2 (sm, 14px, regular, #374151)
- Event Card Meta: Caption (xs, 12px, regular, #6B7280)
- Alert Header: Body1 (base, 16px, semibold, #92400E) - dark amber
- Alert Body: Body2 (sm, 14px, regular, #78350F)
- Checkbox Label: Body2 (sm, 14px, medium, #111827)
- Policy Link: Body2 (sm, 14px, regular, #3B82F6)

**Color Application:**

- Primary Action: #3B82F6 (Blue) - Publish button
- Warning: #F59E0B (Amber) - Alert border, header icon
- Warning Background: #FFF7ED (Light orange) - Alert background
- Success: #10B981 (Green) - Brief success state after publish
- Text: #111827 (Gray-900) - Primary text
- Secondary Text: #6B7280 (Gray-500) - Meta info
- Alert Text: #92400E (Dark amber) - Alert emphasis

**Spacing:**

- Screen Padding: 16px (mobile), 24px (tablet/desktop)
- Section Margins: 24px between preview card and buttons
- Card Internal Padding: 16px
- Edit Button Margin: 16px top margin after card
- Button Spacing: 16px between Back and Publish

### Interaction States

**State Specifications:**

1. **Default State**
   - Preview card shows all event details
   - Publish button enabled (blue) and ready to publish
   - Helper text visible below buttons

2. **Edit Button Pressed**
   - User taps "Edit Event Details"
   - Navigates back to Step 1
   - All form data preserved across all steps
   - User can edit any field and return to Review

3. **View Policy Pressed**
   - User taps "View Full Policy"
   - Modal opens with full policy document
   - Modal has close button and scroll
   - User can read and close without leaving wizard

4. **Publishing State (Loading)**
   - User taps "Publish Event"
   - Button shows spinner + "Publishing..."
   - Button disabled during API call
   - Other buttons disabled
   - Progress indicator shows all steps complete

5. **Publish Success State**
   - API returns success (201 Created)
   - Button briefly shows checkmark + "Published!" (500ms)
   - Success toast/snackbar appears: "Event published successfully!"
   - Auto-navigate to event detail view (the published event)
   - Clear wizard data from state

6. **Publish Error State**
   - API returns error
   - Error toast/snackbar appears: "Failed to publish event. Please try again."
   - Button returns to enabled state
   - User can retry
   - Common errors:
     - Network error: "Check your connection"
     - Validation error: "Please review event details"
     - Duplicate: "You already have an event at this time"

7. **Back Button Pressed**
   - Returns to Step 3
   - All data preserved

### Responsive Behavior

**Mobile (< 768px):**

- Single column layout
- Preview card full width
- Alert box full width
- Buttons stacked at bottom
- Event description shows max 3 lines

**Tablet (768px - 1024px):**

- Max width 600px centered
- Preview card slightly wider
- Buttons inline (Back left, Publish right)

**Desktop (> 1024px):**

- Max width 800px centered
- Event description shows max 4 lines
- Hover state on Edit button
- Hover state on Publish button (slight scale)

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**

1. **Color Contrast**
   - Alert text on warning background: 7.3:1 ✓
   - Checkbox label on white: 16.2:1 ✓
   - Button text on blue: 4.5:1 ✓

2. **Keyboard Navigation**
   - Tab order: Edit Details → Checkbox → View Policy → Back → Publish
   - Enter/Space activates checkbox
   - Focus visible on all interactive elements

3. **Screen Reader Support**
   - Preview card: `accessibilityLabel="Event preview: Summer Pickleball Mix, November 15, 2:00 PM, Lincoln Park Tennis Courts"`
   - Edit button: `accessibilityLabel="Edit event details, button"`
   - Publish button: `accessibilityLabel="Publish Event, button"`
   - Loading state: `accessibilityLabel="Publishing event, please wait"`

4. **Touch Targets**
   - Edit button: 48px height
   - Publish button: 56px height (mobile)
   - Back button: 48px height

### Design Acceptance Criteria

**Visual QA Checklist:**

- [ ] Preview card matches exact appearance of event card in browse screens (WYSIWYG)
- [ ] Preview shows all entered data: title, sport, date, time, location, description, capacity, cost, cohosts, links, guest invite
- [ ] Host reliability score displays (user's own score)
- [ ] Edit Details button returns to Step 1 with all data preserved
- [ ] Publish button enabled immediately (no checkbox required)
- [ ] Publish button shows loading state during API call
- [ ] Publish button shows brief success state (checkmark + "Published!")
- [ ] Success toast appears: "Event published successfully!"
- [ ] Error toast appears on failure with specific message
- [ ] On success, navigates to published event detail view
- [ ] On success, wizard data cleared from state
- [ ] Back button preserves all data
- [ ] Typography and colors match design system
- [ ] Spacing uses 8px grid
- [ ] All interaction states implemented (6 states)
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Touch targets meet 44×44px minimum

---

## Screen 5: Add Cohosts Modal

### Purpose

Modal screen for searching and selecting friends or groups to add as event cohosts, showing reliability scores to help hosts make informed decisions.

### Layout Structure (Wireframe)

```
┌────────────────────────────────────────────┐
│  Add Cohosts                       [X]     │ <- Modal Header
├────────────────────────────────────────────┤
│                                            │
│  🔍 Search friends or groups               │
│  ┌──────────────────────────────────────┐ │ <- Search Input
│  │ [Sarah________________________]      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │ <- Filter Chips
│  │ [All] [Friends] [Groups]             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Results (12)                              │ <- Results Header
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 👤 Sarah Johnson              [Add]  │ │ <- Friend Item
│  │    92% reliable • 15 events hosted   │ │   (high score - green)
│  ├──────────────────────────────────────┤ │
│  │ 👤 Mike Chen                  [Add]  │ │
│  │    88% reliable • 23 events hosted   │ │
│  ├──────────────────────────────────────┤ │
│  │ 👥 Downtown Pickleball Group  [Add]  │ │ <- Group Item
│  │    12 members • Active group         │ │
│  ├──────────────────────────────────────┤ │
│  │ 👤 Alex Rivera                [Add]  │ │
│  │    76% reliable • 8 events hosted    │ │   (medium - yellow)
│  ├──────────────────────────────────────┤ │
│  │ 👤 Jordan Lee                 [Add]  │ │
│  │    64% reliable • 5 events hosted    │ │   (low - red)
│  └──────────────────────────────────────┘ │
│                                            │
│  📋 Selected Cohosts (2/5)                 │ <- Selected Section
│  ┌──────────────────────────────────────┐ │
│  │ Sarah Johnson (92%)           [×]    │ │ <- Selected Chip
│  │ Mike Chen (88%)               [×]    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Max 5 cohosts                             │ <- Helper Text
│                                            │
│                                            │
│  [Cancel]                  [Done (2)]     │ <- Action Buttons
└────────────────────────────────────────────┘
```

### Component Composition

**Component Breakdown:**

1. **Modal Header**
   - Component: `Modal` (RNP) / `Dialog` (MUI)
   - Props: `visible={showAddCohostsModal}`, `onDismiss={handleCancel}`
   - Title: "Add Cohosts"
   - Close button: X icon in top-right
   - Style: Full-screen mobile, centered 600px max-width desktop

2. **Search Input**
   - Component: `Searchbar` (RNP) / `TextField` (MUI)
   - Props: `placeholder="Search friends or groups"`, `icon="magnify"`
   - Debounce: 300ms delay
   - Action: Filters results list in real-time
   - Clear button: X appears when text entered

3. **Filter Chips**
   - Component: `Chip` (RNP/MUI) in group
   - Options: "All", "Friends", "Groups"
   - Props: `mode="outlined"` for unselected, `mode="flat"` for selected
   - Default: "All" selected
   - Action: Filters results by type
   - Style: Blue background when selected, gray outline when not

4. **Results List**
   - Component: `FlatList` (RNP) / `List` (MUI)
   - Header: "Results (12)" - shows count dynamically
   - Empty state: "No friends or groups found"
   - Loading state: Skeleton loader (3 items)

5. **Friend List Item**
   - Component: `List.Item` (RNP) / `ListItem` (MUI)
   - Layout:
     - Left: Avatar (user photo or default icon)
     - Center: Name (top), reliability + events (bottom)
     - Right: "Add" button
   - Reliability Score Display:
     - Format: "92% reliable"
     - Color:
       - Green (#10B981): ≥85%
       - Yellow (#F59E0B): 70-84%
       - Red (#EF4444): <70%
     - Weight: Semibold for emphasis
   - Events Count: "15 events hosted" (regular, gray)
   - Pattern: Trust indicator from UX Spec Section 6.1

6. **Group List Item**
   - Component: `List.Item` (RNP) / `ListItem` (MUI)
   - Layout: Similar to friend item
   - Icon: Group icon (👥) instead of avatar
   - Info: "12 members • Active group" (no reliability score)
   - Note: Groups can be cohosts but don't have individual reliability

7. **Add Button (List)**
   - Component: `Button` (RNP/MUI)
   - Props: `mode="outlined"`, `compact=true`
   - Text: "Add"
   - State:
     - Default: Blue outline, "Add"
     - After click: Transforms to "Added" with checkmark, brief moment
     - Then: Item moves to Selected section, button disappears from list
   - Disabled: If already 5 cohosts selected

8. **Selected Section**
   - Header: "📋 Selected Cohosts (2/5)" - shows count dynamically
   - Visibility: Only shown if at least 1 cohost selected
   - Background: Light blue tint (#F0F9FF)
   - Padding: 12px

9. **Selected Cohost Chip**
   - Component: `Chip` (RNP/MUI)
   - Display: "Name (Score%)"
   - Example: "Sarah Johnson (92%)"
   - Props: `mode="outlined"`, `onClose={removeCohost}`
   - Style: Blue border, white background
   - Close button: × in right side
   - Score color: Same as list (green/yellow/red)

10. **Helper Text**
    - Component: `Text` (RNP) / `Typography` (MUI)
    - Text: "Max 5 cohosts"
    - Style: 12px, gray, centered
    - Updates: When at limit, turns red: "Maximum cohosts reached"

11. **Action Buttons**
    - Cancel: Closes modal, discards selections
    - Done: Closes modal, saves selections to parent form
    - Done shows count: "Done (2)" when cohosts selected
    - Done disabled if no selections made

### Visual Hierarchy

**Typography:**

- Event Card Title: H6 (base, 18px, bold, #111827)
- Event Card Body: Body2 (sm, 14px, regular, #374151)
- Event Card Meta: Caption (xs, 12px, regular, #6B7280)
- Helper Text: Caption (xs, 12px, regular, #6B7280)

**Color Application:**

- Primary Action: #3B82F6 (Blue) - Publish button
- Text: #111827 (Gray-900) - Primary text
- Secondary Text: #6B7280 (Gray-500) - Meta info, helper text

**Spacing:**

- Modal Padding: 16px (mobile), 24px (desktop)
- Search Input Margin: 16px bottom
- Filter Chips Margin: 12px bottom
- List Item Height: 72px (avatar + 2 lines)
- List Item Padding: 12px vertical, 16px horizontal
- Selected Section Padding: 12px
- Chip Spacing: 8px gap
- Button Spacing: 16px between Cancel and Done

### Interaction States

**State Specifications:**

1. **Default State (Empty)**
   - Search input empty
   - "All" filter selected
   - Results list shows all friends/groups (sorted by reliability)
   - No selections in Selected section
   - Done button disabled

2. **Searching State**
   - User typing in search
   - Results filter in real-time (300ms debounce)
   - Example: "Sar" shows "Sarah Johnson", "Sarah Lee"
   - Results header updates: "Results (2)"

3. **Filter Changed State**
   - User taps "Friends" chip
   - "All" chip deselects, "Friends" chip selects (blue background)
   - Results list filters to show only friends (hide groups)
   - Results header updates count

4. **Add Cohost State**
   - User taps "Add" on Sarah Johnson
   - Button briefly shows "Added" with checkmark (300ms)
   - Sarah moves to Selected section as chip
   - Sarah disappears from results list (can't add twice)
   - Selected header updates: "Selected Cohosts (1/5)"
   - Done button enables: "Done (1)"

5. **Remove Cohost State**
   - User taps × on Sarah's chip in Selected section
   - Chip animates out (fade + scale)
   - Sarah reappears in results list with "Add" button
   - Selected header updates: "Selected Cohosts (0/5)"
   - Done button disables if now empty

6. **Max Cohosts Reached State**
   - User has selected 5 cohosts
   - All "Add" buttons in results list disabled (grayed out)
   - Helper text turns red: "Maximum cohosts reached"
   - Selected section shows all 5 chips
   - Done button shows: "Done (5)"

7. **Empty Results State**
   - User searches "xyz" - no matches
   - Results list shows empty state message
   - Empty state: Icon + "No friends or groups found" + "Try different keywords"

8. **Loading State**
   - Initial load when modal opens
   - Skeleton loader shows 3 placeholder items
   - Search input enabled
   - Results appear after API response

9. **Cancel State**
   - User taps Cancel or × button
   - Modal closes with animation
   - All selections discarded (not saved to form)
   - Form's cohost section unchanged

10. **Done State**
    - User taps "Done (2)"
    - Modal closes
    - Selected cohosts save to parent form (Screen 3)
    - Chips appear in Screen 3's cohost section
    - Success: Brief toast "2 cohosts added"

### Responsive Behavior

**Mobile (< 768px):**

- Full-screen modal
- Single column list
- Avatar 40px size
- Filter chips wrap if needed
- Buttons full width at bottom

**Tablet (768px - 1024px):**

- Modal 600px centered with backdrop
- List items slightly wider spacing
- Avatar 48px size

**Desktop (> 1024px):**

- Modal 600px max-width centered
- Hover states on list items
- Hover states on Add buttons
- Keyboard navigation fully supported

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**

1. **Color Contrast**
   - Friend names on white: 16.2:1 ✓
   - Reliability scores: High contrast with colored text
   - Green score on white: 3.5:1 ✓

2. **Keyboard Navigation**
   - Tab order: Close → Search → Filter chips → Result items → Selected chips → Cancel → Done
   - Enter/Space activates buttons and chips
   - Escape closes modal
   - Arrow keys navigate list items

3. **Screen Reader Support**
   - Modal: `accessibilityRole="dialog"`, `accessibilityLabel="Add cohosts dialog"`
   - Friend item: `accessibilityLabel="Sarah Johnson, 92 percent reliable, 15 events hosted, add as cohost button"`
   - Selected chip: `accessibilityLabel="Sarah Johnson, 92 percent reliable, remove button"`
   - Filter chips: `accessibilityRole="radio"`, `accessibilityState={selected: true}`
   - Done button: `accessibilityLabel="Done, 2 cohosts selected"`

4. **Touch Targets**
   - List items: 72px height (full row tappable)
   - Add buttons: 36px height × 60px width (compact)
   - Chip close buttons: 32×32px (touch area 44×44px)
   - Filter chips: 36px height

### Design Acceptance Criteria

**Visual QA Checklist:**

- [ ] Modal opens with animation (slide up mobile, fade in desktop)
- [ ] Search input debounces at 300ms
- [ ] Filter chips toggle between All/Friends/Groups
- [ ] Results list sorted by reliability score (high to low)
- [ ] Friend items show avatar + name + reliability + events count
- [ ] Group items show group icon + name + member count
- [ ] Reliability scores color-coded: Green ≥85%, Yellow 70-84%, Red <70%
- [ ] Add button changes to "Added" briefly then item moves to Selected section
- [ ] Selected section only visible when at least 1 cohost selected
- [ ] Selected chips show name + reliability score (color-coded)
- [ ] Chip close button (×) removes from selection
- [ ] Removed cohosts reappear in results list
- [ ] Max 5 cohosts enforced (Add buttons disable at limit)
- [ ] Helper text turns red at limit: "Maximum cohosts reached"
- [ ] Results header shows dynamic count: "Results (12)"
- [ ] Selected header shows dynamic count: "Selected Cohosts (2/5)"
- [ ] Done button shows count: "Done (2)"
- [ ] Done button disabled when no selections
- [ ] Cancel discards all selections
- [ ] Done saves selections to parent form
- [ ] Empty state shows when no results
- [ ] Loading state shows skeleton loader
- [ ] Typography and colors match design system
- [ ] Spacing uses 8px grid
- [ ] All interaction states implemented (10 states)
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Touch targets meet minimum sizes

---

## Screen 6: Add Link Modal

### Purpose

Modal screen for adding external links to events with icon picker and URL validation.

### Layout Structure (Wireframe)

```
┌────────────────────────────────────────────┐
│  Add Link                          [X]     │ <- Modal Header
├────────────────────────────────────────────┤
│                                            │
│  Select Icon *                             │
│                                            │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │ <- Icon Grid
│  │ 💬  │ │ 📱  │ │ 📘  │ │ 📷  │          │   (2 rows × 4 cols)
│  │Discrd│ │WhtsAp│ │Facebk│ │Instgrm│          │
│  └─────┘ └─────┘ └─────┘ └─────┘          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ 📍  │ │ 📹  │ │ ✈️  │ │ ✉️  │          │
│  │ Maps │ │YouTub│ │Telegrm│ │EmailGrp│          │
│  └─────┘ └─────┘ └─────┘ └─────┘          │
│                                            │
│  Link Title *                              │
│  ┌──────────────────────────────────────┐ │
│  │ [WhatsApp Group__________________]   │ │ <- Text Input
│  └──────────────────────────────────────┘ │
│  3-50 characters                           │
│                                            │
│  Link URL *                                │
│  ┌──────────────────────────────────────┐ │
│  │ [https://chat.whatsapp.com/xyz___]   │ │ <- URL Input
│  └──────────────────────────────────────┘ │
│  ✓ Valid URL                               │
│                                            │
│  📋 Preview                                │
│  ┌──────────────────────────────────────┐ │ <- Preview Card
│  │ 📱 WhatsApp Group                    │ │
│  │ https://chat.whatsapp.com/xyz        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│                                            │
│  [Cancel]                      [Add Link] │ <- Action Buttons
└────────────────────────────────────────────┘
```

### Component Composition

**Component Breakdown:**

1. **Modal Header**
   - Component: `Modal` (RNP) / `Dialog` (MUI)
   - Props: `visible={showAddLinkModal}`, `onDismiss={handleCancel}`
   - Title: "Add Link"
   - Close button: X icon
   - Style: Full-screen mobile, 500px centered desktop

2. **Icon Selector Grid**
   - Component: Pressable `Card` (RNP) / Clickable `Card` (MUI)
   - Layout: Grid 2 rows × 4 columns (8 total icons)
   - Icons (Material Design):
     1. **Discord**: `mdi-discord` (💬)
     2. **WhatsApp**: `mdi-whatsapp` (📱)
     3. **Facebook**: `mdi-facebook` (📘)
     4. **Instagram**: `mdi-instagram` (📷)
     5. **Maps**: `mdi-map-marker` (📍)
     6. **YouTube**: `mdi-youtube` (📹)
     7. **Telegram**: `mdi-telegram` (✈️)
     8. **Email Group**: `mdi-email-multiple` (✉️)
   - Card size: 60×60px (mobile), 70×70px (desktop)
   - Selected state:
     - Border: 2px solid #3B82F6
     - Background: #EFF6FF (light blue)
     - Elevation: 4
   - Default state:
     - Border: 1px solid #E5E7EB
     - Background: white
     - Elevation: 1
   - Validation: Required (must select one icon)

3. **Link Title Input**
   - Component: `TextInput` (RNP) / `TextField` (MUI)
   - Props: `label="Link Title *"`, `mode="outlined"`, `maxLength=50`
   - Validation: 3-50 characters, required
   - Helper text: "3-50 characters"
   - Error: "Title must be 3-50 characters"
   - Auto-suggestion: If WhatsApp icon selected, suggests "WhatsApp Group"

4. **Link URL Input**
   - Component: `TextInput` (RNP) / `TextField` (MUI)
   - Props: `label="Link URL *"`, `mode="outlined"`, `keyboardType="url"`
   - Validation: Valid URL format, required
   - Pattern: Must start with http:// or https://
   - Helper text: "✓ Valid URL" (green) or "✗ Invalid URL format" (red)
   - Error: "Please enter a valid URL starting with https://"

5. **Preview Card**
   - Component: `Card` (RNP/MUI)
   - Props: `mode="outlined"`
   - Style: Gray border, white background
   - Content:
     - Selected icon (large, 24px)
     - Link title (16px, semibold)
     - Link URL (14px, regular, gray, truncated with ellipsis)
   - Purpose: Show exactly how link will appear in event
   - Pattern: WYSIWYG preview

6. **Add Link Button**
   - Component: `Button` (RNP/MUI)
   - Props: `mode="contained"`, `disabled={!isValid}`
   - Text: "Add Link"
   - Validation: Disabled until all fields valid (icon + title + URL)
   - Success: Closes modal, adds link to parent form

7. **Cancel Button**
   - Closes modal, discards input

### Visual Hierarchy

**Typography:**

- Modal Title: H6 (lg, 18px, semibold, #111827)
- Section Labels: Body1 (base, 16px, medium, #6B7280)
- Icon Labels: Caption (xs, 11px, regular, #6B7280)
- Input Labels: Body2 (sm, 14px, medium, #6B7280)
- Input Text: Body1 (base, 16px, regular, #111827)
- Helper Text: Caption (sm, 12px, regular, #6B7280 or #10B981/green)
- Preview Title: Body1 (base, 16px, semibold, #111827)
- Preview URL: Body2 (sm, 14px, regular, #6B7280)

**Color Application:**

- Primary: #3B82F6 (Blue) - Selected icon, Add button
- Success: #10B981 (Green) - Valid URL indicator
- Error: #EF4444 (Red) - Invalid URL message
- Selected Background: #EFF6FF (Light blue) - Selected icon card
- Text: #111827 (Gray-900) - Primary text
- Secondary Text: #6B7280 (Gray-500) - Labels, URLs

**Spacing:**

- Modal Padding: 16px (mobile), 24px (desktop)
- Icon Grid Gap: 8px between cards
- Section Margins: 20px between sections
- Input Spacing: 16px between inputs
- Preview Margin: 20px top margin
- Button Spacing: 16px between Cancel and Add

### Interaction States

**State Specifications:**

1. **Default State**
   - No icon selected (all default state)
   - Title input empty
   - URL input empty
   - Preview card hidden
   - Add Link button disabled

2. **Icon Selected State**
   - User taps WhatsApp icon
   - Card border turns blue, background tints
   - Other icons remain in default state (only one selectable)
   - Title input auto-suggests "WhatsApp Group"
   - Preview card appears (even if title/URL empty)

3. **Icon Changed State**
   - User taps different icon (Discord)
   - Previous icon (WhatsApp) returns to default
   - New icon (Discord) becomes selected
   - Title suggestion updates to "Discord Server"
   - Preview updates with new icon

4. **Title Input State**
   - User types in title
   - Character counter updates: "15/50 characters"
   - Preview title updates in real-time
   - Validation runs on blur

5. **URL Input Valid State**
   - User types valid URL: "https://chat.whatsapp.com/xyz"
   - Helper text shows green checkmark: "✓ Valid URL"
   - URL input border turns green briefly
   - Preview URL updates in real-time
   - Add Link button enables (if all fields valid)

6. **URL Input Invalid State**
   - User types invalid URL: "whatsapp.com" (missing https://)
   - Helper text shows red X: "✗ Invalid URL format"
   - Error message: "Please enter a valid URL starting with https://"
   - URL input border turns red
   - Add Link button disabled

7. **All Valid State**
   - Icon selected: WhatsApp
   - Title filled: "WhatsApp Group" (3-50 chars)
   - URL valid: "https://chat.whatsapp.com/xyz"
   - Preview card shows complete link appearance
   - Add Link button enabled (blue)

8. **Add Link Success**
   - User taps "Add Link"
   - Modal closes with animation
   - Link saves to parent form (Screen 3)
   - New link card appears in Screen 3's links section
   - Success toast: "Link added successfully"

9. **Cancel State**
   - User taps Cancel or X
   - Modal closes
   - All input discarded

### Responsive Behavior

**Mobile (< 768px):**

- Full-screen modal
- Icon grid: 5 columns, smaller icons (60×60px)
- Single column inputs
- Preview card full width
- Buttons full width at bottom

**Tablet (768px - 1024px):**

- Modal 500px centered
- Icon grid: 5 columns, larger icons (70×70px)
- Inputs optimal width
- Buttons inline

**Desktop (> 1024px):**

- Modal 500px centered
- Hover states on icon cards
- Keyboard navigation supported

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**

1. **Color Contrast**
   - Icon labels on white: 4.5:1 ✓
   - Input labels: 4.7:1 ✓
   - Preview text: 16.2:1 ✓

2. **Keyboard Navigation**
   - Tab order: Close → Icons (left-to-right, top-to-bottom) → Title → URL → Cancel → Add Link
   - Arrow keys navigate icon grid
   - Enter/Space selects icon

3. **Screen Reader Support**
   - Modal: `accessibilityRole="dialog"`, `accessibilityLabel="Add link dialog"`
   - Icon cards: `accessibilityLabel="WhatsApp icon"`, `accessibilityRole="radio"`
   - Title input: `accessibilityLabel="Link title, required, 3 to 50 characters"`
   - URL input: `accessibilityLabel="Link URL, required, enter valid web address"`
   - Preview: `accessibilityLabel="Link preview: WhatsApp Group, URL https://chat.whatsapp.com/xyz"`

4. **Touch Targets**
   - Icon cards: 60×60px minimum (exceeds 44×44px)
   - Input fields: 56px height
   - Buttons: 48px height

### Design Acceptance Criteria

**Visual QA Checklist:**

- [ ] Modal opens with animation
- [ ] Icon grid shows 8 Material Design icons (2 rows × 4 columns)
- [ ] Icons use `mdi-*` icons, NOT emojis
- [ ] Email Group icon uses `mdi-email-multiple` (not single email)
- [ ] Website and Slack icons removed from options
- [ ] Only one icon selectable at a time
- [ ] Selected icon has blue border and light blue background
- [ ] Icon selection auto-suggests title based on platform
- [ ] Title input validates 3-50 characters
- [ ] URL input validates https:// or http:// format
- [ ] Valid URL shows green checkmark helper text
- [ ] Invalid URL shows red X and error message
- [ ] Preview card updates in real-time as user types
- [ ] Preview matches exact link card appearance in event
- [ ] Add Link button disabled until all fields valid
- [ ] Add Link saves to parent form and closes modal
- [ ] Cancel discards all input
- [ ] Success toast appears: "Link added successfully"
- [ ] Typography and colors match design system
- [ ] Spacing uses 8px grid
- [ ] All interaction states implemented (9 states)
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Touch targets meet 44×44px minimum

---

## Visual Specification Complete

---

## Dependencies

**New Dependencies Required:**

**Mobile:**

- `react-native-paper-dates` - DatePickerModal, TimePickerModal

**Web:**

- `@mui/x-date-pickers` - DatePicker, TimePicker
- `@date-io/date-fns` - Date adapter
- `date-fns` - Date utilities

---

## Implementation Notes

1. **Deposit Removal**: Completely remove deposit section per `refundable_deposit_strategies.md` research
2. **Internal DB Autocomplete**: Query internal court database, NOT Google Maps API (cost reduction)
3. **Material Design Icons**: Use `mdi-*` icons, NOT emojis for sport selector
4. **Native Pickers**: Use date/time picker libraries, NOT text inputs
5. **Multi-Step Wizard**: Implement as separate steps with progress tracking, NOT single-page form

---

**Last Updated:** 2025-11-10  
**Version:** BMad Method v6.0.0-alpha.4

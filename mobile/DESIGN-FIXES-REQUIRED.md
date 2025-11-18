# Design Fixes Required - Based on Premium Athletic V2 HTML

**Date**: November 16, 2025

## Step 2 Fixes Applied ✅

### 1. Removed "EVENT DETAILS & SOCIAL" Header ✅

**Before**: Had a large section header at the top
**After**: Removed - sections start immediately with icon + title + "+ Add" button

### 2. Replaced Placeholder Cards with Inline "+ Add" Buttons ✅

**Before**: Empty state showed dashed placeholder cards
**After**: Just show the section header with inline "+ Add" button (matching HTML design exactly)

### 3. Added Section Dividers ✅

**Before**: No visual separation between sections
**After**: Added `<View style={styles.sectionDivider} />` between all 4 sections

## Remaining Modal Fixes Needed

### Co-hosts Modal ❌ NEEDS FIX

**Issues**:

1. Not full-page modal (should be 390x844px like HTML)
2. Missing mock search results data
3. Wrong color scheme

**Required**:

```tsx
- Show search input at top
- Show 3-6 mock users with:
  * Avatar circles with gradient backgrounds
  * Name, Level, XP, Reliability %
  * "Add" button on the right (not selected yet)
- Use #1e1e1e background
- Use #ff6b35 for accents and "Add" buttons
- Cancel/Done buttons at bottom
```

### Links Modal ❌ NEEDS FIX

**Issues**:

1. Not full-page modal
2. Wrong colors

**Required**:

```tsx
- Full-page modal (390x844px)
- Dark theme: #1e1e1e background
- Orange accents: #ff6b35
- Icon picker with emoji buttons
- Cancel/"Add Link" gradient buttons
```

### Questionnaire Modal ❌ NEEDS FIX

**Issues**:

1. Not full-page modal
2. Wrong colors
3. Type selector using BUTTONS instead of DROPDOWN

**Required**:

```tsx
- Full-page modal (390x844px)
- Dark theme: #1e1e1e background
- Question type as <Picker> dropdown with options:
  * Short Answer
  * Multiple Choice
  * Email
- NOT buttons - use Picker/select component
- Required toggle (compact orange style)
- Cancel/Save gradient buttons
```

### Reminders Modal Status

**Status**: Need to verify if it matches design

## Color Schema Rules

ALL modals must use:

- **Background**: `#1e1e1e` (dark gray)
- **Surface/Cards**: `rgba(255, 255, 255, 0.05)` to `0.08`
- **Borders**: `rgba(255, 255, 255, 0.1)` to `0.15`
- **Primary Orange**: `#ff6b35`
- **Orange Hover**: `#ff8c42`
- **Gradient**: `linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `rgba(255, 255, 255, 0.6)` to `0.7`
- **Text Muted**: `rgba(255, 255, 255, 0.4)` to `0.5`

## Next Steps

1. ✅ Step2Social.premium.tsx - FIXED (removed header, added separators, inline + Add buttons)
2. ❌ Fix AddCohostsModal - Make full-page, add mock data, fix colors
3. ❌ Fix AddLinkModal - Make full-page, fix colors
4. ❌ Fix AddQuestionnaireModal - Make full-page, change to dropdown, fix colors
5. ❌ Verify AddRemindersModal matches design

---

**Reference**: `/Users/wlyu/dev/AI-PROJECT/gss_client/docs/design/explorations/exploration-2-premium-athletic-v2.html`

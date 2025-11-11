# Visual Design Handoff Workflow

## Purpose

This workflow solves the **design-to-development miscommunication** problem by translating high-level UX Design Specifications into concrete, actionable visual requirements that developers can implement.

## The Problem It Solves

**Before:**

- UX Designer creates philosophical UX Design Specification with user journeys and design patterns
- Dev Agent receives technical story with functional acceptance criteria
- **GAP:** No concrete visual specifications (wireframes, component composition, interaction details)
- **Result:** Developer correctly uses design system components but misses the UX vision

**After:**

- UX Designer creates UX Design Specification (strategic vision)
- **NEW STEP:** UX Designer runs visual-handoff workflow for each UI story
- **Result:** Developer receives detailed visual specification with wireframes, component specs, and design acceptance criteria
- **Outcome:** Implementation matches UX vision precisely

## When to Use

Run this workflow **after** UX Design Specification is complete and **before** developer starts implementing a UI-focused story.

**Required Inputs:**

1. Completed UX Design Specification (`docs/ux-design-specification.md`)
2. Design System document (`docs/design-system.md`) - optional but recommended
3. Story file requiring visual design (`docs/stories/X-Y-story-name.md`)

## Workflow Flow

```
UX Design Spec (complete)
         ↓
   Story Created (drafted)
         ↓
 *visual-handoff* workflow ←── YOU RUN THIS
         ↓
Visual Spec Generated
         ↓
Story Updated with Visual Requirements
         ↓
Developer Implements (with visual guidance)
         ↓
UX Designer Reviews (using design acceptance criteria)
```

## How to Run

### 1. Load UX Designer Agent

```bash
@ux-designer
```

### 2. Select Visual Handoff

From the menu:

```
5. *visual-handoff - Create Visual Design Handoff for a Story
```

### 3. Provide Story Information

The workflow will ask:

- Which story needs visual specification?
- Provide story key (e.g., "2-1-host-event-creation") or path

### 4. Review and Approve

The workflow will:

- Map UX patterns to story requirements
- Generate detailed visual specifications with wireframes
- Ask if you want to update the story and context files

### 5. Approve Visual Spec

Review the generated visual specification:

- Check wireframes match your UX vision
- Verify component composition is correct
- Ensure interaction states are comprehensive
- Approve or request revisions

## What Gets Created

### Primary Output: Visual Specification Document

Location: `docs/stories/[story-key]-visual-spec.md`

Contains:

- **ASCII Wireframes** - Text-based layout structure for each screen
- **Component Composition** - Exact React Native Paper / MUI components to use
- **Visual Hierarchy** - Typography scale, colors, spacing with exact values
- **Interaction States** - All 7 states (default, hover, focus, pressed, disabled, error, loading)
- **Responsive Behavior** - Mobile, tablet, desktop layouts
- **Accessibility Requirements** - WCAG 2.1 AA compliance details
- **Design Acceptance Criteria** - Checklist for visual QA
- **Implementation Notes** - Do's and don'ts with examples

### Secondary Outputs (Optional)

1. **Story File Update**
   - Adds "Visual Design Requirements" section
   - Links to visual specification
   - Includes design acceptance criteria checklist

2. **Story Context Update** (`.context.xml`)
   - Adds UX Design Spec references
   - Adds Design System references
   - Adds visual design constraints
   - Ensures developer sees visual requirements

## Example Visual Spec Content

```markdown
# Visual Specification: Host Event Creation

## CreateEventScreen

### Layout Structure (Wireframe)

┌────────────────────────────────────┐
│ ← Back Create Event [1/3] │
├────────────────────────────────────┤
│ Your Streak: 🔥 8 days │
│ Reliability: 92% ⭐ │
├────────────────────────────────────┤
│ Event Title* │
│ [___________________________] │
│ │
│ Choose Sport* │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ 🏓 │ │ 🏀 │ │ ⚽ │ │
│ │Pickle│ │Basket│ │Soccer│ │
│ └──────┘ └──────┘ └──────┘ │
├────────────────────────────────────┤
│ [Next Step →] │
└────────────────────────────────────┘

### Component Composition

**Sport Selector:**

- Component: `Card` (React Native Paper)
- Layout: Horizontal ScrollView with Card grid
- Card Specs:
  - Size: 120px × 100px
  - Icon: Material Design icon (not emoji)
  - Selected state: Primary blue border (3px), blue bg (10% opacity)
  - Pattern Reference: UX Spec Section 6.1 "Event Discovery Components"

### Visual Hierarchy

**Typography:**

- Page Title: H4 (24px, semibold, #111827)
- Section Labels: Body2 (14px, medium, #6B7280)
- Input Text: Base (16px, regular, #111827)

**Colors:**

- Primary Actions: #3B82F6 (Trust & Reliability Blue)
- Selected States: #3B82F6 with 10% opacity background

### Interaction States

1. **Default State:** Card with gray border, white background
2. **Pressed State:** Card scales to 98%, primary blue border
3. **Selected State:** Primary blue border (3px), blue background (10%)

### Design Acceptance Criteria

- [ ] Layout uses stepped wizard (not single-page form)
- [ ] Sport selector uses Cards (NOT toggle buttons)
- [ ] Reliability context visible at top
- [ ] Typography matches design system scale
- [ ] Touch targets meet 44×44px minimum
```

## Integration with Dev Workflow

### Developer Receives:

1. **Story File** with visual requirements section
2. **Story Context** with UX/design references embedded
3. **Visual Specification** with detailed implementation guidance

### Developer Process:

1. Read story acceptance criteria (functional requirements)
2. Read visual specification (visual requirements)
3. Implement following wireframes and component specs
4. Check design acceptance criteria before marking story complete

### UX Designer Review:

1. Developer marks story as "ready-for-review"
2. UX Designer reviews using design acceptance criteria checklist
3. Approve or request visual corrections
4. Iterate until visual quality meets UX specification

## Best Practices

### ✅ Do's

- Run visual-handoff for **every UI-focused story**
- Create wireframes for **all screens**, even simple ones
- Specify **exact component names** from React Native Paper / MUI
- Include **all 7 interaction states** for interactive elements
- Link to **specific UX Spec sections** for pattern references
- Use **design acceptance criteria** as QA checklist

### ❌ Don'ts

- Don't skip visual-handoff and assume story is enough
- Don't use vague descriptions ("make it look nice")
- Don't invent new patterns not in UX Spec
- Don't skip wireframes for "obvious" layouts
- Don't forget to update story context with UX references
- Don't approve implementation without checking design criteria

## Workflow Files

- **Configuration:** `workflow.yaml`
- **Instructions:** `instructions.md`
- **Validation:** `checklist.md`
- **This Guide:** `README.md`

## Related Workflows

**Before This:**

- `create-ux-design` - Creates UX Design Specification

**After This:**

- `story-context` - Assembles story context (includes visual spec references)
- `dev-story` - Developer implements story (following visual spec)
- `code-review` - Reviews implementation (checks design acceptance criteria)

## Questions?

See also:

- UX Design Specification: `docs/ux-design-specification.md`
- Design System: `docs/design-system.md`
- Story Context Workflow: `bmad/bmm/workflows/4-implementation/story-context/`

---

**Version:** 1.0  
**Created:** November 10, 2025  
**Author:** BMad

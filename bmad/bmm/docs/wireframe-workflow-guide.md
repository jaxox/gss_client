# Wireframe-First Workflow Guide

**Updated:** 2025-11-10  
**Version:** BMad Method v6.0.0-alpha.4

---

## What Changed

The UX Designer workflow now generates **visual wireframes BEFORE implementation** to ensure everyone agrees on the structure before coding begins.

## When Wireframes Are Generated

### Scenario 1: Full UX Design Workflow (`*create-design`)

**Step 5b** (NEW): After design direction mockups, before user journey design

```
Steps:
1-5a: Design exploration (colors, themes, design directions)
5b:   Generate wireframes for key screens ← NEW STEP
6:    User journey design
7-10: Component library, patterns, finalization
```

### Scenario 2: Visual Handoff (`*visual-handoff`)

Generates wireframes as part of story visual specification

```
Steps:
1: Load UX/Design docs
2: Identify story
3: Analyze UI requirements
4: Map UX patterns to components
5: Create visual spec WITH wireframes ← INCLUDES WIREFRAMES
6: Update story file
7: Update story context
8: Completion summary
```

## New Workflow Pattern

### Old Pattern (Direct Implementation)

```
User: "Build the event creation screen"
Agent: *generates full component code immediately*
User: "Wait, I wanted the buttons on the left..."
Agent: *rewrites entire component*
```

### New Pattern (Wireframe First) ✅

```
User: "Build the event creation screen"
Agent: *generates ASCII wireframe showing layout*

        ┌────────────────────────┐
        │  Title  [Button]       │
        ├────────────────────────┤
        │  Form fields...        │
        │  [Cancel]  [Submit] ←  │ Buttons on right
        └────────────────────────┘

Agent: "Does this match your vision?"
User: "Can we move buttons to the left?"
Agent: *updates wireframe quickly*

        ┌────────────────────────┐
        │  Title  [Button]       │
        ├────────────────────────┤
        │  Form fields...        │
        │  [Submit]  [Cancel] ←  │ Buttons on left
        └────────────────────────┘

User: "Perfect!"
Agent: *generates implementation matching approved wireframe*
```

## Benefits

| Benefit                  | Why It Matters                                   |
| ------------------------ | ------------------------------------------------ |
| **Faster Iterations**    | Changing ASCII is 10x faster than rewriting code |
| **Visual Confirmation**  | See layout before investing in implementation    |
| **Better Communication** | Non-technical stakeholders can review structure  |
| **Clear Blueprint**      | Developers have exact specification to follow    |
| **Reduced Rework**       | Catch layout issues before implementation        |
| **Design Traceability**  | UX Spec → Wireframe → Implementation chain       |

## Wireframe Storage

All wireframes saved to: `{output_folder}/wireframes/`

For this project: `/docs/wireframes/`

### File Naming

- Full UX workflow: `{screen-name}-wireframe.md`
- Visual handoff: `{story-key}-wireframe.md`

Examples:

- `/docs/wireframes/home-dashboard-wireframe.md`
- `/docs/wireframes/2-1-host-event-creation-wireframe.md`

## Wireframe Contents

Each wireframe includes:

1. **ASCII Layout** - Visual structure with exact component placement
2. **Component Breakdown** - Type, props, states, interactions
3. **Visual Hierarchy** - Typography, colors, spacing
4. **Interaction States** - All states (default, hover, active, disabled, error, loading, success)
5. **Responsive Behavior** - Mobile, tablet, desktop adaptations
6. **Accessibility** - WCAG requirements, keyboard nav, screen reader
7. **Design Checklist** - QA criteria before marking complete

## User Confirmation Flow

### During Wireframe Generation

```
Agent: "I'll create wireframes for:
        - Home screen
        - Event creation (4 steps)
        - Profile settings

        Should I generate all or focus on specific screens?"

User: "Focus on event creation for now"

Agent: *generates wireframes*

Agent: "Wireframes generated! Review:
        /docs/wireframes/2-1-host-event-creation-wireframe.md

        Questions:
        - Does layout feel right?
        - Components in correct hierarchy?
        - Interaction flow clear?

        Should I:
        1. Proceed (looks good)
        2. Revise (tell me what to change)
        3. Add more (create additional wireframes)"

User: "The sport selector should be cards, not buttons"

Agent: *updates wireframe*

Agent: "Updated! Sport selector now uses Card components."

User: "Perfect, proceed"

Agent: *continues workflow with approved wireframes*
```

## Integration with Story Context

Wireframes are automatically linked in story `.context.xml`:

```xml
<doc path="docs/wireframes/2-1-host-event-creation-wireframe.md"
     title="Visual Wireframe"
     section="ALL">
  ASCII wireframe showing exact screen layout, component placement,
  and interaction patterns. MUST follow wireframe structure.
</doc>
```

Developers see wireframes when loading story context!

## Screenshot Preview (Optional)

Wireframes can include links to:

- Figma/design tool mockups
- Screenshot embeds
- Interactive HTML previews
- Design system component references

Example:

```markdown
## Design Preview

**Figma Mockup:** [View in Figma](https://figma.com/...)

**Screenshot:**
![Event Creation Screen](../screenshots/event-creation.png)

**Interactive Preview:** Open `event-creation-preview.html` in browser
```

## How to Request Wireframes

### Option 1: During UX Design

```
User: *create-design

[Workflow runs through design exploration...]

Agent: "Now generating wireframes for key screens..."
```

### Option 2: During Visual Handoff

```
User: *visual-handoff

Agent: "Which story?"

User: "2-1"

Agent: "Generating visual spec with wireframes for Story 2-1..."
```

### Option 3: Ad-Hoc Request

```
User: "Generate a wireframe for the checkout screen"

Agent: *generates wireframe following standard format*
      *saves to /docs/wireframes/checkout-screen-wireframe.md*
```

## Revision Process

### Quick Changes

```
User: "Update the wireframe - move the search bar to the top right"

Agent: *updates ASCII layout*
      *updates component breakdown*
      *saves revised wireframe*
```

### Major Redesign

```
User: "Actually, let's use a sidebar navigation instead of top nav"

Agent: "That changes the entire layout approach. Let me show you options:

        Option A: Fixed sidebar (always visible)
        Option B: Collapsible sidebar (mobile-friendly)
        Option C: Drawer navigation (slides in)

        Which direction?"

User: "Option B"

Agent: *regenerates wireframe with new navigation pattern*
```

## Validation

Use `*validate-design` to check wireframes against checklist:

```
Agent: "Validating wireframes...

        ✅ Layout structure documented
        ✅ All components specified
        ✅ Interaction states complete
        ✅ Responsive behavior defined
        ✅ Accessibility requirements met
        ✅ Design checklist included

        Wireframes ready for implementation!"
```

## Next Steps After Wireframe Approval

1. **Developer Implementation**
   - Load story context (includes wireframe reference)
   - Follow wireframe layout exactly
   - Use specified components and states
   - Check design acceptance criteria

2. **Visual QA**
   - Compare implementation to wireframe
   - Verify all components match specification
   - Check all interaction states
   - Validate responsive behavior
   - Test accessibility requirements

## FAQ

**Q: Do I always need wireframes?**  
A: For simple components (single button, input), no. For screens/flows, yes!

**Q: Can I skip straight to implementation?**  
A: You can, but wireframes catch issues early and save rework time.

**Q: What if I don't like ASCII wireframes?**  
A: You can request HTML previews, Figma links, or screenshots instead.

**Q: How detailed should wireframes be?**  
A: Enough to guide implementation - layout, components, states, responsive.

**Q: Can wireframes evolve during implementation?**  
A: Yes! Update wireframe if design changes, then update implementation.

**Q: What about existing screens without wireframes?**  
A: Generate retroactively: `*visual-handoff` for any story needing visual spec.

---

## Summary

🎯 **Goal:** See visual structure before building  
📁 **Location:** `/docs/wireframes/`  
🔧 **Workflows:** `*create-design` (Step 5b), `*visual-handoff`  
✅ **Process:** Generate → Review → Revise → Approve → Implement  
📊 **Benefits:** Faster iterations, clear blueprints, fewer surprises

**Remember:** Wireframes are blueprints, not artwork. They guide implementation!

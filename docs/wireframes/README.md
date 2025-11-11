# Wireframes Directory

This directory contains visual wireframes for UI screens and components before implementation.

## Wireframe-First Workflow

When requesting UI implementation, the UX Designer agent now follows this process:

### 1. Generate Visual Wireframe First

- Create ASCII/Markdown mockup showing exact layout
- Document component hierarchy and placement
- Specify interaction states and responsive behavior
- Include design acceptance criteria

### 2. User Confirmation

- Review wireframe with user
- Make revisions based on feedback
- Confirm layout matches vision

### 3. Generate Full Implementation

- After wireframe approval, generate component code
- Implementation follows wireframe specifications exactly
- All design decisions documented and traceable

## Benefits

✅ **Visual Clarity** - See structure before building  
✅ **Faster Iterations** - Easy to revise ASCII wireframes vs full code  
✅ **Better Communication** - Non-technical stakeholders can review layouts  
✅ **Implementation Guide** - Developers have clear blueprint  
✅ **Design Traceability** - Links UX spec → Wireframe → Implementation

## Wireframe Format

Each wireframe includes:

1. **Purpose & User Goal** - What this screen accomplishes
2. **ASCII Layout Structure** - Visual representation of component placement
3. **Component Breakdown** - Type, props, states, interactions
4. **Visual Hierarchy** - Typography, colors, spacing specifications
5. **Interaction States** - All possible states documented
6. **Responsive Behavior** - Mobile, tablet, desktop adaptations
7. **Accessibility Requirements** - WCAG compliance details
8. **Design Acceptance Checklist** - QA criteria before completion

## Integration with Workflows

### UX Design Workflow (`*create-design`)

- **Step 5b** (new): Generate wireframes for key screens
- Creates wireframes in this directory
- User reviews and approves before proceeding

### Visual Handoff Workflow (`*visual-handoff`)

- Generates story-specific wireframes
- Links wireframes to story context
- Ensures developer sees wireframes when implementing

## File Naming Convention

```
{screen-or-story-name}-wireframe.md
```

Examples:

- `home-dashboard-wireframe.md`
- `2-1-host-event-creation-wireframe.md`
- `user-profile-wireframe.md`
- `checkout-flow-wireframe.md`

## Screenshot Preview

For enhanced communication, wireframes can include:

- Links to Figma/design tool mockups
- Screenshot embeds (if available)
- Interactive HTML previews

## Workflow Commands

- `*create-design` - Run full UX design workflow (includes wireframe generation)
- `*visual-handoff` - Generate visual spec + wireframe for specific story
- `*validate-design` - Validate UX specification and wireframes

---

**Last Updated:** 2025-11-10  
**Workflow Version:** BMad Method v6.0.0-alpha.4

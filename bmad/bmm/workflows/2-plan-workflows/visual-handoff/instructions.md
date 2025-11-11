# Visual Design Handoff Workflow Instructions

<workflow name="visual-handoff">

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow translates UX Design Specification into actionable visual requirements for developers</critical>

<critical>DOCUMENT OUTPUT: Technical visual specification. Includes wireframes (ASCII/text), component composition, visual hierarchy, interaction states, and design acceptance criteria.</critical>

## Purpose

This workflow bridges the gap between UX Design (high-level philosophy, user journeys, design patterns) and Dev Implementation (specific component composition, visual hierarchy, interaction details).

**Input:** UX Design Specification + Story file
**Output:** Visual Specification document with concrete implementation guidance

## Step-by-Step Process

<step n="1" goal="Load UX Design Specification and Design System" tag="document-discovery">
  <action>Search for UX Design Specification using fuzzy matching: {ux_design_file}</action>
  <action>Search for Design System document: {design_system_file}</action>
  
  <check if="UX Design Specification not found">
    <output>❌ No UX Design Specification found in {output_folder}</output>
    <output>This workflow requires a completed UX design. Run `create-ux-design` first.</output>
    <action>HALT</action>
  </check>

<action>Read COMPLETE UX Design Specification</action>
<action>Extract key sections: - Design System Foundation (colors, typography, spacing) - Design Direction (chosen approach) - Component Library (component patterns) - UX Pattern Decisions (consistency rules)
</action>

  <check if="Design System document found">
    <action>Read COMPLETE Design System document</action>
    <action>Extract technical specifications (color codes, font sizes, component APIs)</action>
  </check>

<output>✅ Loaded UX/Design documentation successfully</output>
</step>

<step n="2" goal="Identify story requiring visual specification" tag="story-selection">
  <ask>Which story needs visual design specification?
  
**Options:**
1. Provide story key (e.g., "2-1-host-event-creation")
2. Provide full story path
3. I'll help you find it
  </ask>

  <check if="user provides story key or path">
    <action>Load story file from {story_dir}/{story_key}.md</action>
  </check>

  <check if="user needs help finding story">
    <action>List all story files in {story_dir}</action>
    <action>Show story titles and current status</action>
    <ask>Which story number?</ask>
  </check>

  <check if="story file not found">
    <output>❌ Story file not found</output>
    <action>HALT</action>
  </check>

<action>Read COMPLETE story file</action>
<action>Parse sections: Story, Acceptance Criteria, Tasks, Dev Notes</action>
<action>Extract story_key, epic_id, story_id, title</action>

<output>📋 Story loaded: {{story_title}}</output>
<output>Epic: {{epic_id}} | Story: {{story_id}}</output>
</step>

<step n="3" goal="Analyze story for UI/UX requirements" tag="requirements-extraction">
  <action>Analyze acceptance criteria for visual/UI requirements</action>
  <action>Identify screens, pages, components mentioned in story</action>
  <action>Extract form fields, buttons, navigation elements from ACs</action>
  <action>Note any explicit UX requirements (accessibility, responsive, etc.)</action>

<output>🎨 UI Components identified in story:
{{list_of_screens_and_components}}
</output>

<ask>Are there additional screens or components not mentioned in the story that need visual specs?</ask>

  <check if="user adds components">
    <action>Add user-specified components to requirements list</action>
  </check>
</step>

<step n="4" goal="Map UX Design patterns to story requirements" tag="pattern-mapping">
  <action>For each screen/component identified:
    - Find matching pattern in UX Design Specification Section 6 (Component Library)
    - Find layout guidance in Section 4 (Design Direction)
    - Find consistency rules in Section 7 (UX Pattern Decisions)
  </action>

<action>Extract specific design decisions: - Which design direction applies (e.g., "Hybrid Event Discovery") - Which component patterns to use (e.g., "Card-based selection") - Which visual hierarchy rules apply - Which color applications are relevant
</action>

<output>🔗 Design Pattern Mappings:

**{{Screen/Component 1}}**

- UX Pattern: {{pattern_name}} (Section {{section_ref}})
- Layout: {{layout_approach}}
- Components: {{component_list}}

**{{Screen/Component 2}}**

- UX Pattern: {{pattern_name}}
- Layout: {{layout_approach}}
  ...
  </output>

  <ask>Do these mappings look correct? Any adjustments needed?</ask>
  </step>

<step n="5" goal="Create visual specifications for each screen/component" tag="spec-generation">
  <critical>This is the core deliverable - translate UX philosophy into concrete visual requirements</critical>

<action>For EACH screen/component, create detailed visual specification including: 1. **Layout Structure** (wireframe in ASCII/text format) 2. **Component Composition** (which React Native Paper/MUI components to use) 3. **Visual Hierarchy** (typography scale, color usage, spacing) 4. **Interaction States** (default, hover, focus, disabled, error, loading) 5. **Responsive Behavior** (mobile, tablet, desktop breakpoints) 6. **Accessibility Requirements** (WCAG compliance, screen readers)
</action>

  <template-output file="{default_output_file}">
# Visual Specification: {{story_title}}

**Story:** {{story_key}}
**Created:** {{date}}
**UX Reference:** {{ux_design_file}}

---

## Overview

This visual specification translates the UX Design Specification into concrete implementation guidance for Story {{story_key}}.

**Screens/Components:**
{{list_of_components}}

**Design Direction:** {{chosen_design_direction}}
**Component Patterns:** {{relevant_patterns}}

---

{{for each screen/component}}

## {{Screen/Component Name}}

### Purpose

{{brief_description}}

### Layout Structure (Wireframe)

```
{{ASCII wireframe showing component layout}}
Example:
┌────────────────────────────────────┐
│  ← Back    Screen Title     [?]    │
├────────────────────────────────────┤
│  Context Info (Streak, Score)      │
├────────────────────────────────────┤
│  Primary Content Area               │
│  ┌──────────────────────────────┐  │
│  │  Component 1                  │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Component 2                  │  │
│  └──────────────────────────────┘  │
├────────────────────────────────────┤
│  [Cancel]          [Submit →]      │
└────────────────────────────────────┘
```

### Component Composition

**Technology Stack:**

- Mobile: React Native Paper components
- Web: Material UI components

**Component Breakdown:**

1. **Header Section**
   - Component: `Appbar` (RNP) / `AppBar` (MUI)
   - Props: `title`, `back`, `action`
   - Style: Fixed positioning, elevation 2

2. **Context Banner**
   - Component: `Card` (RNP/MUI)
   - Props: `variant="outlined"`
   - Content: User streak, reliability score
   - Reference: UX Spec Section 6.1 "Reliability & Progress Components"

3. **{{Component Name}}**
   - Component: {{RNP_component}} / {{MUI_component}}
   - Props: {{required_props}}
   - Pattern: {{design_pattern_reference}}

{{continue for all components}}

### Visual Hierarchy

**Typography:**

- Page Title: H4 (2xl, 24px, semibold)
- Section Headers: H6 (lg, 18px, semibold)
- Body Text: Body1 (base, 16px, regular)
- Helper Text: Caption (sm, 14px, regular)
- Labels: Body2 (sm, 14px, medium)

**Color Application:**

- Primary Actions: #3B82F6 (Trust & Reliability Blue)
- Success States: #10B981 (Green)
- Error States: #EF4444 (Red)
- Secondary Text: #6B7280 (Gray-500)
- Borders: #E5E7EB (Gray-200)

Reference: Design System {{design_system_section}}

**Spacing:**

- Section Margins: 24px (lg)
- Component Spacing: 16px (md)
- Card Padding: 24px (lg)
- Form Field Spacing: 16px (md)

### Interaction States

**State Specifications:**

1. **Default State**
   - Visual appearance when no interaction
   - Example: Button with primary blue background, white text

2. **Hover State** (web only)
   - Visual change on mouse hover
   - Example: Button darkens to #2563EB, cursor pointer

3. **Focus State**
   - Visual indicator when element receives focus
   - Example: 2px blue outline, 4px offset
   - Accessibility: WCAG 2.1 AA compliant

4. **Pressed/Active State**
   - Visual feedback during interaction
   - Example: Button scales to 98%, darker background

5. **Disabled State**
   - Visual indication element is not interactive
   - Example: Gray background, reduced opacity 40%

6. **Error State**
   - Visual indication of validation error
   - Example: Red border, error icon, error message below

7. **Loading State**
   - Visual feedback during async operations
   - Example: Spinner inside button, disabled interaction

### Responsive Behavior

**Breakpoints:**

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile (< 768px):**
{{mobile_specific_layout}}

**Tablet (768px - 1024px):**
{{tablet_specific_layout}}

**Desktop (> 1024px):**
{{desktop_specific_layout}}

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**

1. **Color Contrast**
   - Text on background: Minimum 4.5:1
   - UI components: Minimum 3:1
   - Verified with WebAIM contrast checker

2. **Keyboard Navigation**
   - All interactive elements accessible via Tab key
   - Focus indicators visible
   - Logical tab order

3. **Screen Reader Support**
   - Semantic HTML elements
   - ARIA labels for icon-only buttons
   - Form labels properly associated

4. **Touch Targets**
   - Minimum 44×44px (iOS), 48×48dp (Android)
   - 8px spacing between targets

### Design Acceptance Criteria

**Visual QA Checklist:**

- [ ] Layout matches wireframe structure
- [ ] Components follow UX Spec Section {{section_ref}}
- [ ] Typography uses design system scale
- [ ] Colors match Trust & Reliability theme
- [ ] Spacing uses 8px grid system
- [ ] All interaction states implemented
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility requirements met
- [ ] Loading states match design patterns
- [ ] Error states display correctly

**UX Pattern References:**

- Design Direction: UX Spec Section {{section_number}}
- Component Pattern: UX Spec Section {{section_number}}
- Consistency Rules: UX Spec Section {{section_number}}

---

{{end for each screen/component}}

## Implementation Notes

### Do's

✅ Use card-based patterns per UX Spec Section 6.1
✅ Show reliability context (streak, score) where relevant
✅ Implement progressive disclosure (multi-step forms, not single-page)
✅ Include celebration moments for success states
✅ Use Material Design sport icons (not emojis)
✅ Integrate smart autocomplete for location inputs
✅ Show visual previews (map, calendar availability)

### Don'ts

❌ Don't dump all form fields on one screen
❌ Don't use primitive HTML5 inputs without styling
❌ Don't use emoji icons in production
❌ Don't show errors only after submit
❌ Don't ignore loading states
❌ Don't skip success celebrations
❌ Don't use toggle buttons where cards are specified

### Component Libraries

- **Mobile:** React Native Paper (Material Design 3)
  - Docs: https://callstack.github.io/react-native-paper/
- **Web:** Material UI (MUI)
  - Docs: https://mui.com/material-ui/

### Design System Reference

{{link_to_design_system_file}}

### UX Design Reference

{{link_to_ux_design_file}}

---

## Approval

**UX Designer Approval:** ☐ Pending / ☑ Approved
**Date:** {{approval_date}}
**Notes:** {{approval_notes}}

  </template-output>

<output>✅ Visual specification generated: {{default_output_file}}</output>
</step>

<step n="6" goal="Update story with visual requirements" tag="story-update">
  <ask>Should I add a "Visual Design Requirements" section to the story file?

This will add:

- Link to visual specification document
- Visual acceptance criteria checklist
- Design system references

(y/n)</ask>

  <check if="yes">
    <action>Append to story file:

## Visual Design Requirements

**Visual Specification:** [{{story_key}}-visual-spec.md]({{story_key}}-visual-spec.md)

**Design Acceptance Criteria:**

- [ ] Layout follows visual specification wireframes
- [ ] Components use specified React Native Paper / MUI components
- [ ] Typography matches design system scale
- [ ] Colors match Trust & Reliability theme (#3B82F6 primary)
- [ ] Spacing uses 8px grid system
- [ ] All interaction states implemented (hover, focus, disabled, error, loading)
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Success states include celebration animations
- [ ] Error states show inline validation

**Design System Reference:** {{design_system_file}}
**UX Design Reference:** {{ux_design_file}}

    </action>

    <output>✅ Story updated with visual requirements section</output>

  </check>
</step>

<step n="7" goal="Update story-context constraint" tag="context-update">
  <ask>Should I update the story's .context.xml file to include UX references?

This will ensure developers see the visual specification during implementation.

(y/n)</ask>

  <check if="yes">
    <action>Find story context file: {{story_key}}.context.xml</action>
    
    <check if="context file exists">
      <action>Add to <docs> section:

<doc path="{{visual_spec_path}}" 
     title="Visual Design Specification"
     section="ALL">
Concrete visual implementation guidance translating UX Design Specification
into component composition, visual hierarchy, interaction states, and design
acceptance criteria. MUST follow wireframes and component specifications.
</doc>

<doc path="{{ux_design_path}}" 
     section="6.1 Component Strategy"
     applyTo="{{story_screens}}">
Component patterns and composition guidance. Use card-based layouts,
visual trust indicators, and progressive disclosure patterns as specified.
</doc>

<doc path="{{design_system_path}}" 
     section="ALL"
     applyTo="ALL screens">
Design system tokens: colors, typography, spacing, component APIs.
MUST use these exact values for consistency.
</doc>
</action>

      <action>Add to <constraints> section:

<constraint type="visual-design">
  Implementation MUST follow visual specification at {{visual_spec_path}}. 
  All wireframes, component compositions, and visual hierarchies are mandatory. 
  Use design acceptance criteria checklist before marking story complete.
</constraint>

<constraint type="design-system">
  MUST use design system tokens from {{design_system_path}}. 
  Colors: Trust & Reliability theme (#3B82F6 primary). 
  Typography: Inter font, design system scale. 
  Spacing: 8px grid system.
</constraint>
      </action>

      <output>✅ Story context updated with UX/design references</output>
    </check>

    <check if="context file does not exist">
      <output>⚠️ Context file not found. Run `story-context` workflow first.</output>
    </check>

  </check>
</step>

<step n="8" goal="Validation and summary" tag="completion">
  <action>Verify all files created/updated successfully</action>
  <action>Check visual specification against validation checklist</action>

  <output>
═══════════════════════════════════════════════
🎨 VISUAL DESIGN HANDOFF COMPLETE
═══════════════════════════════════════════════

**Story:** {{story_key}} - {{story_title}}

**Outputs Created:**
✅ Visual Specification: {{visual_spec_path}}
✅ Story Updated: {{story_file_path}} (if approved)
✅ Context Updated: {{context_file_path}} (if approved)

**Next Steps:**

1. **UX Designer Review**
   - Review visual specification for accuracy
   - Verify wireframes match UX vision
   - Approve or request revisions

2. **Developer Handoff**
   - Developer loads story context (includes visual spec)
   - Developer implements following visual specification
   - Developer checks design acceptance criteria before completion

3. **Visual QA**
   - UX Designer reviews implementation
   - Use design acceptance criteria checklist
   - Approve or request visual corrections

**References:**

- Visual Spec: {{visual_spec_path}}
- UX Design: {{ux_design_path}}
- Design System: {{design_system_path}}

═══════════════════════════════════════════════
</output>
</step>

</workflow>

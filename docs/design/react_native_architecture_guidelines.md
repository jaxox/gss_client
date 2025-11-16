# React Native App Architecture & UI Guidelines

> **Audience:** GitHub Copilot / AI agents building or modifying this React Native mobile app.  
> **Goal:** Ensure both **refactoring** and **all new development** follow a consistent, modern, reusable architecture and UI system.

---

## 1. Purpose

The current app works but is structured in a very “screen-by-screen” way, with repeated UI patterns and limited reuse.

Your job is to:

1. **Refactor existing code** (starting with the Create Event flow) into a cleaner, reusable architecture.
2. **Apply the same guidelines to ALL NEW DEVELOPMENT** going forward. Any new screen, component, or feature must follow these rules by default.

Think of this document as the React Native equivalent of SOLID and clean architecture for this app.

---

## 2. High-Level Rules (Must Always Be True)

When adding or changing code, always:

- Prefer **composition and reuse** over copy–paste.
- Keep **UI components small and focused**.
- Keep **business logic in hooks or services**, not deeply inside UI components.
- Follow a **single source of truth** for:
  - Colors
  - Spacing
  - Typography
  - Common UI patterns (buttons, inputs, cards, etc.).
- Make screens easy to change without touching unrelated features.

These apply to **refactor work AND any new feature**.

---

## 3. Architectural Principles (React Version of SOLID)

### 3.1 Single Responsibility

Each component or hook should have one main job.

- A `WizardScreenLayout` handles layout and header for wizard-style screens.
- A `FormSection` renders a titled card/section.
- A `SportSelector` manages sport option UI and selection.

If a component does more than one of these things, break it up.

### 3.2 Separation of Concerns

- **Presentational components** = mostly JSX + styling, minimal logic.
- **Container components / hooks** = state, validation, and business rules.

Examples:

- `useCreateEventWizard()` handles step navigation and submit.
- `useEventFormState()` manages form values and validation.
- UI screens like `CreateEventStep1Screen` mainly assemble components and hook outputs.

### 3.3 Reusability & Composition

Avoid bespoke, one-off UI when the pattern repeats.

Whenever you see the same layout or interaction more than once, extract it:

- Page/screen layout shells
- Section headers and cards
- Button styles
- Form fields and form rows
- Toggle/switch rows
- Summary tiles / info rows

### 3.4 Design System Mindset

Implement a small design system and stick to it:

- Centralized **theme/tokens** for:
  - `colors`
  - `spacing`
  - `fontSizes`
  - `radius`
  - `shadows`
- Shared components should respect these tokens:
  - `AppScreen`, `WizardScreenLayout`
  - `AppCard`, `FormSection`
  - `AppButton` (primary/secondary/ghost)
  - `AppTextInput`
  - `AppToggle`, `AppChip`, etc.

No hard-coded magic values scattered across screens.

### 3.5 Explicit Props & Types

- Components must have **clear, explicit props**.
- Avoid passing large objects when only a few fields are needed.
- Use TypeScript-friendly patterns (even if the codebase is JS today, keep it TS-ready).

---

## 4. Concrete Patterns for This App

Use the **Create Event** flow as the reference pattern, and apply these patterns globally.

### 4.1 Shared Layouts

Create and use:

- `WizardScreenLayout`
  - Handles header, step indicator, common padding, scroll behavior, and bottom buttons.
  - All Create Event steps must use this.
  - Any future multi-step flows should also use this by default.

- `AppScreen`
  - Generic screen wrapper (for non-wizard screens).
  - Manages safe area, scroll container vs fixed layouts.

### 4.2 Shared Form Components

Create reusable components for common UI:

- `FormSection`
  - Props: `title`, optional `description`, children.
  - Used for sections like “Basic Information”, “Location & Time”, “Event Details”, etc.
  - Mandatory for any grouped block of form fields.

- `LabeledTextInput`
  - Wraps React Native Paper `TextInput` with:
    - Label
    - Error message
    - Optional character counter
    - Consistent spacing and styling
  - All new text inputs should use this (unless there’s a specific reason not to).

- `FormRow`
  - Horizontal layout for pairs like Start/End time or label + switch.

- `SportSelector`
  - Renders selectable sport cards/chips.
  - Props: options list, selected id, onChange.
  - New selection UIs should follow this pattern.

- `AppButtonPrimary`, `AppButtonSecondary`
  - Standardized buttons for primary and secondary actions.
  - All new buttons must use these variants (or extend them) instead of ad-hoc styling.

### 4.3 Hooks for Business Logic

Refactor logic into hooks and apply the same pattern for new flows:

- `useCreateEventWizard()`
  - Tracks current step, next/back, and final submit.
- `useEventFormState()`
  - Holds the event data structure and validation.
- Future example: `useRSVPFlow()`, `usePaymentSetup()`, etc.

Any new feature that has non-trivial state/logic should get its own hook.

---

## 5. Theme & Tokens

Introduce a `theme/` folder with at least:

- `theme/tokens.ts`
  - `colors`
  - `spacing`
  - `fontSizes`
  - `radius`
  - `shadows`
- `theme/components.ts` (optional)
  - Shared style snippets for cards, chips, etc.

**Rule:** New components must pull from these tokens; they must not introduce arbitrary inline styles unless absolutely necessary.

---

## 6. Suggested Folder Structure

Use a structure like this (or propose a better one and apply it consistently):

```text
src/
  components/
    layout/
      AppScreen.tsx
      WizardScreenLayout.tsx
    form/
      FormSection.tsx
      LabeledTextInput.tsx
      FormRow.tsx
    controls/
      AppButtonPrimary.tsx
      AppButtonSecondary.tsx
      AppToggle.tsx
      AppChip.tsx
    domain/
      SportSelector.tsx
      EventSummaryCard.tsx
  screens/
    createEvent/
      CreateEventStep1BasicInfoScreen.tsx
      CreateEventStep2LocationTimeScreen.tsx
      CreateEventStep3DetailsPaymentScreen.tsx
      CreateEventStep4ReviewPublishScreen.tsx
  hooks/
    useCreateEventWizard.ts
    useEventFormState.ts
  theme/
    tokens.ts
    index.ts
  types/
    event.ts
    common.ts
```

Any new screen/feature must fit into this structure (or its evolved version).

---

## 7. Checklist for Any New Screen or Feature

Before you create a new screen or large component, go through this checklist:

1. **Can I reuse an existing layout component?**
   - If it’s a multi-step flow, use `WizardScreenLayout`.
   - If it’s a standard screen, use `AppScreen`.

2. **Can I reuse existing form/section components?**
   - Use `FormSection`, `LabeledTextInput`, `FormRow`, etc.

3. **Is there any pattern I’m about to duplicate?**
   - If yes, extract a new reusable component instead.

4. **Is business logic in a hook, not buried in the JSX?**
   - Create `useXxx` for non-trivial logic.

5. **Am I using theme tokens (colors, spacing, radius)?**
   - No new hard-coded style values unless there is a very good reason.

6. **Are props explicit and well named?**
   - Avoid dumping large generic objects into deeply nested components.

If the answer is “no” for any of these, fix it before committing.

---

## 8. What I Want From You (GitHub Copilot / Agent)

When you work on this app, you must:

1. **Refactor existing Create Event screens** to follow these guidelines:
   - Introduce and use shared layout, form, and control components.
   - Extract business logic into hooks.
   - Clean up naming and structure.

2. **Ensure all new screens and features**:
   - Use the shared components and tokens.
   - Follow the folder structure and architectural principles above.

3. After each major change, briefly summarize:
   - What components/hooks were added or modified.
   - How the change improves reuse, clarity, or maintainability.
   - Any TODOs or follow-up refactors you recommend.

These rules are **not optional**. Treat them as the architecture contract for this app.

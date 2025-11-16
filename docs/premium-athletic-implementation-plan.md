# Premium Athletic Design Implementation Plan

**Date:** November 14, 2025
**Design:** Premium Athletic (Dark Theme with Orange Gradients)
**Architecture:** Following react_native_architecture_guidelines.md

## Design Specifications

### Colors

- **Background:** #1e1e1e (main), #1a1a1a (surface)
- **Primary:** #ff6b35 → #ff8c42 (orange gradient)
- **Secondary:** #2563eb (blue accent)
- **Text:** White with varying opacity (100%, 70%, 60%, 40%)
- **Borders:** #404040

### Typography

- **Headlines:** 28px, weight 800
- **Subheads:** 15px, weight 600
- **Body:** 16px, weight 500
- **Labels:** 12px, weight 700, uppercase

### Components

- **Border Radius:** 14px (buttons/cards), 12px (inputs)
- **Progress:** Thick bar (6px) with orange gradient
- **Buttons:** Orange gradient with 3D shadow effect
- **Inputs:** Dark bordered style with orange focus state
- **Sport Cards:** 100px cards with orange left border when selected

## Implementation Strategy

### Phase 1: Architecture Foundation ✅

- [x] Theme tokens with Premium Athletic colors
- [x] WizardScreenLayout component
- [x] FormSection, FormRow components
- [x] AppButton components
- [x] useCreateEventWizard hook
- [x] Event types

### Phase 2: Premium Components (In Progress)

- [ ] GradientButton component (orange gradient)
- [ ] PremiumProgressBar component
- [ ] PremiumTextInput component (dark theme)
- [ ] PremiumSportCard component
- [ ] ModalBottomSheet component (for co-hosts, links, etc.)

### Phase 3: Wizard Screens Rebuild

- [ ] Step 1: Basic Info (dark theme, sport cards with orange accent)
- [ ] Step 2: Location & Time (dark inputs, date/time pickers)
- [ ] Step 3: Details & Payment (modals for co-hosts, links, payment)
- [ ] Step 4: Review & Publish (dark review card with orange accents)

### Phase 4: Modals

- [ ] AddCohostsModal (dark theme)
- [ ] AddLinkModal (dark theme)
- [ ] AddQuestionnaireModal (new)
- [ ] AddRemindersModal (new)
- [ ] PaymentModal (new - replaces inline payment)

## Key Differences from Current Design

1. **Dark Theme:** Complete switch from light to dark backgrounds
2. **Orange Gradients:** All primary actions use gradient buttons
3. **Progress Bar:** Thick segmented bar instead of dots
4. **Modals:** Co-hosts, links, questionnaire, reminders, payment all in modals
5. **Typography:** Bold, uppercase labels with aggressive tracking
6. **Sport Cards:** Larger (100px) with orange left border accent

## Files to Create/Modify

### New Files

- `/mobile/src/components/controls/GradientButton.tsx`
- `/mobile/src/components/controls/PremiumProgressBar.tsx`
- `/mobile/src/components/form/PremiumTextInput.tsx`
- `/mobile/src/components/controls/PremiumSportCard.tsx`
- `/mobile/src/components/modals/AddQuestionnaireModal.tsx`
- `/mobile/src/components/modals/AddRemindersModal.tsx`
- `/mobile/src/components/modals/PaymentModal.tsx`

### Modify Files

- `/mobile/src/theme/tokens.ts` ✅ (Updated with Premium Athletic colors)
- `/mobile/src/screens/events/wizard/Step1BasicInfo.tsx` (Rebuild with dark theme)
- `/mobile/src/screens/events/wizard/Step2LocationTime.tsx` (Rebuild with dark theme)
- `/mobile/src/screens/events/wizard/Step3Details.tsx` (Rebuild with modals)
- `/mobile/src/screens/events/wizard/Step4Review.tsx` (Rebuild with dark theme)
- `/mobile/src/screens/events/wizard/AddCohostsModal.tsx` (Update for dark theme)
- `/mobile/src/screens/events/wizard/AddLinkModal.tsx` (Update for dark theme)

## Next Steps

1. Create GradientButton component
2. Create PremiumProgressBar component
3. Update WizardScreenLayout to use PremiumProgressBar
4. Rebuild Step 1 with Premium Athletic design
5. Test in simulator
6. Continue with remaining steps

## Architecture Compliance

✅ Single Responsibility - Each component has one purpose
✅ Separation of Concerns - UI components separate from business logic
✅ Reusability - All components can be reused across wizard
✅ Design System - All colors/spacing from theme tokens
✅ Explicit Props - Clear TypeScript interfaces

## Estimated Timeline

- Premium Components: 2-3 hours
- Step 1 Rebuild: 1 hour
- Step 2 Rebuild: 1 hour
- Step 3 Rebuild + Modals: 2-3 hours
- Step 4 Rebuild: 1 hour
- **Total:** 7-10 hours for complete Premium Athletic implementation

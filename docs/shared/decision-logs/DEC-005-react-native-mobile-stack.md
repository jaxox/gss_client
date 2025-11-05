# DEC-005 React Native Mobile Stack Choice

Type: Decision
Status: Adopted
Created: 2025-10-23
Owner: Eng Lead
Related Brief Section: Technology Preferences / React Native vs Flutter

## Decision

Adopt React Native for iOS/Android MVP development aligned with existing team JavaScript/TypeScript expertise.

## Rationale

Faster velocity given skill alignment; large ecosystem & library support; acceptable performance for target feature set.

## Metrics (Performance KPIs)

- App Launch Time (<3s target)
- Event List Load (<2s target)
- Crash Rate (<5%)

## Risks

Performance edge cases vs. Flutter; potential layout inconsistency.

## Review Trigger

If performance KPIs fail consistently or maintenance overhead escalates.

## Alternatives Considered

Flutter for performance & unified UI; native development (higher cost).

## Next Actions

1. Establish performance monitoring (Sentry + custom metrics).
2. Create component library foundation.

## Links

- Product Brief: React Native vs Flutter decision

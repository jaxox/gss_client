# Decision & Hypothesis Logs Index

Date: 2025-10-23
Owner: Product / Strategy
Status: Initial version

This index catalogs all current product decisions, hypotheses, assumptions, strategic pillars, and deferred items captured from the product brief. Each entry has its own detailed log for traceability and future review.

## Legend

- DEC = Decision (committed direction, revisit only on trigger)
- HYP = Hypothesis (requires validation via experiment / data)
- ASS = Assumption (accepted as true for now; monitor for invalidation)
- STRAT = Strategic Pillar / Moat element
- DEF = Deferred (intentionally postponed; needs future exploration)

## Summary Table

| ID | Title | Type | Status | Review Trigger | Owner |
|----|-------|------|--------|----------------|-------|
| HYP-001 | Deposit Amount Cohorts | Hypothesis | Active Test Design | After first 1,000 RSVPs OR 30 days | PM + Data |
| DEC-001 | Competitive Unlock (Opt-In After 5 Events) | Decision | Adopted | If opt-in conversion <20% or churn post-unlock >10% delta | PM |
| ASS-001 | Unified Multi-Sport Profile | Assumption | Accepted | >20% users active in 3+ sports | PM |
| HYP-002 | Notification Category Balance | Hypothesis | Instrumentation Pending | If opt-out rate >25% any category | PM + Eng |
| DEC-002 | Private Events Allowed in MVP | Decision | Adopted | At 500 events/month to compare reliability impact | PM |
| HYP-003 | Flat Sponsor Revenue Model (Phase 1) | Hypothesis | Discovery | After 10 sponsor interviews OR Month 3 | BizDev |
| DEC-003 | No Host Fee <10 Participants | Decision | Adopted | At 300 monthly events OR host churn >15% | PM |
| STRAT-001 | Differentiation Pillars (Psychology / Reliability / Sponsorship / Dual Gamification) | Strategic Pillar | Monitoring | Quarterly competitive review | Strategy |
| HYP-004 | Premium Pricing Ceiling ($4.99 baseline) | Hypothesis | Active | After retention stabilization (Month 2) | PM + Data |
| DEC-004 | Pilot City: SF Bay Area (Seattle Backup) | Decision | Adopted | Pre-launch readiness checklist completion | PM |
| HYP-005 | Organizer Migration Friction ≤3 Steps | Hypothesis | Testing | After 10 onboarding usability sessions | UX + PM |
| HYP-006 | Viral Coefficient Target k ≥0.3 | Hypothesis | Instrumentation Pending | After Month 1 growth data | Growth |
| DEF-001 | Seasonal Variance Handling | Deferred | Deferred | After first winter engagement analysis | PM |
| DEC-005 | React Native for Mobile Stack | Decision | Adopted | Performance KPIs breach (launch >3s, list >2s) | Eng Lead |
| DEC-006 | Modular Monolith MVP Architecture | Decision | Adopted | Any extraction trigger thresholds exceeded | Eng Lead |
| ASS-002 | Managed Services for MVP | Assumption | Accepted | At 5K MAU cost/performance review | Eng Lead |
| HYP-007 | Offline Read-Only Cache Scope | Hypothesis | Testing | After Month 2 offline usage metrics | Eng + PM |
| HYP-008 | Invite Gating Efficiency | Hypothesis | Design Pending | After Wave 2 OR reliability <82% | Growth + PM |

## How to Use

1. When new decisions arise, create a new log file following existing patterns.
2. Update this index table (append row, maintain ID sequence per type).
3. On each review cycle, modify Status and add Outcome notes inside individual files.
4. Close hypotheses when success/failure criteria met; move failed hypotheses to a new decision or pivot log.

## Review Cadence

- Weekly groom: Update active experiment statuses (HYP entries).
- Monthly ops review: Check assumptions validity (ASS entries).
- Quarterly strategic review: Re-score differentiation pillars (STRAT entries).

## Related Artifacts

- Product Brief: ../product-brief-gamified-social-sports-2025-10-23.md
- Future: PRD instrumentation section will link back to relevant HYP logs.

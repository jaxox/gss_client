# HYP-002 Notification Category Balance

Type: Hypothesis
Status: Instrumentation Pending
Created: 2025-10-23
Owner: PM + Eng
Related Brief Section: Notifications & Engagement / Preference Center

## Hypothesis Statement

Providing six granular notification categories with a preference center will maintain opt-out rates below 25% in each category while sustaining engagement metrics (streak preservation, RSVP punctuality).

## Metrics

- Opt-Out Rate per Category (target <25%).
- Click-Through Rate (CTR) for streak risk alerts (target >35%).
- RSVP Reminder Effectiveness (RSVP on-time vs. late cancellations).

## Validation Approach

Monitor event stream for notification_sent and notification_interacted; daily dashboard with rolling 14-day metrics.

## Success Criteria

All categories <25% opt-out; streak risk CTR ≥35%; deposit reminder reduces late cancellation rate by ≥10% vs. baseline.

## Failure Criteria

Any category opt-out >35% OR aggregate notification fatigue (session length drop >10%).

## Risks

Over-notification leads to user annoyance; complexity of preference center delayed.

## Review Trigger

Opt-out spike or after first 10K notifications sent.

## Next Actions

1. Implement preference center UI.
2. Instrument notification events.
3. Launch staggered rollout.

## Links

- Product Brief: Notifications balance hypothesis

# Refundable Deposit Strategies & Payment Alternatives

This document summarizes research into refundable deposit strategies and payment alternatives for minimizing costs and risks using services like Stripe.

Using a payment platform like Stripe to collect refundable deposits is not a sustainable solution for boosting user commitment. Since over 90% of users are expected to either cancel on time or attend the event, the majority of deposits would be refunded. This creates two major problems:
    1. High Payment Fees: Stripe charges processing fees on all transactions, including refunded ones. This means the platform would lose money on every refunded deposit.
    2. Excessive Refund Risk: A consistently high refund rate (e.g. 90%+) is unusual for most businesses and could trigger Stripe’s risk systems — potentially leading to account review, restrictions, or even suspension.

---

## 1. Using Authorization Holds Instead of Charges

**Definition:** An authorization hold reserves funds on a customer’s card without charging them. You can later capture or release the funds.

### Stripe

- Supports `capture_method=manual` for PaymentIntents.
- Standard hold duration: **~7 days**.
- Extended holds (up to 30 days) only in supported industries.
- No fees for holds that expire uncaptured.
- Not all payment methods (e.g., ACH) support holds.

### Other Processors

- **PayPal/Braintree:** ~10–29 days holds possible.
- **Adyen:** Configurable based on card network and merchant vertical.
- **Square:** Holds valid for 6–7 days before auto-void.

**Limitations:**

- Must programmatically capture/void.
- Hold may expire before event.
- Users see funds held as “unavailable.”

---

## 2. High Refund Rates: Risks & Fees

- Stripe keeps transaction fees even on refunds (e.g., 2.9% + 30¢).
- Refund rate **>10%** is unusual and may trigger reviews.
- No public ban threshold, but **90–98%** refund ratio will raise red flags.
- You may be asked to justify the model and risk reclassification as a **high-risk merchant**.

**Consequences:**

- Increased monitoring.
- Potential requirement for rolling reserves.
- Risk of account termination if refund behavior appears fraudulent.

---

## 3. Real-World Examples of Refundable Deposits

### Event Platforms

- **Eventbrite:** €5 refundable deposit model.
- **ParticiPay:** Platform built on refundable deposits.
- **Effect:** Reduced no-show rates from 40–60% to ~10%.

### Gyms / Fitness

- No-show fees or refundable deposits (e.g., $5–$10).
- Used with free trial classes to filter unserious signups.

### Restaurant Reservations

- Non-refundable or refundable deposits (e.g., £10–$20 per person).
- Drastically reduce no-shows (by 55% in some cases).

### Healthcare / Appointments

- Deposits to confirm slots, refundable at check-in.
- Also applies to coworking, rental bookings, etc.

---

## 4. Non-Monetary Alternatives to Improve Commitment

### 1. Confirmation & Reminders

- Send 2-stage reminders (e.g., 24h, 1h).
- Ask for RSVP confirmation 1h before event.

### 2. No-Show Policies

- Implement **soft penalties** for repeated no-shows — for example, temporarily suspend RSVP privileges if a user misses a configurable number of consecutive events (threshold set by the event host).
- Introduce **priority-based access**: when an event reaches capacity, give preference to users with strong attendance records. Less reliable users may be automatically moved to the waitlist, allowing high-reliability attendees to secure spots first.
- This approach boosts commitment without enforcing strict monetary requirements and gives organizers meaningful control over attendance quality.
- Event hosts should be able to **view the reliability scores** of their attendees to make informed decisions when managing access or invitations.


### 3. Reward Attendance

- Give XP, loyalty points, badges.
- Unlock perks for reliable users.

### 4. Scarcity & FOMO

- Show limited spots / long waitlists.
- Pre-send personalized material (e.g., agenda, game matchups).

### 5. Minimize Friction

- Provide maps, instructions, and simple check-in.
- Keep users engaged post-booking.

---

## Recommendations

1. **Avoid charging and refunding 98% of users – unsustainable and high-risk.**
2. **Add behavioral incentives: XP, badges, booking streaks.**
3. **Implement no-show policies (e.g., 2-strike rule) to avoid needing refundable deposits for all users.**

---

## Sources

- Stripe Docs: [Manual capture](https://stripe.com/docs/payments/authorize-capture)
- Braintree Docs: [Authorization & capture](https://developer.paypal.com/braintree/docs/guides/authorization/overview)
- Square Docs: [Delayed capture](https://developer.squareup.com/docs/payments/overview)
- Eventtia: [How to reduce no-shows](https://www.eventtia.com/en/blog/how-to-reduce-no-shows-at-your-event)
- Eat App: [Reservation deposit strategies](https://restaurant.eatapp.co/blog/reservation-deposit)
- Reddit: Stripe risk teams and refund behavior
- Curogram / Timerise: Appointment-based no-show strategies
- ParticiPay: [https://participay.org](https://participay.org)
- Eventbrite Refundable Events: Sample listings

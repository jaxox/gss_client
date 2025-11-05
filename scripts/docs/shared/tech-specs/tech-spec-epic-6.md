# Technical Specification: Growth Gating & Invite Waves

**Epic:** Epic 6 - Growth Gating & Invite Waves  
**Status:** DRAFT  
**Created:** 2025-11-02  
**Last Updated:** 2025-11-02

---

## Overview and Scope

### Epic Context

Epic 6 implements **controlled growth mechanics** to optimize platform reliability and organic growth during the MVP launch phase. Instead of open registration, the system uses **wave-based activation** and **invite allocation** to ensure high-quality user onboarding, maintain healthy RSVP→Check-In conversion rates, and enable sustainable growth through k-factor measurement.

**Key Deliverables:**

1. **Waitlist Intake & Scoring Rubric** - Prospective users join waitlist with scoring based on geography, availability, referral source, host potential, and diversity attributes
2. **Wave Activation Engine** - Admin-triggered wave promotions that activate batches of waitlisted users based on promotion criteria and capacity thresholds
3. **Invite Allocation System** - Dynamic invite allocation (initial 5 invites per user, adjustable based on reliability and activity)
4. **Growth Metrics Dashboard** - Basic dashboard showing reliability avg, RSVP→Check-In %, k-factor approximation, and wave health metrics

**Epic Goals:**

- Control platform growth to maintain ≥85% RSVP→Check-In conversion (avoid event collapse from low reliability users)
- Enable organic growth through invite system (target k-factor ≥1.2 for sustainable growth)
- Measure growth health with instrumentation events (waitlist_joined, waitlist_activated, invite_sent, invite_redeemed)
- Provide admin tools for wave management (promote batches, adjust invite allocations, monitor throttle guardrails)

### Success Criteria

✅ **Epic Complete When:**

1. Waitlist intake form functional (email, city, sport, referral code capture)
2. Scoring rubric applied to waitlist signups (5 factors weighted, score visible in admin view)
3. Wave promotion script runs successfully (admin triggers, X users activated, snapshot logged)
4. Users receive invite allocation upon activation (5 invites default, displayed in UI)
5. Invite redemption flow complete (user enters code → bypasses waitlist → activates immediately)
6. Growth metrics dashboard shows real-time data (reliability avg, RSVP→Check-In %, k-factor, wave count)

### Dependencies

**Prerequisites (Epic 1-5 Complete):**

- User registration system (`users` table, onboarding flow) - Epic 1
- Reliability score calculation (`users.reliability_score`) - Epic 2
- RSVP→Check-In conversion tracking (`event_rsvps` table, check-in events) - Epic 2
- Instrumentation events (`instrumentation_events` table) - Epic 1

**New External Services:**

- **None** - Epic 6 is self-contained (no external APIs)

**Blocked By:**

- None (Epic 6 is independent)

**Blocks:**

- None (Epic 6 is optional for MVP launch - can skip if open registration preferred)

---

## Detailed Design

### 1. Data Models

#### 1.1 Waitlist (New Table)

**Table:** `waitlist`

**Purpose:** Store prospective user signups awaiting activation

```sql
-- Migration V30: Create waitlist table
CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    city VARCHAR(100),
    sport VARCHAR(50),
    referral_code VARCHAR(50),
    score INTEGER NOT NULL DEFAULT 0,
    score_breakdown JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'activated', 'rejected')),
    activated_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activated_at TIMESTAMP,
    activated_wave_id UUID REFERENCES activation_waves(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_waitlist_status_score ON waitlist(status, score DESC) WHERE status = 'pending';
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_referral ON waitlist(referral_code) WHERE referral_code IS NOT NULL;

COMMENT ON TABLE waitlist IS 'Epic 6: Waitlist signups with scoring rubric for wave-based activation';
COMMENT ON COLUMN waitlist.score IS 'Aggregate score from rubric (0-100 scale)';
COMMENT ON COLUMN waitlist.score_breakdown IS 'JSONB: {"geography": 20, "availability": 15, "referral": 25, "host_potential": 10, "diversity": 10}';
COMMENT ON COLUMN waitlist.activated_wave_id IS 'Wave that activated this user (NULL if invite redemption bypass)';
```

#### 1.2 Activation Waves (New Table)

**Table:** `activation_waves`

**Purpose:** Track wave promotion batches with health metrics snapshot

```sql
-- Migration V31: Create activation_waves table
CREATE TABLE activation_waves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wave_number INTEGER NOT NULL UNIQUE,
    target_user_count INTEGER NOT NULL,
    actual_activated_count INTEGER NOT NULL DEFAULT 0,
    promotion_criteria JSONB,
    health_snapshot JSONB,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activation_waves_number ON activation_waves(wave_number DESC);

COMMENT ON TABLE activation_waves IS 'Epic 6: Wave promotion batches with health metrics audit trail';
COMMENT ON COLUMN activation_waves.promotion_criteria IS 'JSONB: {"min_score": 50, "max_activations": 100, "city_priority": ["SF", "NYC"]}';
COMMENT ON COLUMN activation_waves.health_snapshot IS 'JSONB: {"reliability_avg": 0.92, "rsvp_checkin_rate": 0.88, "k_factor": 1.35, "active_users": 245}';
```

#### 1.3 User Invites (New Table)

**Table:** `user_invites`

**Purpose:** Track invite allocation, generation, and redemption

```sql
-- Migration V32: Create user_invites table
CREATE TABLE user_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invite_code VARCHAR(50) NOT NULL UNIQUE,
    redeemed_by_email VARCHAR(255),
    redeemed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    redeemed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX idx_user_invites_inviter ON user_invites(inviter_user_id);
CREATE INDEX idx_user_invites_code ON user_invites(invite_code) WHERE redeemed_at IS NULL;
CREATE INDEX idx_user_invites_redeemed ON user_invites(inviter_user_id, redeemed_at) WHERE redeemed_at IS NOT NULL;

COMMENT ON TABLE user_invites IS 'Epic 6: User-generated invite codes for organic growth (k-factor tracking)';
COMMENT ON COLUMN user_invites.invite_code IS 'Unique 8-character code (e.g., "SPORT42A")';
COMMENT ON COLUMN user_invites.expires_at IS 'Optional expiration (NULL = never expires)';
```

#### 1.4 Invite Allocations (New Table)

**Table:** `invite_allocations`

**Purpose:** Track invite quota per user (dynamic adjustments based on reliability)

```sql
-- Migration V33: Create invite_allocations table
CREATE TABLE invite_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    allocated_count INTEGER NOT NULL DEFAULT 5,
    used_count INTEGER NOT NULL DEFAULT 0,
    bonus_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_invite_allocations_user ON invite_allocations(user_id);

COMMENT ON TABLE invite_allocations IS 'Epic 6: Invite quota tracking per user (initial 5, bonus for high reliability)';
COMMENT ON COLUMN invite_allocations.bonus_count IS 'Bonus invites awarded for high reliability (≥0.95) or host activity';
```

#### 1.5 Users Table Extension

**Update:** `users` table gets new columns for activation tracking

```sql
-- Migration V34: Add activation tracking to users table
ALTER TABLE users
ADD COLUMN activated_at TIMESTAMP,
ADD COLUMN activated_wave_id UUID REFERENCES activation_waves(id) ON DELETE SET NULL,
ADD COLUMN invited_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_users_activation ON users(activated_at);
CREATE INDEX idx_users_inviter ON users(invited_by_user_id) WHERE invited_by_user_id IS NOT NULL;

COMMENT ON COLUMN users.activated_at IS 'Epic 6: Timestamp when user was activated from waitlist or via invite';
COMMENT ON COLUMN users.activated_wave_id IS 'Epic 6: Wave that activated this user (NULL if invite redemption)';
COMMENT ON COLUMN users.invited_by_user_id IS 'Epic 6: User who invited this user (k-factor attribution)';
```

### 2. Service Architecture

#### 2.1 WaitlistService (New)

**Responsibility:** Manage waitlist signups, scoring, and activation

**Key Methods:**

1. `join(email, city, sport, referralCode)` - Add user to waitlist with scoring
   - Validate email uniqueness (prevent duplicate signups)
   - Calculate score using `WaitlistScoringEngine.calculateScore()`
   - Store score breakdown in JSONB column
   - Log `waitlist_joined` instrumentation event

2. `activate(waitlistId, waveId)` - Activate waitlist user
   - Create `User` record with activated_at, activated_wave_id
   - Update waitlist status to 'activated'
   - Allocate initial 5 invites via `InviteAllocationService.allocate()`
   - Log `waitlist_activated` instrumentation event

3. `getPendingByScore(limit)` - Retrieve top-scored pending users for wave promotion

#### 2.2 WaitlistScoringEngine (New)

**Responsibility:** Calculate waitlist score based on 5-factor rubric

**Scoring Rubric (0-100 scale):**

| Factor | Weight | Calculation |
|---|---|---|
| **Geography** (0-25 pts) | High priority cities (SF, NYC, LA) = 25, Medium = 15, Other = 5 | City lookup table |
| **Availability** (0-20 pts) | Weekday evenings + weekends = 20, Weekends only = 10, Limited = 5 | Placeholder (future: survey data) |
| **Referral** (0-30 pts) | Has referral code = 30, No code = 0 | Check if referral_code NOT NULL |
| **Host Potential** (0-15 pts) | Profile suggests hosting capability = 15, Neutral = 5 | Placeholder (future: NLP on profile text) |
| **Diversity** (0-10 pts) | Underrepresented sport/geography = 10, Common = 5 | Sport rarity calculation |

**Method:**

```java
public int calculateScore(WaitlistSignup signup) {
    int geoScore = calculateGeographyScore(signup.getCity());
    int availScore = 10; // Placeholder - future: survey-based
    int referralScore = signup.getReferralCode() != null ? 30 : 0;
    int hostScore = 5; // Placeholder - future: NLP analysis
    int diversityScore = calculateDiversityScore(signup.getSport(), signup.getCity());
    
    return geoScore + availScore + referralScore + hostScore + diversityScore;
}
```

#### 2.3 WaveActivationService (New)

**Responsibility:** Execute wave promotions with criteria evaluation

**Key Methods:**

1. `promoteWave(criteria)` - Activate batch of waitlist users
   - Query pending users matching criteria (min_score, city_priority)
   - Activate up to `max_activations` users
   - Create `ActivationWave` record with health snapshot
   - Return wave promotion summary

2. `generateHealthSnapshot()` - Compute platform health metrics
   - Reliability avg: `AVG(users.reliability_score)`
   - RSVP→Check-In rate: `CHECK_IN_COUNT / RSVP_COUNT`
   - K-factor: `INVITES_REDEEMED / ACTIVE_USERS` (approximation)
   - Active users: `COUNT(users WHERE last_activity > NOW() - 30 days)`

**Wave Promotion Criteria (JSONB example):**

```json
{
  "min_score": 50,
  "max_activations": 100,
  "city_priority": ["San Francisco", "New York", "Los Angeles"],
  "sport_preference": ["Pickleball", "Volleyball"],
  "exclude_low_diversity": true
}
```

#### 2.4 InviteAllocationService (New)

**Responsibility:** Manage invite quota allocation and bonus awards

**Key Methods:**

1. `allocate(userId, initialCount)` - Allocate initial invites (default 5)
2. `generate(userId)` - Generate unique invite code
   - Format: `SPORT` + 4 random alphanumeric (e.g., "SPORT42A")
   - Check uniqueness, retry if collision
   - Decrement `used_count` in `invite_allocations`
   - Return invite code

3. `redeem(inviteCode, email)` - Redeem invite code
   - Validate code exists and not redeemed
   - Bypass waitlist, activate user immediately
   - Update `user_invites.redeemed_by_email`, `redeemed_at`
   - Create user with `invited_by_user_id` set
   - Log `invite_redeemed` instrumentation event

4. `awardBonus(userId, bonusCount, reason)` - Award bonus invites
   - Add to `invite_allocations.bonus_count`
   - Reasons: high reliability (≥0.95), host activity (3+ events created), quest completion

#### 2.5 GrowthMetricsService (New)

**Responsibility:** Calculate growth health metrics for dashboard

**Key Methods:**

1. `getMetrics()` - Return growth metrics DTO
   - Reliability avg
   - RSVP→Check-In % (last 30 days)
   - K-factor approximation (`invites_redeemed / active_users`)
   - Wave count, total waitlist size
   - Invite allocation stats (avg remaining, top inviters)

### 3. API Endpoints

#### 3.1 Waitlist API (Public)

```
POST   /api/v1/waitlist                        - Join waitlist
GET    /api/v1/waitlist/status/{email}         - Check waitlist status (position, score)
```

#### 3.2 Wave Management API (Admin Only)

```
POST   /api/v1/admin/waves/promote             - Promote wave (activate batch)
GET    /api/v1/admin/waves                     - List waves with health snapshots
GET    /api/v1/admin/waves/{waveId}            - Wave details
```

#### 3.3 Invite Management API (Authenticated Users)

```
GET    /api/v1/invites                         - Get user's invite allocation + codes
POST   /api/v1/invites/generate                - Generate new invite code
POST   /api/v1/invites/redeem                  - Redeem invite code (public endpoint)
```

#### 3.4 Growth Metrics API (Admin Only)

```
GET    /api/v1/admin/metrics/growth            - Growth metrics dashboard data
```

### 4. Workflows

#### 4.1 Waitlist Signup Flow

1. User fills waitlist form (email, city, sport, optional referral code)
2. `POST /api/v1/waitlist` → `WaitlistService.join()`
3. `WaitlistScoringEngine.calculateScore()` computes score
4. Record inserted into `waitlist` table with score breakdown
5. User receives confirmation email: "You're #42 on the waitlist (score: 75)"
6. `instrumentation_events` logged: `waitlist_joined`

#### 4.2 Wave Promotion Flow (Admin)

1. Admin clicks "Promote Wave" in dashboard
2. Sets criteria: min_score=50, max_activations=100, city_priority=["SF", "NYC"]
3. `POST /api/v1/admin/waves/promote` → `WaveActivationService.promoteWave()`
4. Query pending users: `SELECT * FROM waitlist WHERE status='pending' AND score >= 50 ORDER BY score DESC LIMIT 100`
5. For each user: `WaitlistService.activate()` creates User, allocates invites
6. Create `ActivationWave` record with health snapshot
7. Send activation emails to promoted users
8. Dashboard shows wave summary: "Wave #5: 97/100 activated, avg reliability 0.89"

#### 4.3 Invite Generation Flow

1. User clicks "Invite Friends" in app
2. `POST /api/v1/invites/generate` → `InviteAllocationService.generate()`
3. Check `invite_allocations`: user has 3/5 remaining
4. Generate unique code: "SPORT42A"
5. Insert into `user_invites` table
6. Decrement `allocated_count - used_count`
7. Return invite link: `https://app.com/signup?invite=SPORT42A`
8. User shares link via SMS/email

#### 4.4 Invite Redemption Flow

1. New user clicks invite link, lands on signup page with code pre-filled
2. User completes registration form
3. `POST /api/v1/invites/redeem` → `InviteAllocationService.redeem()`
4. Validate code exists and not expired
5. Bypass waitlist: Create User immediately
6. Set `users.invited_by_user_id` to inviter
7. Update `user_invites`: `redeemed_by_email`, `redeemed_at`
8. Allocate 5 invites to new user
9. Log instrumentation event: `invite_redeemed`
10. Inviter sees notification: "Your friend Alex joined! 2/5 invites remaining"

---

## Non-Functional Requirements

### Performance

- **Waitlist Signup:** < 500ms response time (includes scoring calculation)
- **Wave Promotion:** < 30s for 100-user batch activation
- **Metrics Dashboard:** < 2s page load (cached metrics, 5-minute TTL)

### Scalability

- **Waitlist Size:** Support 10K pending signups without degradation
- **Wave Promotion:** Batch activations up to 500 users per wave
- **Invite Code Generation:** Support 1M unique codes (8-character alphanumeric = 36^8 = 2.8 trillion combinations)

### Reliability

- **Idempotency:** Waitlist signup idempotent (duplicate email = no-op, return existing record)
- **Concurrency:** Wave promotion uses database-level locking to prevent duplicate activations
- **Error Recovery:** Failed activations rolled back (transactional wave promotion)

### Security

- **Admin Endpoints:** Restricted to users with `ADMIN` role (JWT role claim check)
- **Invite Code Validation:** Rate limit invite redemption (max 10 attempts per IP per hour)
- **Email Verification:** Waitlist signups require email confirmation (optional - MVP decision pending)

### Observability

- **Instrumentation Events:** `waitlist_joined`, `waitlist_activated`, `wave_promoted`, `invite_sent`, `invite_redeemed`
- **Metrics:** Micrometer counters for waitlist signups, wave promotions, invite redemptions
- **Logging:** Structured logs for scoring calculations, wave promotion criteria, invite generation

---

## Dependencies and Integrations

### 1. Existing Services (Epic 1-3)

- **User Registration:** `UserRepository`, user onboarding flow
- **Reliability Calculation:** `ReliabilityCalculationService.getScore()`
- **Instrumentation Events:** `InstrumentationEventService.logEvent()`

### 2. Email Service (Epic 3)

- **Postmark Integration:** Send waitlist confirmation, activation, and invite notification emails
- **Templates:** Create 3 new templates (waitlist_confirmation, waitlist_activated, invite_redeemed)

---

## Acceptance Criteria Traceability

| AC | PRD Requirement | Technical Implementation | Test Strategy |
|---|---|---|---|
| AC1 | FR030 - Waitlist signup with scoring | `WaitlistService.join()`, `WaitlistScoringEngine` | Integration test: Submit signup, verify score calculated |
| AC2 | FR031 - Wave promotion snapshot | `WaveActivationService.promoteWave()`, health snapshot JSONB | Integration test: Promote wave, verify snapshot logged |
| AC3 | FR029 - Invite allocation (5 initial) | `InviteAllocationService.allocate()` | Unit test: New user activated, verify 5 invites allocated |
| AC4 | FR029 - Invite generation & redemption | `InviteAllocationService.generate/redeem()` | E2E test: Generate code, redeem, verify user activated |
| AC5 | FR031 - Growth metrics dashboard | `GrowthMetricsService.getMetrics()`, admin API | Integration test: Query metrics, verify calculations correct |
| AC6 | NFR006 - Instrumentation events | Log events for waitlist, wave, invite actions | Integration test: Trigger action, verify event logged |

---

## Risks and Assumptions

### Risks

1. **Cold Start Problem (HIGH):**
   - Empty platform = no organic invites redeemed (k-factor = 0)
   - Mitigation: Seed initial wave with high-quality users (host potential score weighted), promote via partnerships

2. **Scoring Rubric Accuracy (MEDIUM):**
   - Placeholder scores (availability, host potential) may not correlate with reliability
   - Mitigation: Monitor wave health snapshots, iterate rubric based on data (A/B test scoring weights)

3. **Invite Spam (LOW):**
   - Users may generate fake emails to redeem own invites
   - Mitigation: Email verification (future), rate limit invite redemption per IP

### Assumptions

1. **Wave Size:** 100-user waves manageable for MVP (sufficient to test reliability impact)
2. **K-Factor Target:** ≥1.2 achievable with 5-invite allocation (assumes 24% redemption rate)
3. **Admin-Triggered Waves:** Manual wave promotion acceptable for MVP (automated triggers future enhancement)
4. **Open Wave Decision:** MVP may skip waitlist entirely if growth gating not needed

---

## Test Strategy

### Unit Tests

- `WaitlistScoringEngine.calculateScore()` - Scoring rubric logic (5 factors weighted)
- `InviteAllocationService.generate()` - Unique code generation, collision handling
- `GrowthMetricsService.getMetrics()` - K-factor calculation, reliability avg

### Integration Tests

- **Waitlist Signup:** `POST /api/v1/waitlist` → verify score calculated + stored
- **Wave Promotion:** `POST /api/v1/admin/waves/promote` → verify users activated + snapshot logged
- **Invite Redemption:** `POST /api/v1/invites/redeem` → verify user created + inviter credited

### E2E Tests (Manual)

- **Full Invite Flow:** User A generates code → User B redeems → User B activated → User A sees "1/5 invites used"
- **Wave Health Dashboard:** Admin promotes wave → dashboard shows updated metrics (reliability, k-factor)

---

## Documentation Requirements

1. **API Documentation (OpenAPI):**
   - Add `/api/v1/waitlist` endpoints
   - Add `/api/v1/admin/waves` endpoints
   - Add `/api/v1/invites` endpoints

2. **Admin Runbook (docs/runbooks/growth-management.md):**
   - How to promote wave (criteria examples, expected metrics)
   - How to award bonus invites (SQL update commands)
   - Troubleshooting: Wave promotion failures, invite code collisions

3. **User Guide (Help Center):**
   - How to join waitlist
   - How to generate invite codes
   - How to redeem invite codes

---

## Future Enhancements (Post-Epic 6)

1. **Automated Wave Promotion:** Trigger waves based on health metrics (e.g., reliability > 0.90 → promote 50 users)
2. **Email Verification:** Require email confirmation for waitlist signups (prevent spam)
3. **Invite Expiration:** Set expiration dates for invite codes (e.g., 30 days)
4. **Referral Incentives:** Award XP/badges to users who invite friends (gamify growth)
5. **Waitlist Position Tracking:** Show real-time waitlist position to users
6. **A/B Test Scoring Rubric:** Test different weights for scoring factors

---

**End of Epic 6 Technical Specification**

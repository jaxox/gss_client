# Frontend Technical Specification: Developer Experience & API Infrastructure

**Epic 10: Developer Experience & API Infrastructure (Parallel Track)**

_Generated: November 9, 2025_  
_Project: gss_client (Frontend Implementation)_  
_Version: 1.0_

---

## Overview

This technical specification defines the **frontend implementation** for Epic 10 (Developer Experience & API Infrastructure), focusing on establishing robust API contract integration, client configuration management, and developer tooling to enable seamless frontend-backend coordination. This epic runs as a **parallel track** alongside Epic 4-6 implementation to accelerate development velocity.

**Context:** This is primarily a **backend-focused epic with frontend integration points**. Backend APIs (client configuration endpoint, Swagger documentation, OpenAPI spec generation) are assumed complete and documented per DEC-010 (API Contract Strategy). This document focuses on frontend consumption of these contracts: fetching client configuration, using TypeScript-generated API clients, and integrating OpenAPI documentation into development workflows.

**Key Functional Requirements:** FR-DEV-001 (Client Configuration), FR-DEV-002 (API Documentation), FR-DEV-003 (Type-Safe Clients)

**Problem Statement:** Frontend developers face friction from hardcoded constants (XP rewards, rate limits, feature flags), manual API integration without type safety, and missing/outdated API documentation. This creates integration bugs, deployment coupling (frontend redeploy to change constants), and slow development velocity. Epic 10 solves this through centralized client configuration, comprehensive OpenAPI documentation, and automated TypeScript client generation.

**Goals:**

- Implement client configuration service to fetch shared constants from backend
- Integrate TypeScript-generated API clients for type-safe backend communication
- Establish OpenAPI spec consumption workflow for frontend development
- Enable feature flag management for gradual rollouts
- Reduce hardcoded values across mobile and web clients
- Improve developer experience with self-documenting API contracts

**User-Facing Features:**

1. **Client Configuration Fetching (Mobile + Web):** Fetch shared constants (XP rewards, rate limits, feature flags) from `/api/v1/client-config` on app startup
2. **Feature Flag Integration (Mobile + Web):** Enable/disable features based on backend-controlled flags
3. **Type-Safe API Clients (Mobile + Web):** Use auto-generated TypeScript clients for all backend communication
4. **OpenAPI Documentation Access (Web):** Link to Swagger UI for interactive API testing
5. **Admin Config Dashboard (Web):** View current client configuration values (read-only for admins)

**Out of Scope (Deferred to Future Epics):**

- Admin configuration editing UI (config updates via backend deployment only)
- Client-side A/B testing framework (deferred to analytics epic expansion)
- Real-time config updates via WebSocket (deferred, HTTP polling sufficient for MVP)
- API versioning strategy (all endpoints v1 for MVP, versioning deferred)
- OpenAPI spec visualization in mobile app (web Swagger UI only)

---

## Objectives and Scope

### In Scope

**Mobile (React Native):**

1. **Client Configuration Service:**
   - Fetch configuration on app startup: GET `/api/v1/client-config`
   - Cache configuration locally (AsyncStorage) with 1-hour TTL
   - Retry logic: 3 attempts with exponential backoff
   - Fallback to cached config if network unavailable
   - Configuration includes:
     - XP rewards (event creation, RSVP, check-in, streak milestones)
     - Rate limits (kudos per event, photo uploads per recap)
     - Feature flags (quest system enabled, private events enabled, advanced partner suggestions enabled)
     - UI constants (max event capacity, deposit amounts, streak risk thresholds)
   - Export as React Context for global access

2. **Feature Flag Integration:**
   - `useFeatureFlag(flagName)` hook checks if feature enabled
   - Conditionally render UI based on flags (e.g., hide quest tab if `questSystemEnabled = false`)
   - Feature flags override environment variables for testing (ENV > backend config)

3. **TypeScript API Client Integration:**
   - Generate TypeScript client from OpenAPI spec: `npx openapi-generator-cli generate -i openapi.json -g typescript-axios -o src/api/generated`
   - Wrap generated client in custom service layer (EventService, UserService, etc.)
   - Use generated types for all API requests/responses
   - Configure client with base URL, JWT auth interceptor, error handling

4. **Configuration Refresh Logic:**
   - App foreground event triggers config refresh (if TTL expired)
   - Manual refresh button in Settings screen (for testing)
   - Configuration version tracking (log config version on fetch for debugging)

**Web (React + Vite):**

1. **Client Configuration Service:**
   - Same functionality as mobile (fetch on app load, cache with 1h TTL, retry logic)
   - Configuration stored in React Context + localStorage
   - Configuration loaded before rendering main app (suspense boundary)

2. **TypeScript API Client Integration:**
   - Same TypeScript client generation workflow as mobile
   - Vite dev server proxy to backend (`/api` → `http://localhost:8080/api`)
   - Generated client configured with base URL, JWT interceptor

3. **OpenAPI Documentation Link:**
   - Developer menu (accessible via keyboard shortcut: `Ctrl+Shift+D`)
   - "API Documentation" link opens Swagger UI in new tab: `http://localhost:8080/swagger-ui.html`
   - Link only visible in development mode (NODE_ENV === 'development')

4. **Admin Config Dashboard (Read-Only):**
   - Admin Analytics page includes "Configuration" tab
   - Display current client config values in table format:
     - XP Rewards section: event_create, rsvp, checkin, streak_milestone values
     - Rate Limits section: kudos_per_event, photos_per_recap
     - Feature Flags section: quest_system, private_events, partner_suggestions (✅ or ❌ icons)
   - "Refresh Config" button (manual trigger)
   - Last fetched timestamp: "Config last updated: 15 min ago"

### Out of Scope

- Admin configuration editing UI (config changes require backend deployment)
- Real-time config updates via WebSocket (HTTP polling sufficient)
- Client-side A/B testing framework (deferred to analytics epic)
- API versioning strategy (all v1 for MVP)
- OpenAPI spec viewer in mobile app (web Swagger UI only)
- Configuration rollback mechanism (backend responsibility)

---

## System Architecture Alignment

### Mobile Architecture

**Services:**

- `ConfigService` (Fetch and cache client configuration)
- `FeatureFlagService` (Check feature flag status)
- `ApiClientFactory` (Initialize generated TypeScript client with auth/error interceptors)

**Redux Slices:**

- `config.slice.ts` (Client configuration state: loading, data, error, lastFetched)

**Context:**

- `ConfigContext` (Global access to configuration and feature flags)

**Hooks:**

- `useConfig()` (Access entire config object)
- `useFeatureFlag(flag: string)` (Check if feature enabled)
- `useRefreshConfig()` (Manual config refresh function)

### Web Architecture

**Services:**

- `ConfigService` (Same as mobile)
- `FeatureFlagService` (Same as mobile)
- `ApiClientFactory` (Same as mobile)

**Context:**

- `ConfigContext` (Same as mobile)

**Pages:**

- `AdminConfigDashboardPage` (Display current config values, read-only)

**Components:**

- `ConfigTable` (Display config sections: XP, rate limits, feature flags)
- `FeatureFlagBadge` (Visual indicator for enabled/disabled flags)

### Shared Architecture

**Generated API Client:**

- Location: `shared/src/api/generated/` (generated via openapi-generator)
- Wrapper Services: `EventServiceWrapper`, `UserServiceWrapper`, etc. (custom layer over generated client)
- Types: All request/response types imported from generated client

**Configuration Schema (TypeScript):**

```typescript
interface ClientConfig {
  xp_rewards: {
    event_create: number;
    rsvp: number;
    checkin: number;
    streak_milestone: number;
    kudos_receive: number;
  };
  rate_limits: {
    kudos_per_event: number;
    photos_per_recap: number;
    invites_per_user: number;
  };
  feature_flags: {
    quest_system_enabled: boolean;
    private_events_enabled: boolean;
    advanced_partner_suggestions_enabled: boolean;
  };
  ui_constants: {
    max_event_capacity: number;
    default_deposit_amount: number;
    streak_risk_days: number;
  };
  version: string; // e.g., "1.2.0"
  lastUpdated: string; // ISO 8601 timestamp
}
```

---

## Detailed Design

### Services and Modules

| Service/Module         | Responsibility                                       | Key Methods                                                            | Platform    |
| ---------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- | ----------- |
| **ConfigService**      | Fetch, cache, and manage client configuration        | `fetchConfig()`, `getConfig()`, `refreshConfig()`, `getCachedConfig()` | Mobile, Web |
| **FeatureFlagService** | Check feature flag status                            | `isEnabled(flag)`, `getFlags()`                                        | Mobile, Web |
| **ApiClientFactory**   | Initialize and configure generated TypeScript client | `createClient()`, `configureAuth(token)`, `handleError(error)`         | Mobile, Web |
| **StorageService**     | Persist configuration locally                        | `saveConfig(config)`, `loadConfig()`, `clearConfig()`                  | Mobile, Web |

### Data Models and Contracts

```typescript
// Client Configuration Models
interface ClientConfig {
  xp_rewards: XPRewards;
  rate_limits: RateLimits;
  feature_flags: FeatureFlags;
  ui_constants: UIConstants;
  version: string;
  lastUpdated: string;
}

interface XPRewards {
  event_create: number; // Default: 50
  rsvp: number; // Default: 10
  checkin: number; // Default: 25
  streak_milestone: number; // Default: 100
  kudos_receive: number; // Default: 5
}

interface RateLimits {
  kudos_per_event: number; // Default: 5
  photos_per_recap: number; // Default: 5
  invites_per_user: number; // Default: 5
  reports_per_day: number; // Default: 20
}

interface FeatureFlags {
  quest_system_enabled: boolean; // Default: true
  private_events_enabled: boolean; // Default: true
  advanced_partner_suggestions_enabled: boolean; // Default: true
  admin_moderation_enabled: boolean; // Default: true
}

interface UIConstants {
  max_event_capacity: number; // Default: 50
  default_deposit_amount: number; // Default: 10
  streak_risk_days: number; // Default: 3
  notification_retention_days: number; // Default: 30
}

// Configuration State (Redux)
interface ConfigState {
  config: ClientConfig | null;
  loading: boolean;
  error: string | null;
  lastFetched: number; // Timestamp in ms
  ttl: number; // 1 hour in ms (3600000)
}

// Storage Schema (AsyncStorage / localStorage)
interface StoredConfig {
  config: ClientConfig;
  fetchedAt: number; // Timestamp in ms
}
```

### APIs and Interfaces

**Backend API Endpoints (Assumed Complete):**

```typescript
// Client Configuration API
GET    /api/v1/client-config
  Headers: None required (public endpoint)
  Response: ClientConfig
  Cache-Control: public, max-age=3600
  ETag: "config-version-1.2.0"

// OpenAPI Spec Endpoints (Backend)
GET    /v3/api-docs
  Response: OpenAPI JSON spec

GET    /swagger-ui.html
  Response: Swagger UI HTML page
```

**Frontend Service Interfaces:**

```typescript
// ConfigService
interface IConfigService {
  fetchConfig(): Promise<ClientConfig>;
  getConfig(): ClientConfig | null;
  refreshConfig(): Promise<ClientConfig>;
  getCachedConfig(): ClientConfig | null;
  isCacheValid(): boolean;
}

// FeatureFlagService
interface IFeatureFlagService {
  isEnabled(flag: keyof FeatureFlags): boolean;
  getFlags(): FeatureFlags;
  overrideFlag(flag: keyof FeatureFlags, value: boolean): void; // For testing
}

// ApiClientFactory
interface IApiClientFactory {
  createClient<T>(baseURL: string, token?: string): T;
  configureAuth(token: string): void;
  handleError(error: unknown): ApiError;
}

// StorageService
interface IStorageService {
  saveConfig(config: ClientConfig): Promise<void>;
  loadConfig(): Promise<StoredConfig | null>;
  clearConfig(): Promise<void>;
}
```

### Workflows and Sequencing

**Workflow 1: App Startup - Fetch Client Configuration (Mobile)**

1. App launches, main component renders
2. `useEffect` triggers `ConfigService.fetchConfig()` on mount
3. ConfigService checks cache: `isCacheValid()` (check if fetchedAt < 1h ago)
4. Cache valid → return cached config from AsyncStorage, set Redux state
5. Cache invalid/missing → API call: GET `/api/v1/client-config`
6. Request includes `If-None-Match` header with cached ETag (if available)
7. Backend responds:
   - 304 Not Modified → use cached config, update fetchedAt timestamp
   - 200 OK with new config → parse response, save to AsyncStorage, update Redux state
8. Success → ConfigContext provides config to all components
9. Failure → retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
10. Final failure → fallback to cached config (if available), log error to analytics
11. No cache + failure → use hardcoded defaults (embedded in app), display warning toast

**Workflow 2: Feature Flag Check (Mobile)**

1. Component needs to check if quest system enabled
2. Import `useFeatureFlag` hook: `const questEnabled = useFeatureFlag('quest_system_enabled')`
3. FeatureFlagService.isEnabled() checks config.feature_flags.quest_system_enabled
4. Environment variable override: Check `EXPO_PUBLIC_QUEST_ENABLED` (for testing)
5. ENV value overrides backend config: `process.env.EXPO_PUBLIC_QUEST_ENABLED ?? config.feature_flags.quest_system_enabled`
6. Return boolean: true or false
7. Component conditionally renders: `{questEnabled && <QuestTab />}`
8. Feature disabled → tab hidden, quest routes inaccessible

**Workflow 3: TypeScript API Client Initialization (Mobile)**

1. App startup, before rendering main navigation
2. ApiClientFactory.createClient() initializes generated API client:
   ```typescript
   const apiClient = ApiClientFactory.createClient<GeneratedApiClient>(
     'https://api.gss.app',
     authToken
   );
   ```
3. Configure request interceptor:
   - Add `Authorization: Bearer {token}` header
   - Add `X-App-Version` header with app version
   - Log request details (method, URL) to debug console
4. Configure response interceptor:
   - Success (2xx): Return response.data
   - Error (4xx/5xx): Extract ApiError, log to analytics, throw typed error
5. Generated client injected into service wrappers:
   ```typescript
   const eventService = new EventServiceWrapper(apiClient.EventApi);
   ```
6. Services use typed methods:
   ```typescript
   const event = await eventService.getEventById(eventId);
   // `event` type is `Event` (generated from OpenAPI spec)
   ```

**Workflow 4: Configuration Refresh (Mobile)**

1. App returns to foreground (AppState listener)
2. Check if config cache expired (fetchedAt + TTL < Date.now())
3. Expired → trigger `ConfigService.refreshConfig()` in background
4. API call: GET `/api/v1/client-config` with `If-None-Match` header
5. Response:
   - 304 Not Modified → update fetchedAt, no state change
   - 200 OK → update Redux state, save to AsyncStorage
6. Updated config propagates via ConfigContext
7. Components re-render if config values changed (feature flags, XP rewards)
8. Manual refresh: Settings screen "Refresh Config" button triggers same flow with loading spinner

**Workflow 5: Admin Config Dashboard (Web)**

1. Admin navigates to Admin Analytics → "Configuration" tab
2. Page component mounts, calls `ConfigService.getConfig()`
3. Config already fetched on app load → render immediately
4. ConfigTable component displays config in sections:
   - **XP Rewards:** Table with rows (Event Create: 50 XP, RSVP: 10 XP, etc.)
   - **Rate Limits:** Table with rows (Kudos/Event: 5, Photos/Recap: 5, etc.)
   - **Feature Flags:** Badge list with ✅/❌ icons (Quest System: ✅, Private Events: ✅)
   - **UI Constants:** Table with rows (Max Capacity: 50, Deposit: $10, etc.)
5. "Refresh Config" button triggers `ConfigService.refreshConfig()`
6. Loading spinner during fetch
7. Success → table updates with new values, toast: "Config refreshed"
8. Failure → error toast: "Failed to refresh config"
9. Last fetched timestamp updates: "Config last updated: 2 min ago"
10. No editing allowed (read-only view)

**Workflow 6: OpenAPI Documentation Access (Web Development Mode)**

1. Developer presses keyboard shortcut: `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac)
2. Developer menu modal opens with options:
   - "API Documentation" → opens `http://localhost:8080/swagger-ui.html` in new tab
   - "View Client Config" → displays current config JSON in modal
   - "Clear Cache" → clears localStorage config, triggers refetch
3. Developer clicks "API Documentation"
4. New browser tab opens with Swagger UI
5. Swagger UI displays all endpoints grouped by tag (Auth, Users, Events, Social, Gamification)
6. Developer can test endpoints directly (click "Try it out", enter params, execute)
7. Developer reviews request/response schemas, required fields, error codes
8. Developer menu only visible if `import.meta.env.DEV === true` (production builds exclude)

**Workflow 7: Feature Flag Testing (Mobile)**

1. Developer wants to test app with quest system disabled
2. Set environment variable: `EXPO_PUBLIC_QUEST_ENABLED=false`
3. Rebuild app or restart Metro bundler
4. FeatureFlagService.isEnabled('quest_system_enabled') checks ENV first
5. ENV value `false` overrides backend config `true`
6. Quest tab hidden, quest routes disabled, quest APIs not called
7. Verify UI/UX without quests (ensure no crashes, missing components)
8. Unset ENV variable to restore backend config behavior

---

## Non-Functional Requirements

### Performance

- **Config Fetch on Startup:** <1s to fetch and parse client configuration
- **Config Cache Hit:** <10ms to load config from AsyncStorage/localStorage
- **Feature Flag Check:** <1ms (synchronous read from memory)
- **TypeScript Client Init:** <100ms to create and configure API client
- **Config Refresh:** <1s for background refresh (app foreground event)
- **Admin Dashboard Load:** <500ms to render config table (config already cached)

### Reliability/Availability

- **Offline Config Access:** App uses cached config if network unavailable (1h TTL ensures recent data)
- **Config Fetch Retry:** 3 attempts with exponential backoff (1s, 2s, 4s delays)
- **Fallback to Defaults:** If cache + network both fail, use hardcoded defaults (embedded in app)
- **Stale Config Tolerance:** 1h cache TTL acceptable (config changes infrequent)
- **API Client Error Handling:** All generated client methods wrapped with try-catch, typed errors thrown

### Security

- **Public Config Endpoint:** `/api/v1/client-config` is public (no sensitive data)
- **Feature Flag Security:** Feature flags are client-side hints only (server enforces access control)
- **Config Integrity:** ETag validation ensures config not tampered (304 responses on match)
- **No Sensitive Data in Config:** XP rewards, rate limits, UI constants are non-sensitive
- **Admin Dashboard Access Control:** Config dashboard only accessible to admin users (JWT role check)

### Observability

- **Instrumentation Events:**
  - `client_config_fetched`: success, version, ttl_expired
  - `client_config_cache_hit`: version, cached_age_ms
  - `client_config_fetch_failed`: error, retry_count
  - `feature_flag_checked`: flag_name, enabled, overridden
  - `api_client_error`: endpoint, status_code, error_message

- **Metrics:**
  - Config fetch success rate: % successful fetches (target >99.5%)
  - Config cache hit rate: % fetches served from cache (target >80%)
  - Config staleness: Time since last successful fetch (p95 <10 min)
  - Feature flag usage: % users with each flag enabled (track adoption)
  - API client error rate: % API calls resulting in errors (target <1%)

---

## Dependencies and Integrations

**Internal Dependencies:**

- Epic 1: User authentication (JWT token for API client auth)
- Epic 2-9: All backend APIs (consumed via TypeScript-generated client)

**External Dependencies:**

- Backend Client Config API: `/api/v1/client-config` endpoint
- Backend OpenAPI Spec: `/v3/api-docs` endpoint for spec generation
- Backend Swagger UI: `/swagger-ui.html` for interactive documentation

**Third-Party SDKs:**

- `@openapitools/openapi-generator-cli`: Generate TypeScript client from OpenAPI spec
- `axios`: HTTP client (used by generated TypeScript client)
- `react-native-async-storage/async-storage`: Persistent storage for config (mobile)
- `localStorage`: Persistent storage for config (web)

**Development Tools:**

- OpenAPI Generator: Generate TypeScript client during build
- Vite Proxy: Proxy `/api` requests to backend during development
- Swagger UI: Interactive API documentation (backend serves)

---

## Acceptance Criteria (Authoritative)

### AC1: Client Configuration Fetch on Startup

1. App launch triggers GET `/api/v1/client-config` API call
2. Config includes all sections: xp_rewards, rate_limits, feature_flags, ui_constants, version, lastUpdated
3. Successful fetch saves config to AsyncStorage (mobile) or localStorage (web)
4. Config loaded into Redux state and ConfigContext
5. Components can access config via `useConfig()` hook
6. Cache TTL: 1 hour (config not refetched if within TTL)
7. Cached config used immediately on startup (API call in background if TTL expired)
8. Network failure: Retry 3 times with exponential backoff (1s, 2s, 4s)
9. Final failure: Fallback to cached config if available, else use hardcoded defaults
10. Config fetch logged to analytics: `client_config_fetched` event with version and success status

**Validation:** Launch app with network enabled, verify config fetched and cached. Kill app, launch offline, verify cached config used. Clear cache, launch offline, verify fallback defaults applied.

### AC2: Feature Flag Integration

1. FeatureFlagService provides `isEnabled(flag)` method
2. Components use `useFeatureFlag('quest_system_enabled')` hook
3. Feature flag check returns boolean: true if enabled, false if disabled
4. Environment variable overrides backend config: `EXPO_PUBLIC_QUEST_ENABLED=false` disables quest system even if backend flag true
5. UI conditionally renders based on flags:
   - `quest_system_enabled = false` → Quest tab hidden, quest routes inaccessible
   - `private_events_enabled = false` → Private event creation disabled, invite link generation hidden
   - `advanced_partner_suggestions_enabled = false` → Partner suggestions not displayed
6. Feature flag values logged on startup: `feature_flag_checked` events
7. Flag changes after config refresh propagate immediately (components re-render)
8. Default flag values if config unavailable: all flags enabled (fail-open)

**Validation:** Launch app, verify Quest tab visible (flag enabled). Set ENV `EXPO_PUBLIC_QUEST_ENABLED=false`, rebuild, verify Quest tab hidden. Unset ENV, verify tab reappears.

### AC3: TypeScript API Client Integration

1. Generated TypeScript client created from OpenAPI spec: `npx openapi-generator-cli generate -i openapi.json -g typescript-axios -o src/api/generated`
2. Generated client includes all endpoints from Epic 1-9 APIs
3. ApiClientFactory initializes client with base URL and JWT auth interceptor
4. All service wrappers (EventService, UserService, etc.) use generated client types
5. API requests use typed methods: `eventService.getEventById(id)` returns `Promise<Event>`
6. Response types match OpenAPI spec (e.g., `Event`, `User`, `GamificationProfile`)
7. Error responses typed: `ApiError` with code, message, details fields
8. Request interceptor adds `Authorization: Bearer {token}` header
9. Response interceptor extracts errors, logs to analytics, throws typed exception
10. Generated client regenerated on OpenAPI spec updates (manual `npm run generate-client` command)

**Validation:** Run `npm run generate-client`, verify `src/api/generated/` populated. Inspect generated EventApi, verify `getEventById` method exists. Call method in service wrapper, verify typed response.

### AC4: Configuration Refresh Logic

1. App foreground event (mobile) checks if config cache expired (fetchedAt + TTL < Date.now())
2. Expired cache triggers `ConfigService.refreshConfig()` in background (no UI blocking)
3. Refresh API call includes `If-None-Match: {etag}` header
4. 304 Not Modified response: Update fetchedAt timestamp, no state change
5. 200 OK response: Update Redux state, save to AsyncStorage, propagate via ConfigContext
6. Components re-render if config values changed (e.g., feature flag toggled)
7. Manual refresh: Settings screen "Refresh Config" button triggers refresh with loading spinner
8. Refresh success: Toast "Config updated" (if values changed) or "Config up to date" (if 304)
9. Refresh failure: Toast "Failed to refresh config", cached config remains
10. Last fetched timestamp updates after successful refresh

**Validation:** Launch app, wait 1h, bring app to foreground, verify config refresh triggered (check network logs for API call). Tap "Refresh Config" button, verify loading spinner, verify toast message.

### AC5: Admin Config Dashboard (Web)

1. Admin Analytics page includes "Configuration" tab (only visible to admin users)
2. Tab displays config in sections: XP Rewards, Rate Limits, Feature Flags, UI Constants
3. XP Rewards section: Table with rows (Event Create: 50 XP, RSVP: 10 XP, Check-in: 25 XP, Streak Milestone: 100 XP, Kudos Receive: 5 XP)
4. Rate Limits section: Table with rows (Kudos/Event: 5, Photos/Recap: 5, Invites: 5, Reports/Day: 20)
5. Feature Flags section: Badge list with ✅ (enabled) or ❌ (disabled) icons
6. UI Constants section: Table with rows (Max Capacity: 50, Deposit: $10, Streak Risk: 3 days, Notification Retention: 30 days)
7. "Refresh Config" button triggers manual refresh with loading spinner
8. Last fetched timestamp: "Config last updated: 15 min ago" (updates dynamically)
9. Config display is read-only (no edit fields, no save button)
10. Non-admin users cannot access config tab (404 or hidden from navigation)

**Validation:** Login as admin, navigate to Admin Analytics → Configuration, verify all sections display correct values. Click "Refresh Config", verify loading spinner, verify values update. Login as non-admin, verify tab hidden.

### AC6: OpenAPI Documentation Access (Web Development Mode)

1. Developer menu accessible via keyboard shortcut: `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac)
2. Developer menu includes "API Documentation" option
3. Click option → new browser tab opens with Swagger UI: `http://localhost:8080/swagger-ui.html`
4. Swagger UI displays all endpoints grouped by tag: Auth, Users, Events, Social, Gamification, Admin
5. Endpoints include descriptions, parameters, request/response schemas, error codes
6. Developer can test endpoints: Click "Try it out", enter params, click "Execute", view response
7. Developer menu only visible if `import.meta.env.DEV === true` (production builds exclude)
8. Production builds do not include developer menu or Swagger UI link
9. Menu also includes "View Client Config" option → displays current config JSON in modal
10. Menu includes "Clear Cache" option → clears localStorage config, triggers refetch

**Validation:** Run app in development mode, press `Ctrl+Shift+D`, verify menu appears. Click "API Documentation", verify Swagger UI opens in new tab. Build production app, verify developer menu hidden.

### AC7: Configuration Fallback and Error Handling

1. App startup with no network: Use cached config if available (within 1h TTL)
2. Cached config expired + no network: Use cached config anyway (stale better than none)
3. No cache + no network: Use hardcoded defaults embedded in app
4. Hardcoded defaults match production baseline: quest_system_enabled=true, event_create_xp=50, etc.
5. Config fetch retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
6. Retry failure logged to analytics: `client_config_fetch_failed` with error details
7. Warning toast displayed if fallback to defaults: "Using offline mode - some features may be unavailable"
8. Config fetch success after fallback: Update state, clear warning, toast "Connected"
9. Config parse error (invalid JSON): Log error, fallback to cached config or defaults
10. Feature flag missing from config: Default to true (fail-open, features enabled)

**Validation:** Launch app with no network and no cache, verify fallback defaults applied, verify warning toast. Restore network, verify config fetched, verify success toast. Corrupt cached config JSON, launch app, verify parse error logged, verify fallback.

---

## Traceability Mapping

| Acceptance Criteria | PRD Functional Requirements    | Architecture Components                                         | Stories    |
| ------------------- | ------------------------------ | --------------------------------------------------------------- | ---------- |
| AC1                 | FR-DEV-001 (Client Config)     | ConfigService, ConfigContext, AsyncStorage                      | 10-1       |
| AC2                 | FR-DEV-001 (Feature Flags)     | FeatureFlagService, useFeatureFlag hook                         | 10-1       |
| AC3                 | FR-DEV-003 (Type-Safe Clients) | ApiClientFactory, Generated TypeScript Client, Service Wrappers | 10-2, 10-3 |
| AC4                 | FR-DEV-001 (Config Refresh)    | ConfigService.refreshConfig, AppState listener                  | 10-1       |
| AC5                 | FR-DEV-002 (Admin Dashboard)   | AdminConfigDashboardPage, ConfigTable component                 | 10-1       |
| AC6                 | FR-DEV-002 (API Docs Access)   | Developer menu, Swagger UI link                                 | 10-2, 10-3 |
| AC7                 | FR-DEV-001 (Error Handling)    | ConfigService fallback logic, Retry mechanism                   | 10-1       |

**Story Breakdown (4 stories):**

- Story 10-1: Client Configuration Endpoint Integration (AC1, AC2, AC4, AC5, AC7)
- Story 10-2: Swagger Annotations for Epic 1-3 Endpoints (AC3, AC6 - backend-focused, frontend uses generated client)
- Story 10-3: Swagger Annotations for Epic 4+ Endpoints (AC3, AC6 - backend-focused, frontend uses generated client)
- Story 10-4: OpenAPI Spec Publishing & CI/CD Integration (AC3 - enables client regeneration, fully backend/DevOps)

**Note:** Stories 10-2, 10-3, 10-4 are primarily backend work (adding Swagger annotations, publishing spec). Frontend work is story 10-1 (config integration) and consuming the generated TypeScript client (AC3, done after 10-2/10-3 complete).

---

## Risks, Assumptions, Open Questions

**Risks:**

- Config fetch failure on startup: App unusable if no cache and no network (mitigated by hardcoded defaults)
- Feature flag misalignment: Backend flags true but mobile hardcoded checks false (mitigated by ENV overrides for testing)
- OpenAPI spec drift: Generated client out of sync with backend changes (mitigated by CI validation, developer discipline)
- Config cache poisoning: Corrupted cache crashes app (mitigated by parse error handling, fallback to defaults)
- Large config size: Config >100KB slows startup (mitigated by backend compression, config kept minimal)

**Assumptions:**

- Client config changes infrequent (<1 per day), 1h cache TTL acceptable
- Feature flags are client hints only, server enforces access control (e.g., private events backend validates permissions)
- OpenAPI spec regeneration manual (developer runs `npm run generate-client` after backend updates)
- Admin config dashboard read-only (config editing via backend deployment, not UI)
- TypeScript client generation works reliably (openapi-generator-cli stable for TypeScript/Axios target)

**Open Questions:**

- Should config support versioned fallback (e.g., keep last 3 configs in cache)? (Assumed no, single cache sufficient)
- Should feature flags support user segmentation (e.g., quest_system_enabled for users in city X)? (Assumed no, global flags only)
- Should we track config changes over time (audit log)? (Assumed no, deferred to admin audit epic)
- Should config include localization strings (e.g., badge names, quest descriptions)? (Assumed no, i18n handled separately)
- Should we implement real-time config updates via WebSocket? (Assumed no, HTTP polling sufficient for MVP)

---

## Test Strategy Summary

**Unit Tests (70%):**

- ConfigService: fetchConfig, getConfig, refreshConfig, isCacheValid, getCachedConfig
- FeatureFlagService: isEnabled, getFlags, overrideFlag (ENV testing)
- ApiClientFactory: createClient, configureAuth, handleError
- StorageService: saveConfig, loadConfig, clearConfig
- Config cache TTL logic (expired vs valid checks)
- Config parse error handling (invalid JSON)

**Integration Tests (20%):**

- Config fetch on app startup: Success, failure, retry, fallback to cache
- Config refresh on foreground: API call triggered, state updated, cache saved
- Feature flag propagation: Config update → flag change → component re-render
- TypeScript client initialization: Auth interceptor, error interceptor, typed requests
- Admin dashboard config display: Fetch config, render table, refresh button

**E2E Tests (10%):**

- Complete config workflow: Launch app → fetch config → cache → restart → use cache → expire → refresh
- Feature flag workflow: Config with quest_system_enabled=false → Quest tab hidden
- TypeScript client workflow: Generated client call → typed response → error handling
- Admin dashboard workflow: Navigate to config tab → view values → refresh config → verify update

**Coverage Targets:**

- Unit tests: 80% line coverage
- Integration tests: All 7 AC scenarios validated
- E2E tests: Critical paths (config fetch, feature flags, client init) verified

**Testing Tools:**

- Jest + React Native Testing Library for mobile unit/component tests
- Vitest for web unit tests
- Detox for mobile E2E testing
- Playwright for web E2E testing
- Mock Service Worker (MSW) for API mocking (config endpoint, OpenAPI spec)

---

**End of Epic 10 Frontend Technical Specification**

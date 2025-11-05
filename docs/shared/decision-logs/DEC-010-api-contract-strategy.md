# DEC-010: API Contract Strategy for Frontend Integration

**Date:** 2025-10-28  
**Status:** Approved  
**Decision Maker:** Jay (Product Manager)  
**Contributors:** Winston (Architect), Bob (Scrum Master), Dev Team

---

## Context

To enable seamless integration between our backend (Java/Spring Boot) and future frontend repositories (React Native mobile app, Web admin dashboard), we need to establish a robust API contract layer. This decision addresses how we document, version, and publish our API contracts.

**Triggering Event:** Story 4.1 review identified missing Swagger annotations as M2 finding. Architect Winston submitted formal story request for comprehensive API documentation infrastructure.

---

## Decision

We will implement **Epic 10: Developer Experience & API Infrastructure** as a **parallel track** alongside Epic 4-6 development, prioritizing API documentation as urgent infrastructure work.

### Key Decisions

1. **OpenAPI/Swagger Documentation Standard**
   - ✅ Use `springdoc-openapi-starter-webmvc-ui:2.2.0` for auto-generation
   - ✅ Require comprehensive annotations on all controllers (`@Operation`, `@ApiResponse`, `@Parameter`)
   - ✅ Require `@Schema` descriptions on all DTOs (class + field level)
   - ✅ Group endpoints by domain using `@Tag` (Auth, Users, Events, Social, Gamification)

2. **Client Configuration Endpoint**
   - ✅ Create centralized `/api/v1/client-config` endpoint for shared constants
   - ✅ Use `@ConfigurationProperties` to load from `application.yml`
   - ✅ Refactor all hardcoded magic numbers to use centralized config
   - ✅ Enable 1-hour HTTP caching with `ETag` support

3. **Spec Publishing Strategy**
   - ✅ **Use GitHub Releases** for OpenAPI spec distribution (no npm organization account)
   - ✅ Publish `openapi-{version}.json` on every tag push (`v*`)
   - ✅ Follow SemVer: MAJOR (breaking), MINOR (new endpoints), PATCH (docs)
   - ✅ Validate spec in CI/CD pipeline on every PR

4. **Implementation Timeline**
   - ✅ **Option A (Parallel Track):** Work Epic 10 alongside Epic 4-6 over 4 weeks
   - ❌ Option B (Dedicated Sprint): Rejected - too disruptive to product roadmap

---

## Rationale

### Why OpenAPI/Swagger?

- **Industry standard** for REST API documentation
- **Type-safe client generation** for TypeScript/JavaScript frontends
- **Interactive testing** via Swagger UI (`/swagger-ui.html`)
- **Contract-first development** prevents integration bugs
- **Already in Spring ecosystem** - minimal new dependencies

### Why Client Config Endpoint?

- **Single source of truth** for constants (XP rewards, rate limits, feature flags)
- **Prevents drift** between backend/frontend hardcoded values
- **Enables feature flags** for gradual rollouts
- **Reduces frontend deployments** when tuning game mechanics

### Why GitHub Releases (Not npm)?

- **No npm org account** (`@gss` unavailable) - GitHub Releases is free
- **Simpler setup** - no npm token management in CI/CD
- **Sufficient for our needs** - frontend developers can download spec from release assets
- **Alternative considered:** npm publishing (rejected due to lack of organization account)

### Why Parallel Track (Not Dedicated Sprint)?

- **Urgency:** API docs needed before mobile app development begins (Epic 11)
- **Non-blocking:** Doesn't disrupt Epic 4 social features development
- **Resource efficiency:** Different developer can work Epic 10 while Epic 4 progresses
- **Risk mitigation:** Delivers value incrementally over 4 weeks vs big-bang sprint

---

## Implementation Plan

### Epic 10 Story Breakdown (4 Stories, 8-12 Dev Sessions)

| Story | Title | Effort | Week | Status |
|-------|-------|--------|------|--------|
| 10.1 | Client Configuration Endpoint | 3 pts (2-3 sessions) | Week 1 | **Ready to Start** |
| 10.2 | Swagger Annotations for Epic 1-3 | 5 pts (3-5 sessions) | Week 2 | Backlog |
| 10.3 | Swagger Annotations for Epic 4+ | 3 pts (2-3 sessions) | Week 3 | Backlog |
| 10.4 | OpenAPI Spec Publishing & CI/CD | 3 pts (2-3 sessions) | Week 4 | Backlog |

**Total Effort:** 14 story points (8-12 dev sessions)

### Parallel Track Timeline

```
Week 1 (during Epic 4.2-4.3): Story 10.1 - Client Config Endpoint
Week 2 (during Epic 4.4-4.5): Story 10.2 - Swagger Epic 1-3 APIs
Week 3 (during Epic 4.6-5.1): Story 10.3 - Swagger Epic 4+ APIs
Week 4 (during Epic 5.2-5.3): Story 10.4 - Publishing & CI/CD
```

---

## Consequences

### Positive

- ✅ **Faster frontend development:** TypeScript client generation eliminates manual API integration
- ✅ **Fewer integration bugs:** Type-safe API calls prevent runtime errors
- ✅ **Better team collaboration:** Self-service API documentation reduces dependencies
- ✅ **Versioned contracts:** Frontend can pin to specific API version
- ✅ **Independent deployment:** Frontend/backend can deploy separately with contract compatibility

### Negative

- ⚠️ **Annotation maintenance overhead:** Developers must maintain Swagger annotations on new endpoints
- ⚠️ **CI/CD complexity:** OpenAPI validation adds step to deployment pipeline
- ⚠️ **Learning curve:** Team needs to learn Swagger annotation patterns

### Mitigation

- Add Swagger annotation checklist to Story acceptance criteria template
- Create PR review checklist item for API documentation completeness
- Document annotation patterns in coding standards (`copilot-instructions.md`)

---

## Alternatives Considered

### Alternative 1: Manual API Documentation (Markdown)

**Rejected:** Too error-prone, no type-safe client generation, docs drift from implementation

### Alternative 2: Postman Collections

**Rejected:** Not machine-readable for client generation, manual maintenance burden

### Alternative 3: GraphQL Instead of REST

**Rejected:** Too late in development (Epic 4 already has REST APIs), team unfamiliar with GraphQL

### Alternative 4: npm Package Publishing

**Rejected:** No npm organization account, GitHub Releases sufficient for MVP

### Alternative 5: Dedicated Epic 10 Sprint (Option B)

**Rejected:** Blocks Epic 4-6 progress, parallel track preferred for urgency

---

## Success Criteria

Epic 10 is successful when:

1. ✅ **100% endpoint coverage:** All REST controllers have complete Swagger annotations
2. ✅ **Frontend can generate client:** TypeScript client generation works with single command
3. ✅ **Automated publishing:** OpenAPI spec published to GitHub Releases on every tag
4. ✅ **CI validation:** Pipeline fails on invalid/incomplete API specs
5. ✅ **Zero hardcoded constants:** Frontend pulls all config from `/api/v1/client-config`
6. ✅ **Documentation quality:** Swagger UI usable by QA/frontend without backend code

---

## Dependencies

**Builds On:**
- Epic 1-4 existing REST APIs (Auth, Users, Events, Gamification, Social)

**Enables:**
- Epic 11: Mobile App (React Native) - planned Q1 2026
- Epic 12: Web Admin Dashboard - planned Q2 2026

**Blocks If Not Done:**
- Frontend developers cannot start mobile app development
- Integration bugs multiply without contract validation

---

## Technical Details

### Gradle Dependencies

```kotlin
implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")
```

### Swagger UI Configuration (`application.yml`)

```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
```

### GitHub Actions Workflow (Story 10.4)

- Trigger: Tag push (`v*`)
- Steps: Build app → Extract spec → Validate → Publish to GitHub Release
- Validation: `openapi-generator validate -i openapi.json`

---

## Monitoring & Review

- **Review Trigger:** End of Epic 10 (Week 4)
- **Success Metrics:**
  - API endpoint documentation coverage (target: 100%)
  - Frontend developer satisfaction (target: 4.5/5 in survey)
  - Time to integrate new endpoint (target: <30 min with generated client vs 2+ hours manual)
- **Review Date:** End of Week 4 (parallel track completion)

---

## Related Documents

- **Story Request:** `docs/stories/story-request-api-contract-infrastructure.md` (Winston's original proposal)
- **Epic Breakdown:** `docs/epics.md` (Epic 10 details)
- **Sprint Status:** `docs/sprint-status.yaml` (tracking)
- **Coding Standards:** `.github/instructions/copilot-instructions.md` (Swagger annotation guidelines - TBD)

---

## Approval

- **PM Approval:** Jay - 2025-10-28 ✅
- **Architect Review:** Winston - 2025-10-28 ✅
- **Next Step:** Assign Story 10.1 to developer this week

---

**Version:** 1.0  
**Last Updated:** 2025-10-28  
**Status:** Approved & Active

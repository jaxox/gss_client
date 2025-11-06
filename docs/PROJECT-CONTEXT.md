# Project Context: GSS Client Implementation

**Date Created:** November 5, 2025  
**Project:** gss_client (Gamified Social Sports Platform - Client Applications)  
**Status:** Greenfield Frontend Implementation

## ⚠️ CRITICAL CONTEXT FOR ALL AGENTS

### Project Structure Understanding

This repository contains **ONLY the frontend/client implementation** for the Gamified Social Sports Platform.

**What This Repo Contains:**

- ✅ **Client-side code** (React Native mobile + React web dashboard)
- ✅ **Frontend planning documents** (architecture.md, UX design specs)
- ✅ **Client implementation tracking** (sprint-status.yaml, stories/)

**What This Repo Does NOT Contain:**

- ❌ **Backend implementation** (exists in separate repository)
- ❌ **Backend code or API implementation**
- ❌ **Server-side functionality**

### Critical File Context

#### `docs/shared/` - BACKEND REFERENCE ONLY

**⚠️ IMPORTANT:** All files in `docs/shared/` are **REFERENCE DOCUMENTS** copied from the backend project.

- **`docs/shared/epics.md`** = Backend project's epic completion status
- **`docs/shared/PRD.md`** = Shared requirements document  
- **`docs/shared/tech-specs/`** = Backend technical specifications
- **DONE dates** (e.g., "DONE 2025-10-26") = **Backend implementation completion**
- **Epic status "COMPLETE"** = **Backend epic is finished**

#### Frontend Project Status

- **Implementation Progress:** 0% (no client code written yet)
- **Backend Status:** Complete and available via API
- **Frontend Status:** Planning complete, ready to start implementation
- **Development Strategy:** Mock-first approach using backend API contracts

### What "COMPLETE" Actually Means

When you see Epic 2 marked as "COMPLETE (2025-10-27)" in `docs/shared/epics.md`:

- ✅ **Backend API endpoints for Epic 2 are implemented and working**
- ✅ **Frontend can integrate with these completed backend endpoints**  
- ❌ **Frontend UI/components for Epic 2 are NOT implemented yet**

### Sprint Status Interpretation

The `docs/sprint-status.yaml` correctly shows everything as `backlog` because:

- **Backend implementation:** Complete (referenced in docs/shared/)
- **Frontend implementation:** Not started (this repo's responsibility)
- **Client stories:** All need frontend implementation from scratch

### Development Approach

1. **API Integration:** Use existing backend endpoints (documented in docs/shared/)
2. **Mock Development:** Start with mock data, then integrate real APIs
3. **Frontend Focus:** Build React Native mobile app + React web dashboard
4. **Reference Backend:** Use docs/shared/ files to understand API contracts and business logic

### Common Pitfalls for Agents

❌ **Don't assume implementation is done** because epics show "COMPLETE"  
❌ **Don't skip frontend work** thinking backend completion = full completion  
❌ **Don't modify docs/shared/** files (they're backend references)  
✅ **Do implement frontend components** from scratch  
✅ **Do use docs/shared/** as API contract reference  
✅ **Do update sprint-status.yaml** as frontend work progresses

### Next Steps for Implementation

1. **Epic Context Creation:** Start with `*epic-tech-context` for Epic 1
2. **Story Development:** Use `*create-story` for individual frontend stories  
3. **Frontend Implementation:** Build React Native/React components
4. **API Integration:** Connect frontend to existing backend endpoints
5. **Status Updates:** Move stories from `backlog` → `drafted` → `ready-for-dev` → `in-progress` → `review` → `done`

---

**Remember:** This is a **frontend greenfield project** that integrates with a **completed backend system**. All implementation work needed is **client-side code**.

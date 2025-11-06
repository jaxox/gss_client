# Project Context: GSS Client Implementation

**Date Created:** November 5, 2025  
**Last Updated:** November 5, 2025  
**Project:** gss_client (Gamified Social Sports Platform - Client Applications)  
**Status:** Greenfield Frontend Implementation

## 🚨 MANDATORY READ FOR ALL AGENTS - CONTEXT PRESERVATION

**BEFORE STARTING ANY WORK:** Every agent MUST read and understand this document completely.

### Agent Session Handoff Protocol

**For Incoming Agents:**

1. 📖 **READ THIS ENTIRE FILE** before making any assumptions
2. 🔍 **Check `docs/sprint-status.yaml`** for current development status
3. 📋 **Review recent work** in `docs/stories/` folder
4. 🔄 **Never assume prior agents understood the project structure correctly**

**For Departing Agents:**

1. 📝 **Update sprint-status.yaml** with any status changes
2. 💾 **Save all work** to appropriate locations
3. 📖 **Reference this document** in handoff communications

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

**🚨 CRITICAL ERROR PREVENTION:** Every agent makes this mistake! Read carefully:

**❌ WRONG:** "Epic 4/5/6 have tech specs in docs/shared/tech-specs/ so they're contexted"**
**✅ CORRECT:** "docs/shared/tech-specs/ are BACKEND reference docs, they don't make epics contexted for FRONTEND"**

**⚠️ IMPORTANT:** All files in `docs/shared/` are **READ-ONLY REFERENCE DOCUMENTS** copied from the backend project.

- **`docs/shared/epics.md`** = Backend project's epic completion status (REFERENCE ONLY)
- **`docs/shared/PRD.md`** = Shared requirements document (REFERENCE ONLY)
- **`docs/shared/tech-specs/`** = **BACKEND** technical specifications (REFERENCE ONLY)
- **DONE dates** (e.g., "DONE 2025-10-26") = **Backend implementation completion**
- **Epic status "COMPLETE"** = **Backend epic is finished, frontend NOT started**

**🎯 FOR EPIC STATUS DETECTION:**

- **ONLY** tech specs in main `docs/` directory (like `docs/tech-spec-epic-1.md`) make epics "contexted"
- **NEVER** count `docs/shared/tech-specs/` files - they're backend reference only
- **Currently only Epic 1 has frontend tech spec** - all others are backlog

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

## 📝 QUICK REFERENCE FOR AGENTS

### Key Files to Always Check

1. **`docs/PROJECT-CONTEXT.md`** (THIS FILE) - Complete project understanding
2. **`docs/sprint-status.yaml`** - Current development status and story progress
3. **`docs/shared/epics.md`** - Backend reference (DO NOT modify)
4. **`docs/architecture.md`** - Frontend architecture decisions
5. **`docs/stories/`** - Individual story implementations (frontend work)

### Status Translation Guide

| What You See | What It Actually Means |
|--------------|------------------------|
| Epic "COMPLETE" in docs/shared/ | Backend API ready, Frontend NOT implemented |
| Story "DONE" in epics.md | Backend implemented, Frontend needs implementation |
| Story "backlog" in sprint-status.yaml | Frontend story not started yet |
| Tech spec exists | Epic ready for frontend story drafting |

### Agent Role Responsibilities

**Scrum Master (SM):** Manages sprint-status.yaml, creates stories from epics  
**Developer (Dev):** Implements frontend code, updates story status to in-progress/review/done  
**Architect:** Reviews architecture, ensures alignment with backend APIs  
**Analyst:** Analyzes requirements, ensures frontend meets user needs

### Emergency Context Recovery

If an agent seems confused about project status:

1. 🔄 **Point them to this file**: "Please read docs/PROJECT-CONTEXT.md completely"
2. 📊 **Show sprint status**: "Check docs/sprint-status.yaml for current progress"
3. 🎯 **Clarify scope**: "This is frontend-only implementation, backend is complete"
4. 📋 **Reference backend docs**: "Use docs/shared/ for API contracts, don't modify them"

### Common Agent Confusion Points

**🚨 THE #1 MISTAKE EVERY AGENT MAKES:**

❌ **"Epic 4/5/6 have tech specs in docs/shared/tech-specs/ so they're contexted"**  
✅ **"docs/shared/tech-specs/ are BACKEND docs, only docs/tech-spec-epic-X.md count for frontend"**

**Other Common Mistakes:**

❌ **"Epic 2 is complete, nothing to do"** → ✅ **"Epic 2 backend is complete, frontend implementation needed"**  
❌ **"Stories are already done"** → ✅ **"Backend stories done, frontend stories need implementation"**  
❌ **"Why is everything marked backlog?"** → ✅ **"Frontend implementation hasn't started yet"**  
❌ **"I see tech specs for Epic 4/5/6"** → ✅ **"Those are in docs/shared/ - backend reference only"**

## 🧪 AGENT SELF-VALIDATION TEST

**Before updating sprint-status.yaml, answer these questions:**

1. **Q:** Which epics have frontend tech specs?  
   **A:** Only Epic 1 (`docs/tech-spec-epic-1.md`)

2. **Q:** Do Epic 4/5/6 have frontend tech specs?  
   **A:** NO - `docs/shared/tech-specs/` are backend reference only

3. **Q:** What should Epic 4/5/6 status be?  
   **A:** `backlog` (no frontend tech specs exist)

4. **Q:** When Epic 2 shows "COMPLETE" in docs/shared/epics.md, what does that mean?  
   **A:** Backend complete, frontend needs implementation

**If you got any wrong, re-read this document!**

---

**Remember:** This is a **frontend greenfield project** that integrates with a **completed backend system**. All implementation work needed is **client-side code**.

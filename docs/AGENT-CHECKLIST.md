# Agent Quick Checklist

## ✅ Before Any Sprint Status Updates

**Check these facts:**

- [ ] Only Epic 1 has frontend tech spec (`docs/tech-spec-epic-1.md`)
- [ ] `docs/shared/tech-specs/` are BACKEND reference only (don't count for frontend)
- [ ] Epic 4/5/6 should be `backlog` (no frontend tech specs)
- [ ] This is frontend-only implementation (backend already complete)
- [ ] Stories need frontend implementation even if backend shows "DONE"

## 🚨 The #1 Mistake

**❌ WRONG:** "Epic 4/5/6 are contexted because they have tech specs in docs/shared/tech-specs/"

**✅ CORRECT:** "Epic 4/5/6 are backlog because docs/shared/ files are backend reference only"

## 📍 Quick File Guide

**Frontend Files (THIS PROJECT):**

- `docs/tech-spec-epic-1.md` ← Only frontend tech spec
- `docs/sprint-status.yaml` ← Update this
- `docs/stories/` ← Frontend stories go here

**Backend Reference (READ-ONLY):**

- `docs/shared/epics.md` ← Backend status reference
- `docs/shared/tech-specs/` ← Backend tech specs (reference only)
- `docs/shared/PRD.md` ← Requirements reference

## 🎯 Current Status Reality

- **Epic 1:** `contexted` (has frontend tech spec)
- **Epic 2:** `backlog` (backend complete, frontend needed)  
- **Epic 3-10:** `backlog` (no frontend tech specs)

**If you're about to mark Epic 4/5/6 as `contexted`, STOP and re-read this checklist!**

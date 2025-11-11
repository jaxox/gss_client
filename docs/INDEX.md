# 📚 Documentation Index & Error Resolution Map

**Generated:** November 10, 2025  
**Purpose:** Comprehensive documentation catalog with reverse error-to-solution mapping  
**Audience:** AI agents, developers, and troubleshooters

---

## 🎯 Quick Navigation

- [Critical Debugging Guides](#critical-debugging-guides)
- [Error Resolution Map](#error-resolution-map-reverse-lookup)
- [Learning Documents](#learning--retrospectives)
- [Testing & Simulator Protocols](#testing--simulator-protocols)
- [Architecture & Specifications](#architecture--specifications)
- [Agent Instructions](#agent-instructions)
- [Story Documentation](#story-documentation)

---

## 🚨 Critical Debugging Guides

### React Native Metro & iOS Debugging

All debugging guides are in `knowledge-base/` directory - concise, agent-optimized format.

| Document                                                                                      | Purpose                                              | When to Use                             |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------- |
| **[AUTONOMOUS-AGENT-QUICK-REF.md](knowledge-base/AUTONOMOUS-AGENT-QUICK-REF.md)**             | **CRITICAL** - Golden rules + terminal management    | BEFORE any work - read this FIRST       |
| **[REPRODUCE_METRO_ERROR.md](knowledge-base/REPRODUCE_METRO_ERROR.md)**                       | **MANDATORY** two-terminal protocol for Metro errors | Every React Native JS debugging session |
| **[AUTONOMOUS-DEBUGGING-PLAYBOOK.md](knowledge-base/AUTONOMOUS-DEBUGGING-PLAYBOOK.md)**       | Complete autonomous workflow - no user input         | Any React Native debugging              |
| **[AGENT-TESTING-GUIDE.md](knowledge-base/AGENT-TESTING-GUIDE.md)**                           | **CRITICAL** - Testing rules, simulator protocol     | Before running tests/simulators         |
| **[LEARNING-SUMMARY-NOV-2025.md](knowledge-base/LEARNING-SUMMARY-NOV-2025.md)**               | **Key lessons learned** - Terminal rules, debugging  | Review before starting work             |
| **[React_Native_iOS_Debugging_Guide.md](knowledge-base/React_Native_iOS_Debugging_Guide.md)** | iOS simulator log collection                         | When iOS shows errors                   |
| **[iOS_Simulator_Log_Guide.md](knowledge-base/iOS_Simulator_Log_Guide.md)**                   | iOS log streaming, crash reports                     | Detailed iOS system logs                |
| **[react_native_error_logging.md](knowledge-base/react_native_error_logging.md)**             | Persistent JS error capture                          | Setting up error infrastructure         |

### Key Protocols (Concise Format)

**Metro Debugging** (REPRODUCE_METRO_ERROR.md):

- T1: `npm run metro:log` - Never interrupt
- T2: `npm run ios:no-metro` - Let complete
- Read: `mobile/logs/metro-error.log`

**Autonomous Discovery** (AUTONOMOUS-DEBUGGING-PLAYBOOK.md):

- Start app → Locate logs → Read errors → Fix → Verify
- No user input required

**Test Execution** (AGENT-TESTING-GUIDE.md):

- Jest: `npm test -- --ci --passWithNoTests --maxWorkers=2`
- Vitest: `npm test -- --run`
- Never hang in watch mode

---

## 🔍 Error Resolution Map (Reverse Lookup)

### Metro Bundler Errors

| Error Pattern                          | Cause              | Solution Document                                                   | Quick Fix                        |
| -------------------------------------- | ------------------ | ------------------------------------------------------------------- | -------------------------------- |
| `Unable to resolve module @shared/...` | Wrong module alias | [REPRODUCE_METRO_ERROR.md](knowledge-base/REPRODUCE_METRO_ERROR.md) | Change to `@gss/shared`          |
| `Unable to resolve module X`           | Missing dependency | [REPRODUCE_METRO_ERROR.md](knowledge-base/REPRODUCE_METRO_ERROR.md) | `npm install X`                  |
| `Export namespace transform` error     | Zod v4 Babel issue | [Story 2-1](stories/2-1-host-event-creation.md)                     | Add Babel plugin                 |
| `EADDRINUSE: port 8081`                | Old Metro running  | [AGENT-TESTING-GUIDE.md](knowledge-base/AGENT-TESTING-GUIDE.md)     | `lsof -ti:8081 \| xargs kill -9` |

### React Version Conflicts

| Error Pattern              | Cause                 | Solution Document                                                             | Quick Fix                          |
| -------------------------- | --------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| `React version mismatch`   | Incompatible versions | [LEARNING-SUMMARY-NOV-2025.md](knowledge-base/LEARNING-SUMMARY-NOV-2025.md)   | Add npm overrides for React 19.1.1 |
| `Peer dependency conflict` | Version constraints   | [AUTONOMOUS-AGENT-QUICK-REF.md](knowledge-base/AUTONOMOUS-AGENT-QUICK-REF.md) | Use `--legacy-peer-deps`           |

### iOS Build Errors

| Error Pattern                         | Cause           | Solution Document                                                                         | Quick Fix                           |
| ------------------------------------- | --------------- | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| `Command PhaseScriptExecution failed` | CocoaPods cache | [SIMULATOR-SETUP-GUIDE.md](knowledge-base/SIMULATOR-SETUP-GUIDE.md)                       | `pod deintegrate && pod install`    |
| `No simulator available`              | Not booted      | [SIMULATOR-SETUP-GUIDE.md](knowledge-base/SIMULATOR-SETUP-GUIDE.md)                       | `xcrun simctl boot "iPhone 17 Pro"` |
| Native build errors                   | Xcode cache     | [React_Native_iOS_Debugging_Guide.md](knowledge-base/React_Native_iOS_Debugging_Guide.md) | `rm -rf ios/build`                  |

### JavaScript Runtime Errors

| Error Pattern                | Cause          | Solution Document                                                                         | Quick Fix               |
| ---------------------------- | -------------- | ----------------------------------------------------------------------------------------- | ----------------------- |
| `undefined is not an object` | Null reference | [AGENT-TESTING-GUIDE.md](knowledge-base/AGENT-TESTING-GUIDE.md)                           | Check logs: `grep "🔴"` |
| `Module not found`           | Wrong import   | [REPRODUCE_METRO_ERROR.md](knowledge-base/REPRODUCE_METRO_ERROR.md)                       | Fix import path         |
| `Invariant Violation`        | React error    | [React_Native_iOS_Debugging_Guide.md](knowledge-base/React_Native_iOS_Debugging_Guide.md) | Check component         |

### Test Failures

| Error Pattern                 | Cause         | Solution Document                                                      | Quick Fix            |
| ----------------------------- | ------------- | ---------------------------------------------------------------------- | -------------------- |
| Tests hang                    | Watch mode    | [AGENT-TESTING-GUIDE.md](knowledge-base/AGENT-TESTING-GUIDE.md)        | Use `--ci` flag      |
| `Cannot find module` in tests | Missing setup | [TESTING-AND-SIMULATOR-PROTOCOL.md](TESTING-AND-SIMULATOR-PROTOCOL.md) | Check jest.config.js |

### Validation & Schema Errors

| Error Pattern               | Cause                      | Solution Document                                                        | Quick Fix                                 |
| --------------------------- | -------------------------- | ------------------------------------------------------------------------ | ----------------------------------------- |
| Zod validation errors       | Schema mismatch            | [stories/2-1-host-event-creation.md](stories/2-1-host-event-creation.md) | Check `error.issues` (not `error.errors`) |
| Form validation not working | Wrong Zod import or schema | [stories/2-1-host-event-creation.md](stories/2-1-host-event-creation.md) | Import from `@gss/shared`                 |

---

## 📖 Learning & Retrospectives

| Document                                                                        | Date        | Key Lessons                                               |
| ------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| **[LEARNING-SUMMARY-NOV-2025.md](knowledge-base/LEARNING-SUMMARY-NOV-2025.md)** | Nov 8, 2025 | Autonomous debugging, version conflicts, command handling |
| **[epic-1-retrospective.md](epic-1-retrospective.md)**                          | Earlier     | Epic 1 lessons                                            |

### Key Takeaways (Concise)

From **LEARNING-SUMMARY-NOV-2025.md**:

- **Autonomous Error Discovery**: JSLoggerModule captures ALL errors automatically
- **Version Conflicts**: Check constraints → Calculate version → Add npm overrides
- **Stuck Commands**: Use direct tools (xcodebuild), check status vs waiting
- **Metrics**: 15 min autonomous vs 2+ hours manual

---

## 🧪 Testing & Simulator Protocols

| Document                                                                   | Purpose                                          | Critical Info                       |
| -------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------- |
| **[AGENT-TESTING-GUIDE.md](knowledge-base/AGENT-TESTING-GUIDE.md)**        | **MANDATORY** testing rules & simulator protocol | Never hang tests, always launch app |
| **[TESTING-AND-SIMULATOR-PROTOCOL.md](TESTING-AND-SIMULATOR-PROTOCOL.md)** | General testing standards                        | Strategy & conventions              |
| **[SIMULATOR-SETUP-GUIDE.md](knowledge-base/SIMULATOR-SETUP-GUIDE.md)**    | Complete simulator setup                         | Initial setup & troubleshooting     |

### Testing Command Reference

```bash
# Shared package
cd shared && npm test -- --ci --passWithNoTests --maxWorkers=2

# Mobile package
cd mobile && npm test -- --ci --passWithNoTests --maxWorkers=2

# Web package
cd web && npm test -- --run
```

### Simulator Workflow

1. Kill existing Metro: `lsof -ti:8081 | xargs kill -9`
2. Start Metro (T1): `cd mobile && npm start`
3. Build iOS (T2): `cd mobile && npx react-native run-ios`
4. Wait 60-120s for build
5. Monitor Metro for errors
6. Verify app loads without red screens

---

## 🏗️ Architecture & Specifications

### Technical Specifications

| Epic    | Document                                     | Status      |
| ------- | -------------------------------------------- | ----------- |
| Epic 1  | [tech-spec-epic-1.md](tech-spec-epic-1.md)   | ✅ Complete |
| Epic 2  | [tech-spec-epic-2.md](tech-spec-epic-2.md)   | ✅ Complete |
| Epic 3  | [tech-spec-epic-3.md](tech-spec-epic-3.md)   | 📋 Planned  |
| Epic 4  | [tech-spec-epic-4.md](tech-spec-epic-4.md)   | 📋 Planned  |
| Epic 5  | [tech-spec-epic-5.md](tech-spec-epic-5.md)   | 📋 Planned  |
| Epic 6  | [tech-spec-epic-6.md](tech-spec-epic-6.md)   | 📋 Planned  |
| Epic 7  | [tech-spec-epic-7.md](tech-spec-epic-7.md)   | 📋 Planned  |
| Epic 8  | [tech-spec-epic-8.md](tech-spec-epic-8.md)   | 📋 Planned  |
| Epic 9  | [tech-spec-epic-9.md](tech-spec-epic-9.md)   | 📋 Planned  |
| Epic 10 | [tech-spec-epic-10.md](tech-spec-epic-10.md) | 📋 Planned  |
| Epic 11 | [tech-spec-epic-11.md](tech-spec-epic-11.md) | 📋 Planned  |

### Core Architecture

| Document                                     | Purpose                              |
| -------------------------------------------- | ------------------------------------ |
| **[architecture.md](architecture.md)**       | System architecture overview         |
| **[PROJECT-CONTEXT.md](PROJECT-CONTEXT.md)** | Project overview, goals, and context |
| **[design-system.md](design-system.md)**     | UI/UX design system specifications   |

### Validation & Reports

| Document                                                                                             | Date        | Purpose                             |
| ---------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------- |
| **[validation-report-tech-spec-epic-2-20251109.md](validation-report-tech-spec-epic-2-20251109.md)** | Nov 9, 2025 | Epic 2 technical validation         |
| **[implementation-readiness-report-2025-11-04.md](implementation-readiness-report-2025-11-04.md)**   | Nov 4, 2025 | Implementation readiness assessment |

---

## 🤖 Agent Instructions

All agent guides now in `knowledge-base/` - concise, action-oriented format.

| Document                                                                          | Purpose             | Target        |
| --------------------------------------------------------------------------------- | ------------------- | ------------- |
| **[AUTONOMOUS-AGENT-QUICK-REF.md](knowledge-base/AUTONOMOUS-AGENT-QUICK-REF.md)** | Quick reference     | All AI agents |
| **[AGENT-CHECKLIST.md](knowledge-base/AGENT-CHECKLIST.md)**                       | Operation checklist | AI agents     |

### Golden Rules (Concise)

From **AUTONOMOUS-AGENT-QUICK-REF.md**:

**Don't ask** - What error? What version? Can you click?  
**Do instead** - Start app → Read logs → Fix → Verify → Report

---

## 📝 Story Documentation

### Epic 1: Foundation & Authentication

| Story | Document                                                                      | Status      |
| ----- | ----------------------------------------------------------------------------- | ----------- |
| 1-1   | [Repository Structure Setup](stories/1-1-repository-structure-setup.md)       | ✅ Complete |
| 1-2   | [Email/Password Authentication](stories/1-2-email-password-authentication.md) | ✅ Complete |

### Epic 2: Event Management

| Story | Document                                                  | Status      |
| ----- | --------------------------------------------------------- | ----------- |
| 2-1   | [Host Event Creation](stories/2-1-host-event-creation.md) | ✅ Complete |
| 2-1   | [Completion Summary](stories/2-1-completion-summary.md)   | ✅ Complete |

### Epic 4: Social Features

| Story | Document                                                          | Status     |
| ----- | ----------------------------------------------------------------- | ---------- |
| 4-1   | [Kudos Send/Receive Flow](stories/4-1-kudos-send-receive-flow.md) | 📋 Planned |

### Story Cross-References

Story 2-1 Implementation Notes:

- Fixed Zod error structure: Use `error.issues` instead of `error.errors`
- Created comprehensive Zod schemas in `shared/src/validation/eventValidation.ts`
- Mobile uses `@gss/shared` alias for imports
- Babel plugin required for Zod v4: `@babel/plugin-transform-export-namespace-from`

---

## 🔧 Technology Stack Reference

### Validation & Type Safety

- **Zod**: Runtime validation library
  - Location: `shared/src/validation/`
  - Version: 4.1.12 (requires Babel transform plugin)
  - Error structure: `error.issues` (array of ZodIssue objects)
  - Usage: All form validation across mobile and web

### Dependencies & Versions

Key constraints documented in:

- React Native 0.82 requires React 19.1.1
- Use `npm install --legacy-peer-deps` for peer conflicts
- Zod v4+ requires `@babel/plugin-transform-export-namespace-from`

---

## 📁 Documentation Organization

**Knowledge Base** (`docs/knowledge-base/`) - Agent learning docs (concise, action-oriented):

- REPRODUCE_METRO_ERROR.md - Two-terminal Metro debugging protocol
- AUTONOMOUS-DEBUGGING-PLAYBOOK.md - Autonomous workflow (no user input)
- AGENT-TESTING-GUIDE.md - Testing & simulator rules
- LEARNING-SUMMARY-NOV-2025.md - Key lessons learned (Nov 8, 2025)
- AUTONOMOUS-AGENT-QUICK-REF.md - Quick reference card
- AGENT-CHECKLIST.md - Operation checklist
- React_Native_iOS_Debugging_Guide.md - iOS debugging
- iOS_Simulator_Log_Guide.md - iOS log collection
- react_native_error_logging.md - Error capture setup
- SIMULATOR-SETUP-GUIDE.md - Complete simulator setup
- PROJECT-CONTEXT.md - Project overview
- architecture.md - System architecture

**Technical Specs** (`docs/`) - Architecture & specifications:

- tech-spec-epic-\*.md (11 epics)
- validation-report-\*.md
- design-system.md
- TESTING-AND-SIMULATOR-PROTOCOL.md

**Stories** (`docs/stories/`) - Implementation documentation:

- 1-1, 1-2 (Epic 1), 2-1 (Epic 2), 4-1 (Epic 4)

---

## 🔗 External References

### bmad/ Directory (BMM Framework)

The `bmad/` directory contains the BMAD BMM (Better Managed Monorepo) framework:

- `bmad/bmm/agents/` - AI agent definitions
- `bmad/bmm/workflows/` - Workflow configurations
- `bmad/bmm/testarch/knowledge/` - Testing architecture knowledge base
- `bmad/core/` - Core framework components

Relevant knowledge base documents in `bmad/bmm/testarch/knowledge/`:

- `component-tdd.md` - Component TDD approach
- `error-handling.md` - Error handling patterns
- `test-levels-framework.md` - Testing levels and strategy
- `selector-resilience.md` - UI test selector patterns
- `fixture-architecture.md` - Test fixture organization

---

## 📊 Usage Patterns

### For AI Agents

1. **Starting a new debugging session?**
   → Read [REPRODUCE_METRO_ERROR.md](REPRODUCE_METRO_ERROR.md) first

2. **Encountering an error?**
   → Check [Error Resolution Map](#error-resolution-map-reverse-lookup)

3. **Need to run tests?**
   → Follow [AGENT-TESTING-GUIDE.md](AGENT-TESTING-GUIDE.md)

4. **Working on a story?**
   → Check `stories/` for implementation notes and lessons learned

### For Developers

1. **Setting up simulators?**
   → [SIMULATOR-SETUP-GUIDE.md](SIMULATOR-SETUP-GUIDE.md)

2. **Understanding the architecture?**
   → [architecture.md](architecture.md) and [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md)

3. **Implementing a feature?**
   → Check relevant `tech-spec-epic-*.md` and `stories/` docs

4. **Debugging issues?**
   → Start with [AUTONOMOUS-DEBUGGING-PLAYBOOK.md](AUTONOMOUS-DEBUGGING-PLAYBOOK.md)

---

## 🔄 Maintenance

This index should be updated when:

- ✅ New documentation files are added
- ✅ New error patterns are discovered and resolved
- ✅ New learning documents are created
- ✅ Story completion summaries reveal new lessons

**Last Updated:** November 10, 2025  
**Maintained By:** Development team and AI agents  
**Audit Frequency:** Weekly or after major debugging sessions

---

## 🎓 Quick Start for New Agents

1. **🚨 [AUTONOMOUS-AGENT-QUICK-REF.md](knowledge-base/AUTONOMOUS-AGENT-QUICK-REF.md)** - Golden rules + NEVER interrupt builds
2. **[LEARNING-SUMMARY-NOV-2025.md](knowledge-base/LEARNING-SUMMARY-NOV-2025.md)** - Critical lessons (terminal rules, debugging)
3. **Read this INDEX.md** - Understand what documentation exists
4. **[REPRODUCE_METRO_ERROR.md](knowledge-base/REPRODUCE_METRO_ERROR.md)** - Most common debugging scenario
5. **Scan Error Resolution Map above** - Common errors and fixes

---

**🚀 Ready to work? Read [AUTONOMOUS-AGENT-QUICK-REF.md](knowledge-base/AUTONOMOUS-AGENT-QUICK-REF.md) FIRST**

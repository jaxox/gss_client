# GSS Client Documentation Index

Last Updated: November 14, 2025  
Purpose: Single, high-level catalog of all project documentation.  
Scope: Index only (no how-to content). Operational guides live under `docs/knowledge-base/`.

---

## 1. Knowledge Base (Operational & Reference)

All implementation guidance, workflows, debugging, architecture and quality standards are contained in the following consolidated documents:

| File                                                       | Summary                                                           |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `knowledge-base/PROJECT-CONTEXT.md`                        | Project scope, constraints, handoff protocol, where to look next. |
| `knowledge-base/docs--agent-autonomous-debugging-guide.md` | Full autonomous agent workflow (testing, logging, debugging).     |
| `knowledge-base/docs--mobile-test-and-debug-guide.md`      | Mobile & simulator procedures (React Native/iOS).                 |
| `knowledge-base/docs--architecture.md`                     | System architecture, structure, tech decisions, patterns.         |
| `knowledge-base/docs--copilot-self-retro-spec.md`          | Output quality gates & self-retrospective specification.          |

No duplicated snippets here; read the files themselves for actionable instructions.

---

## 2. Technical Specifications & Design

| Category                       | File(s)                                                                         | Notes                                                          |
| ------------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Epic Specs                     | `tech-spec-epic-1.md` … `tech-spec-epic-11.md`                                  | Per-epic technical direction; later epics may be placeholders. |
| Design System                  | `design-system.md`                                                              | UI components, theming, interaction guidelines.                |
| UX References                  | `ux-design-specification.md`, `ux-color-themes.html`, `wireframes/`             | Visual and interaction artifacts.                              |
| Validation / Readiness Reports | `implementation-readiness-report-*.md`, `validation-report-tech-spec-epic-*.md` | Point-in-time state / verification.                            |

---

## 3. Stories & Delivery Tracking

| Artifact Type     | Location                     | Description                                       |
| ----------------- | ---------------------------- | ------------------------------------------------- |
| Story Markdown    | `docs/stories/*.md`          | Human-readable acceptance criteria & narrative.   |
| Story Context XML | `docs/stories/*.context.xml` | Generated structured context for agent execution. |
| Sprint Status     | `docs/sprint-status.yaml`    | Current lifecycle state of stories across epics.  |
| Epics Overview    | `docs/shared/epics.md`       | High-level epic definitions & sequencing.         |

Story implementation guidance (code patterns, test strategy) resides in the knowledge base documents—not here.

---

## 4. BMAD Framework Assets

| Area                        | Path                           | Purpose                                      |
| --------------------------- | ------------------------------ | -------------------------------------------- |
| Agents                      | `bmad/bmm/agents/`             | Role definitions & behaviors.                |
| Workflows                   | `bmad/bmm/workflows/`          | YAML/XML workflow orchestration configs.     |
| Core Tasks                  | `bmad/core/tasks/`             | Reusable task primitives.                    |
| Config                      | `bmad/bmm/config.yaml`         | Global BMAD project configuration.           |
| Test Architecture Knowledge | `bmad/bmm/testarch/knowledge/` | Patterns and rationale for testing approach. |

Operational usage of BMAD (invocations, sequence) is documented in the knowledge base; this section is strictly locational.

---

## 5. Retrospectives & Reports

| File                             | Intent                                          |
| -------------------------------- | ----------------------------------------------- |
| `epic-1-retrospective.md`        | Consolidated learning from Epic 1.              |
| `E2E-SUCCESS-REPORT.md` (mobile) | Mobile end‑to‑end result snapshot (if present). |
| `ci-validation-report.md`        | CI validation summary.                          |

Process / improvement mechanics: see `docs--copilot-self-retro-spec.md`.

---

## 6. Navigation Aids

Primary entry sequence for a new contributor or agent:

1. Read `PROJECT-CONTEXT.md` (scope & orientation).
2. Skim `docs--architecture.md` (structure & patterns).
3. Consult story files + context XML for active work (`sprint-status.yaml`).
4. Use debugging / testing guides only when executing (no duplication here).

---

## 7. Update Policy

Update this index ONLY when:

- A new top-level document class is added (new spec, report, consolidated guide).
- File paths change.
- Consolidation removes or renames prior artifacts.

Do NOT add how-to snippets, commands, checklists or troubleshooting steps—place those in the appropriate `knowledge-base/` file.

---

## 8. Glossary Pointers (see source docs)

Terms (definitions live in underlying docs):

- "Story Context" → in each `*.context.xml` (structured artifact).
- "BMAD" → BMAD framework directories (architecture & workflow).
- "Self-Retro" → `docs--copilot-self-retro-spec.md`.
- "Autonomous Debugging" → `docs--agent-autonomous-debugging-guide.md`.

---

Maintainer: Development team & AI agents  
Index Philosophy: Minimal, descriptive, non-procedural.  
For action steps or troubleshooting: open the referenced knowledge-base document.

---

Start with: `knowledge-base/PROJECT-CONTEXT.md`

---

## 9. iOS Simulator & E2E Script Catalog

Directory: `scripts/simulator/iOS/` (procedural usage lives inside each script & related guides).

| Script                 | Purpose (One-Line)                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `run-metro-bundler.sh` | Prepares E2E prerequisites: starts Metro, verifies/builds iOS app, checks simulator.     |
| `run-e2e.sh`           | Orchestrates iOS E2E test execution (optional auto setup, targeted test name filtering). |
| `run-simulator.sh`     | Launches iOS app in simulator (auto-start Metro if needed).                              |
| `README.md`            | Script folder overview (extended context).                                               |
| `WORKFLOW.md`          | High-level sequence explanation (complements consolidated guides).                       |

Note: This index does not replicate their flags or usage examples—open files or consult `docs/knowledge-base/docs--mobile-test-and-debug-guide.md` for operational detail.

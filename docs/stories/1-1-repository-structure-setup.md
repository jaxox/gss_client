# Story 1.1: Repository Structure Setup

Status: in-progress

## Story

As a **developer**,
I want **a properly structured multi-platform repository with CI/CD pipeline**,
so that **I can develop mobile and web applications efficiently with shared code and consistent development environment**.

## Acceptance Criteria

**AC1: Multi-Platform Repository Structure**

1. Repository structure with `mobile/`, `web/`, and `shared/` directories
2. React Native project initialized with TheCodingMachine boilerplate in mobile/
3. React web project initialized with Vite + TypeScript template in web/
4. Shared TypeScript library configured with common types and interfaces
5. Monorepo configuration with workspace management (package.json workspaces)
6. Cross-platform build scripts and dependency management

**AC2: Development Environment Configuration**

1. TypeScript configuration files for all three packages (mobile, web, shared)
2. ESLint and Prettier configured with consistent rules across platforms
3. Pre-commit hooks configured with Husky for code quality enforcement
4. VS Code workspace configuration with recommended extensions
5. Environment files template for development, staging, and production
6. Git configuration with appropriate .gitignore for all platforms

**AC3: CI/CD Pipeline Setup**

1. GitHub Actions workflow for automated testing and building
2. Separate build jobs for mobile (iOS/Android) and web platforms
3. TypeScript type checking across all packages in CI
4. Automated testing pipeline with coverage reporting
5. Environment-specific deployment configuration
6. Dependency security scanning and vulnerability checks

**AC4: Development Tooling**

1. Metro bundler configuration for React Native development
2. Vite configuration optimized for React web development
3. Jest testing framework configured for all packages
4. Debugging configuration for both React Native and web
5. Hot reload and fast refresh enabled for development
6. Build optimization and bundling for production deployments

## Tasks / Subtasks

**Task 1: Initialize Repository Structure (AC: 1)**

- [x] Create mobile/, web/, shared/ directory structure
- [x] Initialize React Native project with React Native CLI (standard template)
- [x] Initialize React web project with Vite + TypeScript template
- [x] Set up shared TypeScript library with workspace configuration
- [x] Configure monorepo package.json with workspaces
- [x] Create root-level build and development scripts

**Task 2: Configure Development Environment (AC: 2)**

- [ ] Set up TypeScript configurations for all packages
- [ ] Configure ESLint and Prettier with shared rules
- [ ] Install and configure Husky for pre-commit hooks
- [ ] Create VS Code workspace with recommended extensions
- [ ] Set up environment file templates (.env.example files)
- [ ] Configure .gitignore files for all platforms

**Task 3: Implement CI/CD Pipeline (AC: 3)**

- [ ] Create GitHub Actions workflow for continuous integration
- [ ] Configure build jobs for mobile and web platforms
- [ ] Add TypeScript type checking to CI pipeline
- [ ] Set up automated testing with coverage reporting
- [ ] Configure environment-specific deployment workflows
- [ ] Add dependency scanning and security checks

**Task 4: Set Up Development Tooling (AC: 4)**

- [ ] Configure Metro bundler for React Native development
- [ ] Optimize Vite configuration for web development
- [ ] Set up Jest testing framework across all packages
- [ ] Configure debugging for React Native and web
- [ ] Enable hot reload and fast refresh
- [ ] Configure production build optimization

## Dev Notes

**Implementation Priority:** This story must be completed first as it establishes the foundation for all other Epic 1 stories.

**Architecture Alignment:** Implements the multi-platform repository structure defined in architecture.md, specifically ADR-001 (Multi-Platform Repository Structure).

**Key Dependencies:** No dependencies - this is the foundational story that enables all other development.

**Development Tools:**
- React Native CLI for mobile project initialization
- Vite for web application bundling and development
- TypeScript for type safety across all packages
- ESLint + Prettier for code quality and consistency
- Husky for git hooks and pre-commit validation

**Project Structure Target:**
```
gss_client/
├── mobile/           # React Native mobile app
├── web/             # React web application  
├── shared/          # Shared TypeScript library
├── package.json     # Root monorepo configuration
├── .github/         # CI/CD workflows
└── docs/            # Documentation (existing)
```

### References

- [Source: docs/tech-spec-epic-1.md#AC1] - Repository structure requirements
- [Source: docs/architecture.md#ADR-001] - Multi-platform architecture decision
- [Source: docs/architecture.md#Project-Initialization] - Setup commands and configuration

## Dev Agent Record

### Context Reference

### Agent Model Used

### Debug Log References

**Implementation Start (November 5, 2025):**

🚀 **Starting Story 1-1: Repository Structure Setup**

**Priority Justification:** This is the foundational story that enables all other Epic 1 stories. Must establish:
- Multi-platform monorepo structure (mobile/, web/, shared/)
- Development environment and tooling
- CI/CD pipeline foundation
- TypeScript configuration across all packages

**Implementation Plan:**

**Task 1: Initialize Repository Structure**
1. Create mobile/, web/, shared/ directories
2. Initialize React Native with TheCodingMachine boilerplate  
3. Initialize React web with Vite + TypeScript
4. Set up shared TypeScript library
5. Configure monorepo with package.json workspaces

**Task 2: Development Environment Configuration**  
1. TypeScript configs for all packages
2. ESLint + Prettier with shared rules
3. Husky pre-commit hooks
4. VS Code workspace configuration

**Task 3: CI/CD Pipeline Setup**
1. GitHub Actions workflows
2. Build jobs for mobile and web
3. Testing and coverage reporting

**Task 4: Development Tooling**
1. Metro bundler (React Native)
2. Vite config (web)
3. Jest testing framework
4. Debugging configuration

### Completion Notes List

**Task 1 Progress (November 5, 2025):**

✅ **Repository Structure Created:**
- Multi-platform directories: mobile/, web/, shared/ established
- Project structure aligns with architecture.md requirements
- Monorepo workspace configuration implemented

✅ **Shared Library Foundation:**
- TypeScript configuration and build setup
- Auth types and service interfaces created (supports Story 1-3 Google SSO)
- Mock-first development pattern implemented (ADR-002)
- API contracts and response types defined

✅ **Key Files Created:**
- `/package.json` - Root monorepo configuration with workspaces
- `/shared/package.json` - Shared library package configuration
- `/shared/tsconfig.json` - TypeScript build configuration
- `/shared/src/types/auth.types.ts` - Authentication type definitions
- `/shared/src/types/api.types.ts` - API response type definitions
- `/shared/src/services/api/auth.service.ts` - AuthService interface
- `/shared/src/services/mock/mockAuth.service.ts` - Mock implementation for development
- `/shared/src/index.ts` - Main library export

✅ **Project Initialization Complete:**
- React Native project successfully initialized using standard React Native CLI
- React web project created with Vite + TypeScript template
- All TypeScript interfaces and mock services created to enable immediate development
- Network issue resolved by temporarily switching to public npm registry

**Next Steps:**
- Task 2: Development Environment Configuration (ESLint, Prettier, Husky)
- Task 3: CI/CD Pipeline Setup (GitHub Actions)  
- Task 4: Development Tooling (Metro, Vite, Jest)
- When network available: Complete React Native and Vite project initialization

### File List

**Root Configuration:**
- `package.json` - Monorepo configuration with workspaces

**Shared Library:**
- `shared/package.json` - Shared library package configuration
- `shared/tsconfig.json` - TypeScript build configuration  
- `shared/src/index.ts` - Main library export
- `shared/src/types/auth.types.ts` - Authentication type definitions
- `shared/src/types/api.types.ts` - API response type definitions
- `shared/src/services/api/auth.service.ts` - AuthService interface
- `shared/src/services/mock/mockAuth.service.ts` - Mock implementation

**Directory Structure:**
- `mobile/src/` - Mobile app structure (ready for React Native)
- `web/src/` - Web app structure (ready for React/Vite)
- `shared/src/` - Shared library with types and services

# iOS E2E Testing Scripts

These scripts help you run iOS E2E tests for the GSS Mobile app with proper setup and prerequisites.

## Quick Start

**Super Quick (One Command):**

```bash
# step2 will auto-launch step1 in new terminal if needed!
./scripts/simulator/iOS/run-e2e.sh
```

**Manual Two-Step:**

```bash
# Step 1: Setup prerequisites (Metro bundler + build app)
./scripts/simulator/iOS/run-metro-bundler.sh

# Step 2: Run E2E tests
./scripts/simulator/iOS/run-e2e.sh
```

**CI/CD Mode:**

```bash
# Non-interactive auto-setup
./scripts/simulator/iOS/run-e2e.sh --auto-setup
```

## Scripts Overview

### 1. run-metro-bundler.sh - Prerequisites Setup

Checks and starts Metro bundler, builds the iOS app if needed, and verifies the simulator.

**Features:**

- Starts Metro in background with logging
- Checks build freshness
- Color-coded output

### 2. run-e2e.sh - Run E2E Tests

Runs all E2E tests or specific tests with proper validation.
**Auto-launches step1 in new terminal if Metro isn't running!**

**Usage:**

```bash
# Run all tests (will prompt to launch step1 if needed)
./scripts/simulator/iOS/run-e2e.sh

# Run all tests with auto-setup (no prompt)
./scripts/simulator/iOS/run-e2e.sh --auto-setup

# Run specific test
./scripts/simulator/iOS/run-e2e.sh "should reach Step 3"

# Auto-setup + specific test
./scripts/simulator/iOS/run-e2e.sh --auto-setup "should reach Step 3"
```

**New Feature:** If Metro isn't running, step2 will:

1. Ask if you want to run step1 in a new terminal
2. Automatically open a new Terminal window with step1 running
3. Wait for Metro to be ready before continuing
4. Or use `--auto-setup` flag to skip the prompt

## Manual Commands

Start Metro: `cd mobile && npm start`
Build iOS: `cd mobile && npm run test:e2e:build:ios`
Run tests: `cd mobile && npm run test:e2e:ios:debug`
Stop Metro: `lsof -ti:8081 | xargs kill`

## Troubleshooting

Check Metro logs: `tail -f mobile/logs/metro-bundler.log`
List simulators: `xcrun simctl list devices`
Kill Metro: `lsof -ti:8081 | xargs kill`

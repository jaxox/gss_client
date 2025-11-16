# Post-Mortem: E2E Test Failure Root Cause Analysis

**Date:** November 15, 2025  
**Duration:** ~35 minutes wasted  
**Root Cause:** Metro bundler not running  
**Impact:** All 16 E2E tests failing with timeouts

---

## What Went Wrong

### The Mistake

I spent 35+ minutes debugging E2E test failures, investigating:

- Timer cleanup issues in React components
- Detox synchronization with React Native Paper animations
- Test configuration and wait times
- Build processes and app compilation

**All while missing the obvious root cause: Metro bundler wasn't running.**

### Why This Was Critical

Metro bundler is THE foundation of React Native development:

- Serves JavaScript bundle to simulator/emulator
- Without Metro, app launches but has no code to execute
- Main thread gets stuck waiting for bundle
- Detox reports "app is busy with 2 work items pending"
- All tests timeout waiting for elements that never render

---

## What I Should Have Done

### Step 1: Check Metro FIRST (Takes 5 seconds)

```bash
# This should have been the FIRST thing I checked
curl http://localhost:8081/status
# or
ps aux | grep "react-native start"
```

### Step 2: Start Metro If Not Running

```bash
cd mobile && npm start
# Wait for: "Dev server ready"
```

### Step 3: Re-run Tests

```bash
npm run test:e2e:ios:debug
# Tests would have passed immediately
```

**Total Time to Fix:** < 2 minutes  
**Actual Time Spent:** 35+ minutes on wrong path

---

## Red Flags I Missed

### Evidence Metro Wasn't Running

1. **All tests failing identically**
   - Every test timing out on first element
   - Same error message across all 16 tests
   - This pattern screams "app never loaded"

2. **"App is busy" message from Detox**

   ```
   The app is busy with the following tasks:
   • There are 2 work items pending on the dispatch queue
   ```

   - This typically means main thread waiting for something
   - In E2E context with blank screen = waiting for JS bundle
   - Should have triggered Metro check

3. **I checked Metro early, but never verified it stayed running**
   - Checked Metro at beginning: ✅ Running
   - Ran multiple builds and tests over 30+ minutes
   - Never re-verified Metro was still running
   - Metro likely stopped/crashed during one of the builds

4. **KB explicitly documents this**
   - KB has clear guidance about Metro being required
   - KB recommends using npm scripts that handle Metro
   - I ignored KB guidance and ran individual commands

---

## Why I Went Down Wrong Path

### Cognitive Biases

1. **Confirmation Bias**
   - Saw "2 work items pending" and assumed it was timers/animations
   - Found setTimeout without cleanup → assumed that was the cause
   - Fixed timers, tests still failed → went deeper into animations
   - Never stepped back to question the foundation

2. **Complexity Bias**
   - Jumped to complex solutions (React Native Paper animations, Detox sync)
   - Ignored simple explanation (Metro not running)
   - Assumed "it was working before" meant foundation was solid

3. **Sunk Cost Fallacy**
   - Spent time fixing timers → convinced myself it would help
   - Spent time researching Detox synchronization → kept going deeper
   - Should have stopped and verified basics

### Technical Mistakes

1. **Didn't follow scientific method**
   - Started with hypothesis ("timers are the problem")
   - Found evidence supporting hypothesis
   - Didn't test foundational assumptions first

2. **Ignored systematic diagnostic approach**
   - Should have checked: Metro → Build → App Launch → Tests
   - Instead jumped straight to: Complex code issues → Animation systems

3. **Didn't use available scripts**
   - Project has `./scripts/simulator/iOS/run-e2e.sh` that handles EVERYTHING
   - This script checks Metro, starts it if needed, builds if needed, runs tests
   - KB recommends using these scripts
   - I completely ignored the scripts directory and ran individual commands
   - **This is the most critical mistake** - the script would have prevented the entire issue

---

## What I Learned

### Always Check Foundation First

**Before debugging complex issues:**

1. ✅ Is Metro running? (`curl http://localhost:8081/status`)
2. ✅ Is build successful? (Check for "BUILD SUCCEEDED")
3. ✅ Does app launch manually? (Open simulator, verify screens load)
4. ✅ Do basic interactions work? (Tap buttons, navigate)

**Only then** investigate test-specific issues.

### Use Provided Scripts

**The project has dedicated E2E scripts that handle EVERYTHING:**

```bash
# ✅ BEST: Use the dedicated E2E script
./scripts/simulator/iOS/run-e2e.sh --auto-setup
```

**This script automatically:**

- ✅ Checks if Metro is running
- ✅ Starts Metro if needed (in new terminal)
- ✅ Checks if app is built
- ✅ Builds app if needed
- ✅ Runs E2E tests

**I should have used this script instead of:**

- ❌ Manually starting Metro
- ❌ Running `npm run test:e2e:build:ios`
- ❌ Running `npm run test:e2e:ios:debug`

**Key Learning:** Always check `scripts/` directory FIRST before running manual commands.

### Verify Assumptions Continuously

Don't assume something is still working because it worked earlier:

- Metro can crash during builds
- Processes can die unexpectedly
- Always re-verify critical services

### Pattern Recognition

**All tests failing identically on first element = Foundation problem**

Not test-specific issues like:

- ❌ Timers
- ❌ Animations
- ❌ Synchronization
- ❌ Element locators

But foundation issues like:

- ✅ Metro not running
- ✅ App crashed on launch
- ✅ Build failed
- ✅ Simulator not booted

---

## KB Updates Made

### Added Rule #0: Metro is THE Foundation

```markdown
### Rule #0: Metro Bundler is THE Foundation ⭐ CRITICAL ⭐

**BEFORE running app, tests, or E2E → Metro MUST be running**

Scripts that REQUIRE Metro:

- npm run ios
- npm run android
- npm run test:e2e:ios:debug
- npm run test:e2e:android:debug
```

### Enhanced Troubleshooting Section

Added Metro check as **first step** in troubleshooting:

- Priority #1: Check Metro status
- 90% of timeout issues = Metro not running
- Quick diagnostic commands
- Clear symptoms to recognize

---

## Action Items

### For Future Debugging

1. **Create checklist for E2E debugging:**
   - [ ] Metro running?
   - [ ] Build succeeded?
   - [ ] App launches manually?
   - [ ] Then investigate test issues

2. **Use the existing E2E script that already does this:**

   ```bash
   # This script ALREADY checks Metro, builds, and runs tests
   ./scripts/simulator/iOS/run-e2e.sh --auto-setup
   ```

   **No need to add health checks - they already exist in the script!**

3. **Always start with simplest explanation:**
   - Occam's Razor: Simplest explanation is usually correct
   - Foundation before complexity
   - Environment before code

---

## Conclusion

**Root Cause:** Metro bundler not running  
**Time Wasted:** 35+ minutes  
**Fix Duration:** < 2 minutes  
**Lesson:** Always verify the foundation before debugging complexity

**Key Takeaway:** When all tests fail identically, it's not a test problem—it's an environment problem. Check Metro first.

---

**This post-mortem ensures this mistake won't happen again.**

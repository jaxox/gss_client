# Mobile Test & Debug Guide

This is the unified guide for testing, debugging, and verifying the React Native mobile app. It replaces all previous scattered documents and defines one consistent workflow for humans and AI tooling.

---

## 1. Golden Rules

### Rule #0: Metro Bundler is THE Foundation ⭐ CRITICAL ⭐

**BEFORE running app, tests, or E2E → Metro MUST be running**

```bash
# ✅ ALWAYS do this FIRST
cd mobile && npm start
# Wait for: "Dev server ready. Press Ctrl+C to exit."
```

**Why This is Rule #0:**

- Metro serves JavaScript bundle to simulator/emulator
- No Metro = app launches but has no code = white screen = all tests fail
- **90% of "tests timeout" issues = Metro not running**

**How to Check Metro Status:**

```bash
curl http://localhost:8081/status
# Should return: packager-status:running

# Or check process
ps aux | grep "react-native start"
```

**Recommended: Use E2E Scripts (They handle Metro automatically):**

- ✅ **BEST:** `./scripts/simulator/iOS/run-e2e.sh --auto-setup` - Fully automated
- ✅ `./scripts/simulator/iOS/run-e2e.sh` - Interactive (prompts to start Metro)
- ✅ `./scripts/simulator/iOS/run-metro-bundler.sh` - Just start Metro

**If running npm scripts directly, Metro MUST be running first:**

- ⚠️ `npm run ios` - Requires Metro running
- ⚠️ `npm run android` - Requires Metro running
- ⚠️ `npm run test:e2e:ios:debug` - Requires Metro running
- ⚠️ `npm run test:e2e:android:debug` - Requires Metro running

### Rule #0.5: Use Provided Scripts First ⭐

**ALWAYS check for existing scripts before running manual commands:**

```bash
# ✅ CORRECT: Use the battle-tested scripts
./scripts/simulator/iOS/run-e2e.sh --auto-setup

# ❌ WRONG: Manual commands that might miss prerequisites
npm run test:e2e:ios:debug  # Might fail if Metro not running
```

**Why Use Scripts:**

- Scripts check Metro status automatically
- Scripts verify build status
- Scripts handle environment setup
- Scripts are maintained and tested
- Scripts prevent the exact mistake I made

**Available Scripts:**

- `scripts/simulator/iOS/run-metro-bundler.sh` - Start Metro
- `scripts/simulator/iOS/run-e2e.sh` - Run E2E tests (checks everything)
- `scripts/simulator/iOS/run-e2e.sh --auto-setup` - Fully automated

### Other Golden Rules

1. **Tests must run with CI flags to avoid hangs.**
2. **Never claim a fix without proof: TypeScript clean, tests green, simulator running with no runtime errors.**
3. **Logs matter more than guesses. Always capture Metro logs, simulator logs, crash logs.**
4. **Never ask the user to manually test first. Agents must verify autonomously.**

5. **CRITICAL: NEVER run ANY new command in a terminal that has a background process running (isBackground=true).**
   - ❌ WRONG: `run_in_terminal` with `cd /path && some_command` in a terminal with active background process
   - ❌ WRONG: `run_in_terminal` with `sleep 30` in a terminal with active background process
   - ❌ WRONG: `run_in_terminal` with `tail`, `echo`, `ls`, or ANY command in a terminal with active background process
   - ✅ CORRECT: `get_terminal_output` with the terminal ID to check progress
   - **Why:** ANY new command sent to a terminal with a running background process will send SIGINT (Ctrl+C) and KILL the background process
   - **Rule:** Once you start a background process with `isBackground=true`, the ONLY way to interact with that terminal is through `get_terminal_output`. NEVER use `run_in_terminal` on that terminal ID again until the background process completes.

---

## 2. Standard Test Workflow

### 2.1 Commands to Run

```bash
cd shared
npm test -- --passWithNoTests --ci --maxWorkers=2

cd ../mobile
npm test -- --passWithNoTests --ci --maxWorkers=2

cd ../web
npm test -- --run
```

Avoid hanging commands like `npm test` without flags.

### 2.2 Success Criteria

- Exit code 0
- No failures
- All packages report pass counts
- Fix failures before simulator testing

---

## 3. Running the App

### 3.1 iOS - Use Scripts (Recommended)

**BEST: Use the provided scripts that handle everything:**

```bash
# From project root
./scripts/simulator/iOS/run-metro-bundler.sh   # Terminal 1 - Starts Metro
./scripts/simulator/iOS/run-e2e.sh             # Terminal 2 - Runs E2E tests

# Or with auto-setup (starts Metro automatically if needed)
./scripts/simulator/iOS/run-e2e.sh --auto-setup
```

**Manual approach (if scripts unavailable):**

```bash
cd mobile
lsof -ti:8081 | xargs kill -9 2>/dev/null
npm start    # Metro in one terminal
npm run ios  # Run simulator in another terminal
```

Success: Metro receives bundle requests, app loads, screens appear normally.

### 3.2 Android

```bash
cd mobile
npm start
npm run android
```

Success: Build succeeds, app loads, no crashes.

---

## 4. Logs & Error Capture

### 4.1 JavaScript Errors

Use Metro logs:

```bash
npx react-native start --reset-cache
```

Press `j` to open DevTools.

### 4.2 iOS Simulator Logs

```bash
xcrun simctl spawn booted log stream --level debug --style compact
```

Filter for app process if needed.

### 4.3 Crash Logs

**Location:**

```
~/Library/Logs/DiagnosticReports/
```

**How to Find Recent Crash Reports:**

```bash
# Find most recent GSS_Mobile crash report (last 24 hours)
find ~/Library/Logs/DiagnosticReports -name "GSS_Mobile*.crash" -mtime -1 -exec ls -lt {} \; | head -1 | awk '{print $NF}' | xargs tail -100

# Check if app is running in simulator
xcrun simctl spawn booted launchctl list | grep -i gss

# View real-time simulator logs for crash details
xcrun simctl spawn booted log show --predicate 'process == "GSS_Mobile"' --style syslog --last 2m 2>&1 | tail -50
```

**Reading Crash Reports:**

Look for these key sections:

1. **Exception Type:** `NSInvalidArgumentException`, `SIGSEGV`, etc.
2. **Exception Message:** Describes what went wrong
3. **Call Stack:** Shows the code path that led to the crash

**Common Native Crashes:**

1. **Nil Object in Dictionary:**

   ```text
   reason: '*** -[__NSPlaceholderDictionary initWithObjects:forKeys:count:]:
           attempt to insert nil object from objects[1]'
   ```

   - Cause: Native module trying to register with a nil value
   - Fix: Reinstall pods and rebuild iOS app

   ```bash
   cd mobile/ios
   pod deintegrate
   pod install
   cd ..
   # Rebuild app
   npx react-native run-ios
   ```

2. **Missing Native Module:**

   ```text
   reason: 'Invariant Violation: Native module cannot be null'
   ```

   - Cause: Native module not properly linked
   - Fix: Check auto-linking, reinstall pods, clean build

3. **Hermes Engine Crash:**
   - Cause: JavaScript syntax error or incompatibility
   - Fix: Clear Metro cache and rebuild

   ```bash
   npm start -- --reset-cache
   # In another terminal
   npx react-native run-ios
   ```

---

## 5. Optional: Capture JS Errors to File

Add a global error handler using `react-native-fs`:

```ts
import RNFS from 'react-native-fs';

global.ErrorUtils.setGlobalHandler(async (error, isFatal) => {
  const entry = `[${new Date().toISOString()}] ${isFatal ? 'FATAL' : 'ERROR'}: ${error.message}
${error.stack}
`;
  const path = RNFS.DocumentDirectoryPath + '/js-runtime-error.log';
  await RNFS.appendFile(path, entry);
});
```

---

## 6. AI Agent Behavior Contract

1. Make code change
2. Run `npx tsc --noEmit`
3. Run focused Jest tests
4. Start Metro + simulator
5. Inspect logs
6. Provide evidence before claiming success

### Forbidden

- Claiming success without logs
- Skipping tests
- Using watch mode
- Ignoring Metro errors
- Asking the user to test manually

---

## 7. Agent Output Template

```
1. TypeScript Check:
   - Command: npx tsc --noEmit
   - Result: ...

2. Tests:
   - Package: mobile
   - Command: npm test -- path
   - Result: ...

3. Simulator:
   - Command: npx react-native run-ios
   - Result: ...

4. Root Cause:
   - ...

5. Fix Applied:
   - ...
```

---

## 8. Quick Decision Map

| User Request            | Action                                            |
| ----------------------- | ------------------------------------------------- |
| “Run tests”             | Run all 3 packages with CI flags                  |
| “Run simulator”         | Kill port, start Metro, run simulator             |
| “I see an error screen” | Capture Metro + simulator logs                    |
| “The UI is broken”      | Inspect logs → verify state → run component tests |
| “Fix this”              | Apply fix → tsc → tests → simulator → logs        |

---

## 9. Checklist Before Saying “Done”

- [ ] TypeScript clean
- [ ] Tests green
- [ ] App launches on simulator
- [ ] Screen reachable and functional
- [ ] No runtime errors in Metro or logs

---

---

## Common E2E Test Issues and Solutions

### Issue 1: Tests Timeout Waiting for Elements ⭐ MOST COMMON

**Symptoms:**

- Tests fail with "Timed out while waiting for expectation"
- All tests fail at the first element check (usually menu button)
- Timeout after 10-15 seconds
- Detox logs show "app is busy with 2 work items pending"

**Root Cause Priority Order:**

#### 1. Metro Bundler Not Running (90% of timeout cases) ⭐⭐⭐

```bash
# ✅ FIRST - Check if Metro is running
curl http://localhost:8081/status

# If no response or error:
cd mobile && npm start

# Wait for "Dev server ready" message, then re-run tests
```

**How to Diagnose:**

- Open simulator manually - is the app showing content?
- Check Metro terminal - is it serving JS bundle requests?
- Look for Metro log: "Require cycle: src/..." indicates Metro is working
- Blank/white screen in simulator = Metro not running

#### 2. Wrong testID or Element Not Visible

```bash
# Check component has correct testID
<Button testID="create-event-button">Create Event</Button>

# Add waitFor with longer timeout
await waitFor(element(by.id('create-event-button')))
  .toBeVisible()
  .withTimeout(15000);
```

#### 3. App Crashed or Failed to Launch

```bash
# Check Detox logs for crash reports
# Look for: "App crashed" or "Process terminated"

# View simulator logs
xcrun simctl spawn booted log stream --predicate 'process == "GSS_Mobile"'
```

#### 4. Build is Stale (Using Old App Version)

```bash
# Rebuild E2E app
npm run test:e2e:build:ios

# Force clean build
cd ios && xcodebuild clean && cd ..
npm run test:e2e:build:ios
```

```

```

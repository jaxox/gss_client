# Agent Autonomous Debugging & Testing Guide

**Scope:** This replaces and consolidates all of the following into one concise, non-duplicated guide:

- REPRODUCE_METRO_ERROR.md
- iOS_Simulator_Log_Guide.md
- React_Native_iOS_Debugging_Guide.md
- AUTONOMOUS-DEBUGGING-PLAYBOOK.md
- AUTONOMOUS-AGENT-QUICK-REF.md
- AGENT-TESTING-GUIDE.md
- AGENT-CHECKLIST.md
- LEARNING-SUMMARY-NOV-2025.md

Use this as the **single source of truth** for how agents should run tests, use simulators, gather logs, and debug autonomously for the GSS mobile app.

---

## 1. Core Principles

1. **Operate autonomously.** Start the app, find logs, read errors, fix, and re‑verify **without asking the user** for screenshots, commands, or descriptions.
2. **Never hang tests.** Always run Jest/Vitest with CI flags – no watch mode.
3. **Never interrupt active processes.** If a terminal is building (spinner, Metro, xcodebuild, pod install), treat it as **read‑only / locked**.
4. **Logs > guesses.** Always pull Metro logs, simulator logs, or crash logs before hypothesizing.
5. **Calculate, don’t ask.** For versions, paths, or constraints, inspect the system (`npm list`, RN/React peer deps) instead of asking.
6. **Don’t declare success without proof.** You’re not done until:
   - TypeScript is clean (if applicable)
   - Tests pass
   - App builds and launches
   - UI flow has been exercised
   - Error logs are clean or understood

---

## 2. Testing Workflow (Jest / Vitest)

### 2.1 Commands (must use CI flags)

From repo root (example, adjust if different):

```bash
cd shared
npm test -- --ci --passWithNoTests --maxWorkers=2

cd ../mobile
npm test -- --ci --passWithNoTests --maxWorkers=2

cd ../web
npm test -- --run
```

**Never use:**

```bash
npm test         # ❌ enters watch mode, can hang
npm run test     # ❌ often wraps the same
```

### 2.2 What success looks like

For each package:

- Exit code = `0`
- Output includes `X passed, 0 failed`
- No command stuck waiting for input

If tests fail:

1. Read the full error message.
2. Identify **file + specific test**.
3. Fix the code or the test.
4. Re-run the **same command** until it passes.
5. Only then move on to simulator work.

---

## 3. Simulator & App Launch Workflow

### 3.1 Terminal discipline

- **Active terminal = 🔒 LOCKED** (read‑only; don’t run new commands).
  - Indicators: spinners like `⠋ Building`, ongoing `xcodebuild`, `npm start` Metro serving, `pod install` in progress.
- **Idle terminal = 🔓 AVAILABLE** (safe to reuse).
- If unsure, **start a new terminal** instead of reusing a busy one.

### 3.2 iOS: Start Metro + run app

```bash
# 1. Kill old Metro on port 8081
lsof -ti:8081 | xargs kill -9 2>/dev/null

# 2. Terminal 1 (Metro - LOCKED)
cd mobile
npm start

# 3. Terminal 2 (iOS build - LOCKED)
cd mobile
npx react-native run-ios
# or: npm run ios
```

**Wait** for build to complete. Do not type in these two terminals while they’re active.

**Success indicators:**

- Metro shows bundle requests (`Loading bundle`, `Running application`)
- iOS simulator launches
- App UI appears and is interactive
- No red error screen

### 3.3 Android: Basic pattern

```bash
# Start Metro if not already running
cd mobile
npm start

# In another terminal
cd mobile
npm run android
# or: npx react-native run-android
```

Same success criteria: app launches, UI usable, no crash.

---

## 4. Metro Error Protocol (The Reliable Way)

**Problem:** Metro red screens often don’t end up in standard logs when using `run-ios`.

**Protocol:**

1. **Terminal 1 – Metro:**

   ```bash
   cd mobile
   npm run metro:log
   ```

   - Implement `metro:log` so it starts Metro and writes JS errors to `mobile/logs/metro-error.log`.
   - Never interrupt this while debugging.

2. **Terminal 2 – iOS build:**

   ```bash
   cd mobile
   npm run ios:no-metro
   ```

   - Build and run app **without** starting a second Metro.

3. After build completes:

   ```bash
   cat mobile/logs/metro-error.log
   cat mobile/logs/ios-build.log
   ```

**Agent rules:**

- Don’t run both Metro and iOS build in the same terminal.
- Don’t use `&&` or `;` to chain them.
- Don’t read logs before build is done.

---

## 5. iOS Simulator Logging

### 5.1 Live log stream

```bash
# All simulator logs (noisy)
xcrun simctl spawn booted log stream --level debug --style compact

# Only your app by process name
xcrun simctl spawn booted log stream   --level debug   --style compact   --predicate 'process == "GSS_Mobile"'

# Save to a file
xcrun simctl spawn booted log stream   --level debug   --style compact   > ~/Desktop/gss-app-debug.log
```

### 5.2 Crash logs

```text
~/Library/Logs/DiagnosticReports/
```

Look for `YourAppName_YYYY-MM-DD-HHMMSS_<device>_sim.crash`.

### 5.3 App sandbox logs

```bash
APP_CONTAINER=$(xcrun simctl get_app_container booted org.reactjs.native.example.GSS-Mobile data)
ls "$APP_CONTAINER/Library/Logs"
ls "$APP_CONTAINER/Library/Caches"
```

If a JS error log exists (e.g. `js-errors.log`), read it:

```bash
tail -50 "$APP_CONTAINER/Library/Caches/js-errors.log"
```

---

## 6. JS / React Native Error Capture

### 6.1 Metro / DevTools

**Preferred path:**

```bash
cd mobile
npx react-native start --reset-cache
```

- Watch for red text in Metro terminal (JS error + stack).
- Press `j` to open DevTools in the browser and inspect Console.
- On simulator, press `⌘D` → “Show Error” or “Open JS Debugger”.

Copy the stack trace into your reasoning.

### 6.2 Global JS error handler (temporary)

Add near app entry if needed:

```js
const orig = global.ErrorUtils?.getGlobalHandler?.();

global.ErrorUtils?.setGlobalHandler?.((err, isFatal) => {
  console.error('[GLOBAL_JS_ERROR]', {
    isFatal,
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
  });
  orig?.(err, isFatal);
});
```

Use only while you’re hunting a stubborn crash; remove once resolved.

### 6.3 Persistent JS error log (optional pattern)

With a custom logger (e.g. `jsLogger.ts` + `JSLoggerModule.swift`):

- Log all JS errors on app startup to `js-errors.log` in the app sandbox.
- Then, as an agent:

```bash
ERROR_LOG=$(find ~/Library/Developer/CoreSimulator/Devices/*/data/Containers/Data/Application   -name "js-errors.log" 2>/dev/null | head -1)

cat "$ERROR_LOG"
```

Read the JSON, extract `message`, `name`, and `stack`.

---

## 7. Version & Dependency Conflicts

### 7.1 Detection

- Read error logs: look for version mismatch messages (e.g., `react` vs `react-test-renderer`).
- Inspect installed versions:

```bash
npm list react react-native react-test-renderer
```

- Check React Native’s peer dependency requirements for React/renderer.

### 7.2 Fix with overrides

In `package.json`:

```jsonc
"overrides": {
  "react": "19.1.1",
  "react-test-renderer": "19.1.1"
}
```

Then:

```bash
rm -rf node_modules ios/build ios/Pods
npm install --legacy-peer-deps
cd ios && pod install && cd ..
npm run ios
```

Verification:

```bash
npm list react
npm list react-test-renderer
```

Everything must be aligned to the same expected versions.

---

## 8. Stuck Commands & Terminal Recovery

### 8.1 Symptoms

- Build stuck at spinner (`⠋ Building…`)
- Terminal flooded with `log stream` output
- Ctrl+C doesn’t seem to work, or agents keep restarting builds

### 8.2 Recovery

```bash
# Stop log stream or runaway processes
pkill -f "simctl.*log stream" || true
pkill -f "^log stream" || true

# Kill Metro on 8081
lsof -ti:8081 | xargs kill -9 2>/dev/null

# Kill runaway react-native processes
pkill -9 -f "react-native" || true

# Reset terminal state
reset
```

If you previously ran `exec xcrun simctl spawn booted log stream ...`, that terminal is permanently replaced by log stream – **close it and open a new one**.

---

## 9. Autonomous Debugging Flow (End‑to‑End)

**Goal:** Fix issues in the RN app in minutes, with zero user input.

### 9.1 High‑level flow

```text
User reports a problem
  → Start app autonomously
  → Locate and read error logs
  → Analyze and identify root cause
  → Apply fix (code or config)
  → Rebuild and relaunch
  → Re-check logs and behavior
  → Only then report result
```

### 9.2 Concrete shell workflow (example)

```bash
# 1. Start Metro + iOS
cd mobile
npm start &                     # T1 - Metro (locked)
npx react-native run-ios        # T2 - build (locked)

# 2. After app launches, locate JS error log if using js-errors.log
ERROR_LOG=$(find ~/Library/Developer/CoreSimulator/Devices/*/data/Containers/Data/Application   -name "js-errors.log" 2>/dev/null | head -1)

if [ -n "$ERROR_LOG" ]; then
  cat "$ERROR_LOG"
fi

# 3. Inspect Metro logs as needed
# (read-only, don't type into the Metro terminal)
```

From there:

- If you see **version mismatch** → go to section 7.
- If you see **module not found** → fix imports / install deps.
- If you see **`undefined is not an object`** → track the component/line and debug logic.
- If there is **no JS error but app crashes** → read crash logs (section 5.2).

---

## 10. Agent Behavior Rules (Do / Don’t)

### 10.1 Don’t ask vs do instead

| ❌ Don’t Ask                        | ✅ Do Instead                                            |
| ----------------------------------- | -------------------------------------------------------- |
| “What error do you see?”            | Read `logs/metro-error.log` / `js-errors.log` / crashlog |
| “Can you click this button?”        | Launch app yourself, navigate, watch logs                |
| “What version of React are you on?” | Run `npm list react react-native react-test-renderer`    |
| “Please run this command locally…”  | Run the command yourself (autonomous execution)          |
| “Is the app still building?”        | Inspect terminal output / build logs                     |

### 10.2 When it’s acceptable to ask the user

Only for:

- Expected behavior / UX questions (“What should this screen do?”)
- Ambiguous requirements
- Hard local environment blockers after multiple automated attempts

Never ask:

- How to run tests
- Whether to use CI flags
- Whether to launch the app after starting the simulator
- For screenshots of errors you can access via logs

---

## 11. Checklists

### 11.1 Pre‑work checklist (before changing sprint status or claiming a fix)

- [ ] You understand this is a **frontend** repo; backend is separate.
- [ ] You have read `docs/PROJECT-CONTEXT.md` for scope.
- [ ] You have run tests with CI flags for all relevant packages.
- [ ] You have launched the app and navigated through the affected flow.
- [ ] You have inspected Metro / simulator / crash logs for errors.

### 11.2 Success checklist for a bug fix

- [ ] TypeScript: `npx tsc --noEmit` (if used) passes with 0 errors.
- [ ] Tests: relevant Jest/Vitest specs pass with CI flags.
- [ ] Build: `npx react-native run-ios` (or android) completes successfully.
- [ ] App: launches on simulator without red boxes.
- [ ] Logs: no unhandled JS errors or native crashes for the scenario.
- [ ] You can describe:
  - Root cause (what & why)
  - Actual fix (where & how)
  - How you verified it

---

## 12. Lessons Learned (Condensed from Nov 2025)

From real debugging sessions:

1. **Autonomous discovery beats question‑spamming.** Going straight to logs and version checks cut a 2‑hour back‑and‑forth down to ~15 minutes.
2. **Version mismatches are common and solvable.** They are almost always visible in logs plus `npm list`; computing the correct versions is straightforward once you know RN’s requirements.
3. **Terminal discipline matters.** Interrupting builds or reusing active terminals causes flakiness and wasted time. Locked vs available is a crucial mental model.
4. **Persistent logging is powerful.** Having `js-errors.log` or similar means you can debug even when the error only appears briefly at startup.
5. **Proof > optimism.** “It builds” is not enough; you need clean tests, logs, and a working app flow.

---

This guide is the **canonical reference** for how agents test, run simulators, gather logs, and debug the React Native app autonomously. If another document disagrees with this one for these topics, **this guide wins.**

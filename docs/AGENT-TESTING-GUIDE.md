# 🚨 CRITICAL: Agent Testing & Simulator Guide

**READ THIS COMPLETELY BEFORE RUNNING ANY TESTS OR SIMULATORS**

This document is MANDATORY reading for ALL agents in ALL sessions. The user is extremely frustrated with repeated mistakes. Follow these procedures exactly.

---

## 🔴 Rule #1: NEVER LET TESTS HANG

### Problem

Tests often enter watch mode or wait for user input, causing the terminal to hang indefinitely.

### Solution: ALWAYS Use CI Flags

```bash
# ❌ WRONG - Will hang in watch mode
npm test

# ✅ CORRECT - Runs once and exits
npm test -- --ci --passWithNoTests --maxWorkers=2

# ✅ CORRECT - For Vitest (web package)
npm test -- --run
```

### Required Test Commands by Package

| Package    | Command                                                          |
| ---------- | ---------------------------------------------------------------- |
| **shared** | `cd shared && npm test -- --ci --passWithNoTests --maxWorkers=2` |
| **mobile** | `cd mobile && npm test -- --ci --passWithNoTests --maxWorkers=2` |
| **web**    | `cd web && npm test -- --run`                                    |

---

## 🔴 Rule #2: Simulator is USELESS Without the App

### Problem

Agents start the simulator but never actually launch the app, making the simulator pointless.

### Critical Steps for iOS Simulator Testing

#### Step 1: Start Metro Bundler (Background)

```bash
# Kill any existing process on port 8081 first
lsof -ti:8081 | xargs kill -9 2>/dev/null

# Start Metro in background
cd mobile && npm start
```

#### Step 2: Build and Launch App

```bash
cd mobile && npx react-native run-ios
```

#### Step 3: MONITOR the Build (CRITICAL)

- **DO NOT ASSUME** the app launched successfully
- Wait for build to complete (60-120 seconds typically)
- Check Metro bundler output for connection
- Look for these success indicators:
  ```
  info Successfully launched app on <device>
  ```

#### Step 4: Check for Errors in Metro Output

```bash
# Check Metro bundler terminal for errors like:
# - Red screen errors
# - Module not found
# - Syntax errors
# - Runtime crashes
```

#### Step 5: Wait for App to Load (30-60 seconds)

- The app must fully render before testing
- Check Metro logs for bundle completion
- Look for "Running application" message

#### Step 6: Manually Test Navigation

Once app is loaded, test:

1. ✅ App launches without crashes
2. ✅ Can navigate between screens
3. ✅ No red error screens
4. ✅ No yellow warning banners (if critical)

### What to Monitor in Metro Bundler

```
✅ Good Signs:
- "Running application on iPhone"
- "Bundling complete"
- No red error messages

❌ Bad Signs (MUST FIX):
- Red box errors
- "Module not found"
- "Invariant Violation"
- "undefined is not an object"
- Connection errors
```

---

## 🔴 Rule #3: If Simulator Errors Occur, FIX THEM

### Never Report "App is building" and Move On

If you encounter errors:

1. ✅ Read the full error message
2. ✅ Identify the root cause
3. ✅ Fix the code issue
4. ✅ Rebuild and verify
5. ✅ Only report success when app actually runs

### Common Errors and Fixes

| Error                                 | Cause                    | Fix                              |
| ------------------------------------- | ------------------------ | -------------------------------- |
| `EADDRINUSE: port 8081`               | Metro already running    | `lsof -ti:8081 \| xargs kill -9` |
| Red box: "Module not found"           | Import path wrong        | Fix import statement             |
| Red box: "undefined is not an object" | Runtime error            | Debug and fix logic              |
| Yellow box warnings                   | Non-critical issues      | Document but may proceed         |
| Build fails in Xcode                  | Native compilation error | Check native dependencies        |

---

## 📋 Complete Testing Workflow

### When User Says "Run All Tests"

```bash
# 1. Test shared package
cd /Users/wlyu/dev/AI-PROJECT/gss_client/shared
npm test -- --ci --passWithNoTests --maxWorkers=2

# 2. Test mobile package
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npm test -- --ci --passWithNoTests --maxWorkers=2

# 3. Test web package
cd /Users/wlyu/dev/AI-PROJECT/gss_client/web
npm test -- --run

# 4. Report results with counts:
# - Total tests passed/failed per package
# - Specific failures with file names
# - Action items to fix failures
```

### When User Says "Run Simulator"

```bash
# 1. Kill existing Metro
lsof -ti:8081 | xargs kill -9 2>/dev/null

# 2. Start Metro (background)
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npm start
# Wait 5 seconds for Metro to initialize

# 3. Build and launch (new terminal)
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npx react-native run-ios

# 4. WAIT and MONITOR (60-120 seconds)
# Check Metro output for:
# - "Bundling complete"
# - "Running application"
# - Any red errors

# 5. VERIFY app loaded
# - Check simulator shows app UI
# - No red error screens
# - Can interact with app

# 6. TEST navigation
# - Manually navigate through screens
# - Report any crashes or errors
# - Document which flows work/don't work
```

---

## 🎯 Success Criteria

### Tests

- ✅ All three packages tested with CI flags
- ✅ Clear pass/fail counts reported
- ✅ Failures identified with filenames
- ✅ Zero hanging terminals

### Simulator

- ✅ Metro bundler running and connected
- ✅ App builds successfully
- ✅ App launches in simulator
- ✅ App renders without red screens
- ✅ Navigation tested manually
- ✅ All errors fixed or documented

---

## 🚫 What NOT to Do

❌ Run `npm test` without CI flags
❌ Start simulator without launching app
❌ Report "building" without confirming completion
❌ Ignore errors in Metro output
❌ Assume app works without visual confirmation
❌ Leave terminals hanging
❌ Skip navigation testing

---

## 📞 When to Ask User

Only ask the user when:

1. Simulator won't start after multiple attempts
2. Native build errors you cannot fix
3. Tests reveal design/architecture issues
4. Navigation errors require user input on expected behavior

**DO NOT ASK** about:

- How to run tests (follow this guide)
- Whether to use CI flags (always use them)
- Whether to launch the app (always launch it)
- Whether to monitor output (always monitor it)

---

## 🔄 After VSCode Crashes

If VSCode crashes mid-session:

1. ✅ Check what terminals were running
2. ✅ Check if Metro is still running: `lsof -i:8081`
3. ✅ Kill orphaned processes if needed
4. ✅ Restart from the appropriate step
5. ✅ Resume testing/simulator work

---

## 🔍 Rule #4: Autonomous Error Detection for iOS Simulator

### Problem

User frustrated by having to manually report errors that agents should detect themselves.

### Solution: Set Up Comprehensive Logging Infrastructure

#### Step 1: Start Log Streaming (Background)

```bash
# Stream app-specific logs (filtered for your process)
xcrun simctl spawn booted log stream --level debug --style compact \
  --predicate 'process == "GSS_Mobile"' > ~/Desktop/gss-app-debug.log 2>&1 &

# Stream full simulator logs (system + app)
xcrun simctl spawn booted log stream --level debug --style syslog \
  > ~/Desktop/gss-full-sim.log 2>&1 &
```

#### Step 2: Verify Log Streams Active

```bash
# Check processes running
ps aux | grep "simctl spawn booted log stream" | grep -v grep

# Check log files being written
ls -lh ~/Desktop/gss-*.log
```

#### Step 3: Monitor Logs Autonomously

```bash
# Real-time error monitoring (during user testing)
tail -f ~/Desktop/gss-app-debug.log | grep -iE "(error|exception|crash|fatal|🔴)"

# Check for errors after user interaction
tail -100 ~/Desktop/gss-app-debug.log | grep -iE "(error|Error|ERROR|Exception|🔴|crash|fatal)"

# Search full logs for JavaScript/React errors
tail -500 ~/Desktop/gss-full-sim.log | grep -iE "(javascript|react|metro|bundle|error)"
```

#### Step 4: Check for Crash Reports

```bash
# List recent crash reports for your app
ls -lt ~/Library/Logs/DiagnosticReports/ | grep "GSS_Mobile" | head -5

# Read crash report if found
cat ~/Library/Logs/DiagnosticReports/GSS_Mobile_<timestamp>.crash
```

#### Step 5: Implement ErrorBoundary in React Native

Create `mobile/src/components/ErrorBoundary.tsx`:

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console with prefix for easy grep
    console.error('🔴 ERROR BOUNDARY CAUGHT:', error);
    console.error('🔴 ERROR STACK:', error.stack);
    console.error('🔴 COMPONENT STACK:', errorInfo.componentStack);

    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>
            ⚠️ Error Caught
          </Text>
          <Text variant="bodyMedium" style={styles.error}>
            {this.state.error?.toString()}
          </Text>
          {this.state.error?.stack && (
            <Text variant="bodySmall" style={styles.stack}>
              {this.state.error.stack}
            </Text>
          )}
          <Button
            mode="contained"
            onPress={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Try Again
          </Button>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}
```

Wrap all screens in `App.tsx`:

```tsx
{
  currentScreen === 'login' && (
    <ErrorBoundary>
      <LoginScreen />
    </ErrorBoundary>
  );
}
```

#### Step 6: Add Global Error Handler

In `App.tsx`:

```tsx
useEffect(() => {
  const errorHandler = (error: any) => {
    console.error('🔴 GLOBAL ERROR:', error);
    console.error('🔴 ERROR STACK:', error.stack);
  };

  // @ts-ignore
  global.ErrorUtils?.setGlobalHandler?.(errorHandler);

  return () => {
    // @ts-ignore
    global.ErrorUtils?.setGlobalHandler?.(null);
  };
}, []);
```

### Error Detection Workflow

When user tests the app:

1. **Automatic Monitoring**: Logs stream to `~/Desktop/gss-*.log` files
2. **ErrorBoundary Catches**: React component errors displayed on screen + logged with 🔴
3. **Global Handler Catches**: All JavaScript errors logged with 🔴
4. **Agent Checks Logs**: Search for 🔴, "error", "exception", "crash" in log files
5. **Agent Analyzes**: Read full stack trace from logs
6. **Agent Fixes**: Identify root cause and implement fix
7. **Agent Verifies**: Re-test and confirm error resolved

### What to Search For in Logs

```bash
# Priority 1: Red flag emoji (your error markers)
grep "🔴" ~/Desktop/gss-app-debug.log

# Priority 2: Common error keywords
grep -iE "(error|exception|fatal|crash)" ~/Desktop/gss-app-debug.log

# Priority 3: React/JavaScript issues
grep -iE "(invariant|undefined is not|cannot read|failed to|warning)" ~/Desktop/gss-app-debug.log

# Priority 4: Metro bundle errors
tail -100 ~/Desktop/gss-full-sim.log | grep -i "bundle.*error"
```

### Success Criteria for Autonomous Error Detection

- ✅ Log streams running before user testing begins
- ✅ ErrorBoundary implemented and wrapping all screens
- ✅ Global error handler capturing all JavaScript errors
- ✅ All errors marked with 🔴 for easy grep
- ✅ Agent checks logs every 10-15 seconds during testing
- ✅ Agent can read and analyze stack traces without user input
- ✅ Agent fixes errors and verifies resolution autonomously

### When Logs Show No Errors But User Reports Error

1. Check if ErrorBoundary is actually rendering (not imported but unused)
2. Check Metro bundler terminal directly (not just logs)
3. Ask user to take screenshot of error screen
4. Check React Native DevTools (press `j` in Metro terminal)
5. Verify log streams are still running: `ps aux | grep simctl`

---

**Last Updated:** November 7, 2025
**User Frustration Level:** EXTREMELY HIGH - Follow this guide precisely!

---

## 🔴 Rule #5: Native & Persistent JavaScript Error Capture (No User Copy/Paste)

### Purpose

React Native ≥0.82 moves JS console output to DevTools only. We must still autonomously access error data without asking the user to read redbox text.

### Implementation Components

1. Global JS error handler (wrapped original) → forwards structured JSON to native.
2. ErrorBoundary → logs component + stack + componentStack.
3. Native Swift module `JSLoggerModule` writes JSONL lines to `Caches/js-errors.log` and emits `os_log` entries under subsystem `com.gssclient.js` category `error`.
4. Dedupe key (hash of name+message+topFrame) to avoid log spam.
5. Retrieval commands for both file and os_log.

### Retrieval Commands

```bash
# Show last 2 minutes of JS error os_log entries
log show --last 2m --predicate 'subsystem == "com.gssclient.js"' --style compact

# Locate simulator app data container and tail persistent file
APP_CONTAINER=$(xcrun simctl get_app_container booted org.reactjs.native.example.GSS-Mobile data)
tail -50 "$APP_CONTAINER/Library/Caches/js-errors.log"

# Grep for a specific dedupe key (replace ABCDEF with actual)
grep ABCDEF "$APP_CONTAINER/Library/Caches/js-errors.log"
```

### JSONL Format (one line per error)

```json
{
  "ts": "2025-11-07T20:15:42.123Z",
  "source": "global|boundary",
  "isFatal": true,
  "name": "TypeError",
  "message": "undefined is not an object (evaluating 'x.y')",
  "stack": ["funcA@App.tsx:10:5", "funcB@..."],
  "componentStack": "\n    in LoginScreen ...",
  "dedupeKey": "a1b2c3d4"
}
```

### Success Criteria

| Criterion                | Pass Condition                                             |
| ------------------------ | ---------------------------------------------------------- |
| Native module loaded     | `log show` returns lines with subsystem `com.gssclient.js` |
| File created             | `js-errors.log` exists and non-empty                       |
| Global errors captured   | Trigger runtime error → appears in both os_log & file      |
| Boundary errors captured | Throw error inside a screen → appears with componentStack  |
| No user intervention     | No need for screenshot or manual transcribing              |

### Failure Modes & Fixes

| Symptom                  | Cause                             | Fix                                                           |
| ------------------------ | --------------------------------- | ------------------------------------------------------------- |
| No `js-errors.log` file  | Module not compiled or path wrong | Re-run iOS build; confirm module filename & target membership |
| Empty os_log output      | Predicate mismatch                | Re-run with `log show --last 5m` & correct subsystem          |
| Duplicates flooding logs | Hash collision or missing dedupe  | Verify `dedupeKey` generation in `jsLogger.ts`                |
| RedBox but no log lines  | Error thrown before RN bridge     | Add try/catch at entry index.js and force logging; rebuild    |

### Verification Flow (Post-Build)

```bash
# 1. Cause a deliberate error (navigate to problematic screen)
# 2. Wait 2s
log show --last 10s --predicate 'subsystem == "com.gssclient.js"' | tail -5

# 3. Tail persistent log
APP_CONTAINER=$(xcrun simctl get_app_container booted org.reactjs.native.example.GSS-Mobile data)
tail -5 "$APP_CONTAINER/Library/Caches/js-errors.log"
```

### Agent Reporting Template

```
✅ JS error capture active
- Last error message: <message>
- Name: <name>
- Top frame: <first stack line>
- Fatal: <true/false>
- Dedupe: <dedupeKey>
- Source: global|boundary

Artifacts:
- os_log count last 2m: <N>
- js-errors.log size: <bytes>
```

### Future Enhancements (Backlog)

- Auto screenshot on first new dedupeKey (external workflow step with simctl io).
- Upload error batches to central store for cross-session recall.
- Symbolicate stacks (source maps) for production builds.

---

```

```

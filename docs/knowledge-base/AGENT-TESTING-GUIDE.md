# Agent Testing & Simulator Guide

**MANDATORY - Read before running tests or simulators**

## Rule #1: Never Let Tests Hang

### Always Use CI Flags

```bash
# ❌ WRONG - hangs in watch mode
npm test

# ✅ CORRECT
npm test -- --ci --passWithNoTests --maxWorkers=2  # Jest (shared, mobile)
npm test -- --run  # Vitest (web)
```

## Rule #2: Simulator Requires App Launch

### Wrong ❌

Start simulator but never launch app

### Right ✅

```bash
# 1. Kill old Metro
lsof -ti:8081 | xargs kill -9 2>/dev/null

# 2. Start Metro (T1, background)
cd mobile && npm start

# 3. Build & launch iOS (T2, background)
cd mobile && npx react-native run-ios

# 4. Wait 60-120s for build

# 5. Monitor Metro for errors
# Look for: "Bundling complete", "Running application"
# Watch for: Red box errors, "Module not found", crashes

# 6. Verify app loaded
# - No red error screens
# - Can interact with UI
# - Navigate between screens
```

## Rule #3: Fix Errors, Don't Ignore

Never report "building" and move on. If errors occur:

1. Read full error message
2. Identify root cause
3. Fix code
4. Rebuild and verify
5. Only report success when app actually runs

### Common Errors

| Error                        | Fix                              |
| ---------------------------- | -------------------------------- |
| `EADDRINUSE: port 8081`      | `lsof -ti:8081 \| xargs kill -9` |
| `Module not found`           | Fix import path                  |
| `undefined is not an object` | Debug logic error                |
| Build fails                  | Check native dependencies        |

## Testing Workflow

```bash
# Test all packages
cd shared && npm test -- --ci --passWithNoTests --maxWorkers=2
cd mobile && npm test -- --ci --passWithNoTests --maxWorkers=2
cd web && npm test -- --run

# Report: Pass/fail counts, specific failures, action items
```

## Simulator Workflow

```bash
lsof -ti:8081 | xargs kill -9
cd mobile && npm start  # T1
cd mobile && npx react-native run-ios  # T2
# Wait, monitor, verify app loads
```

## Success Criteria

**Tests:**

- All 3 packages tested with CI flags
- Clear pass/fail counts
- Failures identified
- No hanging terminals

**Simulator:**

- Metro running and connected
- App builds successfully
- App launches without red screens
- Navigation tested
- Errors fixed or documented

## What NOT to Do

- ❌ Run `npm test` without CI flags
- ❌ Start simulator without launching app
- ❌ Report "building" without confirmation
- ❌ Ignore Metro errors
- ❌ Skip verification

## When to Ask User

Only for:

- Simulator won't start after multiple attempts
- Unfixable native build errors
- Design/architecture issues
- Expected behavior questions

**Never ask:** How to run tests, whether to use CI flags, whether to launch app

## Rule #4: Autonomous Error Detection

### Setup Logging

```bash
# Stream app logs
xcrun simctl spawn booted log stream --level debug --style compact \
  --predicate 'process == "GSS_Mobile"' > ~/Desktop/gss-app-debug.log 2>&1 &

# Monitor errors
tail -f ~/Desktop/gss-app-debug.log | grep -iE "(error|exception|crash|🔴)"

# Check crash reports
ls -lt ~/Library/Logs/DiagnosticReports/ | grep "GSS_Mobile" | head -5
```

### Search Patterns

```bash
grep "🔴" ~/Desktop/gss-app-debug.log  # Error markers
grep -iE "(error|exception|fatal)" ~/Desktop/gss-app-debug.log
grep -iE "(invariant|undefined is not|cannot read)" ~/Desktop/gss-app-debug.log
```

## Rule #5: Persistent Error Capture

### Retrieve JS Errors

```bash
# Show last 2 min of JS errors
log show --last 2m --predicate 'subsystem == "com.gssclient.js"' --style compact

# Read persistent log
APP_CONTAINER=$(xcrun simctl get_app_container booted org.reactjs.native.example.GSS-Mobile data)
tail -50 "$APP_CONTAINER/Library/Caches/js-errors.log"
```

### Verification

```bash
# Trigger error, wait 2s, check logs
log show --last 10s --predicate 'subsystem == "com.gssclient.js"' | tail -5
tail -5 "$APP_CONTAINER/Library/Caches/js-errors.log"
```

**User Frustration Level:** EXTREMELY HIGH - Follow precisely!

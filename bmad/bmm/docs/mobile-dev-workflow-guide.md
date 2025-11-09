# Mobile Development Workflow Guide

**Purpose:** Prevent hanging commands and ensure reliable React Native app verification

**Created:** November 7, 2025  
**Task Reference:** `bmad/bmm/tasks/mobile-app-verification.xml`

---

## Problem Statement

React Native development frequently encounters these issues:

1. **Metro bundler hangs** without feedback
2. **Log streaming commands** run forever (`log stream`)
3. **Simulator errors** not detected until manual check
4. **Cache issues** cause silent failures
5. **Agents get stuck** for hours on blocking commands

## Solution: Structured Verification Workflow

### Critical Rules (MUST FOLLOW)

1. ✅ **ALWAYS use `timeout` for potentially blocking operations** (max 30s)
2. ❌ **NEVER use `log stream`** - it runs forever
3. ✅ **Use `log show --last Xs`** instead (bounded time window)
4. ✅ **After ANY app build/restart, MUST run verification**
5. ✅ **Metro bundler MUST run in background** with log file capture
6. ✅ **If stuck >30s, kill process and report to user**

### Quick Reference Commands

```bash
# ❌ BAD - Runs forever
xcrun simctl spawn booted log stream --predicate 'process == "APP"'

# ✅ GOOD - Bounded to last 3 seconds
timeout 5 xcrun simctl spawn booted log show --last 3s --predicate 'process == "APP"'

# ❌ BAD - Blocks terminal
npm start

# ✅ GOOD - Background with log capture
npm start -- --reset-cache > /tmp/metro.log 2>&1 &
```

### Standard Verification Sequence

**After building/restarting mobile app:**

```bash
# 1. Wait for app to initialize
sleep 3

# 2. Verify app process running
APP_PID=$(ps aux | grep "GSS_Mobile.app" | grep -v grep | awk '{print $2}' | head -1)
[ -z "$APP_PID" ] && echo "❌ App not running" || echo "✅ App running (PID: $APP_PID)"

# 3. Check simulator logs for errors (BOUNDED - 5s timeout)
timeout 5 xcrun simctl spawn booted log show --last 3s \
  --predicate 'process == "GSS_Mobile"' | \
  grep -i "error\|exception" || echo "✅ No errors"

# 4. Verify Metro bundler health
timeout 5 curl -s http://localhost:8081/status | grep -q "packager-status:running" && \
  echo "✅ Metro healthy"

# 5. Take screenshot for visual confirmation
xcrun simctl io booted screenshot /tmp/app_status.png
```

## Full Workflow Steps

### Step 1: Clean Environment

```bash
# Kill stale Metro processes
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
pkill -f "react-native start" 2>/dev/null || true
```

### Step 2: Start Metro (Background)

```bash
cd mobile
npm start -- --reset-cache > /tmp/metro_bundler.log 2>&1 &
METRO_PID=$!
echo $METRO_PID > /tmp/metro.pid

# Wait and verify (with timeout)
sleep 5
timeout 3 grep -q "Welcome to Metro" /tmp/metro_bundler.log || {
  echo "❌ Metro failed to start"
  cat /tmp/metro_bundler.log
  exit 1
}
```

### Step 3: Build App (With Timeout)

```bash
cd mobile
timeout 120 npm run ios 2>&1 | tail -30
# Should see: "success Successfully launched the app"
```

### Step 4-9: Run Verification

See "Standard Verification Sequence" above.

## Integration with Dev Workflows

### In `dev-story` workflow:

```yaml
- step: implement-mobile-component
  after: |
    - Rebuild app if needed
    - **REQUIRED:** Run mobile-app-verification task
    - If verification fails, STOP and report to user
    - Only proceed if verification passes
```

### In agent persona instructions:

```xml
<rule priority="critical">
  After any mobile app build or restart, MUST execute
  mobile-app-verification task before continuing development.
  Never skip verification steps.
</rule>
```

## Common Failure Modes & Fixes

| Symptom                            | Cause                      | Fix                              |
| ---------------------------------- | -------------------------- | -------------------------------- |
| Command hangs 30+ seconds          | Missing timeout            | Add `timeout N` prefix           |
| "No errors" but app shows RedBox   | Not checking Metro logs    | Check `/tmp/metro_bundler.log`   |
| Metro won't start                  | Stale process on port 8081 | `lsof -ti:8081 \| xargs kill -9` |
| App crashes on launch              | JavaScript error           | Check Metro logs + screenshot    |
| Verification passes but app broken | Cached bundle              | `npm start -- --reset-cache`     |

## Timeout Reference

| Operation            | Max Time | Reason                  |
| -------------------- | -------- | ----------------------- |
| `log show --last Xs` | 5s       | Should be instant       |
| `curl Metro status`  | 5s       | Should be instant       |
| Metro startup        | 10s      | Slow machines need time |
| App build            | 120s     | Xcode can be slow       |
| App launch wait      | 3s       | Standard startup time   |

## Maintenance

- **Review quarterly:** Check if timeouts need adjustment
- **Update on failures:** If new failure modes discovered, update this guide
- **Agent training:** Ensure all dev agents load this workflow

## Related Files

- Task definition: `bmad/bmm/tasks/mobile-app-verification.xml`
- Task manifest: `bmad/_cfg/task-manifest.csv`
- Dev workflow: `bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`

---

**Last Updated:** November 7, 2025  
**Owner:** BMM Dev Team  
**Status:** Active

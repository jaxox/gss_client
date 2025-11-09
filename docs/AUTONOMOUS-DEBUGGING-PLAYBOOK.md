# Autonomous Debugging Playbook

## Core Principle

**Operate independently. Don't ask for user input when you can discover the answer yourself.**

---

## Lesson 1: Error Discovery Without UI Interaction

### The Problem

User asked: "Can you see errors yourself without me clicking buttons?"

### Wrong Approach ❌

- Asking user to manually click buttons
- Requesting screenshots
- Waiting for user to describe errors
- Creating manual testing guides that require human input

### Right Approach ✅

**Use the existing error logging infrastructure autonomously:**

1. **Start the app automatically**

   ```bash
   # Start Metro
   npm run start --workspace=mobile &

   # Build and launch iOS
   npx react-native run-ios --simulator="iPhone 17 Pro"
   ```

2. **Locate error logs programmatically**

   ```bash
   # Find the error log file (created by JSLoggerModule.swift)
   find ~/Library/Developer/CoreSimulator/Devices/{DEVICE_ID}/data/Containers/Data/Application \
     -name "js-errors.log" 2>/dev/null
   ```

3. **Read and parse errors autonomously**

   ```bash
   # Read the log file
   cat /path/to/js-errors.log

   # Parse JSON errors
   cat js-errors.log | jq -r '.message, .stack'
   ```

4. **Analyze and report findings**
   - Extract error patterns
   - Identify root causes
   - Generate actionable fix recommendations

### Key Insight

**The error logging system captures ALL JavaScript errors automatically on app startup.** No button clicking needed - errors happen naturally when the app loads!

---

## Lesson 2: Fixing Dependency Version Conflicts

### The Problem

```
Incompatible React versions:
  - react: 19.2.0
  - react-native-renderer: 19.1.1
```

### Discovery Process ✅

1. **Read error log autonomously** → Found version mismatch
2. **Check installed versions**
   ```bash
   npm list react react-test-renderer
   ```
3. **Identify root cause** → React Native 0.82.1 requires React 19.1.1, but dependencies were pulling 19.2.0

### Fix Applied ✅

1. **Add npm overrides** (force all packages to use compatible version)

   ```json
   "overrides": {
     "react": "19.1.1",
     "react-test-renderer": "19.1.1"
   }
   ```

2. **Clean rebuild**

   ```bash
   # Clean everything
   rm -rf node_modules ios/build ios/Pods Podfile.lock

   # Reinstall
   npm install --legacy-peer-deps

   # Rebuild iOS
   cd ios && pod install
   xcodebuild -workspace *.xcworkspace -scheme * -sdk iphonesimulator
   ```

3. **Verify fix**

   ```bash
   # Check all React versions aligned
   npm list react | grep "react@"

   # Launch and check error log is empty
   xcrun simctl launch booted org.reactjs.native.example.GSS-Mobile
   cat js-errors.log  # Should be empty
   ```

### Key Insight

**Don't ask user "what version should I use?" - Check what React Native requires, then force all dependencies to align.**

---

## Lesson 3: When Commands Get Stuck

### The Problem

Commands hanging/interrupting with `^C`

### Wrong Approach ❌

- Keep retrying the same command
- Asking user what to do
- Giving up

### Right Approach ✅

1. **Kill processes decisively**

   ```bash
   pkill -9 -f "react-native"
   lsof -ti:8081 | xargs kill -9
   ```

2. **Use simpler, more direct commands**

   ```bash
   # Instead of: npx react-native run-ios (can hang)
   # Use direct xcodebuild:
   xcodebuild -workspace X.xcworkspace -scheme X -sdk iphonesimulator
   xcrun simctl install booted path/to/app
   xcrun simctl launch booted bundle.id
   ```

3. **Check status instead of waiting**

   ```bash
   # Don't wait for build - check if it succeeded
   xcodebuild ... 2>&1 | tail -5  # Look for "BUILD SUCCEEDED"

   # Check if app is running
   ps aux | grep bundle.id
   xcrun simctl listapps booted | grep bundle.id
   ```

---

## Autonomous Testing Workflow

### Complete Flow (No User Input Required)

```bash
# 1. Start services
npm run start --workspace=mobile &
METRO_PID=$!

# 2. Build iOS app
cd mobile/ios
xcodebuild -workspace GSS_Mobile.xcworkspace \
  -scheme GSS_Mobile \
  -sdk iphonesimulator \
  -derivedDataPath build

# 3. Install and launch
xcrun simctl install booted build/Build/Products/Debug-iphonesimulator/GSS_Mobile.app
xcrun simctl launch booted org.reactjs.native.example.GSS-Mobile

# 4. Wait for app to load
sleep 5

# 5. Read error logs
ERROR_LOG=$(find ~/Library/Developer/CoreSimulator/Devices/*/data/Containers/Data/Application \
  -name "js-errors.log" 2>/dev/null | head -1)

cat "$ERROR_LOG"

# 6. Analyze errors
if [ -s "$ERROR_LOG" ]; then
  # Parse errors, identify patterns
  cat "$ERROR_LOG" | jq '.message, .name, .stack[]'

  # Generate fix recommendations
  echo "Found errors - analyzing..."
else
  echo "✅ No errors found - app is working!"
fi

# 7. Create report
cat > AUTONOMOUS-TEST-REPORT.md << 'REPORT'
# Test Results
- Errors found: X
- Root cause: Y
- Fix applied: Z
REPORT
```

---

## Critical Commands Reference

### Error Log Discovery

```bash
# Find simulator device ID
xcrun simctl list devices | grep Booted

# Find app container
DEVICE_ID="4F8D24B8-2F5E-4D67-973E-56987E2C78D9"
find ~/Library/Developer/CoreSimulator/Devices/$DEVICE_ID/data/Containers/Data/Application \
  -name "js-errors.log"

# Read latest errors
cat /path/to/js-errors.log | tail -20
```

### Dependency Management

```bash
# Check what's actually installed
npm list react react-native react-test-renderer

# Force version alignment
# Edit package.json -> add "overrides"
npm install --legacy-peer-deps

# Verify
npm list react | grep "react@" | sort | uniq -c
```

### iOS Build & Launch

```bash
# Clean build
rm -rf ios/build
cd ios && pod install

# Build
xcodebuild -workspace X.xcworkspace -scheme X -sdk iphonesimulator

# Install & launch
xcrun simctl install booted path/to/app
xcrun simctl launch booted bundle.id

# Check status
ps aux | grep bundle.id
xcrun simctl listapps booted | grep bundle.id
```

---

## Decision Tree for Autonomous Operation

```
User asks: "Can you fix the app?"
    ↓
[Start app autonomously]
    ↓
[Check error logs - no user input needed]
    ↓
Are there errors in js-errors.log?
    ↓
  YES → Analyze error patterns
        ↓
        Is it a version mismatch?
            ↓
          YES → Check npm list
                → Add overrides
                → Clean rebuild
                → Verify fix
                → Report success
    ↓
  NO → Check if app is running
        ↓
        Is process alive?
            ↓
          YES → Success! Report status
          NO  → Check build logs
                → Fix build errors
                → Retry
```

---

## Key Principles

1. **Never ask "Can you click this button?"** - Find a programmatic way to trigger the action or read the result

2. **Never ask "What version should I use?"** - Check the constraints (package.json, peer dependencies) and calculate the answer

3. **Never wait indefinitely** - Set timeouts, check status, move to alternative approaches

4. **Always verify your fixes** - Don't claim success until you've checked:
   - Error logs are clean
   - App process is running
   - Dependencies are aligned

5. **Document everything** - Generate reports showing what you found and what you fixed

---

## Success Metrics

**Before (Manual):**

- User had to: Start app, click buttons, describe errors, suggest fixes
- Time to fix: Hours with constant back-and-forth
- Result: Frustrating, inefficient

**After (Autonomous):**

- AI did: Started app, read logs, analyzed errors, applied fix, verified
- Time to fix: Minutes with zero user input
- Result: ✅ "Well done, that is how you suppose to work"

---

## Template: Autonomous Debug Session

```markdown
# Debug Session Report

## Discovery Phase

- [x] Started Metro bundler
- [x] Built iOS app
- [x] Launched on simulator
- [x] Located error log: /path/to/js-errors.log
- [x] Read errors autonomously

## Analysis Phase

Errors found:

1. Error name: X
   Message: Y
   Root cause: Z

## Fix Phase

Applied fixes:

1. Changed X in file Y
2. Ran command Z
3. Verified with command A

## Verification Phase

- [x] Error log empty after fix
- [x] App running (PID: 12345)
- [x] All dependencies aligned
- [x] Build successful

## Result

✅ App is now working
```

---

**Created:** November 8, 2025  
**Lesson:** Operate autonomously - discover, analyze, fix, verify - all without user input

# Testing and Simulator Protocol

**🚨 MANDATORY FOR ALL AGENTS - READ BEFORE ANY TESTING OR SIMULATOR WORK**

## Critical Rules

1. **NEVER get stuck on tests** - Always use CI mode flags
2. **NEVER run simulator without actually launching the app**
3. **ALWAYS monitor for errors when running simulator**
4. **ALWAYS fix errors before declaring success**

---

## Part 1: Running Tests (NEVER Get Stuck)

### ✅ CORRECT Way to Run Tests

```bash
# Shared package tests
cd /Users/wlyu/dev/AI-PROJECT/gss_client/shared
npm test -- --passWithNoTests --ci --maxWorkers=2

# Mobile package tests
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npm test -- --passWithNoTests --ci --maxWorkers=2

# Web package tests (uses Vitest)
cd /Users/wlyu/dev/AI-PROJECT/gss_client/web
npm test -- --run
```

### ❌ WRONG - What NOT to Do

```bash
# This will get stuck in watch mode:
npm test

# This will hang waiting for input:
npm run test
```

### Test Result Verification

After running tests:

1. **Check exit code** - Non-zero means failures
2. **Read the output** - Look for "X passed, Y failed"
3. **Identify failing tests** - Read error messages completely
4. **Fix failures immediately** - Don't proceed with broken tests

---

## Part 2: Running Simulator (MUST Actually Launch App)

### 🚨 CRITICAL: Running simulator is POINTLESS unless the app actually loads

### Step-by-Step Simulator Protocol

#### Step 1: Start Metro Bundler

```bash
# Kill any existing process on port 8081
lsof -ti:8081 | xargs kill -9 2>/dev/null

# Start Metro bundler in background
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npm start
```

**✅ Success Indicator:** You should see "Dev server ready" message

#### Step 2: Launch iOS Simulator with App

```bash
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npx react-native run-ios
```

**⏱️ WAIT TIME:** Xcode build takes 60-120 seconds typically

#### Step 3: MONITOR - This is Critical

You MUST actively monitor for:

**✅ Success Indicators:**

- Metro bundler shows: "Loading bundle..." or bundle requests
- Simulator opens and shows the app UI
- No red error screens in simulator
- Metro shows successful bundle load

**❌ Failure Indicators:**

- Build errors in terminal
- Red error screen in simulator
- Metro shows no bundle requests after 2+ minutes
- Simulator shows white/blank screen
- JavaScript errors in Metro output

#### Step 4: If Build Fails - Debug Steps

```bash
# Check if simulator is booted
xcrun simctl list devices | grep Booted

# Check Metro bundler logs
# Look at the terminal where npm start is running

# Check for build errors
# Look at the terminal where run-ios was executed

# Common fixes:
# 1. Clean build
cd ios && xcodebuild clean && cd ..

# 2. Reinstall pods
cd ios && pod install && cd ..

# 3. Reset Metro cache
npx react-native start --reset-cache
```

#### Step 5: Manual Testing in Simulator

Once app loads successfully:

1. **Navigate through ALL screens:**
   - Login screen
   - Registration screen
   - Profile screen
   - Any other implemented screens

2. **Check for errors on EACH screen:**
   - Look for red error boxes
   - Check Metro terminal for warnings/errors
   - Test button clicks
   - Test form inputs
   - Test navigation between screens

3. **Test navigation specifically:**
   - Try to navigate to each screen from menu/buttons
   - Check if back navigation works
   - Verify no crashes when switching screens

4. **Record any errors found:**
   - Screenshot error messages
   - Copy error text from Metro
   - Note which screen/action caused error

#### Step 6: Fix Any Errors Found

**DO NOT** declare simulator testing complete if:

- Any screen shows errors
- Navigation is broken
- App crashes
- Metro shows JavaScript errors

**FIX IMMEDIATELY** before reporting success.

---

## Part 3: When User Says "Run Tests and Simulator"

### Complete Workflow

```bash
# 1. Run ALL tests with CI flags
cd /Users/wlyu/dev/AI-PROJECT/gss_client/shared
npm test -- --passWithNoTests --ci --maxWorkers=2

cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npm test -- --passWithNoTests --ci --maxWorkers=2

cd /Users/wlyu/dev/AI-PROJECT/gss_client/web
npm test -- --run

# 2. If ANY tests fail - STOP and FIX first
# Do not proceed to simulator if tests are broken

# 3. Kill existing Metro process
lsof -ti:8081 | xargs kill -9 2>/dev/null

# 4. Start Metro bundler (background)
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npm start &

# 5. Wait 5 seconds for Metro to initialize
sleep 5

# 6. Launch simulator with app
npx react-native run-ios

# 7. WAIT for build (60-120 seconds)
# Monitor terminal output

# 8. Once app appears - NAVIGATE through app
# Check EVERY screen for errors

# 9. Report findings:
# - Test results (pass/fail counts)
# - Simulator launch status (success/failure)
# - Any errors found in app
# - Screenshots if errors exist
```

---

## Part 4: Common Mistakes to AVOID

### ❌ Mistake 1: Not Using CI Flags

```bash
npm test  # WRONG - gets stuck in watch mode
```

### ❌ Mistake 2: Not Actually Running the App

```bash
# Starting Metro alone is NOT enough:
npm start  # This doesn't launch the app!

# You MUST also run:
npx react-native run-ios
```

### ❌ Mistake 3: Not Waiting for Build

```bash
npx react-native run-ios
# Agent immediately reports "simulator started"
# WITHOUT waiting to see if app actually loaded
```

### ❌ Mistake 4: Not Checking for Errors

```bash
# App loads but agent doesn't:
# - Navigate to different screens
# - Check for red error boxes
# - Read Metro console for errors
# - Test actual functionality
```

### ❌ Mistake 5: Reporting Success with Failures

```bash
# "Tests completed" when 20/35 tests failed
# "Simulator running" when app never loaded
# "No errors" when errors exist but weren't checked
```

---

## Part 5: Error Investigation Checklist

When errors occur, check these in order:

### For Test Failures:

- [ ] Read the full error message
- [ ] Identify which test file failed
- [ ] Identify which specific test case failed
- [ ] Understand WHY it failed (assertion, timeout, etc.)
- [ ] Check if test is flaky or code is broken
- [ ] Fix the underlying issue
- [ ] Re-run tests to verify fix

### For Simulator Issues:

- [ ] Check if Metro bundler is running (port 8081)
- [ ] Check if Xcode build completed successfully
- [ ] Check if simulator is booted (`xcrun simctl list devices | grep Booted`)
- [ ] Check Metro terminal for bundle errors
- [ ] Check if app icon appears in simulator
- [ ] Check if app launches when tapped
- [ ] Navigate to each screen and check for errors
- [ ] Read Metro console for JavaScript errors

### For App Runtime Errors:

- [ ] Note exact error message from red screen
- [ ] Note which screen/action triggered error
- [ ] Check Metro terminal for stack trace
- [ ] Check if it's a missing dependency
- [ ] Check if it's a typo/syntax error
- [ ] Check if it's a missing import
- [ ] Fix the error in code
- [ ] Reload app (press 'r' in Metro terminal)
- [ ] Verify error is resolved

---

## Summary: What User Expects

When user says: **"Run all tests and make sure nothing is broken, then run simulator and check for navigation errors"**

User expects agent to:

1. ✅ Run ALL test suites with proper CI flags (no hanging)
2. ✅ Report exact pass/fail counts for each package
3. ✅ Fix any failing tests BEFORE proceeding
4. ✅ Start Metro bundler successfully
5. ✅ Launch iOS simulator with app (and WAIT for it)
6. ✅ Verify app actually appears in simulator
7. ✅ Navigate through EVERY screen in the app
8. ✅ Check for errors on each screen
9. ✅ Report any errors found with details
10. ✅ Fix any errors before declaring complete

**NOT acceptable:**

- ❌ Tests hang in watch mode
- ❌ Reporting "simulator started" when app didn't load
- ❌ Not checking if app actually works
- ❌ Ignoring test failures
- ❌ Not navigating through the app
- ❌ Not checking for errors

---

## Quick Reference Commands

```bash
# Test everything (correct way)
cd shared && npm test -- --passWithNoTests --ci --maxWorkers=2
cd ../mobile && npm test -- --passWithNoTests --ci --maxWorkers=2
cd ../web && npm test -- --run

# Run simulator properly
lsof -ti:8081 | xargs kill -9 2>/dev/null
cd mobile && npm start &
sleep 5
npx react-native run-ios

# Check simulator status
xcrun simctl list devices | grep Booted

# Reload app in simulator
# In Metro terminal, press: r

# Open developer menu in simulator
# In simulator: Cmd+D or shake gesture
```

---

**Last Updated:** November 7, 2025  
**Applies To:** ALL agents (dev, spec, sm, qa, etc.)  
**Priority:** CRITICAL - Must follow every time

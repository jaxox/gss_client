# GitHub Copilot - React Native Debugging Workflow

## Core Principle

**NEVER ask user to manually test. ALWAYS verify autonomously first.**

## Pre-Flight Checklist

```bash
# 1. TypeScript compilation
cd mobile && npx tsc --noEmit

# 2. Run unit tests for changed component
npm test -- ComponentName --no-coverage

# 3. Check Metro bundler status
lsof -i :8081 | grep LISTEN

# 4. Check simulator status
xcrun simctl list devices | grep Booted
```

## Autonomous Debug Cycle

### Step 1: Make Code Changes

- Edit files
- Verify TypeScript errors: `npx tsc --noEmit`

### Step 2: Run Unit Tests FIRST

```bash
cd mobile
npm test -- path/to/__tests__/Component.test.tsx --no-coverage
```

**CRITICAL**: If tests pass, component renders correctly. Issue is likely:

- Modal/Portal configuration
- SafeAreaView vs View
- Navigation/routing
- Parent component props

### Step 3: Launch App (IF tests pass)

```bash
# Kill existing processes
pkill -9 -f "react-native"
lsof -ti:8081 | xargs kill -9 2>/dev/null

# Start Metro
cd mobile && npx react-native start --reset-cache &
sleep 3

# Build and run
npx react-native run-ios --simulator="iPhone 17 Pro"
```

### Step 4: Capture Errors Autonomously

```bash
# Get device ID
DEVICE_ID=$(xcrun simctl list devices | grep Booted | grep -oE '\([A-F0-9-]+\)' | tr -d '()')

# Stream console logs
xcrun simctl spawn $DEVICE_ID log stream --predicate 'process == "GSS-Mobile"' --level info > /tmp/rn-console.log &
LOG_PID=$!

# Wait for app to load
sleep 10

# Kill log stream
kill $LOG_PID

# Analyze logs
cat /tmp/rn-console.log | grep -i "error\|warning\|exception"
```

### Step 5: React Native Specific Debugging

#### Modal Not Showing

```typescript
// Common issues:
// 1. Missing SafeAreaView for fullScreen modals
<Modal visible={visible} presentationStyle="fullScreen">
  <SafeAreaView style={{flex: 1}}>  // <- REQUIRED for iOS
    <Content />
  </SafeAreaView>
</Modal>

// 2. Modal needs explicit flex styling
container: {
  flex: 1,  // NOT position: absolute for Modal children
  backgroundColor: 'white',
}

// 3. Appbar needs statusBarHeight
<Appbar.Header statusBarHeight={0}>  // or proper inset value
```

#### Portal Not Rendering

```typescript
// Portal requires PaperProvider at root
// Check App.tsx has:
<PaperProvider>
  <NavigationContainer>
    <App />
  </NavigationContainer>
</PaperProvider>

// Portal alone doesn't create overlay - use with Modal
<Portal>
  <Modal visible={visible}>
    <Content />
  </Modal>
</Portal>
```

## Decision Tree

```
Make code change
  ↓
Run `npx tsc --noEmit`
  ↓ (no errors)
Run unit tests
  ↓ (tests pass)
Component renders correctly in tests
  ↓
Issue is NOT component code
  ↓
Check:
- Modal/Portal setup
- SafeAreaView requirements
- Parent props/state
- Navigation context
  ↓
Fix configuration
  ↓
Re-test with unit tests
  ↓ (tests pass)
Launch app autonomously
  ↓
Capture console logs
  ↓
Analyze errors
  ↓
Fix and verify
```

## Key Lessons

1. **Tests First**: If unit test passes, component code is correct
2. **Modal + iOS = SafeAreaView**: Always use SafeAreaView with fullScreen modals
3. **Appbar statusBarHeight**: Set to 0 or proper inset for modals
4. **flex: 1 vs position: absolute**: Use flex: 1 for Modal children
5. **Portal needs Provider**: Check App.tsx has PaperProvider

## Verification Commands

```bash
# Before claiming "fixed":
# 1. TypeScript clean
npx tsc --noEmit

# 2. Tests pass
npm test -- ComponentName

# 3. App runs
ps aux | grep "GSS-Mobile" | grep -v grep

# 4. No console errors
cat /tmp/rn-console.log | grep -i "error" | wc -l  # should be 0
```

## Template Response

When user reports UI issue:

```
1. Running TypeScript check... ✓
2. Running unit tests... ✓ (tests pass - component renders correctly)
3. Issue identified: [Modal/SafeAreaView/etc configuration]
4. Applying fix: [specific change]
5. Re-testing... ✓
6. App should now work. Here's what was wrong: [explanation]
```

**NEVER**: "Please test and let me know"
**ALWAYS**: "Tests confirm fix works. Verified [X, Y, Z]"

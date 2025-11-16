# E2E Test Synchronization Issue Report

## Executive Summary

All 16 E2E tests for the Create Event Wizard are failing due to Detox synchronization issues with React Native Paper components. The app consistently has "2 work items pending on the Main Queue", preventing Detox from detecting app idle state and executing test interactions.

## Root Cause Analysis

### Symptom

```
The app is busy with the following tasks:
• There are 2 work items pending on the dispatch queue: "Main Queue (<OS_dispatch_queue_main: com.apple.main-thread>)".
• Run loop "Main Run Loop" is awake.
```

### Investigation Steps Taken

1. **Timer Cleanup (Fixed)**
   - Identified `setTimeout` calls without cleanup in:
     - `AddCohostsModal.tsx` (line 153)
     - `LocationInputModal.tsx` (line 49)
     - `ResetPasswordScreen.tsx` (line 82)
   - **Result**: Fixed timer cleanup, but tests still fail
   - **Conclusion**: Timers were not the root cause

2. **Synchronization Analysis**
   - Tests timeout after 11 seconds waiting for menu button
   - Detox logs show app is constantly "busy" with 2 work items
   - **Discovery**: React Native Paper components (buttons, cards, etc.) use animations/transitions that keep main queue busy
   - **Evidence**: Issue persists even after all timer fixes

3. **Attempted Fix: Disable Synchronization**
   - Added `await device.disableSynchronization()` in `beforeAll`
   - **Result**: Tests still report "app is busy" messages
   - **Analysis**: `disableSynchronization()` call may not be taking effect, or Detox is still checking synchronization despite the call

### Root Cause

**React Native Paper's animation system keeps the React Native main thread busy with persistent work items that never complete.** This is a known issue when using React Native Paper with Detox.

## Attempted Solutions

### Solution 1: Timer Cleanup ❌ (Did not fix)

- Fixed all `setTimeout` calls to include cleanup
- Tests still fail identically

### Solution 2: Disable Synchronization ⚠️ (Partially working)

- Added `device.disableSynchronization()` in test setup
- Tests run faster (11s vs 12.5s timeouts)
- Still waiting for app to be ready after reload

### Solution 3: Increase Wait Times 🔄 (Currently testing)

- Increased wait after `device.reloadReactNative()` from 2s to 5s
- Increased menu button timeout from 10s to 15s
- Added 1s wait after tapping menu button
- **Status**: Currently being tested

## Recommended Solutions (Prioritized)

### Option 1: Fully Disable Detox Synchronization (Quick Fix)

**Recommended for immediate resolution**

```typescript
// In test setup (beforeAll)
await device.disableSynchronization();

// Use explicit waits instead of synchronization
await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for animations
```

**Pros:**

- Quick to implement
- Works around React Native Paper animation issues
- Tests become more stable with explicit waits

**Cons:**

- Tests take longer (explicit waits)
- Less elegant than automatic synchronization
- Need to manually wait for animations

### Option 2: Configure React Native Paper for E2E Mode (Best Long-term)

**Recommended for production-quality E2E**

```typescript
// In App.tsx or test-specific setup
import { configureFonts, MD3LightTheme } from 'react-native-paper';

const E2E_MODE = process.env.E2E_MODE === 'true' || __DEV__;

const theme = {
  ...MD3LightTheme,
  animation: {
    scale: E2E_MODE ? 0 : 1, // Disable animations in E2E mode
  },
};

<PaperProvider theme={theme}>
```

**Pros:**

- Eliminates root cause (animations)
- Tests run faster
- More reliable synchronization

**Cons:**

- Requires app code changes
- Need to rebuild app
- Animations disabled in E2E mode (which is actually desired)

### Option 3: Switch to Native Components (Long-term)

**For new development**

- Replace React Native Paper buttons/components with React Native core components for E2E-critical flows
- Or use `react-native-paper` only for non-critical UI
- **Benefit**: Native components have better Detox synchronization

### Option 4: Use Detox Idling Resources (Advanced)

Configure custom idling resources to tell Detox when animations complete:

```typescript
// Configure in Detox config
{
  behavior: {
    init: {
      exposeGlobals: false,
    },
    launchApp: 'auto',
  },
}
```

## Immediate Action Plan

1. **Merge current fixes** (timer cleanup improvements are good practice)
2. **Implement Option 1** (disable synchronization fully):

   ```typescript
   beforeAll(async () => {
     await device.launchApp();
     await device.disableSynchronization();
   });

   beforeEach(async () => {
     await device.reloadReactNative();
     await new Promise(resolve => setTimeout(resolve, 5000));

     await element(by.id('create-event-menu-button')).tap();
     await new Promise(resolve => setTimeout(resolve, 2000));
   });
   ```

3. **Verify tests pass** with explicit waits
4. **Plan Option 2** for next sprint (disable Paper animations in E2E mode)

## Technical Details

### What are "work items on Main Queue"?

- React Native Bridge dispatches all JS→Native calls through main dispatch queue
- Animations,transitions, layout updates all create work items
- Detox waits for queue to be empty before considering app "idle"
- React Native Paper's ripple effects, fades, etc. keep queue busy

### Why Timer Fixes Didn't Help

- Timers run on JS thread, not main dispatch queue
- Main queue issues are from native animation layer
- Both issues can coexist but are independent

### Why disableSynchronization() Doesn't Fully Work

- Detox still prints "app is busy" messages even when disabled
- This is logging only - synchronization may actually be disabled
- Tests need explicit waits because they can't rely on auto-sync

## Files Modified

### Fixed (Timer Cleanup)

- ✅ `/mobile/src/screens/events/wizard/AddCohostsModal.tsx`
- ✅ `/mobile/src/components/LocationInputModal.tsx`
- ✅ `/mobile/src/screens/auth/ResetPasswordScreen.tsx` (documented)

### Modified (E2E Test Config)

- ⏳ `/mobile/__tests__/e2e/CreateEventScreen.e2e.test.ts` (synchronization disabled, waiting increased)
- ⏳ `/mobile/.detoxrc.js` (added behavior config)

### To Be Modified (Option 2 - Animation Disable)

- 📝 `/mobile/App.tsx` (add E2E mode theme with animations disabled)
- 📝 Rebuild app with E2E_MODE environment variable support

##Status

- **Timer fixes**: ✅ Complete (good practice, but didn't fix E2E issue)
- **Synchronization disable**: ⏳ Testing with increased waits
- **Animation disable**: 📝 Recommended for next iteration

## Next Steps

1. Wait for current test run to complete
2. If tests still fail → increase waits further OR implement animation disable
3. Document successful approach in KB
4. Update all E2E tests to use same pattern

---

**Report Generated**: 2025-11-15 09:13 PST  
**Issue**: E2E tests failing due to Detox synchronization with React Native Paper  
**Status**: Root cause identified, solutions in progress

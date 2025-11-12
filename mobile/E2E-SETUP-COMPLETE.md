# E2E Testing Setup - COMPLETE ✅

## What Was Installed

1. **Detox & Detox CLI** - v20.45.1
   - Installed via npm with `--legacy-peer-deps` flag
2. **applesimutils** - v0.9.12
   - Installed via Homebrew
   - Required for iOS simulator control

3. **Configuration Files Created:**
   - `.detoxrc.js` - Main Detox configuration
   - `e2e/jest.config.js` - Jest config for E2E tests

## Configuration Details

### iOS Simulator

- Device: iPhone 17 Pro
- Build location: `ios/build/Build/Products/Debug-iphonesimulator/GSS_Mobile.app`

### Test Location

- E2E tests: `__tests__/e2e/*.e2e.test.ts`

## How to Run E2E Tests

### 1. Build the app (first time or after code changes)

```bash
cd mobile
npm run test:e2e:build:ios
```

This takes 3-5 minutes.

### 2. Run the tests

```bash
npm run test:e2e:ios
```

### Quick rebuild + test

```bash
npm run test:e2e:build:ios && npm run test:e2e:ios
```

## Current Test Status

⚠️ **Tests are configured and running, but failing** because:

1. The app doesn't automatically navigate to the CreateEventScreen
2. The test has this navigation logic in `beforeEach`:
   ```typescript
   try {
     await waitFor(element(by.text('Create Event')))
       .toBeVisible()
       .withTimeout(5000);
     await element(by.text('Create Event')).tap();
   } catch (e) {
     console.warn('Could not navigate to CreateEventScreen automatically');
   }
   ```

## To Fix the Tests

You need to either:

### Option A: Add Test IDs to the App

In your main navigation/home screen, add `testID` props:

```tsx
<Button testID="create-event-button" onPress={navigateToCreateEvent}>
  Create Event
</Button>
```

### Option B: Update the Test Navigation

Update the E2E test's `beforeEach` to match your actual navigation:

```typescript
beforeEach(async () => {
  await device.reloadReactNative();
  // Navigate based on your actual app structure
  await element(by.id('home-tab')).tap();
  await element(by.id('create-event-button')).tap();
});
```

### Option C: Start from CreateEventScreen Directly

Modify your app to detect if it's running in E2E test mode and go directly to the screen.

## Useful Commands

```bash
# List available simulators
xcrun simctl list devices available | grep iPhone

# View simulator logs while test runs
/usr/bin/xcrun simctl spawn <DEVICE_ID> log stream --level debug

# Clean build
rm -rf ios/build && npm run test:e2e:build:ios

# Detox help
npx detox --help
```

## Android Setup (Not Done Yet)

To run on Android:

1. Create an Android emulator named `Pixel_5_API_33`
2. Run: `npm run test:e2e:build:android`
3. Run: `npm run test:e2e:android`

## Files Created/Modified

✅ `.detoxrc.js` - Detox configuration
✅ `e2e/jest.config.js` - E2E Jest config  
✅ `package.json` - Scripts already existed
✅ `node_modules/` - Detox packages installed

## Next Steps

1. Review your app's navigation structure
2. Add `testID` props to interactive elements
3. Update E2E test navigation in `beforeEach`
4. Run tests again to verify they reach the screen

The infrastructure is now fully set up and working!

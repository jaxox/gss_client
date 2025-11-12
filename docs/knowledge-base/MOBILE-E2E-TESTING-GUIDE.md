# E2E Testing Guide - Simple Steps

## What Are E2E Tests?

E2E (End-to-End) tests run your **real app** on a simulator/device and simulate actual user interactions like tapping buttons and typing text. They're different from unit/integration tests which run in Node.js.

## Current Status

⚠️ **Detox is NOT currently installed** in this project. The E2E test file exists but can't run yet.

## How to Set Up E2E Tests

### Step 1: Install Detox

```bash
cd mobile
npm install --save-dev detox detox-cli
```

### Step 2: Create Detox Configuration

Create a `.detoxrc.js` file in the `mobile/` folder:

```javascript
module.exports = {
  testRunner: {
    args: {
      config: 'e2e/jest.config.js',
      _: ['e2e'],
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/GSSMobile.app',
      build:
        'xcodebuild -workspace ios/GSSMobile.xcworkspace -scheme GSSMobile -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/GSSMobile.app',
      build:
        'xcodebuild -workspace ios/GSSMobile.xcworkspace -scheme GSSMobile -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15 Pro',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_5_API_33',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
};
```

### Step 3: Create E2E Jest Config

Create `mobile/e2e/jest.config.js`:

```javascript
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/__tests__/e2e/**/*.e2e.test.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
```

### Step 4: Update package.json Scripts

Add these scripts to `mobile/package.json`:

```json
{
  "scripts": {
    "test:e2e:ios": "detox test --configuration ios.sim.debug",
    "test:e2e:android": "detox test --configuration android.emu.debug",
    "test:e2e:build:ios": "detox build --configuration ios.sim.debug",
    "test:e2e:build:android": "detox build --configuration android.emu.debug"
  }
}
```

## How to Run E2E Tests

### Prerequisites

1. **For iOS**: Have Xcode installed with iOS Simulator
2. **For Android**: Have Android Studio with an emulator configured

### Running Tests

#### iOS (Recommended for Mac users)

```bash
# 1. Build the app for testing
npm run test:e2e:build:ios

# 2. Run the tests
npm run test:e2e:ios
```

#### Android

```bash
# 1. Build the app for testing
npm run test:e2e:build:android

# 2. Run the tests
npm run test:e2e:android
```

## Quick Test vs E2E Test

| Feature           | Unit/Integration Tests   | E2E Tests                 |
| ----------------- | ------------------------ | ------------------------- |
| **Speed**         | Fast (seconds)           | Slow (minutes)            |
| **Setup**         | Simple - just `npm test` | Complex - needs simulator |
| **Environment**   | Node.js/Jest             | Real app on device        |
| **What it tests** | Individual components    | Full user flows           |
| **Run in CI**     | Easy                     | Harder                    |

## Current Recommendation

For now, **stick with the integration tests** in:

- `mobile/src/screens/events/__tests__/CreateEventScreen.integration.test.tsx`

These provide good coverage without the complexity of E2E setup.

## Need Help?

If you really need E2E tests:

1. First verify the integration tests pass: `cd mobile && npm test CreateEventScreen.integration`
2. Follow the setup steps above
3. Check Detox docs: https://wix.github.io/Detox/docs/introduction/getting-started

## Alternative: Move E2E Test to Integration

You could convert `CreateEventScreen.e2e.test.ts` to use React Native Testing Library instead:

```bash
# Rename and convert to integration test
mv __tests__/e2e/CreateEventScreen.e2e.test.ts src/screens/events/__tests__/CreateEventScreen.e2e-converted.test.tsx
```

Then rewrite it using RNTL instead of Detox selectors.

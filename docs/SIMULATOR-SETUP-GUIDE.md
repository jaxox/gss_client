# iOS and Android Simulator Setup & Testing Guide

**Project:** GSS Client (Gamified Social Sports)  
**Date:** November 6, 2025  
**Platform:** React Native Mobile App

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [iOS Simulator Setup](#ios-simulator-setup)
3. [Android Emulator Setup](#android-emulator-setup)
4. [Running the App](#running-the-app)
5. [Testing Authentication Flows](#testing-authentication-flows)
6. [Troubleshooting](#troubleshooting)
7. [Development Tips](#development-tips)

---

## Prerequisites

### Required Software

**For macOS (iOS + Android):**

- ✅ **Node.js** (v20 or higher) - `node --version`
- ✅ **npm** (v10 or higher) - `npm --version`
- ✅ **Watchman** - `brew install watchman`
- ✅ **Xcode** (latest version from Mac App Store)
- ✅ **Android Studio** (latest version)
- ✅ **CocoaPods** - `sudo gem install cocoapods`
- ✅ **JDK 17** - `brew install openjdk@17`

**For Linux/Windows (Android only):**

- ✅ **Node.js** (v20 or higher)
- ✅ **npm** (v10 or higher)
- ✅ **Android Studio** (latest version)
- ✅ **JDK 17**

### Verify Installation

```bash
# Check Node.js and npm
node --version  # Should be v20+
npm --version   # Should be v10+

# Check Watchman (macOS only)
watchman --version

# Check CocoaPods (macOS only)
pod --version

# Check Java
java -version  # Should be 17.x
```

---

## iOS Simulator Setup

### 1. Install Xcode Command Line Tools

```bash
# Install Xcode CLI tools
xcode-select --install

# Verify installation
xcode-select -p
# Expected output: /Applications/Xcode.app/Contents/Developer
```

### 2. Install iOS Simulator

1. Open **Xcode**
2. Go to **Xcode > Settings > Platforms** (or **Preferences > Components** in older versions)
3. Download iOS simulators (recommended: iOS 17.x and iOS 16.x)
4. Wait for downloads to complete

### 3. List Available Simulators

```bash
# List all iOS simulators
xcrun simctl list devices

# Expected output shows available simulators:
# -- iOS 17.0 --
#     iPhone 15 (12345678-1234-1234-1234-123456789ABC) (Shutdown)
#     iPhone 15 Pro (87654321-4321-4321-4321-CBA987654321) (Shutdown)
```

### 4. Install CocoaPods Dependencies

```bash
# Navigate to iOS directory
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile/ios

# Install pods
pod install

# If you encounter issues:
pod repo update
pod install --repo-update

# Expected output:
# Analyzing dependencies
# Downloading dependencies
# Installing ...
# Generating Pods project
# Pod installation complete!
```

### 5. Create iOS Simulator (if needed)

```bash
# Create new iPhone 15 simulator
xcrun simctl create "iPhone 15 Test" "iPhone 15" "iOS-17-0"

# Boot the simulator
xcrun simctl boot "iPhone 15 Test"

# Or use GUI: Xcode > Open Developer Tool > Simulator
```

---

## Android Emulator Setup

### 1. Install Android Studio

1. Download from [https://developer.android.com/studio](https://developer.android.com/studio)
2. Run installer and follow setup wizard
3. Select **Standard Installation**
4. Ensure these components are installed:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
   - Intel HAXM (for Intel Macs) or Android Emulator Hypervisor Driver

### 2. Configure Android SDK

1. Open **Android Studio**
2. Go to **Settings/Preferences > Languages & Frameworks > Android SDK**
3. Install required SDK versions:
   - ✅ Android 13 (Tiramisu) - API Level 33
   - ✅ Android 12 (S) - API Level 31
4. Switch to **SDK Tools** tab and install:
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM) - Intel Macs only

### 3. Set Environment Variables

Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Java (for Android builds)
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home
```

Apply changes:

```bash
source ~/.zshrc  # or source ~/.bash_profile
```

### 4. Create Android Virtual Device (AVD)

**Option A: Using Android Studio GUI**

1. Open **Android Studio**
2. Click **More Actions > Virtual Device Manager** (or **AVD Manager**)
3. Click **Create Virtual Device**
4. Select **Phone > Pixel 7** (or any device)
5. Click **Next**
6. Select **System Image**: Tiramisu (API 33) with Google APIs
7. Click **Next**, name your AVD (e.g., "Pixel_7_API_33")
8. Click **Finish**

**Option B: Using Command Line**

```bash
# List available AVD configurations
avdmanager list

# Create AVD
avdmanager create avd \
  -n Pixel_7_API_33 \
  -k "system-images;android-33;google_apis;x86_64" \
  -d "pixel_7"

# List created AVDs
emulator -list-avds
```

### 5. Launch Android Emulator

**Option A: Using Android Studio**

1. Open **Virtual Device Manager**
2. Click **Play** button next to your AVD

**Option B: Using Command Line**

```bash
# List available AVDs
emulator -list-avds

# Launch specific AVD
emulator -avd Pixel_7_API_33

# Or launch with more memory (recommended)
emulator -avd Pixel_7_API_33 -memory 4096
```

**Verify Emulator is Running:**

```bash
# Check connected devices
adb devices

# Expected output:
# List of devices attached
# emulator-5554   device
```

---

## Running the App

### Initial Setup (First Time Only)

```bash
# Navigate to project root
cd /Users/wlyu/dev/AI-PROJECT/gss_client

# Install all dependencies
npm install

# Build shared library
cd shared
npm run build
cd ..
```

### Running on iOS Simulator

```bash
# Navigate to mobile directory
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile

# Method 1: Start Metro bundler + launch iOS simulator
npm run ios

# Method 2: Specify simulator device
npm run ios -- --simulator="iPhone 15 Pro"

# Method 3: Using React Native CLI directly
npx react-native run-ios --simulator="iPhone 15"

# Method 4: Start Metro separately (recommended for development)
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run iOS build
npm run ios
```

**Expected Output:**

```
info Found Xcode workspace "gssClient.xcworkspace"
info Building using "xcodebuild ..."
success Successfully built the app
info Installing "org.reactjs.native.example.gssClient"
info Launching "org.reactjs.native.example.gssClient"
success Successfully launched the app on the simulator
```

### Running on Android Emulator

```bash
# Navigate to mobile directory
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile

# IMPORTANT: Ensure Android emulator is already running
# (See "Launch Android Emulator" section above)

# Method 1: Start Metro bundler + build Android app
npm run android

# Method 2: Using React Native CLI directly
npx react-native run-android

# Method 3: Start Metro separately (recommended for development)
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run Android build
npm run android

# Method 4: Build release version
npm run build:android
```

**Expected Output:**

```
info Running jetifier to migrate libraries to AndroidX
info Starting JS server...
info Installing the app...
info Launching the app on emulator-5554...
success Successfully launched the app on the emulator
```

### Development Workflow (Best Practice)

**Terminal 1: Metro Bundler**

```bash
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npm start
```

**Terminal 2: Platform Build (iOS or Android)**

```bash
# For iOS
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npm run ios

# OR for Android (in separate terminal)
cd /Users/wlyu/dev/AI-PROJECT/gss_client/mobile
npm run android
```

---

## Testing Authentication Flows

### Story 1-2: Email/Password Authentication Testing

#### 1. Test Registration Flow

**Steps:**

1. Launch app on simulator
2. Navigate to Registration screen
3. Fill in test data:
   - Email: `test@example.com`
   - Password: `Test1234!`
   - Display Name: `Test User`
   - Home City: `San Francisco`
4. Tap **Register** button
5. **Expected Result:**
   - Success message appears
   - User is redirected to dashboard
   - Auth tokens stored in secure storage

**Validation Checks:**

- ✅ Email validation shows error for invalid format
- ✅ Password strength indicator updates in real-time
- ✅ Submit button disabled until all fields valid
- ✅ Error messages display for duplicate email (409)
- ✅ Loading spinner shows during API call

#### 2. Test Login Flow

**Steps:**

1. Navigate to Login screen
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `Test1234!`
3. Toggle "Remember me" checkbox
4. Tap **Login** button
5. **Expected Result:**
   - User authenticated successfully
   - Redirected to dashboard
   - Session persists after app restart (if remember me enabled)

**Validation Checks:**

- ✅ Form validation prevents empty submission
- ✅ Error message for invalid credentials (401)
- ✅ "Forgot password?" link navigates correctly
- ✅ Remember me extends token expiration to 90 days
- ✅ Loading state during authentication

#### 3. Test Forgot Password Flow

**Steps:**

1. From Login screen, tap "Forgot password?"
2. Enter email: `test@example.com`
3. Tap **Send Reset Link**
4. **Expected Result:**
   - Success message: "Password reset link sent to your email"
   - (In real app, check email for reset link)

**Simulating Reset Token (Development):** 5. Navigate to Reset Password screen 6. Enter mock token: `mock_reset_token_12345` 7. Enter new password: `NewPass123!` 8. Confirm password: `NewPass123!` 9. Tap **Reset Password** 10. **Expected Result:** - Success message appears - Redirected to Login screen - Can login with new password

**Validation Checks:**

- ✅ Email validation on forgot password form
- ✅ Password strength indicator on reset form
- ✅ Password match validation (new password == confirm password)
- ✅ Error message for expired token
- ✅ Success redirect after 3 seconds

#### 4. Test Remember Me Functionality

**Test Scenario A: Remember Me ENABLED**

1. Login with "Remember me" checked
2. Close app completely (swipe up in iOS, back button in Android)
3. Reopen app
4. **Expected Result:** User still logged in, dashboard visible

**Test Scenario B: Remember Me DISABLED**

1. Login without "Remember me"
2. Close app
3. Reopen app immediately
4. **Expected Result:** User still logged in (session storage active)
5. Wait 15+ minutes (access token expiration)
6. Refresh app or make API call
7. **Expected Result:** Token refresh happens automatically OR user logged out after 7 days

### iOS-Specific Testing

**Keyboard Testing:**

- ✅ Tap input field → keyboard appears
- ✅ Tap "Next" on keyboard → moves to next field
- ✅ Tap "Done" on keyboard → submits form
- ✅ Swipe down to dismiss keyboard
- ✅ View scrolls up when keyboard covers input

**Secure Storage Testing (Keychain):**

```bash
# Check if tokens are stored (development only - requires jailbroken device for real check)
# In production, tokens are in Keychain and not accessible
```

**Navigation Testing:**

- ✅ Swipe back gesture works
- ✅ Back button in navigation bar works
- ✅ Deep link handling for password reset

### Android-Specific Testing

**Keyboard Testing:**

- ✅ Tap input → keyboard appears
- ✅ Back button dismisses keyboard
- ✅ "Next" moves to next field
- ✅ "Done" submits form

**Secure Storage Testing (Keystore):**

```bash
# Tokens stored in Android Keystore (not directly accessible)
# Use adb logcat to view debug logs (development only)
adb logcat | grep "GSS"
```

**Navigation Testing:**

- ✅ Back button navigation
- ✅ Hardware back button handling
- ✅ Deep link handling for password reset

---

## Troubleshooting

### iOS Simulator Issues

**Problem: "No simulator available"**

```bash
# Solution: Boot a simulator manually
xcrun simctl boot "iPhone 15"
```

**Problem: CocoaPods installation fails**

```bash
# Solution 1: Update CocoaPods
sudo gem install cocoapods

# Solution 2: Clear CocoaPods cache
cd mobile/ios
pod deintegrate
pod install
```

**Problem: Build fails with "Command PhaseScriptExecution failed"**

```bash
# Solution: Clear build cache
cd mobile/ios
rm -rf Pods/
rm -rf ~/Library/Caches/CocoaPods
pod install
```

**Problem: Metro bundler port in use**

```bash
# Solution: Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Then restart Metro
cd mobile
npm start
```

### Android Emulator Issues

**Problem: Emulator won't start**

```bash
# Solution 1: Check HAXM is installed (Intel Macs)
# Android Studio > SDK Manager > SDK Tools > Intel HAXM

# Solution 2: Increase AVD RAM
emulator -avd Pixel_7_API_33 -memory 4096

# Solution 3: Cold boot
emulator -avd Pixel_7_API_33 -no-snapshot-load
```

**Problem: "adb: command not found"**

```bash
# Solution: Add Android SDK to PATH
export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools
source ~/.zshrc
```

**Problem: Build fails with "SDK location not found"**

```bash
# Solution: Create local.properties file
cd mobile/android
echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties
```

**Problem: Gradle build fails**

```bash
# Solution: Clear Gradle cache
cd mobile/android
./gradlew clean

# Or clean + rebuild
./gradlew clean && ./gradlew build
```

**Problem: App won't install - "INSTALL_FAILED_UPDATE_INCOMPATIBLE"**

```bash
# Solution: Uninstall old version first
adb uninstall com.gssmobile  # Replace with your package name

# Then reinstall
cd mobile
npm run android
```

### Metro Bundler Issues

**Problem: "Error: ENOSPC: System limit for number of file watchers reached"**

```bash
# Solution (Linux only):
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**Problem: Cached bundle causing issues**

```bash
# Solution: Reset Metro cache
cd mobile
npm start -- --reset-cache
```

### Authentication Testing Issues

**Problem: API calls fail with network error**

```bash
# Solution: Check backend API is running
curl http://localhost:3000/api/health

# For iOS simulator, use localhost
# For Android emulator, use 10.0.2.2 instead of localhost

# Update shared/src/services/http/client.ts:
# Android: http://10.0.2.2:3000/api
# iOS: http://localhost:3000/api
```

**Problem: Tokens not persisting**

```bash
# Check if secure storage is working
# Add debug logs in shared/src/services/storage/secureStorage.ts

# iOS: Check Keychain Access app (only on real device)
# Android: Check logcat for storage errors
adb logcat | grep "SecureStorage"
```

---

## Development Tips

### Hot Reload & Fast Refresh

**Enable Fast Refresh:**

- iOS: Shake device/simulator → "Enable Fast Refresh"
- Android: Shake device/emulator → "Enable Fast Refresh"
- Or: Press `r` in Metro bundler terminal

**Reload App:**

- iOS: Cmd + R (simulator)
- Android: Press `r` twice in Metro terminal
- Or: Shake device → "Reload"

### Developer Menu

**Open Developer Menu:**

- iOS Simulator: Cmd + D
- Android Emulator: Cmd + M (Mac) or Ctrl + M (Windows/Linux)
- Shake physical device

**Useful Menu Options:**

- 🔄 **Reload** - Refresh app
- 🐛 **Debug** - Open Chrome DevTools
- 🔍 **Inspector** - Inspect UI elements
- ⚡ **Fast Refresh** - Toggle hot reload
- 🎨 **Show Perf Monitor** - FPS counter

### Chrome DevTools Debugging

1. Open Developer Menu → "Debug"
2. Chrome opens at `http://localhost:8081/debugger-ui/`
3. Open Chrome DevTools (F12)
4. Set breakpoints in your code
5. Console logs appear in Chrome Console

### React Native Debugger (Recommended)

```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Launch it (listens on port 8081 by default)
open -a "React Native Debugger"

# In app: Open Developer Menu → "Debug"
```

### Network Inspection

**Using Flipper (Recommended):**

1. Install Flipper: `brew install --cask flipper`
2. Launch Flipper
3. Run your app
4. View network requests, Redux state, AsyncStorage, etc.

**Using Chrome DevTools:**

1. Open Chrome → Navigate to `chrome://inspect`
2. Click "Configure..." → Add `localhost:8081`
3. Click "inspect" under your app
4. Go to Network tab

### Testing with Mock Data

**Use MockAuthService for offline development:**

```typescript
// mobile/App.tsx or web/main.tsx
import { MockAuthService } from '@gss/shared';

// Instead of AuthServiceImpl, use mock:
const authService = new MockAuthService();

// Mock service includes:
// - Predefined test users
// - Simulated network delays (500-1500ms)
// - Realistic error scenarios
```

### Performance Monitoring

**Check App Performance:**

- Open Developer Menu → "Show Perf Monitor"
- Monitor FPS (target: 60fps)
- Watch JS thread usage
- Check memory usage

**Profile Performance:**

```bash
# iOS: Use Xcode Instruments
# Android: Use Android Profiler in Android Studio
```

### Useful Commands Reference

```bash
# Clear all caches and rebuild
cd mobile
watchman watch-del-all
rm -rf node_modules
npm install
cd ios && pod install && cd ..
npm start -- --reset-cache

# Check React Native environment
npx react-native doctor

# List all running simulators/emulators
xcrun simctl list devices | grep Booted  # iOS
adb devices  # Android

# View logs
# iOS
npx react-native log-ios

# Android
npx react-native log-android
# OR
adb logcat

# Run tests
npm test  # Run all tests
npm run test:watch  # Watch mode

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

---

## Next Steps

After successfully running the app:

1. ✅ **Test all authentication flows** (registration, login, forgot password, reset password)
2. ✅ **Verify token persistence** (remember me functionality)
3. ✅ **Check form validations** (email format, password strength)
4. ✅ **Test error handling** (duplicate email, invalid credentials)
5. ✅ **Verify cross-platform consistency** (iOS vs Android behavior)
6. 📝 **Document any bugs** in GitHub Issues
7. 🧪 **Run automated tests** (`npm test`)
8. 📊 **Check code coverage** (`npm run test:coverage`)

---

## Additional Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [iOS Simulator Guide](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device)
- [Android Emulator Guide](https://developer.android.com/studio/run/emulator)
- [Flipper Debugger](https://fbflipper.com/)
- [React Native Keychain](https://github.com/oblador/react-native-keychain)

---

**Document Version:** 1.0  
**Last Updated:** November 6, 2025  
**Maintained By:** GSS Development Team

# Autonomous Debugging Playbook

**Core Principle:** Operate independently. Discover answers yourself.

## Rule 1: Autonomous Error Discovery

### Wrong ❌

- Ask user to click buttons, take screenshots, describe errors

### Right ✅

```bash
# 1. Start app
npm run start --workspace=mobile &
npx react-native run-ios --simulator="iPhone 17 Pro"

# 2. Find error logs
find ~/Library/Developer/CoreSimulator/Devices/*/data/Containers/Data/Application \
  -name "js-errors.log" 2>/dev/null

# 3. Read errors
cat /path/to/js-errors.log | jq -r '.message, .stack'
```

**Key:** Error logging captures ALL JS errors on app startup automatically.

## Rule 2: Version Conflicts

### Process

1. Read error log → identify version mismatch
2. Check installed: `npm list react react-test-renderer`
3. Calculate required version from React Native peer deps
4. Add npm overrides:
   ```json
   "overrides": {
     "react": "19.1.1",
     "react-test-renderer": "19.1.1"
   }
   ```
5. Clean rebuild: `rm -rf node_modules ios/build ios/Pods && npm install --legacy-peer-deps`
6. Verify: `npm list react` → all aligned

**Key:** Don't ask "what version?" - check constraints and calculate.

## Rule 3: Stuck Commands

### Solution

```bash
# Kill decisively
pkill -9 -f "react-native"
lsof -ti:8081 | xargs kill -9

# Use direct commands instead of wrappers
xcodebuild -workspace X.xcworkspace -scheme X -sdk iphonesimulator
xcrun simctl install booted path/to/app
xcrun simctl launch booted bundle.id

# Check status instead of waiting
ps aux | grep bundle.id
xcrun simctl listapps booted | grep bundle.id
```

## Autonomous Workflow

```bash
# Complete flow - no user input
npm run start --workspace=mobile &
cd mobile/ios && xcodebuild -workspace GSS_Mobile.xcworkspace -scheme GSS_Mobile -sdk iphonesimulator
xcrun simctl install booted build/*/GSS_Mobile.app
xcrun simctl launch booted org.reactjs.native.example.GSS-Mobile
sleep 5
ERROR_LOG=$(find ~/Library/Developer/CoreSimulator/Devices/*/data/Containers/Data/Application -name "js-errors.log" 2>/dev/null | head -1)
cat "$ERROR_LOG" | jq -r '.message, .name, .stack[]'
```

## Key Commands

### Error Discovery

```bash
xcrun simctl list devices | grep Booted
find ~/Library/Developer/CoreSimulator/Devices/$DEVICE_ID/data/Containers/Data/Application -name "js-errors.log"
```

### Dependencies

```bash
npm list react react-native react-test-renderer
# Add overrides in package.json
npm install --legacy-peer-deps
```

### iOS Build

```bash
rm -rf ios/build && cd ios && pod install
xcodebuild -workspace X.xcworkspace -scheme X -sdk iphonesimulator
xcrun simctl install booted path/to/app
xcrun simctl launch booted bundle.id
ps aux | grep bundle.id
```

## Decision Tree

```
User reports issue
  → Start app autonomously
  → Check error logs (no user input)
  → Errors found?
      YES → Analyze patterns
            → Version mismatch? → Check npm list → Add overrides → Rebuild → Verify
            → Missing module? → Install dependency → Rebuild → Verify
            → Other? → Fix code → Rebuild → Verify
      NO  → Check app running?
            YES → Success
            NO  → Check build logs → Fix → Retry
```

## Verification Checklist

Before reporting "fixed":

- [ ] Error logs empty
- [ ] App process running
- [ ] Dependencies aligned (`npm list`)
- [ ] Build succeeded

## Key Lessons

1. **Never ask for info you can discover**
2. **Calculate versions from constraints**
3. **Use direct commands if wrappers hang**
4. **Always verify fixes programmatically**
5. **Document what was found and fixed**

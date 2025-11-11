# Autonomous Agent Quick Reference

## Golden Rules

1. **Never ask for user input when you can discover the answer yourself**
2. **🚨 NEVER interrupt active builds/processes in terminals**

## Don't Ask vs Do Instead

| ❌ Don't Ask                 | ✅ Do Instead                                 |
| ---------------------------- | --------------------------------------------- |
| "Can you click this button?" | Start app → Read error logs → Fix             |
| "What error do you see?"     | Check `logs/metro-error.log`                  |
| "What version should I use?" | Check `npm list` → Calculate from constraints |
| "Can you check if...?"       | Run command → Verify output                   |
| "Please run this command..." | Run it yourself (with `run_in_terminal`)      |

## 🚨 Terminal Management Rules

### NEVER Interrupt These Processes

**DO NOT run commands in terminals showing:**

- `⠋ Building...` or `⠼ Building...` (spinner animations)
- `Building (using "xcodebuild...`
- `npm start` with Metro serving
- `pod install` in progress
- Any process started with `isBackground=true`

### Correct Approach

```bash
# Terminal 1: Metro (LOCKED - read-only)
npm start

# Terminal 2: iOS build (LOCKED - read-only)
npx react-native run-ios

# Check status: Use get_terminal_output(terminal_id)
# ✅ CORRECT: get_terminal_output("terminal_1_id")
# ❌ WRONG: run_in_terminal("npx tsc", terminal_id="terminal_1_id")

# Need to run other commands? Start NEW terminal
# ✅ CORRECT: run_in_terminal("npx tsc")  # Creates new terminal
```

### Pre-Command Checklist

Before ANY `run_in_terminal`:

1. Is there an active process in this terminal? (spinner, build, Metro)
2. If YES → Use `get_terminal_output` OR start NEW terminal
3. If NO → Safe to reuse

**Mental Model:** Active terminal = 🔒 LOCKED (read-only) | Idle terminal = 🔓 AVAILABLE

## React Native Debug Flow

```bash
# 1. DISCOVER
npm run start --workspace=mobile &
npx react-native run-ios --simulator="iPhone 17 Pro"

# 2. READ LOGS
ERROR_LOG=$(find ~/Library/Developer/CoreSimulator/Devices/*/data/Containers/Data/Application \
  -name "js-errors.log" 2>/dev/null | head -1)
cat "$ERROR_LOG"

# 3. ANALYZE
# Parse errors, identify patterns, determine root cause

# 4. FIX
# Apply fixes based on error patterns

# 5. VERIFY
cat "$ERROR_LOG"  # Empty = success
ps aux | grep bundle.id  # Running = success
npm list react  # Aligned = success
```

## Common Fixes

### React Version Mismatch

```json
"overrides": {"react": "19.1.1", "react-test-renderer": "19.1.1"}
```

Then: `npm install --legacy-peer-deps && clean rebuild`

### Metro Port Conflict

```bash
lsof -ti:8081 | xargs kill -9
```

### Dependencies Out of Sync

```bash
npm list <package>  # Check what's installed
# Add overrides to force alignment
npm install --legacy-peer-deps
```

## Key Locations

- **Error logs:** `~/Library/Developer/CoreSimulator/Devices/{ID}/data/Containers/Data/Application/*/Library/Caches/js-errors.log`
- **Metro logs:** `mobile/logs/metro-error.log`
- **iOS build logs:** `mobile/logs/ios-build.log`

## Success Checklist

- [ ] Error log empty
- [ ] App process running
- [ ] Dependencies aligned
- [ ] Build succeeded

**Remember:** Act like a senior engineer who troubleshoots independently, not an intern who asks every step.

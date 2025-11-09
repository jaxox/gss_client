# Autonomous Agent Quick Reference

## 🎯 Golden Rule

**Never ask for user input when you can discover the answer yourself.**

---

## 📋 Before You Ask the User...

### ❌ DON'T Ask:

- "Can you click this button?"
- "What error do you see?"
- "What version should I use?"
- "Can you check if...?"
- "Please run this command..."

### ✅ DO Instead:

- **Start the app** → Read error logs → Fix issues
- **Check npm list** → Calculate correct versions → Apply fix
- **Run commands** → Check output → Verify success
- **Search codebase** → Find answers → Implement solution

---

## 🚀 React Native Debugging Flow

```bash
# 1. DISCOVER (Autonomous)
npm run start --workspace=mobile &
npx react-native run-ios --simulator="iPhone 17 Pro"
sleep 5

# 2. READ LOGS (Autonomous)
ERROR_LOG=$(find ~/Library/Developer/CoreSimulator/Devices/*/data/Containers/Data/Application \
  -name "js-errors.log" 2>/dev/null | head -1)
cat "$ERROR_LOG"

# 3. ANALYZE (Autonomous)
# Parse errors, identify patterns, determine root cause

# 4. FIX (Autonomous)
# Apply fixes based on error patterns

# 5. VERIFY (Autonomous)
cat "$ERROR_LOG"  # Should be empty
ps aux | grep bundle.id  # Should be running
npm list react  # Should be aligned
```

---

## 🔧 Common Fixes

### React Version Mismatch

```json
// Add to root package.json
"overrides": {
  "react": "19.1.1",
  "react-test-renderer": "19.1.1"
}
```

Then: `npm install --legacy-peer-deps && clean rebuild`

### Commands Hanging

```bash
pkill -9 -f "react-native"
lsof -ti:8081 | xargs kill -9
# Use direct xcodebuild instead of react-native run-ios
```

### Dependencies Out of Sync

```bash
npm list <package>  # Check what's actually installed
# Add overrides to force alignment
npm install --legacy-peer-deps
```

---

## 📍 Key File Locations

- **Error logs:** `~/Library/Developer/CoreSimulator/Devices/{ID}/data/Containers/Data/Application/*/Library/Caches/js-errors.log`
- **Package versions:** `npm list <package>`
- **React Native version:** `package.json` → check react-native peer deps
- **App status:** `ps aux | grep bundle.id` or `xcrun simctl listapps booted`

---

## ✅ Success Checklist

Before reporting "Fixed":

- [ ] Error log is empty (no new errors)
- [ ] App process is running
- [ ] Dependencies are aligned (npm list)
- [ ] Build succeeded
- [ ] Created verification report

---

## 📖 Full Documentation

See: `docs/AUTONOMOUS-DEBUGGING-PLAYBOOK.md`

---

**Remember:** The user expects you to operate like a senior engineer who troubleshoots independently, not an intern who asks questions every step.

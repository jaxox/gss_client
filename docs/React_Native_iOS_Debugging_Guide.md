# ⚛️ React Native iOS Simulator Debugging Guide (macOS)

If GitHub Copilot or any AI tool can’t detect your React Native app’s errors in the iOS Simulator, follow this guide to gather the **right logs**.

---

## 🛑 1. Stop the Rogue `log stream`

If every command in your terminal prints iOS logs, it means a `log stream` process hijacked your shell.

**Fix it:**

```bash
# If log stream is running in the foreground, stop it:
# Press Control + C

# Check for background jobs
jobs -l

# Bring it to foreground, then stop it
fg %1    # Replace %1 with your job number (e.g. %2)
# Then Control + C

# Kill stray background processes
ps aux | egrep 'simctl.*log stream|(^|/ )log stream' | grep -v egrep
pkill -f 'simctl.*log stream' || true
pkill -f '^log stream' || true

# Reset terminal if it's acting weird
reset
```

If you accidentally ran `exec xcrun simctl spawn booted log stream`, **close that tab** and open a new one — it replaced your shell.

---

## 🧩 2. Get the JavaScript (Metro) Error

### ✅ Option A (Fastest): Metro Bundler Terminal

Start Metro manually in a clean terminal:

```bash
cd <your-react-native-project>
npx react-native start --reset-cache
```

Watch for red text — this is your **JS error and stack trace**.  
👉 Copy/paste that error for debugging.

---

### 🧭 Option B: React Native DevTools

- With Metro running, press **`j`** in the Metro terminal.  
  → This opens **React Native DevTools** in your browser (Chrome/Edge).
- You’ll see the JS error in the DevTools console or overlay.
- Copy or screenshot the stack trace.

---

### 📱 Option C: On the iOS Simulator

- Press **⌘D** (or use **Device → Shake**) → **Open JS Debugger** or **Show Error**.
- Take a screenshot of the redbox error or copy the text.

If nothing happens, check that you’re in **Debug mode** (look for “Fast Refresh” toggle in the Dev Menu).

---

## 🧠 3. Native iOS Logs (for non-JS errors)

### View native output

- Run app with **▶** in **Xcode** → see `NSLog`, `print`, or `os_log` output in the Debug area.

### Crash logs (simulator)

```
~/Library/Logs/DiagnosticReports/
```

Look for files like:

```
YourAppName_YYYY-MM-DD-HHMMSS_<device>_sim.crash
```

Attach those when debugging native crashes.

---

## 🧾 4. Add a Global JS Error Handler (Temporary)

If JS errors don’t appear anywhere, inject this near your app entry (`index.js`):

```js
const orig = global.ErrorUtils?.getGlobalHandler?.();
global.ErrorUtils?.setGlobalHandler?.((err, isFatal) => {
  console.error('[GLOBAL_JS_ERROR]', {
    isFatal,
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
  });
  orig?.(err, isFatal);
});
```

This ensures fatal JS errors print in Metro or Xcode logs.

_(Remove after you capture the issue.)_

---

## 🧩 5. What to Share with the AI / Copilot

To let the AI fully debug:

- The **error + stack trace** from Metro (preferable)
- Or a **screenshot** from **DevTools** / **redbox**
- Or a **`.crash`** file (if it’s native)
- Optionally, the **`app-debug.log`** from:
  ```bash
  xcrun simctl spawn booted log stream --level debug --style compact     --predicate 'process == "YourAppName"' > ~/Desktop/app-debug.log
  ```

---

## ✅ Quick Summary

| Goal                | Command / Step                                       |
| ------------------- | ---------------------------------------------------- |
| Stop rogue logs     | `pkill -f 'log stream'`                              |
| Start Metro         | `npx react-native start --reset-cache`               |
| Open DevTools       | Press `j` in Metro terminal                          |
| JS error screenshot | `⌘D` → “Show Error”                                  |
| Native crash logs   | `~/Library/Logs/DiagnosticReports/`                  |
| Stream app logs     | `xcrun simctl spawn booted log stream --level debug` |

---

**Pro Tip:**  
Always keep **Metro** running in its own clean terminal.  
Don’t run `log stream` in your main shell session unless you pipe it to a file.

---

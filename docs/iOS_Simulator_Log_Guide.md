# 🧠 iOS Simulator Log Guide (macOS)

If GitHub Copilot or another AI tool can’t detect your app’s errors in the iOS Simulator, here’s how to collect the logs it needs to debug effectively.

---

## 🔹 1. Check the Xcode Run Console

When you run the app with **▶** in Xcode:

- Logs from `print()`, `NSLog`, and `os_log` appear in the **Debug area**.
- You can **right-click → Save Transcript…** to export the output.

---

## 🔹 2. Stream Simulator Logs via Terminal

Run this to see live logs from the **booted simulator**:

```bash
xcrun simctl spawn booted log stream --level debug --style compact
```

Filter logs **only for your app**:

```bash
# By process name
xcrun simctl spawn booted log stream --level debug --style compact   --predicate 'process == "YourAppName"'

# Or by bundle ID (preferred)
xcrun simctl spawn booted log stream --level debug --style compact   --predicate 'subsystem == "com.your.bundle.id"'
```

Save the output to a file (for Copilot or AI upload):

```bash
xcrun simctl spawn booted log stream --level debug --style syslog   > ~/Desktop/simlog.txt
```

---

## 🔹 3. Get Crash Logs

When the app crashes, logs are stored at:

```
~/Library/Logs/DiagnosticReports/
```

Look for files like:

```
YourAppName_YYYY-MM-DD-HHMMSS_<device>_sim.crash
```

Zip and share these with the AI or your debugging tool.

---

## 🔹 4. App Sandbox Logs (Inside Simulator)

If your app writes its own logs to its sandbox:

```bash
# Get the app's Data container path
xcrun simctl get_app_container booted com.your.bundle.id data
```

You’ll get a path like:

```
~/Library/Developer/CoreSimulator/Devices/<SIM-UDID>/data/Containers/Data/Application/<APP-UUID>/
```

Check inside:

- `Documents/`
- `Library/Logs/`

for your custom log files.

---

## 🔹 5. System Simulator Logs on Disk

Global simulator logs live here:

```
~/Library/Logs/CoreSimulator/<SIM-UDID>/
~/Library/Developer/CoreSimulator/Devices/<SIM-UDID>/
```

Find your current simulator UDID:

```bash
xcrun simctl list devices | grep Booted
```

---

## 🔹 6. Console.app (Graphical Log Viewer)

1. Open **Console.app**
2. In the sidebar, find your simulator under **Devices**
3. Click **Start Streaming**
4. Filter by your app’s name or bundle ID
5. Save logs via **File → Save**

---

## 🔹 7. Advanced: Launch & Capture stdout

```bash
xcrun simctl launch booted -w com.your.bundle.id
```

This pipes all stdout/stderr logs into your terminal directly.

---

## 🧩 What to Share with AI or Copilot

To get the best debugging insight:

- A `.crash` file (if there was a crash)
- A short (5–10 min) log stream:
  ```bash
  xcrun simctl spawn booted log stream --level debug --style compact     --predicate 'process == "YourAppName"' > ~/Desktop/app-debug.log
  ```
- Any app-written logs from your sandbox.

---

✅ **Pro Tip:**  
Use `os_log` with your bundle ID as the subsystem (e.g., `os_log("Message", log: OSLog(subsystem: "com.your.bundle.id", category: "UI"))`) — it makes filtering much easier.

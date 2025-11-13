# E2E Test Workflow

## 🎯 New Smart Workflow

```
┌─────────────────────────────────────────────┐
│  ./run-e2e.sh                          │
│  (One command to rule them all!)            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │ Metro running?  │
         └────────┬────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
       Yes                 No
        │                   │
        ▼                   ▼
   ┌────────┐     ┌──────────────────────┐
   │ Run    │     │ Launch step1 in new  │
   │ Tests  │     │ terminal & wait      │
   └────────┘     └──────────┬───────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Metro ready?    │
                    └────────┬────────┘
                             │
                            Yes
                             │
                             ▼
                        ┌────────┐
                        │ Run    │
                        │ Tests  │
                        └────────┘
```

## Usage Examples

### 1. Simplest Way (Interactive)

```bash
./scripts/simulator/iOS/run-e2e.sh
```

- Checks if Metro is running
- If not, asks: "Run run-metro-bundler.sh in new terminal? (Y/n)"
- Opens new terminal with step1
- Waits for Metro to be ready
- Runs tests

### 2. Fully Automated (CI/CD)

```bash
./scripts/simulator/iOS/run-e2e.sh --auto-setup
```

- No prompts, fully automated
- Auto-launches step1 if needed
- Perfect for CI/CD pipelines

### 3. Specific Test

```bash
./scripts/simulator/iOS/run-e2e.sh "should reach Step 3"
```

- Runs only matching tests
- Still handles prerequisites automatically

### 4. Auto + Specific Test

```bash
./scripts/simulator/iOS/run-e2e.sh --auto-setup "should reach Step 3"
```

- Combines both features
- Perfect for debugging specific tests

## Terminal Behavior

### macOS

Uses AppleScript to open new Terminal.app window:

```applescript
tell application "Terminal"
    do script "cd project && ./run-metro-bundler.sh"
end tell
```

### Linux

Tries common terminal emulators:

- gnome-terminal
- xterm
- etc.

## What Happens in the New Terminal?

The new terminal runs step1 which:

1. ✅ Checks/starts Metro bundler on port 8081
2. ✅ Builds iOS app if needed
3. ✅ Verifies simulator availability
4. ✅ Logs Metro output to `mobile/logs/metro-bundler.log`
5. ✅ Stays open so you can see Metro logs

## Timing

```
step2 launched
    │
    ├─ Metro check (instant)
    │
    ├─ Launch new terminal (2-3 seconds)
    │
    ├─ step1 starts in new terminal
    │   ├─ Metro starts (5-10 seconds)
    │   └─ Build check (instant or 2-3 minutes if building)
    │
    ├─ step2 waits for Metro (max 60 seconds)
    │
    └─ Tests run (3-5 minutes)
```

## Benefits

✅ **One command** - Just run step2, it handles everything
✅ **Visual feedback** - See Metro logs in separate terminal
✅ **Flexible** - Interactive or fully automated modes
✅ **Safe** - Won't start duplicate Metro instances
✅ **Smart waiting** - Auto-detects when Metro is ready
✅ **Error handling** - Clear messages if something fails

## Troubleshooting

### Terminal doesn't open

- Fallback: Run step1 manually in separate terminal
- Script will show instructions

### Metro takes too long

- step2 waits max 60 seconds
- Check the new terminal for Metro errors
- Check logs: `mobile/logs/metro-bundler.log`

### Want to stop Metro

```bash
lsof -ti:8081 | xargs kill
```

### Multiple terminals open?

- Only one Metro instance will run (port check prevents duplicates)
- Close extra terminals manually if desired

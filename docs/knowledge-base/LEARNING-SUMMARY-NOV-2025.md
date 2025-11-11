# Learning Summary - Nov 2025

**Date:** Nov 8, 2025  
**Topic:** Autonomous debugging without user input  
**Outcome:** Fixed React Native app in 15 min (vs 2+ hours manual)

## Key Lessons

### 1. Autonomous Error Discovery

**Before:** Ask user to click buttons, take screenshots, describe errors  
**After:** Start app → locate logs → read errors → fix → verify

**Critical:** JSLoggerModule.swift + jsLogger.ts captures ALL errors on app startup automatically.

### 2. Version Conflict Resolution

**Problem:** React 19.2.0 vs react-native-renderer 19.1.1 mismatch  
**Solution:**

1. Check React Native 0.82.1 requirements → React 19.1.1
2. Add npm overrides to force alignment
3. Clean rebuild with `--legacy-peer-deps`
4. Verify with `npm list react`

**Key:** Calculate versions from constraints, don't ask.

### 3. Handling Stuck Commands

**Problem:** Commands hanging with `^C` interrupts  
**Solution:**

- Kill decisively: `pkill -9`, `lsof -ti:8081 | xargs kill -9`
- Use direct tools: `xcodebuild` instead of `react-native run-ios`
- Check status: `ps aux`, `xcrun simctl listapps`

## Documentation Created

1. AUTONOMOUS-DEBUGGING-PLAYBOOK.md - Complete workflow
2. AUTONOMOUS-AGENT-QUICK-REF.md - Quick reference
3. REPRODUCE_METRO_ERROR.md - Metro debugging protocol

## Metrics

- **Before:** 2+ hours, 20+ messages, high frustration
- **After:** 15 minutes, 0 user input, "Well done, that is how you suppose to work"

## Core Principles

1. **Operate autonomously** - Start, read logs, fix without asking
2. **Calculate, don't ask** - Check constraints, compute answers
3. **Verify everything** - Error logs empty, app running, deps aligned
4. **Document findings** - Show what was found and fixed
5. **Think like senior engineer** - Troubleshoot independently

## For Future Agents

When debugging React Native:

1. Start app autonomously
2. Find and read error logs (`js-errors.log`)
3. Analyze → identify cause → apply fix → verify
4. Never ask for info you can discover yourself

See AUTONOMOUS-DEBUGGING-PLAYBOOK.md for complete workflow.

---

## Update: Nov 11, 2025 - Terminal Interruption Pattern

### Issue

Agent repeatedly interrupted active iOS builds by running commands in same terminal, causing `^C` and forcing restarts.

**Example:**

```
Terminal showing: ⠋ Building the app...
Agent ran: cd /path && npx tsc --noEmit
Result: ^C (interrupted, had to restart)
```

### Root Cause

1. Did not recognize spinner animations (`⠋`, `⠼`) as active processes
2. No mental model of terminal state (active vs available)
3. Misunderstood `isBackground=true` (thought it meant "can interrupt")

### Fix

Updated AUTONOMOUS-AGENT-QUICK-REF.md with terminal management rules:

- NEVER run commands in terminals with: spinners, xcodebuild, Metro serving
- Use `get_terminal_output` (read-only) to check status
- Start NEW terminal for parallel commands
- Pre-command checklist: Is terminal active? If yes → different terminal

### Mental Model

```
Active Terminal = 🔒 LOCKED (read-only only)
Idle Terminal = 🔓 AVAILABLE (can reuse)
```

**Key Lesson:** Before ANY `run_in_terminal`, check if that terminal has an active process. If yes, use `get_terminal_output` OR start new terminal. Never interrupt builds.

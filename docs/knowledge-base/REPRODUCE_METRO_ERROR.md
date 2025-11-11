# Metro Error Debugging Protocol

**MANDATORY for React Native debugging - The ONLY reliable method**

## Problem

Metro errors appear in red screen but NOT in log files when using `npx react-native run-ios`. AI agents cannot see them.

## Solution: Two-Terminal Protocol

### Terminal 1 (T1): Metro Bundler

```bash
cd mobile && npm run metro:log
```

**Rules:** Never interrupt, never add commands, let it run continuously

### Terminal 2 (T2): iOS Build

```bash
cd mobile && npm run ios:no-metro
```

**Rules:** Never interrupt, let it run until build completes

### Read Errors

```bash
# Metro/JavaScript errors
cat mobile/logs/metro-error.log

# iOS native build logs
cat mobile/logs/ios-build.log
```

## Common Errors

| Error                                  | Cause                  | Fix                                                 |
| -------------------------------------- | ---------------------- | --------------------------------------------------- |
| `Unable to resolve module @shared/...` | Wrong alias for mobile | Change to `@gss/shared`                             |
| `Unable to resolve module X`           | Missing dependency     | `npm install X`                                     |
| `Export namespace transform`           | Zod v4 Babel issue     | Add `@babel/plugin-transform-export-namespace-from` |
| `EADDRINUSE: port 8081`                | Old Metro running      | `lsof -ti:8081 \| xargs kill -9`                    |

## For AI Agents

1. Start Metro in T1 (background): `npm run metro:log`
2. Start iOS in T2 (background): `npm run ios:no-metro`
3. Wait for completion (no interruptions)
4. Read `logs/metro-error.log` for JavaScript errors
5. Read `logs/ios-build.log` for native errors

**Never:** Run both in one terminal, use `&&` or `;`, interrupt processes, or check logs before completion

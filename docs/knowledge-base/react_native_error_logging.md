# Capturing React Native Runtime Errors So Copilot Can Read Them

## Goal

React Native shows errors in the simulator (RedBox), but GitHub Copilot cannot see these because:

- They are not in files inside the project.
- They are not part of build logs or Metro logs.
- They only exist in runtime memory/UI.

To let Copilot debug them, we need to **capture the runtime error text and write it to a file inside the project (e.g. `logs/js-runtime-error.log`)**.

---

## ✅ Step 1: Install file-writing dependency (if not using Expo)

```bash
npm install react-native-fs
cd ios && pod install && cd ..
```

---

## ✅ Step 2: Add a global JS error handler to log runtime errors to a file

Place this at the top of `App.tsx` or `index.js`:

```ts
import RNFS from 'react-native-fs';

const originalHandler = global.ErrorUtils.getGlobalHandler();

global.ErrorUtils.setGlobalHandler(async (error, isFatal) => {
  const log = `[${new Date().toISOString()}] ${isFatal ? 'FATAL' : 'ERROR'}: ${error?.message}
${error?.stack}

`;

  try {
    const path = RNFS.DocumentDirectoryPath + '/js-runtime-error.log';
    await RNFS.appendFile(path, log);
    console.log('✅ Saved JS runtime error to:', path);
  } catch (e) {
    console.log('⚠️ Failed to write error log:', e);
  }

  originalHandler(error, isFatal);
});
```

---

## ✅ Step 3: Move or copy the file so Copilot can read it

Create a folder in your project:

```
/logs/js-runtime-error.log
```

You can periodically copy from device storage to your repo:

```bash
cp <DevicePath>/js-runtime-error.log ./logs/
```

---

## ✅ Why previous approaches failed

| Approach                       | Why Copilot couldn't see the error                                            |
| ------------------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `npx react-native run-ios 2>&1 | tee build.log`                                                                | Only logs native/Xcode build output, not runtime JS errors |
| Metro Bundler logs             | Metro runs in a separate process; runtime errors are not guaranteed to appear |
| Red screen in simulator        | UI-only, not written to disk, not accessible to Copilot                       |
| Xcode logs                     | Native layer only, no JS runtime stack traces                                 |

---

## ✅ Result

Now:

- Every runtime React error (e.g., `Cannot read property 'useEffect' of null`) is written to a file.
- That file lives inside the project directory.
- Copilot can read it, reference it, and suggest fixes automatically.

---

Save this file in your project and Copilot will have access to the error context.

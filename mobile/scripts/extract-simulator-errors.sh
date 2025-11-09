#!/bin/bash
# Extract JS errors from iOS simulator cache directory

echo "🔍 Searching for js-errors.log in iOS Simulator..."

# Find the simulator ID for the current device
SIMULATOR_ID=$(xcrun simctl list devices | grep "iPhone.*Booted" | grep -o '[A-F0-9\-]\{36\}' | head -1)

if [ -z "$SIMULATOR_ID" ]; then
  echo "⚠️  No booted simulator found. Please start the simulator first."
  exit 1
fi

echo "📱 Simulator ID: $SIMULATOR_ID"

# Path to the app's cache directory
CACHE_DIR="$HOME/Library/Developer/CoreSimulator/Devices/$SIMULATOR_ID/data/Containers/Data/Application"

echo "🔎 Searching in: $CACHE_DIR"

# Find the GSS app container
APP_CONTAINER=$(find "$CACHE_DIR" -name "GSS_Mobile.app" -type d 2>/dev/null | head -1)

if [ -z "$APP_CONTAINER" ]; then
  echo "⚠️  GSS_Mobile app not found in simulator"
  echo "Searching for any js-errors.log files..."
  find "$CACHE_DIR" -name "js-errors.log*" -type f 2>/dev/null
  exit 1
fi

echo "📦 App container found: $APP_CONTAINER"

# Get the parent directory (app container root)
APP_ROOT=$(dirname "$(dirname "$APP_CONTAINER")")
LOGS_DIR="$APP_ROOT/Library/Caches"

echo "📂 Checking logs directory: $LOGS_DIR"

# Check for error log files
if [ -f "$LOGS_DIR/js-errors.log" ]; then
  echo ""
  echo "✅ Found js-errors.log!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cat "$LOGS_DIR/js-errors.log"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📝 Copying to project logs directory..."
  cp "$LOGS_DIR/js-errors.log" "$(dirname "$0")/../logs/js-runtime-errors.log"
  echo "✅ Copied to: mobile/logs/js-runtime-errors.log"
else
  echo "⚠️  js-errors.log not found in cache directory"
  echo "Listing cache contents:"
  ls -la "$LOGS_DIR" 2>/dev/null || echo "Cache directory not accessible"
fi

# Also check for rotated logs
if [ -f "$LOGS_DIR/js-errors.log.1" ]; then
  echo ""
  echo "📜 Found rotated log: js-errors.log.1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cat "$LOGS_DIR/js-errors.log.1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

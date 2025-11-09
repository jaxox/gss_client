#!/bin/bash
# Automated button testing script for iOS Simulator using AppleScript

set -e

SIMULATOR_ID="4F8D24B8-2F5E-4D67-973E-56987E2C78D9"
APP_BUNDLE_ID="org.reactjs.native.example.GSS-Mobile"
LOG_DIR="$(dirname "$0")/../logs"
mkdir -p "$LOG_DIR"

echo "🤖 Starting automated button testing..."

# Launch the app
echo "📱 Launching app..."
xcrun simctl launch "$SIMULATOR_ID" "$APP_BUNDLE_ID"
sleep 5

# Function to tap using AppleScript
tap_button() {
  local button_text="$1"
  echo "👆 Tapping button: $button_text"
  osascript <<APPLESCRIPT
tell application "Simulator"
    activate
end tell

tell application "System Events"
    tell process "Simulator"
        set frontmost to true
        delay 0.5
        try
            click button "$button_text" of window 1
            delay 1
        on error errMsg
            log "Could not find button: $button_text - " & errMsg
        end try
    end tell
end tell
APPLESCRIPT
  sleep 2
}

# Function to capture screenshot
screenshot() {
  local name=$1
  xcrun simctl io "$SIMULATOR_ID" screenshot "$LOG_DIR/screenshot-$name.png"
  echo "📸 Screenshot saved: $name"
}

screenshot "01-initial"

# Test all buttons
echo "🔘 Testing: Login Screen button"
tap_button "Login Screen"
screenshot "02-after-login"
tap_button "Back to Menu"
sleep 1

echo "🔘 Testing: Force Render Error button - THIS SHOULD TRIGGER AN ERROR"
tap_button "Force Render Error"
sleep 3
screenshot "03-after-force-error"

# Reload to recover
echo "🔄 Reloading app to recover from error..."
xcrun simctl terminate "$SIMULATOR_ID" "$APP_BUNDLE_ID"
sleep 1
xcrun simctl launch "$SIMULATOR_ID" "$APP_BUNDLE_ID"
sleep 4

echo "🔘 Testing: Registration Screen button"
tap_button "Registration Screen"
screenshot "04-after-registration"
tap_button "Back to Menu"
sleep 1

echo "🔘 Testing: Forgot Password button"
tap_button "Forgot Password Screen"
screenshot "05-after-forgot"
tap_button "Back to Menu"
sleep 1

echo "🔘 Testing: Reset Password button"
tap_button "Reset Password Screen"
screenshot "06-after-reset"
tap_button "Back to Menu"
sleep 1

echo "🔘 Testing: Profile Screen button"
tap_button "Profile Screen"
screenshot "07-after-profile"

echo ""
echo "✅ Automated button testing complete!"
echo ""
echo "📊 Now extracting error logs from simulator..."
bash "$(dirname "$0")/extract-simulator-errors.sh"

echo ""
echo "📋 Checking Metro logs for [AUTO_JS_ERROR]..."
if [ -f "$LOG_DIR/metro-live.log" ]; then
  echo ""
  echo "════════════════════════════════════════"
  echo "  CAPTURED ERRORS FROM METRO"
  echo "════════════════════════════════════════"
  grep "\[AUTO_JS_ERROR\]" "$LOG_DIR/metro-live.log" || echo "❌ No [AUTO_JS_ERROR] entries found in Metro logs"
  echo ""
else
  echo "⚠️  Metro log file not found"
fi

echo "🎉 All automated tests completed!"

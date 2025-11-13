#!/bin/bash

# E2E Test Runner Script
# Runs iOS E2E tests after verifying prerequisites
# Can automatically run run-metro-bundler.sh if needed
#
# Usage:
#   ./run-e2e.sh              # Run all tests (interactive)
#   ./run-e2e.sh --auto-setup # Auto-run step1 if needed (no prompt)
#   ./run-e2e.sh "test name"  # Run specific test

set -e  # Exit on error

# Parse command line arguments
AUTO_SETUP=false
TEST_FILTER=""

for arg in "$@"; do
  if [ "$arg" = "--auto-setup" ]; then
    AUTO_SETUP=true
  else
    TEST_FILTER="$arg"
  fi
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
MOBILE_DIR="$PROJECT_ROOT/mobile"
STEP1_SCRIPT="$SCRIPT_DIR/run-metro-bundler.sh"

echo -e "${BLUE}🧪 Running iOS E2E Tests${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if we're in the right directory
if [ ! -d "$MOBILE_DIR" ]; then
  echo -e "${RED}❌ Error: mobile directory not found at $MOBILE_DIR${NC}"
  exit 1
fi

cd "$MOBILE_DIR"

# Function to run step1 in a new terminal
run_step1_in_new_terminal() {
  echo -e "${YELLOW}🔄 Running prerequisites setup in new terminal...${NC}"
  
  # Detect OS and open appropriate terminal
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - use Terminal.app or iTerm2
    if command -v osascript &> /dev/null; then
      # Use AppleScript to open Terminal and run step1
      osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '$PROJECT_ROOT' && '$STEP1_SCRIPT'"
end tell
EOF
      echo -e "${GREEN}✓ Opened new Terminal window${NC}"
      echo -e "${YELLOW}  Please wait for Metro bundler to start...${NC}"
      return 0
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - try common terminal emulators
    if command -v gnome-terminal &> /dev/null; then
      gnome-terminal -- bash -c "cd '$PROJECT_ROOT' && '$STEP1_SCRIPT'; exec bash"
      return 0
    elif command -v xterm &> /dev/null; then
      xterm -e "cd '$PROJECT_ROOT' && '$STEP1_SCRIPT'; bash" &
      return 0
    fi
  fi
  
  return 1
}

# Check if Metro is running
echo -e "${BLUE}📦 Checking Metro bundler...${NC}"
if ! lsof -ti:8081 > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Metro bundler not running on port 8081${NC}"
  echo ""
  
  # Ask if user wants to run step1 automatically (unless auto-setup is enabled)
  if [ "$AUTO_SETUP" = false ]; then
    read -p "Run run-metro-bundler.sh in new terminal? (Y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Nn]$ ]]; then
      echo -e "${BLUE}Please run run-metro-bundler.sh manually:${NC}"
      echo -e "  ${YELLOW}./scripts/simulator/iOS/run-metro-bundler.sh${NC}"
      exit 1
    fi
  else
    echo -e "${BLUE}Auto-setup enabled, launching step1...${NC}"
  fi
  
  # Try to run step1 in new terminal
  if run_step1_in_new_terminal; then
    echo ""
    echo -e "${BLUE}Waiting for Metro bundler to start...${NC}"
    
    # Wait for Metro to be ready (max 60 seconds)
    for i in {1..60}; do
      if lsof -ti:8081 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Metro bundler is ready!${NC}"
        sleep 2  # Give it 2 more seconds to fully initialize
        break
      fi
      
      # Show progress every 5 seconds
      if [ $((i % 5)) -eq 0 ]; then
        echo -e "${YELLOW}  Still waiting... ($i/60 seconds)${NC}"
      fi
      
      sleep 1
      
      if [ $i -eq 60 ]; then
        echo -e "${RED}❌ Timeout waiting for Metro bundler${NC}"
        echo -e "${YELLOW}Please check the other terminal window${NC}"
        exit 1
      fi
    done
  else
    echo -e "${RED}❌ Could not open new terminal automatically${NC}"
    echo -e "${YELLOW}Please run step1 manually:${NC}"
    echo -e "  ${BLUE}./scripts/simulator/iOS/run-metro-bundler.sh${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}✓ Metro bundler is running${NC}"
fi

# Check if app is built
APP_PATH="ios/build/Build/Products/Debug-iphonesimulator/GSS_Mobile.app"
echo ""
echo -e "${BLUE}📱 Checking iOS app build...${NC}"
if [ ! -d "$APP_PATH" ]; then
  echo -e "${YELLOW}⚠️  iOS app not found, building now...${NC}"
  npm run test:e2e:build:ios || exit 1
  echo -e "${GREEN}✓ iOS app built successfully${NC}"
else
  echo -e "${GREEN}✓ iOS app is built${NC}"
fi

# Setup test arguments
TEST_ARGS=""
if [ -n "$TEST_FILTER" ]; then
  echo ""
  echo -e "${BLUE}🎯 Running specific tests: $TEST_FILTER${NC}"
  TEST_ARGS="--testNamePattern=\"$TEST_FILTER\""
fi

# Run E2E tests
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🧪 Running E2E Tests...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -n "$TEST_ARGS" ]; then
  eval "npm run test:e2e:ios:debug -- $TEST_ARGS"
else
  npm run test:e2e:ios:debug
fi

# Check exit code
if [ $? -eq 0 ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${GREEN}✅ E2E Tests Passed!${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${RED}❌ E2E Tests Failed${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi

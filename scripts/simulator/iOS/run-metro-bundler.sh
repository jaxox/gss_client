#!/bin/bash

# E2E Test Prerequisites Setup Script
# This script prepares the environment for running iOS E2E tests
# It ensures Metro bundler is running and the iOS app is built

set -e  # Exit on error

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

echo -e "${BLUE}🚀 E2E Test Prerequisites Setup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if we're in the right directory
if [ ! -d "$MOBILE_DIR" ]; then
  echo -e "${RED}❌ Error: mobile directory not found at $MOBILE_DIR${NC}"
  exit 1
fi

cd "$MOBILE_DIR"

# Function to check if Metro is running
check_metro() {
  if lsof -ti:8081 > /dev/null 2>&1; then
    return 0  # Metro is running
  else
    return 1  # Metro is not running
  fi
}

# Function to start Metro in background
start_metro() {
  echo -e "${YELLOW}📦 Starting Metro bundler with cache reset...${NC}"
  
  # Create logs directory if it doesn't exist
  mkdir -p logs
  # Start Metro in background with cache reset and redirect output to log file
  npm start -- --reset-cache > logs/metro-bundler.log 2>&1 &
  METRO_PID=$!
  
  echo -e "${GREEN}✓ Metro bundler started (PID: $METRO_PID)${NC}"
  echo -e "${BLUE}  Log file: mobile/logs/metro-bundler.log${NC}"
  
  # Wait for Metro to be ready (check port 8081)
  echo -e "${YELLOW}  Waiting for Metro to be ready...${NC}"
  for i in {1..30}; do
    if check_metro; then
      echo -e "${GREEN}✓ Metro bundler is ready!${NC}"
      return 0
    fi
    sleep 1
  done
  
  echo -e "${RED}❌ Metro bundler failed to start within 30 seconds${NC}"
  echo -e "${YELLOW}Check the log file: mobile/logs/metro-bundler.log${NC}"
  exit 1
}

# Check Metro status
echo ""
echo -e "${BLUE}1️⃣  Checking Metro bundler status...${NC}"

if check_metro; then
  echo -e "${GREEN}✓ Metro bundler is already running on port 8081${NC}"
else
  start_metro
fi

# Check if iOS app needs to be built
echo ""
echo -e "${BLUE}2️⃣  Checking iOS app build status...${NC}"

APP_PATH="ios/build/Build/Products/Debug-iphonesimulator/GSS_Mobile.app"

if [ -d "$APP_PATH" ]; then
  echo -e "${GREEN}✓ iOS app is already built${NC}"
  echo -e "${BLUE}  Path: mobile/$APP_PATH${NC}"
  
  # Check if build is recent (less than 1 day old)
  if [ "$(find "$APP_PATH" -mtime -1)" ]; then
    echo -e "${GREEN}  Build is recent (< 24 hours old)${NC}"
  else
    echo -e "${YELLOW}  Build is older than 24 hours${NC}"
    read -p "  Rebuild app? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${YELLOW}📱 Rebuilding iOS app...${NC}"
      npm run test:e2e:build:ios || exit 1
      echo -e "${GREEN}✓ iOS app rebuilt successfully${NC}"
    fi
  fi
else
  echo -e "${YELLOW}⚠️  iOS app not found, building now...${NC}"
  npm run test:e2e:build:ios || exit 1
  echo -e "${GREEN}✓ iOS app built successfully${NC}"
fi

# Check if iOS Simulator is available
echo ""
echo -e "${BLUE}3️⃣  Checking iOS Simulator...${NC}"

# Get the configured simulator from .detoxrc.js
SIMULATOR_NAME="iPhone 17 Pro"

if xcrun simctl list devices | grep -q "$SIMULATOR_NAME"; then
  echo -e "${GREEN}✓ Simulator '$SIMULATOR_NAME' is available${NC}"
else
  echo -e "${YELLOW}⚠️  Simulator '$SIMULATOR_NAME' not found${NC}"
  echo -e "${BLUE}Available simulators:${NC}"
  xcrun simctl list devices | grep -E "iPhone|iPad" | grep -v "unavailable"
fi

# Final status
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ E2E Prerequisites Ready!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Run E2E tests: ${YELLOW}npm run test:e2e:ios:debug${NC}"
echo -e "  2. Or use step2: ${YELLOW}./scripts/simulator/iOS/run-e2e.sh${NC}"
echo ""
echo -e "${BLUE}To stop Metro bundler:${NC}"
echo -e "  ${YELLOW}lsof -ti:8081 | xargs kill${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

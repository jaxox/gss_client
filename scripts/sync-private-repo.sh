#!/bin/bash
# Sync frontend-relevant docs from PRIVATE backend repo
# Requires GitHub authentication

BACKEND_REPO="jaxox/gamified-social-sports"
BRANCH="main"
DOCS_DIR="docs/shared"


# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ GITHUB_TOKEN environment variable not set${NC}"
    echo -e "${YELLOW}💡 Set it with: export GITHUB_TOKEN=your_personal_access_token${NC}"
    echo -e "${YELLOW}💡 Or create one at: https://github.com/settings/tokens${NC}"
    exit 1
fi

# Create docs directory
mkdir -p $DOCS_DIR/decision-logs
mkdir -p $DOCS_DIR/tech-specs
mkdir -p $DOCS_DIR/research-docs

# Function to safely download files with authentication
safe_download() {
    local url=$1
    local output=$2
    local description=$3
    
    echo -e "${YELLOW}Downloading $description...${NC}"
    
    # Use GitHub token for authentication
    if curl -f -s -H "Authorization: token $GITHUB_TOKEN" -o "$output" "$url"; then
        echo -e "${GREEN}✅ Success: $description${NC}"
        return 0
    else
        local http_code=$(curl -s -H "Authorization: token $GITHUB_TOKEN" -o /dev/null -w "%{http_code}" "$url")
        echo -e "${RED}❌ Failed: $description (HTTP: $http_code)${NC}"
        echo -e "${RED}   URL: $url${NC}"
        
        # Create placeholder file with error info
        cat > "$output" << EOF
# File not found in backend repo
# URL: $url
# HTTP Status: $http_code
# Generated: $(date)
# 
# This file needs to be created in the backend repository or the path needs to be corrected.
EOF
        return 1
    fi
}

# Test authentication first
echo -e "${YELLOW}Testing GitHub authentication...${NC}"
if curl -f -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$BACKEND_REPO" > /dev/null; then
    echo -e "${GREEN}✅ Authentication successful, repository accessible${NC}"
else
    echo -e "${RED}❌ Authentication failed or repository not accessible${NC}"
    echo -e "${YELLOW}💡 Make sure your token has 'repo' scope for private repositories${NC}"
    exit 1
fi

# Download PRD
safe_download "https://raw.githubusercontent.com/$BACKEND_REPO/$BRANCH/docs/PRD.md" \
    "$DOCS_DIR/PRD.md" \
    "PRD document"

# Download epics  
safe_download "https://raw.githubusercontent.com/$BACKEND_REPO/$BRANCH/docs/epics.md" \
    "$DOCS_DIR/epics.md" \
    "Epics document"

# Download frontend-relevant decision logs
FRONTEND_DECISIONS=(
  "DEC-005-react-native-mobile-stack.md"
  "DEC-010-api-contract-strategy.md" 
  "HYP-002-notification-category-balance.md"
  "HYP-007-offline-cache-approach.md"
  "README.md"
)

echo -e "\n${YELLOW}Downloading decision logs...${NC}"
for doc in "${FRONTEND_DECISIONS[@]}"; do
  safe_download "https://raw.githubusercontent.com/$BACKEND_REPO/$BRANCH/docs/decision-logs/$doc" \
      "$DOCS_DIR/decision-logs/$doc" \
      "Decision log: $doc"
done

# Download frontend-relevant tech specs
FRONTEND_SPECS=(
  "tech-spec-epic-4.md"  # Social features
  "tech-spec-epic-5.md"  # Notifications  
  "tech-spec-epic-6.md"  # Discovery
)

echo -e "\n${YELLOW}Downloading tech specs...${NC}"
for spec in "${FRONTEND_SPECS[@]}"; do
  safe_download "https://raw.githubusercontent.com/$BACKEND_REPO/$BRANCH/docs/$spec" \
      "$DOCS_DIR/tech-specs/$spec" \
      "Tech spec: $spec"
done

# Download research documents
RESEARCH_DOCS=(
  "product-brief-gamified-social-sports-2025-10-23.md"
  "refundable_deposit_strategies.md"
  "sports_badge_catalog.md"
)

echo -e "\n${YELLOW}Downloading research docs...${NC}"
for doc in "${RESEARCH_DOCS[@]}"; do
  safe_download "https://raw.githubusercontent.com/$BACKEND_REPO/$BRANCH/docs/research-docs/$doc" \
      "$DOCS_DIR/research-docs/$doc" \
      "Research doc: $doc"
done

echo -e "\n${GREEN}✅ Private repository sync completed${NC}"
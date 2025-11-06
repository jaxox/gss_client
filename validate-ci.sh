#!/bin/bash

echo "🔍 CI/CD Pipeline Validation Script"
echo "=================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "1. Checking GitHub Actions workflow files..."

# Check if workflow files exist
if [ -f ".github/workflows/ci.yml" ]; then
    print_status 0 "CI workflow file exists"
else
    print_status 1 "CI workflow file missing"
fi

if [ -f ".github/workflows/deploy.yml" ]; then
    print_status 0 "Deploy workflow file exists"
else
    print_status 1 "Deploy workflow file missing"
fi

if [ -f ".github/workflows/dependencies.yml" ]; then
    print_status 0 "Dependencies workflow file exists"
else
    print_status 1 "Dependencies workflow file missing"
fi

echo

echo "2. Checking package.json structure..."

# Check root package.json
if [ -f "package.json" ]; then
    print_status 0 "Root package.json exists"
    
    # Check for required scripts
    if grep -q '"workspaces"' package.json; then
        print_status 0 "Workspaces configuration found"
    else
        print_status 1 "Workspaces configuration missing"
    fi
    
    # Check for required root scripts
    scripts=("build" "test" "lint" "type-check")
    for script in "${scripts[@]}"; do
        if grep -q "\"$script\":" package.json; then
            print_status 0 "Root script '$script' exists"
        else
            print_status 1 "Root script '$script' missing"
        fi
    done
else
    print_status 1 "Root package.json missing"
fi

echo

echo "3. Checking workspace packages..."

# Check mobile package
if [ -f "mobile/package.json" ]; then
    print_status 0 "Mobile package.json exists"
    mobile_scripts=("build" "test" "lint" "type-check")
    for script in "${mobile_scripts[@]}"; do
        if grep -q "\"$script\":" mobile/package.json; then
            print_status 0 "Mobile script '$script' exists"
        else
            print_status 1 "Mobile script '$script' missing"
        fi
    done
else
    print_status 1 "Mobile package.json missing"
fi

# Check web package  
if [ -f "web/package.json" ]; then
    print_status 0 "Web package.json exists"
    web_scripts=("build" "test" "lint" "type-check")
    for script in "${web_scripts[@]}"; do
        if grep -q "\"$script\":" web/package.json; then
            print_status 0 "Web script '$script' exists"
        else
            print_status 1 "Web script '$script' missing"
        fi
    done
else
    print_status 1 "Web package.json missing"
fi

# Check shared package
if [ -f "shared/package.json" ]; then
    print_status 0 "Shared package.json exists"
    shared_scripts=("build" "test" "lint" "type-check")
    for script in "${shared_scripts[@]}"; do
        if grep -q "\"$script\":" shared/package.json; then
            print_status 0 "Shared script '$script' exists"  
        else
            print_status 1 "Shared script '$script' missing"
        fi
    done
else
    print_status 1 "Shared package.json missing"
fi

echo

echo "4. Checking TypeScript configurations..."

# Check TypeScript configs
configs=("tsconfig.json" "mobile/tsconfig.json" "web/tsconfig.app.json" "shared/tsconfig.json")
for config in "${configs[@]}"; do
    if [ -f "$config" ]; then
        print_status 0 "TypeScript config '$config' exists"
    else
        print_status 1 "TypeScript config '$config' missing"
    fi
done

echo

echo "5. Checking development environment files..."

# Check dev environment files
env_files=(".eslintrc.js" ".prettierrc" ".gitignore" "gss-client.code-workspace")
for file in "${env_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "Dev file '$file' exists"
    else
        print_status 1 "Dev file '$file' missing"  
    fi
done

# Check Husky
if [ -f ".husky/pre-commit" ]; then
    print_status 0 "Husky pre-commit hook exists"
else
    print_status 1 "Husky pre-commit hook missing"
fi

echo

echo "6. Checking project structure..."

# Check directory structure
directories=("mobile" "web" "shared" ".github/workflows")
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        print_status 0 "Directory '$dir' exists"
    else
        print_status 1 "Directory '$dir' missing"
    fi
done

echo

echo "🎯 CI/CD Validation Summary"
echo "=========================="

print_warning "Note: To fully test the CI pipeline, run 'npm ci' to install dependencies"
print_warning "Then test individual commands like 'npm run lint', 'npm run test', etc."

echo
echo "📋 Next Steps for Full Validation:"
echo "1. Install dependencies: npm ci"
echo "2. Test build process: npm run build"
echo "3. Test linting: npm run lint"  
echo "4. Test type checking: npm run type-check"
echo "5. Commit changes to trigger GitHub Actions"

echo
echo "✨ CI/CD pipeline structure validation complete!"

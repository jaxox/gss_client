# CI/CD Workflows

This directory contains GitHub Actions workflows for automated testing, building, and deployment of the GSS Client multi-platform application.

## Workflows Overview

### 🔄 ci.yml - Continuous Integration
**Triggers:** Push/PR to main/develop branches

**Jobs:**
- **lint**: Code quality checks (ESLint, Prettier, TypeScript)
- **test**: Unit tests with coverage reporting
- **build-web**: Build React web application
- **build-android**: Build Android APK/AAB
- **build-ios**: Build iOS application
- **security**: Security scanning (npm audit, CodeQL)

**Features:**
- Parallel execution for faster feedback
- Artifact upload for build outputs
- Coverage reporting to Codecov
- Multi-platform builds (Ubuntu, macOS)

### 🚀 deploy.yml - Deployment Pipeline
**Triggers:** Push to main, version tags, manual dispatch

**Jobs:**
- **deploy-web**: Deploy to Netlify (staging/production)
- **deploy-mobile-android**: Deploy to Google Play Store
- **deploy-mobile-ios**: Deploy to Apple App Store

**Features:**
- Environment-specific deployments
- Manual deployment triggers
- App store distribution for production releases
- Environment protection rules

### 🔒 dependencies.yml - Security & Maintenance
**Triggers:** Weekly schedule (Monday 9 AM UTC), manual dispatch

**Jobs:**
- **dependency-updates**: Check for outdated packages
- **security-audit**: Security vulnerability scanning
- **license-check**: License compliance verification

**Features:**
- Automated dependency monitoring
- Security reporting
- License compliance checks
- Weekly reports via artifacts

## Environment Setup

### Required Secrets

#### Web Deployment (Netlify)
```
NETLIFY_AUTH_TOKEN          # Netlify API token
NETLIFY_STAGING_SITE_ID     # Staging site ID
NETLIFY_PRODUCTION_SITE_ID  # Production site ID
```

#### Android App Store
```
ANDROID_KEYSTORE            # Base64 encoded keystore file
ANDROID_KEYSTORE_PASSWORD   # Keystore password
ANDROID_KEY_PASSWORD        # Key password
GOOGLE_PLAY_SERVICE_ACCOUNT # Google Play Console service account JSON
```

#### iOS App Store
```
IOS_DISTRIBUTION_CERTIFICATE # Base64 encoded P12 certificate
IOS_CERTIFICATE_PASSWORD     # Certificate password
APPSTORE_ISSUER_ID           # App Store Connect issuer ID
APPSTORE_KEY_ID              # App Store Connect key ID
APPSTORE_PRIVATE_KEY         # App Store Connect private key
```

#### External Services
```
CODECOV_TOKEN               # Codecov upload token
VITE_ERROR_TRACKING_DSN     # Error tracking service DSN
```

### Environment Variables

#### Web Application
```
VITE_API_BASE_URL           # Backend API URL
VITE_GOOGLE_CLIENT_ID       # Google OAuth client ID
VITE_ANALYTICS_ENABLED      # Enable analytics (true/false)
VITE_ANALYTICS_TRACKING_ID  # Analytics tracking ID
VITE_ERROR_TRACKING_ENABLED # Enable error tracking (true/false)
```

## Workflow Features

### Code Quality Gates
- ESLint with strict rules for shared library
- Prettier formatting enforcement
- TypeScript type checking across all packages
- Pre-commit hooks via Husky

### Testing Strategy
- Unit tests for all packages
- Coverage reporting and thresholds
- Parallel test execution
- Coverage upload to external service

### Build Optimization
- Dependency caching (npm, Gradle, CocoaPods)
- Parallel builds for different platforms
- Artifact retention and sharing
- Environment-specific configurations

### Security Measures
- Dependency vulnerability scanning
- License compliance checking
- CodeQL static analysis
- Regular security audits

### Deployment Strategy
- Staging deployments on main branch pushes
- Production deployments on version tags
- Manual deployment triggers available
- Environment protection rules

## Usage Examples

### Triggering Deployments

#### Deploy to Staging
```bash
git push origin main
```

#### Deploy to Production
```bash
git tag v1.0.0
git push origin v1.0.0
```

#### Manual Deployment
Use GitHub Actions UI to manually trigger deployment workflow with environment selection.

### Running Security Checks
Security workflows run automatically weekly, but can be triggered manually:
1. Go to Actions tab in GitHub
2. Select "Dependencies & Security" workflow
3. Click "Run workflow"

## Monitoring & Troubleshooting

### Build Status
- Check Actions tab for workflow status
- Review build logs for failures
- Download artifacts for debugging

### Common Issues
1. **Node version mismatch**: Ensure all workflows use NODE_VERSION: '18'
2. **Cache issues**: Clear workflow caches if dependencies fail
3. **Secret rotation**: Update secrets when deployment fails
4. **Mobile builds**: Ensure proper signing certificates and provisioning profiles

### Performance Optimization
- Use dependency caching effectively
- Optimize Docker images if using containers
- Consider using self-hosted runners for faster builds
- Implement build matrix for parallel execution

## Contributing

When adding new workflows:
1. Follow existing naming conventions
2. Add proper documentation
3. Test workflows on feature branches
4. Update this README with new workflows
5. Ensure proper secret management

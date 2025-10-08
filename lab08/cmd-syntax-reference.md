# Command Syntax Reference - Lab 08

## Overview
This lab focuses on testing strategies in Next.js applications, including unit testing, integration testing, end-to-end testing, and test automation. Commands include test runner operations, testing framework setup, and continuous integration testing.

## Commands Used

### Testing Framework Installation

#### Jest and React Testing Library
```bash
# Install Jest and React Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Install Jest environment for Next.js
npm install --save-dev jest-environment-jsdom

# Install additional testing utilities
npm install --save-dev @testing-library/user-event

# Install React test renderer
npm install --save-dev react-test-renderer
```

#### TypeScript Testing Support
```bash
# Install TypeScript testing dependencies
npm install --save-dev @types/jest @types/testing-library__jest-dom

# Install ts-jest for TypeScript support
npm install --save-dev ts-jest

# Install TypeScript React testing types
npm install --save-dev @types/react-test-renderer
```

#### Next.js Testing Configuration
```bash
# Create Jest configuration for Next.js
npx create-next-app@latest my-app --typescript --eslint
# Configuration is automatically included

# Or manually install Next.js Jest configuration
npm install --save-dev @next/jest
```

### Unit Testing Commands

#### Running Unit Tests

##### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

##### Jest-Specific Commands
```bash
# Run Jest directly
npx jest

# Run with specific config
npx jest --config jest.config.js

# Run tests in parallel
npx jest --maxWorkers=4

# Run tests with verbose output
npx jest --verbose

# Update snapshots
npx jest --updateSnapshot

# Run only changed files
npx jest -o
```

#### Test Development Workflow
```bash
# Start test watch mode
npm test -- --watch

# In another terminal: develop components
npm run dev

# Run specific test suite
npm test -- --testPathPattern=components

# Run tests for changed files only
npm test -- --onlyChanged
```

### Integration Testing Commands

#### API Route Testing

##### Testing API Endpoints
```bash
# Install supertest for API testing
npm install --save-dev supertest @types/supertest

# Run API tests
npm test -- --testPathPattern=api

# Test specific API endpoint
npm test -- api/users.test.ts
```

##### Testing with Real Database
```bash
# Install testing database setup
npm install --save-dev @testing-library/jest-dom

# Run tests with test database
NODE_ENV=test npm test

# Reset test database before tests
npm run test:db:reset && npm test
```

#### Component Integration Testing
```bash
# Test component interactions
npm test -- --testPathPattern=integration

# Test with mocked services
npm test -- --testPathPattern=mocked

# Test form submissions
npm test -- Form.integration.test.tsx
```

### End-to-End Testing Commands

#### Playwright Installation and Setup

##### Install Playwright
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install Playwright browsers
npx playwright install

# Install specific browsers
npx playwright install chromium firefox webkit

# Install system dependencies (Linux)
npx playwright install-deps
```

##### Playwright Test Commands
```bash
# Run all Playwright tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run tests with debugging
npx playwright test --debug

# Generate test report
npx playwright show-report
```

#### Cypress Installation and Setup

##### Install Cypress
```bash
# Install Cypress
npm install --save-dev cypress

# Open Cypress test runner
npx cypress open

# Install Cypress testing library
npm install --save-dev @testing-library/cypress
```

##### Cypress Test Commands
```bash
# Run Cypress tests headlessly
npx cypress run

# Run Cypress tests in Chrome
npx cypress run --browser chrome

# Run specific test file
npx cypress run --spec "cypress/e2e/auth.cy.ts"

# Run tests with video recording
npx cypress run --record

# Open Cypress test runner
npx cypress open
```

#### Selenium WebDriver (Alternative)
```bash
# Install Selenium WebDriver
npm install --save-dev selenium-webdriver

# Install browser drivers
npm install --save-dev chromedriver geckodriver

# Run Selenium tests
npm test -- --testPathPattern=e2e
```

### Test Database Commands

#### Test Database Setup

##### SQLite Test Database
```bash
# Install SQLite for testing
npm install --save-dev sqlite3

# Create test database
sqlite3 test.db < schema.sql

# Reset test database
rm test.db && sqlite3 test.db < schema.sql
```

##### PostgreSQL Test Database
```bash
# Create test database
createdb myapp_test

# Run migrations on test database
DATABASE_URL=postgresql://user:pass@localhost/myapp_test npx prisma migrate deploy

# Seed test database
DATABASE_URL=postgresql://user:pass@localhost/myapp_test npx prisma db seed

# Drop test database
dropdb myapp_test
```

##### Docker Test Database
```bash
# Start test database with Docker
docker run --name test-db -e POSTGRES_PASSWORD=password -p 5433:5432 -d postgres

# Stop and remove test database
docker stop test-db && docker rm test-db

# Start test database with docker-compose
docker-compose -f docker-compose.test.yml up -d

# Stop test services
docker-compose -f docker-compose.test.yml down
```

### Mock and Stub Commands

#### Service Mocking

##### Mock API Calls
```bash
# Install MSW (Mock Service Worker)
npm install --save-dev msw

# Initialize MSW
npx msw init public/ --save

# Start MSW server for testing
# (Configured in test setup files)
```

##### Mock External Services
```bash
# Install nock for HTTP mocking
npm install --save-dev nock

# Run tests with mocked HTTP calls
npm test -- --testPathPattern=external

# Test with mock server
npm run mock-server & npm test; kill %1
```

#### Database Mocking
```bash
# Install prisma mock
npm install --save-dev prisma-mock

# Run tests with mocked database
npm test -- --testPathPattern=db-mock

# Test with in-memory database
NODE_ENV=test DATABASE_URL=file:./test.db npm test
```

### Performance Testing Commands

#### Load Testing

##### Artillery Load Testing
```bash
# Install Artillery
npm install --save-dev artillery

# Run basic load test
artillery quick --count 50 --num 10 http://localhost:3000

# Run with Artillery config
artillery run load-test-config.yml

# Test specific scenarios
artillery run api-load-test.yml
```

##### K6 Load Testing
```bash
# Install K6 (system installation required)
# Windows: choco install k6
# macOS: brew install k6
# Linux: sudo apt-get install k6

# Run K6 load test
k6 run load-test.js

# Run with virtual users
k6 run --vus 10 --duration 30s load-test.js

# Run with different stages
k6 run --stage 2m:10 --stage 5m:20 --stage 2m:0 load-test.js
```

#### Performance Testing with Lighthouse
```bash
# Install Lighthouse CI
npm install --save-dev @lhci/cli

# Run Lighthouse CI
npx lhci autorun

# Run with custom config
npx lhci autorun --config=.lighthouserc.js

# Collect Lighthouse data
npx lhci collect --numberOfRuns=3 --url=http://localhost:3000
```

### Visual Regression Testing

#### Chromatic (Storybook Integration)
```bash
# Install Storybook
npx storybook init

# Install Chromatic
npm install --save-dev chromatic

# Run visual tests
npx chromatic --project-token=your-token

# Run with no interaction
npx chromatic --exit-zero-on-changes
```

#### Percy Visual Testing
```bash
# Install Percy
npm install --save-dev @percy/cli @percy/playwright

# Run Percy tests
npx percy exec -- npx playwright test

# Run with Cypress
npx percy exec -- npx cypress run
```

#### BackstopJS
```bash
# Install BackstopJS
npm install --save-dev backstopjs

# Initialize BackstopJS
npx backstop init

# Create reference images
npx backstop reference

# Run visual regression tests
npx backstop test

# Approve changes
npx backstop approve
```

### Accessibility Testing Commands

#### axe-core Integration
```bash
# Install axe-core for testing
npm install --save-dev @axe-core/react @axe-core/playwright

# Run accessibility tests
npm test -- a11y.test.tsx

# Test with Playwright
npx playwright test --grep="accessibility"
```

#### pa11y Testing
```bash
# Install pa11y
npm install --save-dev pa11y

# Run accessibility audit
npx pa11y http://localhost:3000

# Run with custom config
npx pa11y --config .pa11yrc http://localhost:3000

# Test multiple pages
npx pa11y-ci --sitemap http://localhost:3000/sitemap.xml
```

### Code Quality and Linting

#### ESLint Testing Integration
```bash
# Run ESLint
npm run lint

# Run ESLint with fixes
npm run lint -- --fix

# Run ESLint on test files
npx eslint "**/*.test.{js,ts,jsx,tsx}"

# Run ESLint with specific config
npx eslint --config .eslintrc.test.js test/
```

#### Prettier Code Formatting
```bash
# Format all files
npx prettier --write .

# Check formatting
npx prettier --check .

# Format test files only
npx prettier --write "**/*.test.{js,ts,jsx,tsx}"
```

#### TypeScript Type Checking
```bash
# Run TypeScript compiler check
npx tsc --noEmit

# Check only test files
npx tsc --noEmit test/**/*.ts

# Watch mode for type checking
npx tsc --noEmit --watch
```

### Continuous Integration Commands

#### GitHub Actions Setup
```bash
# Create GitHub Actions workflow
mkdir -p .github/workflows
# Create .github/workflows/test.yml file
```

#### Test Commands for CI
```bash
# Install dependencies
npm ci

# Run all tests
npm run test:ci

# Run tests with coverage reporting
npm test -- --coverage --coverageReporters=lcov

# Run E2E tests in CI
npx playwright test --reporter=github

# Run tests with timeout
timeout 300 npm test
```

#### Docker Testing
```bash
# Build test image
docker build -t myapp-test -f Dockerfile.test .

# Run tests in Docker
docker run --rm myapp-test npm test

# Run E2E tests with Docker Compose
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### Test Reporting and Coverage

#### Coverage Reports
```bash
# Generate coverage report
npm test -- --coverage

# Generate HTML coverage report
npm test -- --coverage --coverageReporters=html

# Generate lcov coverage for external tools
npm test -- --coverage --coverageReporters=lcov

# Check coverage thresholds
npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```

#### Test Results Reporting
```bash
# Generate JUnit XML report
npm test -- --reporters=default --reporters=jest-junit

# Generate JSON test results
npm test -- --outputFile=test-results.json --json

# Generate test summary
npm test -- --verbose --passWithNoTests
```

### Debugging Test Commands

#### Test Debugging

##### Debug Jest Tests
```bash
# Debug with Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand Button.test.tsx

# Debug with VS Code
# Use "Jest: Debug" configuration in launch.json
```

##### Debug Playwright Tests
```bash
# Debug with Playwright inspector
npx playwright test --debug

# Debug specific test
npx playwright test --debug auth.spec.ts

# Debug with headed browser
npx playwright test --headed --slowMo=1000
```

##### Debug Cypress Tests
```bash
# Open Cypress debugger
npx cypress open

# Debug with browser dev tools
npx cypress run --headed --no-exit

# Debug specific test
npx cypress run --spec cypress/e2e/auth.cy.ts --headed
```

### Test Environment Commands

#### Environment Setup
```bash
# Set test environment
NODE_ENV=test npm test

# Use different config for testing
npm test -- --config jest.config.test.js

# Load test environment variables
npm test -- --env-file .env.test
```

#### Test Database Reset
```bash
# Reset test database before each test run
npm run test:db:reset && npm test

# Seed test data
npm run test:db:seed

# Clean test environment
npm run test:clean && npm test
```

## Troubleshooting Commands

### Common Test Issues

#### Jest Configuration Issues
```bash
# Clear Jest cache
npx jest --clearCache

# Run with no cache
npx jest --no-cache

# Validate Jest config
npx jest --showConfig

# Debug Jest resolver
npx jest --debug-resolver
```

#### Test Environment Issues
```bash
# Check Node.js version
node --version

# Check npm environment
npm run env

# Verify test dependencies
npm ls jest @testing-library/react

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Browser Testing Issues
```bash
# Update Playwright browsers
npx playwright install --force

# Check browser installation
npx playwright install-deps

# Reset Cypress
npx cypress cache clear
npx cypress install --force

# Debug browser startup
npx playwright test --headed --debug
```

#### Performance Test Issues
```bash
# Check system resources
top                    # macOS/Linux
tasklist              # Windows

# Monitor memory usage during tests
npm test -- --logHeapUsage

# Run tests with increased memory
node --max-old-space-size=4096 node_modules/.bin/jest
```

### Test Data Issues

#### Mock Data Problems
```bash
# Clear mock data
rm -rf __mocks__/data/*

# Reset MSW handlers
# Check msw setup in test files

# Verify mock API responses
curl http://localhost:3000/api/mocked-endpoint

# Debug mock service worker
# Check browser dev tools > Application > Service Workers
```

#### Database Test Issues
```bash
# Reset test database
npm run test:db:reset

# Check test database connection
psql -d myapp_test -c "SELECT 1;"

# Verify test data
npm run test:db:status

# Clean test database
npm run test:db:clean
```
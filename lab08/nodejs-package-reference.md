# Node.js Package Reference - Lab 08

## Overview
This lab focuses on comprehensive testing strategies including unit testing, integration testing, end-to-end testing, and performance testing. It covers testing frameworks, mocking libraries, test utilities, and automated testing tools for Next.js applications.

## Core Testing Frameworks

### `jest`
**Description:** Delightful JavaScript testing framework with a focus on simplicity.

**Purpose:**
- Unit testing
- Integration testing
- Test coverage
- Snapshot testing
- Mocking capabilities

**Installation:**
```bash
npm install --save-dev jest @types/jest
```

**Configuration:**
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

**Setup File:**
```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock fetch
global.fetch = jest.fn()

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))
```

**Example Tests:**
```typescript
// __tests__/utils.test.ts
import { formatDate, validateEmail } from '@/lib/utils'

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25')
      expect(formatDate(date)).toBe('December 25, 2023')
    })

    it('should handle invalid dates', () => {
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false)
    })
  })
})
```

### `@testing-library/react`
**Description:** Simple and complete testing utilities for React components.

**Purpose:**
- Component testing
- User interaction testing
- Accessibility testing
- DOM testing utilities

**Installation:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

**Usage:**
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct styles for variants', () => {
    render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-500')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### `@testing-library/user-event`
**Description:** User-centric testing utilities for user interactions.

**Installation:**
```bash
npm install --save-dev @testing-library/user-event
```

**Usage:**
```typescript
// __tests__/components/Form.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '@/components/ContactForm'

describe('ContactForm', () => {
  it('submits form with valid data', async () => {
    const handleSubmit = jest.fn()
    const user = userEvent.setup()
    
    render(<ContactForm onSubmit={handleSubmit} />)
    
    // Type in form fields
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Hello world!')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello world!',
    })
  })

  it('shows validation errors for invalid input', async () => {
    const user = userEvent.setup()
    
    render(<ContactForm onSubmit={jest.fn()} />)
    
    // Submit without filling fields
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})
```

## End-to-End Testing

### `@playwright/test`
**Description:** Fast, reliable end-to-end testing for modern web apps.

**Purpose:**
- Cross-browser testing
- Mobile testing
- Visual testing
- API testing
- Performance testing

**Installation:**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Example Tests:**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid=email]', 'test@example.com')
    await page.fill('[data-testid=password]', 'password123')
    await page.click('[data-testid=login-button]')
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid=user-menu]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid=email]', 'invalid@example.com')
    await page.fill('[data-testid=password]', 'wrongpassword')
    await page.click('[data-testid=login-button]')
    
    await expect(page.locator('[data-testid=error-message]')).toContainText('Invalid credentials')
  })
})

// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.locator('h1')).toContainText('Welcome to Next.js')
    await expect(page.locator('[data-testid=hero-cta]')).toBeVisible()
  })

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/')
    
    await page.click('text=About')
    await expect(page).toHaveURL('/about')
    await expect(page.locator('h1')).toContainText('About Us')
  })
})

// e2e/api.spec.ts
import { test, expect } from '@playwright/test'

test.describe('API Tests', () => {
  test('should fetch users data', async ({ request }) => {
    const response = await request.get('/api/users')
    
    expect(response.status()).toBe(200)
    
    const users = await response.json()
    expect(users).toHaveLength(3)
    expect(users[0]).toHaveProperty('id')
    expect(users[0]).toHaveProperty('name')
  })

  test('should create new user', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: {
        name: 'New User',
        email: 'new@example.com',
      },
    })
    
    expect(response.status()).toBe(201)
    
    const user = await response.json()
    expect(user.name).toBe('New User')
    expect(user.email).toBe('new@example.com')
  })
})
```

### `cypress`
**Description:** Fast, easy and reliable testing for anything that runs in a browser.

**Installation:**
```bash
npm install --save-dev cypress
```

**Configuration:**
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

**Example Tests:**
```typescript
// cypress/e2e/navigation.cy.ts
describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should navigate between pages', () => {
    cy.get('[data-cy=nav-about]').click()
    cy.url().should('include', '/about')
    cy.get('h1').should('contain', 'About Us')
    
    cy.get('[data-cy=nav-home]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should handle mobile navigation', () => {
    cy.viewport('iphone-6')
    cy.get('[data-cy=mobile-menu-button]').click()
    cy.get('[data-cy=mobile-menu]').should('be.visible')
  })
})

// cypress/e2e/forms.cy.ts
describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact')
  })

  it('should submit form successfully', () => {
    cy.get('[data-cy=name-input]').type('John Doe')
    cy.get('[data-cy=email-input]').type('john@example.com')
    cy.get('[data-cy=message-input]').type('Hello, this is a test message.')
    
    cy.get('[data-cy=submit-button]').click()
    
    cy.get('[data-cy=success-message]').should('be.visible')
    cy.get('[data-cy=success-message]').should('contain', 'Message sent successfully')
  })

  it('should show validation errors', () => {
    cy.get('[data-cy=submit-button]').click()
    
    cy.get('[data-cy=name-error]').should('contain', 'Name is required')
    cy.get('[data-cy=email-error]').should('contain', 'Email is required')
  })
})
```

## Mocking and Test Utilities

### `msw` (Mock Service Worker)
**Description:** API mocking library for the browser and Node.js.

**Purpose:**
- HTTP request mocking
- API testing
- Development server mocking
- Integration testing

**Installation:**
```bash
npm install --save-dev msw
```

**Setup:**
```typescript
// mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  // Mock GET /api/users
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ])
    )
  }),

  // Mock POST /api/users
  rest.post('/api/users', async (req, res, ctx) => {
    const newUser = await req.json()
    return res(
      ctx.status(201),
      ctx.json({
        id: Date.now().toString(),
        ...newUser,
      })
    )
  }),

  // Mock authentication
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json()
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.json({
          user: { id: '1', email, name: 'Test User' },
          token: 'mock-jwt-token',
        })
      )
    }
    
    return res(
      ctx.status(401),
      ctx.json({ error: 'Invalid credentials' })
    )
  }),
]

// mocks/server.ts (for Node.js/Jest)
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// mocks/browser.ts (for browser/Cypress)
import { setupWorker } from 'msw'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

**Jest Integration:**
```typescript
// jest.setup.js
import { server } from './mocks/server'

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())
```

**Test Usage:**
```typescript
// __tests__/api/users.test.ts
import { server } from '@/mocks/server'
import { rest } from 'msw'

describe('/api/users', () => {
  it('should fetch users', async () => {
    const response = await fetch('/api/users')
    const users = await response.json()
    
    expect(users).toHaveLength(2)
    expect(users[0].name).toBe('John Doe')
  })

  it('should handle server error', async () => {
    // Override the handler for this test
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )

    const response = await fetch('/api/users')
    expect(response.status).toBe(500)
  })
})
```

### `jest-mock-extended`
**Description:** Type safe mocking extensions for Jest.

**Installation:**
```bash
npm install --save-dev jest-mock-extended
```

**Usage:**
```typescript
import { mock, mockReset } from 'jest-mock-extended'

interface UserService {
  getUser(id: string): Promise<User>
  createUser(data: CreateUserData): Promise<User>
}

const mockUserService = mock<UserService>()

describe('UserController', () => {
  beforeEach(() => {
    mockReset(mockUserService)
  })

  it('should get user by id', async () => {
    const user = { id: '1', name: 'John Doe' }
    mockUserService.getUser.mockResolvedValue(user)

    const controller = new UserController(mockUserService)
    const result = await controller.getUser('1')

    expect(result).toEqual(user)
    expect(mockUserService.getUser).toHaveBeenCalledWith('1')
  })
})
```

## Visual Testing

### `@storybook/react`
**Description:** Tool for building UI components and pages in isolation.

**Installation:**
```bash
npx storybook@latest init
```

**Configuration:**
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config
```

**Example Stories:**
```typescript
// stories/Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/Button'

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Button',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Button',
  },
}
```

### `@storybook/addon-a11y`
**Description:** Accessibility testing addon for Storybook.

**Usage:**
```typescript
// stories/accessible-component.stories.ts
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

export const AccessibilityTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Check for proper ARIA labels
    const button = canvas.getByRole('button')
    expect(button).toHaveAttribute('aria-label')
    
    // Test keyboard navigation
    await userEvent.tab()
    expect(button).toHaveFocus()
  },
}
```

## Performance Testing

### `lighthouse`
**Description:** Tool for improving the quality of web pages.

**Installation:**
```bash
npm install --save-dev lighthouse
```

**Usage:**
```typescript
// scripts/lighthouse.js
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  }
  
  const runnerResult = await lighthouse('http://localhost:3000', options)
  
  // Output the result
  console.log('Lighthouse results:', runnerResult.lhr.categories)
  
  // Check thresholds
  const scores = runnerResult.lhr.categories
  const performance = scores.performance.score * 100
  const accessibility = scores.accessibility.score * 100
  
  if (performance < 90) {
    console.error(`Performance score ${performance} is below threshold of 90`)
    process.exit(1)
  }
  
  if (accessibility < 95) {
    console.error(`Accessibility score ${accessibility} is below threshold of 95`)
    process.exit(1)
  }
  
  await chrome.kill()
}

runLighthouse().catch(console.error)
```

### `autocannon`
**Description:** Fast HTTP/1.1 benchmarking tool.

**Installation:**
```bash
npm install --save-dev autocannon
```

**Usage:**
```typescript
// scripts/load-test.js
const autocannon = require('autocannon')

async function runLoadTest() {
  const result = await autocannon({
    url: 'http://localhost:3000',
    duration: 30, // 30 seconds
    connections: 10,
    pipelining: 1,
    title: 'Next.js Load Test',
  })
  
  console.log(result)
  
  // Check performance criteria
  if (result.throughput.average < 1000) {
    console.error('Throughput is below acceptable level')
    process.exit(1)
  }
  
  if (result.latency.average > 100) {
    console.error('Average latency is too high')
    process.exit(1)
  }
}

runLoadTest().catch(console.error)
```

## Code Coverage

### `c8` (V8 Coverage)
**Description:** Native V8 coverage reports.

**Installation:**
```bash
npm install --save-dev c8
```

**Configuration:**
```json
// package.json
{
  "scripts": {
    "test:coverage": "c8 npm test",
    "test:coverage:report": "c8 report --reporter=html"
  },
  "c8": {
    "include": [
      "src/**/*.{js,ts,jsx,tsx}"
    ],
    "exclude": [
      "**/*.test.{js,ts,jsx,tsx}",
      "**/*.stories.{js,ts,jsx,tsx}",
      "**/node_modules/**"
    ],
    "reporter": [
      "text",
      "html",
      "lcov"
    ],
    "check-coverage": true,
    "lines": 80,
    "functions": 80,
    "branches": 80,
    "statements": 80
  }
}
```

### `nyc` (Alternative Coverage Tool)
**Description:** Istanbul command line interface.

**Installation:**
```bash
npm install --save-dev nyc
```

**Configuration:**
```json
// package.json
{
  "nyc": {
    "extension": [".ts", ".tsx"],
    "exclude": [
      "**/*.d.ts",
      "**/*.test.ts",
      "**/*.test.tsx",
      "coverage/**",
      ".next/**"
    ],
    "reporter": ["html", "text", "lcov"],
    "check-coverage": true,
    "lines": 80,
    "statements": 80,
    "functions": 80,
    "branches": 80
  }
}
```

## Test Utilities and Helpers

### `@testing-library/react-hooks`
**Description:** Testing utilities for React hooks.

**Installation:**
```bash
npm install --save-dev @testing-library/react-hooks
```

**Usage:**
```typescript
// __tests__/hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '@/hooks/useCounter'

describe('useCounter', () => {
  it('should initialize with 0', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })

  it('should accept initial value', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current.count).toBe(10)
  })
})
```

### `@faker-js/faker`
**Description:** Generate massive amounts of fake data.

**Installation:**
```bash
npm install --save-dev @faker-js/faker
```

**Usage:**
```typescript
// __tests__/utils/test-data.ts
import { faker } from '@faker-js/faker'

export function createMockUser() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    createdAt: faker.date.past(),
  }
}

export function createMockPost() {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    author: createMockUser(),
    tags: faker.lorem.words(3).split(' '),
    publishedAt: faker.date.past(),
  }
}

// Usage in tests
describe('PostList', () => {
  it('should render posts', () => {
    const posts = Array.from({ length: 5 }, createMockPost)
    render(<PostList posts={posts} />)
    
    expect(screen.getAllByRole('article')).toHaveLength(5)
  })
})
```

## Test Configuration and Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ui": "playwright test --ui",
    "test:cypress": "cypress run",
    "test:cypress:open": "cypress open",
    "test:lighthouse": "node scripts/lighthouse.js",
    "test:load": "node scripts/load-test.js",
    "test:all": "npm run test && npm run test:e2e && npm run test:lighthouse",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### GitHub Actions CI
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:ci

      - name: Install Playwright browsers
        run: npx playwright install

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## Testing Best Practices

### Test Organization
```typescript
// __tests__/components/UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserProfile } from '@/components/UserProfile'
import { createMockUser } from '@/test-utils'

// Group related tests
describe('UserProfile', () => {
  const mockUser = createMockUser()

  // Test rendering
  describe('rendering', () => {
    it('should render user information', () => {
      render(<UserProfile user={mockUser} />)
      
      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
      expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    })

    it('should render avatar', () => {
      render(<UserProfile user={mockUser} />)
      
      const avatar = screen.getByRole('img', { name: /avatar/i })
      expect(avatar).toHaveAttribute('src', mockUser.avatar)
    })
  })

  // Test interactions
  describe('interactions', () => {
    it('should handle edit button click', async () => {
      const handleEdit = jest.fn()
      const user = userEvent.setup()
      
      render(<UserProfile user={mockUser} onEdit={handleEdit} />)
      
      await user.click(screen.getByRole('button', { name: /edit/i }))
      
      expect(handleEdit).toHaveBeenCalledWith(mockUser.id)
    })
  })

  // Test edge cases
  describe('edge cases', () => {
    it('should handle missing avatar', () => {
      const userWithoutAvatar = { ...mockUser, avatar: null }
      render(<UserProfile user={userWithoutAvatar} />)
      
      expect(screen.getByText(/no avatar/i)).toBeInTheDocument()
    })
  })
})
```

### Custom Test Utilities
```typescript
// test-utils/render.tsx
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/providers/AuthProvider'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  user?: User | null
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialEntries = ['/'],
    user = null,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    )
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render method
export { renderWithProviders as render }
```

### Accessibility Testing
```typescript
// __tests__/accessibility.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe'
import { render } from '@testing-library/react'

expect.extend(toHaveNoViolations)

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```
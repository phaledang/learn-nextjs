# Command Syntax Reference - Lab 05

## Overview
This lab focuses on state management, forms, and user interactions in Next.js. Commands include development server operations, form testing, state debugging, and performance monitoring for interactive components.

## Commands Used

### Development Server Commands

#### `npm run dev`
Starts development server with state management and form handling capabilities.

**Enhanced features for this lab:**
- React state debugging tools
- Form submission monitoring
- Client-side routing with state
- Real-time state updates

**Development with debugging:**
```bash
# Start with React Developer Tools support
npm run dev

# Enable React strict mode warnings
REACT_STRICT_MODE=true npm run dev

# Start with source maps for debugging
npm run dev --source-maps
```

### State Management Commands

#### React DevTools Usage
After starting the development server, use browser developer tools:

```bash
# Start development server
npm run dev

# In browser (F12):
# - React tab for component state
# - Components tab for state inspection
# - Profiler tab for performance
```

#### State Debugging Commands
```bash
# Start development with verbose logging
DEBUG=react* npm run dev

# Monitor state changes in console
npm run dev
# Check browser console for state updates
```

### Form Testing Commands

#### Manual Form Testing
```bash
# Start development server
npm run dev

# Test form submissions:
# - Fill out forms in browser
# - Submit with various inputs
# - Test validation errors
# - Check form reset functionality
```

#### Automated Form Testing with curl
```bash
# Test form submission endpoint
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"Test message"}' \
  http://localhost:3000/api/contact

# Test form validation
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid-email","message":""}' \
  http://localhost:3000/api/contact

# Test file upload (if implemented)
curl -X POST -F "file=@test.jpg" -F "title=Test Image" \
  http://localhost:3000/api/upload
```

### Client-Side Navigation Testing

#### Testing React Router/Next.js Router
```bash
# Start development server
npm run dev

# Test navigation programmatically:
# - Use browser console to test router.push()
# - Test back/forward button behavior
# - Check state persistence across routes
```

#### Navigation Performance Testing
```bash
# Monitor navigation performance
npm run dev

# Use browser dev tools:
# - Performance tab
# - Measure navigation timing
# - Check for memory leaks
```

## Package Manager Commands

### Installing State Management Libraries

#### React Context (built-in, no installation needed)
```bash
# No additional installation required
# Built into React
```

#### Zustand (lightweight state management)
```bash
# Install Zustand
npm install zustand

# Install with TypeScript types
npm install zustand @types/zustand
```

#### Redux Toolkit (if using Redux)
```bash
# Install Redux Toolkit
npm install @reduxjs/toolkit react-redux

# Install Redux DevTools
npm install --save-dev @redux-devtools/extension
```

#### React Hook Form
```bash
# Install React Hook Form
npm install react-hook-form

# Install validation library
npm install @hookform/resolvers yup
# OR
npm install @hookform/resolvers zod
```

### Form Libraries Installation

#### Formik (alternative form library)
```bash
# Install Formik
npm install formik

# Install Yup for validation
npm install yup
```

#### React Final Form
```bash
# Install React Final Form
npm install final-form react-final-form
```

## Build and Testing Commands

#### `npm run build`
Creates production build with optimized state management and forms.

**Optimizations in this lab:**
- Dead code elimination for unused state
- Form validation bundling
- Client-side chunk optimization
- State hydration optimization

**Build analysis:**
```bash
npm run build
# Look for:
# - Bundle size of state management code
# - Form validation library sizes
# - Client-side JavaScript chunks
```

#### `npm run start`
Tests production build with state management and forms.

```bash
npm run build
npm run start

# Test in production mode:
# - Form submissions
# - State persistence
# - Navigation with state
# - Performance characteristics
```

## Development Workflow Commands

### State Development Workflow

#### Component Development with State
```bash
# 1. Start development server
npm run dev

# 2. Create component with state
# (Manual file creation)

# 3. Test state updates in browser
# - Check React DevTools
# - Monitor console for updates
# - Test edge cases

# 4. Test state persistence
# - Navigate between pages
# - Refresh browser
# - Check localStorage/sessionStorage
```

#### Form Development Workflow
```bash
# 1. Start development server
npm run dev

# 2. Create form component
# (Manual file creation)

# 3. Test form functionality
# - Fill out form fields
# - Submit form
# - Test validation
# - Check error handling

# 4. Test form submission
curl -X POST -H "Content-Type: application/json" \
  -d '{"test":"data"}' \
  http://localhost:3000/api/form-endpoint
```

## Testing Commands

### Unit Testing (if Jest is configured)

#### Install Testing Dependencies
```bash
# Install Jest and testing utilities
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Install additional testing utilities
npm install --save-dev @testing-library/user-event

# Install React test renderer
npm install --save-dev react-test-renderer
```

#### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- ComponentName.test.tsx

# Run tests with coverage
npm test -- --coverage
```

#### Test State Components
```bash
# Test component state changes
npm test -- --watch StateComponent.test.tsx

# Test form submissions
npm test -- --watch FormComponent.test.tsx
```

### End-to-End Testing (if Playwright/Cypress is configured)

#### Install E2E Testing Tools
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install Cypress
npm install --save-dev cypress
```

#### Running E2E Tests
```bash
# Run Playwright tests
npx playwright test

# Run Cypress tests
npx cypress run

# Open Cypress interactive mode
npx cypress open
```

## Performance Monitoring Commands

### State Performance Monitoring

#### React Profiler
```bash
# Start development server
npm run dev

# Use React DevTools Profiler:
# 1. Open browser dev tools
# 2. Go to Profiler tab
# 3. Start recording
# 4. Interact with stateful components
# 5. Stop recording and analyze
```

#### Performance Testing
```bash
# Build and test performance
npm run build
npm run start

# Use Lighthouse for performance testing
# Open Chrome dev tools > Lighthouse tab
# Run audit for performance
```

### Memory Leak Detection

#### Monitor Memory Usage
```bash
# Start with memory monitoring
node --inspect npm run dev

# Use Chrome dev tools:
# 1. Go to chrome://inspect
# 2. Click "inspect" under Node.js
# 3. Monitor memory usage in Memory tab
```

#### Memory Profiling
```bash
# Start development server with profiling
npm run dev

# In browser dev tools:
# 1. Memory tab
# 2. Take heap snapshots
# 3. Compare snapshots after state changes
# 4. Look for memory leaks
```

## Debugging Commands

### State Debugging

#### Console Debugging
```bash
# Start development with state logging
npm run dev

# Add console.log statements in components:
# - useEffect dependencies
# - State update functions
# - Event handlers
```

#### React DevTools Debugging
```bash
# Start development server
npm run dev

# In React DevTools:
# - Select component
# - View props and state
# - Modify state values
# - Track state changes
```

### Form Debugging

#### Form Validation Debugging
```bash
# Test form validation
npm run dev

# In browser console:
# - Check form validation errors
# - Test field validation
# - Monitor form submission events
```

#### Network Request Debugging
```bash
# Monitor form submissions
npm run dev

# In browser dev tools Network tab:
# - Filter by XHR/Fetch
# - Check form submission requests
# - Verify request payloads
# - Check response status codes
```

## Local Storage and Session Commands

### Browser Storage Testing

#### LocalStorage Testing
```bash
# Start development server
npm run dev

# In browser console:
# localStorage.setItem('key', 'value')
# localStorage.getItem('key')
# localStorage.removeItem('key')
# localStorage.clear()
```

#### SessionStorage Testing
```bash
# Start development server
npm run dev

# In browser console:
# sessionStorage.setItem('key', 'value')
# sessionStorage.getItem('key')
# sessionStorage.removeItem('key')
# sessionStorage.clear()
```

#### Clear Browser Storage
```bash
# Clear all browser data for localhost:3000
# Browser dev tools > Application tab > Storage section
# Click "Clear site data"
```

## Error Handling Commands

### Error Boundary Testing

#### Test Error Boundaries
```bash
# Start development server
npm run dev

# Trigger errors intentionally:
# - Throw errors in components
# - Test error boundary fallbacks
# - Check error logging
```

#### Error Logging
```bash
# Start with error monitoring
npm run dev

# Check browser console for:
# - React error boundaries
# - Uncaught exceptions
# - Promise rejections
```

## Accessibility Testing Commands

### A11y Testing Tools

#### Install Accessibility Testing
```bash
# Install axe-core for accessibility testing
npm install --save-dev @axe-core/react

# Install ESLint accessibility plugin
npm install --save-dev eslint-plugin-jsx-a11y
```

#### Run Accessibility Tests
```bash
# Run accessibility linting
npm run lint

# Test with screen reader simulation:
# Use browser dev tools > Accessibility tab
```

## Mobile Testing Commands

### Responsive Testing

#### Mobile Device Testing
```bash
# Start development server on all interfaces
npm run dev -- --hostname 0.0.0.0

# Find local IP address
ipconfig getifaddr en0        # macOS
ip route get 1.1.1.1          # Linux
ipconfig                      # Windows

# Test on mobile device:
# http://[local-ip]:3000
```

#### Touch Event Testing
```bash
# Start development server
npm run dev

# Use browser dev tools:
# - Toggle device toolbar
# - Select mobile device
# - Test touch interactions
# - Test swipe gestures
```

## Troubleshooting Commands

### Common State Management Issues

#### State Not Updating
```bash
# Check React strict mode
npm run dev

# Common debugging steps:
# 1. Check useEffect dependencies
# 2. Verify state update functions
# 3. Check for state mutations
# 4. Test with React DevTools
```

#### Form Issues
```bash
# Debug form submissions
npm run dev

# Check:
# 1. Form action and method
# 2. Input name attributes
# 3. Event handlers
# 4. Validation logic
```

#### Performance Issues
```bash
# Profile component performance
npm run dev

# Use React DevTools Profiler:
# 1. Record interactions
# 2. Check render times
# 3. Identify slow components
# 4. Optimize re-renders
```

### Memory Issues

#### Clear Component State
```bash
# Reset application state
# Refresh browser: Ctrl+F5 (Windows) / Cmd+Shift+R (macOS)

# Clear React DevTools data:
# React DevTools > Components > Reset
```

#### Clear Node.js Cache
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Clear npm cache
npm cache clean --force
```
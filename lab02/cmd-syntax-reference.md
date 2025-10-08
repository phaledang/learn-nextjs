# Command Syntax Reference - Lab 02

## Overview
This lab builds upon Lab 01 and focuses on Next.js routing, components, and development workflow. The commands are similar to Lab 01 with additional development and debugging commands.

## Commands Used

### Development Server Commands

#### `npm run dev`
Starts the Next.js development server with hot reloading.

**Syntax:**
```bash
npm run dev [-- options]
```

**Examples:**
```bash
# Start development server
npm run dev

# Start on custom port
npm run dev -- --port 3001

# Start with experimental features
npm run dev -- --experimental-app
```

**Features in this lab:**
- Automatic page routing detection
- Hot reloading for component changes
- Error boundaries and debugging
- TypeScript compilation

### `cd` (Change Directory)
Navigate between project directories and lab folders.

**Examples for this lab:**
```bash
# Navigate to lab02 starter
cd lab02/starter

# Navigate to project directory
cd my-nextjs-app

# Navigate between component directories
cd app/components
cd app/about
```

### Build and Production Commands

#### `npm run build`
Creates optimized production build with routing validation.

**What it validates in this lab:**
- All page routes are properly configured
- Component imports are correct
- TypeScript compilation succeeds
- No routing conflicts exist

#### `npm run start`
Starts production server to test routing in production mode.

**Testing routes:**
```bash
npm run build
npm run start
# Test routes: /, /about, component interactions
```

### Linting and Code Quality

#### `npm run lint`
Checks code quality with focus on React/Next.js best practices.

**Examples:**
```bash
# Check all files
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Check specific directories
npm run lint app/components
```

**What it checks in this lab:**
- React component structure
- Proper import/export statements
- TypeScript type definitions
- Next.js routing conventions

## Next.js Specific Commands

### File Operations
These aren't CLI commands but file operations you'll perform:

#### Creating Pages
```bash
# App Router structure (used in this lab)
app/
├── page.tsx          # Home page (/)
├── about/
│   └── page.tsx      # About page (/about)
└── layout.tsx        # Layout wrapper
```

#### Creating Components
```bash
# Component structure
app/components/
├── Header.tsx
├── Footer.tsx
└── Counter.tsx
```

## Development Workflow Commands

### Typical Development Session
```bash
# 1. Navigate to project
cd lab02/starter/my-nextjs-app

# 2. Start development server
npm run dev

# 3. In another terminal: watch for linting issues
npm run lint -- --watch

# 4. Test build occasionally
npm run build
```

### Testing Navigation
```bash
# Start development server
npm run dev

# Test these URLs in browser:
# http://localhost:3000/ (home page)
# http://localhost:3000/about (about page)
```

## Debugging Commands

### TypeScript Checking
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Watch mode for TypeScript
npx tsc --noEmit --watch
```

### Component Testing
```bash
# Start dev server and check console for errors
npm run dev

# Check component rendering
# Open browser developer tools (F12)
# Check Console tab for React warnings
```

### Route Debugging
```bash
# Build to check for routing issues
npm run build

# Look for build errors related to:
# - Missing page.tsx files
# - Incorrect component exports
# - TypeScript errors in routes
```

## File Structure Commands

### Creating New Pages
```bash
# Create new directory for route
mkdir app/new-page

# Create page component (manual file creation)
# Create app/new-page/page.tsx
```

### Creating Components
```bash
# Navigate to components directory
cd app/components

# Create new component file (manual)
# Create ComponentName.tsx
```

## Git Commands (if using version control)

### Basic Git Workflow
```bash
# Initialize git repository
git init

# Add files
git add .

# Commit changes
git commit -m "Lab 02: Add routing and components"

# Check status
git status

# View changes
git diff
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000   # Windows
lsof -i :3000                  # macOS/Linux

# Kill the process
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # macOS/Linux
```

### Clear Next.js Cache
```bash
# Delete .next directory
rm -rf .next                   # macOS/Linux
rmdir /s .next                 # Windows

# Restart development server
npm run dev
```

### Component Import Issues
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Common fixes:
# - Check file extensions (.tsx for React components)
# - Verify export/import statements
# - Check file paths and case sensitivity
```

## Performance Monitoring

### Development Performance
```bash
# Start with performance monitoring
npm run dev

# Check bundle sizes during build
npm run build
# Look for bundle analysis output
```

### Production Testing
```bash
# Build and test performance
npm run build
npm run start

# Test with browser dev tools:
# - Network tab for loading times
# - Performance tab for rendering
# - Lighthouse for overall performance
```
# Command Syntax Reference - Lab 01

## Overview
This lab uses various command-line tools to create and manage a Next.js project. Below are the detailed explanations of all commands used in this lab.

## Commands Used

### `npx create-next-app@latest`

Creates a new Next.js application using the latest version of the create-next-app tool.

**Syntax:**
```bash
npx create-next-app@latest [project-name] [options]
```

**Examples:**
```bash
# Create with interactive prompts
npx create-next-app@latest my-nextjs-app

# Create with preset options
npx create-next-app@latest my-nextjs-app --typescript --eslint --app --no-src-dir
```

**Options:**
- `--typescript` or `--ts`: Initialize as a TypeScript project
- `--eslint`: Initialize with ESLint configuration
- `--tailwind`: Initialize with Tailwind CSS
- `--app`: Use App Router (recommended)
- `--src-dir`: Initialize inside a `src/` directory
- `--import-alias <alias>`: Specify import alias (default: "@/*")
- `--no-*`: Disable specific features (e.g., `--no-eslint`)

**What it does:**
- Downloads and installs the latest Next.js template
- Sets up a complete project structure
- Installs necessary dependencies
- Configures build tools and linting

### `cd` (Change Directory)

Navigate between directories in the file system.

**Syntax:**
```bash
cd <directory-path>
```

**Examples:**
```bash
# Navigate to a subdirectory
cd my-nextjs-app

# Navigate to parent directory
cd ..

# Navigate to home directory
cd ~

# Navigate to specific path
cd /path/to/directory
```

### `npm run dev`

Starts the Next.js development server.

**Syntax:**
```bash
npm run dev [-- options]
```

**Examples:**
```bash
# Start development server (default port 3000)
npm run dev

# Start on specific port
npm run dev -- --port 3001

# Start with turbo mode
npm run dev --turbo
```

**What it does:**
- Starts the development server on http://localhost:3000
- Enables hot reloading for instant updates
- Provides error reporting and debugging tools
- Compiles TypeScript and processes CSS

### `npm run build`

Builds the application for production deployment.

**Syntax:**
```bash
npm run build
```

**What it does:**
- Creates an optimized production build
- Generates static assets
- Optimizes JavaScript bundles
- Performs type checking (TypeScript)
- Runs ESLint checks

### `npm run start`

Starts the production server (requires a build first).

**Syntax:**
```bash
npm run start [-- options]
```

**Examples:**
```bash
# Start production server
npm run start

# Start on specific port
npm run start -- --port 3001
```

**Prerequisites:**
- Must run `npm run build` first

### `npm run lint`

Runs ESLint to check for code quality issues.

**Syntax:**
```bash
npm run lint [-- options]
```

**Examples:**
```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

**What it does:**
- Checks code for style and error issues
- Enforces coding standards
- Reports potential problems

## Common Command Patterns

### Project Setup
```bash
# 1. Create new project
npx create-next-app@latest my-app

# 2. Navigate to project
cd my-app

# 3. Start development
npm run dev
```

### Development Workflow
```bash
# Start development server
npm run dev

# In another terminal: run linting
npm run lint

# Build for testing
npm run build
```

### Production Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Platform-Specific Notes

### Windows (PowerShell/Command Prompt)
- Use `cd` for navigation
- Paths use backslashes (`\`) but forward slashes (`/`) also work
- Some commands may require administrative privileges

### macOS/Linux
- Use `cd` for navigation
- Paths use forward slashes (`/`)
- May need `sudo` for global installations

## Troubleshooting Commands

### Clear npm cache
```bash
npm cache clean --force
```

### Reinstall dependencies
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
```

### Check Node.js version
```bash
node --version
npm --version
```

### Kill process on port (if port is occupied)
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```
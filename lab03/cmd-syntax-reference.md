# Command Syntax Reference - Lab 03

## Overview
This lab introduces Tailwind CSS to the Next.js project. It includes commands for installing and configuring Tailwind CSS, along with development and build processes specific to CSS processing.

## Commands Used

### Tailwind CSS Installation

#### `npm install -D tailwindcss postcss autoprefixer`
Installs Tailwind CSS and its dependencies as development dependencies.

**Syntax:**
```bash
npm install -D <package1> <package2> <package3>
```

**What each package does:**
- `tailwindcss`: The core Tailwind CSS framework
- `postcss`: CSS processing tool (required by Tailwind)
- `autoprefixer`: Adds vendor prefixes automatically

**Alternative installations:**
```bash
# Install specific versions
npm install -D tailwindcss@3.3.6 postcss@8.4.32 autoprefixer@10.4.16

# Install with yarn
yarn add -D tailwindcss postcss autoprefixer

# Install with pnpm
pnpm add -D tailwindcss postcss autoprefixer
```

#### `npx tailwindcss init -p`
Initializes Tailwind CSS configuration files.

**Syntax:**
```bash
npx tailwindcss init [options]
```

**Options:**
- `-p, --postcss`: Create PostCSS config file
- `--full`: Generate full config file with all defaults
- `--esm`: Generate config file as ES module

**Examples:**
```bash
# Basic initialization with PostCSS
npx tailwindcss init -p

# Full configuration file
npx tailwindcss init --full

# TypeScript config file
npx tailwindcss init --ts

# Custom filename
npx tailwindcss init tailwind.config.custom.js
```

**Files created:**
- `tailwind.config.js`: Tailwind configuration
- `postcss.config.js`: PostCSS configuration (with `-p` flag)

### Development Commands

#### `npm run dev`
Starts development server with Tailwind CSS processing.

**Enhanced features for this lab:**
- Real-time CSS compilation
- Tailwind utility class processing
- CSS purging in development
- Hot reloading for CSS changes

**Testing Tailwind setup:**
```bash
npm run dev
# Check browser for Tailwind styles
# Verify CSS classes are applying correctly
```

#### `npm run build`
Builds project with optimized Tailwind CSS.

**Tailwind-specific optimizations:**
- Removes unused CSS classes (purging)
- Minifies CSS output
- Optimizes bundle size

**Build analysis:**
```bash
npm run build
# Look for CSS bundle size in output
# Check for Tailwind-related build warnings
```

### Tailwind Utility Commands

#### `npx tailwindcss -i input.css -o output.css`
Manual Tailwind CSS compilation (alternative to build process).

**Syntax:**
```bash
npx tailwindcss -i <input-file> -o <output-file> [options]
```

**Options:**
- `--watch`: Watch for changes
- `--minify`: Minify output
- `--config`: Specify config file

**Examples:**
```bash
# Basic compilation
npx tailwindcss -i ./app/globals.css -o ./dist/output.css

# Watch mode
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch

# Minified output
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --minify
```

### CSS Development Workflow

#### Development with CSS Changes
```bash
# Start development server
npm run dev

# In another terminal: watch Tailwind compilation
npx tailwindcss -i ./app/globals.css -o ./temp/debug.css --watch
```

#### CSS Debugging Commands
```bash
# Check PostCSS configuration
npx postcss --version

# Verify Tailwind installation
npx tailwindcss --help

# Test Tailwind config
node -e "console.log(require('./tailwind.config.js'))"
```

## Configuration Commands

### Tailwind Configuration Testing

#### Validate Configuration
```bash
# Check Tailwind config syntax
node -c tailwind.config.js

# Test content paths
npx tailwindcss build --content="./app/**/*.{js,ts,jsx,tsx}"
```

#### PostCSS Configuration
```bash
# Verify PostCSS config
npx postcss --version
node -c postcss.config.js
```

### Dark Mode Configuration

#### Testing Dark Mode (if configured)
```bash
# Build with dark mode support
npm run build

# Test in browser with system dark mode
# Or add class-based dark mode toggle
```

## CSS Processing Commands

### Manual CSS Compilation

#### Compile Specific Files
```bash
# Compile single file
npx tailwindcss build app/globals.css -o dist/styles.css

# Compile with specific config
npx tailwindcss build -c ./tailwind.config.js -i app/globals.css -o dist/styles.css
```

#### Watch Mode for Development
```bash
# Watch for CSS changes
npx tailwindcss -i app/globals.css -o dist/output.css --watch

# Watch with minification
npx tailwindcss -i app/globals.css -o dist/output.css --watch --minify
```

## Component Development Commands

### Creating Styled Components

#### Development Workflow
```bash
# 1. Start development server
npm run dev

# 2. Create component files
# (Manual file creation in app/components/)

# 3. Test component styling
# Verify in browser with dev tools

# 4. Build to check production CSS
npm run build
```

#### Component Testing
```bash
# Start dev server and test components
npm run dev

# Check CSS bundle size
npm run build
# Look for CSS optimization in build output
```

## Responsive Design Testing

### Browser Testing Commands
```bash
# Start development server
npm run dev

# Test responsive breakpoints:
# - sm: 640px and up
# - md: 768px and up
# - lg: 1024px and up
# - xl: 1280px and up
# - 2xl: 1536px and up
```

### Mobile Testing
```bash
# Use browser dev tools device emulation
# Or test with local network:

# Find local IP
ipconfig                    # Windows
ifconfig                   # macOS/Linux

# Start server on all interfaces
npm run dev -- --hostname 0.0.0.0
# Access via http://[local-ip]:3000 on mobile
```

## Build Optimization Commands

### CSS Bundle Analysis

#### Check Bundle Sizes
```bash
# Build with analysis
npm run build

# Alternative: Use bundle analyzer
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

#### Purge Testing
```bash
# Build and check CSS size
npm run build
# Look for CSS file sizes in build output

# Manual purge testing
npx tailwindcss build --purge app/**/*.{js,ts,jsx,tsx} -i app/globals.css -o dist/purged.css
```

## Troubleshooting Commands

### Common Issues

#### Tailwind Not Loading
```bash
# Check installation
npm list tailwindcss

# Verify config file
cat tailwind.config.js

# Check PostCSS config
cat postcss.config.js

# Restart development server
npm run dev
```

#### CSS Not Applying
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Check CSS imports in layout.tsx
# Verify globals.css has Tailwind directives
```

#### Build Errors
```bash
# Check for PostCSS errors
npm run build

# Verify all CSS files are valid
npx postcss app/globals.css --use autoprefixer --no-map

# Check Tailwind config
npx tailwindcss build --config tailwind.config.js
```

### Performance Issues

#### Large CSS Bundle
```bash
# Check which classes are being used
npm run build

# Analyze CSS content
npx tailwindcss build -i app/globals.css -o debug.css
cat debug.css | wc -l  # Count lines (macOS/Linux)
```

#### Slow Build Times
```bash
# Build with timing information
npm run build

# Check for large CSS processing
# Consider reducing content scan paths in tailwind.config.js
```
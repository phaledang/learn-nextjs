# Node.js Package Reference - Lab 01

## Overview
This lab introduces the fundamental Node.js packages and dependencies required for a basic Next.js application. These packages form the foundation for React-based web development with Next.js.

## Core Dependencies

### `next` (v14.0.4)
**Description:** The Next.js framework for React applications.

**Purpose:**
- Provides the Next.js framework core functionality
- Enables React Server Components
- Handles routing, bundling, and optimization
- Supports both client-side and server-side rendering

**Key Features:**
- App Router architecture
- File-based routing system
- Built-in optimization (images, fonts, scripts)
- API routes for backend functionality
- TypeScript support out of the box

**Installation:**
```bash
npm install next
```

**Usage in project:**
- Configured in `package.json` scripts
- Used for development server (`next dev`)
- Used for production builds (`next build`)
- Used for production server (`next start`)

### `react` (^18)
**Description:** A JavaScript library for building user interfaces.

**Purpose:**
- Core React library for component-based UI development
- Provides React hooks (useState, useEffect, etc.)
- Enables component composition and state management
- Required dependency for Next.js applications

**Key Features:**
- Component-based architecture
- Virtual DOM for efficient updates
- React Hooks for state and lifecycle management
- Server Components support (React 18+)
- Concurrent features for better performance

**Installation:**
```bash
npm install react
```

**Usage in project:**
- Import React components: `import React from 'react'`
- Use React hooks: `import { useState, useEffect } from 'react'`
- Create functional components
- JSX syntax for component rendering

### `react-dom` (^18)
**Description:** React DOM rendering library for web applications.

**Purpose:**
- Provides DOM-specific methods for React
- Handles rendering React components to the DOM
- Manages hydration for server-side rendered applications
- Required for web-based React applications

**Key Features:**
- DOM rendering methods (`createRoot`, `hydrateRoot`)
- Client-side hydration support
- Portal creation for rendering outside component tree
- Strict mode support for development

**Installation:**
```bash
npm install react-dom
```

**Usage in project:**
- Automatically used by Next.js for rendering
- Used in custom `_app.tsx` or `layout.tsx` if needed
- Required for React components to render in browser

## Development Dependencies

### `typescript` (^5)
**Description:** TypeScript compiler and language support.

**Purpose:**
- Adds static type checking to JavaScript
- Provides better IDE support and autocomplete
- Catches errors at compile time
- Enhances code maintainability and readability

**Key Features:**
- Static type checking
- Modern JavaScript features support
- Better refactoring tools
- Enhanced IDE integration
- Gradual adoption in existing projects

**Installation:**
```bash
npm install --save-dev typescript
```

**Usage in project:**
- Type checking: `npx tsc --noEmit`
- Configuration in `tsconfig.json`
- Used for `.ts` and `.tsx` file compilation
- Integrated with Next.js build process

### `@types/node` (^20)
**Description:** TypeScript type definitions for Node.js.

**Purpose:**
- Provides TypeScript types for Node.js APIs
- Enables type checking for server-side code
- Required for Node.js built-in modules typing
- Essential for API routes and server components

**Key Features:**
- Complete Node.js API type coverage
- File system, HTTP, path, and other module types
- Process and environment variable types
- Buffer and stream types

**Installation:**
```bash
npm install --save-dev @types/node
```

**Usage in project:**
- Automatic TypeScript support for Node.js APIs
- Used in API routes (`app/api/*.ts`)
- Server components type checking
- Environment variable typing

### `@types/react` (^18)
**Description:** TypeScript type definitions for React.

**Purpose:**
- Provides TypeScript types for React library
- Enables type checking for React components and hooks
- Required for TypeScript React development
- Ensures type safety in component props and state

**Key Features:**
- React component type definitions
- Hook types (useState, useEffect, etc.)
- Event handler types
- Props and state interface support
- Context and ref types

**Installation:**
```bash
npm install --save-dev @types/react
```

**Usage in project:**
- Component props typing: `interface Props { name: string }`
- Hook usage: `const [state, setState] = useState<string>('')`
- Event handlers: `onClick: (event: MouseEvent) => void`
- Component typing: `const Component: React.FC<Props>`

### `@types/react-dom` (^18)
**Description:** TypeScript type definitions for React DOM.

**Purpose:**
- Provides TypeScript types for React DOM library
- Enables type checking for DOM-specific React features
- Required for TypeScript projects using React DOM
- Supports portal and hydration types

**Key Features:**
- DOM rendering method types
- Portal types for rendering outside component tree
- Hydration method types
- DOM-specific event types

**Installation:**
```bash
npm install --save-dev @types/react-dom
```

**Usage in project:**
- Automatic typing for React DOM features
- Portal creation type support
- DOM event handler types
- Hydration and rendering method types

### `eslint` (^8)
**Description:** JavaScript and TypeScript linting utility.

**Purpose:**
- Identifies and reports code quality issues
- Enforces coding standards and best practices
- Catches potential bugs and errors
- Maintains consistent code style across team

**Key Features:**
- Configurable rules for code quality
- Plugin ecosystem for frameworks
- Auto-fixing capabilities
- Integration with IDEs and build tools
- Custom rule creation support

**Installation:**
```bash
npm install --save-dev eslint
```

**Usage in project:**
- Linting: `npm run lint`
- Auto-fix: `npm run lint -- --fix`
- Configuration in `.eslintrc.json`
- IDE integration for real-time feedback

### `eslint-config-next` (14.0.4)
**Description:** ESLint configuration optimized for Next.js projects.

**Purpose:**
- Provides pre-configured ESLint rules for Next.js
- Includes React and React Hooks rules
- Optimized for Next.js best practices
- Reduces configuration overhead

**Key Features:**
- Next.js specific linting rules
- React and React Hooks rule sets
- TypeScript support included
- Performance and accessibility rules
- SEO and Core Web Vitals rules

**Installation:**
```bash
npm install --save-dev eslint-config-next
```

**Usage in project:**
- Configured in `.eslintrc.json`: `"extends": ["next/core-web-vitals"]`
- Automatic rule enforcement
- Next.js best practices validation
- Integration with `npm run lint`

## Package.json Scripts Explained

### `"dev": "next dev"`
**Purpose:** Starts the Next.js development server
- Enables hot reloading for instant updates
- Runs on http://localhost:3000 by default
- Provides error reporting and debugging tools
- Compiles TypeScript and processes CSS automatically

### `"build": "next build"`
**Purpose:** Creates an optimized production build
- Generates static assets and optimized JavaScript bundles
- Performs TypeScript compilation and type checking
- Optimizes images and other assets
- Creates route manifests and prerendered pages

### `"start": "next start"`
**Purpose:** Starts the production server
- Serves the built application from `.next` directory
- Requires `npm run build` to be run first
- Optimized for production performance
- Runs on the port specified by PORT environment variable

### `"lint": "next lint"`
**Purpose:** Runs ESLint to check code quality
- Checks all TypeScript and JavaScript files
- Reports code quality issues and potential bugs
- Can auto-fix many issues with `--fix` flag
- Integrates with Next.js ESLint configuration

## Version Dependencies and Compatibility

### React 18 Features Used
- **Server Components**: Default in App Router
- **Concurrent Features**: Automatic optimization
- **Suspense**: Built-in loading states
- **Streaming**: Progressive page rendering

### TypeScript Integration
- **Zero Configuration**: Works out of the box
- **Incremental Adoption**: Can be added gradually
- **Next.js Integration**: Automatic TypeScript compilation
- **Type Checking**: Build-time error detection

### ESLint Integration
- **Next.js Rules**: Framework-specific best practices
- **React Rules**: Component and hook best practices
- **TypeScript Rules**: Type safety enforcement
- **Accessibility Rules**: WCAG compliance checking

## Common Package Patterns

### Installing Additional Packages
```bash
# Add a new dependency
npm install package-name

# Add a development dependency
npm install --save-dev package-name

# Add with specific version
npm install package-name@1.2.3
```

### Package Management Commands
```bash
# List installed packages
npm list

# Check for outdated packages
npm outdated

# Update packages
npm update

# Remove packages
npm uninstall package-name
```

### Package.json Maintenance
```bash
# Check package vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Clean install (removes node_modules)
rm -rf node_modules package-lock.json
npm install
```

## Best Practices

### Version Management
- Use exact versions for critical dependencies
- Regular updates for security patches
- Test thoroughly after major version updates
- Use `package-lock.json` for consistent installs

### Development Workflow
- Install types for all JavaScript libraries
- Use ESLint for code quality
- Configure TypeScript strictly
- Regular dependency audits for security

### Performance Considerations
- Only install necessary packages
- Use development dependencies appropriately
- Regular bundle size analysis
- Tree shaking compatibility checks

## Troubleshooting Common Issues

### TypeScript Issues
```bash
# Clear TypeScript cache
rm -rf .next
npx tsc --build --clean

# Regenerate types
npm run build
```

### Package Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Version Conflicts
```bash
# Check for conflicts
npm ls

# Fix peer dependency warnings
npm install --legacy-peer-deps
```
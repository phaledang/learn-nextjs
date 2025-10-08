# Node.js Package Reference - Lab 02

## Overview
This lab builds upon Lab 01's foundation and focuses on the same core Next.js packages while exploring routing, components, and development workflow. The package dependencies remain consistent with Lab 01, emphasizing the framework's built-in capabilities.

## Core Dependencies (Same as Lab 01)

### `next` (v14.0.4)
**Enhanced usage in Lab 02:**
- **App Router**: File-based routing with `app/` directory structure
- **Page Components**: Creating routes with `page.tsx` files
- **Layout Components**: Shared layouts with `layout.tsx` files
- **Dynamic Routing**: Using `[id]` folder naming convention

**New concepts explored:**
```typescript
// app/layout.tsx - Root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/about/page.tsx - Route page
export default function About() {
  return <h1>About Page</h1>
}
```

### `react` (^18)
**Enhanced usage in Lab 02:**
- **Component Composition**: Building reusable UI components
- **Props and Children**: Passing data between components
- **Event Handling**: Interactive user interfaces
- **State Management**: Basic useState hook implementation

**Key patterns introduced:**
```typescript
// Component with props
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}

// Component with state
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### `react-dom` (^18)
**Enhanced usage in Lab 02:**
- **Component Rendering**: Automatic handling by Next.js App Router
- **Hydration**: Server-side rendering with client-side interactivity
- **Event System**: DOM event handling in React components

## Development Dependencies (Same as Lab 01)

### `typescript` (^5)
**Enhanced usage in Lab 02:**
- **Component Type Safety**: Interface definitions for props
- **Event Handler Types**: Properly typed event handlers
- **Children Types**: React.ReactNode for component children
- **State Types**: Typed useState hooks

**Common type patterns:**
```typescript
// Component props interface
interface HeaderProps {
  title: string;
  navigation?: NavigationItem[];
}

// Event handler types
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // Handle click
};

// State with types
const [user, setUser] = useState<User | null>(null);
```

### `@types/node` (^20)
**Enhanced usage in Lab 02:**
- **Module Resolution**: Typing for import/export statements
- **Path Utilities**: When working with file-based routing
- **Environment Variables**: Process.env typing

### `@types/react` (^18)
**Enhanced usage in Lab 02:**
- **Component Types**: React.FC, React.Component interfaces
- **Hook Types**: useState, useEffect, and other hook signatures
- **Event Types**: MouseEvent, ChangeEvent, FormEvent
- **Props Types**: PropsWithChildren, ComponentProps

**Essential React types:**
```typescript
// Functional component with props
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
};

// Event handler types
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

### `@types/react-dom` (^18)
**Enhanced usage in Lab 02:**
- **Render Types**: Types for React DOM rendering methods
- **Portal Types**: If using React portals for modals
- **Server-Side Rendering**: Hydration-related types

### `eslint` (^8)
**Enhanced usage in Lab 02:**
- **Component Linting**: React component best practices
- **Hook Rules**: React Hooks rules enforcement
- **Import/Export Rules**: Module system best practices
- **Accessibility Rules**: Basic a11y checks

### `eslint-config-next` (14.0.4)
**Enhanced usage in Lab 02:**
- **React Rules**: Component and JSX best practices
- **Next.js Rules**: App Router and routing best practices
- **Performance Rules**: Optimization recommendations
- **Import Rules**: Proper import/export patterns

**Rules specifically useful in Lab 02:**
- `react/jsx-key`: Ensure keys in lists
- `react-hooks/rules-of-hooks`: Proper hook usage
- `@next/next/no-html-link-for-pages`: Use Next.js Link component
- `@next/next/no-img-element`: Use Next.js Image component

## Component Development Patterns

### File Structure Patterns
```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── about/
│   └── page.tsx       # About page
└── components/
    ├── Header.tsx     # Header component
    ├── Footer.tsx     # Footer component
    └── Counter.tsx    # Interactive component
```

### Component Export Patterns
```typescript
// Named export (recommended for reusable components)
export function Header({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

// Default export (required for page components)
export default function HomePage() {
  return <div>Home Page</div>;
}

// Component with multiple exports
export function Button() { /* ... */ }
export function ButtonGroup() { /* ... */ }
export default Button;
```

### Props and TypeScript Patterns
```typescript
// Basic props interface
interface ComponentProps {
  title: string;
  description?: string;
  onClick: () => void;
}

// Props with children
interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

// Props extending HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
}
```

## Development Workflow Enhancements

### Package.json Scripts (Enhanced for Component Development)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### TypeScript Configuration for Components
**tsconfig.json enhancements:**
```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./app/components/*"]
    }
  }
}
```

### ESLint Configuration for Components
**.eslintrc.json enhancements:**
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "react/jsx-sort-props": "warn",
    "react/self-closing-comp": "warn",
    "react/jsx-boolean-value": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

## Common Component Libraries (Optional Extensions)

While Lab 02 focuses on built-in capabilities, these packages are commonly added:

### UI Component Libraries
```bash
# Material-UI
npm install @mui/material @emotion/react @emotion/styled

# Chakra UI
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

# Ant Design
npm install antd

# React Bootstrap
npm install react-bootstrap bootstrap
```

### Styling Solutions
```bash
# Styled Components
npm install styled-components
npm install --save-dev @types/styled-components

# Emotion
npm install @emotion/react @emotion/styled

# CSS Modules (built into Next.js)
# No additional packages needed
```

## Testing Packages (Development Enhancement)

### Basic Testing Setup
```bash
# Jest and React Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev jest-environment-jsdom

# User Event Testing
npm install --save-dev @testing-library/user-event
```

### Component Testing Patterns
```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

test('renders header with title', () => {
  render(<Header title="Test Title" />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

## Performance Considerations

### Bundle Size Management
- **Tree Shaking**: Only import what you use
- **Dynamic Imports**: Load components lazily when needed
- **Bundle Analysis**: Use `@next/bundle-analyzer`

### Component Performance
```typescript
// React.memo for preventing unnecessary re-renders
export const ExpensiveComponent = React.memo(function ExpensiveComponent({ 
  data 
}: { 
  data: string 
}) {
  return <div>{data}</div>;
});

// useCallback for stable function references
const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

## Common Issues and Solutions

### Import/Export Issues
```typescript
// Correct: Named import/export
import { Header } from './components/Header';
export { Header } from './components/Header';

// Correct: Default import/export
import Header from './components/Header';
export default Header;

// Avoid: Mixed patterns that cause confusion
```

### TypeScript Component Issues
```typescript
// Issue: Missing children type
interface Props {
  title: string;
  // Missing: children?: React.ReactNode;
}

// Solution: Include children type
interface Props {
  title: string;
  children?: React.ReactNode;
}
```

### ESLint Common Fixes
```typescript
// Issue: Missing key prop in lists
items.map(item => <div>{item.name}</div>);

// Solution: Add key prop
items.map(item => <div key={item.id}>{item.name}</div>);

// Issue: Unused variables
const Component = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>; // prop2 is unused
};

// Solution: Remove unused props or prefix with underscore
const Component = ({ prop1, _prop2 }) => {
  return <div>{prop1}</div>;
};
```

## Development Tools Integration

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

### Browser Developer Tools
- React Developer Tools
- Next.js DevTools (built-in)
- TypeScript debugging support

## Best Practices for Lab 02

### Component Organization
1. **One component per file**
2. **Descriptive file names**
3. **Consistent naming conventions**
4. **Proper TypeScript interfaces**
5. **ESLint compliance**

### Development Workflow
1. **Start development server**: `npm run dev`
2. **Write components with TypeScript**
3. **Test in browser with hot reload**
4. **Check with ESLint**: `npm run lint`
5. **Build for validation**: `npm run build`

### Code Quality
1. **Use TypeScript strictly**
2. **Follow ESLint rules**
3. **Write self-documenting code**
4. **Use consistent formatting**
5. **Add comments for complex logic**
# Node.js Package Reference - Lab 03

## Overview
This lab introduces Tailwind CSS to the Next.js project, adding utility-first styling capabilities. The core Next.js packages remain the same, with additional CSS processing dependencies for Tailwind integration.

## Core Dependencies (Inherited from Previous Labs)

### `next` (v14.0.4)
**Enhanced for CSS processing:**
- **PostCSS Integration**: Built-in PostCSS support for Tailwind
- **CSS Optimization**: Automatic CSS minification and optimization
- **Purging**: Unused CSS removal in production builds
- **Hot Reloading**: CSS changes reflected instantly during development

### `react` (^18) & `react-dom` (^18)
**Same as previous labs** - No changes for Tailwind integration.

## New CSS Processing Dependencies

### `tailwindcss` (Latest)
**Description:** A utility-first CSS framework for rapidly building custom designs.

**Purpose:**
- Provides utility classes for styling components
- Enables rapid UI development without writing custom CSS
- Offers design system consistency
- Supports responsive design and dark mode

**Key Features:**
- **Utility Classes**: Predefined classes for common styles
- **Responsive Design**: Built-in responsive prefixes (sm:, md:, lg:, xl:, 2xl:)
- **Dark Mode**: Easy dark mode implementation
- **Customization**: Extensive configuration options
- **Tree Shaking**: Removes unused styles in production
- **Component Extraction**: Create reusable component classes

**Installation:**
```bash
npm install -D tailwindcss
```

**Configuration (tailwind.config.js):**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Usage Examples:**
```tsx
// Basic utility classes
<div className="bg-blue-500 text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold">Title</h1>
  <p className="text-sm opacity-75">Description</p>
</div>

// Responsive design
<div className="w-full md:w-1/2 lg:w-1/3">
  <img className="w-full h-64 object-cover" src="image.jpg" alt="Image" />
</div>

// Interactive states
<button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 
                   transition-colors duration-200 px-4 py-2 rounded">
  Click me
</button>
```

### `postcss` (Latest)
**Description:** A tool for transforming CSS with JavaScript plugins.

**Purpose:**
- Processes CSS files with plugins
- Required by Tailwind CSS for compilation
- Enables CSS transformations and optimizations
- Integrates with Next.js build process

**Key Features:**
- **Plugin Ecosystem**: Extensive plugin system
- **CSS Parsing**: Parses CSS into JavaScript objects
- **Transformations**: Applies various CSS transformations
- **Autoprefixer Integration**: Automatic vendor prefixing
- **Next.js Integration**: Built-in support in Next.js

**Installation:**
```bash
npm install -D postcss
```

**Configuration (postcss.config.js):**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### `autoprefixer` (Latest)
**Description:** PostCSS plugin to parse CSS and add vendor prefixes automatically.

**Purpose:**
- Adds vendor prefixes to CSS properties
- Ensures cross-browser compatibility
- Uses Can I Use database for browser support
- Automatically handles browser-specific CSS properties

**Key Features:**
- **Automatic Prefixing**: Adds -webkit-, -moz-, -ms- prefixes
- **Browser Support**: Configurable browser target support
- **Can I Use Integration**: Uses real browser usage data
- **Dead Code Removal**: Removes unnecessary prefixes

**Installation:**
```bash
npm install -D autoprefixer
```

**Browser Support Configuration (.browserslistrc):**
```
> 1%
last 2 versions
not dead
```

**Example transformations:**
```css
/* Input CSS */
.example {
  display: flex;
  transition: all 0.3s ease;
  user-select: none;
}

/* Output CSS (with autoprefixer) */
.example {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
```

## Development Dependencies (Same as Previous Labs)

### `typescript` (^5)
**Enhanced with Tailwind CSS:**
- **Class Name IntelliSense**: TypeScript support for Tailwind classes
- **Type Safety**: Typed component props with className
- **Plugin Support**: Tailwind CSS IntelliSense VSCode extension

**TypeScript patterns with Tailwind:**
```typescript
// Component with Tailwind classes
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Button({ variant, size, children, className = '' }: ButtonProps) {
  const baseClasses = 'font-medium rounded transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
```

### ESLint Configuration
**Enhanced for CSS-in-JS patterns:**
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "react/no-unknown-property": ["error", { "ignore": ["css"] }]
  }
}
```

## CSS Integration Patterns

### Global CSS Setup
**app/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold text-gray-900;
  }
}

/* Custom component styles */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
  }
}

/* Custom utility styles */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Component-Level Styling
```tsx
// Using Tailwind utility classes directly
export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

// Using @apply directive in CSS modules
// styles.module.css
.card {
  @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
}

// Component using CSS modules
import styles from './Card.module.css';

export function Card({ children }: CardProps) {
  return <div className={styles.card}>{children}</div>;
}
```

## Tailwind CSS Plugins (Optional Extensions)

### Official Plugins
```bash
# Forms plugin for better form styling
npm install -D @tailwindcss/forms

# Typography plugin for content styling
npm install -D @tailwindcss/typography

# Aspect ratio plugin
npm install -D @tailwindcss/aspect-ratio

# Line clamp plugin
npm install -D @tailwindcss/line-clamp
```

### Plugin Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### Plugin Usage Examples
```tsx
// Typography plugin
<article className="prose prose-lg max-w-none">
  <h1>Article Title</h1>
  <p>Article content with automatic typography styling...</p>
</article>

// Forms plugin
<input 
  type="email" 
  className="form-input rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
  placeholder="Enter email"
/>

// Aspect ratio plugin
<div className="aspect-w-16 aspect-h-9">
  <img src="image.jpg" alt="Image" className="object-cover" />
</div>
```

## Development Tools and Utilities

### Tailwind CSS IntelliSense (VS Code Extension)
**Features:**
- Autocomplete for class names
- CSS previews on hover
- Linting for invalid class names
- Quick documentation access

**Configuration (.vscode/settings.json):**
```json
{
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.experimental.classRegex": [
    "className[\\s]*=[\\s]*['\"`]([^'\"`]*)['\"`]"
  ]
}
```

### Prettier Plugin for Tailwind
```bash
# Install Prettier plugin for class sorting
npm install -D prettier-plugin-tailwindcss
```

**Configuration (.prettierrc):**
```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.js"
}
```

## Build Process Integration

### Next.js Configuration Enhancement
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
}

module.exports = nextConfig;
```

### PostCSS Processing Flow
1. **Development**: Tailwind processes all utility classes
2. **Production**: Unused CSS is purged based on content config
3. **Optimization**: CSS is minified and optimized
4. **Autoprefixer**: Vendor prefixes are added

### Build Output Analysis
```bash
# Build with CSS analysis
npm run build

# Look for CSS bundle sizes in output:
# ┌ Static pages
# ├ ○ /                    1.2 kB         142 B
# └ CSS                    8.1 kB         2.3 kB (gzipped)
```

## Performance Considerations

### CSS Bundle Optimization
- **Purging**: Remove unused classes in production
- **Minification**: Compress CSS output
- **Critical CSS**: Inline critical styles
- **Code Splitting**: Split CSS by routes when possible

### Content Configuration Best Practices
```javascript
// Optimized content paths for better purging
module.exports = {
  content: [
    // Include all relevant file types
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts}',
    
    // Exclude unnecessary paths
    '!./node_modules/**/*',
    '!./.next/**/*',
  ],
  // ... rest of config
}
```

### Runtime Performance
```tsx
// Avoid dynamic class names (not purgeable)
const dynamicClass = `text-${color}-500`; // ❌ Bad

// Use complete class names
const className = color === 'blue' ? 'text-blue-500' : 'text-red-500'; // ✅ Good

// Or use safelist in config
// tailwind.config.js
module.exports = {
  safelist: [
    'text-blue-500',
    'text-red-500',
    'text-green-500',
  ],
  // ... rest of config
}
```

## Common Patterns and Best Practices

### Responsive Design Patterns
```tsx
// Mobile-first responsive design
<div className="
  w-full           // Default: full width
  sm:w-1/2         // Small screens: half width
  md:w-1/3         // Medium screens: third width
  lg:w-1/4         // Large screens: quarter width
  xl:w-1/5         // Extra large: fifth width
">
  Content
</div>

// Responsive grid
<div className="
  grid 
  grid-cols-1      // Default: 1 column
  sm:grid-cols-2   // Small: 2 columns
  lg:grid-cols-3   // Large: 3 columns
  gap-4
">
  {items.map(item => <div key={item.id}>{item.content}</div>)}
</div>
```

### Dark Mode Implementation
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  // ... rest of config
}
```

```tsx
// Dark mode component
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-300">Content</p>
</div>

// Dark mode toggle
function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}
```

## Troubleshooting Common Issues

### CSS Not Loading
```bash
# Check PostCSS configuration
cat postcss.config.js

# Verify Tailwind directives in globals.css
head -3 app/globals.css

# Restart development server
npm run dev
```

### Classes Not Working
```bash
# Check content configuration in tailwind.config.js
# Ensure file paths include your component files

# Check for typos in class names
# Use VS Code IntelliSense for validation

# Verify import of globals.css in layout.tsx
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for PostCSS/Tailwind version compatibility
npm list postcss tailwindcss autoprefixer
```

### Performance Issues
```bash
# Analyze CSS bundle size
npm run build

# Check content paths for over-inclusion
# Review safelist configuration
# Consider using CSS modules for complex components
```
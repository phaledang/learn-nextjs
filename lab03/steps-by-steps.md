# Lab 03: Step-by-Step Guide

## Step 1: Install Tailwind CSS

### 1.1 Navigate to your project

```bash
cd your-nextjs-project
```

### 1.2 Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

This creates:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

### 1.3 Configure template paths

Open `tailwind.config.js` and update:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 1.4 Add Tailwind directives

Open `app/globals.css` and replace with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 1.5 Test Tailwind

Update `app/page.tsx`:

```typescript
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-600">
        Hello Tailwind CSS!
      </h1>
      <p className="mt-4 text-gray-600">
        Tailwind is working perfectly
      </p>
    </main>
  )
}
```

Run `npm run dev` and verify Tailwind styles are applied.

---

## Step 2: Build Reusable Button Component

### 2.1 Create Button component

Create `app/components/Button.tsx`:

```typescript
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  disabled = false 
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

### 2.2 Use the Button component

Update `app/page.tsx`:

```typescript
import Button from './components/Button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind Components
      </h1>
      
      <div className="flex gap-4">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="danger">Danger Button</Button>
      </div>
      
      <div className="flex gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </main>
  )
}
```

---

## Step 3: Create Card Component

### 3.1 Create Card component

Create `app/components/Card.tsx`:

```typescript
interface CardProps {
  title: string
  description: string
  imageUrl?: string
  badge?: string
  footer?: React.ReactNode
}

export default function Card({ 
  title, 
  description, 
  imageUrl, 
  badge,
  footer 
}: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        {badge && (
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
            {badge}
          </span>
        )}
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        
        {footer && (
          <div className="border-t pt-4 mt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
```

### 3.2 Use the Card component

Update `app/page.tsx`:

```typescript
import Button from './components/Button'
import Card from './components/Card'

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Tailwind UI Components
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Web Development"
            description="Learn modern web development with Next.js and React"
            badge="Popular"
            footer={<Button variant="primary" size="sm">Learn More</Button>}
          />
          
          <Card
            title="UI Design"
            description="Master Tailwind CSS for beautiful user interfaces"
            badge="New"
            footer={<Button variant="primary" size="sm">Learn More</Button>}
          />
          
          <Card
            title="API Development"
            description="Build robust APIs with Next.js API routes"
            footer={<Button variant="primary" size="sm">Learn More</Button>}
          />
        </div>
      </div>
    </main>
  )
}
```

---

## Step 4: Create Responsive Navigation

### 4.1 Create Navbar component

Create `app/components/Navbar.tsx`:

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              MyApp
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Services
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            <Link href="/services" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Services
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
```

### 4.2 Add Navbar to layout

Update `app/layout.tsx`:

```typescript
import Navbar from './components/Navbar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
```

---

## Step 5: Create Hero Section

### 5.1 Create Hero component

Create `app/components/Hero.tsx`:

```typescript
import Button from './Button'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Welcome to Our Platform
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-blue-100">
            Build amazing applications with Next.js and Tailwind CSS
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Get Started
            </Button>
            <button className="px-6 py-3 text-lg font-semibold border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>
  )
}
```

### 5.2 Add Hero to home page

Update `app/page.tsx`:

```typescript
import Hero from './components/Hero'
import Card from './components/Card'
import Button from './components/Button'

export default function Home() {
  return (
    <>
      <Hero />
      
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Fast Performance"
              description="Built with Next.js for optimal performance and SEO"
              badge="Fast"
              footer={<Button variant="primary" size="sm">Learn More</Button>}
            />
            
            <Card
              title="Beautiful UI"
              description="Styled with Tailwind CSS for modern, responsive design"
              badge="Modern"
              footer={<Button variant="primary" size="sm">Learn More</Button>}
            />
            
            <Card
              title="Easy to Use"
              description="Intuitive components and clear documentation"
              badge="Simple"
              footer={<Button variant="primary" size="sm">Learn More</Button>}
            />
          </div>
        </div>
      </main>
    </>
  )
}
```

---

## Step 6: Implement Dark Mode

### 6.1 Enable dark mode in Tailwind config

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 6.2 Create DarkModeToggle component

Create `app/components/DarkModeToggle.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check localStorage on mount
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      aria-label="Toggle dark mode"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}
```

### 6.3 Add dark mode styles

Update components to support dark mode. Example with Card:

```typescript
export default function Card({ title, description, imageUrl, badge, footer }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* ... */}
      <div className="p-6">
        {badge && (
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-2">
            {badge}
          </span>
        )}
        
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        {/* ... */}
      </div>
    </div>
  )
}
```

---

## 🎉 Congratulations!

You've completed Lab 03! You now understand:
- Tailwind CSS installation and configuration
- Building reusable components
- Responsive design
- Dark mode implementation
- Component styling patterns

## 🚀 Next Steps

Ready for Lab 04? You'll learn about data fetching and API integration!

---

## 📚 Additional Challenges

1. Create an Input component with validation styles
2. Build a Modal component
3. Create a responsive Footer
4. Implement a loading spinner component
5. Build a Badge component library

Need Help? Check the reference files or the `finish/` folder!

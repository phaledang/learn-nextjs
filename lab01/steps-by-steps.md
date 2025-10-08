# Lab 01: Step-by-Step Guide

## Step 1: Create a New Next.js Project

### 1.1 Open your terminal and navigate to the starter folder

```bash
cd starter
```

### 1.2 Create a new Next.js app

```bash
npx create-next-app@latest my-nextjs-app
```

### 1.3 Answer the prompts

- **Would you like to use TypeScript?** → Yes
- **Would you like to use ESLint?** → Yes
- **Would you like to use Tailwind CSS?** → No (we'll add it in Lab 03)
- **Would you like to use `src/` directory?** → No
- **Would you like to use App Router?** → Yes
- **Would you like to customize the default import alias?** → No

### 1.4 Navigate into your project

```bash
cd my-nextjs-app
```

### 1.5 Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Next.js welcome page!

---

## Step 2: Explore the Project Structure

### 2.1 Understanding the folder structure

Open the project in your code editor and explore:

```
my-nextjs-app/
├── app/
│   ├── favicon.ico
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── public/               # Static files (images, fonts, etc.)
├── node_modules/         # Project dependencies
├── package.json          # Project metadata and scripts
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # Project documentation
```

### 2.2 Examine the root layout

Open `app/layout.tsx`:

```typescript
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
```

**Key Points:**
- The root layout wraps all pages
- It contains the `<html>` and `<body>` tags
- `children` represents the page content

### 2.3 Examine the home page

Open `app/page.tsx`:

```typescript
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
    </main>
  )
}
```

**Key Points:**
- Each `page.tsx` file represents a route
- The file in `app/page.tsx` is the home page (`/`)
- It's a React component that returns JSX

---

## Step 3: Create Your First Custom Page

### 3.1 Clean up the home page

Replace the contents of `app/page.tsx`:

```typescript
export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to My Next.js App</h1>
      <p>This is my first Next.js application!</p>
      <p>Built during Lab 01 of the Next.js training program.</p>
    </main>
  )
}
```

Save the file and check your browser - the changes should appear automatically (hot reload)!

### 3.2 Update the root layout

Open `app/layout.tsx` and update the metadata:

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Learning Next.js with a comprehensive training program',
}

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
```

**Key Points:**
- `metadata` object controls the page title and description
- This affects SEO and browser tab display

---

## Step 4: Create a New Page (About Page)

### 4.1 Create an about folder and page

Create a new folder: `app/about/`

Create a new file: `app/about/page.tsx`

```typescript
export default function About() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>About This Project</h1>
      <p>This is a Next.js training project.</p>
      <p>
        I'm learning about:
      </p>
      <ul>
        <li>Next.js fundamentals</li>
        <li>React Server Components</li>
        <li>File-based routing</li>
        <li>Layouts and pages</li>
      </ul>
      <a href="/">Back to Home</a>
    </main>
  )
}
```

### 4.2 Test the about page

Navigate to [http://localhost:3000/about](http://localhost:3000/about) in your browser.

**Key Points:**
- The folder name (`about`) becomes the route path
- No routing configuration needed!
- File-based routing is automatic

---

## Step 5: Create a Reusable Component

### 5.1 Create a components folder

Create a new folder: `app/components/`

### 5.2 Create a Header component

Create a new file: `app/components/Header.tsx`

```typescript
export default function Header() {
  return (
    <header style={{
      backgroundColor: '#0070f3',
      color: 'white',
      padding: '1rem 2rem',
      marginBottom: '2rem'
    }}>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>My Next.js App</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
            Home
          </a>
          <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>
            About
          </a>
        </div>
      </nav>
    </header>
  )
}
```

### 5.3 Create a Footer component

Create a new file: `app/components/Footer.tsx`

```typescript
export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#f0f0f0',
      padding: '1rem 2rem',
      marginTop: '2rem',
      textAlign: 'center'
    }}>
      <p>&copy; 2024 My Next.js App. Built with ❤️ using Next.js</p>
    </footer>
  )
}
```

---

## Step 6: Use Components in the Layout

### 6.1 Update the root layout

Open `app/layout.tsx` and import the components:

```typescript
import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Learning Next.js with a comprehensive training program',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### 6.2 Update global styles

Open `app/globals.css` and replace with:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #0070f3;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

ul {
  margin-left: 2rem;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 0.5rem;
}

a {
  color: #0070f3;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

### 6.3 Test your changes

Navigate to both pages:
- [http://localhost:3000](http://localhost:3000)
- [http://localhost:3000/about](http://localhost:3000/about)

You should see the header and footer on both pages!

---

## Step 7: Add Metadata to Individual Pages

### 7.1 Add metadata to the about page

Open `app/about/page.tsx` and add metadata:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - My Next.js App',
  description: 'Learn about this Next.js training project',
}

export default function About() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>About This Project</h1>
      <p>This is a Next.js training project.</p>
      <p>
        I'm learning about:
      </p>
      <ul>
        <li>Next.js fundamentals</li>
        <li>React Server Components</li>
        <li>File-based routing</li>
        <li>Layouts and pages</li>
      </ul>
      <a href="/">Back to Home</a>
    </main>
  )
}
```

### 7.2 Add metadata to the home page

Open `app/page.tsx`:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home - My Next.js App',
  description: 'Welcome to my Next.js training application',
}

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to My Next.js App</h1>
      <p>This is my first Next.js application!</p>
      <p>Built during Lab 01 of the Next.js training program.</p>
    </main>
  )
}
```

**Key Points:**
- Page-specific metadata overrides the default metadata
- Check the browser tab - the title should change based on the page!

---

## Step 8: Understanding Server vs Client Components

### 8.1 Create an interactive client component

Create a new file: `app/components/Counter.tsx`

```typescript
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      border: '2px solid #0070f3',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '1rem',
      textAlign: 'center'
    }}>
      <h3>Interactive Counter (Client Component)</h3>
      <p>Count: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Increment
      </button>
    </div>
  )
}
```

**Key Points:**
- `'use client'` directive marks this as a Client Component
- Client Components can use React hooks like `useState`
- Server Components (default) cannot use interactivity

### 8.2 Add the counter to the home page

Open `app/page.tsx`:

```typescript
import type { Metadata } from 'next'
import Counter from './components/Counter'

export const metadata: Metadata = {
  title: 'Home - My Next.js App',
  description: 'Welcome to my Next.js training application',
}

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to My Next.js App</h1>
      <p>This is my first Next.js application!</p>
      <p>Built during Lab 01 of the Next.js training program.</p>
      
      <Counter />
    </main>
  )
}
```

Test the counter - click the button and watch it increment!

---

## Step 9: Build for Production

### 9.1 Build the application

Stop the development server (Ctrl+C) and run:

```bash
npm run build
```

This creates an optimized production build.

### 9.2 Start the production server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the production version.

**Key Points:**
- Production builds are optimized for performance
- Server Components are pre-rendered
- Static pages are generated at build time

---

## Step 10: Verify Your Work

### Checklist

Make sure you have:
- ✅ Created a Next.js project
- ✅ Modified the home page
- ✅ Created an about page
- ✅ Created Header and Footer components
- ✅ Added the components to the root layout
- ✅ Added page-specific metadata
- ✅ Created an interactive Client Component
- ✅ Built the app for production

### Compare with Finish Folder

Navigate to the `finish/` folder to see the completed solution. Compare your code and see if you missed anything!

---

## 🎉 Congratulations!

You've completed Lab 01! You now understand:
- How to create a Next.js project
- The App Router structure
- Server vs Client Components
- File-based routing
- Layouts and metadata
- Building for production

## 🚀 Next Steps

Ready for Lab 02? You'll learn about:
- Advanced routing patterns
- Dynamic routes
- Route parameters
- Navigation components
- And more!

---

## 📚 Additional Challenges

Want to practice more? Try these challenges:

1. **Add a Contact Page**
   - Create `app/contact/page.tsx`
   - Add a form with name and email fields
   - Add it to the navigation

2. **Create a Card Component**
   - Make a reusable card component
   - Use it to display information on the home page
   - Style it with inline styles or CSS modules

3. **Add Images**
   - Add an image to the `public/` folder
   - Display it using the `<img>` tag
   - (We'll learn about Next.js Image component in later labs)

4. **Experiment with Layouts**
   - Create a nested layout for the about page
   - Try different layout patterns

---

**Need Help?**
- Check the `nextjs-syntax-reference.md` file
- Review the `finish/` folder
- Consult the [Next.js documentation](https://nextjs.org/docs)

Happy coding! 🚀

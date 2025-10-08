# Lab 02: Step-by-Step Guide

## Step 1: Set Up the Project

### 1.1 Create a new Next.js project or continue from Lab 01

If starting fresh:
```bash
cd starter
npx create-next-app@latest routing-demo
cd routing-demo
```

If continuing from Lab 01, you can use your existing project.

### 1.2 Start the development server

```bash
npm run dev
```

---

## Step 2: Create a Blog with Dynamic Routes

### 2.1 Create the blog list page

Create `app/blog/page.tsx`:

```typescript
import Link from 'next/link'

const posts = [
  { id: 1, slug: 'getting-started-nextjs', title: 'Getting Started with Next.js' },
  { id: 2, slug: 'react-server-components', title: 'Understanding React Server Components' },
  { id: 3, slug: 'routing-in-nextjs', title: 'Mastering Routing in Next.js' },
]

export default function BlogPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Blog</h1>
      <p>Welcome to our blog! Check out these posts:</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {posts.map((post) => (
          <Link 
            key={post.id}
            href={`/blog/${post.slug}`}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <h2 style={{ color: '#0070f3', margin: 0 }}>{post.title}</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              Read more →
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
```

**Test**: Navigate to [http://localhost:3000/blog](http://localhost:3000/blog)

### 2.2 Create a dynamic blog post page

Create `app/blog/[slug]/page.tsx`:

```typescript
import Link from 'next/link'

// This would typically come from a database or CMS
const posts: Record<string, { title: string; content: string; date: string }> = {
  'getting-started-nextjs': {
    title: 'Getting Started with Next.js',
    content: 'Next.js is a powerful React framework...',
    date: '2024-01-15'
  },
  'react-server-components': {
    title: 'Understanding React Server Components',
    content: 'React Server Components are a new way to build...',
    date: '2024-01-20'
  },
  'routing-in-nextjs': {
    title: 'Mastering Routing in Next.js',
    content: 'Routing in Next.js is file-based and intuitive...',
    date: '2024-01-25'
  },
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts[params.slug]

  if (!post) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Post Not Found</h1>
        <Link href="/blog">← Back to Blog</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem' }}>
      <Link href="/blog" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Blog
      </Link>
      <article>
        <h1>{post.title}</h1>
        <p style={{ color: '#666' }}>Published on {post.date}</p>
        <div style={{ marginTop: '2rem', lineHeight: 1.8 }}>
          {post.content}
        </div>
      </article>
    </main>
  )
}

// Generate static params for static generation
export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({
    slug: slug,
  }))
}
```

**Test**: Click on a blog post from the list page

**Key Points:**
- `[slug]` creates a dynamic route segment
- `params.slug` contains the URL parameter
- `generateStaticParams` enables static generation

---

## Step 3: Create Nested Dynamic Routes

### 3.1 Create a products page

Create `app/products/page.tsx`:

```typescript
import Link from 'next/link'

const categories = [
  { id: 1, slug: 'electronics', name: 'Electronics' },
  { id: 2, slug: 'clothing', name: 'Clothing' },
  { id: 3, slug: 'books', name: 'Books' },
]

export default function ProductsPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Products</h1>
      <p>Browse our product categories:</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products/${category.slug}`}
            style={{
              padding: '2rem',
              border: '2px solid #0070f3',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#0070f3',
              fontWeight: 'bold'
            }}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </main>
  )
}
```

### 3.2 Create a category page

Create `app/products/[category]/page.tsx`:

```typescript
import Link from 'next/link'

const productsByCategory: Record<string, Array<{ id: number; name: string; price: number }>> = {
  electronics: [
    { id: 101, name: 'Laptop', price: 999 },
    { id: 102, name: 'Smartphone', price: 699 },
    { id: 103, name: 'Headphones', price: 199 },
  ],
  clothing: [
    { id: 201, name: 'T-Shirt', price: 29 },
    { id: 202, name: 'Jeans', price: 79 },
    { id: 203, name: 'Jacket', price: 149 },
  ],
  books: [
    { id: 301, name: 'Next.js Handbook', price: 39 },
    { id: 302, name: 'React Patterns', price: 49 },
    { id: 303, name: 'Web Development Guide', price: 59 },
  ],
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const products = productsByCategory[params.category]

  if (!products) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Category Not Found</h1>
        <Link href="/products">← Back to Products</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem' }}>
      <Link href="/products" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Products
      </Link>
      <h1>{params.category.charAt(0).toUpperCase() + params.category.slice(1)}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${params.category}/${product.id}`}
            style={{
              padding: '1.5rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <h3 style={{ margin: 0, color: '#0070f3' }}>{product.name}</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
              ${product.price}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
```

### 3.3 Create a product detail page

Create `app/products/[category]/[id]/page.tsx`:

```typescript
import Link from 'next/link'

const allProducts: Record<number, { name: string; price: number; description: string; category: string }> = {
  101: { name: 'Laptop', price: 999, description: 'High-performance laptop', category: 'electronics' },
  102: { name: 'Smartphone', price: 699, description: 'Latest smartphone', category: 'electronics' },
  103: { name: 'Headphones', price: 199, description: 'Noise-cancelling headphones', category: 'electronics' },
  201: { name: 'T-Shirt', price: 29, description: 'Comfortable cotton t-shirt', category: 'clothing' },
  202: { name: 'Jeans', price: 79, description: 'Classic blue jeans', category: 'clothing' },
  203: { name: 'Jacket', price: 149, description: 'Warm winter jacket', category: 'clothing' },
  301: { name: 'Next.js Handbook', price: 39, description: 'Complete guide to Next.js', category: 'books' },
  302: { name: 'React Patterns', price: 49, description: 'Advanced React patterns', category: 'books' },
  303: { name: 'Web Development Guide', price: 59, description: 'Modern web development', category: 'books' },
}

export default function ProductPage({ 
  params 
}: { 
  params: { category: string; id: string } 
}) {
  const product = allProducts[parseInt(params.id)]

  if (!product || product.category !== params.category) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Product Not Found</h1>
        <Link href="/products">← Back to Products</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem' }}>
      <Link href={`/products/${params.category}`} style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to {params.category}
      </Link>
      
      <div style={{ maxWidth: '600px' }}>
        <h1>{product.name}</h1>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3' }}>
          ${product.price}
        </p>
        <p style={{ lineHeight: 1.8, marginTop: '1rem' }}>
          {product.description}
        </p>
        <button style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Add to Cart
        </button>
      </div>
    </main>
  )
}
```

**Test**: Navigate through Products → Category → Product

---

## Step 4: Implement Catch-all Routes

### 4.1 Create a documentation section

Create `app/docs/[...slug]/page.tsx`:

```typescript
import Link from 'next/link'

// Simulated documentation structure
const docs: Record<string, { title: string; content: string }> = {
  'getting-started': { 
    title: 'Getting Started', 
    content: 'Welcome to our documentation!' 
  },
  'getting-started/installation': { 
    title: 'Installation', 
    content: 'How to install our product...' 
  },
  'getting-started/configuration': { 
    title: 'Configuration', 
    content: 'How to configure...' 
  },
  'api/introduction': { 
    title: 'API Introduction', 
    content: 'Our API documentation...' 
  },
  'api/authentication': { 
    title: 'Authentication', 
    content: 'How to authenticate...' 
  },
}

export default function DocsPage({ params }: { params: { slug: string[] } }) {
  const path = params.slug.join('/')
  const doc = docs[path]

  if (!doc) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Documentation Not Found</h1>
        <p>Path: /{params.slug.join('/')}</p>
        <Link href="/docs/getting-started">← Go to Getting Started</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem' }}>
      {/* Breadcrumb navigation */}
      <nav style={{ marginBottom: '2rem', color: '#666' }}>
        <Link href="/docs/getting-started">Docs</Link>
        {params.slug.map((segment, index) => (
          <span key={index}>
            {' / '}
            <Link href={`/docs/${params.slug.slice(0, index + 1).join('/')}`}>
              {segment}
            </Link>
          </span>
        ))}
      </nav>

      <h1>{doc.title}</h1>
      <p>{doc.content}</p>

      {/* Documentation sidebar */}
      <aside style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Quick Links</h3>
        <ul>
          <li><Link href="/docs/getting-started">Getting Started</Link></li>
          <li><Link href="/docs/getting-started/installation">Installation</Link></li>
          <li><Link href="/docs/getting-started/configuration">Configuration</Link></li>
          <li><Link href="/docs/api/introduction">API Introduction</Link></li>
          <li><Link href="/docs/api/authentication">Authentication</Link></li>
        </ul>
      </aside>
    </main>
  )
}

export async function generateStaticParams() {
  return Object.keys(docs).map((path) => ({
    slug: path.split('/'),
  }))
}
```

**Test**: Navigate to various doc paths like `/docs/getting-started/installation`

**Key Points:**
- `[...slug]` catches all segments
- `params.slug` is an array of segments
- Great for documentation or file systems

---

## Step 5: Add Navigation Header

### 5.1 Update the Header component

Update `app/components/Header.tsx`:

```typescript
import Link from 'next/link'

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
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
            Home
          </Link>
          <Link href="/blog" style={{ color: 'white', textDecoration: 'none' }}>
            Blog
          </Link>
          <Link href="/products" style={{ color: 'white', textDecoration: 'none' }}>
            Products
          </Link>
          <Link href="/docs/getting-started" style={{ color: 'white', textDecoration: 'none' }}>
            Docs
          </Link>
        </div>
      </nav>
    </header>
  )
}
```

**Key Points:**
- Always use `Link` from `next/link` for navigation
- Link prefetches pages in the background
- Client-side navigation is faster than full page reloads

---

## Step 6: Programmatic Navigation

### 6.1 Create a search component

Create `app/components/SearchButton.tsx`:

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchButton() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search..."
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: '1px solid #ddd',
          marginRight: '0.5rem',
          fontSize: '1rem'
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Search
      </button>
    </div>
  )
}
```

### 6.2 Create a search results page

Create `app/search/page.tsx`:

```typescript
import Link from 'next/link'

const allContent = [
  { type: 'blog', slug: 'getting-started-nextjs', title: 'Getting Started with Next.js' },
  { type: 'blog', slug: 'react-server-components', title: 'Understanding React Server Components' },
  { type: 'product', slug: 'electronics/101', title: 'Laptop' },
  { type: 'product', slug: 'books/301', title: 'Next.js Handbook' },
]

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''
  
  const results = query
    ? allContent.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Search Results</h1>
      {query && (
        <p style={{ color: '#666' }}>
          Showing results for: <strong>{query}</strong>
        </p>
      )}

      {results.length === 0 ? (
        <p>No results found. Try a different search term.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          {results.map((result, index) => (
            <Link
              key={index}
              href={`/${result.type === 'blog' ? 'blog' : 'products'}/${result.slug}`}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <h3 style={{ margin: 0, color: '#0070f3' }}>{result.title}</h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
```

### 6.3 Add search to home page

Update `app/page.tsx` to include the search:

```typescript
import type { Metadata } from 'next'
import SearchButton from './components/SearchButton'

export const metadata: Metadata = {
  title: 'Home - My Next.js App',
  description: 'Welcome to my Next.js training application',
}

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to My Next.js App</h1>
      <p>This is my Next.js application with advanced routing!</p>
      <p>Built during Lab 02 of the Next.js training program.</p>
      
      <SearchButton />
    </main>
  )
}
```

**Test**: Try searching for "Next.js" or "Laptop"

**Key Points:**
- `useRouter` hook for programmatic navigation (Client Component)
- `searchParams` prop contains URL query parameters (Server Component)
- Always encode search parameters

---

## Step 7: Verify Your Work

### Checklist

Make sure you have:
- ✅ Created a blog with dynamic routes
- ✅ Implemented nested product routes
- ✅ Added catch-all routes for documentation
- ✅ Updated navigation with Link components
- ✅ Implemented search with query parameters
- ✅ Used programmatic navigation

### Test All Routes

Test these URLs:
- `/blog` - Blog list
- `/blog/getting-started-nextjs` - Blog post
- `/products` - Products list
- `/products/electronics` - Electronics category
- `/products/electronics/101` - Laptop product
- `/docs/getting-started/installation` - Docs page
- `/search?q=next` - Search results

---

## 🎉 Congratulations!

You've completed Lab 02! You now understand:
- File-based routing
- Dynamic routes
- Nested routes
- Catch-all routes
- Navigation with Link
- Programmatic navigation
- Search parameters

## 🚀 Next Steps

Ready for Lab 03? You'll learn about:
- Tailwind CSS setup
- Building UI components
- Responsive design
- Custom styling

---

## 📚 Additional Challenges

1. **Add Route Groups**
   - Create `(marketing)` and `(shop)` route groups
   - Give them different layouts

2. **Implement Pagination**
   - Add pagination to the blog list
   - Use search params: `/blog?page=2`

3. **Create a Sitemap**
   - Add a `/sitemap` page
   - List all available routes

4. **Add Loading States**
   - Create `loading.tsx` files
   - Show loading UI while navigating

---

Need Help? Check `nextjs-syntax-reference.md` or the `finish/` folder!

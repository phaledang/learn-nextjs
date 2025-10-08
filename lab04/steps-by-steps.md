# Lab 04: Step-by-Step Guide

## Step 1: Fetch Data in Server Components

### 1.1 Create a posts page

Create `app/posts/page.tsx`:

```typescript
interface Post {
  id: number
  title: string
  body: string
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="grid gap-4">
        {posts.slice(0, 10).map((post) => (
          <div key={post.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 mt-2">{post.body}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
```

**Key Points:**
- Server Components can be async
- Data is fetched on the server
- No loading states needed in component

---

## Step 2: Add Loading States

### 2.1 Create loading UI

Create `app/posts/loading.tsx`:

```typescript
export default function Loading() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="grid gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="border p-4 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </main>
  )
}
```

---

## Step 3: Add Error Handling

### 3.1 Create error UI

Create `app/posts/error.tsx`:

```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  )
}
```

---

## Step 4: Dynamic Data Fetching

### 4.1 Create dynamic post page

Create `app/posts/[id]/page.tsx`:

```typescript
interface Post {
  id: number
  title: string
  body: string
  userId: number
}

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  
  if (!res.ok) {
    throw new Error('Failed to fetch post')
  }
  
  return res.json()
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-4">Post ID: {post.id}</p>
      <div className="prose">
        <p>{post.body}</p>
      </div>
    </main>
  )
}
```

---

## Step 5: Static Generation with generateStaticParams

### 5.1 Add static generation

Update `app/posts/[id]/page.tsx`:

```typescript
// ... previous code ...

export async function generateStaticParams() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json())
  
  return posts.slice(0, 10).map((post: Post) => ({
    id: String(post.id),
  }))
}

export default async function PostPage({ params }: { params: { id: string } }) {
  // ... rest of the component
}
```

**Key Points:**
- `generateStaticParams` generates paths at build time
- Only specified paths are pre-rendered
- Great for blogs with many posts

---

## Step 6: Incremental Static Regeneration (ISR)

### 6.1 Add revalidation

Update the fetch call in `app/posts/page.tsx`:

```typescript
async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return res.json()
}
```

**Key Points:**
- `revalidate` time in seconds
- Page is regenerated in the background
- Users get fast static pages that stay fresh

---

## Step 7: Client-Side Data Fetching

### 7.1 Create a client component

Create `app/components/ClientPosts.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
  body: string
}

export default function ClientPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => {
        setPosts(data.slice(0, 5))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded-lg">
          <h3 className="font-semibold">{post.title}</h3>
          <p className="text-gray-600 text-sm">{post.body}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## Step 8: Parallel Data Fetching

### 8.1 Create a user profile page

Create `app/users/[id]/page.tsx`:

```typescript
interface User {
  id: number
  name: string
  email: string
}

interface Post {
  id: number
  title: string
}

async function getUser(id: string): Promise<User> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
  return res.json()
}

async function getUserPosts(id: string): Promise<Post[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
  return res.json()
}

export default async function UserPage({ params }: { params: { id: string } }) {
  // Parallel data fetching
  const [user, posts] = await Promise.all([
    getUser(params.id),
    getUserPosts(params.id)
  ])

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
      <p className="text-gray-600 mb-6">{user.email}</p>
      
      <h2 className="text-2xl font-bold mb-4">Posts by {user.name}</h2>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{post.title}</h3>
          </div>
        ))}
      </div>
    </main>
  )
}
```

**Key Points:**
- `Promise.all` fetches data in parallel
- Faster than sequential fetching
- Both requests start at the same time

---

## 🎉 Congratulations!

You've completed Lab 04! You now understand:
- Server Component data fetching
- Loading and error states
- Static generation
- ISR (Incremental Static Regeneration)
- Client-side data fetching
- Parallel data fetching

## 🚀 Next Steps

Ready for Lab 05? You'll learn about authentication with NextAuth!

---

## 📚 Additional Challenges

1. Add pagination to the posts list
2. Implement search functionality
3. Add caching strategies
4. Create a data fetching hook
5. Implement optimistic updates

Need Help? Check `nextjs-syntax-reference.md` or the `finish/` folder!

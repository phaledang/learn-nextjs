# Node.js Package Reference - Lab 04

## Overview
This lab focuses on dynamic routing, data fetching, and API routes in Next.js. While the core framework packages remain the same, this lab explores advanced Next.js features and may introduce additional packages for data management and API handling.

## Core Dependencies (Inherited from Previous Labs)

### `next` (v14.0.4)
**Enhanced for dynamic routing and API routes:**
- **Dynamic Routes**: File-based routing with `[param]` and `[...slug]` patterns
- **API Routes**: Built-in API endpoint creation with route handlers
- **Data Fetching**: Server-side data fetching with `fetch()` and React Server Components
- **Route Handlers**: RESTful API endpoints in the `app/api` directory
- **Middleware**: Request/response processing and redirects

**Dynamic Routing Patterns:**
```typescript
// app/posts/[id]/page.tsx - Dynamic route
interface Props {
  params: { id: string }
}

export default function Post({ params }: Props) {
  return <h1>Post ID: {params.id}</h1>
}

// app/blog/[...slug]/page.tsx - Catch-all route
interface Props {
  params: { slug: string[] }
}

export default function BlogPost({ params }: Props) {
  return <h1>Blog: {params.slug.join('/')}</h1>
}
```

**API Route Handlers:**
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const users = await fetchUsers()
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await createUser(body)
  return NextResponse.json(user, { status: 201 })
}

// app/api/users/[id]/route.ts
interface Props {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: Props) {
  const user = await fetchUser(params.id)
  return NextResponse.json(user)
}
```

**Server-Side Data Fetching:**
```typescript
// Server Component with data fetching
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // or 'force-cache' for caching
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

### `react` (^18) & `react-dom` (^18)
**Enhanced for data fetching patterns:**
- **Suspense**: Built-in loading states for async components
- **Server Components**: React 18 server-side rendering
- **Client Components**: Interactive components with `'use client'` directive
- **Error Boundaries**: Error handling for data fetching

## Additional Data Fetching Packages

### `swr` (Optional but Recommended)
**Description:** Data fetching library with caching, revalidation, and more.

**Purpose:**
- Client-side data fetching with caching
- Automatic revalidation and background updates
- Error handling and retry logic
- Real-time data synchronization

**Installation:**
```bash
npm install swr
```

**Usage:**
```typescript
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>
  return <div>Hello {data.name}!</div>
}
```

### `@tanstack/react-query` (Alternative to SWR)
**Description:** Powerful data synchronization for React applications.

**Purpose:**
- Advanced caching and synchronization
- Background updates and refetching
- Optimistic updates
- Parallel and dependent queries

**Installation:**
```bash
npm install @tanstack/react-query
```

**Usage:**
```typescript
import { useQuery } from '@tanstack/react-query'

function Posts() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(res => res.json())
  })

  if (isLoading) return 'Loading...'
  if (error) return 'An error occurred!'
  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## Database Integration Packages

### `@prisma/client` & `prisma`
**Description:** Modern database toolkit for TypeScript and Node.js.

**Purpose:**
- Type-safe database queries
- Database schema management
- Migration system
- Database introspection

**Installation:**
```bash
npm install prisma @prisma/client
npm install --save-dev prisma
```

**Setup:**
```bash
npx prisma init
npx prisma migrate dev
npx prisma generate
```

**Usage:**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// app/api/users/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

### `mongoose` (MongoDB Alternative)
**Description:** MongoDB object modeling for Node.js.

**Installation:**
```bash
npm install mongoose
npm install --save-dev @types/mongoose
```

**Usage:**
```typescript
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
```

## API Validation Packages

### `zod`
**Description:** TypeScript-first schema validation library.

**Purpose:**
- Runtime type validation
- API request/response validation
- Form validation
- Environment variable validation

**Installation:**
```bash
npm install zod
```

**Usage:**
```typescript
import { z } from 'zod'

// Schema definition
const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().optional(),
})

// API route validation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = UserSchema.parse(body)
    
    // Process valid data
    const user = await createUser(validatedData)
    return Response.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ errors: error.errors }, { status: 400 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### `joi` (Alternative to Zod)
**Description:** Object schema validation library.

**Installation:**
```bash
npm install joi
npm install --save-dev @types/joi
```

**Usage:**
```typescript
import Joi from 'joi'

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().optional(),
})

const { error, value } = userSchema.validate(data)
```

## HTTP Client Packages

### `axios`
**Description:** Promise-based HTTP client for the browser and Node.js.

**Purpose:**
- HTTP request/response handling
- Request and response interceptors
- Automatic request/response transformation
- Request/response timeout

**Installation:**
```bash
npm install axios
npm install --save-dev @types/axios
```

**Usage:**
```typescript
import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})

// Request interceptor
api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// Usage in component
async function fetchUsers() {
  try {
    const response = await api.get('/users')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}
```

### Built-in `fetch` (Recommended)
**Description:** Modern browser and Node.js built-in HTTP client.

**Usage:**
```typescript
// Server-side fetch (in API routes or Server Components)
async function getUsers() {
  const response = await fetch('https://api.example.com/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // or 'force-cache'
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  
  return response.json()
}

// Client-side fetch (in Client Components)
'use client'
import { useState, useEffect } from 'react'

function UserList() {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
  }, [])
  
  return <div>{/* render users */}</div>
}
```

## Environment and Configuration

### `dotenv` (Built into Next.js)
**Description:** Environment variable management (built into Next.js).

**Usage:**
```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
API_SECRET_KEY="your-secret-key"
NEXT_PUBLIC_API_URL="https://api.example.com"
```

```typescript
// Access in API routes or Server Components
const databaseUrl = process.env.DATABASE_URL
const apiKey = process.env.API_SECRET_KEY

// Access in Client Components (must be prefixed with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## Error Handling Packages

### `http-status-codes`
**Description:** Constants for HTTP status codes.

**Installation:**
```bash
npm install http-status-codes
```

**Usage:**
```typescript
import { StatusCodes } from 'http-status-codes'

export async function GET() {
  try {
    const data = await fetchData()
    return Response.json(data, { status: StatusCodes.OK })
  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
```

## Development and Testing Enhancements

### `@types/node` (Enhanced for API Development)
**Enhanced usage for API routes:**
```typescript
// Type definitions for Node.js APIs used in route handlers
import { NextRequest, NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  // Access headers
  const headersList = headers()
  const authorization = headersList.get('authorization')
  
  // Access cookies
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('session')
  
  return NextResponse.json({ success: true })
}
```

### Testing API Routes

#### `supertest`
**Description:** HTTP assertion library for testing API endpoints.

**Installation:**
```bash
npm install --save-dev supertest @types/supertest
```

**Usage:**
```typescript
import { createMocks } from 'node-mocks-http'
import handler from '../pages/api/users'

describe('/api/users', () => {
  it('returns users', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual([])
  })
})
```

## Development Workflow Enhancements

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "type-check": "tsc --noEmit"
  }
}
```

### TypeScript Configuration for API Routes
```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Common Patterns and Best Practices

### API Route Error Handling
```typescript
// lib/api-response.ts
export function apiResponse<T>(data: T, status = 200) {
  return Response.json(data, { status })
}

export function apiError(message: string, status = 500) {
  return Response.json({ error: message }, { status })
}

// app/api/users/route.ts
export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return apiResponse(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return apiError('Failed to fetch users', 500)
  }
}
```

### Data Fetching Patterns
```typescript
// Server Component with error handling
async function getPost(id: string) {
  try {
    const res = await fetch(`https://api.example.com/posts/${id}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch post')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  
  if (!post) {
    return <div>Post not found</div>
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

### Client-Side Data Fetching with Error Boundaries
```typescript
// components/ErrorBoundary.tsx
'use client'
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>
    }

    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <DataComponent />
</ErrorBoundary>
```

## Performance Considerations

### Caching Strategies
```typescript
// Static data (cached until manually revalidated)
const staticData = await fetch('https://api.example.com/static', {
  cache: 'force-cache'
})

// Dynamic data (always fresh)
const dynamicData = await fetch('https://api.example.com/dynamic', {
  cache: 'no-store'
})

// Revalidated data (cached with time-based revalidation)
const revalidatedData = await fetch('https://api.example.com/posts', {
  next: { revalidate: 3600 } // 1 hour
})
```

### Database Query Optimization
```typescript
// Efficient Prisma queries
const postsWithAuthor = await prisma.post.findMany({
  include: {
    author: {
      select: {
        name: true,
        email: true,
      }
    }
  },
  take: 10, // Limit results
  orderBy: {
    createdAt: 'desc'
  }
})
```

## Troubleshooting Common Issues

### API Route Not Found
```bash
# Check file structure
app/api/users/route.ts  # Correct
app/api/users.ts        # Incorrect

# Verify export names
export async function GET() {} # Correct
export function get() {}       # Incorrect
```

### Database Connection Issues
```bash
# Check environment variables
echo $DATABASE_URL

# Test database connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

### CORS Issues
```typescript
// Handle CORS in API routes
export async function GET(request: Request) {
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
  
  return response
}
```
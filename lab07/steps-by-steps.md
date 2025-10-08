# Lab 07: Step-by-Step Guide - API Routes & Backend

## Step 1: Create Basic API Route

### 1.1 Create GET endpoint

Create `app/api/hello/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello from API!' })
}
```

Test: Visit `http://localhost:3000/api/hello`

---

## Step 2: Handle Different HTTP Methods

### 2.1 Create CRUD API

Create `app/api/posts/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

// In-memory storage (use database in production)
let posts = [
  { id: 1, title: 'First Post', content: 'Hello World' },
]

export async function GET() {
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newPost = {
    id: posts.length + 1,
    title: body.title,
    content: body.content,
  }
  posts.push(newPost)
  return NextResponse.json(newPost, { status: 201 })
}
```

---

## Step 3: Dynamic API Routes

### 3.1 Create route with parameters

Create `app/api/posts/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

// Mock data
const posts = [
  { id: 1, title: 'First Post', content: 'Content 1' },
  { id: 2, title: 'Second Post', content: 'Content 2' },
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = posts.find(p => p.id === parseInt(params.id))
  
  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(post)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const index = posts.findIndex(p => p.id === parseInt(params.id))
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }
  
  posts[index] = { ...posts[index], ...body }
  return NextResponse.json(posts[index])
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = posts.findIndex(p => p.id === parseInt(params.id))
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }
  
  posts.splice(index, 1)
  return NextResponse.json({ message: 'Post deleted' })
}
```

---

## Step 4: API with Authentication

### 4.1 Create protected API endpoint

Create `app/api/protected/user/route.ts`:

```typescript
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    user: session.user,
    message: 'This is protected data',
  })
}
```

---

## Step 5: Error Handling

### 5.1 Create API with error handling

Create `app/api/users/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simulate fetching users
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]
    
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Simulate creating user
    const newUser = {
      id: Date.now(),
      name: body.name,
      email: body.email,
    }
    
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
```

---

## Step 6: CORS Configuration

### 6.1 Add CORS headers

Create `app/api/public/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.json({
    message: 'This endpoint allows CORS',
  })

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}
```

---

## Step 7: Query Parameters

### 7.1 Handle search and pagination

Create `app/api/search/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

const allPosts = [
  { id: 1, title: 'Next.js Tutorial', category: 'tutorial' },
  { id: 2, title: 'React Basics', category: 'tutorial' },
  { id: 3, title: 'API Development', category: 'guide' },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  let filteredPosts = allPosts

  if (query) {
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase())
    )
  }

  if (category) {
    filteredPosts = filteredPosts.filter(post =>
      post.category === category
    )
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  return NextResponse.json({
    posts: paginatedPosts,
    total: filteredPosts.length,
    page,
    totalPages: Math.ceil(filteredPosts.length / limit),
  })
}
```

Test: `/api/search?q=next&category=tutorial&page=1&limit=10`

---

## 🎉 Congratulations!

You've completed Lab 07! You now understand:
- Creating API routes
- Handling HTTP methods
- Dynamic routes
- Authentication
- Error handling
- CORS
- Query parameters

## 🚀 Next Steps

Ready for Lab 08? You'll integrate Prisma and MongoDB!

Test your APIs with tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

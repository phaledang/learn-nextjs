# Lab 08: Step-by-Step Guide - Prisma & MongoDB

## Step 1: Set Up MongoDB

### 1.1 Create MongoDB Atlas account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (free tier)
4. Create a database user
5. Get connection string

### 1.2 Add connection string to environment

Create `.env`:

```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority"
```

---

## Step 2: Install and Configure Prisma

### 2.1 Install Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

### 2.2 Configure Prisma for MongoDB

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String   @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2.3 Generate Prisma Client

```bash
npx prisma generate
```

---

## Step 3: Create Prisma Client Instance

### 3.1 Create lib/prisma.ts

Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Step 4: Create API Routes with Prisma

### 4.1 Create Users API

Create `app/api/users/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
```

### 4.2 Create Posts API

Create `app/api/posts/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: body.authorId,
      },
      include: {
        author: true,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
```

### 4.3 Create Single Post API

Create `app/api/posts/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
      },
      include: { author: true },
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Post deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
```

---

## Step 5: Create UI to Display Data

### 5.1 Create Posts Page

Create `app/posts-db/page.tsx`:

```typescript
import { prisma } from '@/lib/prisma'

export default async function PostsDBPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Posts from Database</h1>
      
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-2">{post.content}</p>
            <p className="text-sm text-gray-500">
              By: {post.author.name} | {post.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <p className="text-gray-500">No posts yet. Create one using the API!</p>
      )}
    </main>
  )
}
```

---

## Step 6: Create Seed Data

### 6.1 Create seed script

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
  })

  // Create posts
  await prisma.post.create({
    data: {
      title: 'Getting Started with Next.js',
      content: 'Next.js is amazing for building web applications...',
      published: true,
      authorId: user1.id,
    },
  })

  await prisma.post.create({
    data: {
      title: 'Prisma and MongoDB',
      content: 'Learn how to use Prisma with MongoDB...',
      published: true,
      authorId: user2.id,
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 6.2 Add seed script to package.json

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### 6.3 Run seed

```bash
npm install -D ts-node
npx prisma db seed
```

---

## Step 7: Prisma Studio

### 7.1 Open Prisma Studio

```bash
npx prisma studio
```

This opens a GUI to view and edit your database at `http://localhost:5555`

---

## 🎉 Congratulations!

You've completed Lab 08! You now understand:
- MongoDB setup
- Prisma configuration
- Database schemas
- CRUD operations
- Relationships
- Seeding data
- Prisma Studio

## 🚀 Next Steps

Ready for Lab 09? You'll deploy to Azure!

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Prisma with MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)

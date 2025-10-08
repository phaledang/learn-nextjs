# Lab 10: Step-by-Step Guide - Performance, SEO & Capstone

## Part 1: Performance Optimization

### Step 1: Image Optimization

#### 1.1 Use Next.js Image Component

Update your images:

```typescript
import Image from 'next/image'

export default function OptimizedPage() {
  return (
    <div>
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={1200}
        height={600}
        priority // Load immediately for LCP
        placeholder="blur"
        blurDataURL="data:image/png;base64,..." // Optional
      />
      
      <Image
        src="https://example.com/image.jpg"
        alt="External image"
        width={800}
        height={400}
        loading="lazy" // Lazy load below fold
      />
    </div>
  )
}
```

#### 1.2 Configure Image Domains

Update `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

---

### Step 2: Code Splitting and Lazy Loading

#### 2.1 Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

// Client component lazy loading
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable SSR for this component
})

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <HeavyComponent />
    </div>
  )
}
```

---

### Step 3: Bundle Analysis

#### 3.1 Install Bundle Analyzer

```bash
npm install @next/bundle-analyzer
```

#### 3.2 Configure analyzer

Update `next.config.js`:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Your config
})
```

#### 3.3 Analyze bundle

```bash
ANALYZE=true npm run build
```

---

## Part 2: SEO Optimization

### Step 4: Metadata API

#### 4.1 Static Metadata

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js Training - Learn Modern Web Development',
  description: 'Comprehensive Next.js training covering setup, routing, styling, APIs, and deployment',
  keywords: ['Next.js', 'React', 'Web Development', 'Training'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Company',
  openGraph: {
    title: 'Next.js Training Program',
    description: 'Master Next.js with hands-on labs',
    url: 'https://yoursite.com',
    siteName: 'Next.js Training',
    images: [
      {
        url: 'https://yoursite.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Next.js Training',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Training Program',
    description: 'Master Next.js with hands-on labs',
    images: ['https://yoursite.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

---

### Step 5: Sitemap Generation

#### 5.1 Create sitemap

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://yoursite.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://yoursite.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}
```

---

### Step 6: Robots.txt

#### 6.1 Create robots.txt

Create `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://yoursite.com/sitemap.xml',
  }
}
```

---

### Step 7: Structured Data (JSON-LD)

#### 7.1 Add JSON-LD to page

```typescript
export default function BlogPost() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'My Blog Post',
    author: {
      '@type': 'Person',
      name: 'John Doe',
    },
    datePublished: '2024-01-15',
    description: 'A comprehensive guide to Next.js',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <h1>My Blog Post</h1>
        {/* Content */}
      </article>
    </>
  )
}
```

---

## Part 3: Capstone Project - FastAPI + Cosmos DB

### Step 8: FastAPI Backend Setup

#### 8.1 Install FastAPI

Create a new directory `backend/`:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn azure-cosmos python-dotenv
```

#### 8.2 Create FastAPI app

Create `backend/main.py`:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from azure.cosmos import CosmosClient, PartitionKey
from dotenv import load_dotenv
import os
from typing import List
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cosmos DB Setup
COSMOS_URL = os.getenv("COSMOS_URL")
COSMOS_KEY = os.getenv("COSMOS_KEY")
DATABASE_NAME = "nextjs-training"
CONTAINER_NAME = "tasks"

client = CosmosClient(COSMOS_URL, COSMOS_KEY)
database = client.create_database_if_not_exists(id=DATABASE_NAME)
container = database.create_container_if_not_exists(
    id=CONTAINER_NAME,
    partition_key=PartitionKey(path="/id")
)

# Models
class Task(BaseModel):
    id: str
    title: str
    description: str
    completed: bool = False

@app.get("/")
def read_root():
    return {"message": "FastAPI + Cosmos DB Backend"}

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    items = list(container.read_all_items())
    return items

@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    container.create_item(body=task.dict())
    return task

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    try:
        item = container.read_item(item=task_id, partition_key=task_id)
        return item
    except Exception:
        raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task: Task):
    try:
        container.replace_item(item=task_id, body=task.dict())
        return task
    except Exception:
        raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    try:
        container.delete_item(item=task_id, partition_key=task_id)
        return {"message": "Task deleted"}
    except Exception:
        raise HTTPException(status_code=404, detail="Task not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### 8.3 Create .env

Create `backend/.env`:

```bash
COSMOS_URL=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key
```

#### 8.4 Run FastAPI

```bash
python main.py
```

Visit: http://localhost:8000/docs for API documentation

---

### Step 9: Next.js Frontend Integration

#### 9.1 Create tasks page

Create `app/tasks/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:8000/tasks')
    const data = await res.json()
    setTasks(data)
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    const task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    }
    
    await fetch('http://localhost:8000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
    
    setNewTask({ title: '', description: '' })
    fetchTasks()
  }

  const toggleTask = async (task: Task) => {
    await fetch(`http://localhost:8000/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    })
    fetchTasks()
  }

  const deleteTask = async (id: string) => {
    await fetch(`http://localhost:8000/tasks/${id}`, {
      method: 'DELETE',
    })
    fetchTasks()
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>
      <p className="text-gray-600 mb-8">
        Capstone Project: Next.js + FastAPI + Cosmos DB
      </p>

      <form onSubmit={createTask} className="mb-8 space-y-4">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task title"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task description"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded-lg flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              <p className="text-gray-600">{task.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(task)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
```

---

## 🎉 Congratulations!

You've completed all 10 labs! You now have:

### Skills Mastered:
- ✅ Next.js fundamentals and setup
- ✅ Advanced routing patterns
- ✅ Tailwind CSS and responsive design
- ✅ Data fetching strategies
- ✅ Authentication with NextAuth
- ✅ Form handling and validation
- ✅ API route development
- ✅ Database integration (Prisma + MongoDB)
- ✅ Azure deployment
- ✅ Performance optimization
- ✅ SEO best practices
- ✅ Full-stack integration (FastAPI + Cosmos DB)

### Your Capstone Project Includes:
- Next.js frontend with modern React patterns
- FastAPI Python backend
- Azure Cosmos DB NoSQL database
- Full CRUD operations
- Responsive UI
- Production-ready architecture

## 🚀 Next Steps

1. Deploy your capstone to Azure
2. Add more features (authentication, real-time updates)
3. Implement testing
4. Build your own projects
5. Share your knowledge!

## 📚 Continue Learning

- Explore Next.js 14+ features
- Learn about Edge Functions
- Master TypeScript
- Explore serverless architectures
- Build progressive web apps (PWAs)

---

**Thank you for completing the Next.js Training Program!** 🎉

You're now equipped to build modern, scalable web applications with Next.js!

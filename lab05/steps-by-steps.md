# Lab 05: Step-by-Step Guide

## Step 1: Install NextAuth

### 1.1 Install dependencies

```bash
npm install next-auth
```

### 1.2 Create NextAuth configuration

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Add your own authentication logic here
        if (credentials?.email === 'demo@example.com' && credentials?.password === 'demo') {
          return {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      return session
    },
  },
})

export { handler as GET, handler as POST }
```

### 1.3 Add environment variables

Create `.env.local`:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# GitHub OAuth (optional - create app at github.com/settings/applications/new)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

---

## Step 2: Create Session Provider

### 2.1 Create provider component

Create `app/components/Providers.tsx`:

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### 2.2 Add provider to layout

Update `app/layout.tsx`:

```typescript
import Providers from './components/Providers'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

---

## Step 3: Create Sign In Page

### 3.1 Create sign in page

Create `app/auth/signin/page.tsx`:

```typescript
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid credentials')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center">Sign In</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">Or sign in with</p>
          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Sign in with GitHub
          </button>
        </div>
        
        <p className="text-center text-sm text-gray-600">
          Demo: email@example.com / demo
        </p>
      </div>
    </div>
  )
}
```

---

## Step 4: Create Protected Dashboard

### 4.1 Create dashboard page

Create `app/dashboard/page.tsx`:

```typescript
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Welcome, {session.user?.name}!</h2>
        <p className="text-gray-600">Email: {session.user?.email}</p>
      </div>
    </main>
  )
}
```

---

## Step 5: Create Auth UI Component

### 5.1 Create auth button component

Create `app/components/AuthButton.tsx`:

```typescript
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="px-4 py-2">Loading...</div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Sign In
    </button>
  )
}
```

---

## Step 6: Protect API Routes

### 6.1 Create protected API route

Create `app/api/protected/route.ts`:

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
    message: 'This is protected data',
    user: session.user,
  })
}
```

---

## 🎉 Congratulations!

You've completed Lab 05! You now understand:
- NextAuth.js setup
- Multiple auth providers
- Protected routes
- Session management
- Client and server authentication

## 🚀 Next Steps

Ready for Lab 06? You'll learn about forms and validation!

---

Test your authentication:
- Try demo credentials: demo@example.com / demo
- Set up GitHub OAuth for social login
- Access protected routes

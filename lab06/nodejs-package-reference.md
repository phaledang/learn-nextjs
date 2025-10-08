# Node.js Package Reference - Lab 06

## Overview
This lab focuses on authentication, authorization, and security in Next.js applications. It introduces packages for user authentication, session management, security middleware, and access control while building secure web applications.

## Authentication Packages

### `next-auth` (NextAuth.js)
**Description:** Complete authentication solution for Next.js applications.

**Purpose:**
- OAuth provider integration (Google, GitHub, Facebook, etc.)
- Database session management
- JWT token handling
- Built-in security features
- TypeScript support

**Installation:**
```bash
npm install next-auth
```

**Setup:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Implement your authentication logic here
        const user = await authenticateUser(credentials)
        return user || null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
})

export { handler as GET, handler as POST }
```

**Usage in Components:**
```typescript
'use client'
import { useSession, signIn, signOut } from 'next-auth/react'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  
  return (
    <div>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  )
}
```

**Provider Setup:**
```typescript
// app/providers.tsx
'use client'
import { SessionProvider } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

// app/layout.tsx
import { AuthProvider } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### `@auth0/nextjs-auth0`
**Description:** Auth0 SDK for Next.js applications.

**Purpose:**
- Enterprise-grade authentication
- Single sign-on (SSO)
- Multi-factor authentication
- User management
- Social and enterprise connections

**Installation:**
```bash
npm install @auth0/nextjs-auth0
```

**Setup:**
```typescript
// app/api/auth/[auth0]/route.ts
import { handleAuth } from '@auth0/nextjs-auth0'

export const GET = handleAuth()

// middleware.ts
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge'

export default withMiddlewareAuthRequired()

export const config = {
  matcher: '/protected/:path*'
}
```

**Usage:**
```typescript
'use client'
import { useUser } from '@auth0/nextjs-auth0/client'

export function Profile() {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  )
}
```

### `firebase` (Firebase Authentication)
**Description:** Google Firebase authentication service.

**Installation:**
```bash
npm install firebase
```

**Setup:**
```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
```

**Usage:**
```typescript
'use client'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function AuthForm() {
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('User signed in:', userCredential.user)
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log('User created:', userCredential.user)
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  // Form implementation...
}
```

## Password Hashing and Security

### `bcryptjs`
**Description:** Optimized bcrypt implementation for JavaScript.

**Purpose:**
- Password hashing
- Password verification
- Salt generation
- Secure password storage

**Installation:**
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

**Usage:**
```typescript
import bcrypt from 'bcryptjs'

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Usage in API route
export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  // Hash password before storing
  const hashedPassword = await hashPassword(password)
  
  // Store user with hashed password
  const user = await createUser({
    email,
    password: hashedPassword,
  })
  
  return Response.json({ success: true })
}
```

### `argon2`
**Description:** Modern password hashing library (more secure alternative to bcrypt).

**Installation:**
```bash
npm install argon2
npm install --save-dev @types/argon2
```

**Usage:**
```typescript
import argon2 from 'argon2'

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  })
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password)
}
```

## JWT and Token Management

### `jsonwebtoken`
**Description:** JSON Web Token implementation for Node.js.

**Purpose:**
- JWT token creation and verification
- Token-based authentication
- Stateless session management
- API authentication

**Installation:**
```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

**Usage:**
```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '7d'

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Middleware for protected routes
export function authenticateToken(request: Request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new Error('Access token required')
  }

  return verifyToken(token)
}

// Usage in API route
export async function GET(request: Request) {
  try {
    const user = authenticateToken(request)
    // Handle authenticated request
    return Response.json({ user })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 401 })
  }
}
```

### `jose` (Modern JWT Library)
**Description:** Universal JavaScript and TypeScript JWT library.

**Installation:**
```bash
npm install jose
```

**Usage:**
```typescript
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function createJWT(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret)
}

export async function verifyJWT(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}
```

## Session Management

### `iron-session`
**Description:** Secure, stateless, and cookie-based session library.

**Purpose:**
- Encrypted session storage in cookies
- TypeScript support
- Next.js integration
- Stateless sessions

**Installation:**
```bash
npm install iron-session
```

**Setup:**
```typescript
// lib/session.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId?: string
  username?: string
  isLoggedIn: boolean
}

const defaultSession: SessionData = {
  isLoggedIn: false,
}

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), {
    password: process.env.SESSION_SECRET!,
    cookieName: 'myapp-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  })

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn
  }

  return session
}
```

**Usage:**
```typescript
// app/api/login/route.ts
import { getSession } from '@/lib/session'

export async function POST(request: Request) {
  const { username, password } = await request.json()
  
  // Verify credentials
  const user = await authenticateUser(username, password)
  
  if (user) {
    const session = await getSession()
    session.userId = user.id
    session.username = user.username
    session.isLoggedIn = true
    await session.save()
    
    return Response.json({ success: true })
  }
  
  return Response.json({ error: 'Invalid credentials' }, { status: 401 })
}

// Server component using session
import { getSession } from '@/lib/session'

export default async function Profile() {
  const session = await getSession()
  
  if (!session.isLoggedIn) {
    redirect('/login')
  }
  
  return <div>Welcome, {session.username}!</div>
}
```

## Security Middleware

### `helmet`
**Description:** Security middleware for setting HTTP headers.

**Purpose:**
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Other security headers

**Installation:**
```bash
npm install helmet
npm install --save-dev @types/helmet
```

**Usage:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  )

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### `express-rate-limit` (Adapted for Next.js)
**Description:** Rate limiting middleware.

**Installation:**
```bash
npm install express-rate-limit
```

**Usage:**
```typescript
// lib/rate-limit.ts
import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const requests = new Map()

export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest) => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Clean old entries
    const userRequests = requests.get(ip) || []
    const validRequests = userRequests.filter((time: number) => time > windowStart)

    if (validRequests.length >= config.maxRequests) {
      return false
    }

    validRequests.push(now)
    requests.set(ip, validRequests)
    return true
  }
}

// Usage in API route
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
})

export async function POST(request: NextRequest) {
  if (!limiter(request)) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  // Handle request
}
```

## Input Validation and Sanitization

### `validator`
**Description:** String validation and sanitization library.

**Installation:**
```bash
npm install validator
npm install --save-dev @types/validator
```

**Usage:**
```typescript
import validator from 'validator'

export function validateAndSanitizeInput(data: any) {
  const errors: string[] = []
  const sanitized: any = {}

  // Email validation
  if (!validator.isEmail(data.email)) {
    errors.push('Invalid email address')
  } else {
    sanitized.email = validator.normalizeEmail(data.email)
  }

  // Password validation
  if (!validator.isLength(data.password, { min: 8, max: 128 })) {
    errors.push('Password must be 8-128 characters long')
  }

  // Sanitize strings
  if (data.name) {
    sanitized.name = validator.escape(data.name.trim())
  }

  return { errors, sanitized, isValid: errors.length === 0 }
}
```

### `dompurify` (Client-side sanitization)
**Description:** DOM-only, super-fast XSS sanitizer.

**Installation:**
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

**Usage:**
```typescript
'use client'
import DOMPurify from 'dompurify'

export function SafeHTML({ html }: { html: string }) {
  const cleanHTML = DOMPurify.sanitize(html)
  
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
}
```

## Database Security

### `@prisma/client` (Enhanced Security)
**Enhanced usage with security considerations:**

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Secure query helpers
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      // Don't select password by default
    }
  })
}

export async function findUserForAuth(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true, // Only for authentication
    }
  })
}
```

## Environment Security

### `dotenv-safe`
**Description:** Load environment variables with validation.

**Installation:**
```bash
npm install dotenv-safe
```

**Usage:**
```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  JWT_SECRET: z.string().min(32),
})

export const env = envSchema.parse(process.env)
```

## CSRF Protection

### Custom CSRF Implementation
```typescript
// lib/csrf.ts
import { createHash, randomBytes } from 'crypto'

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  const hash = createHash('sha256')
    .update(token + sessionToken)
    .digest('hex')
  
  return hash === token
}

// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // CSRF protection for state-changing operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const token = await getToken({ req: request })
    const csrfToken = request.headers.get('X-CSRF-Token')
    
    if (!token || !csrfToken || !validateCSRFToken(csrfToken, token.sub)) {
      return new Response('CSRF token mismatch', { status: 403 })
    }
  }

  return NextResponse.next()
}
```

## Role-Based Access Control

### Custom RBAC Implementation
```typescript
// types/auth.ts
export interface User {
  id: string
  email: string
  role: Role
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

// lib/rbac.ts
export function hasPermission(user: User, resource: string, action: string): boolean {
  return user.role.permissions.some(
    permission => permission.resource === resource && permission.action === action
  )
}

export function requirePermission(user: User, resource: string, action: string) {
  if (!hasPermission(user, resource, action)) {
    throw new Error('Insufficient permissions')
  }
}

// HOC for protecting components
export function withPermission(
  Component: React.ComponentType,
  resource: string,
  action: string
) {
  return function ProtectedComponent(props: any) {
    const { data: session } = useSession()
    
    if (!session?.user || !hasPermission(session.user, resource, action)) {
      return <div>Access denied</div>
    }
    
    return <Component {...props} />
  }
}
```

## API Security Best Practices

### Request Validation Middleware
```typescript
// lib/api-middleware.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<T> => {
    try {
      const body = await request.json()
      return schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
      }
      throw new Error('Invalid request body')
    }
  }
}

// Usage in API route
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const data = await validateRequest(createUserSchema)(request)
    // Process validated data
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}
```

### API Rate Limiting
```typescript
// lib/api-rate-limit.ts
const apiLimits = new Map()

export function createAPIRateLimit(maxRequests: number, windowMs: number) {
  return (identifier: string): boolean => {
    const now = Date.now()
    const windowStart = now - windowMs
    
    const requests = apiLimits.get(identifier) || []
    const validRequests = requests.filter((time: number) => time > windowStart)
    
    if (validRequests.length >= maxRequests) {
      return false
    }
    
    validRequests.push(now)
    apiLimits.set(identifier, validRequests)
    return true
  }
}

const rateLimiter = createAPIRateLimit(100, 15 * 60 * 1000) // 100 requests per 15 minutes

export async function GET(request: NextRequest) {
  const ip = request.ip || 'unknown'
  
  if (!rateLimiter(ip)) {
    return Response.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': '900' } }
    )
  }
  
  // Handle request
}
```

## Common Security Patterns

### Secure API Routes
```typescript
// lib/secure-api.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return handler(request, session)
  }
}

export async function withRole(handler: Function, requiredRole: string) {
  return withAuth(async (request: NextRequest, session: any) => {
    if (session.user.role !== requiredRole) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return handler(request, session)
  })
}

// Usage
export const GET = withRole(async (request, session) => {
  // Admin-only endpoint
  return Response.json({ data: 'sensitive data' })
}, 'admin')
```

## Development and Testing

### Security Testing
```typescript
// tests/security.test.ts
import { createMocks } from 'node-mocks-http'

describe('API Security', () => {
  it('should reject requests without authentication', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/protected',
    })

    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(401)
  })

  it('should enforce rate limiting', async () => {
    // Test rate limiting implementation
  })

  it('should validate input data', async () => {
    // Test input validation
  })
})
```

## Common Security Issues and Solutions

### Prevention Patterns
```typescript
// ❌ SQL Injection vulnerability
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✅ Use parameterized queries (Prisma handles this)
const user = await prisma.user.findUnique({
  where: { email }
})

// ❌ XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Sanitize user input
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ❌ Insecure direct object reference
const post = await prisma.post.findUnique({
  where: { id: params.id }
})

// ✅ Verify ownership
const post = await prisma.post.findFirst({
  where: { 
    id: params.id,
    authorId: session.user.id 
  }
})
```
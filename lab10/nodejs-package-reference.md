# Node.js Package Reference - Lab 10

## Overview
This lab focuses on advanced enterprise features including comprehensive logging, application performance monitoring (APM), security scanning, advanced database patterns, real-time communication, and production monitoring. It covers enterprise-grade packages for building scalable, maintainable, and secure Next.js applications in production environments.

## Advanced Logging and Observability

### `winston`
**Description:** Universal logging library with multiple transports and log levels.

**Purpose:**
- Structured logging
- Multiple output destinations
- Log levels and filtering
- Performance logging
- Error tracking

**Installation:**
```bash
npm install winston
npm install --save-dev @types/node
```

**Configuration:**
```typescript
// lib/logger.ts
import winston from 'winston'

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
)

// Development format for console
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    return `${timestamp} [${level}]: ${message} ${metaStr}`
  })
)

// Create transports based on environment
const transports: winston.transport[] = []

if (process.env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: devFormat,
      level: 'debug',
    })
  )
} else {
  transports.push(
    new winston.transports.Console({
      format: logFormat,
      level: 'info',
    })
  )

  // Add file transports for production
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: logFormat,
    })
  )
}

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'nextjs-app',
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  },
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
})

// Logger utilities
export class Logger {
  static debug(message: string, meta?: any): void {
    logger.debug(message, meta)
  }

  static info(message: string, meta?: any): void {
    logger.info(message, meta)
  }

  static warn(message: string, meta?: any): void {
    logger.warn(message, meta)
  }

  static error(message: string, error?: Error | any, meta?: any): void {
    const errorMeta = error instanceof Error 
      ? { stack: error.stack, name: error.name, ...meta }
      : { error, ...meta }
    
    logger.error(message, errorMeta)
  }

  static http(message: string, meta?: any): void {
    logger.http(message, meta)
  }

  // Request logging
  static logRequest(req: any, res: any, duration: number): void {
    logger.http('HTTP Request', {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length'),
    })
  }

  // Database operation logging
  static logDatabaseOperation(operation: string, table: string, duration: number, meta?: any): void {
    logger.info('Database Operation', {
      operation,
      table,
      duration: `${duration}ms`,
      ...meta,
    })
  }

  // Performance logging
  static logPerformance(operation: string, duration: number, meta?: any): void {
    logger.info('Performance Metric', {
      operation,
      duration: `${duration}ms`,
      ...meta,
    })
  }
}

// Performance measurement utility
export function measurePerformance<T>(
  operation: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = Date.now()
  
  try {
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        Logger.logPerformance(operation, Date.now() - start)
      })
    } else {
      Logger.logPerformance(operation, Date.now() - start)
      return result
    }
  } catch (error) {
    Logger.logPerformance(operation, Date.now() - start, { error: true })
    throw error
  }
}
```

**Middleware Integration:**
```typescript
// middleware/logging.ts
import { NextRequest, NextResponse } from 'next/server'
import { Logger } from '@/lib/logger'

export function loggingMiddleware(request: NextRequest) {
  const start = Date.now()
  const response = NextResponse.next()

  // Log the request
  response.headers.set('x-request-id', crypto.randomUUID())
  
  // This runs after the request is processed
  setTimeout(() => {
    Logger.logRequest(
      {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
        ip: request.ip,
      },
      {
        statusCode: response.status,
        get: (header: string) => response.headers.get(header),
      },
      Date.now() - start
    )
  }, 0)

  return response
}
```

### `pino`
**Description:** Super fast, all natural JSON logger.

**Installation:**
```bash
npm install pino pino-pretty
```

**Configuration:**
```typescript
// lib/pino-logger.ts
import pino from 'pino'

// Create logger with environment-specific configuration
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    pid: process.pid,
    hostname: process.env.HOSTNAME || 'unknown',
    service: 'nextjs-app',
    version: process.env.npm_package_version || '1.0.0',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
})

// High-performance logging utilities
export class PinoLogger {
  static child(bindings: Record<string, any>) {
    return logger.child(bindings)
  }

  static withRequest(requestId: string) {
    return logger.child({ requestId })
  }

  static withUser(userId: string) {
    return logger.child({ userId })
  }

  static trace(obj: any, msg?: string) {
    logger.trace(obj, msg)
  }

  static debug(obj: any, msg?: string) {
    logger.debug(obj, msg)
  }

  static info(obj: any, msg?: string) {
    logger.info(obj, msg)
  }

  static warn(obj: any, msg?: string) {
    logger.warn(obj, msg)
  }

  static error(obj: any, msg?: string) {
    logger.error(obj, msg)
  }

  static fatal(obj: any, msg?: string) {
    logger.fatal(obj, msg)
  }
}
```

## Application Performance Monitoring (APM)

### `@sentry/nextjs`
**Description:** Application monitoring and error tracking platform.

**Purpose:**
- Error tracking and alerting
- Performance monitoring
- Release tracking
- User session tracking

**Installation:**
```bash
npm install @sentry/nextjs
```

**Configuration:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  
  // Additional options
  debug: process.env.NODE_ENV === 'development',
  
  beforeSend(event, hint) {
    // Filter out certain errors
    if (event.exception) {
      const error = hint.originalException
      if (error && error.message && error.message.includes('ResizeObserver')) {
        return null // Don't send ResizeObserver errors
      }
    }
    return event
  },
  
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
})

// sentry.edge.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
})
```

**Usage:**
```typescript
// lib/sentry-utils.ts
import * as Sentry from '@sentry/nextjs'

export class SentryLogger {
  static captureException(error: Error, context?: Record<string, any>) {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value)
        })
      }
      Sentry.captureException(error)
    })
  }

  static captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
    Sentry.withScope((scope) => {
      scope.setLevel(level)
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value)
        })
      }
      Sentry.captureMessage(message)
    })
  }

  static setUser(user: { id: string; email?: string; username?: string }) {
    Sentry.setUser(user)
  }

  static addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    })
  }

  static startTransaction(name: string, operation: string) {
    return Sentry.startTransaction({ name, op: operation })
  }

  static measureFunction<T>(name: string, fn: () => T | Promise<T>): T | Promise<T> {
    return Sentry.startSpan({ name }, fn)
  }
}

// Error boundary for React components
export function withSentryErrorBoundary<T extends React.ComponentType<any>>(Component: T): T {
  return Sentry.withErrorBoundary(Component, {
    fallback: ({ error, resetError }) => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We've been notified about this error.</p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      </div>
    ),
    beforeCapture: (scope, error, errorInfo) => {
      scope.setTag('errorBoundary', true)
      scope.setContext('errorInfo', errorInfo)
    },
  }) as T
}
```

### `@opentelemetry/auto-instrumentations-node`
**Description:** OpenTelemetry auto-instrumentation for Node.js applications.

**Installation:**
```bash
npm install @opentelemetry/auto-instrumentations-node @opentelemetry/sdk-node @opentelemetry/exporter-jaeger
```

**Configuration:**
```typescript
// instrumentation.ts (Next.js 13+ App Router)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node')
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node')
    const { Resource } = await import('@opentelemetry/resources')
    const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions')

    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'nextjs-app',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': {
            enabled: false,
          },
        }),
      ],
    })

    sdk.start()
    console.log('OpenTelemetry started')
  }
}

// lib/telemetry.ts
import { trace, context, SpanStatusCode } from '@opentelemetry/api'

const tracer = trace.getTracer('nextjs-app', '1.0.0')

export class Telemetry {
  static async measureAsync<T>(
    name: string,
    operation: () => Promise<T>,
    attributes?: Record<string, string | number | boolean>
  ): Promise<T> {
    return tracer.startActiveSpan(name, { attributes }, async (span) => {
      try {
        const result = await operation()
        span.setStatus({ code: SpanStatusCode.OK })
        return result
      } catch (error) {
        span.setStatus({ 
          code: SpanStatusCode.ERROR, 
          message: error instanceof Error ? error.message : 'Unknown error'
        })
        span.recordException(error as Error)
        throw error
      } finally {
        span.end()
      }
    })
  }

  static measure<T>(
    name: string,
    operation: () => T,
    attributes?: Record<string, string | number | boolean>
  ): T {
    return tracer.startActiveSpan(name, { attributes }, (span) => {
      try {
        const result = operation()
        span.setStatus({ code: SpanStatusCode.OK })
        return result
      } catch (error) {
        span.setStatus({ 
          code: SpanStatusCode.ERROR, 
          message: error instanceof Error ? error.message : 'Unknown error'
        })
        span.recordException(error as Error)
        throw error
      } finally {
        span.end()
      }
    })
  }

  static addEvent(name: string, attributes?: Record<string, string | number | boolean>) {
    const span = trace.getActiveSpan()
    if (span) {
      span.addEvent(name, attributes)
    }
  }

  static setAttributes(attributes: Record<string, string | number | boolean>) {
    const span = trace.getActiveSpan()
    if (span) {
      span.setAttributes(attributes)
    }
  }
}
```

## Security and Vulnerability Scanning

### `@snyk/nodejs-runtime-agent`
**Description:** Runtime security monitoring and vulnerability detection.

**Installation:**
```bash
npm install @snyk/nodejs-runtime-agent
```

**Configuration:**
```typescript
// lib/security-monitoring.ts
import { RuntimeAgent } from '@snyk/nodejs-runtime-agent'

if (process.env.NODE_ENV === 'production' && process.env.SNYK_TOKEN) {
  const agent = new RuntimeAgent({
    projectId: process.env.SNYK_PROJECT_ID,
    beaconUrl: process.env.SNYK_BEACON_URL,
    debug: false,
  })

  agent.start()
  console.log('Snyk runtime agent started')
}

export class SecurityMonitor {
  static reportSecurityEvent(event: string, details: Record<string, any>) {
    // Log security events for monitoring
    console.warn(`Security Event: ${event}`, details)
    
    // Send to security monitoring service
    if (process.env.SECURITY_WEBHOOK_URL) {
      fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          details,
          timestamp: new Date().toISOString(),
          service: 'nextjs-app',
        }),
      }).catch(console.error)
    }
  }

  static validateInput(input: any, schema: any): boolean {
    try {
      schema.parse(input)
      return true
    } catch (error) {
      this.reportSecurityEvent('input_validation_failed', {
        input: typeof input === 'object' ? '[object]' : String(input),
        error: error.message,
      })
      return false
    }
  }

  static detectAnomalousActivity(userId: string, action: string, metadata: Record<string, any>) {
    // Simple rate limiting check
    const key = `${userId}:${action}`
    const now = Date.now()
    
    // This would typically use Redis or a proper rate limiting service
    // For now, we'll just log suspicious activity
    if (metadata.requestCount && metadata.requestCount > 100) {
      this.reportSecurityEvent('anomalous_activity_detected', {
        userId,
        action,
        requestCount: metadata.requestCount,
        timeWindow: metadata.timeWindow,
      })
    }
  }
}
```

### `helmet`
**Description:** Help secure Express/Next.js apps by setting various HTTP headers.

**Installation:**
```bash
npm install helmet
```

**Usage in API Routes:**
```typescript
// lib/security-headers.ts
import helmet from 'helmet'

// Create helmet instance with Next.js specific configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-eval'",
        "'unsafe-inline'",
        "https://vercel.live",
        "https://va.vercel-scripts.com",
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:"],
      connectSrc: ["'self'", "https:"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "same-origin" },
})

// Middleware for Next.js API routes
export function withSecurityHeaders(handler: any) {
  return async (req: any, res: any) => {
    // Apply security headers
    securityHeaders(req, res, () => {})
    
    // Add custom security headers
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    return handler(req, res)
  }
}
```

## Advanced Database and ORM Features

### `prisma` (Advanced Patterns)
**Enhanced usage with enterprise patterns:**

```typescript
// lib/prisma-advanced.ts
import { PrismaClient, Prisma } from '@prisma/client'
import { Logger } from './logger'
import { Telemetry } from './telemetry'

class PrismaService {
  private static instance: PrismaService
  public prisma: PrismaClient

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      errorFormat: 'pretty',
    })

    this.setupEventListeners()
  }

  static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService()
    }
    return PrismaService.instance
  }

  private setupEventListeners() {
    this.prisma.$on('query', (e) => {
      Logger.logDatabaseOperation('query', e.target, e.duration, {
        query: e.query,
        params: e.params,
      })

      // Log slow queries
      if (e.duration > 1000) {
        Logger.warn('Slow query detected', {
          duration: e.duration,
          query: e.query,
          params: e.params,
        })
      }
    })

    this.prisma.$on('error', (e) => {
      Logger.error('Database error', e, {
        target: e.target,
        timestamp: e.timestamp,
      })
    })
  }

  async executeWithTelemetry<T>(
    operation: string,
    query: () => Promise<T>
  ): Promise<T> {
    return Telemetry.measureAsync(
      `db.${operation}`,
      query,
      { component: 'database' }
    )
  }

  // Connection pool monitoring
  async getConnectionInfo() {
    const result = await this.prisma.$queryRaw`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `
    
    return result
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      Logger.error('Database health check failed', error)
      return false
    }
  }

  async disconnect() {
    await this.prisma.$disconnect()
  }
}

export const prismaService = PrismaService.getInstance()
export const prisma = prismaService.prisma

// Repository pattern with advanced features
export abstract class BaseRepository<T> {
  protected abstract model: any

  async findWithCache<K>(
    key: string,
    finder: () => Promise<K>,
    ttl: number = 300
  ): Promise<K> {
    // Implement caching logic here
    return finder()
  }

  async findMany(args?: any): Promise<T[]> {
    return prismaService.executeWithTelemetry(
      `${this.model.name}.findMany`,
      () => this.model.findMany(args)
    )
  }

  async findUnique(args: any): Promise<T | null> {
    return prismaService.executeWithTelemetry(
      `${this.model.name}.findUnique`,
      () => this.model.findUnique(args)
    )
  }

  async create(args: any): Promise<T> {
    return prismaService.executeWithTelemetry(
      `${this.model.name}.create`,
      () => this.model.create(args)
    )
  }

  async update(args: any): Promise<T> {
    return prismaService.executeWithTelemetry(
      `${this.model.name}.update`,
      () => this.model.update(args)
    )
  }

  async delete(args: any): Promise<T> {
    return prismaService.executeWithTelemetry(
      `${this.model.name}.delete`,
      () => this.model.delete(args)
    )
  }

  // Batch operations
  async createMany(args: any): Promise<Prisma.BatchPayload> {
    return prismaService.executeWithTelemetry(
      `${this.model.name}.createMany`,
      () => this.model.createMany(args)
    )
  }

  async updateMany(args: any): Promise<Prisma.BatchPayload> {
    return prismaService.executeWithTelemetry(
      `${this.model.name}.updateMany`,
      () => this.model.updateMany(args)
    )
  }

  async deleteMany(args: any): Promise<Prisma.BatchPayload> {
    return prismaService.executeWithTelemetry(
      `${this.model.name}.deleteMany`,
      () => this.model.deleteMany(args)
    )
  }
}

// Example repository implementation
export class UserRepository extends BaseRepository<any> {
  protected model = prisma.user

  async findByEmail(email: string) {
    return this.findWithCache(
      `user:email:${email}`,
      () => this.model.findUnique({ where: { email } }),
      600 // 10 minutes
    )
  }

  async findActiveUsers() {
    return this.findMany({
      where: { 
        deletedAt: null,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getUserStats() {
    return prismaService.executeWithTelemetry(
      'user.stats',
      async () => {
        const [total, active, recent] = await Promise.all([
          this.model.count(),
          this.model.count({ where: { isActive: true } }),
          this.model.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
              },
            },
          }),
        ])

        return { total, active, recent }
      }
    )
  }
}
```

### `drizzle-orm` (Alternative ORM)
**Description:** TypeScript ORM with zero runtime overhead.

**Installation:**
```bash
npm install drizzle-orm drizzle-kit
npm install --save-dev @types/pg
```

**Configuration:**
```typescript
// lib/drizzle.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(process.env.DATABASE_URL!, {
  max: 1,
  onnotice: (notice) => {
    console.log('PostgreSQL notice:', notice)
  },
})

export const db = drizzle(client, { schema, logger: true })

// Schema definition
// lib/schema.ts
import { pgTable, serial, varchar, timestamp, boolean, text, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: text('password').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

// Usage with advanced patterns
export class DrizzleUserService {
  async createUser(userData: typeof users.$inferInsert) {
    return Telemetry.measureAsync(
      'drizzle.user.create',
      async () => {
        const [user] = await db.insert(users).values(userData).returning()
        Logger.info('User created', { userId: user.id })
        return user
      }
    )
  }

  async findUserWithPosts(userId: number) {
    return Telemetry.measureAsync(
      'drizzle.user.findWithPosts',
      () => db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
        with: {
          posts: {
            where: (posts, { eq }) => eq(posts.published, true),
            orderBy: (posts, { desc }) => desc(posts.createdAt),
          },
        },
      })
    )
  }

  async getUserStats() {
    return Telemetry.measureAsync(
      'drizzle.user.stats',
      async () => {
        const totalUsers = await db.$count(users)
        const activeUsers = await db.$count(users, (users, { eq }) => eq(users.isActive, true))
        
        return { totalUsers, activeUsers }
      }
    )
  }
}
```

## Real-time Communication

### `socket.io`
**Description:** Real-time bidirectional event-based communication.

**Installation:**
```bash
npm install socket.io socket.io-client
npm install --save-dev @types/socket.io
```

**Server Setup:**
```typescript
// lib/socket-server.ts
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { Logger } from './logger'
import { Telemetry } from './telemetry'

export interface ServerToClientEvents {
  notification: (data: { message: string; type: string; userId: string }) => void
  userOnline: (data: { userId: string; timestamp: string }) => void
  userOffline: (data: { userId: string; timestamp: string }) => void
  messageReceived: (data: { id: string; content: string; from: string; to: string }) => void
}

export interface ClientToServerEvents {
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  sendMessage: (data: { content: string; to: string }) => void
  updatePresence: (status: 'online' | 'away' | 'busy') => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  userId: string
  userName: string
  rooms: string[]
}

export class SocketServer {
  private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  private redisClient?: any

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    })

    this.setupRedisAdapter()
    this.setupEventHandlers()
  }

  private async setupRedisAdapter() {
    if (process.env.REDIS_URL) {
      try {
        const pubClient = createClient({ url: process.env.REDIS_URL })
        const subClient = pubClient.duplicate()

        await Promise.all([pubClient.connect(), subClient.connect()])

        this.io.adapter(createAdapter(pubClient, subClient))
        this.redisClient = pubClient

        Logger.info('Socket.IO Redis adapter configured')
      } catch (error) {
        Logger.error('Failed to setup Redis adapter', error)
      }
    }
  }

  private setupEventHandlers() {
    this.io.use(async (socket, next) => {
      try {
        // Authentication middleware
        const token = socket.handshake.auth.token
        const user = await this.authenticateUser(token)
        
        if (!user) {
          throw new Error('Authentication failed')
        }

        socket.data.userId = user.id
        socket.data.userName = user.name
        socket.data.rooms = []

        Logger.info('Socket authenticated', { 
          userId: user.id, 
          socketId: socket.id 
        })
        
        next()
      } catch (error) {
        Logger.error('Socket authentication failed', error)
        next(new Error('Authentication failed'))
      }
    })

    this.io.on('connection', (socket) => {
      this.handleConnection(socket)
    })
  }

  private handleConnection(socket: any) {
    const { userId, userName } = socket.data

    Logger.info('User connected', { userId, socketId: socket.id })

    // Join user to their personal room
    socket.join(`user:${userId}`)

    // Broadcast user online status
    socket.broadcast.emit('userOnline', {
      userId,
      timestamp: new Date().toISOString(),
    })

    // Handle joining rooms
    socket.on('joinRoom', async (roomId: string) => {
      await Telemetry.measureAsync(
        'socket.joinRoom',
        async () => {
          await socket.join(roomId)
          socket.data.rooms.push(roomId)
          
          Logger.info('User joined room', { userId, roomId })
          
          // Notify room members
          socket.to(roomId).emit('notification', {
            message: `${userName} joined the room`,
            type: 'info',
            userId,
          })
        }
      )
    })

    // Handle leaving rooms
    socket.on('leaveRoom', async (roomId: string) => {
      await socket.leave(roomId)
      socket.data.rooms = socket.data.rooms.filter(r => r !== roomId)
      
      Logger.info('User left room', { userId, roomId })
    })

    // Handle messages
    socket.on('sendMessage', async (data) => {
      await Telemetry.measureAsync(
        'socket.sendMessage',
        async () => {
          const message = {
            id: crypto.randomUUID(),
            content: data.content,
            from: userId,
            to: data.to,
            timestamp: new Date().toISOString(),
          }

          // Send to recipient
          socket.to(`user:${data.to}`).emit('messageReceived', message)
          
          // Store message in database
          await this.storeMessage(message)
          
          Logger.info('Message sent', { 
            from: userId, 
            to: data.to, 
            messageId: message.id 
          })
        }
      )
    })

    // Handle presence updates
    socket.on('updatePresence', (status) => {
      socket.broadcast.emit('notification', {
        message: `${userName} is now ${status}`,
        type: 'presence',
        userId,
      })
    })

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      Logger.info('User disconnected', { 
        userId, 
        socketId: socket.id, 
        reason 
      })

      // Broadcast user offline status
      socket.broadcast.emit('userOffline', {
        userId,
        timestamp: new Date().toISOString(),
      })
    })
  }

  private async authenticateUser(token: string) {
    // Implement JWT token validation
    // Return user object or null
    return { id: 'user123', name: 'John Doe' } // Placeholder
  }

  private async storeMessage(message: any) {
    // Implement message storage logic
    Logger.debug('Storing message', { messageId: message.id })
  }

  // Public methods for external use
  sendNotificationToUser(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification)
  }

  sendNotificationToRoom(roomId: string, notification: any) {
    this.io.to(roomId).emit('notification', notification)
  }

  broadcastNotification(notification: any) {
    this.io.emit('notification', notification)
  }

  getUsersInRoom(roomId: string): Promise<string[]> {
    return this.io.in(roomId).allSockets().then(sockets => Array.from(sockets))
  }

  async getConnectedUsers(): Promise<number> {
    const sockets = await this.io.fetchSockets()
    return sockets.length
  }
}
```

**Client Integration:**
```typescript
// lib/socket-client.ts
import { io, Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from './socket-server'

export class SocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 5000,
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('Connected to server')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason)
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnection()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      this.handleReconnection()
    })
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.pow(2, this.reconnectAttempts) * 1000 // Exponential backoff
      
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
        this.socket.connect()
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  // Public methods
  joinRoom(roomId: string) {
    this.socket.emit('joinRoom', roomId)
  }

  leaveRoom(roomId: string) {
    this.socket.emit('leaveRoom', roomId)
  }

  sendMessage(content: string, to: string) {
    this.socket.emit('sendMessage', { content, to })
  }

  updatePresence(status: 'online' | 'away' | 'busy') {
    this.socket.emit('updatePresence', status)
  }

  // Event listeners
  onNotification(callback: (data: any) => void) {
    this.socket.on('notification', callback)
  }

  onMessageReceived(callback: (data: any) => void) {
    this.socket.on('messageReceived', callback)
  }

  onUserOnline(callback: (data: any) => void) {
    this.socket.on('userOnline', callback)
  }

  onUserOffline(callback: (data: any) => void) {
    this.socket.on('userOffline', callback)
  }

  disconnect() {
    this.socket.disconnect()
  }
}

// React hook for Socket.IO
import { useEffect, useState } from 'react'

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<SocketClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (token) {
      const socketClient = new SocketClient(token)
      setSocket(socketClient)

      socketClient.socket.on('connect', () => setIsConnected(true))
      socketClient.socket.on('disconnect', () => setIsConnected(false))

      return () => {
        socketClient.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [token])

  return { socket, isConnected }
}
```

### `@pusher/pusher-http-node`
**Description:** Server-side library for Pusher Channels.

**Installation:**
```bash
npm install @pusher/pusher-http-node pusher-js
```

**Configuration:**
```typescript
// lib/pusher-server.ts
import Pusher from '@pusher/pusher-http-node'

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

export class PusherService {
  static async triggerEvent(
    channel: string,
    event: string,
    data: any,
    socketId?: string
  ) {
    try {
      await pusher.trigger(channel, event, data, { socket_id: socketId })
      Logger.info('Pusher event triggered', { channel, event })
    } catch (error) {
      Logger.error('Failed to trigger Pusher event', error, { channel, event })
      throw error
    }
  }

  static async triggerBatch(events: Array<{ channel: string; name: string; data: any }>) {
    try {
      await pusher.triggerBatch(events)
      Logger.info('Pusher batch events triggered', { count: events.length })
    } catch (error) {
      Logger.error('Failed to trigger Pusher batch events', error)
      throw error
    }
  }

  static async authenticateUser(socketId: string, userData: any) {
    try {
      const auth = pusher.authenticateUser(socketId, userData)
      return auth
    } catch (error) {
      Logger.error('Pusher user authentication failed', error, { socketId })
      throw error
    }
  }

  static async authorizeChannel(socketId: string, channel: string, userData?: any) {
    try {
      const auth = pusher.authorizeChannel(socketId, channel, userData)
      return auth
    } catch (error) {
      Logger.error('Pusher channel authorization failed', error, { socketId, channel })
      throw error
    }
  }
}

// Client-side hook
// hooks/use-pusher.ts
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

export function usePusher() {
  const [pusher, setPusher] = useState<Pusher | null>(null)

  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      },
    })

    setPusher(pusherClient)

    return () => {
      pusherClient.disconnect()
    }
  }, [])

  return pusher
}
```

## Production Monitoring and Health Checks

### Custom Health Check System
```typescript
// lib/health-checks.ts
import { prisma } from './prisma'
import { redis } from './redis'

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded'
  checks: Record<string, {
    status: 'pass' | 'fail' | 'warn'
    responseTime: number
    message?: string
  }>
  timestamp: string
  uptime: number
}

export class HealthChecker {
  private checks = new Map<string, () => Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string }>>()

  constructor() {
    this.registerDefaultChecks()
  }

  private registerDefaultChecks() {
    this.addCheck('database', this.checkDatabase.bind(this))
    this.addCheck('redis', this.checkRedis.bind(this))
    this.addCheck('memory', this.checkMemory.bind(this))
    this.addCheck('disk', this.checkDisk.bind(this))
  }

  addCheck(name: string, check: () => Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string }>) {
    this.checks.set(name, check)
  }

  async runHealthChecks(): Promise<HealthCheckResult> {
    const results: HealthCheckResult['checks'] = {}
    
    for (const [name, check] of this.checks) {
      const start = Date.now()
      try {
        const result = await Promise.race([
          check(),
          new Promise<{ status: 'fail'; message: string }>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
          ),
        ])
        
        results[name] = {
          ...result,
          responseTime: Date.now() - start,
        }
      } catch (error) {
        results[name] = {
          status: 'fail',
          responseTime: Date.now() - start,
          message: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    }

    const overallStatus = this.determineOverallStatus(results)

    return {
      status: overallStatus,
      checks: results,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  }

  private determineOverallStatus(checks: HealthCheckResult['checks']): 'healthy' | 'unhealthy' | 'degraded' {
    const statuses = Object.values(checks).map(check => check.status)
    
    if (statuses.every(status => status === 'pass')) {
      return 'healthy'
    }
    
    if (statuses.some(status => status === 'fail')) {
      return 'unhealthy'
    }
    
    return 'degraded'
  }

  private async checkDatabase(): Promise<{ status: 'pass' | 'fail'; message?: string }> {
    try {
      await prisma.$queryRaw`SELECT 1`
      return { status: 'pass' }
    } catch (error) {
      return { 
        status: 'fail', 
        message: error instanceof Error ? error.message : 'Database connection failed' 
      }
    }
  }

  private async checkRedis(): Promise<{ status: 'pass' | 'fail'; message?: string }> {
    try {
      if (redis) {
        await redis.ping()
        return { status: 'pass' }
      }
      return { status: 'pass', message: 'Redis not configured' }
    } catch (error) {
      return { 
        status: 'fail', 
        message: error instanceof Error ? error.message : 'Redis connection failed' 
      }
    }
  }

  private async checkMemory(): Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string }> {
    const memUsage = process.memoryUsage()
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024
    const heapTotalMB = memUsage.heapTotal / 1024 / 1024
    const usagePercent = (heapUsedMB / heapTotalMB) * 100

    if (usagePercent > 90) {
      return { 
        status: 'fail', 
        message: `Memory usage critical: ${usagePercent.toFixed(1)}%` 
      }
    }
    
    if (usagePercent > 80) {
      return { 
        status: 'warn', 
        message: `Memory usage high: ${usagePercent.toFixed(1)}%` 
      }
    }

    return { status: 'pass' }
  }

  private async checkDisk(): Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string }> {
    try {
      const fs = await import('fs/promises')
      const stats = await fs.statSync('.')
      // This is a simplified check - in production, you'd want more sophisticated disk monitoring
      return { status: 'pass' }
    } catch (error) {
      return { 
        status: 'fail', 
        message: 'Disk check failed' 
      }
    }
  }
}

export const healthChecker = new HealthChecker()

// API route for health checks
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { healthChecker } from '@/lib/health-checks'

export async function GET() {
  const healthResult = await healthChecker.runHealthChecks()
  
  const statusCode = healthResult.status === 'healthy' ? 200 : 
                    healthResult.status === 'degraded' ? 200 : 503

  return NextResponse.json(healthResult, { status: statusCode })
}
```

### Performance Metrics Collection
```typescript
// lib/metrics.ts
import { Logger } from './logger'

export class MetricsCollector {
  private metrics = new Map<string, number[]>()
  private counters = new Map<string, number>()
  private gauges = new Map<string, number>()

  // Histogram for tracking durations
  recordDuration(metric: string, duration: number) {
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, [])
    }
    
    const values = this.metrics.get(metric)!
    values.push(duration)
    
    // Keep only last 1000 values
    if (values.length > 1000) {
      values.shift()
    }
  }

  // Counter for counting events
  incrementCounter(metric: string, value: number = 1) {
    const current = this.counters.get(metric) || 0
    this.counters.set(metric, current + value)
  }

  // Gauge for point-in-time values
  setGauge(metric: string, value: number) {
    this.gauges.set(metric, value)
  }

  // Get statistics for a histogram
  getStats(metric: string): {
    count: number
    min: number
    max: number
    avg: number
    p50: number
    p95: number
    p99: number
  } | null {
    const values = this.metrics.get(metric)
    if (!values || values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    const count = sorted.length

    return {
      count,
      min: sorted[0],
      max: sorted[count - 1],
      avg: sorted.reduce((sum, val) => sum + val, 0) / count,
      p50: sorted[Math.floor(count * 0.5)],
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)],
    }
  }

  // Get all metrics
  getAllMetrics() {
    const histograms: Record<string, any> = {}
    for (const [key] of this.metrics) {
      histograms[key] = this.getStats(key)
    }

    return {
      histograms,
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      timestamp: new Date().toISOString(),
    }
  }

  // Export metrics in Prometheus format
  toPrometheusFormat(): string {
    let output = ''

    // Histograms
    for (const [metric, values] of this.metrics) {
      const stats = this.getStats(metric)
      if (stats) {
        output += `# HELP ${metric}_duration_seconds Duration of ${metric} operations\n`
        output += `# TYPE ${metric}_duration_seconds histogram\n`
        output += `${metric}_duration_seconds_count ${stats.count}\n`
        output += `${metric}_duration_seconds_sum ${values.reduce((sum, val) => sum + val, 0) / 1000}\n`
        output += `${metric}_duration_seconds{quantile="0.5"} ${stats.p50 / 1000}\n`
        output += `${metric}_duration_seconds{quantile="0.95"} ${stats.p95 / 1000}\n`
        output += `${metric}_duration_seconds{quantile="0.99"} ${stats.p99 / 1000}\n`
        output += '\n'
      }
    }

    // Counters
    for (const [metric, value] of this.counters) {
      output += `# HELP ${metric}_total Total number of ${metric}\n`
      output += `# TYPE ${metric}_total counter\n`
      output += `${metric}_total ${value}\n\n`
    }

    // Gauges
    for (const [metric, value] of this.gauges) {
      output += `# HELP ${metric} Current value of ${metric}\n`
      output += `# TYPE ${metric} gauge\n`
      output += `${metric} ${value}\n\n`
    }

    return output
  }

  // Periodic reporting
  startPeriodicReporting(intervalMs: number = 60000) {
    setInterval(() => {
      const metrics = this.getAllMetrics()
      Logger.info('Metrics Report', metrics)
      
      // Update system gauges
      const memUsage = process.memoryUsage()
      this.setGauge('nodejs_memory_heap_used_bytes', memUsage.heapUsed)
      this.setGauge('nodejs_memory_heap_total_bytes', memUsage.heapTotal)
      this.setGauge('nodejs_memory_external_bytes', memUsage.external)
      this.setGauge('nodejs_uptime_seconds', process.uptime())
    }, intervalMs)
  }
}

export const metrics = new MetricsCollector()

// Middleware for automatic metrics collection
export function withMetrics<T extends (...args: any[]) => any>(
  fn: T,
  metricName: string
): T {
  return ((...args: any[]) => {
    const start = Date.now()
    
    try {
      const result = fn(...args)
      
      if (result instanceof Promise) {
        return result
          .then((value) => {
            metrics.recordDuration(metricName, Date.now() - start)
            metrics.incrementCounter(`${metricName}_total`)
            return value
          })
          .catch((error) => {
            metrics.recordDuration(metricName, Date.now() - start)
            metrics.incrementCounter(`${metricName}_errors_total`)
            throw error
          })
      } else {
        metrics.recordDuration(metricName, Date.now() - start)
        metrics.incrementCounter(`${metricName}_total`)
        return result
      }
    } catch (error) {
      metrics.recordDuration(metricName, Date.now() - start)
      metrics.incrementCounter(`${metricName}_errors_total`)
      throw error
    }
  }) as T
}

// Start metrics collection
if (process.env.NODE_ENV === 'production') {
  metrics.startPeriodicReporting()
}
```

## Enterprise Package Configuration

### Package.json Scripts for Enterprise
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    
    "security:audit": "npm audit --audit-level=moderate",
    "security:snyk": "snyk test",
    "security:scan": "snyk code test",
    
    "logs:tail": "tail -f logs/combined.log",
    "logs:error": "tail -f logs/error.log",
    
    "metrics:export": "curl http://localhost:3000/api/metrics",
    "health:check": "curl -f http://localhost:3000/api/health || exit 1",
    
    "db:migrate": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    
    "docker:build": "docker build -t nextjs-enterprise .",
    "docker:run": "docker run -p 3000:3000 --env-file .env.local nextjs-enterprise",
    
    "deploy:staging": "npm run build && npm run docker:build && npm run deploy:push staging",
    "deploy:production": "npm run build && npm run docker:build && npm run deploy:push production",
    
    "start:prod": "NODE_ENV=production npm start",
    "start:cluster": "NODE_ENV=production node cluster.js"
  }
}
```

This comprehensive package reference for Lab 10 covers all the enterprise-grade features needed for production Next.js applications, including advanced logging, APM, security monitoring, database patterns, real-time communication, and production monitoring capabilities.
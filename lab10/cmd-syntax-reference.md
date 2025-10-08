# Command Syntax Reference - Lab 10

## Overview
This lab focuses on advanced Next.js features, production optimization, and enterprise-level deployment strategies. Commands include advanced configuration, monitoring, security hardening, and scalability implementations.

## Commands Used

### Advanced Next.js Configuration

#### Next.js Configuration File Management

##### Advanced next.config.js Configuration
```bash
# Create comprehensive next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Experimental features
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['prisma'],
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['example.com', 'cdn.example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Headers and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects and rewrites
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
EOF
```

##### Environment Configuration Management
```bash
# Create environment-specific configurations
cat > .env.local << EOF
# Development environment
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://user:pass@localhost:5432/dev_db
REDIS_URL=redis://localhost:6379
EOF

cat > .env.production << EOF
# Production environment
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.production.com
DATABASE_URL=postgresql://user:pass@prod-db:5432/prod_db
REDIS_URL=redis://prod-redis:6379
EOF

cat > .env.staging << EOF
# Staging environment
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.staging.com
DATABASE_URL=postgresql://user:pass@staging-db:5432/staging_db
REDIS_URL=redis://staging-redis:6379
EOF
```

### Advanced Build and Optimization Commands

#### Production Build with Analysis

##### Bundle Analysis and Optimization
```bash
# Install advanced analysis tools
npm install --save-dev @next/bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Create bundle analysis script
cat >> package.json << 'EOF'
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "analyze:server": "BUNDLE_ANALYZE=server npm run build",
    "analyze:browser": "BUNDLE_ANALYZE=browser npm run build"
  }
}
EOF

# Run comprehensive bundle analysis
ANALYZE=true npm run build

# Generate detailed webpack stats
npm run build -- --profile --json > webpack-stats.json
npx webpack-bundle-analyzer webpack-stats.json
```

##### Performance Optimization Build
```bash
# Build with maximum optimization
NODE_ENV=production npm run build

# Build with source maps for debugging
GENERATE_SOURCEMAP=true npm run build

# Build with experimental optimizations
NEXT_EXPERIMENTAL_OPTIMIZE=true npm run build

# Build with custom webpack configuration
cat > webpack.config.js << 'EOF'
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
        },
      },
    },
  },
};
EOF
```

### Advanced Database Integration

#### Multi-Database Configuration

##### Prisma Advanced Setup
```bash
# Install Prisma with advanced features
npm install prisma @prisma/client
npm install --save-dev prisma-erd-generator

# Create advanced Prisma schema
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["jsonProtocol", "driverAdapters"]
}

generator erd {
  provider = "prisma-erd-generator"
  output   = "../docs/ERD.svg"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
EOF

# Advanced Prisma commands
npx prisma generate
npx prisma db push
npx prisma migrate dev --name init
npx prisma migrate deploy
npx prisma db seed
```

##### Database Performance Optimization
```bash
# Connection pooling configuration
cat > prisma/client.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=20&pool_timeout=20&connect_timeout=60'
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
EOF

# Database performance monitoring
npx prisma studio
```

### Advanced Caching Strategies

#### Redis Integration

##### Redis Setup and Configuration
```bash
# Install Redis client with advanced features
npm install redis
npm install --save-dev @types/redis

# Create Redis client configuration
cat > lib/redis.ts << 'EOF'
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
  retry_strategy: (times) => Math.min(times * 50, 2000),
});

redis.on('error', (err) => console.log('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));

export default redis;
EOF

# Redis caching utilities
cat > lib/cache.ts << 'EOF'
import redis from './redis';

export async function getFromCache(key: string) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCache(key: string, data: any, ttl: number = 3600) {
  try {
    await redis.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

export async function invalidateCache(pattern: string) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}
EOF
```

##### Advanced Caching Commands
```bash
# Start Redis server with configuration
redis-server --port 6379 --save 60 1000 --loglevel warning

# Redis CLI commands for monitoring
redis-cli info
redis-cli monitor
redis-cli --latency
redis-cli --bigkeys

# Test Redis performance
redis-cli eval "return redis.call('ping')" 0
redis-cli --latency-history -i 1
```

#### CDN and Edge Caching

##### Cloudflare Integration
```bash
# Install Cloudflare utilities
npm install cloudflare

# Configure edge caching headers
cat > middleware.ts << 'EOF'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Set cache headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Set cache headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300');
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
EOF
```

### Security Hardening Commands

#### Advanced Security Configuration

##### Content Security Policy Implementation
```bash
# Install CSP utilities
npm install next-secure-headers

# Create security headers configuration
cat > lib/security.ts << 'EOF'
import { createSecureHeaders } from 'next-secure-headers';

export const secureHeaders = createSecureHeaders({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: "'self'",
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: true,
    },
  },
  forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
  referrerPolicy: "same-origin"
});
EOF
```

##### Rate Limiting Implementation
```bash
# Install rate limiting middleware
npm install express-rate-limit
npm install express-slow-down

# Create rate limiting configuration
cat > lib/rate-limit.ts << 'EOF'
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

export const createRateLimit = (options = {}) => rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  ...options,
});

export const createSpeedLimit = (options = {}) => slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per windowMs without delay
  delayMs: 500, // add 500ms delay per request after delayAfter
  ...options,
});
EOF
```

### Enterprise Monitoring and Observability

#### Comprehensive Logging Setup

##### Structured Logging Implementation
```bash
# Install advanced logging libraries
npm install winston
npm install pino
npm install @axiom-ai/next

# Create logging configuration
cat > lib/logger.ts << 'EOF'
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'nextjs-app' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
EOF

# Create log directory
mkdir -p logs
```

##### APM Integration
```bash
# Install Application Performance Monitoring
npm install @sentry/nextjs
npm install @opentelemetry/api
npm install newrelic

# Configure Sentry
cat > sentry.client.config.js << 'EOF'
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
EOF
```

### Advanced Testing Strategies

#### Integration Testing Setup

##### Advanced Testing Configuration
```bash
# Install comprehensive testing stack
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
npm install --save-dev jest-environment-jsdom
npm install --save-dev @playwright/test
npm install --save-dev vitest @vitejs/plugin-react

# Create advanced Jest configuration
cat > jest.config.js << 'EOF'
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
EOF
```

##### End-to-End Testing Commands
```bash
# Run comprehensive test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run performance tests
npm run test:performance

# Run accessibility tests
npm run test:a11y

# Visual regression testing
npm run test:visual
```

### Production Deployment Optimization

#### Multi-Environment Deployment

##### Docker Multi-Stage Build
```bash
# Create optimized Dockerfile
cat > Dockerfile << 'EOF'
# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
EOF

# Build optimized Docker image
docker build -t nextjs-app:production .

# Multi-architecture build
docker buildx build --platform linux/amd64,linux/arm64 -t nextjs-app:production .
```

##### Kubernetes Deployment
```bash
# Create Kubernetes manifests
cat > k8s/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nextjs-app
  template:
    metadata:
      labels:
        app: nextjs-app
    spec:
      containers:
      - name: nextjs-app
        image: nextjs-app:production
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
EOF

# Deploy to Kubernetes
kubectl apply -f k8s/
kubectl rollout status deployment/nextjs-app
```

### Advanced Monitoring Commands

#### Performance Monitoring

##### Real User Monitoring (RUM)
```bash
# Install RUM libraries
npm install web-vitals
npm install @vercel/analytics

# Create performance monitoring
cat > lib/analytics.ts << 'EOF'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log(metric);
  
  // Example: Send to custom endpoint
  fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metric),
  });
}

export function initWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
EOF
```

##### Infrastructure Monitoring
```bash
# Install monitoring tools
npm install --save-dev clinic
npm install --save-dev autocannon

# Performance profiling
npx clinic doctor -- node server.js
npx clinic bubbleprof -- node server.js
npx clinic flame -- node server.js

# Load testing
npx autocannon -c 10 -d 30 http://localhost:3000

# Memory profiling
node --inspect-brk server.js
```

### Advanced Security Commands

#### Security Scanning and Auditing

##### Vulnerability Scanning
```bash
# Install security scanning tools
npm install --save-dev npm-audit-resolver
npm install --save-dev audit-ci
npm install --save-dev snyk

# Run security audits
npm audit
npm audit fix
npx audit-ci --config audit-ci.json

# Snyk security scanning
npx snyk test
npx snyk monitor

# Static code analysis
npx eslint . --ext .js,.jsx,.ts,.tsx
npx tsc --noEmit
```

##### Security Headers Testing
```bash
# Test security headers
curl -I https://yourapp.com

# Test SSL configuration
ssllabs-scan --host yourapp.com

# Test Content Security Policy
# Use browser dev tools or online CSP evaluator
```

## Troubleshooting Commands

### Advanced Debugging

#### Production Debugging
```bash
# Enable debug mode in production
DEBUG=* npm start

# Node.js inspector in production
node --inspect=0.0.0.0:9229 server.js

# Memory leak detection
node --inspect --expose-gc server.js

# CPU profiling
node --prof server.js
node --prof-process isolate-*.log > processed.txt
```

#### Database Performance Issues
```bash
# Prisma query optimization
npx prisma studio
# Use Prisma Studio to analyze slow queries

# Database connection troubleshooting
npx prisma migrate status
npx prisma db execute --file fix.sql

# Connection pool monitoring
# Monitor connection pool metrics in your monitoring dashboard
```

#### Caching Issues
```bash
# Redis troubleshooting
redis-cli ping
redis-cli info memory
redis-cli monitor

# Clear all caches
redis-cli flushall
rm -rf .next/cache

# CDN cache purging
# Use your CDN provider's API or dashboard
```

### Performance Troubleshooting

#### Bundle Size Issues
```bash
# Analyze bundle size
ANALYZE=true npm run build

# Find large dependencies
npx bundlephobia --analyze package.json

# Tree shaking analysis
npx webpack-bundle-analyzer .next/static/chunks/pages/_app-*.js
```

#### Runtime Performance Issues
```bash
# Profile runtime performance
npm run build
npm start

# Use Chrome DevTools for profiling
# 1. Open Chrome DevTools
# 2. Go to Performance tab
# 3. Record and analyze

# Server-side performance
node --inspect server.js
# Use Chrome DevTools for Node.js debugging
```
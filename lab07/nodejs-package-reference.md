# Node.js Package Reference - Lab 07

## Overview
This lab focuses on performance optimization, caching strategies, and advanced Next.js features like Image optimization, bundle analysis, and monitoring. It introduces packages for performance monitoring, caching, optimization analysis, and production-ready performance enhancements.

## Bundle Analysis and Optimization

### `@next/bundle-analyzer`
**Description:** Webpack bundle analyzer plugin for Next.js.

**Purpose:**
- Visualize bundle composition
- Identify large dependencies
- Optimize bundle sizes
- Analyze code splitting effectiveness

**Installation:**
```bash
npm install --save-dev @next/bundle-analyzer
```

**Setup:**
```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config
}

module.exports = withBundleAnalyzer(nextConfig)
```

**Usage:**
```bash
# Analyze bundle
ANALYZE=true npm run build

# Add to package.json scripts
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### `webpack-bundle-analyzer`
**Description:** Visualize size of webpack output files with an interactive zoomable treemap.

**Installation:**
```bash
npm install --save-dev webpack-bundle-analyzer
```

**Usage:**
```javascript
// next.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      )
    }
    return config
  },
}
```

### `source-map-explorer`
**Description:** Analyze and debug space usage through source maps.

**Installation:**
```bash
npm install --save-dev source-map-explorer
```

**Usage:**
```bash
# Build with source maps
npm run build

# Analyze source maps
npx source-map-explorer .next/static/chunks/*.js
```

## Performance Monitoring

### `web-vitals`
**Description:** Essential metrics for a healthy site.

**Purpose:**
- Core Web Vitals monitoring
- Performance metrics collection
- Real user monitoring (RUM)
- SEO performance tracking

**Installation:**
```bash
npm install web-vitals
```

**Usage:**
```typescript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  const body = JSON.stringify(metric)
  
  // Example: Send to Google Analytics
  if ('gtag' in window) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }
  
  // Example: Send to custom analytics endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body)
  } else {
    fetch('/api/analytics', { body, method: 'POST' })
  }
}

export function reportWebVitals() {
  getCLS(sendToAnalytics)
  getFID(sendToAnalytics)
  getFCP(sendToAnalytics)
  getLCP(sendToAnalytics)
  getTTFB(sendToAnalytics)
}

// app/layout.tsx
'use client'
import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/web-vitals'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    reportWebVitals()
  }, [])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### `@vercel/analytics`
**Description:** Privacy-friendly analytics for Vercel deployments.

**Installation:**
```bash
npm install @vercel/analytics
```

**Usage:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### `@vercel/speed-insights`
**Description:** Real user monitoring for Core Web Vitals.

**Installation:**
```bash
npm install @vercel/speed-insights
```

**Usage:**
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## Caching and State Management

### `redis`
**Description:** Node.js client for Redis, an in-memory data structure store.

**Purpose:**
- Application-level caching
- Session storage
- Rate limiting
- Real-time features

**Installation:**
```bash
npm install redis
npm install --save-dev @types/redis
```

**Setup:**
```typescript
// lib/redis.ts
import { createClient } from 'redis'

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined
}

export const redis = globalForRedis.redis ?? createClient({
  url: process.env.REDIS_URL,
  retry_strategy: (times) => Math.min(times * 50, 2000),
})

redis.on('error', (err) => console.error('Redis Client Error', err))
redis.on('connect', () => console.log('Redis Client Connected'))

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

if (!redis.isOpen) {
  redis.connect()
}
```

**Caching Utilities:**
```typescript
// lib/cache.ts
import { redis } from './redis'

export class Cache {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  static async set(key: string, data: any, ttl: number = 3600): Promise<void> {
    try {
      await redis.setEx(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(keys)
      }
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }
}

// Usage in API routes
export async function GET() {
  const cacheKey = 'posts:all'
  
  // Try to get from cache first
  let posts = await Cache.get(cacheKey)
  
  if (!posts) {
    // Fetch from database
    posts = await prisma.post.findMany()
    
    // Cache for 1 hour
    await Cache.set(cacheKey, posts, 3600)
  }
  
  return Response.json(posts)
}
```

### `@tanstack/react-query` (Enhanced for Caching)
**Enhanced usage for performance:**

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false
        return failureCount < 3
      },
    },
  },
})

// hooks/use-posts.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(res => res.json()),
    staleTime: 5 * 60 * 1000,
  })
}

export function useInvalidatePosts() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }
}

// Prefetching for performance
export function usePrefetchPost(id: string) {
  const queryClient = useQueryClient()
  
  const prefetchPost = () => {
    queryClient.prefetchQuery({
      queryKey: ['post', id],
      queryFn: () => fetch(`/api/posts/${id}`).then(res => res.json()),
      staleTime: 5 * 60 * 1000,
    })
  }
  
  return prefetchPost
}
```

### `swr` (Enhanced with Performance Features)
**Enhanced usage for performance:**

```typescript
// lib/swr-config.ts
import { SWRConfig } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        loadingTimeout: 10000,
        onError: (error) => {
          console.error('SWR Error:', error)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}

// hooks/use-cached-data.ts
import useSWR, { mutate } from 'swr'

export function useCachedPosts() {
  return useSWR('/api/posts', {
    refreshInterval: 30000, // 30 seconds
    dedupingInterval: 2000, // 2 seconds
  })
}

export function revalidatePosts() {
  return mutate('/api/posts')
}

// Preload data
export function preloadPosts() {
  return mutate('/api/posts', fetch('/api/posts').then(res => res.json()))
}
```

## Image Optimization

### `sharp` (Next.js Built-in)
**Description:** High-performance image processing library (built into Next.js).

**Purpose:**
- Image resizing and optimization
- Format conversion (WebP, AVIF)
- Quality optimization
- Automatic optimization

**Usage with Next.js Image:**
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig
```

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}

export function OptimizedImage({ src, alt, width, height, priority = false }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyKKLOJDbPGHgCfvCOWy9cyxGAQQRCCN56CDBXqfXSUDwRBBGgBBIGAC1BLu"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### `next-optimized-images` (Alternative/Additional)
**Description:** Advanced image optimization for Next.js.

**Installation:**
```bash
npm install --save-dev next-optimized-images imagemin-mozjpeg imagemin-pngquant
```

**Configuration:**
```javascript
// next.config.js
const withOptimizedImages = require('next-optimized-images')

module.exports = withOptimizedImages({
  mozjpeg: {
    quality: 85,
  },
  pngquant: {
    quality: [0.65, 0.8],
  },
  webp: {
    quality: 85,
  },
})
```

## Build Performance

### `@swc/core` (Built into Next.js)
**Description:** Rust-based platform for web development (built into Next.js 12+).

**Purpose:**
- Fast TypeScript/JavaScript compilation
- Minification
- React transformation
- Better performance than Babel

**Configuration:**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // Enable SWC minifier
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
```

### `esbuild` (Alternative Build Tool)
**Description:** Extremely fast JavaScript bundler and minifier.

**Installation:**
```bash
npm install --save-dev esbuild
```

**Usage for build scripts:**
```javascript
// scripts/build.js
const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true,
  target: ['chrome60', 'firefox60', 'safari11', 'edge18'],
}).catch(() => process.exit(1))
```

## Runtime Performance

### `react-window`
**Description:** Efficiently rendering large lists and tabular data.

**Purpose:**
- Virtual scrolling
- Performance optimization for large datasets
- Memory efficiency
- Smooth scrolling experience

**Installation:**
```bash
npm install react-window
npm install --save-dev @types/react-window
```

**Usage:**
```typescript
import { FixedSizeList as List } from 'react-window'

interface ItemData {
  items: any[]
}

interface ItemProps {
  index: number
  style: React.CSSProperties
  data: ItemData
}

const Item = ({ index, style, data }: ItemProps) => (
  <div style={style}>
    <div className="p-4 border-b">
      {data.items[index].name}
    </div>
  </div>
)

export function VirtualizedList({ items }: { items: any[] }) {
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      itemData={{ items }}
      width="100%"
    >
      {Item}
    </List>
  )
}
```

### `react-virtualized` (Alternative)
**Description:** Efficiently rendering large lists and tabular data.

**Installation:**
```bash
npm install react-virtualized
npm install --save-dev @types/react-virtualized
```

**Usage:**
```typescript
import { List, AutoSizer } from 'react-virtualized'

export function VirtualizedGrid({ items }: { items: any[] }) {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style} className="flex items-center p-4 border-b">
      <div>{items[index].name}</div>
    </div>
  )

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          width={width}
          rowCount={items.length}
          rowHeight={80}
          rowRenderer={rowRenderer}
        />
      )}
    </AutoSizer>
  )
}
```

## Code Splitting and Lazy Loading

### Dynamic Imports (Built into Next.js)
```typescript
// Dynamic component loading
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering
})

// Dynamic loading with named export
const DynamicChart = dynamic(() => import('./Chart').then(mod => ({ default: mod.Chart })), {
  loading: () => <div>Loading chart...</div>,
})

// Conditional loading
export function ConditionalComponent({ showChart }: { showChart: boolean }) {
  const Chart = useMemo(() => {
    if (!showChart) return null
    return dynamic(() => import('./Chart'), {
      loading: () => <div>Loading chart...</div>,
    })
  }, [showChart])

  return (
    <div>
      {showChart && Chart && <Chart />}
    </div>
  )
}
```

### `@loadable/component` (Alternative)
**Description:** React code splitting made easy.

**Installation:**
```bash
npm install @loadable/component
npm install --save-dev @types/loadable__component
```

**Usage:**
```typescript
import loadable from '@loadable/component'

const AsyncComponent = loadable(() => import('./HeavyComponent'), {
  fallback: <div>Loading...</div>
})

// With props
const AsyncComponentWithProps = loadable(
  (props: { type: string }) => import(`./components/${props.type}`),
  {
    fallback: <div>Loading component...</div>
  }
)
```

## Development Performance Tools

### `why-did-you-render`
**Description:** Notify about potentially avoidable re-renders.

**Installation:**
```bash
npm install --save-dev @welldone-software/why-did-you-render
```

**Setup:**
```typescript
// scripts/wdyr.ts (development only)
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render')
    whyDidYouRender(React, {
      trackAllPureComponents: true,
    })
  }
}

// app/layout.tsx (development)
if (process.env.NODE_ENV === 'development') {
  require('../scripts/wdyr')
}
```

### `react-devtools-profiler`
**Description:** Profiling React applications (built into React DevTools).

**Usage:**
```typescript
// Enable profiler in development
export function ProfiledComponent({ children }: { children: React.ReactNode }) {
  return (
    <Profiler
      id="ProfiledComponent"
      onRender={(id, phase, actualDuration) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`${id} (${phase}) took ${actualDuration}ms`)
        }
      }}
    >
      {children}
    </Profiler>
  )
}
```

## Memory and Performance Monitoring

### `memwatch-next`
**Description:** Memory usage monitoring.

**Installation:**
```bash
npm install --save-dev memwatch-next
```

**Usage:**
```typescript
// lib/memory-monitor.ts (development only)
if (process.env.NODE_ENV === 'development') {
  const memwatch = require('memwatch-next')

  memwatch.on('leak', (info: any) => {
    console.warn('Memory leak detected:', info)
  })

  memwatch.on('stats', (stats: any) => {
    console.log('Memory stats:', stats)
  })
}
```

### Performance Profiling Utilities
```typescript
// lib/performance.ts
export class PerformanceProfiler {
  private static markers = new Map<string, number>()

  static start(label: string): void {
    this.markers.set(label, performance.now())
  }

  static end(label: string): number {
    const start = this.markers.get(label)
    if (!start) {
      console.warn(`No start marker found for ${label}`)
      return 0
    }

    const duration = performance.now() - start
    this.markers.delete(label)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${label}: ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }

  static measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    this.end(label)
    return result
  }

  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    const result = await fn()
    this.end(label)
    return result
  }
}

// Usage
const data = await PerformanceProfiler.measureAsync('fetchUsers', async () => {
  return fetch('/api/users').then(res => res.json())
})
```

## Production Optimization

### Compression and Minification
```javascript
// next.config.js
const withPlugins = require('next-compose-plugins')

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Replace React with Preact in production (optional)
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }
    
    return config
  },
  
  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    gzipSize: true,
  },
}

module.exports = nextConfig
```

### CDN and Edge Optimization
```typescript
// lib/cdn.ts
export function getCDNUrl(path: string, transforms?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_CDN_URL || ''
  const transformParams = transforms ? `?${transforms}` : ''
  return `${baseUrl}${path}${transformParams}`
}

// Usage for images
export function OptimizedCDNImage({ src, alt, width, height }: ImageProps) {
  const cdnSrc = getCDNUrl(src, `w=${width}&h=${height}&q=85&f=webp`)
  
  return (
    <img
      src={cdnSrc}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  )
}
```

## Common Performance Patterns

### Memoization Strategies
```typescript
import { memo, useMemo, useCallback } from 'react'

// Component memoization
export const ExpensiveComponent = memo(function ExpensiveComponent({ 
  data, 
  onUpdate 
}: {
  data: any[]
  onUpdate: (id: string) => void
}) {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveComputation(item)
    }))
  }, [data])

  // Memoize callbacks
  const handleUpdate = useCallback((id: string) => {
    onUpdate(id)
  }, [onUpdate])

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleUpdate(item.id)}>
          {item.computed}
        </div>
      ))}
    </div>
  )
})

// Custom hook memoization
export function useExpensiveData(input: string) {
  return useMemo(() => {
    return expensiveDataProcessing(input)
  }, [input])
}
```

### Performance Best Practices
```typescript
// ✅ Optimize re-renders
const OptimizedList = memo(({ items, onItemClick }) => {
  return (
    <div>
      {items.map(item => (
        <OptimizedListItem 
          key={item.id} 
          item={item} 
          onClick={onItemClick}
        />
      ))}
    </div>
  )
})

// ✅ Use stable keys
items.map(item => <Item key={item.id} data={item} />)

// ❌ Avoid unstable keys
items.map((item, index) => <Item key={index} data={item} />)

// ✅ Debounce expensive operations
const debouncedSearch = useMemo(
  () => debounce((query: string) => performSearch(query), 300),
  []
)
```
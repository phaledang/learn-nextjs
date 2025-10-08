# Command Syntax Reference - Lab 07

## Overview
This lab focuses on performance optimization, caching strategies, and advanced Next.js features like Image optimization, lazy loading, and bundle analysis. Commands include performance monitoring, caching testing, and optimization analysis.

## Commands Used

### Performance Analysis Commands

#### `npm run build`
Creates optimized production build with detailed performance metrics.

**Enhanced build analysis for this lab:**
```bash
# Build with bundle analysis
npm run build

# Build with detailed webpack stats
npm run build -- --profile

# Build with analyzer (if configured)
ANALYZE=true npm run build
```

**Build output analysis:**
- Bundle sizes and chunks
- Image optimization results
- Static generation performance
- Tree-shaking effectiveness

#### Bundle Analyzer Installation and Usage

##### Webpack Bundle Analyzer
```bash
# Install webpack bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Configure in next.config.js and run
ANALYZE=true npm run build

# Alternative: Manual analysis
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer .next/static/chunks/
```

##### Alternative Bundle Analyzers
```bash
# Install and use bundle-stats
npm install --save-dev bundle-stats-webpack-plugin

# Install and use source-map-explorer
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer .next/static/chunks/*.js
```

### Performance Monitoring Commands

#### Lighthouse Testing
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run Lighthouse audit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Run specific audits
lighthouse http://localhost:3000 --only-categories=performance --output json

# Run with custom config
lighthouse http://localhost:3000 --config-path=lighthouse-config.js
```

#### Web Vitals Monitoring
```bash
# Install web vitals library
npm install web-vitals

# Start development server and monitor vitals
npm run dev
# Check browser console for Core Web Vitals
```

#### Performance Testing with Artillery
```bash
# Install artillery for load testing
npm install -g artillery

# Basic performance test
artillery quick --count 50 --num 10 http://localhost:3000

# Test with artillery config
artillery run performance-test.yml

# Test specific pages
artillery quick --count 20 --num 5 http://localhost:3000/heavy-page
```

### Image Optimization Commands

#### Next.js Image Optimization Testing

##### Testing Image Optimization
```bash
# Start development server
npm run dev

# Test image optimization endpoints:
# http://localhost:3000/_next/image?url=/image.jpg&w=640&q=75
# http://localhost:3000/_next/image?url=/image.jpg&w=828&q=75
```

##### Image Optimization Analysis
```bash
# Check image optimization in build
npm run build
# Look for image optimization statistics in build output

# Test different image formats
curl -H "Accept: image/webp" http://localhost:3000/_next/image?url=/test.jpg&w=640&q=75
curl -H "Accept: image/avif" http://localhost:3000/_next/image?url=/test.jpg&w=640&q=75
```

#### Image Processing Tools

##### Sharp (Next.js default optimizer)
```bash
# Sharp is installed automatically with Next.js
# To manually install/upgrade:
npm install sharp

# Test sharp installation
node -e "const sharp = require('sharp'); console.log('Sharp version:', sharp.versions)"
```

##### ImageMagick (alternative)
```bash
# Install ImageMagick (system dependency)
# Windows: Download from imagemagick.org
# macOS: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Test ImageMagick installation
magick -version
```

### Caching Commands

#### HTTP Caching Testing

##### Cache Headers Testing
```bash
# Test cache headers
curl -I http://localhost:3000/static/image.jpg

# Test with specific cache headers
curl -H "Cache-Control: no-cache" http://localhost:3000/api/data

# Test ETags
curl -H "If-None-Match: \"etag-value\"" http://localhost:3000/api/data

# Test conditional requests
curl -H "If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT" http://localhost:3000/api/data
```

##### Service Worker Caching (if implemented)
```bash
# Start development server
npm run dev

# Test service worker registration
# Open browser dev tools > Application > Service Workers

# Test cache storage
# Browser dev tools > Application > Storage > Cache Storage
```

#### Redis Caching (if implemented)

##### Redis Installation and Setup
```bash
# Install Redis CLI tools
# Windows: Download Redis from GitHub or use WSL
# macOS: brew install redis
# Linux: sudo apt-get install redis-server

# Start Redis server
redis-server

# Test Redis connection
redis-cli ping
# Should respond with "PONG"
```

##### Redis Caching Commands
```bash
# Install Redis client for Node.js
npm install redis

# Test Redis caching in application
node -e "
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => {
  console.log('Redis connected');
  client.set('test', 'value').then(() => {
    client.get('test').then(value => {
      console.log('Retrieved:', value);
      client.disconnect();
    });
  });
});
"
```

#### Memory Caching Testing
```bash
# Install memory caching libraries
npm install node-cache

# Test in-memory caching
node -e "
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 600});
cache.set('test', 'cached value');
console.log('Cached value:', cache.get('test'));
"
```

### Static Generation and ISR Commands

#### Static Site Generation (SSG) Testing

##### Generate Static Pages
```bash
# Build with static generation
npm run build

# Check generated static files
ls -la .next/server/app/           # macOS/Linux
dir .next\server\app\              # Windows

# Test static page serving
npm run start
curl http://localhost:3000/static-page
```

##### Static Generation Analysis
```bash
# Build and analyze static generation
npm run build
# Look for:
# - ○ Static pages
# - ● SSG pages
# - λ Server-side rendered pages
# - ISR pages with revalidation times
```

#### Incremental Static Regeneration (ISR) Testing

##### ISR Configuration Testing
```bash
# Build with ISR pages
npm run build
npm run start

# Test ISR revalidation
curl http://localhost:3000/isr-page
# Wait for revalidation time
curl http://localhost:3000/isr-page
# Check if page was regenerated
```

##### ISR Performance Testing
```bash
# Test ISR performance under load
for i in {1..10}; do
  curl -w "Time: %{time_total}s, Status: %{http_code}\n" \
    http://localhost:3000/isr-page &
done
wait
```

### Code Splitting and Lazy Loading Commands

#### Dynamic Import Testing

##### Test Dynamic Imports
```bash
# Start development server
npm run dev

# Test lazy loading in browser dev tools:
# 1. Network tab
# 2. Navigate to page with dynamic imports
# 3. Check for chunk loading
```

##### Bundle Splitting Analysis
```bash
# Build and analyze chunk splitting
npm run build

# Check chunk files
ls -la .next/static/chunks/        # macOS/Linux
dir .next\static\chunks\           # Windows

# Analyze chunk sizes
du -h .next/static/chunks/*        # macOS/Linux
```

#### Route-based Code Splitting
```bash
# Test route-based splitting
npm run build

# Check route-specific chunks
ls -la .next/static/chunks/app/    # macOS/Linux
dir .next\static\chunks\app\       # Windows
```

### Database Performance Commands

#### Database Query Optimization

##### Prisma Performance (if using Prisma)
```bash
# Install Prisma
npm install prisma @prisma/client

# Generate Prisma client with optimization
npx prisma generate

# Run database performance queries
npx prisma studio
# Use Prisma Studio to analyze query performance
```

##### Database Connection Pooling
```bash
# Test database connection pooling
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=10&pool_timeout=20'
    }
  }
});
console.log('Database configured with connection pooling');
"
```

#### Query Performance Testing
```bash
# Time database queries
time curl http://localhost:3000/api/slow-query

# Test query caching
curl http://localhost:3000/api/cached-query
curl http://localhost:3000/api/cached-query  # Should be faster
```

### Memory and Resource Monitoring

#### Memory Usage Monitoring

##### Node.js Memory Monitoring
```bash
# Start with memory monitoring
node --inspect npm run dev

# Monitor memory usage
node -e "
setInterval(() => {
  const used = process.memoryUsage();
  console.log('Memory usage:', {
    rss: Math.round(used.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(used.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(used.heapUsed / 1024 / 1024) + ' MB'
  });
}, 5000);
"
```

##### Memory Leak Detection
```bash
# Install memory leak detection tools
npm install --save-dev clinic

# Run with clinic doctor
npx clinic doctor -- node server.js

# Run with clinic bubbleprof
npx clinic bubbleprof -- node server.js
```

#### CPU Profiling
```bash
# Profile CPU usage
node --prof npm run dev

# Analyze profile after stopping
node --prof-process isolate-*.log > processed.txt

# Use clinic flame for flame graphs
npx clinic flame -- node server.js
```

### CDN and Asset Optimization Commands

#### CDN Testing

##### Test CDN Configuration
```bash
# Test static asset delivery
curl -I http://localhost:3000/_next/static/css/app.css

# Test image CDN (if configured)
curl -I http://localhost:3000/_next/image?url=/image.jpg&w=640&q=75

# Test with different geographic locations (using VPN or proxy)
curl --proxy socks5://proxy-server:port http://localhost:3000/
```

#### Asset Compression Testing

##### Gzip/Brotli Testing
```bash
# Test gzip compression
curl -H "Accept-Encoding: gzip" -I http://localhost:3000/

# Test brotli compression
curl -H "Accept-Encoding: br" -I http://localhost:3000/

# Compare compression ratios
curl -H "Accept-Encoding: gzip" http://localhost:3000/ | wc -c
curl http://localhost:3000/ | wc -c
```

##### Asset Minification Testing
```bash
# Check minified assets
ls -la .next/static/css/          # CSS files
ls -la .next/static/chunks/       # JS files

# Compare sizes
du -h .next/static/css/*
du -h .next/static/chunks/*
```

### Production Performance Commands

#### Production Build Optimization

##### Production Build Analysis
```bash
# Build for production with analysis
NODE_ENV=production npm run build

# Test production performance
NODE_ENV=production npm run start

# Compare development vs production
npm run dev &
sleep 5
time curl http://localhost:3000/
kill %1

npm run start &
sleep 5
time curl http://localhost:3000/
kill %1
```

##### Production Monitoring
```bash
# Install production monitoring tools
npm install --save-dev autocannon

# Load test production build
npm run build
npm run start &
npx autocannon -c 10 -d 30 http://localhost:3000/
kill %1
```

### Debugging Performance Issues

#### Performance Debugging Commands

##### React DevTools Profiler
```bash
# Start development server
npm run dev

# Use React DevTools Profiler:
# 1. Install React DevTools browser extension
# 2. Open browser dev tools
# 3. Go to Profiler tab
# 4. Record performance session
# 5. Analyze component render times
```

##### Network Performance Analysis
```bash
# Monitor network performance
npm run dev

# Use browser dev tools Network tab:
# 1. Clear cache and hard reload
# 2. Check waterfall chart
# 3. Analyze resource timing
# 4. Check for render-blocking resources
```

#### Memory Leak Debugging
```bash
# Debug memory leaks in browser
npm run dev

# Use browser dev tools Memory tab:
# 1. Take heap snapshots
# 2. Compare snapshots over time
# 3. Look for increasing memory usage
# 4. Identify memory leak sources
```

## Troubleshooting Commands

### Performance Issues

#### Slow Build Times
```bash
# Analyze build performance
time npm run build

# Check for large dependencies
npm ls --depth=0 | grep -E "[0-9]+\.[0-9]+\.[0-9]+"

# Clean build cache
rm -rf .next
npm run build
```

#### Slow Runtime Performance
```bash
# Profile runtime performance
npm run build
npm run start

# Test with different Node.js versions
nvm use 18
npm run start
nvm use 20
npm run start
```

#### Large Bundle Sizes
```bash
# Analyze bundle composition
ANALYZE=true npm run build

# Check for duplicate dependencies
npx duplicate-package-checker

# Tree shake unused code
npm run build
# Check webpack output for unused exports
```

### Image Optimization Issues

#### Image Loading Problems
```bash
# Test image optimization
curl -I http://localhost:3000/_next/image?url=/test.jpg&w=640&q=75

# Check image formats support
curl -H "Accept: image/webp,*/*" -I http://localhost:3000/_next/image?url=/test.jpg&w=640&q=75

# Debug image processing
DEBUG=sharp npm run dev
```

### Caching Issues

#### Cache Invalidation Problems
```bash
# Clear all caches
rm -rf .next
npm cache clean --force

# Test cache behavior
curl -I http://localhost:3000/cached-page
curl -I http://localhost:3000/cached-page  # Should show cache hit

# Force cache refresh
curl -H "Cache-Control: no-cache" http://localhost:3000/cached-page
```
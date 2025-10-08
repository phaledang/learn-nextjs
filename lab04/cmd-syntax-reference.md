# Command Syntax Reference - Lab 04

## Overview
This lab focuses on advanced Next.js features including dynamic routing, data fetching, and API routes. Commands include development server operations, testing API endpoints, and debugging data flow.

## Commands Used

### Development Server Commands

#### `npm run dev`
Starts development server with enhanced API and routing capabilities.

**Enhanced features for this lab:**
- API route hot reloading
- Dynamic route debugging
- Data fetching visualization
- Server-side rendering preview

**Testing specific features:**
```bash
# Start development server
npm run dev

# Test API routes at:
# http://localhost:3000/api/users
# http://localhost:3000/api/posts/[id]
```

### API Testing Commands

#### `curl` (Command Line API Testing)
Test API routes directly from command line.

**Syntax:**
```bash
curl [options] <url>
```

**Examples:**
```bash
# Test GET request
curl http://localhost:3000/api/users

# Test with headers
curl -H "Content-Type: application/json" http://localhost:3000/api/users

# Test POST request
curl -X POST -H "Content-Type: application/json" -d '{"name":"John"}' http://localhost:3000/api/users

# Test PUT request
curl -X PUT -H "Content-Type: application/json" -d '{"name":"Jane"}' http://localhost:3000/api/users/1

# Test DELETE request
curl -X DELETE http://localhost:3000/api/users/1

# Save response to file
curl http://localhost:3000/api/users > response.json
```

#### PowerShell Web Requests (Windows Alternative)
```powershell
# GET request
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET

# POST request
$body = @{name="John"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -Body $body -ContentType "application/json"

# PUT request
$body = @{name="Jane"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method PUT -Body $body -ContentType "application/json"

# DELETE request
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method DELETE
```

### Database/Data Commands

#### JSON Server (if using external data)
```bash
# Install JSON Server globally
npm install -g json-server

# Start JSON server with data file
json-server --watch db.json --port 3001

# Start with custom routes
json-server --watch db.json --routes routes.json --port 3001
```

#### Mock Data Commands
```bash
# Generate mock data using Node.js
node scripts/generate-data.js

# Seed database (if using actual database)
npm run db:seed

# Reset data
npm run db:reset
```

### Build and Production Commands

#### `npm run build`
Creates production build with API routes and dynamic routing.

**What's optimized:**
- API route bundling
- Dynamic route pre-rendering
- Data fetching optimization
- ISR (Incremental Static Regeneration) setup

**Build analysis for this lab:**
```bash
npm run build
# Look for:
# - API routes compilation
# - Dynamic route generation
# - Build warnings about data fetching
```

#### `npm run start`
Starts production server to test API routes and dynamic routing.

**Testing in production mode:**
```bash
npm run build
npm run start

# Test API routes work in production
curl http://localhost:3000/api/users

# Test dynamic routes
# Visit: http://localhost:3000/posts/1, /posts/2, etc.
```

## Dynamic Routing Commands

### Route Testing

#### Testing Dynamic Routes
```bash
# Start development server
npm run dev

# Test dynamic routes in browser:
# /posts/1
# /posts/2
# /users/john
# /products/electronics/laptop
```

#### Route Debugging
```bash
# Check route parameters in browser console
npm run dev
# Open browser dev tools > Console
# Check router.query object
```

### File Structure Commands

#### Creating Dynamic Routes
```bash
# Create dynamic route directories
mkdir -p app/posts/[id]
mkdir -p app/users/[username]
mkdir -p app/products/[...slug]

# Create page files
# app/posts/[id]/page.tsx
# app/users/[username]/page.tsx
# app/products/[...slug]/page.tsx
```

#### Creating API Routes
```bash
# Create API directory structure
mkdir -p app/api/users
mkdir -p app/api/posts/[id]

# Create API route files
# app/api/users/route.ts
# app/api/posts/[id]/route.ts
```

## Data Fetching Commands

### Server-Side Data Fetching Testing

#### Testing SSR (Server-Side Rendering)
```bash
# Start development server
npm run dev

# Check network tab in browser dev tools
# Look for server-rendered HTML content
# No client-side data fetching loading states
```

#### Testing SSG (Static Site Generation)
```bash
# Build to generate static pages
npm run build

# Check .next/server/app for generated HTML files
ls .next/server/app/           # macOS/Linux
dir .next\server\app\          # Windows
```

#### Testing ISR (Incremental Static Regeneration)
```bash
# Build with ISR pages
npm run build
npm run start

# Test ISR revalidation
curl http://localhost:3000/posts/1
# Wait for revalidation time
curl http://localhost:3000/posts/1
```

### Client-Side Data Fetching

#### Testing SWR/React Query (if implemented)
```bash
# Start development server
npm run dev

# Check browser network tab for:
# - Initial data fetching
# - Cache behavior
# - Revalidation requests
```

## Database Commands (if applicable)

### SQL Database Commands

#### SQLite (if using)
```bash
# Install SQLite CLI
npm install -g sqlite3

# Connect to database
sqlite3 database.db

# Basic SQL commands
.tables
.schema users
SELECT * FROM users;
```

#### PostgreSQL (if using)
```bash
# Connect to database
psql -h localhost -d myapp -U username

# Basic commands
\dt                    # List tables
\d users              # Describe users table
SELECT * FROM users;
```

### NoSQL Database Commands

#### MongoDB (if using)
```bash
# Start MongoDB locally
mongod

# Connect with MongoDB shell
mongo

# Basic commands
show dbs
use myapp
show collections
db.users.find()
```

## API Development Commands

### HTTP Method Testing

#### Testing All HTTP Methods
```bash
# GET
curl http://localhost:3000/api/users

# POST
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}' \
  http://localhost:3000/api/users

# PUT
curl -X PUT -H "Content-Type: application/json" \
  -d '{"name":"John Updated","email":"john.updated@example.com"}' \
  http://localhost:3000/api/users/1

# PATCH
curl -X PATCH -H "Content-Type: application/json" \
  -d '{"name":"John Patched"}' \
  http://localhost:3000/api/users/1

# DELETE
curl -X DELETE http://localhost:3000/api/users/1
```

#### Response Testing
```bash
# Test response headers
curl -I http://localhost:3000/api/users

# Test response with verbose output
curl -v http://localhost:3000/api/users

# Test response time
curl -w "@curl-format.txt" http://localhost:3000/api/users
```

### Error Handling Testing

#### Testing Error Responses
```bash
# Test 404 errors
curl http://localhost:3000/api/nonexistent

# Test validation errors
curl -X POST -H "Content-Type: application/json" \
  -d '{"invalid":"data"}' \
  http://localhost:3000/api/users

# Test server errors
curl http://localhost:3000/api/error-test
```

## Performance Testing Commands

### Load Testing

#### Basic Load Testing with ab (Apache Bench)
```bash
# Install Apache Bench
# Windows: Download Apache, or use WSL
# macOS: brew install httpd
# Linux: sudo apt-get install apache2-utils

# Test API endpoint
ab -n 100 -c 10 http://localhost:3000/api/users

# Test with POST data
ab -n 100 -c 10 -p postdata.txt -T application/json http://localhost:3000/api/users
```

#### Basic Load Testing with curl
```bash
# Simple concurrent testing
for i in {1..10}; do
  curl http://localhost:3000/api/users &
done
wait
```

### Memory and Performance Monitoring

#### Node.js Performance Monitoring
```bash
# Start with Node.js performance monitoring
node --inspect npm run dev

# Profile memory usage
node --inspect --max-old-space-size=4096 npm run dev
```

## Debugging Commands

### API Debugging

#### Console Logging
```bash
# Start development server with debug output
DEBUG=* npm run dev

# Node.js specific debugging
NODE_ENV=development npm run dev
```

#### Network Debugging
```bash
# Monitor network requests
npm run dev
# Use browser dev tools > Network tab
# Filter by XHR/Fetch to see API calls
```

### Route Debugging

#### Route Resolution Testing
```bash
# Test route matching
npm run dev
# Check browser console for route information
# Look for Next.js router debugging info
```

## Environment Commands

### Environment Variables

#### Development Environment
```bash
# Create environment files
touch .env.local
touch .env.development
touch .env.production

# Test environment variables
npm run dev
# Check process.env in API routes
```

#### Environment Testing
```bash
# Test with different environments
NODE_ENV=development npm run dev
NODE_ENV=production npm run start
```

## Troubleshooting Commands

### Common Issues

#### API Routes Not Working
```bash
# Check Next.js version
npm list next

# Verify API route file structure
ls -la app/api/                # macOS/Linux
dir app\api\                   # Windows

# Check for syntax errors
npm run build
```

#### Dynamic Routes Not Working
```bash
# Verify file naming
ls -la app/posts/              # macOS/Linux
dir app\posts\                 # Windows

# Should see [id] directory and page.tsx file
```

#### Data Fetching Issues
```bash
# Check network connectivity
curl -I http://localhost:3000/api/users

# Test external API connections
curl -I https://jsonplaceholder.typicode.com/users

# Check CORS issues (if applicable)
curl -H "Origin: http://localhost:3000" http://localhost:3000/api/users
```
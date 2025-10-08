# Command Syntax Reference - Lab 06

## Overview
This lab focuses on authentication, authorization, and security in Next.js applications. Commands include setting up authentication providers, testing secure routes, managing sessions, and implementing security best practices.

## Commands Used

### Development Server Commands

#### `npm run dev`
Starts development server with authentication and security features.

**Enhanced features for this lab:**
- Session management testing
- Authentication flow debugging
- Secure cookie handling
- OAuth provider integration testing

**Development with security debugging:**
```bash
# Start with detailed security logging
DEBUG=auth* npm run dev

# Start with HTTPS for testing (if configured)
npm run dev:https

# Start with environment variables loaded
npm run dev --env-file .env.local
```

### Authentication Library Installation

#### NextAuth.js Installation
```bash
# Install NextAuth.js
npm install next-auth

# Install additional providers
npm install next-auth/providers/google
npm install next-auth/providers/github
npm install next-auth/providers/discord

# Install adapters (for database sessions)
npm install @next-auth/prisma-adapter     # Prisma
npm install @next-auth/mongodb-adapter    # MongoDB
npm install @next-auth/supabase-adapter   # Supabase
```

#### Auth0 Integration
```bash
# Install Auth0 SDK
npm install @auth0/nextjs-auth0

# Install Auth0 management API
npm install auth0
```

#### Firebase Auth Integration
```bash
# Install Firebase
npm install firebase

# Install Firebase Admin SDK
npm install firebase-admin
```

#### Custom JWT Implementation
```bash
# Install JWT library
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken

# Install bcrypt for password hashing
npm install bcryptjs
npm install --save-dev @types/bcryptjs

# Install crypto utilities
npm install crypto-js
```

### Security Library Installation

#### CORS Configuration
```bash
# Install CORS middleware
npm install cors
npm install --save-dev @types/cors
```

#### Rate Limiting
```bash
# Install rate limiting middleware
npm install express-rate-limit

# Install Redis for distributed rate limiting
npm install redis
npm install --save-dev @types/redis
```

#### Security Headers
```bash
# Install helmet for security headers
npm install helmet
npm install --save-dev @types/helmet

# Install content security policy
npm install csp-header
```

## Authentication Testing Commands

### OAuth Flow Testing

#### Google OAuth Testing
```bash
# Start development server
npm run dev

# Test OAuth flow:
# 1. Navigate to /api/auth/signin
# 2. Click Google provider
# 3. Complete OAuth flow
# 4. Check session at /api/auth/session
```

#### GitHub OAuth Testing
```bash
# Test GitHub OAuth
curl http://localhost:3000/api/auth/signin/github

# Check session after login
curl -b cookies.txt http://localhost:3000/api/auth/session
```

#### Manual OAuth Testing with curl
```bash
# Test OAuth callback (after getting code)
curl -X POST -H "Content-Type: application/json" \
  -d '{"code":"oauth_code","state":"csrf_token"}' \
  http://localhost:3000/api/auth/callback/google
```

### Session Management Testing

#### Session Testing Commands
```bash
# Check current session
curl -b cookies.txt http://localhost:3000/api/auth/session

# Sign out
curl -X POST http://localhost:3000/api/auth/signout

# Test session expiration
curl -b expired_cookies.txt http://localhost:3000/api/auth/session
```

#### Cookie Testing
```bash
# Save cookies during login
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  http://localhost:3000/api/auth/signin

# Use saved cookies for authenticated requests
curl -b cookies.txt http://localhost:3000/api/protected

# Check cookie expiration
curl -v -b cookies.txt http://localhost:3000/api/auth/session
```

### API Security Testing

#### Protected Route Testing
```bash
# Test protected route without authentication
curl http://localhost:3000/api/protected
# Should return 401 Unauthorized

# Test with valid token
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3000/api/protected

# Test with expired token
curl -H "Authorization: Bearer expired_token" \
  http://localhost:3000/api/protected
```

#### JWT Testing Commands
```bash
# Decode JWT token (using jwt.io or node)
node -e "console.log(JSON.stringify(require('jsonwebtoken').decode('your_jwt_token'), null, 2))"

# Verify JWT token
node -e "
const jwt = require('jsonwebtoken');
try {
  const decoded = jwt.verify('your_jwt_token', 'your_secret');
  console.log('Valid token:', decoded);
} catch (err) {
  console.log('Invalid token:', err.message);
}
"
```

## Database Security Commands

### User Management Commands

#### Create User (if using custom auth)
```bash
# Using curl to create user
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword","name":"John Doe"}' \
  http://localhost:3000/api/auth/register

# Verify user creation
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword"}' \
  http://localhost:3000/api/auth/signin
```

#### Password Management
```bash
# Test password reset request
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}' \
  http://localhost:3000/api/auth/reset-password

# Test password change
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"currentPassword":"old","newPassword":"new"}' \
  http://localhost:3000/api/auth/change-password
```

### Database Connection Security

#### Environment Variable Testing
```bash
# Test database connection with environment variables
npm run dev

# Check if environment variables are loaded
node -e "console.log(process.env.DATABASE_URL)"
node -e "console.log(process.env.NEXTAUTH_SECRET)"
node -e "console.log(process.env.NEXTAUTH_URL)"
```

#### Database Migration Commands (if using Prisma)
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed
```

## Security Testing Commands

### Vulnerability Testing

#### Security Audit
```bash
# Run npm security audit
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may cause breaking changes)
npm audit fix --force

# Check for outdated packages
npm outdated
```

#### Dependency Security Check
```bash
# Install security scanning tools
npm install --save-dev helmet express-rate-limit

# Check for known vulnerabilities
npx audit-ci --config audit-ci.json
```

### HTTPS Testing

#### Local HTTPS Setup
```bash
# Install mkcert for local HTTPS
# Windows: choco install mkcert
# macOS: brew install mkcert
# Linux: Install from GitHub releases

# Create local CA
mkcert -install

# Generate certificates
mkcert localhost 127.0.0.1 ::1

# Start server with HTTPS (if configured)
npm run dev:https
```

#### SSL Certificate Testing
```bash
# Test SSL certificate
openssl s_client -connect localhost:3001

# Check certificate details
curl -vI https://localhost:3001
```

### Cross-Site Request Forgery (CSRF) Testing

#### CSRF Token Testing
```bash
# Install CSRF protection
npm install csurf

# Test CSRF protection
curl -X POST -H "Content-Type: application/json" \
  -d '{"data":"test"}' \
  http://localhost:3000/api/protected
# Should fail without CSRF token

# Get CSRF token first
curl -c cookies.txt http://localhost:3000/api/csrf-token

# Use CSRF token in request
curl -b cookies.txt -X POST -H "Content-Type: application/json" \
  -H "X-CSRF-Token: csrf_token_value" \
  -d '{"data":"test"}' \
  http://localhost:3000/api/protected
```

## Performance and Monitoring Commands

### Authentication Performance Testing

#### Load Testing Authentication
```bash
# Install artillery for load testing
npm install -g artillery

# Create artillery config (artillery.yml)
# Run load test
artillery run artillery.yml

# Quick load test
artillery quick --count 10 --num 5 http://localhost:3000/api/auth/signin
```

#### Session Performance Testing
```bash
# Test session lookup performance
time curl -b cookies.txt http://localhost:3000/api/auth/session

# Monitor memory usage during authentication
npm run dev
# Use browser dev tools > Memory tab
```

### Security Monitoring

#### Security Headers Testing
```bash
# Test security headers
curl -I http://localhost:3000

# Check specific security headers
curl -H "Accept: application/json" -I http://localhost:3000/api/auth/session

# Test Content Security Policy
curl -H "Content-Type: text/html" -I http://localhost:3000
```

#### Rate Limiting Testing
```bash
# Test rate limiting (if implemented)
for i in {1..20}; do
  curl -w "Response: %{http_code}, Time: %{time_total}s\n" \
    http://localhost:3000/api/auth/signin
done
```

## Environment and Configuration Commands

### Environment Setup

#### Environment File Management
```bash
# Create environment files
touch .env.local
touch .env.development
touch .env.production

# Example environment variables for auth:
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
echo "NEXTAUTH_SECRET=your-secret-key" >> .env.local
echo "GOOGLE_CLIENT_ID=your-google-client-id" >> .env.local
echo "GOOGLE_CLIENT_SECRET=your-google-secret" >> .env.local
```

#### Environment Variable Validation
```bash
# Test environment variable loading
npm run dev

# Check if all required variables are set
node -e "
const required = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'DATABASE_URL'];
required.forEach(key => {
  if (!process.env[key]) {
    console.error(\`Missing: \${key}\`);
  } else {
    console.log(\`Found: \${key}\`);
  }
});
"
```

### Configuration Testing

#### NextAuth Configuration Testing
```bash
# Test NextAuth configuration
npm run dev

# Verify providers are configured
curl http://localhost:3000/api/auth/providers

# Test NextAuth endpoints
curl http://localhost:3000/api/auth/csrf
curl http://localhost:3000/api/auth/session
curl http://localhost:3000/api/auth/signin
```

## Build and Production Commands

### Production Build with Security

#### `npm run build`
Creates production build with security optimizations.

**Security optimizations:**
- Environment variable validation
- Secret key verification
- OAuth configuration validation
- Security header optimization

**Build with security checks:**
```bash
# Build with environment validation
npm run build

# Check for security warnings in build output
npm run build | grep -i "warning\|error\|security"
```

#### `npm run start`
Starts production server with full security features.

```bash
npm run build
npm run start

# Test production authentication flow
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  http://localhost:3000/api/auth/signin

# Test production session management
curl -b cookies.txt http://localhost:3000/api/auth/session
```

## Troubleshooting Commands

### Authentication Issues

#### Debug OAuth Flow
```bash
# Enable OAuth debugging
DEBUG=oauth* npm run dev

# Check OAuth provider configuration
curl http://localhost:3000/api/auth/providers

# Test OAuth redirect URLs
curl -L http://localhost:3000/api/auth/signin/google
```

#### Session Issues
```bash
# Clear session storage
rm -rf .next/cache/
npm run dev

# Check session database (if using database sessions)
# Connect to your database and check sessions table

# Test session without cookies
curl http://localhost:3000/api/auth/session
```

#### JWT Issues
```bash
# Validate JWT secret
node -e "
const crypto = require('crypto');
const secret = process.env.NEXTAUTH_SECRET;
if (!secret || secret.length < 32) {
  console.error('JWT secret too short or missing');
} else {
  console.log('JWT secret is valid');
}
"

# Test JWT generation
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({userId: 1}, process.env.NEXTAUTH_SECRET, {expiresIn: '1h'});
console.log('Generated token:', token);
"
```

### Security Issues

#### CORS Issues
```bash
# Test CORS headers
curl -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  http://localhost:3000/api/auth/signin

# Check preflight requests
curl -v -X OPTIONS http://localhost:3000/api/auth/signin
```

#### Database Connection Issues
```bash
# Test database connection
npm run dev

# Check database connection in console
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection failed:', err));
"
```
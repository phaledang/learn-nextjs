# Node.js Package Reference - Lab 09

## Overview
This lab focuses on deployment strategies and Azure integration, specifically deploying Next.js applications to various Azure services. It covers Azure-specific packages, containerization tools, deployment automation, and cloud-native development patterns for scalable production deployments.

## Azure Development and Deployment

### `@azure/cli`
**Description:** Cross-platform command-line experience for Azure.

**Purpose:**
- Azure resource management
- Deployment automation
- Service configuration
- Cloud infrastructure management

**Installation:**
```bash
# Install Azure CLI globally
npm install -g @azure/cli

# Or use via npx
npx @azure/cli --version
```

**Configuration:**
```bash
# Login to Azure
az login

# Set default subscription
az account set --subscription "your-subscription-id"

# Create resource group
az group create --name myResourceGroup --location eastus

# List available locations
az account list-locations --output table
```

**Deployment Scripts:**
```typescript
// scripts/deploy-azure.ts
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface DeploymentConfig {
  resourceGroup: string
  appName: string
  location: string
  sku: string
}

export class AzureDeployer {
  constructor(private config: DeploymentConfig) {}

  async createResourceGroup(): Promise<void> {
    const command = `az group create --name ${this.config.resourceGroup} --location ${this.config.location}`
    
    try {
      const { stdout } = await execAsync(command)
      console.log('Resource group created:', stdout)
    } catch (error) {
      console.error('Failed to create resource group:', error)
      throw error
    }
  }

  async createAppService(): Promise<void> {
    const commands = [
      `az appservice plan create --name ${this.config.appName}-plan --resource-group ${this.config.resourceGroup} --sku ${this.config.sku} --is-linux`,
      `az webapp create --name ${this.config.appName} --resource-group ${this.config.resourceGroup} --plan ${this.config.appName}-plan --runtime "NODE:18-lts"`,
    ]

    for (const command of commands) {
      try {
        const { stdout } = await execAsync(command)
        console.log('Command executed:', stdout)
      } catch (error) {
        console.error('Command failed:', error)
        throw error
      }
    }
  }

  async deployApp(): Promise<void> {
    const command = `az webapp deployment source config-zip --resource-group ${this.config.resourceGroup} --name ${this.config.appName} --src dist.zip`
    
    try {
      const { stdout } = await execAsync(command)
      console.log('App deployed:', stdout)
    } catch (error) {
      console.error('Deployment failed:', error)
      throw error
    }
  }
}

// Usage
const deployer = new AzureDeployer({
  resourceGroup: 'nextjs-app-rg',
  appName: 'my-nextjs-app',
  location: 'eastus',
  sku: 'B1',
})

async function deploy() {
  await deployer.createResourceGroup()
  await deployer.createAppService()
  await deployer.deployApp()
}
```

### `@azure/storage-blob`
**Description:** Azure Blob Storage client library for JavaScript.

**Purpose:**
- File storage and retrieval
- Static asset hosting
- Backup and archiving
- Content delivery

**Installation:**
```bash
npm install @azure/storage-blob
```

**Usage:**
```typescript
// lib/azure-storage.ts
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
)

export class AzureStorageService {
  private containerClient = blobServiceClient.getContainerClient(containerName)

  async uploadFile(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName)
    
    try {
      await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
      })
      
      return blockBlobClient.url
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  async downloadFile(fileName: string): Promise<Buffer> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName)
    
    try {
      const downloadResponse = await blockBlobClient.download()
      const chunks: Buffer[] = []
      
      if (downloadResponse.readableStreamBody) {
        for await (const chunk of downloadResponse.readableStreamBody) {
          chunks.push(chunk)
        }
      }
      
      return Buffer.concat(chunks)
    } catch (error) {
      console.error('Download failed:', error)
      throw error
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName)
    
    try {
      await blockBlobClient.delete()
    } catch (error) {
      console.error('Delete failed:', error)
      throw error
    }
  }

  async listFiles(prefix?: string): Promise<string[]> {
    const fileNames: string[] = []
    
    try {
      for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
        fileNames.push(blob.name)
      }
      
      return fileNames
    } catch (error) {
      console.error('List failed:', error)
      throw error
    }
  }
}

// API route usage
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AzureStorageService } from '@/lib/azure-storage'

const storageService = new AzureStorageService()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `uploads/${Date.now()}-${file.name}`
    
    const url = await storageService.uploadFile(fileName, buffer, file.type)
    
    return NextResponse.json({ url, fileName })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
```

### `@azure/cosmos`
**Description:** Azure Cosmos DB client library for JavaScript.

**Purpose:**
- NoSQL database operations
- Global distribution
- Multi-model database
- Scalable storage

**Installation:**
```bash
npm install @azure/cosmos
```

**Usage:**
```typescript
// lib/cosmos-db.ts
import { CosmosClient, Database, Container } from '@azure/cosmos'

const endpoint = process.env.COSMOS_DB_ENDPOINT!
const key = process.env.COSMOS_DB_KEY!
const databaseId = process.env.COSMOS_DB_DATABASE_ID!
const containerId = process.env.COSMOS_DB_CONTAINER_ID!

export class CosmosDBService {
  private client: CosmosClient
  private database: Database
  private container: Container

  constructor() {
    this.client = new CosmosClient({ endpoint, key })
    this.database = this.client.database(databaseId)
    this.container = this.database.container(containerId)
  }

  async createItem<T>(item: T & { id?: string }): Promise<T> {
    try {
      if (!item.id) {
        item.id = this.generateId()
      }
      
      const { resource } = await this.container.items.create(item)
      return resource as T
    } catch (error) {
      console.error('Create item failed:', error)
      throw error
    }
  }

  async getItem<T>(id: string, partitionKey: string): Promise<T | null> {
    try {
      const { resource } = await this.container.item(id, partitionKey).read<T>()
      return resource || null
    } catch (error) {
      if (error.code === 404) {
        return null
      }
      console.error('Get item failed:', error)
      throw error
    }
  }

  async updateItem<T>(id: string, partitionKey: string, item: Partial<T>): Promise<T> {
    try {
      const { resource } = await this.container.item(id, partitionKey).replace(item)
      return resource as T
    } catch (error) {
      console.error('Update item failed:', error)
      throw error
    }
  }

  async deleteItem(id: string, partitionKey: string): Promise<void> {
    try {
      await this.container.item(id, partitionKey).delete()
    } catch (error) {
      console.error('Delete item failed:', error)
      throw error
    }
  }

  async queryItems<T>(query: string, parameters?: any[]): Promise<T[]> {
    try {
      const { resources } = await this.container.items
        .query<T>({
          query,
          parameters,
        })
        .fetchAll()
      
      return resources
    } catch (error) {
      console.error('Query failed:', error)
      throw error
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }
}

// Usage example
interface User {
  id: string
  name: string
  email: string
  createdAt: string
  userId: string // partition key
}

export class UserService {
  private cosmosService = new CosmosDBService()

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: '',
      createdAt: new Date().toISOString(),
    }
    
    return this.cosmosService.createItem(user)
  }

  async getUser(id: string, userId: string): Promise<User | null> {
    return this.cosmosService.getItem<User>(id, userId)
  }

  async getUsersByEmail(email: string): Promise<User[]> {
    return this.cosmosService.queryItems<User>(
      'SELECT * FROM c WHERE c.email = @email',
      [{ name: '@email', value: email }]
    )
  }
}
```

### `@azure/app-configuration`
**Description:** Azure App Configuration client library for JavaScript.

**Purpose:**
- Centralized configuration management
- Feature flags
- Dynamic configuration updates
- Environment-specific settings

**Installation:**
```bash
npm install @azure/app-configuration
```

**Usage:**
```typescript
// lib/app-configuration.ts
import { AppConfigurationClient } from '@azure/app-configuration'

const connectionString = process.env.AZURE_APP_CONFIG_CONNECTION_STRING!

export class AppConfigService {
  private client: AppConfigurationClient

  constructor() {
    this.client = new AppConfigurationClient(connectionString)
  }

  async getConfigValue(key: string, label?: string): Promise<string | undefined> {
    try {
      const setting = await this.client.getConfigurationSetting({
        key,
        label,
      })
      
      return setting.value
    } catch (error) {
      console.error('Failed to get config value:', error)
      return undefined
    }
  }

  async setConfigValue(key: string, value: string, label?: string): Promise<void> {
    try {
      await this.client.setConfigurationSetting({
        key,
        value,
        label,
      })
    } catch (error) {
      console.error('Failed to set config value:', error)
      throw error
    }
  }

  async getAllConfigs(keyFilter?: string, labelFilter?: string): Promise<Record<string, string>> {
    const configs: Record<string, string> = {}
    
    try {
      const settings = this.client.listConfigurationSettings({
        keyFilter,
        labelFilter,
      })
      
      for await (const setting of settings) {
        if (setting.key && setting.value) {
          configs[setting.key] = setting.value
        }
      }
      
      return configs
    } catch (error) {
      console.error('Failed to get all configs:', error)
      throw error
    }
  }
}

// Configuration provider for Next.js
export async function getServerSideConfig(): Promise<Record<string, string>> {
  const configService = new AppConfigService()
  return configService.getAllConfigs()
}

// Usage in Next.js
export async function getServerSideProps() {
  const config = await getServerSideConfig()
  
  return {
    props: {
      config,
    },
  }
}
```

## Containerization and Orchestration

### `docker` (via package.json scripts)
**Description:** Container platform for building, sharing, and running applications.

**Purpose:**
- Application containerization
- Environment consistency
- Deployment packaging
- Microservices architecture

**Dockerfile:**
```dockerfile
# Dockerfile
# Use the official Node.js 18 Alpine image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

**Docker Scripts:**
```json
// package.json
{
  "scripts": {
    "docker:build": "docker build -t nextjs-app .",
    "docker:run": "docker run -p 3000:3000 nextjs-app",
    "docker:compose:up": "docker-compose up -d",
    "docker:compose:down": "docker-compose down",
    "docker:compose:logs": "docker-compose logs -f",
    "docker:push": "docker push your-registry/nextjs-app:latest"
  }
}
```

### `kubernetes` (K8s Manifests)
**Description:** Container orchestration platform.

**Deployment Manifests:**
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-app
  labels:
    app: nextjs-app
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
      - name: nextjs
        image: your-registry/nextjs-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: redis-url
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
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: nextjs-service
spec:
  selector:
    app: nextjs-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  redis-url: "redis://redis-service:6379"

---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  database-url: <base64-encoded-database-url>
```

## CI/CD and Automation

### `@azure/arm-appservice`
**Description:** Azure App Service management client.

**Installation:**
```bash
npm install @azure/arm-appservice @azure/identity
```

**Usage:**
```typescript
// scripts/azure-deployment.ts
import { WebSiteManagementClient } from '@azure/arm-appservice'
import { DefaultAzureCredential } from '@azure/identity'

export class AzureAppServiceManager {
  private client: WebSiteManagementClient
  private subscriptionId: string
  private resourceGroupName: string

  constructor(subscriptionId: string, resourceGroupName: string) {
    this.subscriptionId = subscriptionId
    this.resourceGroupName = resourceGroupName
    
    const credential = new DefaultAzureCredential()
    this.client = new WebSiteManagementClient(credential, subscriptionId)
  }

  async createOrUpdateWebApp(appName: string, config: any) {
    try {
      const result = await this.client.webApps.beginCreateOrUpdateAndWait(
        this.resourceGroupName,
        appName,
        {
          location: 'East US',
          serverFarmId: `/subscriptions/${this.subscriptionId}/resourceGroups/${this.resourceGroupName}/providers/Microsoft.Web/serverfarms/${appName}-plan`,
          siteConfig: {
            linuxFxVersion: 'NODE|18-lts',
            appSettings: config.appSettings,
          },
        }
      )
      
      console.log('Web app created/updated:', result)
      return result
    } catch (error) {
      console.error('Failed to create/update web app:', error)
      throw error
    }
  }

  async updateAppSettings(appName: string, settings: Record<string, string>) {
    try {
      const appSettings = Object.entries(settings).map(([name, value]) => ({
        name,
        value,
      }))

      await this.client.webApps.updateApplicationSettings(
        this.resourceGroupName,
        appName,
        {
          properties: appSettings.reduce((acc, setting) => {
            acc[setting.name] = setting.value
            return acc
          }, {} as Record<string, string>),
        }
      )
      
      console.log('App settings updated')
    } catch (error) {
      console.error('Failed to update app settings:', error)
      throw error
    }
  }
}
```

### GitHub Actions Integration
```yaml
# .github/workflows/deploy.yml
name: Deploy to Azure

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build application
      run: npm run build

    - name: Login to Azure Container Registry
      uses: azure/docker-login@v1
      with:
        login-server: ${{ secrets.ACR_LOGIN_SERVER }}
        username: ${{ secrets.ACR_USERNAME }}
        password: ${{ secrets.ACR_PASSWORD }}

    - name: Build and push Docker image
      run: |
        docker build -t ${{ secrets.ACR_LOGIN_SERVER }}/nextjs-app:${{ github.sha }} .
        docker push ${{ secrets.ACR_LOGIN_SERVER }}/nextjs-app:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest

    steps:
    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Deploy to Azure Container Instances
      uses: azure/aci-deploy@v1
      with:
        resource-group: ${{ secrets.RESOURCE_GROUP }}
        dns-name-label: nextjs-app-${{ github.sha }}
        image: ${{ secrets.ACR_LOGIN_SERVER }}/nextjs-app:${{ github.sha }}
        name: nextjs-app
        location: 'east us'
        ports: 3000
        environment-variables: |
          NODE_ENV=production
          PORT=3000
```

## Monitoring and Observability

### `@azure/monitor-opentelemetry-exporter`
**Description:** Azure Monitor exporter for OpenTelemetry.

**Installation:**
```bash
npm install @azure/monitor-opentelemetry-exporter @opentelemetry/api @opentelemetry/sdk-node
```

**Setup:**
```typescript
// lib/telemetry.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

// Initialize Azure Monitor exporter
const azureExporter = new AzureMonitorTraceExporter({
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
})

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'nextjs-app',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  traceExporter: azureExporter,
})

// Start the SDK
if (process.env.NODE_ENV === 'production') {
  sdk.start()
  console.log('OpenTelemetry started successfully')
}

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0))
})
```

### `applicationinsights`
**Description:** Microsoft Application Insights SDK for Node.js.

**Installation:**
```bash
npm install applicationinsights
```

**Setup:**
```typescript
// lib/app-insights.ts
import * as appInsights from 'applicationinsights'

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(false)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .start()

  console.log('Application Insights started')
}

export const client = appInsights.defaultClient

// Custom telemetry functions
export function trackEvent(name: string, properties?: Record<string, string>, measurements?: Record<string, number>) {
  client?.trackEvent({
    name,
    properties,
    measurements,
  })
}

export function trackMetric(name: string, value: number, properties?: Record<string, string>) {
  client?.trackMetric({
    name,
    value,
    properties,
  })
}

export function trackException(exception: Error, properties?: Record<string, string>) {
  client?.trackException({
    exception,
    properties,
  })
}

// Usage in API routes
export function withTelemetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operationName: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now()
    
    try {
      const result = await fn(...args)
      
      trackMetric(`${operationName}.duration`, Date.now() - startTime)
      trackEvent(`${operationName}.success`)
      
      return result
    } catch (error) {
      trackMetric(`${operationName}.duration`, Date.now() - startTime)
      trackException(error as Error, { operation: operationName })
      trackEvent(`${operationName}.error`)
      
      throw error
    }
  }
}
```

## Environment and Configuration Management

### `dotenv-azure`
**Description:** Loads environment variables from Azure App Configuration and Key Vault.

**Installation:**
```bash
npm install dotenv-azure
```

**Usage:**
```typescript
// lib/config.ts
import { loadFromAzure } from 'dotenv-azure'

export async function loadAzureConfig() {
  if (process.env.NODE_ENV === 'production') {
    await loadFromAzure({
      appConfigConnectionString: process.env.AZURE_APP_CONFIG_CONNECTION_STRING,
      keyVaultUrl: process.env.AZURE_KEY_VAULT_URL,
    })
  }
}

// Initialize at app startup
loadAzureConfig().catch(console.error)
```

### Environment Variables Validation
```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  AZURE_STORAGE_ACCOUNT_NAME: z.string(),
  AZURE_STORAGE_ACCOUNT_KEY: z.string(),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
  REDIS_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)

// Type-safe environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
```

## Production Optimization and Scaling

### Next.js Configuration for Production
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for production
  experimental: {
    outputStandalone: true, // For containerization
    serverComponentsExternalPackages: ['@azure/storage-blob'],
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Output configuration for different deployment targets
  output: process.env.BUILD_STANDALONE ? 'standalone' : undefined,

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for security and performance
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
    ]
  },

  // Redirects for deployment
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add polyfills for Node.js modules in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
```

### Health Check and Readiness
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  memory: {
    used: number
    total: number
  }
  dependencies: {
    database: 'connected' | 'disconnected'
    redis: 'connected' | 'disconnected'
    storage: 'available' | 'unavailable'
  }
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const status: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: process.memoryUsage().heapUsed,
      total: process.memoryUsage().heapTotal,
    },
    dependencies: {
      database: 'connected', // Check actual database connection
      redis: 'connected', // Check actual Redis connection
      storage: 'available', // Check actual storage availability
    },
  }

  // Determine overall health status
  const dependencyStatuses = Object.values(status.dependencies)
  const isHealthy = dependencyStatuses.every(
    dep => dep === 'connected' || dep === 'available'
  )

  status.status = isHealthy ? 'healthy' : 'unhealthy'

  return NextResponse.json(status, {
    status: isHealthy ? 200 : 503,
  })
}
```

## Deployment Scripts and Automation

### Build and Deployment Scripts
```json
// package.json
{
  "scripts": {
    "build": "next build",
    "build:analyze": "ANALYZE=true npm run build",
    "build:standalone": "BUILD_STANDALONE=true next build",
    "start": "next start",
    "start:prod": "NODE_ENV=production next start",
    
    "docker:build": "docker build -t nextjs-app .",
    "docker:build:prod": "docker build -t nextjs-app:production -f Dockerfile.prod .",
    "docker:run": "docker run -p 3000:3000 --env-file .env.local nextjs-app",
    
    "azure:login": "az login",
    "azure:deploy": "node scripts/deploy-to-azure.js",
    "azure:logs": "az webapp log tail --name nextjs-app --resource-group myResourceGroup",
    
    "k8s:deploy": "kubectl apply -f k8s/",
    "k8s:delete": "kubectl delete -f k8s/",
    "k8s:logs": "kubectl logs -f deployment/nextjs-app",
    
    "deploy:staging": "npm run build && npm run azure:deploy -- --environment staging",
    "deploy:production": "npm run build && npm run azure:deploy -- --environment production",
    
    "health:check": "curl -f http://localhost:3000/api/health || exit 1"
  }
}
```

### Infrastructure as Code with Bicep
```bicep
// infrastructure/main.bicep
@description('The name of the resource group')
param resourceGroupName string = 'nextjs-app-rg'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The name of the app service plan')
param appServicePlanName string = 'nextjs-app-plan'

@description('The name of the web app')
param webAppName string = 'nextjs-app-${uniqueString(resourceGroup().id)}'

@description('The SKU of the app service plan')
param sku string = 'B1'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: sku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: webAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
      ]
    }
  }
}

output webAppName string = webApp.name
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
```
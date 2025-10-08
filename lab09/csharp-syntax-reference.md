# Azure CLI & Deployment Reference

## Table of Contents
1. [Azure CLI Basics](#azure-cli-basics)
2. [Azure App Service](#azure-app-service)
3. [Azure Container Apps](#azure-container-apps)
4. [Docker Commands](#docker-commands)
5. [Environment Variables](#environment-variables)
6. [GitHub Actions CI/CD](#github-actions-cicd)

---

## Azure CLI Basics

### Installation

```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# macOS
brew update && brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Login

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "Your Subscription Name"

# Show current account
az account show
```

### Resource Groups

```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# List resource groups
az group list --output table

# Delete resource group
az group delete --name myResourceGroup
```

---

## Azure App Service

### Create App Service Plan

```bash
# Create App Service Plan (Linux)
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux

# Create App Service Plan (Windows)
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1
```

### Create Web App

```bash
# Create Node.js web app
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name myUniqueAppName \
  --runtime "NODE:18-lts"

# List available runtimes
az webapp list-runtimes --linux
```

### Deploy from GitHub

```bash
# Configure GitHub deployment
az webapp deployment source config \
  --name myUniqueAppName \
  --resource-group myResourceGroup \
  --repo-url https://github.com/username/repo \
  --branch main \
  --manual-integration
```

### Deploy from Local Git

```bash
# Set up local Git deployment
az webapp deployment source config-local-git \
  --name myUniqueAppName \
  --resource-group myResourceGroup

# Get deployment credentials
az webapp deployment list-publishing-credentials \
  --name myUniqueAppName \
  --resource-group myResourceGroup

# Deploy
git remote add azure <deployment-url>
git push azure main
```

### Configure App Settings

```bash
# Set environment variables
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myUniqueAppName \
  --settings \
    DATABASE_URL="mongodb+srv://..." \
    NEXTAUTH_SECRET="your-secret" \
    NEXTAUTH_URL="https://myapp.azurewebsites.net"

# List app settings
az webapp config appsettings list \
  --name myUniqueAppName \
  --resource-group myResourceGroup
```

### View Logs

```bash
# Enable logging
az webapp log config \
  --name myUniqueAppName \
  --resource-group myResourceGroup \
  --web-server-logging filesystem

# Stream logs
az webapp log tail \
  --name myUniqueAppName \
  --resource-group myResourceGroup
```

### Custom Domain

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name myUniqueAppName \
  --resource-group myResourceGroup \
  --hostname www.example.com

# Bind SSL certificate
az webapp config ssl bind \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI \
  --name myUniqueAppName \
  --resource-group myResourceGroup
```

---

## Azure Container Apps

### Install Container Apps Extension

```bash
az extension add --name containerapp --upgrade
```

### Create Container Apps Environment

```bash
# Create environment
az containerapp env create \
  --name myEnvironment \
  --resource-group myResourceGroup \
  --location eastus
```

### Create Container App

```bash
# Create container app from Docker Hub
az containerapp create \
  --name my-container-app \
  --resource-group myResourceGroup \
  --environment myEnvironment \
  --image username/my-nextjs-app:latest \
  --target-port 3000 \
  --ingress external \
  --query properties.configuration.ingress.fqdn

# Create from Azure Container Registry
az containerapp create \
  --name my-container-app \
  --resource-group myResourceGroup \
  --environment myEnvironment \
  --image myregistry.azurecr.io/my-nextjs-app:latest \
  --registry-server myregistry.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --target-port 3000 \
  --ingress external
```

### Update Container App

```bash
# Update container image
az containerapp update \
  --name my-container-app \
  --resource-group myResourceGroup \
  --image username/my-nextjs-app:v2

# Set environment variables
az containerapp update \
  --name my-container-app \
  --resource-group myResourceGroup \
  --set-env-vars \
    DATABASE_URL="mongodb+srv://..." \
    API_KEY="secretvalue"
```

### Scale Container App

```bash
# Set scaling rules
az containerapp update \
  --name my-container-app \
  --resource-group myResourceGroup \
  --min-replicas 0 \
  --max-replicas 10

# Set CPU and memory
az containerapp update \
  --name my-container-app \
  --resource-group myResourceGroup \
  --cpu 1.0 \
  --memory 2.0Gi
```

---

## Docker Commands

### Build Next.js Docker Image

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Commands

```bash
# Build image
docker build -t my-nextjs-app .

# Run locally
docker run -p 3000:3000 my-nextjs-app

# Tag image
docker tag my-nextjs-app username/my-nextjs-app:latest

# Push to Docker Hub
docker push username/my-nextjs-app:latest

# Push to Azure Container Registry
docker tag my-nextjs-app myregistry.azurecr.io/my-nextjs-app:latest
docker push myregistry.azurecr.io/my-nextjs-app:latest
```

### Azure Container Registry

```bash
# Create container registry
az acr create \
  --resource-group myResourceGroup \
  --name myregistry \
  --sku Basic

# Login to ACR
az acr login --name myregistry

# Build and push in ACR
az acr build \
  --registry myregistry \
  --image my-nextjs-app:latest \
  .
```

---

## Environment Variables

### next.config.js for Standalone Output

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable if using images from external domains
  images: {
    domains: ['example.com'],
  },
}

module.exports = nextConfig
```

### .env.production

```bash
# Database
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.azurewebsites.net

# API Keys
API_KEY=your-api-key
```

---

## GitHub Actions CI/CD

### Deploy to App Service

```yaml
# .github/workflows/azure-deploy.yml
name: Deploy to Azure App Service

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'myUniqueAppName'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: .
```

### Deploy to Container Apps

```yaml
# .github/workflows/container-deploy.yml
name: Deploy to Azure Container Apps

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Build and push Docker image
      run: |
        docker build -t ${{ secrets.REGISTRY_LOGIN_SERVER }}/my-app:${{ github.sha }} .
        docker login ${{ secrets.REGISTRY_LOGIN_SERVER }} -u ${{ secrets.REGISTRY_USERNAME }} -p ${{ secrets.REGISTRY_PASSWORD }}
        docker push ${{ secrets.REGISTRY_LOGIN_SERVER }}/my-app:${{ github.sha }}
    
    - name: Deploy to Container Apps
      run: |
        az containerapp update \
          --name my-container-app \
          --resource-group myResourceGroup \
          --image ${{ secrets.REGISTRY_LOGIN_SERVER }}/my-app:${{ github.sha }}
```

---

## Monitoring and Diagnostics

### Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app myAppInsights \
  --location eastus \
  --resource-group myResourceGroup

# Get instrumentation key
az monitor app-insights component show \
  --app myAppInsights \
  --resource-group myResourceGroup \
  --query instrumentationKey
```

### View Metrics

```bash
# Get app metrics
az monitor metrics list \
  --resource myUniqueAppName \
  --resource-group myResourceGroup \
  --resource-type "Microsoft.Web/sites" \
  --metric "Http2xx"
```

---

## Troubleshooting

### Common Issues

1. **Build fails on Azure**
   ```bash
   # Ensure package-lock.json is committed
   git add package-lock.json
   git commit -m "Add package-lock.json"
   ```

2. **Environment variables not working**
   ```bash
   # Restart app after setting variables
   az webapp restart \
     --name myUniqueAppName \
     --resource-group myResourceGroup
   ```

3. **App won't start**
   ```bash
   # Check logs
   az webapp log tail \
     --name myUniqueAppName \
     --resource-group myResourceGroup
   ```

---

## Best Practices

1. **Use environment variables** for secrets
2. **Enable logging** for debugging
3. **Use staging slots** for testing
4. **Implement health checks**
5. **Monitor performance** with Application Insights
6. **Use CI/CD** for automated deployments
7. **Enable HTTPS** for production
8. **Implement proper error handling**

---

This reference covers Azure deployment essentials for Next.js applications. For more details, visit [Azure Documentation](https://docs.microsoft.com/azure).

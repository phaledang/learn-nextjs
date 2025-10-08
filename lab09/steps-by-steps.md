# Lab 09: Step-by-Step Guide - Azure Deployment

## Step 1: Prepare for Deployment

### 1.1 Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

### 1.2 Create production environment variables

Create `.env.production`:

```bash
DATABASE_URL=your-production-mongodb-url
NEXTAUTH_URL=https://your-app.azurewebsites.net
NEXTAUTH_SECRET=your-production-secret
```

---

## Step 2: Deploy to Azure App Service

### 2.1 Install Azure CLI

Visit [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli)

### 2.2 Login to Azure

```bash
az login
```

### 2.3 Create Resource Group

```bash
az group create --name nextjs-rg --location eastus
```

### 2.4 Create App Service Plan

```bash
az appservice plan create \
  --name nextjs-plan \
  --resource-group nextjs-rg \
  --sku B1 \
  --is-linux
```

### 2.5 Create Web App

```bash
az webapp create \
  --resource-group nextjs-rg \
  --plan nextjs-plan \
  --name my-nextjs-app-unique \
  --runtime "NODE:18-lts"
```

### 2.6 Configure App Settings

```bash
az webapp config appsettings set \
  --resource-group nextjs-rg \
  --name my-nextjs-app-unique \
  --settings \
    DATABASE_URL="your-mongodb-url" \
    NEXTAUTH_SECRET="your-secret" \
    NEXTAUTH_URL="https://my-nextjs-app-unique.azurewebsites.net"
```

### 2.7 Deploy via GitHub Actions

Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure

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
        app-name: 'my-nextjs-app-unique'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: .
```

---

## Step 3: Deploy to Azure Container Apps

### 3.1 Create Dockerfile

Create `Dockerfile`:

```dockerfile
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

### 3.2 Build and Test Docker Image

```bash
docker build -t my-nextjs-app .
docker run -p 3000:3000 my-nextjs-app
```

### 3.3 Create Azure Container Registry

```bash
az acr create \
  --resource-group nextjs-rg \
  --name mynextjsregistry \
  --sku Basic
```

### 3.4 Build and Push to ACR

```bash
az acr build \
  --registry mynextjsregistry \
  --image my-nextjs-app:latest \
  .
```

### 3.5 Create Container Apps Environment

```bash
az extension add --name containerapp --upgrade

az containerapp env create \
  --name nextjs-env \
  --resource-group nextjs-rg \
  --location eastus
```

### 3.6 Deploy Container App

```bash
az containerapp create \
  --name my-nextjs-container \
  --resource-group nextjs-rg \
  --environment nextjs-env \
  --image mynextjsregistry.azurecr.io/my-nextjs-app:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server mynextjsregistry.azurecr.io \
  --env-vars \
    DATABASE_URL="secretref:database-url" \
    NEXTAUTH_SECRET="secretref:nextauth-secret"
```

---

## Step 4: Configure Custom Domain

### 4.1 Add Custom Domain

```bash
az webapp config hostname add \
  --webapp-name my-nextjs-app-unique \
  --resource-group nextjs-rg \
  --hostname www.yourdomain.com
```

### 4.2 Configure DNS

Add CNAME record:
- Type: CNAME
- Name: www
- Value: my-nextjs-app-unique.azurewebsites.net

### 4.3 Enable HTTPS

```bash
az webapp config ssl bind \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI \
  --name my-nextjs-app-unique \
  --resource-group nextjs-rg
```

---

## Step 5: Monitor and Scale

### 5.1 Enable Application Insights

```bash
az monitor app-insights component create \
  --app nextjs-insights \
  --location eastus \
  --resource-group nextjs-rg
```

### 5.2 Scale App Service

```bash
az appservice plan update \
  --name nextjs-plan \
  --resource-group nextjs-rg \
  --sku S1
```

### 5.3 View Logs

```bash
az webapp log tail \
  --name my-nextjs-app-unique \
  --resource-group nextjs-rg
```

---

## Step 6: CI/CD with GitHub Actions

### 6.1 Get Publish Profile

```bash
az webapp deployment list-publishing-profiles \
  --name my-nextjs-app-unique \
  --resource-group nextjs-rg \
  --xml
```

### 6.2 Add to GitHub Secrets

1. Go to GitHub repository Settings
2. Secrets and variables → Actions
3. Add: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Paste the XML content

### 6.3 Verify Deployment

Push to main branch and watch GitHub Actions deploy automatically!

---

## 🎉 Congratulations!

You've completed Lab 09! You now understand:
- Azure App Service deployment
- Container Apps deployment
- Docker containerization
- Custom domains
- CI/CD with GitHub Actions
- Monitoring and scaling

## 🚀 Next Steps

Ready for Lab 10? The final lab covers performance, SEO, and a capstone project!

## 📚 Useful Commands

```bash
# Restart app
az webapp restart --name my-nextjs-app-unique --resource-group nextjs-rg

# Delete resources
az group delete --name nextjs-rg --yes

# View all apps
az webapp list --output table
```

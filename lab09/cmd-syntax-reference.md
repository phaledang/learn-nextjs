# Command Syntax Reference - Lab 09

## Overview
This lab focuses on deploying Next.js applications to Azure, including Azure App Service, Azure Container Apps, and Static Web Apps. Commands include Azure CLI operations, deployment configurations, CI/CD setup, and monitoring.

## Commands Used

### Azure CLI Installation and Setup

#### Azure CLI Installation
```bash
# Windows (PowerShell)
winget install Microsoft.AzureCLI
# Or download from https://aka.ms/installazurecliwindows

# macOS
brew install azure-cli

# Linux (Ubuntu/Debian)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Alternative: npm install (cross-platform)
npm install -g azure-cli
```

#### Azure CLI Authentication
```bash
# Login to Azure
az login

# Login with device code (for headless environments)
az login --use-device-code

# Login with service principal
az login --service-principal -u <app-id> -p <password> --tenant <tenant-id>

# Set default subscription
az account set --subscription "subscription-name-or-id"

# List available subscriptions
az account list --output table

# Show current account
az account show
```

### Azure App Service Deployment

#### App Service Creation and Configuration

##### Create Resource Group
```bash
# Create resource group
az group create --name myResourceGroup --location "East US"

# List available locations
az account list-locations --output table

# List resource groups
az group list --output table
```

##### Create App Service Plan
```bash
# Create App Service plan (Linux)
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux

# Create Windows App Service plan
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1

# List available SKUs
az appservice plan list-skus --output table
```

##### Create Web App
```bash
# Create web app with Node.js runtime
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name myNextjsApp \
  --runtime "NODE:18-lts"

# Create with specific configuration
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name myNextjsApp \
  --runtime "NODE:18-lts" \
  --deployment-source-url https://github.com/user/repo
```

#### App Service Configuration

##### Configure App Settings
```bash
# Set Node.js version
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --settings WEBSITE_NODE_DEFAULT_VERSION="18.17.0"

# Set custom environment variables
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --settings NODE_ENV="production" \
    NEXTAUTH_SECRET="your-secret" \
    DATABASE_URL="your-database-url"

# List current app settings
az webapp config appsettings list \
  --resource-group myResourceGroup \
  --name myNextjsApp
```

##### Configure Startup Command
```bash
# Set startup command for Next.js
az webapp config set \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --startup-file "npm run start"

# Alternative: Set in package.json scripts
# "scripts": {
#   "start": "next start -p $PORT"
# }
```

#### Deployment Commands

##### ZIP Deployment
```bash
# Build application
npm run build

# Create deployment package
zip -r deploy.zip . -x "node_modules/*" ".git/*" ".next/cache/*"

# Deploy ZIP file
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --src deploy.zip
```

##### Git Deployment
```bash
# Configure Git deployment
az webapp deployment source config \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --repo-url https://github.com/user/repo \
  --branch main \
  --manual-integration

# Get deployment credentials
az webapp deployment list-publishing-profiles \
  --resource-group myResourceGroup \
  --name myNextjsApp
```

##### FTP Deployment
```bash
# Get FTP credentials
az webapp deployment list-publishing-profiles \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --query "[?publishMethod=='FTP']"

# Upload files via FTP (using curl)
curl -T package.json ftp://username:password@hostname/site/wwwroot/
```

### Azure Container Apps Deployment

#### Container Apps Environment Setup

##### Install Container Apps Extension
```bash
# Install Azure CLI extension for Container Apps
az extension add --name containerapp

# Update extension
az extension update --name containerapp

# Register providers
az provider register --namespace Microsoft.ContainerInstance
az provider register --namespace Microsoft.OperationalInsights
```

##### Create Container Apps Environment
```bash
# Create Log Analytics workspace
az monitor log-analytics workspace create \
  --resource-group myResourceGroup \
  --workspace-name myLogWorkspace \
  --location "East US"

# Get workspace ID and key
az monitor log-analytics workspace show \
  --resource-group myResourceGroup \
  --workspace-name myLogWorkspace \
  --query customerId --output tsv

# Create Container Apps environment
az containerapp env create \
  --name myContainerAppEnv \
  --resource-group myResourceGroup \
  --location "East US" \
  --logs-workspace-id <workspace-id> \
  --logs-workspace-key <workspace-key>
```

#### Container Image Preparation

##### Build Docker Image
```bash
# Create Dockerfile for Next.js
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Build Docker image
docker build -t mynextjsapp:latest .

# Test image locally
docker run -p 3000:3000 mynextjsapp:latest
```

##### Push to Azure Container Registry

###### Create Container Registry
```bash
# Create Azure Container Registry
az acr create \
  --resource-group myResourceGroup \
  --name myContainerRegistry \
  --sku Basic \
  --admin-enabled true

# Login to ACR
az acr login --name myContainerRegistry

# Get ACR login server
az acr show --name myContainerRegistry --query loginServer --output tsv
```

###### Push Image to ACR
```bash
# Tag image for ACR
docker tag mynextjsapp:latest mycontainerregistry.azurecr.io/mynextjsapp:latest

# Push to ACR
docker push mycontainerregistry.azurecr.io/mynextjsapp:latest

# List images in registry
az acr repository list --name myContainerRegistry --output table
```

#### Deploy Container App

##### Create Container App
```bash
# Deploy from ACR
az containerapp create \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup \
  --environment myContainerAppEnv \
  --image mycontainerregistry.azurecr.io/mynextjsapp:latest \
  --target-port 3000 \
  --ingress 'external' \
  --registry-server mycontainerregistry.azurecr.io \
  --registry-username <registry-username> \
  --registry-password <registry-password>

# Deploy from Docker Hub
az containerapp create \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup \
  --environment myContainerAppEnv \
  --image username/mynextjsapp:latest \
  --target-port 3000 \
  --ingress 'external'
```

##### Update Container App
```bash
# Update container app with new image
az containerapp update \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup \
  --image mycontainerregistry.azurecr.io/mynextjsapp:v2

# Update environment variables
az containerapp update \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup \
  --set-env-vars NODE_ENV=production DATABASE_URL=secretref:database-url
```

### Azure Static Web Apps Deployment

#### Static Web Apps Creation

##### Create Static Web App
```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Create Static Web App via Azure CLI
az staticwebapp create \
  --name myStaticWebApp \
  --resource-group myResourceGroup \
  --source https://github.com/user/repo \
  --branch main \
  --app-location "/" \
  --output-location "out" \
  --location "East US 2"
```

##### Configure Static Generation
```bash
# Add static export to next.config.js
cat >> next.config.js << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
module.exports = nextConfig
EOF

# Build static version
npm run build

# Test static build locally
npx serve out
```

#### Static Web Apps CLI Commands

##### Local Development
```bash
# Start local development with SWA CLI
swa start http://localhost:3000

# Start with API backend
swa start http://localhost:3000 --api-location api

# Start with specific configuration
swa start --config swa-cli.config.json
```

##### Deployment
```bash
# Deploy to Static Web Apps
swa deploy

# Deploy with specific configuration
swa deploy --deployment-token <deployment-token>

# Deploy to specific environment
swa deploy --env production
```

### CI/CD Pipeline Setup

#### GitHub Actions for App Service

##### Create GitHub Actions Workflow
```bash
# Create workflow directory
mkdir -p .github/workflows

# Create deployment workflow
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Azure App Service

on:
  push:
    branches: [ main ]

jobs:
  deploy:
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
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Azure App Service
      uses: azure/webapps-deploy@v2
      with:
        app-name: myNextjsApp
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: .
EOF
```

##### Set up Deployment Secrets
```bash
# Get publish profile
az webapp deployment list-publishing-profiles \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --xml

# Add to GitHub Secrets:
# AZURE_WEBAPP_PUBLISH_PROFILE=<publish-profile-xml>
```

#### Azure DevOps Pipeline

##### Create Azure Pipeline
```bash
# Install Azure DevOps CLI
az extension add --name azure-devops

# Create pipeline YAML
cat > azure-pipelines.yml << 'EOF'
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    npm ci
    npm run build
  displayName: 'Install and build'

- task: AzureWebApp@1
  inputs:
    azureSubscription: 'Azure Service Connection'
    appType: 'webAppLinux'
    appName: 'myNextjsApp'
    package: '.'
EOF
```

### Environment Configuration

#### Environment Variables Management

##### Set Production Environment Variables
```bash
# Set environment variables via Azure CLI
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --settings \
    NODE_ENV="production" \
    NEXTAUTH_URL="https://mynextjsapp.azurewebsites.net" \
    NEXTAUTH_SECRET="$(openssl rand -base64 32)" \
    DATABASE_URL="postgresql://user:pass@host:5432/db"

# Set for Container Apps
az containerapp update \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup \
  --set-env-vars \
    NODE_ENV=production \
    NEXTAUTH_URL=https://myapp.azurecontainerapps.io
```

##### Azure Key Vault Integration
```bash
# Create Key Vault
az keyvault create \
  --name myKeyVault \
  --resource-group myResourceGroup \
  --location "East US"

# Add secrets to Key Vault
az keyvault secret set \
  --vault-name myKeyVault \
  --name "NextAuthSecret" \
  --value "your-secret-value"

# Reference Key Vault in App Service
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --settings NEXTAUTH_SECRET="@Microsoft.KeyVault(VaultName=myKeyVault;SecretName=NextAuthSecret)"
```

### Database Configuration

#### Azure Database Setup

##### Create PostgreSQL Database
```bash
# Create PostgreSQL server
az postgres server create \
  --resource-group myResourceGroup \
  --name mypostgresserver \
  --location "East US" \
  --admin-user myadmin \
  --admin-password "P@ssw0rd123!" \
  --sku-name GP_Gen5_2

# Create database
az postgres db create \
  --resource-group myResourceGroup \
  --server-name mypostgresserver \
  --name mydatabase

# Configure firewall (allow Azure services)
az postgres server firewall-rule create \
  --resource-group myResourceGroup \
  --server mypostgresserver \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

##### Create SQL Database
```bash
# Create SQL server
az sql server create \
  --name mysqlserver \
  --resource-group myResourceGroup \
  --location "East US" \
  --admin-user sqladmin \
  --admin-password "P@ssw0rd123!"

# Create SQL database
az sql db create \
  --resource-group myResourceGroup \
  --server mysqlserver \
  --name mydatabase \
  --service-objective Basic

# Configure firewall
az sql server firewall-rule create \
  --resource-group myResourceGroup \
  --server mysqlserver \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Monitoring and Logging

#### Application Insights Setup

##### Create Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app myAppInsights \
  --location "East US" \
  --resource-group myResourceGroup \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app myAppInsights \
  --resource-group myResourceGroup \
  --query instrumentationKey --output tsv
```

##### Configure Application Insights
```bash
# Set Application Insights connection string in App Service
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="<connection-string>"

# Install Application Insights SDK
npm install applicationinsights
```

#### Log Analytics and Monitoring

##### Query Application Logs
```bash
# Get log stream from App Service
az webapp log tail --resource-group myResourceGroup --name myNextjsApp

# Download logs
az webapp log download --resource-group myResourceGroup --name myNextjsApp

# Query Container Apps logs
az containerapp logs show \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup
```

##### Set up Alerts
```bash
# Create metric alert
az monitor metrics alert create \
  --name "High CPU Usage" \
  --resource-group myResourceGroup \
  --scopes /subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/myNextjsApp \
  --condition "avg Percentage CPU > 80" \
  --description "Alert when CPU usage is high"
```

### Domain and SSL Configuration

#### Custom Domain Setup

##### Add Custom Domain
```bash
# Add custom domain to App Service
az webapp config hostname add \
  --webapp-name myNextjsApp \
  --resource-group myResourceGroup \
  --hostname www.mydomain.com

# List hostnames
az webapp config hostname list \
  --webapp-name myNextjsApp \
  --resource-group myResourceGroup
```

##### SSL Certificate Configuration
```bash
# Create App Service Managed Certificate
az webapp config ssl create \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --hostname www.mydomain.com

# Bind SSL certificate
az webapp config ssl bind \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI
```

### Scaling and Performance

#### App Service Scaling

##### Manual Scaling
```bash
# Scale up (increase instance size)
az appservice plan update \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku P1V2

# Scale out (increase instance count)
az webapp update \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --set "siteConfig.numberOfWorkers=3"
```

##### Auto Scaling
```bash
# Create autoscale settings
az monitor autoscale create \
  --resource-group myResourceGroup \
  --resource /subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan \
  --name myAutoscaleSetting \
  --min-count 1 \
  --max-count 5 \
  --count 2

# Add scale rule
az monitor autoscale rule create \
  --resource-group myResourceGroup \
  --autoscale-name myAutoscaleSetting \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 1
```

#### Container Apps Scaling
```bash
# Update Container App with scaling rules
az containerapp update \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup \
  --min-replicas 1 \
  --max-replicas 10 \
  --scale-rule-name cpu-scale \
  --scale-rule-type cpu \
  --scale-rule-metadata concurrentRequests=100
```

## Troubleshooting Commands

### Deployment Issues

#### App Service Troubleshooting
```bash
# Check deployment status
az webapp deployment list \
  --resource-group myResourceGroup \
  --name myNextjsApp

# Get deployment logs
az webapp log deployment show \
  --resource-group myResourceGroup \
  --name myNextjsApp

# Check app service status
az webapp show \
  --resource-group myResourceGroup \
  --name myNextjsApp \
  --query state

# Restart app service
az webapp restart \
  --resource-group myResourceGroup \
  --name myNextjsApp
```

#### Container Apps Troubleshooting
```bash
# Check container app status
az containerapp show \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup \
  --query properties.runningStatus

# Get container logs
az containerapp logs show \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup \
  --follow

# Get revision information
az containerapp revision list \
  --name myNextjsContainerApp \
  --resource-group myResourceGroup
```

### Performance Issues

#### Monitor Resource Usage
```bash
# Get App Service metrics
az monitor metrics list \
  --resource /subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/myNextjsApp \
  --metric "CpuPercentage,MemoryPercentage" \
  --start-time 2023-01-01T00:00:00Z \
  --end-time 2023-01-02T00:00:00Z

# Check Container Apps metrics
az monitor metrics list \
  --resource /subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.ContainerInstance/containerGroups/myNextjsContainerApp \
  --metric "CPUUsage,MemoryUsage"
```

#### Application Performance
```bash
# Test application performance
curl -w "@curl-format.txt" -o /dev/null -s "https://mynextjsapp.azurewebsites.net/"

# Load test with Apache Bench
ab -n 100 -c 10 https://mynextjsapp.azurewebsites.net/

# Check response times
time curl https://mynextjsapp.azurewebsites.net/
```

### Connectivity Issues

#### Network Troubleshooting
```bash
# Test connectivity to database
az postgres server show \
  --resource-group myResourceGroup \
  --name mypostgresserver \
  --query fullyQualifiedDomainName

# Test DNS resolution
nslookup mynextjsapp.azurewebsites.net

# Check SSL certificate
openssl s_client -connect mynextjsapp.azurewebsites.net:443 -servername mynextjsapp.azurewebsites.net
```

#### Security and Access Issues
```bash
# Check firewall rules
az webapp config access-restriction show \
  --resource-group myResourceGroup \
  --name myNextjsApp

# Test authentication
curl -I https://mynextjsapp.azurewebsites.net/api/auth/session

# Check Key Vault access
az keyvault secret show \
  --vault-name myKeyVault \
  --name NextAuthSecret
```
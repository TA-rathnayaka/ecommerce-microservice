#!/bin/bash
# ============================================================================
# Azure Initial Setup Script (Terraform)
# Run this ONCE to create the foundational Azure resources
# ============================================================================
# Prerequisites: az cli, terraform, docker
# Usage: chmod +x azure/setup.sh && ./azure/setup.sh
# ============================================================================

set -e

# ─── Configuration ──────────────────────────────────────────────────────────
RESOURCE_GROUP="rg-ecommerce"
LOCATION="southeastasia"           # Change to your preferred region
ACR_NAME="ecommerceacr$(date +%s | tail -c 6)"  # Must be globally unique
COSMOS_ACCOUNT_NAME="cosmos-ecommerce-$(date +%s | tail -c 6)"
APP_SECRET="ecommerce_microservice_secret_key_2024"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Azure Ecommerce Microservice Setup (Terraform)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ─── Step 1: Login to Azure ────────────────────────────────────────────────
echo ""
echo "🔑 Step 1: Checking Azure login..."
az account show > /dev/null 2>&1 || az login

# ─── Step 2: Generate terraform.tfvars ─────────────────────────────────────
echo ""
echo "📝 Step 2: Generating terraform.tfvars..."
cat > azure/terraform.tfvars <<EOF
location               = "$LOCATION"
environment_name       = "ecommerce"
resource_group_name    = "$RESOURCE_GROUP"
acr_name               = "$ACR_NAME"
cosmos_db_account_name = "$COSMOS_ACCOUNT_NAME"
mongodb_connection_string = ""
app_secret             = "$APP_SECRET"
image_tag              = "latest"
EOF
echo "  Generated azure/terraform.tfvars"

# ─── Step 3: Terraform Init & Apply (infra only, no container apps yet) ────
echo ""
echo "☁️  Step 3: Provisioning Azure infrastructure with Terraform..."
cd azure
terraform init
terraform apply -auto-approve -var-file="terraform.tfvars"

# Capture outputs
ACR_LOGIN_SERVER=$(terraform output -raw acr_login_server)
echo ""
echo "  ✅ Infrastructure provisioned"
echo "  ACR: $ACR_LOGIN_SERVER"

cd ..

# ─── Step 4: Build & Push Docker images ────────────────────────────────────
echo ""
echo "🔨 Step 4: Building and pushing Docker images..."

# Login to ACR
az acr login --name $ACR_NAME

echo "  Building customer service..."
docker build -t ${ACR_LOGIN_SERVER}/ecommerce/customer:latest ./backend/customer
docker push ${ACR_LOGIN_SERVER}/ecommerce/customer:latest

echo "  Building products service..."
docker build -t ${ACR_LOGIN_SERVER}/ecommerce/products:latest ./backend/products
docker push ${ACR_LOGIN_SERVER}/ecommerce/products:latest

echo "  Building shopping service..."
docker build -t ${ACR_LOGIN_SERVER}/ecommerce/shopping:latest ./backend/shopping
docker push ${ACR_LOGIN_SERVER}/ecommerce/shopping:latest

echo "  Building proxy..."
docker build -f ./backend/proxy/Dockerfile.prod -t ${ACR_LOGIN_SERVER}/ecommerce/proxy:latest ./backend/proxy
docker push ${ACR_LOGIN_SERVER}/ecommerce/proxy:latest

echo "  Building frontend (initial build, will need rebuild after proxy URL is known)..."
docker build \
  --build-arg REACT_APP_API_BASE_URL="https://TBD-PROXY-URL" \
  -t ${ACR_LOGIN_SERVER}/ecommerce/frontend:latest ./frontend
docker push ${ACR_LOGIN_SERVER}/ecommerce/frontend:latest

# ─── Step 5: Get deployment outputs ────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd azure
FRONTEND_URL=$(terraform output -raw frontend_url 2>/dev/null || echo "pending...")
API_URL=$(terraform output -raw api_gateway_url 2>/dev/null || echo "pending...")
cd ..

echo ""
echo "  🌐 Frontend URL:    $FRONTEND_URL"
echo "  🔌 API Gateway URL: $API_URL"
echo "  🐳 ACR Name:        $ACR_NAME"
echo "  🗄️  Cosmos DB:       $COSMOS_ACCOUNT_NAME"
echo "  📦 Resource Group:  $RESOURCE_GROUP"
echo ""
echo "  ⚠️  IMPORTANT: Rebuild the frontend with the correct API URL:"
echo "  docker build --build-arg REACT_APP_API_BASE_URL=$API_URL \\"
echo "    -t ${ACR_LOGIN_SERVER}/ecommerce/frontend:latest ./frontend"
echo "  docker push ${ACR_LOGIN_SERVER}/ecommerce/frontend:latest"
echo "  az containerapp update --name ca-frontend --resource-group $RESOURCE_GROUP \\"
echo "    --image ${ACR_LOGIN_SERVER}/ecommerce/frontend:latest"
echo ""
echo "  📂 To manage infrastructure: cd azure && terraform plan"
echo "  🗑️  To tear down:            cd azure && terraform destroy"
echo ""

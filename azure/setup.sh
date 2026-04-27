#!/bin/bash
# ============================================================================
# Full deployment: Terraform (AKS infra) + Docker (build/push) + kubectl (app)
# ============================================================================
# Prerequisites: az cli, terraform, docker, kubectl
# Usage:
#   chmod +x setup.sh && ./setup.sh          # Full deploy
#   ./setup.sh --app-only                    # Re-deploy K8s manifests only
#   ./setup.sh --images-only                 # Rebuild & push images only
# ============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TF_DIR="$SCRIPT_DIR"
K8S_DIR="$(cd "$SCRIPT_DIR/.." && pwd)/k8s"
MODE="${1:-full}"
cd "$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT_DIR="$(pwd)"

# FIX 3: Use git commit hash as image tag to avoid corrupted latest manifest
IMAGE_TAG=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Ecommerce Microservice — Azure AKS Deployment"
echo "  Mode: $MODE | Image tag: $IMAGE_TAG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ─── Azure login ────────────────────────────────────────────────────────────
echo ""
echo "🔑 Checking Azure login..."
az account show > /dev/null 2>&1 || az login

# ─── Step 1: Terraform — provision AKS + ACR ────────────────────────────────
if [[ "$MODE" == "full" ]]; then
  echo ""
  echo "☁️  Step 1: Provisioning infrastructure with Terraform..."

  if [ ! -f "$TF_DIR/terraform.tfvars" ]; then
    echo "❌ ERROR: $TF_DIR/terraform.tfvars not found."
    echo "   Copy the example: cp azure/terraform.tfvars.example azure/terraform.tfvars"
    echo "   Then fill in your values and re-run."
    exit 1
  fi

  cd "$TF_DIR"
  terraform init -upgrade
  terraform apply -auto-approve -var-file="terraform.tfvars"
  cd "$ROOT_DIR"
  echo "  ✅ Infrastructure ready"
fi

# ─── Capture Terraform outputs ──────────────────────────────────────────────
echo ""
echo "📤 Reading Terraform outputs..."
cd "$TF_DIR"
ACR_LOGIN_SERVER=$(terraform output -raw acr_login_server)
ACR_NAME=$(terraform output -raw acr_name)
AKS_CLUSTER=$(terraform output -raw aks_cluster_name)
RESOURCE_GROUP=$(terraform output -raw resource_group_name)
cd "$ROOT_DIR"
echo "  ACR: $ACR_LOGIN_SERVER"
echo "  AKS: $AKS_CLUSTER"

# ─── FIX 2: Attach ACR to AKS so auth never breaks ──────────────────────────
if [[ "$MODE" == "full" ]]; then
  echo ""
  echo "🔗 Attaching ACR to AKS..."
  az aks update \
    --name "$AKS_CLUSTER" \
    --resource-group "$RESOURCE_GROUP" \
    --attach-acr "$ACR_NAME"
  echo "  ✅ ACR attached"
fi

# ─── Step 2: Build & push Docker images ─────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "--images-only" ]]; then
  echo ""
  echo "🔨 Step 2: Building and pushing Docker images..."
  az acr login --name "$ACR_NAME"

  echo "  → customer"
  docker build --platform linux/amd64 -t "${ACR_LOGIN_SERVER}/ecommerce/customer:${IMAGE_TAG}" ./backend/customer
  docker push "${ACR_LOGIN_SERVER}/ecommerce/customer:${IMAGE_TAG}"

  echo "  → products"
  docker build --platform linux/amd64 -t "${ACR_LOGIN_SERVER}/ecommerce/products:${IMAGE_TAG}" ./backend/products
  docker push "${ACR_LOGIN_SERVER}/ecommerce/products:${IMAGE_TAG}"

  echo "  → shopping"
  docker build --platform linux/amd64 -t "${ACR_LOGIN_SERVER}/ecommerce/shopping:${IMAGE_TAG}" ./backend/shopping
  docker push "${ACR_LOGIN_SERVER}/ecommerce/shopping:${IMAGE_TAG}"

  echo "  → proxy"
  docker build --platform linux/amd64 -f ./backend/proxy/Dockerfile.prod \
    -t "${ACR_LOGIN_SERVER}/ecommerce/proxy:${IMAGE_TAG}" ./backend/proxy
  docker push "${ACR_LOGIN_SERVER}/ecommerce/proxy:${IMAGE_TAG}"

  echo "  → frontend (no build-arg needed — uses runtime config)"
  docker build --platform linux/amd64 \
    -t "${ACR_LOGIN_SERVER}/ecommerce/frontend:${IMAGE_TAG}" ./frontend
  docker push "${ACR_LOGIN_SERVER}/ecommerce/frontend:${IMAGE_TAG}"

  echo "  ✅ Images pushed"
fi

# ─── Step 3: Update K8s manifests with real ACR name ────────────────────────
echo ""
echo "📝 Step 3: Patching image names in K8s manifests..."
# FIX 1: Match only image lines to prevent double-prefixing on re-runs
find "$K8S_DIR" -name "*.yaml" | xargs sed -i '' "s|image: ecommerce/|image: $ACR_LOGIN_SERVER/ecommerce/|g"
# Also patch image tags to use current IMAGE_TAG
find "$K8S_DIR" -name "*.yaml" | xargs sed -i '' "s|/ecommerce/\(.*\):latest|/ecommerce/\1:${IMAGE_TAG}|g"
echo "  ✅ Image names updated"

# ─── Step 4: Configure kubectl ──────────────────────────────────────────────
echo ""
echo "⚙️  Step 4: Configuring kubectl..."
az aks get-credentials \
  --resource-group "$RESOURCE_GROUP" \
  --name "$AKS_CLUSTER" \
  --overwrite-existing
echo "  ✅ kubectl configured"

# ─── Step 5: Deploy to Kubernetes ───────────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "--app-only" ]]; then
  echo ""
  echo "🚢 Step 5: Deploying to Kubernetes..."

  # Namespace first
  kubectl apply -f "$K8S_DIR/namespace.yaml"

  # StorageClass for Azure Disks
  kubectl apply -f "$K8S_DIR/infrastructure/storage-class.yaml"

  # Secrets & infrastructure
  kubectl apply -f "$K8S_DIR/infrastructure/mongodb/"
  kubectl apply -f "$K8S_DIR/infrastructure/rabbitmq/"

  # Wait for infrastructure to be ready
  echo "  ⏳ Waiting for MongoDB and RabbitMQ to be ready..."
  kubectl rollout status deployment/products-db -n ecommerce --timeout=120s
  kubectl rollout status deployment/customer-db -n ecommerce --timeout=120s
  kubectl rollout status deployment/shopping-db -n ecommerce --timeout=120s
  kubectl rollout status deployment/rabbitmq    -n ecommerce --timeout=120s

  # Microservices
  kubectl apply -f "$K8S_DIR/services/customer/"
  kubectl apply -f "$K8S_DIR/services/products/"
  kubectl apply -f "$K8S_DIR/services/shopping/"

  # Gateway & frontend
  kubectl apply -f "$K8S_DIR/gateway/"

  echo "  ✅ All manifests applied"

  # ─── Step 6: Get external IPs ─────────────────────────────────────────────
  echo ""
  echo "⏳ Step 6: Waiting for external IPs (may take 2-3 minutes)..."
  kubectl wait --for=jsonpath='{.status.loadBalancer.ingress}' \
    service/proxy -n ecommerce --timeout=180s 2>/dev/null || true
  kubectl wait --for=jsonpath='{.status.loadBalancer.ingress}' \
    service/frontend -n ecommerce --timeout=180s 2>/dev/null || true

  PROXY_IP=$(kubectl get svc proxy -n ecommerce \
    -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")
  FRONTEND_IP=$(kubectl get svc frontend -n ecommerce \
    -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")

  # FIX 3: No frontend rebuild needed — proxy IP is injected at runtime via K8s env var

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ✅ Deployment Complete!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  🌐 Frontend:    http://${FRONTEND_IP}"
  echo "  🔌 API Gateway: http://${PROXY_IP}:8000"
  echo "  🐳 ACR:         $ACR_LOGIN_SERVER"
  echo "  ☸️  AKS Cluster: $AKS_CLUSTER"
  echo "  🏷️  Image tag:   $IMAGE_TAG"
  echo ""
  echo "  Useful commands:"
  echo "  kubectl get all -n ecommerce"
  echo "  kubectl logs -n ecommerce deploy/customer-deploy"
  echo "  kubectl logs -n ecommerce deploy/rabbitmq"
  echo ""
  echo "  To update app only:    ./setup.sh --app-only"
  echo "  To rebuild images:     ./setup.sh --images-only"
  echo "  To tear down infra:    cd azure && terraform destroy"
fi
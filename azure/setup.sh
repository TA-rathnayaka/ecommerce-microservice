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

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Ecommerce Microservice — Azure AKS Deployment"
echo "  Mode: $MODE"
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

# ─── Step 2: Build & push Docker images ─────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "--images-only" ]]; then
  echo ""
  echo "🔨 Step 2: Building and pushing Docker images..."
  az acr login --name "$ACR_NAME"

  echo "  → customer"
  docker build --platform linux/amd64 -t "${ACR_LOGIN_SERVER}/ecommerce/customer:latest" ./backend/customer
  docker push "${ACR_LOGIN_SERVER}/ecommerce/customer:latest"

  echo "  → products"
  docker build --platform linux/amd64 -t "${ACR_LOGIN_SERVER}/ecommerce/products:latest" ./backend/products
  docker push "${ACR_LOGIN_SERVER}/ecommerce/products:latest"

  echo "  → shopping"
  docker build --platform linux/amd64 -t "${ACR_LOGIN_SERVER}/ecommerce/shopping:latest" ./backend/shopping
  docker push "${ACR_LOGIN_SERVER}/ecommerce/shopping:latest"

  echo "  → proxy"
  docker build --platform linux/amd64 -f ./backend/proxy/Dockerfile.prod \
    -t "${ACR_LOGIN_SERVER}/ecommerce/proxy:latest" ./backend/proxy
  docker push "${ACR_LOGIN_SERVER}/ecommerce/proxy:latest"

  echo "  → frontend"
  # We get the proxy external IP after kubectl apply, but build with a placeholder first
  docker build --platform linux/amd64 \
    --build-arg REACT_APP_API_BASE_URL="http://PROXY_IP:8000" \
    -t "${ACR_LOGIN_SERVER}/ecommerce/frontend:latest" ./frontend
  docker push "${ACR_LOGIN_SERVER}/ecommerce/frontend:latest"

  echo "  ✅ Images pushed"
fi

# ─── Step 3: Update K8s manifests with real ACR name ────────────────────────
echo ""
echo "📝 Step 3: Patching image names in K8s manifests..."
# We replace 'ecommerce/' with the full ACR path
find "$K8S_DIR" -name "*.yaml" | xargs sed -i '' "s|ecommerce/|$ACR_LOGIN_SERVER/ecommerce/|g"
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

  # Rebuild frontend with real proxy IP if available
  if [[ "$PROXY_IP" != "pending" ]]; then
    echo ""
    echo "🔄 Rebuilding frontend with real proxy IP..."
    az acr login --name "$ACR_NAME"
    docker build --platform linux/amd64 \
      --build-arg REACT_APP_API_BASE_URL="http://${PROXY_IP}:8000" \
      -t "${ACR_LOGIN_SERVER}/ecommerce/frontend:latest" ./frontend
    docker push "${ACR_LOGIN_SERVER}/ecommerce/frontend:latest"
    kubectl rollout restart deployment/frontend-deploy -n ecommerce
    echo "  ✅ Frontend rebuilt with REACT_APP_API_BASE_URL=http://${PROXY_IP}:8000"
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ✅ Deployment Complete!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  🌐 Frontend:    http://${FRONTEND_IP}"
  echo "  🔌 API Gateway: http://${PROXY_IP}:8000"
  echo "  🐳 ACR:         $ACR_LOGIN_SERVER"
  echo "  ☸️  AKS Cluster: $AKS_CLUSTER"
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

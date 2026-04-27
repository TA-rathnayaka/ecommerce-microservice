#!/bin/bash
# ============================================================================
# Full deployment: Terraform (AKS infra) + Docker (build/push) + kubectl (app)
# ============================================================================
# Mode: --app-only | --images-only | full
# ============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TF_DIR="$SCRIPT_DIR"
K8S_DIR="$(cd "$SCRIPT_DIR/.." && pwd)/k8s"
MODE="${1:-full}"
cd "$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT_DIR="$(pwd)"

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

# ─── Attach ACR to AKS ──────────────────────────────────────────────────────
if [[ "$MODE" == "full" ]]; then
  echo ""
  echo "🔗 Attaching ACR to AKS..."
  az aks update --name "$AKS_CLUSTER" --resource-group "$RESOURCE_GROUP" --attach-acr "$ACR_NAME" >/dev/null
  echo "  ✅ ACR attached"
fi

# ─── Step 2: Build & push Docker images ─────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "--images-only" ]]; then
  echo ""
  echo "🔨 Step 2: Building and pushing Docker images..."
  az acr login --name "$ACR_NAME" >/dev/null
  
  for service in customer products shopping; do
    echo "  → $service"
    docker build --platform linux/amd64 -t "${ACR_LOGIN_SERVER}/ecommerce/${service}:${IMAGE_TAG}" "./backend/${service}" >/dev/null
    docker push "${ACR_LOGIN_SERVER}/ecommerce/${service}:${IMAGE_TAG}" >/dev/null
  done
  
  echo "  → proxy"
  docker build --platform linux/amd64 -f ./backend/proxy/Dockerfile.prod -t "${ACR_LOGIN_SERVER}/ecommerce/proxy:${IMAGE_TAG}" ./backend/proxy >/dev/null
  docker push "${ACR_LOGIN_SERVER}/ecommerce/proxy:${IMAGE_TAG}" >/dev/null
  
  echo "  → frontend"
  docker build --platform linux/amd64 -t "${ACR_LOGIN_SERVER}/ecommerce/frontend:${IMAGE_TAG}" ./frontend >/dev/null
  docker push "${ACR_LOGIN_SERVER}/ecommerce/frontend:${IMAGE_TAG}" >/dev/null
  
  echo "  ✅ Images pushed"
fi

# ─── Step 3: Update K8s manifests with real ACR name ────────────────────────
echo ""
echo "📝 Step 3: Patching image names in K8s manifests..."
# Fix image prefixes
find "$K8S_DIR" -name "*.yaml" | xargs sed -i '' "s|image: ecommerce/|image: $ACR_LOGIN_SERVER/ecommerce/|g" 2>/dev/null || true

# Only patch tags if we actually pushed new ones in this run
if [[ "$MODE" == "full" || "$MODE" == "--images-only" ]]; then
  find "$K8S_DIR" -name "*.yaml" | xargs sed -i '' "s|/ecommerce/\(.*\):latest|/ecommerce/\1:${IMAGE_TAG}|g" 2>/dev/null || true
  find "$K8S_DIR" -name "*.yaml" | xargs sed -i '' "s|/ecommerce/\(.*\):v[0-9]*|/ecommerce/\1:${IMAGE_TAG}|g" 2>/dev/null || true
fi
echo "  ✅ Image names updated"

# ─── Step 4: Configure kubectl ──────────────────────────────────────────────
echo ""
echo "⚙️  Step 4: Configuring kubectl..."
az aks get-credentials --resource-group "$RESOURCE_GROUP" --name "$AKS_CLUSTER" --overwrite-existing >/dev/null
echo "  ✅ kubectl configured"

# ─── Step 5: Deploy to Kubernetes ───────────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "--app-only" ]]; then
  echo ""
  echo "🚢 Step 5: Deploying to Kubernetes..."
  kubectl apply -f "$K8S_DIR/namespace.yaml" >/dev/null
  kubectl apply -f "$K8S_DIR/infrastructure/storage-class.yaml" >/dev/null
  kubectl apply -f "$K8S_DIR/infrastructure/mongodb/" >/dev/null
  kubectl apply -f "$K8S_DIR/infrastructure/rabbitmq/" >/dev/null

  echo "  ⏳ Waiting for Databases..."
  kubectl rollout status deployment/products-db -n ecommerce --timeout=120s >/dev/null
  kubectl rollout status deployment/customer-db -n ecommerce --timeout=120s >/dev/null
  kubectl rollout status deployment/shopping-db -n ecommerce --timeout=120s >/dev/null
  kubectl rollout status deployment/rabbitmq    -n ecommerce --timeout=120s >/dev/null

  echo "  🚀 Deploying Microservices..."
  kubectl apply -f "$K8S_DIR/services/customer/" >/dev/null
  kubectl apply -f "$K8S_DIR/services/products/" >/dev/null
  kubectl apply -f "$K8S_DIR/services/shopping/" >/dev/null
  kubectl apply -f "$K8S_DIR/gateway/proxy.yaml" >/dev/null
  kubectl apply -f "$K8S_DIR/gateway/frontend.yaml" >/dev/null

  # ─── Step 6: Ingress & HTTPS ──────────────────────────────────────────────
  echo ""
  echo "🌐 Step 6: Setting up Ingress & HTTPS (Let's Encrypt)..."
  
  echo "  Installing NGINX Ingress Controller..."
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml >/dev/null
  
  echo "  ⏳ Waiting for Ingress IP (this takes 2-3 mins)..."
  INGRESS_IP=""
  while [ -z "$INGRESS_IP" ] || [ "$INGRESS_IP" == "pending" ]; do
    INGRESS_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")
    [ "$INGRESS_IP" == "pending" ] && sleep 10
  done
  echo "  ✅ Ingress IP: $INGRESS_IP"

  echo "  Installing cert-manager..."
  kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml >/dev/null
  echo "  ⏳ Waiting for cert-manager..."
  kubectl wait --for=condition=Available deployment/cert-manager -n cert-manager --timeout=120s >/dev/null

  echo "  Applying ClusterIssuer..."
  kubectl apply -f "$K8S_DIR/gateway/cluster-issuer.yaml" >/dev/null

  DOMAIN="${INGRESS_IP}.nip.io"
  echo "  🚀 Your domain: $DOMAIN"

  echo "  Applying Ingress with HTTPS..."
  sed "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$K8S_DIR/gateway/ingress.yaml" | kubectl apply -f - >/dev/null

  echo "  Updating frontend with HTTPS API URL..."
  kubectl set env deployment/frontend-deploy -n ecommerce PROXY_IP="https://${DOMAIN}/api" >/dev/null
  kubectl rollout restart deployment/frontend-deploy -n ecommerce >/dev/null
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ✅ Deployment Complete!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  🔒 HTTPS Website:   https://${DOMAIN}"
  echo "  🔌 HTTPS API:       https://${DOMAIN}/api"
  echo "  🐳 ACR:             $ACR_LOGIN_SERVER"
  echo "  ☸️  AKS Cluster:     $AKS_CLUSTER"
  echo "  🏷️  Image tag:       $IMAGE_TAG"
  echo ""
  echo "  Useful commands:"
  echo "  kubectl get certificate -n ecommerce"
  echo "  kubectl get ingress -n ecommerce"
  echo ""
  echo "  To update app only:    ./setup.sh --app-only"
  echo "  To rebuild images:     ./setup.sh --images-only"
  echo "  To tear down infra:    cd azure && terraform destroy"
fi

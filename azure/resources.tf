# ============================================================================
# Resource Group
# ============================================================================

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    environment = var.environment_name
    managed_by  = "terraform"
  }
}

# ============================================================================
# Azure Container Registry
# ============================================================================

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    environment = var.environment_name
  }
}

# ============================================================================
# Virtual Network for AKS
# ============================================================================

resource "azurerm_virtual_network" "main" {
  name                = "vnet-${var.environment_name}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  address_space       = ["10.0.0.0/8"]

  tags = {
    environment = var.environment_name
  }
}

resource "azurerm_subnet" "aks" {
  name                 = "snet-aks"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.240.0.0/16"]
}

# ============================================================================
# Managed Identity for AKS → ACR image pull
# ============================================================================

resource "azurerm_user_assigned_identity" "aks" {
  name                = "id-${var.environment_name}-aks"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = {
    environment = var.environment_name
  }
}

# Grant AKS identity the AcrPull role on ACR
resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.aks.principal_id
}

# Grant AKS identity the Managed Identity Operator role on itself
# This is required when using a user-assigned identity for the Kubelet
resource "azurerm_role_assignment" "aks_managed_identity_operator" {
  scope                = azurerm_user_assigned_identity.aks.id
  role_definition_name = "Managed Identity Operator"
  principal_id         = azurerm_user_assigned_identity.aks.principal_id
}

# Grant AKS identity Network Contributor on the subnet
resource "azurerm_role_assignment" "aks_network_contributor" {
  scope                = azurerm_subnet.aks.id
  role_definition_name = "Network Contributor"
  principal_id         = azurerm_user_assigned_identity.aks.principal_id
}

# ============================================================================
# AKS Cluster
# ============================================================================

resource "azurerm_kubernetes_cluster" "main" {
  name                = var.aks_cluster_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = var.aks_cluster_name
  oidc_issuer_enabled = true
  workload_identity_enabled = true

  # Use the managed identity for all cluster operations
  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.aks.id]
  }

  kubelet_identity {
    client_id                 = azurerm_user_assigned_identity.aks.client_id
    object_id                 = azurerm_user_assigned_identity.aks.principal_id
    user_assigned_identity_id = azurerm_user_assigned_identity.aks.id
  }

  default_node_pool {
    name           = "default"
    node_count     = var.aks_node_count
    vm_size        = var.aks_node_vm_size
    vnet_subnet_id = azurerm_subnet.aks.id

    # Enable auto-scaling (optional — remove if you want fixed node count)
    enable_auto_scaling = true
    min_count           = 2
    max_count           = 5
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    service_cidr      = "10.0.0.0/16"
    dns_service_ip    = "10.0.0.10"
  }


  tags = {
    environment = var.environment_name
  }

  depends_on = [
    azurerm_role_assignment.aks_acr_pull,
    azurerm_role_assignment.aks_managed_identity_operator,
    azurerm_role_assignment.aks_network_contributor
  ]
}

# ============================================================================
# Log Analytics Workspace (for AKS monitoring)
# ============================================================================

resource "azurerm_log_analytics_workspace" "main" {
  name                = "log-${var.environment_name}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    environment = var.environment_name
  }
}

# ============================================================================
# Outputs
# ============================================================================

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "acr_login_server" {
  description = "ACR login server URL — prefix all image names with this"
  value       = azurerm_container_registry.acr.login_server
}

output "acr_name" {
  description = "ACR name (used for az acr login)"
  value       = azurerm_container_registry.acr.name
}

output "aks_cluster_name" {
  description = "AKS cluster name"
  value       = azurerm_kubernetes_cluster.main.name
}

output "get_credentials_command" {
  description = "Run this to configure kubectl after terraform apply"
  value       = "az aks get-credentials --resource-group ${azurerm_resource_group.main.name} --name ${azurerm_kubernetes_cluster.main.name}"
}

output "kube_config" {
  description = "Raw kubeconfig (sensitive)"
  value       = azurerm_kubernetes_cluster.main.kube_config_raw
  sensitive   = true
}

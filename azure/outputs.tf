# ============================================================================
# Outputs
# ============================================================================

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "acr_login_server" {
  description = "ACR login server URL"
  value       = azurerm_container_registry.acr.login_server
}

output "acr_admin_username" {
  description = "ACR admin username"
  value       = azurerm_container_registry.acr.admin_username
}

output "cosmos_db_connection_string" {
  description = "Cosmos DB primary MongoDB connection string"
  value       = azurerm_cosmosdb_account.mongodb.primary_mongodb_connection_string
  sensitive   = true
}

output "frontend_url" {
  description = "Frontend application URL"
  value       = "https://${azurerm_container_app.frontend.ingress[0].fqdn}"
}

output "api_gateway_url" {
  description = "API gateway (proxy) URL"
  value       = "https://${azurerm_container_app.proxy.ingress[0].fqdn}"
}

output "container_app_environment_id" {
  description = "Container Apps Environment ID"
  value       = azurerm_container_app_environment.main.id
}

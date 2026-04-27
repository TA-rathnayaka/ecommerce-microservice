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
# Azure Cosmos DB (MongoDB API)
# ============================================================================

locals {
  cosmos_account_name = var.cosmos_db_account_name != "" ? var.cosmos_db_account_name : "cosmos-${var.environment_name}"
}

resource "azurerm_cosmosdb_account" "mongodb" {
  name                = local.cosmos_account_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "MongoDB"

  capabilities {
    name = "EnableMongo"
  }

  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level = "Eventual"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  tags = {
    environment = var.environment_name
  }
}

# MongoDB Databases
resource "azurerm_cosmosdb_mongo_database" "customer" {
  name                = "msytt_customer"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.mongodb.name
}

resource "azurerm_cosmosdb_mongo_database" "product" {
  name                = "msytt_product"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.mongodb.name
}

resource "azurerm_cosmosdb_mongo_database" "shopping" {
  name                = "msytt_shopping"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.mongodb.name
}

# ============================================================================
# Log Analytics Workspace
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

# ============================================================================
# Container Apps Environment
# ============================================================================

resource "azurerm_container_app_environment" "main" {
  name                       = "cae-${var.environment_name}"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  tags = {
    environment = var.environment_name
  }
}

# ============================================================================
# Input Variables
# ============================================================================

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "southeastasia"
}

variable "environment_name" {
  description = "Environment name used as prefix for resources"
  type        = string
  default     = "ecommerce"
}

variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "rg-ecommerce"
}

variable "acr_name" {
  description = "Azure Container Registry name (must be globally unique)"
  type        = string
}

variable "mongodb_connection_string" {
  description = "Azure Cosmos DB for MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "app_secret" {
  description = "Application secret for JWT signing"
  type        = string
  sensitive   = true
}

variable "image_tag" {
  description = "Container image tag to deploy"
  type        = string
  default     = "latest"
}

variable "cosmos_db_account_name" {
  description = "Azure Cosmos DB account name (must be globally unique)"
  type        = string
  default     = ""
}

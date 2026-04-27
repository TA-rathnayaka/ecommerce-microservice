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
  description = "Azure Container Registry name (globally unique, 5-50 alphanumeric chars)"
  type        = string
}

variable "aks_cluster_name" {
  description = "AKS cluster name"
  type        = string
  default     = "aks-ecommerce"
}

variable "aks_node_count" {
  description = "Number of nodes in the default AKS node pool"
  type        = number
  default     = 2
}

variable "aks_node_vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_B2s_v2"
}

variable "app_secret" {
  description = "JWT signing secret shared across all microservices"
  type        = string
  sensitive   = true
}

variable "image_tag" {
  description = "Container image tag to deploy"
  type        = string
  default     = "latest"
}

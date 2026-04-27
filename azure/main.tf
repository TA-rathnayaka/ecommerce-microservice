# ============================================================================
# Azure Ecommerce Microservice — Terraform Configuration
# ============================================================================
# Usage:
#   cd azure
#   terraform init
#   terraform plan -var-file="terraform.tfvars"
#   terraform apply -var-file="terraform.tfvars"
# ============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }

  # Uncomment to use Azure Storage as remote backend
  # backend "azurerm" {
  #   resource_group_name  = "rg-terraform-state"
  #   storage_account_name = "taborestateXXXXX"
  #   container_name       = "tfstate"
  #   key                  = "ecommerce.tfstate"
  # }
}

provider "azurerm" {
  features {}
}

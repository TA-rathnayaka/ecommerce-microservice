# ============================================================================
# Terraform Variable Values — Fill in before deploying
# ============================================================================

location            = "southeastasia"
environment_name    = "ecommerce"
resource_group_name = "rg-ecommerce"

# Must be globally unique, lowercase, alphanumeric only
acr_name = "<YOUR_UNIQUE_ACR_NAME>"

# Must be globally unique, lowercase
cosmos_db_account_name = "<YOUR_UNIQUE_COSMOS_ACCOUNT_NAME>"

# Leave empty if Cosmos DB is being created by Terraform (it will be auto-populated)
mongodb_connection_string = ""

# JWT signing secret
app_secret = "ecommerce_microservice_secret_key_2024"

# Container image tag
image_tag = "latest"

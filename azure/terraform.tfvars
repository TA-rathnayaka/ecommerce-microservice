# ============================================================================
# Terraform Variable Values — Fill in before deploying
# ============================================================================

location            = "southeastasia"
environment_name    = "ecommerce"
resource_group_name = "rg-ecommerce"

# Must be globally unique, lowercase, alphanumeric only
acr_name = "tharanga123acr"


# JWT signing secret
app_secret = "ecommerce_microservice_secret_key_2024"

# Container image tag
image_tag = "latest"

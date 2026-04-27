# ============================================================================
# Container Apps — Microservices
# ============================================================================

locals {
  # Use provided connection string or derive from Cosmos DB resource
  mongo_conn_string = var.mongodb_connection_string != "" ? var.mongodb_connection_string : azurerm_cosmosdb_account.mongodb.primary_mongodb_connection_string
  acr_login_server  = azurerm_container_registry.acr.login_server
  acr_admin_user    = azurerm_container_registry.acr.admin_username
  acr_admin_pass    = azurerm_container_registry.acr.admin_password
}

# ============================================================================
# RabbitMQ
# ============================================================================

resource "azurerm_container_app" "rabbitmq" {
  name                         = "ca-rabbitmq"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  ingress {
    external_enabled = false
    target_port      = 5672
    transport        = "tcp"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = 1
    max_replicas = 1

    container {
      name   = "rabbitmq"
      image  = "rabbitmq:3.12-alpine"
      cpu    = 0.5
      memory = "1Gi"
    }
  }

  tags = {
    environment = var.environment_name
    service     = "messaging"
  }
}

# ============================================================================
# Customer Microservice
# ============================================================================

resource "azurerm_container_app" "customer" {
  name                         = "ca-customer"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  secret {
    name  = "acr-password"
    value = local.acr_admin_pass
  }

  secret {
    name  = "app-secret"
    value = var.app_secret
  }

  secret {
    name  = "mongodb-uri"
    value = "${local.mongo_conn_string}msytt_customer?retryWrites=true&w=majority"
  }

  registry {
    server               = local.acr_login_server
    username             = local.acr_admin_user
    password_secret_name = "acr-password"
  }

  ingress {
    external_enabled = false
    target_port      = 8001
    transport        = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name   = "customer"
      image  = "${local.acr_login_server}/ecommerce/customer:${var.image_tag}"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name        = "APP_SECRET"
        secret_name = "app-secret"
      }
      env {
        name        = "MONGODB_URI"
        secret_name = "mongodb-uri"
      }
      env {
        name  = "MSG_QUEUE_URL"
        value = "amqp://ca-rabbitmq:5672"
      }
      env {
        name  = "EXCHANGE_NAME"
        value = "ONLINE_STORE"
      }
      env {
        name  = "PORT"
        value = "8001"
      }
      env {
        name  = "NODE_ENV"
        value = "prod"
      }
    }

    http_scale_rule {
      name                = "http-scaling"
      concurrent_requests = "50"
    }
  }

  tags = {
    environment = var.environment_name
    service     = "customer"
  }

  depends_on = [azurerm_container_app.rabbitmq]
}

# ============================================================================
# Products Microservice
# ============================================================================

resource "azurerm_container_app" "products" {
  name                         = "ca-products"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  secret {
    name  = "acr-password"
    value = local.acr_admin_pass
  }

  secret {
    name  = "app-secret"
    value = var.app_secret
  }

  secret {
    name  = "mongodb-uri"
    value = "${local.mongo_conn_string}msytt_product?retryWrites=true&w=majority"
  }

  registry {
    server               = local.acr_login_server
    username             = local.acr_admin_user
    password_secret_name = "acr-password"
  }

  ingress {
    external_enabled = false
    target_port      = 8002
    transport        = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = 1
    max_replicas = 5

    container {
      name   = "products"
      image  = "${local.acr_login_server}/ecommerce/products:${var.image_tag}"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name        = "APP_SECRET"
        secret_name = "app-secret"
      }
      env {
        name        = "MONGODB_URI"
        secret_name = "mongodb-uri"
      }
      env {
        name  = "MSG_QUEUE_URL"
        value = "amqp://ca-rabbitmq:5672"
      }
      env {
        name  = "EXCHANGE_NAME"
        value = "ONLINE_STORE"
      }
      env {
        name  = "PORT"
        value = "8002"
      }
      env {
        name  = "NODE_ENV"
        value = "prod"
      }
    }

    http_scale_rule {
      name                = "http-scaling"
      concurrent_requests = "50"
    }
  }

  tags = {
    environment = var.environment_name
    service     = "products"
  }

  depends_on = [azurerm_container_app.rabbitmq]
}

# ============================================================================
# Shopping Microservice
# ============================================================================

resource "azurerm_container_app" "shopping" {
  name                         = "ca-shopping"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  secret {
    name  = "acr-password"
    value = local.acr_admin_pass
  }

  secret {
    name  = "app-secret"
    value = var.app_secret
  }

  secret {
    name  = "mongodb-uri"
    value = "${local.mongo_conn_string}msytt_shopping?retryWrites=true&w=majority"
  }

  registry {
    server               = local.acr_login_server
    username             = local.acr_admin_user
    password_secret_name = "acr-password"
  }

  ingress {
    external_enabled = false
    target_port      = 8003
    transport        = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name   = "shopping"
      image  = "${local.acr_login_server}/ecommerce/shopping:${var.image_tag}"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name        = "APP_SECRET"
        secret_name = "app-secret"
      }
      env {
        name        = "MONGODB_URI"
        secret_name = "mongodb-uri"
      }
      env {
        name  = "MSG_QUEUE_URL"
        value = "amqp://ca-rabbitmq:5672"
      }
      env {
        name  = "EXCHANGE_NAME"
        value = "ONLINE_STORE"
      }
      env {
        name  = "PORT"
        value = "8003"
      }
      env {
        name  = "NODE_ENV"
        value = "prod"
      }
    }

    http_scale_rule {
      name                = "http-scaling"
      concurrent_requests = "50"
    }
  }

  tags = {
    environment = var.environment_name
    service     = "shopping"
  }

  depends_on = [azurerm_container_app.rabbitmq]
}

# ============================================================================
# Nginx API Gateway (External)
# ============================================================================

resource "azurerm_container_app" "proxy" {
  name                         = "ca-proxy"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  secret {
    name  = "acr-password"
    value = local.acr_admin_pass
  }

  registry {
    server               = local.acr_login_server
    username             = local.acr_admin_user
    password_secret_name = "acr-password"
  }

  ingress {
    external_enabled = true
    target_port      = 8000
    transport        = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name   = "proxy"
      image  = "${local.acr_login_server}/ecommerce/proxy:${var.image_tag}"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "PRODUCTS_HOST"
        value = "ca-products"
      }
      env {
        name  = "SHOPPING_HOST"
        value = "ca-shopping"
      }
      env {
        name  = "CUSTOMER_HOST"
        value = "ca-customer"
      }
    }
  }

  tags = {
    environment = var.environment_name
    service     = "proxy"
  }

  depends_on = [
    azurerm_container_app.customer,
    azurerm_container_app.products,
    azurerm_container_app.shopping,
  ]
}

# ============================================================================
# Frontend (External)
# ============================================================================

resource "azurerm_container_app" "frontend" {
  name                         = "ca-frontend"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  secret {
    name  = "acr-password"
    value = local.acr_admin_pass
  }

  registry {
    server               = local.acr_login_server
    username             = local.acr_admin_user
    password_secret_name = "acr-password"
  }

  ingress {
    external_enabled = true
    target_port      = 80
    transport        = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name   = "frontend"
      image  = "${local.acr_login_server}/ecommerce/frontend:${var.image_tag}"
      cpu    = 0.25
      memory = "0.5Gi"
    }

    http_scale_rule {
      name                = "http-scaling"
      concurrent_requests = "100"
    }
  }

  tags = {
    environment = var.environment_name
    service     = "frontend"
  }
}

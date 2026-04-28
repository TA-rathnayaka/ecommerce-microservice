# Ecommerce Microservices

Overview
--------
This repository contains a small ecommerce microservices demo (customer, products, shopping) plus a frontend and local Mongo data directory. The services can be run locally for development or orchestrated with Docker Compose or Kubernetes.

Prerequisites
-------------
- Node.js v16+ and npm
- Docker and docker-compose
- kubectl and a Kubernetes cluster (minikube / kind / cloud) for k8s deployment

Quick start — Docker Compose (development)
-----------------------------------------
1. From the repository root, build and start everything:

```bash
docker-compose up --build
```

2. Stop and remove containers:

```bash
docker-compose down
```

Run production compose
----------------------
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

Run services individually (local development)
--------------------------------------------
Backend services (customer, products, shopping) each include dev scripts using `nodemon`.

Example — customer service:

```bash
cd backend/customer
npm install
npm run dev
```

Example — products service:

```bash
cd backend/products
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

Database seeding
----------------
Each backend contains a `src/seed.js` to populate sample data. Example:

```bash
cd backend/customer
node src/seed.js

cd ../products
node src/seed.js
```

Kubernetes (optional)
---------------------
Apply the manifests in `k8s/` (ensure your kubectl context is set):

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

Building images manually
------------------------
You can build individual service images and push them to a registry or use them locally:

```bash
docker build -t ecommerce-customer:latest backend/customer
docker build -t ecommerce-products:latest backend/products
docker build -t ecommerce-frontend:latest frontend
```

Environment variables
---------------------
Each service expects environment variables (Mongo URI, ports, secrets). Check each service's `src/config` folder or `.env` suggestions and create service-level `.env` files when running locally.

Troubleshooting
---------------
- View logs for compose: `docker-compose logs -f`
- If ports are in use, update compose or service `PORT` env vars
- If Mongo fails to start, remove the local `db/` mount in compose and retry (data files are present in `db/`)

Where to look in the repo
-------------------------
- Backend services: `backend/customer`, `backend/products`, `backend/shopping`
- Frontend: `frontend`
- Docker Compose manifests: `docker-compose.yml`, `docker-compose.prod.yml`
- Kubernetes manifests: `k8s/`

If you want, I can add more detailed per-service env examples, sample curl requests, or a Makefile to simplify common commands—tell me which.

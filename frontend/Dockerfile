# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app/frontend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/frontend/build /usr/share/nginx/html

# Custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /entrypoint.sh    

RUN chmod +x /entrypoint.sh 

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

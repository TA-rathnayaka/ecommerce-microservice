FROM node:18-alpine AS builder

WORKDIR /app/products

COPY package*.json ./

RUN npm ci --only=production

COPY . .

FROM node:18-alpine

WORKDIR /app/products

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/products .

RUN chown -R appuser:appgroup /app/products

USER appuser

EXPOSE 8002

CMD ["npm", "start"]
FROM node:18-alpine AS builder

WORKDIR /app/shopping

COPY package*.json ./

RUN npm ci --only=production

COPY . .

FROM node:18-alpine

WORKDIR /app/shopping

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/shopping .

RUN chown -R appuser:appgroup /app/shopping

USER appuser

EXPOSE 8003

CMD ["npm", "start"]
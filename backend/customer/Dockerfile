FROM node:18-alpine AS builder

WORKDIR /app/customer

COPY package*.json ./

RUN npm ci --only=production

COPY . .

FROM node:18-alpine

WORKDIR /app/customer

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/customer .

RUN chown -R appuser:appgroup /app/customer

USER appuser

EXPOSE 8001

CMD ["npm", "start"]
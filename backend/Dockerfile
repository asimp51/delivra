# Production Dockerfile for Delivra Backend
# WIRING GUIDE:
#
# Build: docker build -t delivra-backend .
# Run:   docker run -p 3000:3000 --env-file .env delivra-backend
#
# For production deployment:
# 1. Build image: docker build -t delivra-backend:v1.0 .
# 2. Push to registry: docker push your-registry/delivra-backend:v1.0
# 3. Deploy to AWS ECS / Google Cloud Run / DigitalOcean App Platform
#
# Environment variables needed:
#   DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME
#   REDIS_URL, JWT_SECRET, STRIPE_SECRET_KEY, FCM_SERVER_KEY

FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]

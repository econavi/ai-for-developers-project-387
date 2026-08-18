FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
COPY --from=frontend-builder /app/dist ./public
CMD ["node_modules/.bin/tsx", "src/index.ts"]
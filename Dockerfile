# syntax=docker/dockerfile:1

# Stage 1: Build the Vite + React frontend
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json bun.lock* package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# Stage 2: Run full-stack Node/Express server (serves dist/ + /api/*)
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist
COPY server.ts ./server.ts

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["node", "server.ts"]

FROM registry.access.redhat.com/ubi9/nodejs-20:latest AS builder

# Build args for version info
ARG GIT_COMMIT=unknown
ARG APP_VERSION=0.0.0

USER root

WORKDIR /app

# Copy workspace package files from root
COPY package.json package-lock.json ./
COPY web/package.json ./web/

# Install dependencies for web workspace only
RUN npm ci --workspace=web --include-workspace-root

# Copy web application source
COPY web/ ./web/

# Set version environment variables for build
ENV GIT_COMMIT=${GIT_COMMIT}
ENV APP_VERSION=${APP_VERSION}

# Build the Nuxt application
WORKDIR /app/web
RUN npm run build

# Production image
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:latest

USER 1001

WORKDIR /app

# Copy built application from builder
COPY --from=builder --chown=1001:0 /app/web/.output ./

# Copy database migrations (if any exist)
COPY --from=builder --chown=1001:0 /app/web/app/server/database/migrations ./app/server/database/migrations 2>/dev/null || true

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Start the server
CMD ["node", "server/index.mjs"]

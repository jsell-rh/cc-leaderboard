# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY web/package*.json ./
COPY package*.json ./

# Install dependencies
RUN npm ci --workspace=web

# Copy source code
COPY web/ ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create data directory for SQLite
RUN mkdir -p /app/data && chown -R node:node /app/data

# Copy built application
COPY --from=builder --chown=node:node /app/.output /app/.output
COPY --from=builder --chown=node:node /app/package*.json /app/

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/leaderboard.db
ENV HOST=0.0.0.0
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", ".output/server/index.mjs"]

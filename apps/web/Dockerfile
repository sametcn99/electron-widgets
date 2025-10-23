FROM oven/bun:1 AS builder

WORKDIR /app

# Install dependencies with Bun
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build the static site
COPY . .
RUN bun run docs:build

# Production stage with minimal footprint
FROM oven/bun:1-alpine

WORKDIR /app

# Copy built assets from builder (Vitepress builds to .vitepress/dist)
COPY --from=builder /app/.vitepress/dist ./.vitepress/dist
COPY --from=builder /app/package.json ./

# Install only production dependencies
RUN bun install --frozen-lockfile

# Use non-root user for security
USER bun

# Set environment to production
ENV NODE_ENV=production

# Use 0.0.0.0 to bind to all interfaces (required for Docker)
EXPOSE 3000

CMD ["bun", "run", "docs:preview", "--host", "0.0.0.0", "--port", "3000"]
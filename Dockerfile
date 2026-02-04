# Use the official Bun image as the base
# See all versions at https://hub.docker.com/r/oven/bun/tags
ARG BUN_VERSION=1.3.8
FROM oven/bun:${BUN_VERSION}-alpine AS base
WORKDIR /app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install

# Create temp directories for dependencies
RUN mkdir -p /temp/dev /temp/prod

# Install all dependencies (dev + prod) in dev directory
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install only production dependencies in prod directory
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Build the application
FROM base AS build

# Copy dev dependencies (needed for build)
COPY --from=install /temp/dev/node_modules node_modules

# Copy application code
COPY . .

# Build the application
RUN bun --bun run build

# Final stage - production runtime
FROM base AS release

# Copy production dependencies
COPY --from=install /temp/prod/node_modules node_modules

# Copy built application
COPY --from=build /app/build build
COPY --from=build /app/package.json .

# Run the app as non-root user
USER bun

# Expose the port the app runs on
EXPOSE 3000/tcp

# Start the application
ENTRYPOINT ["bun", "./build/index.js"]

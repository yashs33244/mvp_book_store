FROM oven/bun:1 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1

# Accept build arguments
ARG NEXT_PUBLIC_API_URL=https://apibooks.yashprojects.online
ARG NODE_ENV=production

# Set environment variables from build args
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Output environment variables for debugging
RUN echo "Building with NODE_ENV: ${NODE_ENV}"
RUN echo "Building with NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}"

# Build the application
RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Set runtime environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Accept build arguments again for runtime
ARG NEXT_PUBLIC_API_URL=https://apibooks.yashprojects.online
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Print environment variables for debugging
CMD ["sh", "-c", "echo Running with NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL && bun server.js"] 
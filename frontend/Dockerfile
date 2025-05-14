# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Set build-time environment variables to avoid API calls during build
ENV NODE_ENV=production
ENV NEXT_PHASE=phase-production-build
ENV IS_BUILD=true

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Reset environment variables for runtime
ENV NODE_ENV=production
ENV IS_BUILD=false

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"] 
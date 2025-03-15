# Stage 1: Build the Next.js application
FROM node:22.10.0-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of your application code
COPY . .

# Install dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:22.10.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Create user and group for application
#
# Create a group with GID 1001
RUN addgroup -g 1001 nodejs
# Create a user with UID 1001 and assign them to the 'binarygroup' group
RUN adduser -D -u 1001 -G nodejs nextjs

# Set the correct permission for .next folder
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the nextjs user
USER nextjs

# Required environment variables
ENV NODE_ENV production

# set app port
ENV PORT 3000 

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# expose port
EXPOSE 3000

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
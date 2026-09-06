# Stage 1: Build the React application
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

COPY kito-landing/package*.json ./
RUN npm install

COPY kito-landing/ .
RUN npm run build

# Stage 2: Build the Node.js Express server
FROM node:20-alpine
WORKDIR /app

# Copy server package.json and install dependencies
COPY kito-landing/server/package*.json ./
RUN npm install --production

# Copy server code
COPY kito-landing/server/ .

# Copy built frontend from Stage 1 into /app/dist
COPY --from=frontend-build /app/frontend/dist /app/dist

# Expose the backend port (default 5000)
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]

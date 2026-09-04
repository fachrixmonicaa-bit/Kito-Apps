# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (for better caching)
COPY kito-landing/package*.json ./kito-landing/
WORKDIR /app/kito-landing
RUN npm install

# Copy the rest of the application
COPY kito-landing/ .

# Build the app
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration to handle React Router
COPY kito-landing/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output
COPY --from=build /app/kito-landing/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

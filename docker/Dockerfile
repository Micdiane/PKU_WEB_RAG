# Frontend Dockerfile
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend Dockerfile
FROM python:3.11-slim as backend

WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

# Final stage - combine frontend and backend
FROM nginx:alpine

# Copy frontend build
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html

# Copy backend app
COPY --from=backend /app /app

# Install Python in nginx container
RUN apk add --no-cache python3 py3-pip

# Install backend dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -r /app/requirements.txt

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80 8000

CMD ["/start.sh"]
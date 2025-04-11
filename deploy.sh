#!/bin/bash

# Stop script on first error
set -e

# Colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===== Book Exchange Application Deployment =====${NC}"

# Function to display progress
progress() {
  echo -e "${GREEN}[+] $1${NC}"
}

# Function to display errors
error() {
  echo -e "${RED}[!] $1${NC}"
  exit 1
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  error "Docker is not installed. Please install Docker first."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  error "Docker Compose is not installed. Please install Docker Compose first."
fi

progress "Stopping any running containers"
docker-compose down || true

progress "Pulling latest changes from repository"
git pull || error "Failed to pull the latest changes from the repository"

progress "Building Docker containers"
docker-compose build || error "Failed to build Docker containers"

progress "Configuring NGINX"
# Backup existing NGINX config if it exists
if [ -f /etc/nginx/nginx.conf ]; then
  progress "Backing up existing NGINX configuration"
  sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
fi

progress "Copying new NGINX configuration"
sudo cp nginx.conf /etc/nginx/nginx.conf

progress "Testing NGINX configuration"
sudo nginx -t || error "NGINX configuration test failed"

progress "Restarting NGINX"
sudo systemctl restart nginx || error "Failed to restart NGINX"

progress "Starting Docker containers"
docker-compose up -d || error "Failed to start Docker containers"

progress "Waiting for containers to be ready"
sleep 10

progress "Checking containers status"
docker ps

progress "Deployment completed successfully!"
echo -e "${BLUE}Frontend: https://books.yashprojects.online${NC}"
echo -e "${BLUE}Backend API: https://apibooks.yashprojects.online${NC}"
echo -e "${BLUE}===== Deployment Complete =====${NC}" 
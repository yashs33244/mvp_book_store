#!/bin/bash

# Get the backend container ID
BACKEND_CONTAINER_ID=$(docker ps -q -f name=assignment-backend)

if [ -z "$BACKEND_CONTAINER_ID" ]; then
  echo "Backend container not found. Make sure it's running."
  exit 1
fi

echo "Setting up database..."

# Run prisma db push
echo "Running prisma db push..."
docker exec -it $BACKEND_CONTAINER_ID npx prisma db push

if [ $? -ne 0 ]; then
  echo "Failed to run prisma db push."
  exit 1
fi

# Run prisma migrate dev
echo "Running prisma migrate dev..."
docker exec -it $BACKEND_CONTAINER_ID npx prisma migrate dev

if [ $? -ne 0 ]; then
  echo "Failed to run prisma migrate dev."
  exit 1
fi

echo "Database setup completed successfully!" 
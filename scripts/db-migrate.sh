#!/bin/bash

# Get the backend container ID
BACKEND_CONTAINER_ID=$(docker ps -q -f name=assignment-backend)

if [ -z "$BACKEND_CONTAINER_ID" ]; then
  echo "Backend container not found. Make sure it's running."
  exit 1
fi

echo "Running prisma migrate dev in backend container..."
docker exec -it $BACKEND_CONTAINER_ID npx prisma migrate dev

if [ $? -eq 0 ]; then
  echo "Database migrations applied successfully!"
else
  echo "Failed to apply database migrations."
  exit 1
fi 
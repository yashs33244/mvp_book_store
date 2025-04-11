#!/bin/bash

# Get the backend container ID
BACKEND_CONTAINER_ID=$(docker ps -q -f name=assignment-backend)

if [ -z "$BACKEND_CONTAINER_ID" ]; then
  echo "Backend container not found. Make sure it's running."
  exit 1
fi

echo "Running prisma db push in backend container..."
docker exec -it $BACKEND_CONTAINER_ID npx prisma db push

if [ $? -eq 0 ]; then
  echo "Database schema updated successfully!"
else
  echo "Failed to update database schema."
  exit 1
fi 
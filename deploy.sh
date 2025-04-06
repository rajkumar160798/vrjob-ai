#!/bin/bash

# Stop any running containers
docker-compose down

# Build and start the containers
docker-compose up --build -d

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run database migrations
docker-compose exec backend alembic upgrade head

# Create necessary directories
mkdir -p backend/data
mkdir -p frontend/build

# Set permissions
chmod -R 777 backend/data
chmod -R 777 frontend/build

echo "Deployment complete! The application is running at:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs" 
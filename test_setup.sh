#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo ".env file not found. Please create one with your API keys."
    exit 1
fi

# Check if required environment variables are set
if ! grep -q "OPENAI_API_KEY" .env || ! grep -q "GMAIL_CLIENT_ID" .env || ! grep -q "GMAIL_CLIENT_SECRET" .env; then
    echo "Please set all required environment variables in .env file."
    exit 1
fi

echo "Starting local test environment..."

# Start the services
docker-compose up --build -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 15

# Test backend API
echo "Testing backend API..."
curl -s http://localhost:8000/ | grep -q "Welcome to VRJob AI API"
if [ $? -eq 0 ]; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API is not responding"
fi

# Test frontend
echo "Testing frontend..."
curl -s http://localhost:3000 | grep -q "VRJob AI"
if [ $? -eq 0 ]; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
fi

# Test database connection
echo "Testing database connection..."
docker-compose exec db psql -U vrjob -d vrjob -c "SELECT 1" &> /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database is accessible"
else
    echo "❌ Database connection failed"
fi

echo "Test complete! You can access:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs" 
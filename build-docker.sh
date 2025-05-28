#!/bin/bash

# Build script for Personal Calendar Docker container

echo "🚀 Building Personal Calendar Docker container..."

# Build the Docker image
docker build -t personal-calendar .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    echo "📋 Available commands:"
    echo "  Run with Docker:         docker run -p 3000:3000 -v calendar-data:/app/data personal-calendar"
    echo "  Run with Docker Compose: docker-compose up -d"
    echo "  Stop Docker Compose:     docker-compose down"
    echo ""
    echo "🌐 The application will be available at: http://localhost:3000"
else
    echo "❌ Docker build failed!"
    exit 1
fi 
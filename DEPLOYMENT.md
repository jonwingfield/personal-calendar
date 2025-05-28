# Deployment Guide

This guide covers different deployment options for the Personal Calendar application.

## Docker Deployment

### Quick Start

The fastest way to get the application running with Docker:

```bash
# Clone the repository
git clone <repository-url>
cd personal-calendar

# Build and run with Docker Compose
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Deployment Options

#### 1. Docker Compose (Recommended for local/development)

**Pros:**
- Easy to manage
- Automatic volume management
- Simple one-command deployment

**Commands:**
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose up -d --build
```

#### 2. Docker Run (Good for server deployment)

**Pros:**
- More control over container configuration
- Better for production servers

**Commands:**
```bash
# Build the image
docker build -t personal-calendar .

# Run with named volume
docker run -d \
  --name personal-calendar \
  -p 3000:3000 \
  -v calendar-data:/app/data \
  --restart unless-stopped \
  personal-calendar

# Run with host directory mount
docker run -d \
  --name personal-calendar \
  -p 3000:3000 \
  -v /host/path/to/data:/app/data \
  --restart unless-stopped \
  personal-calendar
```

#### 3. Docker with External Network

For deployment behind a reverse proxy:

```bash
# Create a custom network
docker network create calendar-network

# Run container on custom network
docker run -d \
  --name personal-calendar \
  --network calendar-network \
  -v calendar-data:/app/data \
  --restart unless-stopped \
  personal-calendar
```

### Production Considerations

#### Environment Variables

You can customize the deployment with environment variables:

```bash
docker run -d \
  --name personal-calendar \
  -p 3000:3000 \
  -v calendar-data:/app/data \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  --restart unless-stopped \
  personal-calendar
```

#### Security

1. **Don't expose unnecessary ports**: Only expose port 3000 if needed directly
2. **Use a reverse proxy**: Consider using nginx or Traefik in front
3. **Regular updates**: Rebuild the image regularly for security updates

#### Data Backup

**Create backup:**
```bash
docker run --rm \
  -v calendar-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/calendar-backup-$(date +%Y%m%d).tar.gz -C /data .
```

**Restore backup:**
```bash
docker run --rm \
  -v calendar-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/calendar-backup-YYYYMMDD.tar.gz -C /data
```

#### Health Checks

Add health checks to your deployment:

```bash
docker run -d \
  --name personal-calendar \
  -p 3000:3000 \
  -v calendar-data:/app/data \
  --health-cmd="curl -f http://localhost:3000 || exit 1" \
  --health-interval=30s \
  --health-retries=3 \
  --health-start-period=40s \
  --restart unless-stopped \
  personal-calendar
```

### Reverse Proxy Examples

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Docker Compose with Nginx

```yaml
version: '3.8'

services:
  personal-calendar:
    build: .
    volumes:
      - calendar-data:/app/data
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - personal-calendar
    networks:
      - app-network
    restart: unless-stopped

volumes:
  calendar-data:

networks:
  app-network:
    driver: bridge
```

### Troubleshooting

#### Common Issues

1. **Port already in use**: Change the host port mapping
   ```bash
   docker run -p 8080:3000 ...  # Use port 8080 instead
   ```

2. **Permission issues**: Ensure proper volume permissions
   ```bash
   docker run --user $(id -u):$(id -g) ...
   ```

3. **Build failures**: Check for sufficient disk space and memory

#### Useful Commands

```bash
# Check container logs
docker logs personal-calendar

# Access container shell
docker exec -it personal-calendar sh

# Check container resource usage
docker stats personal-calendar

# Remove container and start fresh
docker rm -f personal-calendar
docker rmi personal-calendar
```

### Monitoring

Consider adding monitoring for production deployments:

```bash
# Run with resource limits
docker run -d \
  --name personal-calendar \
  -p 3000:3000 \
  -v calendar-data:/app/data \
  --memory="512m" \
  --cpus="0.5" \
  --restart unless-stopped \
  personal-calendar
``` 
# Book Exchange Application

A full-stack application for exchanging books between users.

## Docker Setup

This project is containerized using Docker and Docker Compose. The setup includes:

- Frontend (Next.js)
- Backend (Node.js/Express)
- PostgreSQL database
- Redis for caching

### Prerequisites

- Docker
- Docker Compose

### Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Development

For development, you can run the services individually:

```bash
# Frontend
cd fe
bun install
bun run dev

# Backend
cd be
npm install
npm run dev
```

### Environment Variables

The application uses environment variables for configuration. In the Docker setup, these are defined in the `docker-compose.yml` file. For local development, you'll need to create `.env` files in both the frontend and backend directories.

#### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookexchange
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Database Migrations

To run database migrations:

```bash
# Using Docker
docker-compose exec backend npx prisma migrate deploy

# Local development
cd be
npx prisma migrate dev
```

### Production

```bash
docker-compose up --buil -d
```


### Stopping the Application

To stop the Docker containers:

```bash
docker-compose down
```

To stop and remove all data (including database volumes):

```bash
docker-compose down -v
```

## Project Structure

- `fe/` - Frontend Next.js application
- `be/` - Backend Node.js/Express application
- `docker-compose.yml` - Docker Compose configuration

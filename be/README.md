# Book Exchange Backend

This is the backend service for the Book Exchange application. It provides APIs for user authentication, book management, and user profiles.

## Features

- User authentication (register/login)
- User profiles (Owner/Seeker roles)
- Book listing management
- Search and filter books
- JWT-based authentication
- PostgreSQL database with Prisma ORM

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/demo_website?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=3001
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

## Running the Application

### Using Docker

1. Build and start the containers:
```bash
docker-compose up --build
```

2. The API will be available at `http://localhost:3001`

### Running Locally

1. Start the development server:
```bash
npm run dev
```

2. The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Books

- `GET /api/books` - Get all books (with optional filters)
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book listing (Owner only)
- `PUT /api/books/:id` - Update a book listing (Owner only)
- `DELETE /api/books/:id` - Delete a book listing (Owner only)

### User Profile

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/books` - Get user's books (Owner only)

## Testing

Run the tests using:
```bash
npm test
```

## Development

The project uses:
- TypeScript for type safety
- Express.js for the web server
- Prisma for database operations
- Jest for testing
- Docker for containerization

## AI Tools Used

This project was developed with assistance from:
- Claude 3.5 Sonnet for code generation and review
- GitHub Copilot for code suggestions
- Cursor IDE for development 
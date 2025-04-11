import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { bookRouter } from './routes/book.routes';
import { authRouter } from './routes/auth.routes';
import { connectToRedis } from './config/redis.config';
import { healthRoutes } from './routes/health.routes';
import { errorHandler } from './middleware/error.middleware';

import morgan from 'morgan';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Security middleware


app.use(cors({
  origin: ['http://books.yashprojects.online', 'https://books.yashprojects.online'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Logging middleware
app.use(morgan('dev'));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

// Error handling middleware
app.use(errorHandler);

app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok' });
});

// Only start the server if this file is run directly
if (require.main === module) {
  // Initialize Redis before starting the server
  connectToRedis()
    .then(() => {
      console.log('Redis connected successfully');
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch(err => {
      console.error('Failed to initialize Redis:', err);
      // Start the server anyway, but with a warning
      app.listen(port, () => {
        console.log(`Server is running on port ${port} (Redis connection failed)`);
      });
    });
}

export { app };

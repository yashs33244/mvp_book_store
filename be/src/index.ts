import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { bookRouter } from './routes/book.routes';
import { authRouter } from './routes/auth.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export { app };

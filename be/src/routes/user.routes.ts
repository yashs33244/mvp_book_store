import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  mobile: z.string().min(10).optional(),
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        mobile: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, mobile } = updateUserSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        mobile,
      },
      select: {
        id: true,
        email: true,
        name: true,
        mobile: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's books (for owners)
router.get('/books', authenticateToken, async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { ownerId: req.user.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
          },
        },
      },
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as userRouter }; 
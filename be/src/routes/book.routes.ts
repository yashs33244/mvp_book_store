import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken, isOwner } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().optional(),
  location: z.string().min(1),
});

// Create a new book listing
router.post('/', authenticateToken, isOwner, async (req, res) => {
  try {
    const { title, author, genre, location } = bookSchema.parse(req.body);

    const book = await prisma.book.create({
      data: {
        title,
        author,
        genre,
        location,
        ownerId: req.user.id,
      },
    });

    res.status(201).json(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const { title, location, genre } = req.query;
    
    const where: any = {};
    if (title) where.title = { contains: title as string, mode: 'insensitive' };
    if (location) where.location = { contains: location as string, mode: 'insensitive' };
    if (genre) where.genre = { contains: genre as string, mode: 'insensitive' };

    const books = await prisma.book.findMany({
      where,
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

// Get a specific book
router.get('/:id', async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id },
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

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a book
router.put('/:id', authenticateToken, isOwner, async (req, res) => {
  try {
    const { title, author, genre, location, isAvailable } = req.body;

    const book = await prisma.book.findUnique({
      where: { id: req.params.id },
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const updatedBook = await prisma.book.update({
      where: { id: req.params.id },
      data: {
        title,
        author,
        genre,
        location,
        isAvailable,
      },
    });

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a book
router.delete('/:id', authenticateToken, isOwner, async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id },
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await prisma.book.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as bookRouter }; 
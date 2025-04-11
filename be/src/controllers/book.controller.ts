// src/controllers/book.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { S3Service } from '../services/s3.service';

const prisma = new PrismaClient();

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().optional(),
  location: z.string().min(1),
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
});

export class BookController {
  /**
   * Get all books with filtering
   */
  static async listBooks(req: Request, res: Response) {
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
      console.error('Error listing books:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  /**
   * Get single book by ID
   */
  static async getBook(req: Request, res: Response) {
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
      console.error('Error getting book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  /**
   * Create a new book
   */
  static async createBook(req: Request, res: Response) {
    try {
      const { title, author, genre, location, imageUrl, imageKey } = bookSchema.parse(req.body);

      const book = await prisma.book.create({
        data: {
          title,
          author,
          genre,
          location,
          imageUrl,
          imageKey,
          ownerId: req.user.id,
        },
      });

      res.status(201).json(book);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error('Error creating book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  /**
   * Update a book
   */
  static async updateBook(req: Request, res: Response) {
    try {
      const { title, author, genre, location, isAvailable, imageUrl, imageKey } = req.body;

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
          imageUrl,
          imageKey,
        },
      });

      res.json(updatedBook);
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  /**
   * Delete a book
   */
  static async deleteBook(req: Request, res: Response) {
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
      console.error('Error deleting book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  /**
   * Get current user's books
   */
  static async getUserBooks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // From auth middleware
      
      const books = await prisma.book.findMany({
        where: { ownerId: userId },
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
      
      res.status(200).json({ books });
    } catch (error) {
      console.error('Error getting user books:', error);
      res.status(500).json({ message: 'Failed to retrieve user books' });
    }
  }
}
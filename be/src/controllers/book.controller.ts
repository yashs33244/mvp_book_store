// src/controllers/book.controller.ts

import { Request, Response } from 'express';
import { PrismaClient, Book } from '@prisma/client';
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
  static async listBooks(req: Request, res?: Response): Promise<any> {
    try {
      // Get all query parameters
      const { title, author, query, location, genre, isAvailable, page, limit } = req.query;
      
      const where: any = {};
      
      // Handle general search query parameter
      if (query) {
        where.OR = [
          { title: { contains: query as string, mode: 'insensitive' } },
          { author: { contains: query as string, mode: 'insensitive' } },
          { genre: { contains: query as string, mode: 'insensitive' } },
        ];
      } else {
        // If no general query, apply specific filters
        if (title) where.title = { contains: title as string, mode: 'insensitive' };
        if (author) where.author = { contains: author as string, mode: 'insensitive' };
      }
      
      // Apply these filters regardless of whether query is present
      if (location) where.location = { contains: location as string, mode: 'insensitive' };
      if (genre && genre !== 'all') where.genre = { contains: genre as string, mode: 'insensitive' };
      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable === 'true';
      }

      // Parse pagination parameters
      const currentPage = page ? parseInt(page as string, 10) : 1;
      const pageSize = limit ? parseInt(limit as string, 10) : 10;
      const skip = (currentPage - 1) * pageSize;

      // Get total count
      const total = await prisma.book.count({ where });

      // Get books
      const books = await prisma.book.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
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

      // Calculate pagination info
      const totalPages = Math.ceil(total / pageSize);
      const hasMore = currentPage < totalPages;

      // Create response object
      const response = {
        books,
        pagination: {
          totalItems: total,
          currentPage,
          pageSize,
          totalPages,
          hasMore
        }
      };

      if (res) {
        res.json(response);
      }
      return response;
    } catch (error) {
      console.error('Error listing books:', error);
      if (res) {
        res.status(500).json({ message: 'Internal server error' });
      }
      throw error;
    }
  }
  
  /**
   * Get single book by ID
   */
  static async getBook(req: Request, res?: Response): Promise<Book | null> {
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
        if (res) {
          res.status(404).json({ message: 'Book not found' });
        }
        return null;
      }

      if (res) {
        res.json(book);
      }
      return book;
    } catch (error) {
      console.error('Error getting book:', error);
      if (res) {
        res.status(500).json({ message: 'Internal server error' });
      }
      throw error;
    }
  }
  
  /**
   * Create a new book
   */
  static async createBook(req: Request, res?: Response): Promise<Book> {
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

      if (res) {
        res.status(201).json(book);
      }
      return book;
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (res) {
          res.status(400).json({ message: error.errors });
        }
        throw error;
      }
      console.error('Error creating book:', error);
      if (res) {
        res.status(500).json({ message: 'Internal server error' });
      }
      throw error;
    }
  }
  
  /**
   * Update a book
   */
  static async updateBook(req: Request, res?: Response): Promise<Book> {
    try {
      const { title, author, genre, location, isAvailable, imageUrl, imageKey } = req.body;

      const book = await prisma.book.findUnique({
        where: { id: req.params.id },
      });

      if (!book) {
        if (res) {
          res.status(404).json({ message: 'Book not found' });
        }
        throw new Error('Book not found');
      }

      if (book.ownerId !== req.user.id) {
        if (res) {
          res.status(403).json({ message: 'Not authorized to update this book' });
        }
        throw new Error('Not authorized to update this book');
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

      if (res) {
        res.json(updatedBook);
      }
      return updatedBook;
    } catch (error) {
      console.error('Error updating book:', error);
      if (res) {
        res.status(500).json({ message: 'Internal server error' });
      }
      throw error;
    }
  }
  
  /**
   * Delete a book
   */
  static async deleteBook(req: Request, res?: Response): Promise<Book> {
    try {
      const book = await prisma.book.findUnique({
        where: { id: req.params.id },
      });

      if (!book) {
        if (res) {
          res.status(404).json({ message: 'Book not found' });
        }
        throw new Error('Book not found');
      }

      if (book.ownerId !== req.user.id) {
        if (res) {
          res.status(403).json({ message: 'Not authorized to delete this book' });
        }
        throw new Error('Not authorized to delete this book');
      }

      const deletedBook = await prisma.book.delete({
        where: { id: req.params.id },
      });

      if (res) {
        res.status(204).send();
      }
      return deletedBook;
    } catch (error) {
      console.error('Error deleting book:', error);
      if (res) {
        res.status(500).json({ message: 'Internal server error' });
      }
      throw error;
    }
  }
  
  /**
   * Get current user's books
   */
  static async getUserBooks(req: Request, res?: Response): Promise<any> {
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
      
      // Create response object with consistent format
      const response = {
        books,
        pagination: {
          totalItems: books.length,
          currentPage: 1,
          pageSize: books.length,
          totalPages: 1,
          hasMore: false
        }
      };
      
      if (res) {
        res.status(200).json(response);
      }
      return response;
    } catch (error) {
      console.error('Error getting user books:', error);
      if (res) {
        res.status(500).json({ message: 'Failed to retrieve user books' });
      }
      throw error;
    }
  }
}
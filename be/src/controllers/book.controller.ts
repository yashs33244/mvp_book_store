// src/controllers/book.controller.ts

import { Request, Response } from 'express';
import { BookService } from '../services/book.service';

export class BookController {
  /**
   * Get all books with filtering
   */
  static async listBooks(req: Request, res: Response) {
    try {
      const books = await BookService.getBooks(req.query);
      res.status(200).json(books);
    } catch (error) {
      console.error('Error listing books:', error);
      res.status(500).json({ message: 'Failed to retrieve books' });
    }
  }
  
  /**
   * Get single book by ID
   */
  static async getBook(req: Request, res: Response) {
    try {
      const id = req.params.id;
      
      if (!id) {
        return res.status(400).json({ message: 'Invalid book ID' });
      }
      
      const book = await BookService.getBookById(id);
      
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      
      res.status(200).json(book);
    } catch (error) {
      console.error('Error getting book:', error);
      res.status(500).json({ message: 'Failed to retrieve book' });
    }
  }
  
  /**
   * Create a new book
   */
  static async createBook(req: Request, res: Response) {
    try {
      const { title, author, genre, location, coverImageUrl, contactInfo } = req.body;
      const userId = (req as any).user.id; // From auth middleware
      
      // Validate required fields
      if (!title || !author || !location || !contactInfo) {
        return res.status(400).json({ 
          message: 'Required fields missing: title, author, location, and contactInfo are required' 
        });
      }
      
      const book = await BookService.createBook({
        title,
        author,
        genre,
        location,
        isAvailable: true,
        owner: { connect: { id: userId } }
      });
      
      res.status(201).json(book);
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ message: 'Failed to create book' });
    }
  }
  
  /**
   * Update a book
   */
  static async updateBook(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const userId = (req as any).user.id; // From auth middleware
      
      if (!id) {
        return res.status(400).json({ message: 'Invalid book ID' });
      }
      
      // Check if book exists and belongs to user
      const existingBook = await BookService.getBookById(id);
      
      if (!existingBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      
      if (existingBook.ownerId !== userId) {
        return res.status(403).json({ message: 'You do not have permission to update this book' });
      }
      
      const { title, author, genre, location, coverImageUrl, contactInfo, isAvailable } = req.body;
      
      const updatedBook = await BookService.updateBook(id, {
        ...(title && { title }),
        ...(author && { author }),
        ...(genre !== undefined && { genre }),
        ...(location && { location }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        ...(contactInfo && { contactInfo }),
        ...(isAvailable !== undefined && { isAvailable })
      });
      
      res.status(200).json(updatedBook);
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ message: 'Failed to update book' });
    }
  }
  
  /**
   * Delete a book
   */
  static async deleteBook(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const userId = (req as any).user.id; // From auth middleware
      
      if (!id) {
        return res.status(400).json({ message: 'Invalid book ID' });
      }
      
      // Check if book exists and belongs to user
      const existingBook = await BookService.getBookById(id);
      
      if (!existingBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      
      if (existingBook.ownerId !== userId) {
        return res.status(403).json({ message: 'You do not have permission to delete this book' });
      }
      
      await BookService.deleteBook(id);
      
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ message: 'Failed to delete book' });
    }
  }
  
  /**
   * Get current user's books
   */
  static async getUserBooks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // From auth middleware
      
      const books = await BookService.getBooksByOwner(userId);
      
      res.status(200).json({ books });
    } catch (error) {
      console.error('Error getting user books:', error);
      res.status(500).json({ message: 'Failed to retrieve user books' });
    }
  }
}
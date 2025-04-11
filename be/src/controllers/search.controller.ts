// src/controllers/search.controller.ts

import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';

export class SearchController {
  /**
   * Search books with full-text search and filters
   */
  static async searchBooks(req: Request, res: Response) {
    try {
      const searchResults = await SearchService.searchBooks(req.query);
      res.status(200).json(searchResults);
    } catch (error) {
      console.error('Error searching books:', error);
      res.status(500).json({ message: 'Failed to search books' });
    }
  }
}
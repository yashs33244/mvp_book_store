    // src/services/book.service.ts
import { PrismaClient, Book, Prisma } from '@prisma/client';
import { SearchParams, normalizeSearchParams, buildPaginationInfo } from '../utils/search.utils';
import { CacheService } from './cache.service';
import { BookController } from '../controllers/book.controller';

const prisma = new PrismaClient();

export class BookService {
  /**
   * Get books with pagination and filtering
   */
  static async getBooks(params: SearchParams): Promise<{ books: Book[]; total: number }> {
    const normalizedParams = normalizeSearchParams(params);
    const filterConditions = this.buildFilterConditions(normalizedParams);
    
    // Get total count first
    const total = await prisma.book.count({ where: filterConditions });
    const paginationInfo = buildPaginationInfo(total, normalizedParams);
    const skip = (paginationInfo.currentPage - 1) * paginationInfo.pageSize;
    const take = paginationInfo.pageSize;

    // Check cache first
    const cacheKey = CacheService.createSearchKey({
      type: 'books',
      ...normalizedParams,
      skip,
      take
    });
    const cachedResult = await CacheService.get<any>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Get books from database using controller
    const books = await BookController.listBooks({ query: normalizedParams } as any, null as any);
    
    const result = { books, total };
    
    // Cache the result
    await CacheService.set(cacheKey, result, 300);
    
    return result;
  }
  
  /**
   * Get book by ID
   */
  static async getBookById(id: string): Promise<Book | null> {
    console.log('BookService.getBookById called with id:', id);
    return BookController.getBook({ params: { id } } as any, null as any);
  }
  
  /**
   * Create new book
   */
  static async createBook(data: Prisma.BookCreateInput): Promise<Book> {
    console.log('BookService.createBook called with data:', JSON.stringify(data));
    const book = await BookController.createBook({ body: data } as any, null as any);
    
    // Clear books cache
    await CacheService.clearPattern('search:type:books*');
    console.log('Cache cleared for books');
    
    return book;
  }
  
  /**
   * Update book
   */
  static async updateBook(id: string, data: Prisma.BookUpdateInput): Promise<Book> {
    console.log('BookService.updateBook called with id:', id, 'data:', JSON.stringify(data));
    const book = await BookController.updateBook({ 
      params: { id }, 
      body: data 
    } as any, null as any);
    
    // Clear books cache
    await CacheService.clearPattern('search:type:books*');
    console.log('Cache cleared for books');
    
    return book;
  }
  
  /**
   * Delete book
   */
  static async deleteBook(id: string): Promise<Book> {
    console.log('BookService.deleteBook called with id:', id);
    const book = await BookController.deleteBook({ params: { id } } as any, null as any);
    
    // Clear books cache
    await CacheService.clearPattern('search:type:books*');
    console.log('Cache cleared for books');
    
    return book;
  }
  
  /**
   * Get books by owner
   */
  static async getBooksByOwner(ownerId: string): Promise<Book[]> {
    console.log('BookService.getBooksByOwner called with ownerId:', ownerId);
    const books = await BookController.getUserBooks({ user: { id: ownerId } } as any, null as any);
    
    console.log('Found', books.length, 'books for owner:', ownerId);
    return books;
  }
  
  /**
   * Build filter conditions for book queries
   */
  private static buildFilterConditions(params: SearchParams): Prisma.BookWhereInput {
    const conditions: Prisma.BookWhereInput = {};
    const searchCriteria: Prisma.BookWhereInput[] = [];
    
    // Basic filters
    if (params.genre) {
      searchCriteria.push({ genre: { contains: params.genre, mode: 'insensitive' } });
    }
    
    if (params.location) {
      searchCriteria.push({ location: { contains: params.location, mode: 'insensitive' } });
    }
    
    if (params.isAvailable !== undefined) {
      searchCriteria.push({ isAvailable: params.isAvailable });
    }
    
    // Add text search if query exists
    if (params.query) {
      const searchString = params.query.toLowerCase();
      searchCriteria.push({
        OR: [
          { title: { contains: searchString, mode: 'insensitive' } },
          { author: { contains: searchString, mode: 'insensitive' } },
          { genre: { contains: searchString, mode: 'insensitive' } },
          { location: { contains: searchString, mode: 'insensitive' } }
        ]
      });
    }
    
    // Combine all search criteria with AND
    if (searchCriteria.length > 0) {
      conditions.AND = searchCriteria;
    }
    
    return conditions;
  }
}
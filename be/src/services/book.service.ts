    // src/services/book.service.ts
import { PrismaClient, Book, Prisma } from '@prisma/client';
import { SearchParams, normalizeSearchParams, buildPaginationInfo } from '../utils/search.utils';
import { CacheService } from './cache.service';

const prisma = new PrismaClient();

export class BookService {
  /**
   * Get all books with filtering and pagination
   */
  static async getBooks(params: SearchParams) {
    const normalizedParams = normalizeSearchParams(params);
    const { page = 1, limit = 20 } = normalizedParams;
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const where = this.buildFilterConditions(normalizedParams);
    
    // Check cache first
    const cacheKey = CacheService.createSearchKey({
      type: 'books',
      ...normalizedParams
    });
    
    const cachedResult = await CacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Get books with pagination
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              mobile: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }),
      prisma.book.count({ where })
    ]);
    
    const result = {
      books,
      pagination: buildPaginationInfo(total, normalizedParams)
    };
    
    // Cache results
    await CacheService.set(cacheKey, result);
    
    return result;
  }
  
  /**
   * Get book by ID
   */
  static async getBookById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true
          }
        }
      }
    });
  }
  
  /**
   * Create new book
   */
  static async createBook(data: Prisma.BookCreateInput) {
    const book = await prisma.book.create({
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Clear books cache
    await CacheService.clearPattern('search:type:books*');
    
    return book;
  }
  
  /**
   * Update book
   */
  static async updateBook(id: string, data: Prisma.BookUpdateInput) {
    const book = await prisma.book.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Clear books cache
    await CacheService.clearPattern('search:type:books*');
    
    return book;
  }
  
  /**
   * Delete book
   */
  static async deleteBook(id: string) {
    const book = await prisma.book.delete({ where: { id } });
    
    // Clear books cache
    await CacheService.clearPattern('search:type:books*');
    
    return book;
  }
  
  /**
   * Get books by owner
   */
  static async getBooksByOwner(ownerId: string) {
    return prisma.book.findMany({
      where: { ownerId },
      orderBy: { updatedAt: 'desc' }
    });
  }
  
  /**
   * Build filter conditions for book queries
   */
  private static buildFilterConditions(params: SearchParams): Prisma.BookWhereInput {
    const conditions: Prisma.BookWhereInput = {};
    
    // Basic filters
    if (params.genre) {
      conditions.genre = { contains: params.genre, mode: 'insensitive' };
    }
    
    if (params.location) {
      conditions.location = { contains: params.location, mode: 'insensitive' };
    }
    
    if (params.isAvailable !== undefined) {
      conditions.isAvailable = params.isAvailable;
    }
    
    // If there's a search query, create complex conditions
    if (params.query) {
      const searchString = params.query.toLowerCase();
      conditions.OR = [
        { title: { contains: searchString, mode: 'insensitive' } },
        { author: { contains: searchString, mode: 'insensitive' } },
        { genre: { contains: searchString, mode: 'insensitive' } },
        { location: { contains: searchString, mode: 'insensitive' } }
      ];
    }
    
    return conditions;
  }
}
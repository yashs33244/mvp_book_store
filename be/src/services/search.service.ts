// src/services/search.service.ts

import { PrismaClient, Prisma } from '@prisma/client';
import { CacheService } from './cache.service';
import { SearchParams, normalizeSearchParams, buildPaginationInfo, prepareSearchTerm } from '../utils/search.utils';

const prisma = new PrismaClient();

export class SearchService {
  /**
   * Search books with complex query
   */
  static async searchBooks(params: SearchParams) {
    const normalizedParams = normalizeSearchParams(params);
    const { query, page = 1, limit = 20 } = normalizedParams;
    const skip = (page - 1) * limit;
    
    // Check cache first
    const cacheKey = CacheService.createSearchKey({
      type: 'search',
      ...normalizedParams
    });
    
    const cachedResult = await CacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Build search conditions
    const where = this.buildSearchConditions(normalizedParams);
    
    // Execute search
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
        orderBy: [
          { updatedAt: 'desc' },
          { title: 'asc' }
        ]
      }),
      prisma.book.count({ where })
    ]);
    
    const result = {
      books,
      query,
      filters: {
        genre: normalizedParams.genre,
        location: normalizedParams.location,
        isAvailable: normalizedParams.isAvailable
      },
      pagination: buildPaginationInfo(total, normalizedParams)
    };
    
    // Cache results
    await CacheService.set(cacheKey, result);
    
    return result;
  }
  
  /**
   * Build search conditions including full-text search and filters
   */
  private static buildSearchConditions(params: SearchParams): Prisma.BookWhereInput {
    const conditions: Prisma.BookWhereInput = {};
    const searchCriteria: Prisma.BookWhereInput[] = [];
    
    // Add text search if query exists
    if (params.query) {
      const searchString = params.query.toLowerCase();
      
      // Full text search (using 'OR' to match any field)
      searchCriteria.push({
        OR: [
          { title: { contains: searchString, mode: 'insensitive' } },
          { author: { contains: searchString, mode: 'insensitive' } },
          { genre: { contains: searchString, mode: 'insensitive' } },
          { location: { contains: searchString, mode: 'insensitive' } }
        ]
      });
    }
    
    // Add filters
    if (params.genre) {
      searchCriteria.push({ genre: { contains: params.genre, mode: 'insensitive' } });
    }
    
    if (params.location) {
      searchCriteria.push({ location: { contains: params.location, mode: 'insensitive' } });
    }
    
    if (params.isAvailable !== undefined) {
      searchCriteria.push({ isAvailable: params.isAvailable });
    }
    
    // Combine all search criteria with AND
    if (searchCriteria.length > 0) {
      conditions.AND = searchCriteria;
    }
    
    return conditions;
  }
}
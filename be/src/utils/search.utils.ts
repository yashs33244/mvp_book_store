/**
 * Type for search/filter parameters
 */
export interface SearchParams {
    query?: string;
    genre?: string;
    location?: string;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
  }
  
  /**
   * Validate and normalize search parameters
   */
  export function normalizeSearchParams(params: Record<string, any>): SearchParams {
    const normalized: SearchParams = {
      page: Math.max(1, Number(params.page) || 1),
      limit: Math.min(100, Math.max(1, Number(params.limit) || 20))
    };
  
    // Process query string
    if (params.query && typeof params.query === 'string') {
      normalized.query = params.query.trim();
    }
  
    // Process genre (skip "all" value)
    if (params.genre && typeof params.genre === 'string' && params.genre !== 'all') {
      normalized.genre = params.genre.trim();
    }
  
    // Process location
    if (params.location && typeof params.location === 'string') {
      normalized.location = params.location.trim();
    }
  
    // Process availability status
    if (params.isAvailable !== undefined) {
      normalized.isAvailable = params.isAvailable === 'true' || params.isAvailable === true;
    }
  
    return normalized;
  }
  
  /**
   * Build pagination response information
   */
  export function buildPaginationInfo(total: number, params: SearchParams) {
    const { page = 1, limit = 20 } = params;
    
    return {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit)
    };
  }
  
  /**
   * Convert search term to search-friendly format
   */
  export function prepareSearchTerm(term: string): string {
    // Remove special characters
    const cleanedTerm = term
      .replace(/[^\w\s]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!cleanedTerm) return '';
    
    // Split terms and join with & for PostgreSQL tsquery
    return cleanedTerm
      .split(' ')
      .filter(Boolean)
      .map(word => word + ':*')
      .join(' & ');
  }
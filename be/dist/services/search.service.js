"use strict";
// src/services/search.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const client_1 = require("@prisma/client");
const cache_service_1 = require("./cache.service");
const search_utils_1 = require("../utils/search.utils");
const prisma = new client_1.PrismaClient();
class SearchService {
    /**
     * Search books with complex query
     */
    static searchBooks(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedParams = (0, search_utils_1.normalizeSearchParams)(params);
            const { query, page = 1, limit = 20 } = normalizedParams;
            const skip = (page - 1) * limit;
            // Check cache first
            const cacheKey = cache_service_1.CacheService.createSearchKey(Object.assign({ type: 'search' }, normalizedParams));
            const cachedResult = yield cache_service_1.CacheService.get(cacheKey);
            if (cachedResult) {
                return cachedResult;
            }
            // Build search conditions
            const where = this.buildSearchConditions(normalizedParams);
            // Execute search
            const [books, total] = yield Promise.all([
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
                pagination: (0, search_utils_1.buildPaginationInfo)(total, normalizedParams)
            };
            // Cache results
            yield cache_service_1.CacheService.set(cacheKey, result);
            return result;
        });
    }
    /**
     * Build search conditions including full-text search and filters
     */
    static buildSearchConditions(params) {
        const conditions = {};
        const searchCriteria = [];
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
exports.SearchService = SearchService;

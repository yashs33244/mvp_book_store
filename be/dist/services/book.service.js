"use strict";
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
exports.BookService = void 0;
// src/services/book.service.ts
const client_1 = require("@prisma/client");
const search_utils_1 = require("../utils/search.utils");
const cache_service_1 = require("./cache.service");
const prisma = new client_1.PrismaClient();
class BookService {
    /**
     * Get books with pagination and filtering
     */
    static getBooks(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedParams = (0, search_utils_1.normalizeSearchParams)(params);
            const filterConditions = this.buildFilterConditions(normalizedParams);
            // Get total count first
            const total = yield prisma.book.count({ where: filterConditions });
            const paginationInfo = (0, search_utils_1.buildPaginationInfo)(total, normalizedParams);
            const skip = (paginationInfo.currentPage - 1) * paginationInfo.pageSize;
            const take = paginationInfo.pageSize;
            // Check cache first
            const cacheKey = cache_service_1.CacheService.createSearchKey(Object.assign(Object.assign({ type: 'books' }, normalizedParams), { skip,
                take }));
            const cachedResult = yield cache_service_1.CacheService.get(cacheKey);
            if (cachedResult) {
                return cachedResult;
            }
            // Get books from database
            const books = yield prisma.book.findMany({
                where: filterConditions,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            const result = { books, total };
            // Cache the result
            yield cache_service_1.CacheService.set(cacheKey, result, 300);
            return result;
        });
    }
    /**
     * Get book by ID
     */
    static getBookById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('BookService.getBookById called with id:', id);
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
        });
    }
    /**
     * Create new book
     */
    static createBook(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('BookService.createBook called with data:', JSON.stringify(data));
            const book = yield prisma.book.create({
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
            console.log('Book created successfully:', book.id);
            // Clear books cache
            yield cache_service_1.CacheService.clearPattern('search:type:books*');
            console.log('Cache cleared for books');
            return book;
        });
    }
    /**
     * Update book
     */
    static updateBook(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('BookService.updateBook called with id:', id, 'data:', JSON.stringify(data));
            const book = yield prisma.book.update({
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
            console.log('Book updated successfully:', book.id);
            // Clear books cache
            yield cache_service_1.CacheService.clearPattern('search:type:books*');
            console.log('Cache cleared for books');
            return book;
        });
    }
    /**
     * Delete book
     */
    static deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('BookService.deleteBook called with id:', id);
            const book = yield prisma.book.delete({ where: { id } });
            console.log('Book deleted successfully:', book.id);
            // Clear books cache
            yield cache_service_1.CacheService.clearPattern('search:type:books*');
            console.log('Cache cleared for books');
            return book;
        });
    }
    /**
     * Get books by owner
     */
    static getBooksByOwner(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('BookService.getBooksByOwner called with ownerId:', ownerId);
            const books = yield prisma.book.findMany({
                where: { ownerId },
                orderBy: { updatedAt: 'desc' }
            });
            console.log('Found', books.length, 'books for owner:', ownerId);
            return books;
        });
    }
    /**
     * Build filter conditions for book queries
     */
    static buildFilterConditions(params) {
        const conditions = {};
        const searchCriteria = [];
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
exports.BookService = BookService;

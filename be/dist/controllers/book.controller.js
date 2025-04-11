"use strict";
// src/controllers/book.controller.ts
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
exports.BookController = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    author: zod_1.z.string().min(1),
    genre: zod_1.z.string().optional(),
    location: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().optional(),
    imageKey: zod_1.z.string().optional(),
});
class BookController {
    /**
     * Get all books with filtering
     */
    static listBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all query parameters
                const { title, author, query, location, genre, isAvailable, page, limit } = req.query;
                const where = {};
                // Handle general search query parameter
                if (query) {
                    where.OR = [
                        { title: { contains: query, mode: 'insensitive' } },
                        { author: { contains: query, mode: 'insensitive' } },
                        { genre: { contains: query, mode: 'insensitive' } },
                    ];
                }
                else {
                    // If no general query, apply specific filters
                    if (title)
                        where.title = { contains: title, mode: 'insensitive' };
                    if (author)
                        where.author = { contains: author, mode: 'insensitive' };
                }
                // Apply these filters regardless of whether query is present
                if (location)
                    where.location = { contains: location, mode: 'insensitive' };
                if (genre && genre !== 'all')
                    where.genre = { contains: genre, mode: 'insensitive' };
                if (isAvailable !== undefined) {
                    where.isAvailable = isAvailable === 'true';
                }
                // Parse pagination parameters
                const currentPage = page ? parseInt(page, 10) : 1;
                const pageSize = limit ? parseInt(limit, 10) : 10;
                const skip = (currentPage - 1) * pageSize;
                // Get total count
                const total = yield prisma.book.count({ where });
                // Get books
                const books = yield prisma.book.findMany({
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
            }
            catch (error) {
                console.error('Error listing books:', error);
                if (res) {
                    res.status(500).json({ message: 'Internal server error' });
                }
                throw error;
            }
        });
    }
    /**
     * Get single book by ID
     */
    static getBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield prisma.book.findUnique({
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
            }
            catch (error) {
                console.error('Error getting book:', error);
                if (res) {
                    res.status(500).json({ message: 'Internal server error' });
                }
                throw error;
            }
        });
    }
    /**
     * Create a new book
     */
    static createBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, author, genre, location, imageUrl, imageKey } = bookSchema.parse(req.body);
                const book = yield prisma.book.create({
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
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
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
        });
    }
    /**
     * Update a book
     */
    static updateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, author, genre, location, isAvailable, imageUrl, imageKey } = req.body;
                const book = yield prisma.book.findUnique({
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
                const updatedBook = yield prisma.book.update({
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
            }
            catch (error) {
                console.error('Error updating book:', error);
                if (res) {
                    res.status(500).json({ message: 'Internal server error' });
                }
                throw error;
            }
        });
    }
    /**
     * Delete a book
     */
    static deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield prisma.book.findUnique({
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
                const deletedBook = yield prisma.book.delete({
                    where: { id: req.params.id },
                });
                if (res) {
                    res.status(204).send();
                }
                return deletedBook;
            }
            catch (error) {
                console.error('Error deleting book:', error);
                if (res) {
                    res.status(500).json({ message: 'Internal server error' });
                }
                throw error;
            }
        });
    }
    /**
     * Get current user's books
     */
    static getUserBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id; // From auth middleware
                const books = yield prisma.book.findMany({
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
            }
            catch (error) {
                console.error('Error getting user books:', error);
                if (res) {
                    res.status(500).json({ message: 'Failed to retrieve user books' });
                }
                throw error;
            }
        });
    }
}
exports.BookController = BookController;

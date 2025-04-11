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
                const { title, location, genre } = req.query;
                const where = {};
                if (title)
                    where.title = { contains: title, mode: 'insensitive' };
                if (location)
                    where.location = { contains: location, mode: 'insensitive' };
                if (genre)
                    where.genre = { contains: genre, mode: 'insensitive' };
                const books = yield prisma.book.findMany({
                    where,
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
                res.json(books);
            }
            catch (error) {
                console.error('Error listing books:', error);
                res.status(500).json({ message: 'Internal server error' });
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
                    return res.status(404).json({ message: 'Book not found' });
                }
                res.json(book);
            }
            catch (error) {
                console.error('Error getting book:', error);
                res.status(500).json({ message: 'Internal server error' });
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
                res.status(201).json(book);
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return res.status(400).json({ message: error.errors });
                }
                console.error('Error creating book:', error);
                res.status(500).json({ message: 'Internal server error' });
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
                    return res.status(404).json({ message: 'Book not found' });
                }
                if (book.ownerId !== req.user.id) {
                    return res.status(403).json({ message: 'Not authorized to update this book' });
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
                res.json(updatedBook);
            }
            catch (error) {
                console.error('Error updating book:', error);
                res.status(500).json({ message: 'Internal server error' });
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
                    return res.status(404).json({ message: 'Book not found' });
                }
                if (book.ownerId !== req.user.id) {
                    return res.status(403).json({ message: 'Not authorized to delete this book' });
                }
                yield prisma.book.delete({
                    where: { id: req.params.id },
                });
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting book:', error);
                res.status(500).json({ message: 'Internal server error' });
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
                res.status(200).json({ books });
            }
            catch (error) {
                console.error('Error getting user books:', error);
                res.status(500).json({ message: 'Failed to retrieve user books' });
            }
        });
    }
}
exports.BookController = BookController;

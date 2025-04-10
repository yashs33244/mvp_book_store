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
exports.bookRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
exports.bookRouter = router;
const prisma = new client_1.PrismaClient();
const bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    author: zod_1.z.string().min(1),
    genre: zod_1.z.string().optional(),
    location: zod_1.z.string().min(1),
});
// Create a new book listing
router.post('/', auth_middleware_1.authenticateToken, auth_middleware_1.isOwner, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genre, location } = bookSchema.parse(req.body);
        const book = yield prisma.book.create({
            data: {
                title,
                author,
                genre,
                location,
                ownerId: req.user.id,
            },
        });
        res.status(201).json(book);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Get all books
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Get a specific book
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Update a book
router.put('/:id', auth_middleware_1.authenticateToken, auth_middleware_1.isOwner, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genre, location, isAvailable } = req.body;
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
            },
        });
        res.json(updatedBook);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Delete a book
router.delete('/:id', auth_middleware_1.authenticateToken, auth_middleware_1.isOwner, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(500).json({ message: 'Internal server error' });
    }
}));

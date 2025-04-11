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
const book_service_1 = require("../services/book.service");
class BookController {
    /**
     * Get all books with filtering
     */
    static listBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const books = yield book_service_1.BookService.getBooks(req.query);
                res.status(200).json(books);
            }
            catch (error) {
                console.error('Error listing books:', error);
                res.status(500).json({ message: 'Failed to retrieve books' });
            }
        });
    }
    /**
     * Get single book by ID
     */
    static getBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = JSON.stringify(req.params.id);
                if (!id) {
                    return res.status(400).json({ message: 'Invalid book ID' });
                }
                const book = yield book_service_1.BookService.getBookById(id);
                if (!book) {
                    return res.status(404).json({ message: 'Book not found' });
                }
                res.status(200).json(book);
            }
            catch (error) {
                console.error('Error getting book:', error);
                res.status(500).json({ message: 'Failed to retrieve book' });
            }
        });
    }
    /**
     * Create a new book
     */
    static createBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, author, genre, location, coverImageUrl, contactInfo } = req.body;
                const userId = req.user.id; // From auth middleware
                // Validate required fields
                if (!title || !author || !location || !contactInfo) {
                    return res.status(400).json({
                        message: 'Required fields missing: title, author, location, and contactInfo are required'
                    });
                }
                const book = yield book_service_1.BookService.createBook({
                    title,
                    author,
                    genre,
                    location,
                    isAvailable: true,
                    owner: { connect: { id: userId } }
                });
                res.status(201).json(book);
            }
            catch (error) {
                console.error('Error creating book:', error);
                res.status(500).json({ message: 'Failed to create book' });
            }
        });
    }
    /**
     * Update a book
     */
    static updateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = JSON.stringify(req.params.id);
                const userId = req.user.id; // From auth middleware
                if (!(id)) {
                    return res.status(400).json({ message: 'Invalid book ID' });
                }
                // Check if book exists and belongs to user
                const existingBook = yield book_service_1.BookService.getBookById(id);
                if (!existingBook) {
                    return res.status(404).json({ message: 'Book not found' });
                }
                if (existingBook.ownerId !== userId) {
                    return res.status(403).json({ message: 'You do not have permission to update this book' });
                }
                const { title, author, genre, location, coverImageUrl, contactInfo, isAvailable } = req.body;
                const updatedBook = yield book_service_1.BookService.updateBook(id, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (author && { author })), (genre !== undefined && { genre })), (location && { location })), (coverImageUrl !== undefined && { coverImageUrl })), (contactInfo && { contactInfo })), (isAvailable !== undefined && { isAvailable })));
                res.status(200).json(updatedBook);
            }
            catch (error) {
                console.error('Error updating book:', error);
                res.status(500).json({ message: 'Failed to update book' });
            }
        });
    }
    /**
     * Delete a book
     */
    static deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = JSON.stringify(req.params.id);
                const userId = req.user.id; // From auth middleware
                if (!(id)) {
                    return res.status(400).json({ message: 'Invalid book ID' });
                }
                // Check if book exists and belongs to user
                const existingBook = yield book_service_1.BookService.getBookById(id);
                if (!existingBook) {
                    return res.status(404).json({ message: 'Book not found' });
                }
                if (existingBook.ownerId !== userId) {
                    return res.status(403).json({ message: 'You do not have permission to delete this book' });
                }
                yield book_service_1.BookService.deleteBook(id);
                res.status(200).json({ message: 'Book deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting book:', error);
                res.status(500).json({ message: 'Failed to delete book' });
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
                const books = yield book_service_1.BookService.getBooksByOwner(userId);
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

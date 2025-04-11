"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const auth_middleware_1 = require("../middleware/auth.middleware");
const cache_middleware_1 = require("../middleware/cache.middleware");
const book_controller_1 = require("../controllers/book.controller");
const search_controller_1 = require("../controllers/search.controller");
const router = (0, express_1.Router)();
exports.bookRouter = router;
const prisma = new client_1.PrismaClient();
const bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    author: zod_1.z.string().min(1),
    genre: zod_1.z.string().optional(),
    location: zod_1.z.string().min(1),
});
// Public endpoints with caching
router.get('/', (req, res, next) => {
    console.log('GET /api/books - Listing books with query params:', req.query);
    (0, cache_middleware_1.cacheMiddleware)(300)(req, res, next);
}, book_controller_1.BookController.listBooks);
router.get('/:id', (req, res, next) => {
    console.log('GET /api/books/:id - Getting book with id:', req.params.id);
    (0, cache_middleware_1.cacheMiddleware)(300)(req, res, next);
}, book_controller_1.BookController.getBook);
router.get('/search', (req, res, next) => {
    console.log('GET /api/books/search - Searching books with query params:', req.query);
    (0, cache_middleware_1.cacheMiddleware)(300)(req, res, next);
}, search_controller_1.SearchController.searchBooks);
// Protected endpoints
router.post('/', auth_middleware_1.authenticateToken, (req, res, next) => {
    console.log('POST /api/books - Creating book with data:', req.body);
    (0, cache_middleware_1.clearCache)('search:*')(req, res, next);
}, book_controller_1.BookController.createBook);
router.put('/:id', auth_middleware_1.authenticateToken, (req, res, next) => {
    console.log('PUT /api/books/:id - Updating book with id:', req.params.id, 'data:', req.body);
    (0, cache_middleware_1.clearCache)('search:*')(req, res, next);
}, book_controller_1.BookController.updateBook);
router.delete('/:id', auth_middleware_1.authenticateToken, (req, res, next) => {
    console.log('DELETE /api/books/:id - Deleting book with id:', req.params.id);
    (0, cache_middleware_1.clearCache)('search:*')(req, res, next);
}, book_controller_1.BookController.deleteBook);

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
const cache_middleware_1 = require("../middleware/cache.middleware");
const book_controller_1 = require("../controllers/book.controller");
const search_controller_1 = require("../controllers/search.controller");
const s3_service_1 = require("../services/s3.service");
const router = (0, express_1.Router)();
exports.bookRouter = router;
const prisma = new client_1.PrismaClient();
const bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    author: zod_1.z.string().min(1),
    genre: zod_1.z.string().optional(),
    location: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().optional(),
    imageKey: zod_1.z.string().optional(),
});
// File upload schema
const fileUploadSchema = zod_1.z.object({
    fileType: zod_1.z.string().refine((type) => type.startsWith('image/'), { message: 'Only image files are allowed' })
});
// Initialize S3 service
s3_service_1.S3Service.initialize();
// Get presigned URL for image upload
router.post('/upload-url', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('POST /api/books/upload-url - Generating upload URL with fileType:', req.body.fileType);
        // Validate request body
        const validationResult = fileUploadSchema.safeParse(req.body);
        if (!validationResult.success) {
            console.error('Validation error:', validationResult.error);
            return res.status(400).json({
                message: 'Invalid request data',
                errors: validationResult.error.errors
            });
        }
        const { fileType } = validationResult.data;
        // Check if S3 service is properly initialized
        if (!s3_service_1.S3Service.isInitialized()) {
            console.error('S3 service not initialized');
            return res.status(500).json({
                message: 'S3 service not available. Please check server configuration.'
            });
        }
        const { uploadUrl, key } = yield s3_service_1.S3Service.generateUploadUrl(fileType);
        console.log('Generated upload URL successfully for key:', key);
        res.json({ uploadUrl, key });
    }
    catch (error) {
        console.error('Error generating upload URL:', error);
        // Provide more detailed error message if available
        const errorMessage = error instanceof Error
            ? error.message
            : 'Error generating upload URL';
        res.status(500).json({ message: errorMessage });
    }
}));
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

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken, isOwner } from '../middleware/auth.middleware';
import { cacheMiddleware, clearCache } from '../middleware/cache.middleware';
import { BookController } from '../controllers/book.controller';
import { SearchController } from '../controllers/search.controller';
import { S3Service } from '../services/s3.service';

const router = Router();
const prisma = new PrismaClient();

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().optional(),
  location: z.string().min(1),
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
});

// Initialize S3 service
S3Service.initialize();

// Get presigned URL for image upload
router.post('/upload-url', authenticateToken, async (req, res) => {
  try {
    const { fileType } = req.body;
    if (!fileType) {
      return res.status(400).json({ message: 'File type is required' });
    }

    const { uploadUrl, key } = await S3Service.generateUploadUrl(fileType);
    res.json({ uploadUrl, key });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ message: 'Error generating upload URL' });
  }
});

// Public endpoints with caching
router.get('/', (req, res, next) => {
  console.log('GET /api/books - Listing books with query params:', req.query);
  cacheMiddleware(300)(req, res, next);
}, BookController.listBooks);

router.get('/:id', (req, res, next) => {
  console.log('GET /api/books/:id - Getting book with id:', req.params.id);
  cacheMiddleware(300)(req, res, next);
}, BookController.getBook);

router.get('/search', (req, res, next) => {
  console.log('GET /api/books/search - Searching books with query params:', req.query);
  cacheMiddleware(300)(req, res, next);
}, SearchController.searchBooks);

// Protected endpoints
router.post('/', authenticateToken, (req, res, next) => {
  console.log('POST /api/books - Creating book with data:', req.body);
  clearCache('search:*')(req, res, next);
}, BookController.createBook);

router.put('/:id', authenticateToken, (req, res, next) => {
  console.log('PUT /api/books/:id - Updating book with id:', req.params.id, 'data:', req.body);
  clearCache('search:*')(req, res, next);
}, BookController.updateBook);

router.delete('/:id', authenticateToken, (req, res, next) => {
  console.log('DELETE /api/books/:id - Deleting book with id:', req.params.id);
  clearCache('search:*')(req, res, next);
}, BookController.deleteBook);

// // Create a new book listing
// router.post('/', authenticateToken, isOwner, async (req, res) => {
//   try {
//     const { title, author, genre, location } = bookSchema.parse(req.body);

//     const book = await prisma.book.create({
//       data: {
//         title,
//         author,
//         genre,
//         location,
//         ownerId: req.user.id,
//       },
//     });

//     res.status(201).json(book);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ message: error.errors });
//     }
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Get all books
// router.get('/', async (req, res) => {
//   try {
//     const { title, location, genre } = req.query;
    
//     const where: any = {};
//     if (title) where.title = { contains: title as string, mode: 'insensitive' };
//     if (location) where.location = { contains: location as string, mode: 'insensitive' };
//     if (genre) where.genre = { contains: genre as string, mode: 'insensitive' };

//     const books = await prisma.book.findMany({
//       where,
//       include: {
//         owner: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             mobile: true,
//           },
//         },
//       },
//     });

//     res.json(books);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Get a specific book
// router.get('/:id', async (req, res) => {
//   try {
//     const book = await prisma.book.findUnique({
//       where: { id: req.params.id },
//       include: {
//         owner: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             mobile: true,
//           },
//         },
//       },
//     });

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     res.json(book);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Update a book
// router.put('/:id', authenticateToken, isOwner, async (req, res) => {
//   try {
//     const { title, author, genre, location, isAvailable } = req.body;

//     const book = await prisma.book.findUnique({
//       where: { id: req.params.id },
//     });

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     if (book.ownerId !== req.user.id) {
//       return res.status(403).json({ message: 'Not authorized to update this book' });
//     }

//     const updatedBook = await prisma.book.update({
//       where: { id: req.params.id },
//       data: {
//         title,
//         author,
//         genre,
//         location,
//         isAvailable,
//       },
//     });

//     res.json(updatedBook);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Delete a book
// router.delete('/:id', authenticateToken, isOwner, async (req, res) => {
//   try {
//     const book = await prisma.book.findUnique({
//       where: { id: req.params.id },
//     });

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     if (book.ownerId !== req.user.id) {
//       return res.status(403).json({ message: 'Not authorized to delete this book' });
//     }

//     await prisma.book.delete({
//       where: { id: req.params.id },
//     });

//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

export { router as bookRouter }; 
import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Book Endpoints', () => {
  let ownerToken: string;
  let bookId: string;

  beforeAll(async () => {
    // Create a test owner user
    const ownerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'owner@example.com',
        password: 'password123',
        name: 'Book Owner',
        mobile: '1234567890',
        role: 'OWNER',
      });

    ownerToken = ownerRes.body.token;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/books', () => {
    it('should create a new book listing', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          title: 'Test Book',
          author: 'Test Author',
          genre: 'Fiction',
          location: 'Test City',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Book');
      bookId = res.body.id;
    });

    it('should not create book without authentication', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({
          title: 'Test Book',
          author: 'Test Author',
          genre: 'Fiction',
          location: 'Test City',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/books', () => {
    it('should get all books', async () => {
      const res = await request(app).get('/api/books');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter books by title', async () => {
      const res = await request(app)
        .get('/api/books')
        .query({ title: 'Test' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].title).toContain('Test');
    });
  });

  describe('GET /api/books/:id', () => {
    it('should get a specific book', async () => {
      const res = await request(app).get(`/api/books/${bookId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', bookId);
    });

    it('should return 404 for non-existent book', async () => {
      const res = await request(app).get('/api/books/nonexistent-id');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update a book', async () => {
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          title: 'Updated Book',
          author: 'Updated Author',
          genre: 'Non-Fiction',
          location: 'Updated City',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Book');
    });

    it('should not update book without authentication', async () => {
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .send({
          title: 'Updated Book',
          author: 'Updated Author',
          genre: 'Non-Fiction',
          location: 'Updated City',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete a book', async () => {
      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(204);
    });

    it('should not delete book without authentication', async () => {
      const res = await request(app).delete(`/api/books/${bookId}`);

      expect(res.status).toBe(401);
    });
  });
}); 
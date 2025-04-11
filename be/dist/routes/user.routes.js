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
exports.userRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const auth_middleware_1 = require("../middleware/auth.middleware");
const book_controller_1 = require("../controllers/book.controller");
const router = (0, express_1.Router)();
exports.userRouter = router;
const prisma = new client_1.PrismaClient();
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    mobile: zod_1.z.string().min(10).optional(),
});
// Get user profile
router.get('/profile', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('GET /api/users/profile - Getting profile for user:', req.user.id);
    try {
        const user = yield prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                mobile: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User profile retrieved successfully:', user.id);
        res.json(user);
    }
    catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Update user profile
router.put('/profile', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('PUT /api/users/profile - Updating profile for user:', req.user.id, 'data:', req.body);
    try {
        const { name, mobile } = updateUserSchema.parse(req.body);
        const updatedUser = yield prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                mobile,
            },
            select: {
                id: true,
                email: true,
                name: true,
                mobile: true,
                role: true,
                createdAt: true,
            },
        });
        console.log('User profile updated successfully:', updatedUser.id);
        res.json(updatedUser);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error('Validation error updating user profile:', error.errors);
            return res.status(400).json({ message: error.errors });
        }
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
router.get('/books', auth_middleware_1.authenticateToken, (req, res) => {
    console.log('GET /api/users/books - Getting books for user:', req.user.id);
    book_controller_1.BookController.getUserBooks(req, res);
});

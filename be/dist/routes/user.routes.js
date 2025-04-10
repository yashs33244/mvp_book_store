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
const router = (0, express_1.Router)();
exports.userRouter = router;
const prisma = new client_1.PrismaClient();
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    mobile: zod_1.z.string().min(10).optional(),
});
// Get user profile
router.get('/profile', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Update user profile
router.put('/profile', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.json(updatedUser);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Get user's books (for owners)
router.get('/books', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield prisma.book.findMany({
            where: { ownerId: req.user.id },
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

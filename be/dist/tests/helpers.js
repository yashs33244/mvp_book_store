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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePrismaConnection = exports.createTestUser = exports.cleanupDatabase = exports.generateTestToken = exports.testUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
// Load test environment variables
(0, dotenv_1.config)({ path: '.env.test' });
const prisma = new client_1.PrismaClient();
// Test user fixture
exports.testUser = {
    email: 'test@example.com',
    password: 'Test123!',
    name: 'Test User',
};
// Generate test JWT token
const generateTestToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.generateTestToken = generateTestToken;
// Clean up test database
const cleanupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const tables = ['User', 'Post', 'Comment'];
    for (const table of tables) {
        yield prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    }
});
exports.cleanupDatabase = cleanupDatabase;
// Create test user
const createTestUser = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.create({
        data: exports.testUser,
    });
});
exports.createTestUser = createTestUser;
// Close Prisma connection
const closePrismaConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
});
exports.closePrismaConnection = closePrismaConnection;

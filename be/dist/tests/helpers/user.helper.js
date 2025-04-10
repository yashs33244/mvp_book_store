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
exports.deleteTestUser = exports.createTestUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const createTestUser = (prisma) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash('password123', 10);
    return prisma.user.create({
        data: {
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User',
        },
    });
});
exports.createTestUser = createTestUser;
const deleteTestUser = (prisma, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.delete({
        where: { id: userId },
    });
});
exports.deleteTestUser = deleteTestUser;

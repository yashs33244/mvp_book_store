"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = require("./routes/user.routes");
const book_routes_1 = require("./routes/book.routes");
const auth_routes_1 = require("./routes/auth.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.authRouter);
app.use('/api/users', user_routes_1.userRouter);
app.use('/api/books', book_routes_1.bookRouter);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

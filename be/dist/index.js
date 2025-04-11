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
const redis_config_1 = require("./config/redis.config");
const health_routes_1 = require("./routes/health.routes");
const error_middleware_1 = require("./middleware/error.middleware");
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 3001;
// Security middleware
// Logging middleware
app.use((0, morgan_1.default)('dev'));
// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/health", health_routes_1.healthRoutes);
app.use('/api/auth', auth_routes_1.authRouter);
app.use('/api/users', user_routes_1.userRouter);
app.use('/api/books', book_routes_1.bookRouter);
// Error handling middleware
app.use(error_middleware_1.errorHandler);
app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.json({ status: 'ok' });
});
// Only start the server if this file is run directly
if (require.main === module) {
    // Initialize Redis before starting the server
    (0, redis_config_1.connectToRedis)()
        .then(() => {
        console.log('Redis connected successfully');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
        .catch(err => {
        console.error('Failed to initialize Redis:', err);
        // Start the server anyway, but with a warning
        app.listen(port, () => {
            console.log(`Server is running on port ${port} (Redis connection failed)`);
        });
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.UnauthorizedError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(errors) {
        super('Validation Error');
        this.errors = errors;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof ValidationError) {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors,
        });
    }
    if (err instanceof UnauthorizedError) {
        return res.status(401).json({
            message: err.message,
        });
    }
    // Default error
    return res.status(500).json({
        message: 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;

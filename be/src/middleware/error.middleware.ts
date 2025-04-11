import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class ValidationError extends Error {
  constructor(public errors: any[]) {
    super('Validation Error');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { ZodError } from 'zod';
import AppError from '../../../errors/AppError';

export default function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): Response {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation failed',

      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    message: 'Internal server error',
  });
}